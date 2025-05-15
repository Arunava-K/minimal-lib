
export const extractYoutubeId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export const extractSpotifyId = (url: string) => {
  const regex = /(?:spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};
