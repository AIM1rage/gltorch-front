import { Group } from "./group";
import { User } from "./user";

export interface Namespace {
  group?: Group;
  user?: User;
}
