import React, { useEffect, useMemo } from 'react'
import { useMount } from 'react-use'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material'
import {
    QplusPinWall,
    useQplusAppContext,
    useQplusSelectionContext,
    useWindowDimensions
} from '@databridge/qplus'

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from 'app/common/config'
import { useAppContext } from 'app/context/AppContext'
import SelectionBar from './components/SelectionBar'
import DashboardTemplate from '../shared/components/DashboardTemplate'

const PinwallDashboard = React.memo(() => {
    const { defaultFilters, isHeaderVisible } = useAppContext()
    const { qAppMap } = useQplusAppContext()
    const { setDockedFields } = useQplusSelectionContext()

    const [windowHeight, setWindowHeight] = React.useState<number>(0)
    const { height } = useWindowDimensions()

    const views = useMemo(
        () => [
            'Filter',
            'Favorite',
            'Erase',
            'Delete',
            'Edit',
            'Clone',
            'Cancel',
            'Add',
            'Fullscreen'
        ],
        []
    )

    const { classes } = useStyles()

    useMount(async () => {
        for (const [, value] of qAppMap) {
            value?.qApi.clearAll()
        }

        setDockedFields([])
    })

    useEffect(() => {
        setWindowHeight(height - (isHeaderVisible ? OFFSET_EXPANDED : OFFSET_COLLAPSED))
    }, [height, isHeaderVisible])

    return (
        <DashboardTemplate>
            <QplusPinWall
                defaultFilters={defaultFilters}
                views={views}
                height={windowHeight - 45}
                isToolbarWithDivider={false}
                showAppWatermark={true}
                classNames={{
                    sideDrawerPaper: classes.sideDrawerPaper
                }}
                filterNode={<SelectionBar isVertical={true} />}
                exportOptions={{
                    types: ['xlsx', 'pdf', 'png']
                }}
            />
        </DashboardTemplate>
    )
})

export default PinwallDashboard

const useStyles = makeStyles()((theme: Theme) => ({
    header: {
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);'
    },
    headerPinwall: {
        backgroundColor: `${theme.palette.common.white} !important`
    },
    gridWall: {
        background: theme.palette.common.highlight5
    },
    sideDrawerPaper: {
        background: theme.palette.primary.main
    }
}))
