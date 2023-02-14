import { readdirSync, readFileSync } from 'fs';
import config from '../config';

export function getTemplateNames() {
  const basicTemplates = readdirSync(config.templatesDir);
  const superTemplates = JSON.parse(readFileSync('./super-templates.json', 'utf-8'));
  return { basicTemplates, superTemplates };
}

export function getTemplateDetails(name: string) {
  const json = readFileSync('./templates-details.json', 'utf-8');
  const details = JSON.parse(json);

  if (!(name in details)) {
    throw new Error(`Details for ${name} template not found`);
  }

  return details[name];
}
