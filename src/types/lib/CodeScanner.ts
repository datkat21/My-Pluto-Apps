export interface CodeScanner {
  isCodeDangerous: (code: string) => any;
  scanFolder: (folder?: string) => Promise<any>;
  getFileExtension: (filename?: string) => any;
  scanForDangerousCode: (filename?: string) => Promise<any>;
}
