import React, { FC, useState, useEffect } from 'react'

import ReactJson from 'react-json-view'
import { useCopyToClipboard } from 'react-use'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import {
    Box,
    Typography,
    Button,
    Menu,
    MenuItem,
    TextField,
    IconButton,
    useTheme,
    Theme,
    darken
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip, useAlertContext, AlertType } from '@libs/common-ui'

import translation from '../../constants/translations'
import { QlikVisualization } from '../visualization/QlikVisualization'

interface IQlikJsonViewerProps {
    id?: number
    qlikAppId: string
    updatePropertiesInMilliseconds?: number
    chart: string
    currentView: JsonViewerEnum
    chartProperties: string
    oldChartProperties: string
    handleViewerInputChangeCallback: (properties: any) => void
}

enum JsonViewerEnum {
    CODE = 'code',
    JSON = 'json',
    VIEW = 'chart'
}

export const QlikJsonViewer: FC<IQlikJsonViewerProps> = React.memo(
    ({
        id,
        qlikAppId,
        chart,
        chartProperties,
        updatePropertiesInMilliseconds = 0,
        oldChartProperties,
        currentView = JsonViewerEnum.CODE,
        handleViewerInputChangeCallback
    }) => {
        const [isError, setIsError] = useState<boolean>(false)
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
        const [readyChart, setReadyChart] = useState<string>('')
        const [readyChartProperties, setReadyChartProperties] = useState<string>('{}')
        const [oldReadyChartProperties, setOldReadyChartProperties] = useState<string>('{}')
        const isMenuOpen = Boolean(anchorEl)
        const [viewer, setViewer] = useState<JsonViewerEnum>(currentView)
        const { t } = useI18n()
        const [value, copy] = useCopyToClipboard()
        const { showToast } = useAlertContext()

        const isObjectEmptyHelper = obj => {
            return Object.keys(obj).length === 0
        }

        const isJSON = str => {
            try {
                return JSON.parse(str) && !!str
            } catch (e) {
                return false
            }
        }

        useEffect(() => {
            setViewer(currentView)
            setIsError(false)
        }, [currentView, id])

        useEffect(() => {
            if (readyChart !== chart) {
                setReadyChart(chart)
                setReadyChartProperties(chartProperties)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [chart])

        useEffect(() => {
            if (updatePropertiesInMilliseconds > 0) {
                setReadyChartProperties(chartProperties)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [updatePropertiesInMilliseconds])

        useEffect(() => {
            setOldReadyChartProperties(oldChartProperties)
        }, [oldChartProperties])

        const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
        }

        const handleMenuCloseClick = () => {
            setAnchorEl(null)
        }

        const handleMenuItemClick = value => {
            setViewer(
                value === 'code'
                    ? JsonViewerEnum.CODE
                    : value === 'json'
                    ? JsonViewerEnum.JSON
                    : JsonViewerEnum.VIEW
            )
            setAnchorEl(null)
        }

        const handleCopyCodeClick = () => {
            if (readyChartProperties) {
                copy(readyChartProperties)
                showToast(t(translation.datasetReadyChartCopyCodeValue), AlertType.SUCCESS)
            }
        }

        const handleRestoreCodeClick = () => {
            setReadyChartProperties(JSON.stringify(oldReadyChartProperties))
            handleViewerInputChangeCallback(oldChartProperties)
        }

        const handleCleanCodeClick = () => {
            setReadyChartProperties('{}')
            handleViewerInputChangeCallback({})
        }

        const handleOnPropertiesChange = (value = '{}') => {
            setReadyChartProperties(value)
            if (isJSON(value)) {
                const jsonValue = JSON.parse(value)
                if (jsonValue?.qInfo) {
                    // Remove qId as this can lead to wrong behaviour when using the Qlik Visualizaton Api to render a chart
                    jsonValue.qInfo.qPlus = jsonValue?.qInfo?.qId || ''
                    jsonValue.qInfo.qTimestamp = new Date().valueOf()
                    delete jsonValue?.qInfo?.qId
                }
                handleViewerInputChangeCallback(jsonValue)
                setIsError(false)
            } else {
                setIsError(true)
            }
        }

        const { classes } = useStyles()
        const theme = useTheme()

        return (
            <>
                <Box className={classes.toolbar}>
                    <Box flexGrow={1}>
                        <Box display="flex" alignItems="center">
                            <Box>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={isMenuOpen ? 'code-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={isMenuOpen ? 'true' : undefined}
                                    onClick={handleMenuClick}
                                    endIcon={<ArrowDropDownIcon />}>
                                    {viewer === JsonViewerEnum.CODE
                                        ? 'Code'
                                        : viewer === JsonViewerEnum.VIEW
                                        ? 'View'
                                        : 'Json'}
                                </Button>
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={isMenuOpen}
                                    onClose={handleMenuCloseClick}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}>
                                    <MenuItem onClick={() => handleMenuItemClick('code')}>
                                        {t(translation.datasetReadyChartCode)}
                                    </MenuItem>
                                    <MenuItem onClick={() => handleMenuItemClick('json')}>
                                        {t(translation.datasetReadyChartJson)}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick('view')}
                                        disabled={isError || readyChartProperties === '{}'}>
                                        {t(translation.datasetReadyChartView)}
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Box>

                    {isError && (
                        <Box display="flex" alignItems="center" mr={2}>
                            <Typography
                                style={{
                                    color: theme.palette.error.main,
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                {t(translation.datasetReadyChartJsonErrorMsg)}
                            </Typography>
                        </Box>
                    )}
                    <Box display="flex" alignItems="center">
                        <IconTooltip title={t(translation.datasetReadyChartRestoreTooltip)}>
                            <IconButton
                                color="primary"
                                edge="end"
                                aria-label="copy"
                                className={classes.toolbarButton}
                                onClick={handleRestoreCodeClick}>
                                <SettingsBackupRestoreIcon className={classes.toolbarIcon} />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconTooltip title={t(translation.datasetReadyChartCleanTooltip)}>
                            <IconButton
                                color="primary"
                                edge="end"
                                aria-label="clean"
                                onClick={handleCleanCodeClick}
                                className={classes.toolbarButton}
                                disabled={isObjectEmptyHelper(readyChartProperties)}>
                                <CleaningServicesIcon className={classes.toolbarIcon} />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconTooltip title={t(translation.datasetReadyChartCopyTooltip)}>
                            <IconButton
                                color="primary"
                                edge="end"
                                aria-label="copy"
                                className={classes.toolbarButton}
                                disabled={isObjectEmptyHelper(readyChartProperties)}
                                onClick={handleCopyCodeClick}>
                                <ContentCopyIcon className={classes.toolbarIcon} />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                </Box>
                <Box
                    className={
                        viewer === JsonViewerEnum.VIEW
                            ? classes.listContainerLight
                            : classes.listContainerDark
                    }>
                    {viewer === JsonViewerEnum.JSON ? (
                        <ReactJson
                            src={
                                isJSON(readyChartProperties)
                                    ? JSON.parse(readyChartProperties)
                                    : {
                                          error: t(translation.datasetReadyChartJsonErrorMsg)
                                      }
                            }
                            theme="brewer"
                            collapsed={true}
                            style={{ fontSize: '0.75rem', maxWidth: '750px' }}
                        />
                    ) : viewer === JsonViewerEnum.CODE ? (
                        <TextField
                            aria-label="readyChart"
                            placeholder={'{}'}
                            value={
                                readyChartProperties
                                    ? isJSON(readyChartProperties)
                                        ? JSON.stringify(JSON.parse(readyChartProperties), null, 2)
                                        : readyChartProperties
                                    : '{}'
                            }
                            onChange={e => handleOnPropertiesChange(e.target.value)}
                            InputProps={{
                                className: classes.codeInput
                            }}
                            className={classes.codeTextField}
                            multiline
                            maxRows={Infinity}
                        />
                    ) : (
                        <Box>
                            <QlikVisualization
                                qlikAppId={qlikAppId}
                                properties={readyChartProperties}
                            />
                        </Box>
                    )}
                </Box>
            </>
        )
    }
)

const useStyles = makeStyles()((theme: Theme) => ({
    listContainerDark: {
        minHeight: '315px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        overflowY: 'scroll',
        backgroundColor: 'black'
    },
    listContainerLight: {
        minHeight: '315px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'black'
    },
    codeTextField: {
        backgroundColor: 'black',
        width: '100%',
        maxWidth: '750px'
    },
    codeInput: {
        color: '#FFF',
        fontSize: '0.75rem'
    },
    toolbar: {
        backgroundColor: darken(theme.palette.background.default, 0.02),
        paddingLeft: '4px',
        paddingRight: '4px',
        color: theme.palette.text.primary,
        width: '100%',
        display: 'flex'
    },
    toolbarButton: {
        marginRight: '15px',
        height: '20px',
        width: '20px'
    },
    toolbarIcon: {
        height: '20px',
        width: '20px'
    }
}))
