import { Question } from "@/lib/data/onboarding";

type AnswersMap = Record<string, unknown>;

function normalize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function splitOptions(raw: string) {
  return raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item)).filter(Boolean);
  }

  if (value === null || value === undefined) {
    return [];
  }

  const asText = normalize(value);
  return asText ? [asText] : [];
}

function matchesExpected(value: unknown, expected: string[]) {
  const actualValues = toStringList(value);
  const expectedValues = expected.map((item) => normalize(item)).filter(Boolean);

  if (actualValues.length === 0 || expectedValues.length === 0) {
    return false;
  }

  return expectedValues.some((expectedValue) =>
    actualValues.some((actualValue) => actualValue === expectedValue),
  );
}

function parseCondition(condition: string) {
  if (condition.includes("!=")) {
    const [key, rawExpected] = condition.split("!=");
    return {
      key: key.trim(),
      operator: "!=" as const,
      expected: splitOptions(rawExpected || ""),
    };
  }

  if (condition.includes("=")) {
    const [key, rawExpected] = condition.split("=");
    return {
      key: key.trim(),
      operator: "=" as const,
      expected: splitOptions(rawExpected || ""),
    };
  }

  return null;
}

export function isQuestionVisible(question: Question, answers: AnswersMap) {
  if (!question.condition) {
    return true;
  }

  const parsed = parseCondition(question.condition);
  if (!parsed) {
    return true;
  }

  const currentValue = answers[parsed.key];
  const doesMatch = matchesExpected(currentValue, parsed.expected);

  return parsed.operator === "=" ? doesMatch : !doesMatch;
}

interface MissingQuestionOptions {
  requireAll?: boolean;
}

export function isMissingRequiredAnswer(
  question: Question,
  answers: AnswersMap,
  options: MissingQuestionOptions = {},
) {
  const isRequired = options.requireAll ? true : Boolean(question.required);
  if (!isRequired) {
    return false;
  }

  if (!isQuestionVisible(question, answers)) {
    return false;
  }

  const value = answers[question.key];

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "number") {
    return Number.isNaN(value);
  }

  return value === null || value === undefined || String(value).trim().length === 0;
}

export function getMissingRequiredQuestions(
  questions: Question[],
  answers: AnswersMap,
  options: MissingQuestionOptions = {},
) {
  return questions.filter((question) => isMissingRequiredAnswer(question, answers, options));
}
