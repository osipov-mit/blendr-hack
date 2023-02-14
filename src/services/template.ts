import { readdirSync, readFileSync } from 'fs';
import config from '../config';

export function getTemplateNames() {
  return readdirSync(config.templatesDir);
}

export function getTemplateDetails(name: string) {
  const json = readFileSync('./templates-details.json', 'utf-8');
  const details = JSON.parse(json);

  if (!(name in details)) {
    throw new Error(`Details for ${name} template not found`);
  }

  return details[name]
}
