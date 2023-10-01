import React, { SetStateAction, Dispatch } from "react";

type AuthContextType = {
  token: null | string;
  setToken: Dispatch<SetStateAction<string | null>>;
};

export const AuthContext = React.createContext<AuthContextType>({
  token: null,
  setToken: () => console.warn("no token provider"),
});
