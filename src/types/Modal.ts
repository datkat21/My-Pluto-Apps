import { Html } from "./Html";

export interface ModalButton {
  text: string;
  type: string;
  callback: () => void;
}

type ModalAlert = {
  (
    title: string,
    content: string,
    parent: Html | HTMLElement | string | "body"
  ): Promise<boolean>;
  (
    text: string,
  ): Promise<boolean>;
};

export interface Modal {
  modal: (
    title: string,
    content: Html | string,
    parent: Html | HTMLElement | string | "body",
    contentIsHtml: boolean,
    ...buttons: ModalButton[]
  ) => void;
  alert: ModalAlert;
  prompt: (
    title: string,
    content: string,
    parent: Html | HTMLElement | string | "body"
  ) => Promise<boolean>;
  input: (
    title: string,
    description: string,
    placeholder: string,
    parent?: string | "body",
    isPassword?: boolean,
    value?: string
  ) => Promise<boolean>;
}
