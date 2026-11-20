import sharp from 'sharp';

const iconHosts = new Set(['cdn.modrinth.com', 'media.forgecdn.net']);

export async function staticModIcon(iconUrl: string | null): Promise<string | null> {
  if (!iconUrl || !/\.gif$/i.test(iconUrl.split(/[?#]/, 1)[0])) return iconUrl;

  try {
    const url = new URL(iconUrl);
    if (url.protocol !== 'https:' || url.port || !iconHosts.has(url.hostname)) return null;

    const response = await fetch(url, {
      next: { revalidate: 21600 },
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const frame = await sharp(Buffer.from(await response.arrayBuffer()), {
      page: 0,
      pages: 1,
      limitInputPixels: 4_194_304,
    })
      .resize(192, 192, { fit: 'inside', kernel: 'nearest', withoutEnlargement: true })
      .png()
      .toBuffer();

    return `data:image/png;base64,${frame.toString('base64')}`;
  } catch (error) {
    console.error('[mod-icon] Failed to convert GIF icon:', error);
    return null;
  }
}
