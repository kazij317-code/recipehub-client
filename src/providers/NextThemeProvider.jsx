"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

export const useThemeContext = () => useContext(ThemeContext);

const NextThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    window.localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default NextThemeProvider;
