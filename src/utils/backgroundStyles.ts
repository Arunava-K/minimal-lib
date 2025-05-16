
import { Widget, UserProfile } from "@/types";

export const getBackgroundStyle = (widget: Widget | UserProfile): React.CSSProperties => {
  const background = 'theme' in widget 
    ? widget.theme?.background 
    : widget.background;

  if (!background) {
    return {};
  }

  switch (background.type) {
    case 'color':
      return { backgroundColor: background.value };
    case 'gradient':
      return { background: background.value };
    case 'image':
      return { 
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    default:
      return {};
  }
};
