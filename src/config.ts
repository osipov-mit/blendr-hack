import assert from 'assert';
import { config } from 'dotenv';
config();

function getEnv(envName: string, _defaultValue?: string): string {
  const env = process.env[envName];
  if (!_defaultValue) assert.notStrictEqual(env, undefined, `Env variable ${envName} is not specified`);
  return (env as string) || _defaultValue;
}
export default {
  port: Number(getEnv('PORT', '3000')),
  progjectsDir: getEnv('PROJECTS_DIR'),
  templatesDir: getEnv('TEMPLATES_DIR'),
  superTemplatesDir: getEnv('SUPER_TEMPLATES_DIR'),
};
