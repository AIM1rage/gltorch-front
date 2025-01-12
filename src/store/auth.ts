import { create } from "zustand";
import Cookies from "js-cookie";

type AuthStore = {
  token?: string;
  refreshToken?: string; 
  setTokens: (token?: string, refreshToken?: string) => void;
};

const useAuthStore = create<AuthStore>(
  (set) =>
    ({
      token: Cookies.get("authToken") || "notok-en",
      refreshToken: Cookies.get("refreshToken") || "notok-en",
      setTokens: (token?: string, refreshToken?: string) => {
        Cookies.set("authToken", token ?? "notok-en", { expires: 365 });
        Cookies.set("refreshToken", refreshToken ?? "notok-en", { expires: 365 });
        set({ token, refreshToken });
      },
    }) as AuthStore,
);

export default useAuthStore;
