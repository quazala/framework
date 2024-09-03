import z from 'zod';
import { validateOrThrow } from '../src/validator';

describe('validateOrThrow', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().positive(),
  });

  test('should successfully validate correct data', () => {
    const data = { name: 'Alice', age: 30 };
    expect(validateOrThrow(data, schema)).toEqual(data);
  });

  test('should throw error for missing data', () => {
    expect(() => validateOrThrow(null, schema)).toThrow('Data is missing');
  });

  test('should throw error for invalid schema', () => {
    expect(() => validateOrThrow({}, {})).toThrow('Invalid schema: must be a Zod schema');
  });

  test('should throw error for invalid data', () => {
    const data = { name: 'Bob', age: 'thirty' };
    expect(() => validateOrThrow(data, schema)).toThrow('Validation failed');
  });
});
