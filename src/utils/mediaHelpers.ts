
// Extract YouTube video ID from various YouTube URL formats
export const extractYoutubeId = (url: string): string => {
  if (!url) return '';
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : '';
};

// Extract Spotify track ID from Spotify URL
export const extractSpotifyId = (url: string): string => {
  if (!url) return '';
  
  const regExp = /(?:spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : '';
};

// Load image from URL and return a promise with the dimensions
export const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};

// Check if a URL is an image
export const isImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');
    return contentType ? contentType.startsWith('image/') : false;
  } catch (error) {
    console.error('Error checking image URL:', error);
    return false;
  }
};
