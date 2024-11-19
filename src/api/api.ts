import { Group } from "@/types/group";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { MOCK_RPOJECTS } from "@/mock/projects";
import { MOCK_USERS } from "@/mock/users";
import { MOCK_GROUPS } from "@/mock/groups";
import { Namespace } from "@/types/namespace";
import { SearchResult } from "@/types/search_result";
import { MOCK_SEARCH_RESULTS } from "@/mock/search_results";

export interface GLTorchApi {
  // note(aim1rage): если указана хотя бы одна группа или пользователь, то поиск репозиториев будет только по указанным группам или пользователям
  // note(aim1rage): иначе - поиск репозиториев будет идти по все видимым текущему пользователю
  getProjects: (
    search: string,
    groupIDs?: number[],
    userIDs?: number[],
  ) => Promise<Project[]>;

  // note(aim1rage): если ничего не указано, то поиск будет по всем видимым репозиториям
  // note(aim1rage): если указаны только группы или пользователи, то поиск будет по всем репозиториям перечисленных групп или пользователей
  // note(aim1rage): если указаны репозитории, то поиск будет идти по перечисленным репозиториям
  getSearchResults: (
    search: string,
    groupIDs?: number[],
    userIDs?: number[],
    projectIDs?: number[],
  ) => Promise<SearchResult[]>;

  getUsers: (search: string) => Promise<User[]>;
  getGroups: (search: string) => Promise<Group[]>;
  getNamespaces: (search: string) => Promise<Namespace[]>;
} // TODO add getSearchResults: (...) @Aim1rage

class Fake implements GLTorchApi {
  async getProjects(
    search: string,
    groupIDs: number[] | undefined,
    userIDs: number[] | undefined,
  ) {
    return MOCK_RPOJECTS.filter((p) => p.pathWithNamespace.includes(search))
      .filter(
        (p) =>
          !groupIDs ||
          groupIDs.length == 0 ||
          !p.parent.group ||
          groupIDs.includes(p.parent.group.id),
      )
      .filter(
        (p) =>
          !userIDs ||
          userIDs.length == 0 ||
          !p.parent.user ||
          userIDs.includes(p.parent.user.id),
      );
  }

  async getUsers(search: string) {
    return MOCK_USERS.filter((u) => u.username.includes(search));
  }

  async getGroups(search: string) {
    return MOCK_GROUPS.filter((g) => g.path.includes(search));
  }

  async getNamespaces(search: string) {
    return [
      ...(await this.getGroups(search)).map((g) => ({ group: g })),
      ...(await this.getUsers(search)).map((u) => ({ user: u })),
    ] as Namespace[];
  }

  async getSearchResults(
    search: string,
    groupIDs?: number[],
    userIDs?: number[],
    projectIDs?: number[],
  ) {
    return MOCK_SEARCH_RESULTS.filter((r) => r.data.includes(search)).filter(
      (r) =>
        !projectIDs ||
        projectIDs.length == 0 ||
        projectIDs.includes(r.projectID) ||
        !groupIDs ||
        groupIDs.length == 0 ||
        groupIDs.some((gid) => r.namespace.group?.id === gid) ||
        !userIDs ||
        userIDs.length == 0 ||
        userIDs.some((uid) => r.namespace.user?.id === uid),
    );
  }
}

export const MOCK_API = new Fake();
