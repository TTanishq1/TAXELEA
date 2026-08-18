import React from "react";

export const ThemeContext = React.createContext({ theme: "dark", toggleTheme: () => {} });
export function useTheme() { return React.useContext(ThemeContext); }
