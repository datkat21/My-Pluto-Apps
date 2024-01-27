export interface FileDialog {
  pickFile: (path: string) => Promise<string | false>;
  saveFile: (path: string) => Promise<string | false>;
}
