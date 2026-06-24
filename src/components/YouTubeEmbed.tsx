interface Props {
  videoId: string;
}

export function YouTubeEmbed({ videoId }: Props) {
  return (
    <div className="relative w-full aspect-video">
      <iframe
        className="absolute inset-0 w-full h-full border-0"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
