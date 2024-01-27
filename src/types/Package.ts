import { Core, CorePrivilege, CoreService, GlobalLib, TrayInfo } from "./Core";
import { ProcessAvailableLibrary } from "./Lib";
import { Modal } from "./Modal";

export type Package = PackageProcess | PackageLibraryOrComponent;

export interface PackageReturns {
  end: () => void;
  trayInfo: TrayInfo | null;
  send: (message: any) => void;
}

export interface PackageRoot {
  Lib: ProcessAvailableLibrary;
  Core: Core | null;
  PID: number;
  Token: string;
  Modal: Modal;
  Services: CoreService[] | null;
  GlobalLib?: GlobalLib;
}

export interface PackageProcess {
  name: string;
  description: string;
  ver: number;
  type: "process";
  privileges?: CorePrivilege[];
  optInToEvents?: boolean;
  exec: (Root: PackageRoot) => Promise<PackageReturns>;
}

export interface PackageLibraryOrComponent {
  name: string;
  description: string;
  ver: number;
  type: "library" | "component";
  privileges: CorePrivilege[];
  init?: (L: GlobalLib, C: Core) => void;
  /**
   * This property is only available if it is defined as a library or component.
   */
  data: PackageData;
}

export interface PackageData {
  [key: string]: any;
}
