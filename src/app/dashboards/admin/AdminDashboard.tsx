import { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";

import { QplusDatasetAdministration, useWindowDimensions } from "@databridge/qplus";
import { useStyles } from "./AdminDashboard.styles";

function AdminDashboard() {
    const { classes } = useStyles();
    const { height } = useWindowDimensions();
    const [windowHeight, setWindowHeight] = useState<number>(0);

    useEffect(() => {
        setWindowHeight(height > 1200 ? 1200 : height - 270);
    }, [height]);

    return (
        <Box display="flex" p={3} mt={9}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Paper className={classes.paper} variant="outlined">
                                <Grid container spacing={0}>
                                    <QplusDatasetAdministration
                                        height={windowHeight}
                                        isExportVisible
                                        color="secondary"
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminDashboard;
