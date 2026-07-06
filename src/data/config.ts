export const config = {
  // Static GIF URL for the hero section square block.
  // Only one value is used here.
  gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmNpejF1cjVyc3JpcDg2ZTUzNXN4OGg1MnRyNXJibTQ0MzltbzNnbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VdoGzFHJ0JxftbhRzj/giphy.gif",

  // Your GitHub username — repos are fetched from this account automatically.
  githubUsername: 'vercim',

  // Pinned repositories shown highlighted at the top of the projects list.
  // Order here is preserved. When GITHUB_TOKEN is available, this list is ignored
  // and pins are fetched from GitHub instead.
  pinnedRepos: ['handycam'] as string[],

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
