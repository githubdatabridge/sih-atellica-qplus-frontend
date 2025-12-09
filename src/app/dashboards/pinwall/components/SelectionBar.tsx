import { ReactElement, useEffect, useState } from "react";
import {
    Box,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import ClearIcon from "@mui/icons-material/DeleteForever";
import { Theme, useTheme } from "@mui/material/styles";

import { QplusSelectionBar, useQplusAppContext, useQplusSelectionContext } from "@databridge/qplus";
import { useStyles } from "./SelectionBar.styles";

interface Props {
    isVertical?: boolean;
}

function SelectionBar({ isVertical = false }: Props): ReactElement {
    const [selectionCounter, setSelectionCounter] = useState<number>(0);
    const [dockedFieldsCounter, setDockedFieldsCounter] = useState<number>(0);
    const { qAppMap } = useQplusAppContext();
    const { qGlobalSelectionCount, qGlobalDockedFields } = useQplusSelectionContext();

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
                    <ListItemText primary="Active Filters" className={classes.listItemText} />
                    <ListItemIcon>
                        <IconButton
                            color="primary"
                            onClick={() => handleClearAllClick()}
                            disabled={selectionCounter === 0}
                            className={classes.iconButton}>
                            <ClearIcon />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
            </List>
            {selectionCounter === 0 && dockedFieldsCounter === 0 ? (
                <Box textAlign="center">
                    <Typography className={classes.emptyText}>No filters available!</Typography>
                </Box>
            ) : (
                <Box className={classes.selectionBar} display="flex" flexGrow={1}>
                    <QplusSelectionBar
                        isVertical={isVertical}
                        showSelectedValues
                        showAppWaterMark
                        color="secondary"
                        cssTabs={{
                            marginTop: "-20px",
                            background: theme.palette.primary.main
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
                            backgroundColor: "#e4e7ea"
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
                            backgroundColor: "#e4e7ea"
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
                            backgroundColor: "#e4e7ea"
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
                            backgroundColor: "#e4e7ea"
                        }}
                        tooltipOptions={{
                            isNative: true
                        }}
                    />
                </Box>
            )}
        </Box>
    );

    return <>{list()}</>;
}

export default SelectionBar;
