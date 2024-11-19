import { Namespace } from "./namespace";

export interface Project {
  id: number;
  path: string;
  pathWithNamespace: string;
  parent: Namespace;
}
