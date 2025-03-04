import { Group } from "@/types/group";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { Namespace } from "@/types/namespace";
import { SearchResult } from "@/types/search_result";
import axios, { AxiosInstance } from "axios";
import useAuthStore from "@/store/auth";

export type PaginatedResponse<T> = {
  values: T[];
  nextToken: string;
};

interface GenericSearchParams {
  search: string;
  take: number;
  nextToken: string | null;
}

interface SearchParams extends GenericSearchParams {
  namespaces?: Namespace[];
  projects?: Project[];
}

export interface GLTorchApi {
  me(): Promise<User>;

  search(params: SearchParams): Promise<PaginatedResponse<SearchResult>>;

  users(params: GenericSearchParams): Promise<PaginatedResponse<User>>;

  groups(params: GenericSearchParams): Promise<PaginatedResponse<Group>>;

  namespaces(
    params: GenericSearchParams,
  ): Promise<PaginatedResponse<Namespace>>;

  projects(params: GenericSearchParams): Promise<PaginatedResponse<Project>>;
}

class Real implements GLTorchApi {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 16000,
    });

    this.axios.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;

      if (token && config.headers) {
        config.headers["X-Token"] = token;
      }

      return config;
    });
  }

  async me(): Promise<User> {
    const res = await this.axios.get<User>("/users/me");
    return res.data;
  }

  async search(params: SearchParams): Promise<PaginatedResponse<SearchResult>> {
    console.log(JSON.stringify(params));
    const res = await this.axios.post<PaginatedResponse<SearchResult>>(
      "/projects/search",
      params,
    );
    return res.data;
  }

  async users(params: GenericSearchParams): Promise<PaginatedResponse<User>> {
    const res = await this.axios.post<PaginatedResponse<User>>(
      "/users",
      params,
    );
    return res.data;
  }

  async groups(params: GenericSearchParams): Promise<PaginatedResponse<Group>> {
    const res = await this.axios.post<PaginatedResponse<Group>>(
      "/groups",
      params,
    );
    return res.data;
  }

  async namespaces(
    params: GenericSearchParams,
  ): Promise<PaginatedResponse<Namespace>> {
    const res = await this.axios.post<PaginatedResponse<Namespace>>(
      "/namespaces",
      params,
    );
    return res.data;
  }

  async projects(
    params: GenericSearchParams,
  ): Promise<PaginatedResponse<Project>> {
    const res = await this.axios.post<PaginatedResponse<Project>>(
      "/projects",
      params,
    );
    return res.data;
  }
}

export const API = new Real();
