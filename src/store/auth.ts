import { create } from "zustand";
import Cookies from "js-cookie";

type AuthStore = {
  token?: string;
  setToken: (token?: string) => void;
};

const useAuthStore = create<AuthStore>(
  (set) =>
    ({
      token: Cookies.get("authToken") || "notok-en",
      setToken: (token?: string) => {
        Cookies.set("authToken", token ?? "notok-en", { expires: 365 });
        set({ token });
      },
    }) as AuthStore,
);

export default useAuthStore;
