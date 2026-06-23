export const config = {
  // URL to a GIF/image shown in the hero section square block.
  // Any size works — it gets cropped to fit the square.
  // Leave empty to show a placeholder.
  gifUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2k0MTlqcnlpYWg4NHFsemR2cmVrdjdxNWtvZ2Z5cTFieGlya2JjOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w5N8sAWwNqAVBlwmpd/giphy.gif',

  // Your GitHub username — repos are fetched from this account automatically.
  githubUsername: 'vercim',

  // URL for the Marketplace button in the hero section.
  // Leave empty to hide the button.
  marketplaceUrl: 'https://assets.verc.im',

  // YouTube channels shown in the Videos section.
  // To find your channel ID: YouTube Studio → Settings → Channel → Basic info → Channel ID
  // The id field must be the channel ID (starts with UC…), not the @handle.
  // Leave empty to hide the Videos section entirely.
  youtubeChannels: [
    { id: 'UC_KGWY3XGgxHqiHJ9kkn9ow', label: 'knoteax' },
  ] as Array<{ id: string; label?: string }>,

  // Videos shown on first load.
  videosInitial: 3,
  // How many more videos each "load more" click adds.
  videosLoadMore: 6,
};
