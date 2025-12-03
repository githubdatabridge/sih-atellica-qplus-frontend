import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { makeStyles } from "tss-react/mui";
import { useWindowDimensions } from "@databridge/qplus";
import { Theme } from "@mui/material";

import HeaderSplashScreen from "./HeaderSplashScreen";
import ProductInfoTypography from "./components/typography/ProductInfoTypography";
import VersionNumberTypography from "./components/typography/VersionNumberTypography";
import CopyrightTypography from "./components/typography/CopyrightTypography";
import SplashScreenLoader from "./components/loader/SplashScreenLoader";

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    maxWidth: "1920px !important",
    height: "100%",
    padding: "0px !important",
  },
  content: {
    flexGrow: 1,
    position: "relative",
    backgroundColor: theme?.palette.common.ui7,
    padding: "0px",
  },
  toolbar: {
    minHeight: "72px",
  },
}));

export const SplashScreen = () => {
  const [iHeight, setIHeight] = useState<number>(0);
  const { height } = useWindowDimensions();
  const { classes } = useStyles();

  useEffect(() => {
    setIHeight(height);
    return () => {};
  }, [height]);

  if (iHeight === 0) return null;

  return (
    <Container className={classes.root}>
      <HeaderSplashScreen />
      <main className={classes.content}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ height: `${iHeight - 100}px` }}
          textAlign="center"
        >
          <Box flexDirection="column">
            <Box>
              <ProductInfoTypography />
            </Box>
            <Box>
              <VersionNumberTypography />
            </Box>
            <Box pt={1}>
              <SplashScreenLoader />
            </Box>
          </Box>
        </Box>
        <Box style={{ paddingBottom: "8px", paddingLeft: "8px" }}>
          <CopyrightTypography />
        </Box>
      </main>
    </Container>
  );
};
