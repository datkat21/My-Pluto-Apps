export interface FileMappings {
  retrieveAllMIMEData: (path: string) => Promise<any>;
  getType: (extension: string) => any;
  getLabel: (extension: string) => any;
}