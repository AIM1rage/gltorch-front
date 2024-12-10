import {Group} from "@/types/group";
import {Project} from "@/types/project";
import {User} from "@/types/user";
import {Namespace} from "@/types/namespace";
import {SearchResult} from "@/types/search_result";
import axios, {AxiosInstance} from "axios";

export type PaginatedResponse<T> = {
    values: T[];
    nextToken: string;
};

export interface GLTorchApi {
    me(): Promise<User>;

    search(
        search: string,
        namespaces?: Namespace[],
        projects?: Project[],
        take?: number,
        nextToken?: string,
    ): Promise<PaginatedResponse<SearchResult>>;

    users(
        search: string,
        take?: number,
        nextToken?: string,
    ): Promise<PaginatedResponse<User>>;

    groups(
        search: string,
        take?: number,
        nextToken?: string,
    ): Promise<PaginatedResponse<Group>>;

    namespaces(
        search: string,
        take?: number,
        nextToken?: string,
    ): Promise<PaginatedResponse<Namespace>>;

    projects(
        search: string,
        groupIDs?: number[],
        userIDs?: number[],
        take?: number,
        nextToken?: string,
    ): Promise<PaginatedResponse<Project>>;
}

class Real implements GLTorchApi {
    axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: "https://api.pcmate.tech/",
            timeout: 1000,
        });
    }

    async me(): Promise<User> {
        const res = await this.axios.get<User>("/users/me");
        return res.data;
    }

    async search(
        search: string,
        namespaces?: Namespace[],
        projects?: Project[],
        take: number = 20,
        nextToken: string | null = null,
    ): Promise<PaginatedResponse<SearchResult>> {
        const res = await this.axios.post<PaginatedResponse<SearchResult>>(
            "/projects/search",
            {search, namespaces, projects, take, nextToken},
        );
        return res.data;
    }

    async users(
        search: string,
        take: number = 20,
        nextToken: string | null = null,
    ): Promise<PaginatedResponse<User>> {
        const res = await this.axios.post<PaginatedResponse<User>>("/users", {
            search,
            take,
            nextToken,
        });
        return res.data;
    }

    async groups(
        search: string,
        take: number = 20,
        nextToken: string | null = null,
    ): Promise<PaginatedResponse<Group>> {
        const res = await this.axios.post<PaginatedResponse<Group>>("/groups", {
            search,
            take,
            nextToken,
        });
        return res.data;
    }

    async namespaces(
        search: string,
        take: number = 20,
        nextToken: string | null = null,
    ): Promise<PaginatedResponse<Namespace>> {
        const res = await this.axios.post<PaginatedResponse<Namespace>>(
            "/namespaces",
            {
                search,
                take,
                nextToken,
            },
        );
        return res.data;
    }

    async projects(
        search: string,
        groupIDs?: number[],
        userIDs?: number[],
        take: number = 20,
        nextToken: string | null = null,
    ): Promise<PaginatedResponse<Project>> {
        const res = await this.axios.post<PaginatedResponse<Project>>("/projects", {
            search,
            groupIDs,
            userIDs,
            take,
            nextToken,
        });
        return res.data;
    }
}

export const API = new Real();
