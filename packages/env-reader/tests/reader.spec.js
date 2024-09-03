import { reader } from '../src/reader';

describe('reader', () => {
  test('parses basic key-value pairs', () => {
    const input = `
        KEY1=value1
        KEY2=value2
      `;
    expect(reader(input)).toEqual({
      KEY1: 'value1',
      KEY2: 'value2',
    });
  });

  test('ignores empty lines and comments', () => {
    const input = `
        # This is a comment
        KEY1=value1
  
        # Another comment
        KEY2=value2
      `;
    expect(reader(input)).toEqual({
      KEY1: 'value1',
      KEY2: 'value2',
    });
  });

  test('handles values with equal signs', () => {
    const input = `KEY=value=with=equals`;
    expect(reader(input)).toEqual({
      KEY: 'value=with=equals',
    });
  });

  test('trims whitespace and removes quotes', () => {
    const input = `
        KEY1 = value1
        KEY2=" value2 "
        KEY3=' value3 '
      `;
    expect(reader(input)).toEqual({
      KEY1: 'value1',
      KEY2: ' value2 ',
      KEY3: ' value3 ',
    });
  });

  test('expands variables', () => {
    const input = `
        BASE_URL=http://example.com
        API_URL=\${BASE_URL}/api
        UNDEFINED_VAR=\${UNDEFINED}
      `;
    expect(reader(input)).toEqual({
      BASE_URL: 'http://example.com',
      API_URL: 'http://example.com/api',
      UNDEFINED_VAR: '',
    });
  });

  test('uses process.env for undefined variables', () => {
    process.env.TEST_VAR = 'test_value';
    const input = `EXPANDED_VAR=\${TEST_VAR}`;
    expect(reader(input)).toEqual({
      EXPANDED_VAR: 'test_value',
    });
    delete process.env.TEST_VAR; // Clean up
  });

  test('handles empty input', () => {
    expect(reader('')).toEqual({});
  });

  test('handles input with only comments and empty lines', () => {
    const input = `
        # Comment 1
        
        # Comment 2
      `;
    expect(reader(input)).toEqual({});
  });
});
