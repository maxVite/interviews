import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'local'])
    .default('development'),
  DATABASE_URL: z.url(),
});

export type ConfigSchema = z.infer<typeof configSchema>;

export const SharedConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  validate: (config) => {
    const result = configSchema.safeParse(config);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }
    return result.data;
  },
});
