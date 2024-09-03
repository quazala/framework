import z from "zod";
import { serverConfigSchema } from "./server";

export const configSchema = z.object({
  server: serverConfigSchema,
  threads: z.number().default(1),
  queue: z
    .object({
      names: z.array(z.string()),
    })
    .optional(),
});

export const validateConfig = (source) => {
  return configSchema.parse(source);
};
