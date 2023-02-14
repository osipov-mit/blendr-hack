import { readdirSync } from 'fs';
import config from '../config';

export function getTemplateNames() {
  return readdirSync(config.templatesDir);
}
