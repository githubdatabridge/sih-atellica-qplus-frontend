import React, { ReactElement, useState, useEffect } from "react";
import { makeStyles } from "tss-react/mui";
import { Theme, useTheme } from "@mui/material/styles";
import { Box, IconButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/DeleteForever";

import {
  QplusSelectionBar,
  useQplusSelectionContext,
  useQplusAppContext,
} from "@databridge/qplus";

interface Props {
  isVertical?: boolean;
}

function SelectionBar({ isVertical = false }: Props): ReactElement {
  const [selectionCounter, setSelectionCounter] = useState<number>(0);
  const [dockedFieldsCounter, setDockedFieldsCounter] = useState<number>(0);
  const { qAppMap } = useQplusAppContext();
  const { qGlobalSelectionCount, qGlobalDockedFields } =
    useQplusSelectionContext();

  useEffect(() => {
    setSelectionCounter(qGlobalSelectionCount);
  }, [qGlobalSelectionCount]);

  useEffect(() => {
    setDockedFieldsCounter(qGlobalDockedFields.length);
  }, [qGlobalDockedFields]);

  const handleClearAllClick = () => {
    for (const [, value] of qAppMap) {
      value?.qApi?.clearAll();
    }
  };

  const theme = useTheme<Theme>();
  const { classes } = useStyles();

  const list = () => (
    <Box className={classes.container} role="presentation">
      <List classes={{ root: classes.list }}>
        <ListItem className={classes.listItem}>
          <ListItemText
            primary="Active Filters"
            className={classes.listItemText}
          />
          <ListItemIcon>
            <IconButton
              color="primary"
              onClick={() => handleClearAllClick()}
              disabled={selectionCounter === 0}
              className={classes.iconButton}
            >
              <ClearIcon />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </List>
      {selectionCounter === 0 && dockedFieldsCounter === 0 ? (
        <Box textAlign="center">
          <Typography className={classes.emptyText}>
            No filters available!
          </Typography>
        </Box>
      ) : (
        <Box className={classes.selectionBar} display="flex" flexGrow={1}>
          <QplusSelectionBar
            isVertical={isVertical}
            showSelectedValues={true}
            showAppWatermark={true}
            color="secondary"
            cssTabs={{
              marginTop: "-20px",
              background: theme.palette.primary.main,
            }}
            cssChipGlobal={{
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: 0,
              height: "40px",
              borderWidth: "0px",
              marginRight: "10px",
              borderRadius: "25px",
              backgroundColor: "#e4e7ea",
            }}
            cssChipFixed={{
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: 0,
              height: "40px",
              borderWidth: "0px",
              marginRight: "10px",
              borderRadius: "25px",
              backgroundColor: "#e4e7ea",
            }}
            cssChipDocked={{
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: 0,
              height: "40px",
              borderWidth: "0px",
              marginRight: "10px",
              borderRadius: "25px",
              backgroundColor: "#e4e7ea",
            }}
            cssChipSelected={{
              color: "#000",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: 0,
              height: "40px",
              borderWidth: "0px",
              marginRight: "10px",
              borderRadius: "25px",
              backgroundColor: "#e4e7ea",
            }}
          />
        </Box>
      )}
    </Box>
  );

  return <>{list()}</>;
}

const useStyles = makeStyles()((theme: Theme) => ({
  selectionBar: {
    boxShadow: "none",
    backgroundColor: "transparent",
    zIndex: 99999,
    width: "100%",
    marginTop: "-55px",
  },
  container: {
    width: 250,
  },
  list: {
    backgroundColor: theme.palette.primary.main,
  },
  listItem: {
    paddingLeft: "30px",
    backgroundColor: theme.palette.primary.main,
    cursor: "default",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
    zIndex: 999,
  },
  listItemText: {
    width: "100%",
    textAlign: "start",
    "& span": {
      fontSize: "0.925rem",
      fontWeight: 600,
      color: theme.palette.primary.contrastText,
    },
  },
  iconButton: {
    color: theme.palette.primary.contrastText,
  },
  emptyText: {
    color: theme.palette.primary.contrastText,
    fontSize: "0.825rem",
    fontStyle: "italic",
  },
}));

export default SelectionBar;
