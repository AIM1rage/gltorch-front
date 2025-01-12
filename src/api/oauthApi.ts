import axios, { AxiosInstance } from "axios";


export type tokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    created_at: number;
  }
  
  export interface GitlabOAuthApi {
    changeCode(token: string): Promise<tokenResponse>;
    renewToken(refresh_token: string): Promise<tokenResponse>;
  }
  
  class Api implements GitlabOAuthApi{
    axios: AxiosInstance;
  
    constructor() {
      this.axios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_GITLAB_URL,
        timeout: 3000,
      });
    }
  
    async changeCode(code: string): Promise<tokenResponse> {
      const res = await this.axios.post<tokenResponse>(
        "/oauth/token",
        {
          "grant_type": "authorization_code",
          "code": code,
          "redirect_uri": process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
          "client_id": process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
        },
      )
      return res.data;
    }
  
    async renewToken(refresh_token: string): Promise<tokenResponse>{
      const res = await this.axios.post<tokenResponse>(
        "/oauth/token",

        {
          "client_id": process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
          "refresh_token": refresh_token,
          "grant_type": "refresh_token",
          "redirect_uri": process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
        },
      )
      return res.data;
    }
  }

export const OAuthApi = new Api();