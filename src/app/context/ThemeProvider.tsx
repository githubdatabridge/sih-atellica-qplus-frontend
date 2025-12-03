import React, { FC, ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  ThemeOptions,
} from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import { sihTheme } from "app/common/theme";
import {
  breeHeadline,
  shIcons,
  sisan03,
  sisan08,
  sisan33,
  sisan38,
} from "app/common/fonts";

type Props = {
  forceDarkTheme?: boolean;
  children: ReactNode;
};

export const muiCache = createCache({
  key: "mui",
  prepend: true,
});

const GlobalCssPriority: FC = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      {/* Your component tree. Now you can override MUI's styles. */}
      {children}
    </StyledEngineProvider>
  );
};

const typographySettings: ThemeOptions = {
  typography: {
    fontFamily: "siemens sans",
  },
};

const ThemeProvider = ({ forceDarkTheme, children }: Props) => {
  //PAM: Force black mode => /* [forceDarkTheme, prefersDarkMode], */
  const theme = React.useMemo(
    () =>
      createTheme({
        ...sihTheme,
        ...typographySettings,
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              "@font-face": sisan03,
              fallbacks: [
                {
                  "@font-face": sisan08,
                },
                {
                  "@font-face": sisan33,
                },
                {
                  "@font-face": sisan38,
                },
                {
                  "@font-face": shIcons,
                },
                {
                  "@font-face": breeHeadline,
                },
              ],
            },
          },

          MuiInputBase: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              // Name of the component ⚛️ / style sheet
              root: {
                // Name of the rule
                color: "#273540",
                "&.Mui-focused": {
                  // increase the specificity for the pseudo class
                  color: "#ec6602",
                },
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                fontSize: "14px",
                fontWeight: "bold",
                letterSpacing: 0,
                lineHeight: "20px",
                cursor: "move",
                borderBottom: "1px solid #ebebeb",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                fontFamily: "siemens sans !important",
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                fontFamily: "siemens sans !important",
                minWidth: 135,
                "@media (min-width: 135px)": {
                  minWidth: 135,
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                padding: "12px",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                fontFamily: "siemens sans !important",
              },
            },
          },
          MuiList: {
            styleOverrides: {
              root: {
                fontFamily: "siemens sans !important",
              },
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: {
                padding: 20,
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                "&:first-child": {
                  paddingTop: 33,
                },
                "&:last-child": {
                  paddingBottom: 33,
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                // Controls default (unchecked) color for the thumb
                color: "#fafafa",
              },
              colorPrimary: {
                "&.Mui-checked": {
                  // Controls checked color for the thumb
                  color: "#ec6602",
                },
              },
              thumb: {
                boxShadow: "0 1px 2px rgba(0,0,0,.3)",
                width: "20px",
                height: "20px",
              },
              track: {
                "&.Mui-checked": {
                  backgroundColor: "#ec6602",
                },
              },
            },
          },
        },
      }),
    []
  );

  return (
    <CacheProvider value={muiCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalCssPriority>{children}</GlobalCssPriority>
      </MuiThemeProvider>
    </CacheProvider>
  );
};

export default ThemeProvider;
