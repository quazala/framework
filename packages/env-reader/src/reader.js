function expandVariables(value, context) {
  return value.replace(/\${(\w+)}/g, (_, key) => {
    return context[key] || process.env[key] || '';
  });
}

function trimAndRemoveQuotes(value) {
  let replaced = value.replace(/^\s+|\s+$/g, '');
  if ((replaced.startsWith('"') && replaced.endsWith('"')) || (replaced.startsWith("'") && replaced.endsWith("'"))) {
    replaced = replaced.slice(1, -1);
  }
  return replaced;
}
/**
 * Parses an input string containing environment variable definitions.
 *
 * @param input - A string containing environment variable definitions.
 *                Each definition should be on a new line in the format KEY=VALUE.
 * @returns An object where keys are the environment variable names and values are their corresponding values.
 *
 * @example
 * const envVars = reader(`
 * KEY1=value1
 * KEY2=value2 with spaces
 * KEY3=${KEY1}/suffix
 * `);
 * // Returns: { KEY1: "value1", KEY2: "value2 with spaces", KEY3: "value1/suffix" }
 */
export function reader(source) {
  const lines = source.split('\n');
  const result = {};

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue;
    }

    const [key, ...valueParts] = trimmedLine.split('=');
    let value = valueParts.join('=');

    if (key && value !== undefined) {
      value = trimAndRemoveQuotes(value);
      value = expandVariables(value, result);

      result[key.trim()] = value;
    }
  }

  return result;
}
