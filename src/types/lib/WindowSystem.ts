export interface WindowSystem {
  win: WsWindowConstructor;
}

export interface WsWindowOptions {
  id?: string;
  width?: string|number;
  height?: string|number;
  minWidth?: number;
  minHeight?: number;
  title?: string;
  content?: string;
  left?: "center" | number;
  top?: "center" | number;
  parent?: "body" | string;
  onclose?: () => void;
  onresize?: () => void;
  resizable?: boolean;
  autofocus?: boolean;
  pid?: number;
}

export interface WsWindowConstructor {
  new (options: WsWindowOptions): WsWindow;
}

export interface WsWindow {
  arrayId: number;
  options: WsWindowOptions;
  state: "def" | "min" | "max";
  window: HTMLElement;
  init: () => void;
  createWindow: () => void;
  bindEvent: () => void;
  focus: () => void;
  maximize: (
    side:
      | "top"
      | "left"
      | "right"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
  ) => void;
  minimize: () => void;
  close: () => void;
  show: () => void;
  hide: () => void;
  setTitle: (title: string) => void;
}
