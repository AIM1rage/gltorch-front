import { Namespace } from "./namespace";

export type Project = {
  id: number;
  path: string;
  pathWithNamespace: string;
  parent: Namespace;
};
