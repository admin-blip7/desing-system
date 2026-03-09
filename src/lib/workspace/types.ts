// Basic types shared across workspaces
import { BrandTokens } from "@/lib/design-tokens/types";

export interface WorkspaceContentProps<T = any> {
    data: T | null;
    status: string;
    saveModule: (content: T) => Promise<boolean>;
    updateStatus: (newStatus: string) => Promise<boolean>;
    brandTokens: BrandTokens;
    readOnly?: boolean;
}

export interface BaseWorkspaceProps {
    brandId: string;
    moduleKey: string;
    moduleName: string;
    children: (props: WorkspaceContentProps) => React.ReactNode;
}

export type WorkspaceRoute = {
    path: string;
    label: string;
    icon?: React.ElementType;
};

// Placeholder for now, can be expanded as needed
export interface WorkspaceConfig {
    key: string;
    path: string;
    component: React.ComponentType<any>;
}
