import { Namespace } from "./namespace";

export interface SearchResult {
  id: string;
  path: string;
  filename: string;
  data: string;
  startLine: number;
  projectID: number;
  projectPath: string;
  namespace: Namespace;
}
