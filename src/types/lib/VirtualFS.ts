export interface VirtualFS {
  exportFS: () => Promise<void>;
  importFS: () => Promise<void>;
  getParentFolder: (path: string) => Promise<string>;
  whatIs: (path: string, fsObject?: object) => Promise<"dir" | "file">;
  readFile: (path: string, fsObject?: object, bypass?: boolean) => Promise<string>;
  writeFile: (
    path: string,
    contents: string | Blob,
    fsObject?: object
  ) => Promise<void>;
  createFolder: (path: string, fsObject?: object) => Promise<void>;
  delete: (path: string, fsObject?: object) => Promise<void>;
  list: (path: string, fsObject?: object) => Promise<void>;
  rename: (path: string, newName: string, fsObject?: object) => Promise<void>;
  exists: (path: string, fsObject?: object) => Promise<void>;
  merge: (fsObject?: object) => Promise<void>;
}
