import { Project } from "./project";

export interface SearchResult {
  id: string;
  path: string;
  filename: string;
  data: string;
  startLine: number;
  project: Project;
}
