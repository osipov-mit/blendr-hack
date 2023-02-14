import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import { join } from 'path';
import config from '../config';
import archiver from 'archiver';

interface GenerateIn {
  name: string;
  template: string;
  programs: {
    name: string;
    programId: string;
    metadata?: string;
  }[];
}

export function generate(data: GenerateIn): Promise<string> {
  const id = uuid();
  const dirName = join(config.progjectsDir, id, data.name);
  fs.mkdirSync(dirName, { recursive: true });
  fs.cpSync(join(config.templatesDir, data.template), dirName, { recursive: true });
  // execSync('');
  return createZip(dirName);
}

async function createZip(path: string): Promise<string> {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const pathToDir = `/${join(...path.split('/').slice(0, -1))}`;
  const archiveName = `${path.split('/').at(-1)}.zip`;
  const pathToArchive = join(pathToDir, archiveName);

  const output = fs.createWriteStream(pathToArchive);

  const resPromise = new Promise((resolve) =>
    output.on('close', () => {
      console.log(`[*] ${archiveName}`);
      console.log('  [*]', archive.pointer(), 'total bytes');
      console.log('  [*] Archiver has been finalized and the output file descriptor has closed.');
      resolve('ok');
    }),
  );

  archive.on('warning', (warn) => {
    console.log('  [*] warinng');
    console.log(warn);
  });

  archive.on('error', (err) => {
    console.log('  [*] err');
    console.log(err);
  });

  archive.pipe(output);

  archive.directory(path, false);

  await archive.finalize();

  await resPromise;
  return pathToArchive;
}
