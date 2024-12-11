import { Project } from "./project";

export type SearchResult = {
  id: string;
  path: string;
  fileName: string;
  data: string;
  startline: number;
  project: Project;
};
