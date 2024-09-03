import z from 'zod';

/**
 * Validates data against a given Zod schema.
 *
 * @param {*} data - The data to be validated.
 * @param {import('zod').ZodType} schema - The Zod schema to validate against.
 * @throws {Error} If data is missing, schema is invalid, or validation fails.
 * @returns {*} The parsed and validated data.
 */
export const validateOrThrow = (data, schema) => {
  if (data === undefined || data === null) {
    throw new Error('Data is missing');
  }

  if (!(schema instanceof z.ZodType)) {
    throw new Error('Invalid schema: must be a Zod schema');
  }

  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Validates data against a given Zod schema without throwing errors.
 *
 * @param {*} data - The data to be validated.
 * @param {import('zod').ZodType} schema - The Zod schema to validate against.
 * @returns {Object} An object with 'success', 'data', and 'error' properties.
 */
export const validate = (data, schema) => {
  if (data === undefined || data === null) {
    return {
      success: false,
      data: null,
      error: 'Data is missing',
    };
  }

  if (!(schema instanceof z.ZodType)) {
    return {
      success: false,
      data: null,
      error: 'Invalid schema: must be a Zod schema',
    };
  }

  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof z.ZodError
          ? `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`
          : 'Unknown error occurred during validation',
    };
  }
};
