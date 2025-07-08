export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface Themes {
  [key: string]: ThemeColors;
}

export const themes: Themes = {
  'Default Light': {
    primary: '#2196f3',
    secondary: '#6c757d',
    background: '#f8f9fa',
    text: '#2c3e50',
    border: '#a7d9ed',
    success: '#4caf50',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#03a9f4',
  },
  'Sky': {
    primary: '#2196f3',
    secondary: '#6c757d',
    background: '#e0f2f7',
    text: '#2c3e50',
    border: '#a7d9ed',
    success: '#4caf50',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#03a9f4',
  },
  'Dark': {
    primary: '#64ffda',
    secondary: '#8892b0',
    background: '#0a192f',
    text: '#ccd6f6',
    border: '#1d3d5d',
    success: '#64ffda',
    warning: '#ffc107',
    danger: '#f44336',
    info: '#03a9f4',
  },
  'Solarized': {
    primary: '#268bd2',
    secondary: '#586e75',
    background: '#fdf6e3',
    text: '#657b83',
    border: '#eee8d5',
    success: '#859900',
    warning: '#b58900',
    danger: '#dc322f',
    info: '#2aa198',
  },
  'Dracula': {
    primary: '#bd93f9',
    secondary: '#6272a4',
    background: '#282a36',
    text: '#f8f8f2',
    border: '#44475a',
    success: '#50fa7b',
    warning: '#f1fa8c',
    danger: '#ff5555',
    info: '#8be9fd',
  },
  'Gruvbox': {
    primary: '#fabd2f',
    secondary: '#a89984',
    background: '#282828',
    text: '#ebdbb2',
    border: '#504945',
    success: '#b8bb26',
    warning: '#fe8019',
    danger: '#cc241d',
    info: '#83a598',
  },
  'VS Code Dark': {
    primary: '#007ACC', // VS Code blue accent
    secondary: '#858585', // Muted grey
    background: '#1E1E1E', // Dark editor background
    text: '#D4D4D4', // Default text color
    border: '#333333', // Subtle border
    success: '#6A9955', // Green for success
    warning: '#CD9731', // Yellow for warning
    danger: '#F44747', // Red for danger
    info: '#569CD6', // Blue for info
  },
};