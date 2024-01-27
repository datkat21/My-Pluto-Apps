export interface HtmlConstructor {
  new (elm: string): Html;
  from: (elm: HTMLElement | Element | Html | string) => Html;
  qs: (query: string) => Html;
  qsa: (query: string) => Html[] | null;
}

export interface Html {
  elm: HTMLElement;
  text: (val: string) => Html;
  html: (val: string) => Html;
  cleanup: () => Html;
  query: (selector: string) => Html;
  queryHtml: (selector: string) => Html;
  class: (...val: string[]) => Html;
  classOn: (...val: string[]) => Html;
  classOff: (...val: string[]) => Html;
  style: (obj: Record<string, string>) => Html;
  styleJs: (obj: Record<string, string>) => Html;
  on: (ev: string, cb: EventListenerOrEventListenerObject) => Html;
  un: (ev: string, cb: EventListenerOrEventListenerObject) => Html;
  appendTo: (parent: Html | HTMLElement | string) => Html;
  append: (elem: Html | HTMLElement) => Html;
  appendMany: (...elements: (Html | HTMLElement)[]) => Html;
  clear: () => Html;
  attr: (obj: Record<string, string | undefined>) => Html;
  val: (str: string) => Html;
  getText: () => Html;
  getHtml: () => Html;
  getValue: () => Html;
  swapRef: (elm: HTMLElement) => Html;
}
