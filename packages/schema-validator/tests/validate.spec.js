import z from 'zod';
import { validate } from '../src/validator';

describe('validate', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().positive(),
  });

  test('should return success for correct data', () => {
    const data = { name: 'Alice', age: 30 };
    expect(validate(data, schema)).toEqual({
      success: true,
      data: data,
      error: null,
    });
  });

  test('should return error for missing data', () => {
    expect(validate(null, schema)).toEqual({
      success: false,
      data: null,
      error: 'Data is missing',
    });
  });

  test('should return error for invalid schema', () => {
    expect(validate({}, {})).toEqual({
      success: false,
      data: null,
      error: 'Invalid schema: must be a Zod schema',
    });
  });

  test('should return error for invalid data', () => {
    const data = { name: 'Bob', age: 'thirty' };
    expect(validate(data, schema)).toEqual({
      success: false,
      data: null,
      error: expect.stringContaining('Validation failed'),
    });
  });
});

describe('Edge cases and complex scenarios', () => {
  test('should handle nested objects', () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string(),
        contacts: z.array(z.string()),
      }),
    });
    const validData = {
      user: { name: 'Charlie', contacts: ['email', 'phone'] },
    };
    expect(validate(validData, nestedSchema).success).toBe(true);
  });

  test('should handle arrays', () => {
    const arraySchema = z.array(z.number());
    expect(validate([1, 2, 3], arraySchema).success).toBe(true);
    expect(validate([1, '2', 3], arraySchema).success).toBe(false);
  });

  test('should handle optional fields', () => {
    const optionalSchema = z.object({
      name: z.string(),
      age: z.number().optional(),
    });
    expect(validate({ name: 'David' }, optionalSchema).success).toBe(true);
  });

  test('should handle union types', () => {
    const unionSchema = z.union([z.string(), z.number()]);
    expect(validate('test', unionSchema).success).toBe(true);
    expect(validate(42, unionSchema).success).toBe(true);
    expect(validate(true, unionSchema).success).toBe(false);
  });

  test('should handle custom validation rules', () => {
    const customSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
    expect(validate({ email: 'test@example.com', password: 'password123' }, customSchema).success).toBe(true);
    expect(validate({ email: 'invalid-email', password: 'short' }, customSchema).success).toBe(false);
  });
});
