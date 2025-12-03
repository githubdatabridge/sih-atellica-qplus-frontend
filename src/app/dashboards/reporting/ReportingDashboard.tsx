import React, { useEffect, useState, useMemo } from 'react'
import { useMount } from 'react-use'
import { makeStyles } from 'tss-react/mui'
import { Grid, Paper } from '@mui/material'
import { useQplusSelectionContext, useWindowDimensions, QplusReporting } from '@databridge/qplus'
import { Theme } from '@mui/material'

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from 'app/common/config'
import { useAppContext } from 'app/context/AppContext'
import DashboardTemplate from '../shared/components/DashboardTemplate'

const ReportingDashboard = () => {
    const PAGE_NAME = 'reporting'
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [qlikAppId, setQlikAppId] = useState<string>('')
    const [windowHeight, setWindowHeight] = useState<number>(0)
    const { height } = useWindowDimensions()
    const { setDockedFields, setMultiAppFields } = useQplusSelectionContext()
    const { isHeaderVisible, pages } = useAppContext()

    const views = useMemo(
        () => [
            'Filter',
            'Comments',
            'ImportExport',
            'Share',
            'Clone',
            'Erase',
            'Reports',
            'Remove',
            'Cancel',
            'Edit',
            'Save'
        ],
        []
    )

    useMount(async () => {
        setIsLoading(true)
        setDockedFields([])
        setMultiAppFields([])
        setIsLoading(false)
    })

    useEffect(() => {
        if (pages) {
            setQlikAppId(pages!.get(PAGE_NAME) || '')
        }
    }, [pages])

    useEffect(() => {
        setWindowHeight(height - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED))
    }, [height, isHeaderVisible])

    const { classes } = useStyles()

    if (windowHeight === 0 || isLoading) return null

    return (
        <DashboardTemplate>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Paper className={classes.paper} variant="outlined">
                                <Grid container spacing={0}>
                                    <QplusReporting
                                        height={windowHeight - 85}
                                        views={views}
                                        showSignature={false}
                                        exportOptions={{
                                            types: ['xlsx', 'png']
                                        }}
                                        qlikAppId={qlikAppId}
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DashboardTemplate>
    )
}

export default ReportingDashboard

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        flexGrow: 1
    },
    reportingRoot: {
        border: '1px solid red'
    },
    header: {
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);'
    },
    paper: {
        textAlign: 'center',
        border: 'none',
        boxShadow: 'none',
        color: theme.palette.text.secondary,
        margin: '8px',
        borderRadius: '8px'
    }
}))
