
import { Widget, UserProfile } from "@/types";

// Export a list of gradient backgrounds for use in the UI
export const gradients = [
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)",
  "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
  "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
  "linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)",
  "linear-gradient(90deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)",
  "linear-gradient(90deg, hsla(339, 100%, 55%, 1) 0%, hsla(197, 100%, 64%, 1) 100%)",
];

export const getBackgroundStyle = (widget: Widget | UserProfile): React.CSSProperties => {
  // Check if it's a UserProfile with theme or a Widget with direct background
  const background = 'theme' in widget && widget.theme?.background
    ? widget.theme.background
    : 'background' in widget
      ? widget.background
      : null;

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
