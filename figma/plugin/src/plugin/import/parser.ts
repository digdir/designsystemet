export function flattenTokens(
  node: unknown,
  parts: string[] = [],
): Array<{
  path: string;
  type: string | null;
  value: unknown;
  description: string | null;
}> {
  const tokens: Array<{
    path: string;
    type: string | null;
    value: unknown;
    description: string | null;
  }> = [];

  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    return tokens;
  }

  if (Object.hasOwn(node, '$value')) {
    const tokenNode = node as {
      $type?: string;
      $value: unknown;
      $description?: string;
    };

    tokens.push({
      path: parts.join('.'),
      type: tokenNode.$type || null,
      value: tokenNode.$value,
      description: tokenNode.$description || null,
    });
    return tokens;
  }

  for (const key of Object.keys(node)) {
    if (key.charAt(0) === '$') {
      continue;
    }

    const childTokens = flattenTokens(
      (node as Record<string, unknown>)[key],
      parts.concat(key),
    );
    for (const token of childTokens) {
      tokens.push(token);
    }
  }

  return tokens;
}

export function findReferences(value: unknown): string[] {
  const references = new Set<string>();
  collectReferences(value, references);
  return Array.from(references);
}

function collectReferences(value: unknown, references: Set<string>): void {
  if (typeof value === 'string') {
    const pattern = /\{([^}]+)\}/g;
    let match = pattern.exec(value);

    while (match) {
      references.add(match[1]);
      match = pattern.exec(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectReferences(item, references);
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectReferences(item, references);
    }
  }
}
