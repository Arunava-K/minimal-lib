
import { BackgroundType } from "@/types";

export const getBackgroundStyle = (item: { 
  background?: { 
    type: BackgroundType; 
    value: string; 
  } 
} | { 
  theme?: { 
    background?: { 
      type: BackgroundType; 
      value: string; 
    } 
  } 
}) => {
  // Handle profiles with theme property
  if ('theme' in item && item.theme?.background) {
    return getBackgroundFromType(item.theme.background.type, item.theme.background.value);
  }
  
  // Handle widgets with direct background property
  if ('background' in item && item.background) {
    return getBackgroundFromType(item.background.type, item.background.value);
  }
  
  return {};
};

const getBackgroundFromType = (type: BackgroundType, value: string) => {
  switch (type) {
    case 'color':
      return { backgroundColor: value };
    case 'gradient':
      return { background: value };
    case 'image':
      return { 
        backgroundImage: `url(${value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    default:
      return {};
  }
};

export const gradients = [
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
  "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
  "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)",
  "linear-gradient(60deg, #abecd6 0%, #fbed96 100%)",
  "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
];
