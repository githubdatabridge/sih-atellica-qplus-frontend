import { useState, useEffect } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Box, Grid, Paper, Theme } from '@mui/material'
import { QplusDatasetAdministration, useWindowDimensions } from '@databridge/qplus'

const AdminDashboard = () => {
    const { classes } = useStyles()
    const [windowHeight, setWindowHeight] = useState<number>(0)
    const { height } = useWindowDimensions()

    useEffect(() => {
        setWindowHeight(height > 1200 ? 1200 : height - 270)
    }, [height])

    return (
        <Box display="flex" p={3} mt={9}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Paper className={classes.paper} variant="outlined">
                                <Grid container spacing={0}>
                                    <QplusDatasetAdministration height={windowHeight} />
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdminDashboard

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1
    },
    header: {
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);'
    },
    paper: {
        textAlign: 'center',
        border: 'none',
        boxShadow: 'none',
        color: theme.palette.text.secondary,
        borderRadius: '8px'
    },
    list: {
        overflow: 'auto',
        display: 'flex',
        width: '100%',
        padding: '0px',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'left',
        backgroundColor: theme.palette.background.default,
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);'
    },
    listItem: {
        fontWeight: 600,
        padding: '15px 20px',
        fontSize: '14px',
        '&:hover': {
            cursor: 'pointer'
        }
    }
}))
