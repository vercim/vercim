import { readdir, readFile, writeFile } from 'node:fs/promises';

const directory = new URL('../src/assets/lottie/', import.meta.url);

function addColorClasses(value) {
  if (!value || typeof value !== 'object') return;
  if (value.ty === 'fl' || value.ty === 'st') {
    const colorClass = value.ty === 'fl' ? 'lottie-fill' : 'lottie-stroke';
    value.cl = [...new Set([...(value.cl?.split(/\s+/).filter(Boolean) ?? []), colorClass])].join(' ');
  }
  for (const child of Object.values(value)) addColorClasses(child);
}

for (const filename of await readdir(directory)) {
  if (!filename.endsWith('.json')) continue;
  const file = new URL(filename, directory);
  const animation = JSON.parse(await readFile(file, 'utf8'));
  addColorClasses(animation);
  await writeFile(file, JSON.stringify(animation));
  console.log(`Prepared Lottie colors: ${filename}`);
}
