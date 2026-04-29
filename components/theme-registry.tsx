"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "media",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2563eb" },
        background: {
          default: "#fafafa",
          paper: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#3b82f6" },
        background: {
          default: "#0b0f1a",
          paper: "#111827",
        },
      },
    },
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

type ThemeRegistryProps = {
  children: React.ReactNode;
};

export function ThemeRegistry({ children }: ThemeRegistryProps) {
  const memoTheme = useMemo(() => theme, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={memoTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
