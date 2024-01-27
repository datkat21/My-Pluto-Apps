import { Html } from "../Html";

export interface CtxMenuItem {
  item: string;
  select: () => void;
}

export interface CtxMenu {
  new: (
    posX: number,
    posY: number,
    items: CtxMenuItem[],
    header: string,
    parent?: HTMLElement | Element | Html,
    isAbsolute?: boolean
  ) => void;
}
