"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "anonymous-feedback-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) === "dark";
    document.documentElement.classList.toggle("dark", saved);
    setDark(saved);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? "Use light mode" : "Use dark mode"} title={dark ? "Use light mode" : "Use dark mode"}>
      <span aria-hidden="true">{dark ? "☼" : "☾"}</span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
