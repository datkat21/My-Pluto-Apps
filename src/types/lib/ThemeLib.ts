// TODO: Type theme lib

export interface ThemeLib {
  validateTheme: (theme: any) => void;
  setCurrentTheme: (theme: any) => Promise<void>;
  setWalllpaper: (wallpaper: any) => Promise<void>;
}
