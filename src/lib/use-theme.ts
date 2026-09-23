"use client";

import * as React from "react";

/**
 * Returns whether the current rendered theme is dark.
 * Subscribes to DOM class changes so components re-render
 * whenever the user toggles the theme.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // Read initial state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for class changes on <html>
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
