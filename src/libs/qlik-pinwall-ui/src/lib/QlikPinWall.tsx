import React, { FC, useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useMount } from 'react-use'

import { Box, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQuery } from '@libs/common-hooks'
import { Report } from '@libs/common-models'
import { useAuthContext } from '@libs/common-providers'
import { KEYS, storage } from '@libs/common-utils'
import { reportService } from '@libs/core-services'
import { useQlikLoaderContext } from '@libs/qlik-providers'

import { QlikPinWallFormDialog, QlikPinWallVisualizationPickerDialog } from './components/dialog'
import GridWallProvider from './contexts/GridWallProvider'
import { useQlikPinWallDispatch, useQlikPinWallState } from './contexts/qlik-pin-wall-context'
import { fetchPinWalls, setPinWallableReports } from './contexts/store/pinWall.actions'
import { useReportsGroupByDataset } from './hooks'
import QlikPinWallContent from './QlikPinWallContent'
import QlikPinWallHeader from './QlikPinWallHeader'
import { checkIfHasWriteScopes } from './utils'

export type TQlikPinWallClasses = {
    root?: string
    header?: string
    gridWall?: string
    cell?: string
    actionButton?: string
    actionButtonActive?: string
    refreshButton?: string
    actionsContainer?: string
    datasetContainer?: string
    buttonSave?: string
    buttonCancel?: string
    toolbarIcon?: string
    toolbarIconButton?: string
    vizFootNote?: string
}

export type TQlikPinWallFullscreenOptions = {
    customComponent?: React.ReactElement
}

export interface IQlikPinWallExportOptions {
    types: Array<'xlsx' | 'pdf' | 'png'>
}

export interface IQlikPinWallProps {
    maxNumberOfWalls?: number
    height?: number
    views?: string[]
    fullscreenOptions?: TQlikPinWallFullscreenOptions
    isToolbarWithDivider?: boolean
    showWizardImage?: boolean
    showAppWaterMark?: boolean
    classNames?: Partial<TQlikPinWallClasses>
    exportOptions?: IQlikPinWallExportOptions
    isDisabled?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
    onOpenFullscreen?: () => void
}

export interface IDatasets {
    dsId: number
    dsTitle: string
    reports: Report[]
}

const PinItAppContent: FC<IQlikPinWallProps> = ({
    maxNumberOfWalls,
    height,
    views,
    fullscreenOptions,
    isToolbarWithDivider = false,
    showWizardImage = true,
    showAppWaterMark = true,
    classNames,
    exportOptions,
    isDisabled = false,
    color = 'secondary',
    LoaderComponent
}) => {
    const [mountLoading, setMountLoading] = React.useState<boolean>(true)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [mappedDatasets, setMappedDatasets] = React.useState<IDatasets[]>([])
    const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false)

    const { appUser } = useAuthContext()
    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = useQuery()
    const op = queryParams.get('op') || ''
    const dispatch = useQlikPinWallDispatch()

    const { pinWalls } = useQlikPinWallState()
    const { setReportsByDataset } = useReportsGroupByDataset()

    const pageId = location.pathname

    useMount(async () => {
        let sortedReports = []
        let filterIsSystem = ''
        let filterTemplateId = ''
        try {
            setMountLoading(true)

            // Check if the current user is an admin.
            const isAdmin = storage.load(KEYS.QPLUS_ROLE_IS_ADMIN)

            // Check if the current user has write scopes
            const hasWriteScopes = checkIfHasWriteScopes(appUser, isAdmin)

            // If is admin filter only isSystem reports
            if (isAdmin) {
                filterIsSystem = '&filter[isSystem][eq]=true'

                // If has write scopes filter only isSystem reports with template Id > 0
                if (hasWriteScopes) {
                    filterTemplateId = '&filter[templateId][not]=null'
                }
            }

            // Fetch PinWalls
            await fetchPinWalls(dispatch)

            // Fetch pinwallable reports
            const { data } = await reportService.getAllReports(
                100,
                `?filter[isPinwallable][eq]=true${filterIsSystem}${filterTemplateId}`
            )

            sortedReports = setReportsByDataset(data)
            setMappedDatasets(sortedReports)
            dispatch(setPinWallableReports(data))
        } catch (error) {
            console.log('Qplus Error', error)
        } finally {
            setMountLoading(false)
        }
    })

    useEffect(() => {
        setIsLoading(isQlikMasterItemLoading)
    }, [isQlikMasterItemLoading])

    const onFullscreen = async () => {
        setIsFullscreen(true)
    }

    const onClose = () => {
        const params = new URLSearchParams(window.location.search)
        params.delete('op')
        params.delete('x')
        params.delete('y')
        navigate(`${pageId}?${params.toString()}`)
    }

    const { classes } = useStyles()

    if (mountLoading) return null

    return (
        <Box className={`${classNames?.root}` || ''}>
            <QlikPinWallHeader
                maxNumberOfWalls={maxNumberOfWalls}
                views={views}
                isToolbarWithDivider={isToolbarWithDivider}
                onOpenFullscreen={onFullscreen}
                isDisabled={isDisabled || isLoading || mountLoading}
                color={color}
                classNames={classNames}
                LoaderComponent={LoaderComponent}
            />
            <QlikPinWallContent
                pageId={pageId}
                numberOfPinWalls={pinWalls.length || 0}
                cHeight={height - 52}
                isFullscreen={isFullscreen}
                fullscreenOptions={fullscreenOptions}
                showWizardImage={showWizardImage}
                showAppWaterMark={showAppWaterMark}
                exportOptions={exportOptions}
                pinwallIsLoading={isLoading || mountLoading}
                color={color}
                isFullScreenCloseCallback={() => setIsFullscreen(false)}
                classNames={{
                    ...classNames,
                    toolbarIcon: `${classes?.iconSize || ''} ${classNames?.toolbarIcon || ''}`,
                    toolbarIconButton: `${classes?.iconButtonSize || ''} ${
                        classNames?.toolbarIconButton || ''
                    }`,
                    vizFootNote: `${classNames?.vizFootNote || ''}`
                }}
                LoaderComponent={LoaderComponent}
            />
            {op === 'create' && <QlikPinWallFormDialog classNames={classNames} op="create" />}
            {op === 'edit' && pinWalls.length > 0 && (
                <QlikPinWallFormDialog classNames={classNames} op="edit" />
            )}
            {op === 'pick' && pinWalls.length > 0 && (
                <QlikPinWallVisualizationPickerDialog datasets={mappedDatasets} onClose={onClose} />
            )}
        </Box>
    )
}

const QlikPinWall: FC<IQlikPinWallProps> = ({
    maxNumberOfWalls,
    height,
    views,
    fullscreenOptions,
    isToolbarWithDivider = false,
    showWizardImage = true,
    showAppWaterMark = true,
    classNames,
    color,
    exportOptions
}) => {
    const { classes } = useStyles()
    return (
        <GridWallProvider
            exportOptions={exportOptions}
            showAppWaterMark={showAppWaterMark}
            color={color}
            classNames={{
                toolbarIcon: `${classes?.iconSize || ''} ${classNames?.toolbarIcon || ''}`,
                toolbarIconButton: `${classes?.iconButtonSize || ''} ${
                    classNames?.toolbarIconButton || ''
                }`,
                vizFootNote: `${classNames?.vizFootNote || ''}`
            }}>
            <PinItAppContent
                maxNumberOfWalls={maxNumberOfWalls}
                height={height}
                views={views}
                fullscreenOptions={fullscreenOptions}
                isToolbarWithDivider={isToolbarWithDivider}
                showWizardImage={showWizardImage}
                showAppWaterMark={showAppWaterMark}
                classNames={classNames}
                exportOptions={exportOptions}
                color={color}
            />
        </GridWallProvider>
    )
}

export default QlikPinWall

const useStyles = makeStyles()((theme: Theme) => ({
    iconSize: {},
    iconButtonSize: {}
}))
