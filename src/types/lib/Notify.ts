import { Html } from "../Html";
import { ModalButton } from "../Modal";

export interface Notify {
  show: (
    title: string,
    description: string,
    parent?: Html | HTMLElement | Element,
    buttons?: ModalButton[],
    autoHide?: boolean,
    sound?: string
  ) => Promise<void>;
}
