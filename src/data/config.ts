export const config = {
  // List of GIF/image URLs for the hero section square block.
  // One is picked at random on each page load. Any size works — cropped to fit.
  // Leave empty to show a placeholder.
  gifUrls: [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2k0MTlqcnlpYWg4NHFsemR2cmVrdjdxNWtvZ2Z5cTFieGlya2JjOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w5N8sAWwNqAVBlwmpd/giphy.gif',
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa29mNGxnZGZqd2NuZ2g1NXZsNjlvOGEyeGt2MHI3c3g1bm5ybmV3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y4nk5bgwpWL6T5Ax9y/giphy.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG5jdW41eWk1Z3UwY3I3eGNqYjRtOGZjZGJ1dDJ1MzVsYjZkYmxwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gY9LPsDoysUt2Hlr7b/giphy.gif",
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXI1eHI3MHE0ejg1d2oxc2llYnc0bzZxZWpjN3lmams3dDByMmZyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vENiR36hvPRcYYXnXe/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2RtaWtvcWQ5eXE1azZxYndscHJzZWZweWJoNHI3YTR2bzNyNmNxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9biQXc6uWp2wMMMgK2/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTdpa3NwdzBjNjB2c2doOXdidWV6Mm4zcHRxNHNyNHJ6OHpjdzdyMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nQklMTTlhiBCIgu9JZ/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JoNHppamwwZTF5cThkNDZjc3V4eG5hZGR3MWM2ZjBrbDRid2F1cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zMv36BprGxUAqoWc72/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnMxaHBjd2U3N2pqeHcxM3B6OWQzMWhkOTdwaHZoYWd3dTd3bzgyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8xx61KYVL3NeMdMj32/giphy.gif",
    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjhlc3p2bWJnY2JkaW0xbm55dXE3czdqeXV2MnBqY3hrc3h5Mm9yMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LqYJEegz2StG95YlpL/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWNwZmVuazM3OGVlZjhlZHYxMWRlMnl5YTVmOWliYm54bDI5MWduciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kg4yoaDX9TEZraB4qb/giphy.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExejF1bHgwNzZ1cXo1cmM1YnR5NW1nbTgzbzI1a25xODF6a21kbnAwbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FlVQGdrO4Vd1NbPNpF/giphy.gif"
  ] as string[],

  // Your GitHub username — repos are fetched from this account automatically.
  githubUsername: 'vercim',

  // Pinned repositories shown highlighted at the top of the projects list.
  // Order here is preserved. When GITHUB_TOKEN is available, this list is ignored
  // and pins are fetched from GitHub instead.
  pinnedRepos: ['assets-vercim', 'avatars-vercim'] as string[],

  // URL for the Marketplace button in the hero section.
  // Leave empty to hide the button.
  marketplaceUrl: 'https://assets.verc.im',

  // YouTube channels shown in the Videos section.
  // To find your channel ID: YouTube Studio → Settings → Channel → Basic info → Channel ID
  // The id field must be the channel ID (starts with UC…), not the @handle.
  // Leave empty to hide the Videos section entirely.
  youtubeChannels: [
    { id: 'UC_KGWY3XGgxHqiHJ9kkn9ow' },
  ] as Array<{ id: string }>,

  // Videos shown on first load.
  videosInitial: 3,
  // How many more videos each "load more" click adds.
  videosLoadMore: 6,
};
