import { ReactNode, createContext, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

export const MyThemeContext = createContext({
  themeMode: "",
  updateTheme: (_: string) => {},
});

export const MyThemeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [themeMode, setThemeMode] = useState(() => {
    const l = localStorage.getItem("themeMode");
    if (l === "light" || l === "dark") {
      return l;
    }
    return "dark";
  });

  const updateThemeMode = (mode: string) => {
    console.log(`update theme: ${mode}`);
    localStorage.setItem("themeMode", mode);
    setThemeMode(mode);
  };

  const contextValue = {
    themeMode,
    updateTheme: updateThemeMode,
  };

  const theme = createTheme({
    palette: {
      mode: themeMode as PaletteMode,
    },
  });

  return (
    <MyThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MyThemeContext.Provider>
  );
};
