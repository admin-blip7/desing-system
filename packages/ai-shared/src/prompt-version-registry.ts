import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AgentId,
  PromptTemplateVersionRecord,
  PromptTemplateVersionSeed,
  PromptVersionRegistry,
} from "./types";
import { promptTemplateVersionSeedSchema } from "./schemas";
import { ValidationError } from "./errors";

interface PromptRegistryPayload {
  versions: PromptTemplateVersionRecord[];
}

function calculateChecksum(seed: PromptTemplateVersionSeed): string {
  const serialized = JSON.stringify(seed);
  return createHash("sha256").update(serialized).digest("hex");
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class FilePromptVersionRegistry implements PromptVersionRegistry {
  private readonly filePath: string;
  private readonly versions = new Map<string, PromptTemplateVersionRecord>();
  private hydrated = false;
  private queue: Promise<void> = Promise.resolve();

  constructor(filePath = ".tmp/prompt-registry.json") {
    this.filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }

  private buildKey(brandId: string, moduleId: string, version: string): string {
    return `${brandId}::${moduleId}::${version}`;
  }

  private async hydrate(): Promise<void> {
    if (this.hydrated) {
      return;
    }

    try {
      const content = await readFile(this.filePath, "utf-8");
      const payload = JSON.parse(content) as PromptRegistryPayload;

      for (const record of payload.versions || []) {
        const key = this.buildKey(record.brandId, record.moduleId, record.version);
        this.versions.set(key, record);
      }
    } catch {
      // Ignore missing file or malformed content.
    }

    this.hydrated = true;
  }

  private persist(): Promise<void> {
    this.queue = this.queue.then(async () => {
      const payload: PromptRegistryPayload = {
        versions: [...this.versions.values()],
      };

      const dir = path.dirname(this.filePath);
      await mkdir(dir, { recursive: true });
      await writeFile(this.filePath, JSON.stringify(payload, null, 2), "utf-8");
    });

    return this.queue;
  }

  async ensureTemplateVersion(seed: PromptTemplateVersionSeed): Promise<PromptTemplateVersionRecord> {
    await this.hydrate();

    const parsed = promptTemplateVersionSeedSchema.safeParse(seed);
    if (!parsed.success) {
      throw new ValidationError("Invalid prompt template seed", {
        issues: parsed.error.flatten(),
      });
    }

    const normalized = parsed.data as PromptTemplateVersionSeed;
    const key = this.buildKey(normalized.brandId, normalized.moduleId, normalized.version);
    const existing = this.versions.get(key);

    const now = new Date().toISOString();
    if (existing) {
      const updated: PromptTemplateVersionRecord = {
        ...existing,
        ...normalized,
        checksum: calculateChecksum(normalized),
        updatedAt: now,
      };
      this.versions.set(key, updated);
      await this.persist();
      return clone(updated);
    }

    const hasActive = [...this.versions.values()].some(
      (item) => item.brandId === normalized.brandId && item.moduleId === normalized.moduleId && item.active
    );

    const created: PromptTemplateVersionRecord = {
      ...normalized,
      createdAt: now,
      updatedAt: now,
      checksum: calculateChecksum(normalized),
      active: !hasActive,
    };

    this.versions.set(key, created);
    await this.persist();

    return clone(created);
  }

  async getActiveTemplate(brandId: string, moduleId: AgentId): Promise<PromptTemplateVersionRecord | null> {
    await this.hydrate();

    const active = [...this.versions.values()].find(
      (item) => item.brandId === brandId && item.moduleId === moduleId && item.active
    );

    return active ? clone(active) : null;
  }

  async setActiveVersion(brandId: string, moduleId: AgentId, version: string): Promise<PromptTemplateVersionRecord> {
    await this.hydrate();

    const key = this.buildKey(brandId, moduleId, version);
    const next = this.versions.get(key);

    if (!next) {
      throw new ValidationError("Prompt version not found", {
        brandId,
        moduleId,
        version,
      });
    }

    for (const [itemKey, item] of this.versions.entries()) {
      if (item.brandId === brandId && item.moduleId === moduleId && item.active) {
        this.versions.set(itemKey, {
          ...item,
          active: false,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    const updated: PromptTemplateVersionRecord = {
      ...next,
      active: true,
      updatedAt: new Date().toISOString(),
    };

    this.versions.set(key, updated);
    await this.persist();

    return clone(updated);
  }

  async listVersions(brandId: string, moduleId: AgentId): Promise<PromptTemplateVersionRecord[]> {
    await this.hydrate();

    return [...this.versions.values()]
      .filter((item) => item.brandId === brandId && item.moduleId === moduleId)
      .sort((a, b) => (a.version > b.version ? -1 : 1))
      .map((item) => clone(item));
  }
}
