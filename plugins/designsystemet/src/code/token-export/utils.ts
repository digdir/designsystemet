export function parseJsonLike(text: string): unknown {
  return JSON.parse(stripJsonComments(text))
}

export function stripJsonComments(text: string): string {
  let result = ''
  let inString = false
  let quote = ''
  let escaped = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inString) {
      result += char

      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        inString = false
      }

      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      result += char
      continue
    }

    if (char === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') {
        i += 1
      }
      result += '\n'
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
        i += 1
      }
      i += 1
      continue
    }

    result += char
  }

  return result
}

export function isMetaFile(path: string): boolean {
  const fileName = path.split('/').pop()
  return Boolean(fileName && fileName.charAt(0) === '$')
}

export function toTokenSetPath(path: string): string {
  return path.replace(/\.(jsonc?|JSONC?)$/, '')
}

export function getRelativePath(file: { webkitRelativePath?: string; name: string }): string {
  return file.webkitRelativePath || file.name
}

export function normalizePath(path: string): string {
  const normalized = path.replace(/\\/g, '/')
  const parts = normalized.split('/').filter(Boolean)

  if (parts.length > 1) {
    return parts.slice(1).join('/')
  }

  return normalized
}

export function detectRootName(
  files: Array<{ webkitRelativePath?: string; path?: string; name?: string }>,
): string | null {
  const first = files[0]
  if (!first) {
    return null
  }

  const raw = first.webkitRelativePath || first.path || first.name
  if (!raw) {
    return null
  }

  const parts = raw.replace(/\\/g, '/').split('/').filter(Boolean)
  return parts.length > 1 ? parts[0] : null
}

export function countBy(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const value of values) {
    counts[value] = (counts[value] || 0) + 1
  }

  return counts
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}

export function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const number = Number(value.replace(/px|%/g, ''))
  return isFinite(number) ? number : null
}

export function toCssColor(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return value
  }

  if (/^rgba?\(/i.test(value)) {
    return value
  }

  return null
}

export function readableTextColor(color: string | null): string {
  const rgb = parseCssColor(color)
  if (!rgb) {
    return '#111111'
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.58 ? '#111111' : '#ffffff'
}

function parseCssColor(color: string | null): { r: number; g: number; b: number } | null {
  if (!color || color.charAt(0) !== '#') {
    return null
  }

  let hex = color.slice(1)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  if (hex.length < 6) {
    return null
  }

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}
