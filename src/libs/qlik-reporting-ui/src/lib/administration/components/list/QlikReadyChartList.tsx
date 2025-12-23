import React, { FC, useState, useEffect, useCallback } from 'react'

import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    darken,
    ListItemSecondaryAction,
    IconButton,
    useTheme,
    Theme,
    Backdrop,
    InputBase,
    CircularProgress
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip, AlertType, useAlertContext, ConfirmationDialog } from '@libs/common-ui'

import { REPORTING_BASE_CHARTS } from '../../../constants/constants'
import translation from '../../constants/translations'
import { QlikReadyChartOperationEnum, JsonViewerEnum, TQlikReadyChart } from '../../model'

interface IQlikReadyChartListProps {
    datasetId: number
    chartsMap: Map<string, TQlikReadyChart>
    selectedChart?: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    handleReadyChartsCallback: (
        viewer: JsonViewerEnum,
        readyChartsMap?: Map<string, TQlikReadyChart>,
        value?: string,
        properties?: any,
        isDeleted?: boolean
    ) => void
}

export const QlikReadyChartList: FC<IQlikReadyChartListProps> = React.memo(
    ({ datasetId = 0, chartsMap, selectedChart, color, handleReadyChartsCallback }) => {
        const [isUpdating, setIsUpdating] = useState<boolean>(false)
        const [isDeleting, setIsDeleting] = useState<boolean>(false)
        const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

        const [readyCharts, setReadyCharts] = useState<string[]>([])
        const [isValid, setIsValid] = useState<boolean>(false)
        const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false)
        const [oldReadyChartValue, setOldReadyChartValue] = React.useState<string>('')
        const [newReadyChartValue, setNewReadyChartValue] = React.useState<string>('')
        const [readyChartsMap, setReadyChartsMap] = React.useState<Map<string, TQlikReadyChart>>(
            new Map<string, TQlikReadyChart>()
        )
        const [crud, setCrud] = React.useState<string>('')
        const { t } = useI18n()
        const { showToast } = useAlertContext()

        const validateInputStringHelper = str => {
            return !/\s/g.test(str) && str !== ''
        }

        const isChartRemovedHelper = useCallback(
            (chart: string) => {
                for (const [key, value] of readyChartsMap) {
                    return key === chart && value?.mark === QlikReadyChartOperationEnum.REMOVE
                }
            },
            [readyChartsMap]
        )

        useEffect(() => {
            const newMap = new Map<string, TQlikReadyChart>()
            const charts = []
            for (const [key, value] of chartsMap) {
                if (value?.mark === QlikReadyChartOperationEnum.CHANGE_NAME) {
                    charts.push(value.markParam)
                    newMap.set(key, {
                        name: value.name,
                        mark: value.mark,
                        properties: value.properties,
                        markParam: value.markParam
                    })
                } else if (value?.mark === QlikReadyChartOperationEnum.CREATE) {
                    charts.push(value.name)
                    newMap.set(key, {
                        name: value.name,
                        mark: value.mark,
                        properties: value.properties
                    })
                } else if (value?.mark === QlikReadyChartOperationEnum.REMOVE) {
                    newMap.set(key, {
                        name: value.name,
                        mark: value.mark,
                        properties: value.properties
                    })
                } else {
                    charts.push(value.name)
                    newMap.set(key, {
                        name: value.name,
                        properties: value.properties
                    })
                }
            }
            setReadyCharts(charts)
            setReadyChartsMap(newMap)
            return () => {
                setReadyChartsMap(null)
            }
        }, [chartsMap])

        const handleNewReadyChartClick = () => {
            setCrud('new')
            setNewReadyChartValue('')
            setIsValid(false)
            setIsPopoverVisible(true)
        }

        const handleEditReadyChartClick = value => () => {
            setCrud('edit')
            setNewReadyChartValue(value)
            setOldReadyChartValue(value)
            setIsValid(true)
            setIsPopoverVisible(true)
        }

        const handleOnChangeInputText = useCallback(
            value => {
                setNewReadyChartValue(value)
                setIsValid(
                    (validateInputStringHelper(value) &&
                        !REPORTING_BASE_CHARTS.includes(value) &&
                        !readyCharts.includes(value)) ||
                        oldReadyChartValue === value
                )
            },
            [readyCharts, oldReadyChartValue]
        )

        const handleSaveReadyChartClick = () => {
            try {
                setIsUpdating(true)
                const newMap = new Map(readyChartsMap)
                const charts = [...readyCharts]
                let properties = '{}'
                if (!isValid) return
                if (crud === 'new') {
                    charts.push(newReadyChartValue)
                    newMap.set(newReadyChartValue, {
                        name: newReadyChartValue,
                        properties: {},
                        mark: QlikReadyChartOperationEnum.CREATE
                    })
                    setReadyCharts(charts)
                } else {
                    if (newReadyChartValue !== oldReadyChartValue) {
                        const newMapValue = newMap.get(oldReadyChartValue)
                        const oldName = newMapValue.name
                        const mark = newMapValue.mark
                        const value = readyChartsMap.get(oldReadyChartValue)
                        const currentIndex = readyCharts.indexOf(oldReadyChartValue)
                        const newChecked = [...readyCharts]
                        newChecked.splice(currentIndex, 1)
                        newChecked.push(newReadyChartValue)
                        newMap.delete(oldReadyChartValue)
                        newMap.set(newReadyChartValue, {
                            name:
                                mark === QlikReadyChartOperationEnum.CREATE
                                    ? newReadyChartValue
                                    : oldName,
                            properties: value.properties,
                            mark:
                                mark === QlikReadyChartOperationEnum.CREATE
                                    ? mark
                                    : QlikReadyChartOperationEnum.CHANGE_NAME,
                            ...(mark !== QlikReadyChartOperationEnum.CREATE && {
                                markParam: newReadyChartValue
                            })
                        })
                        properties = JSON.stringify(value.properties)
                        setReadyCharts(newChecked)
                    }
                }
                setIsValid(false)
                setNewReadyChartValue(newReadyChartValue)
                setIsPopoverVisible(false)
                setReadyChartsMap(newMap)
                handleReadyChartsCallback(
                    JsonViewerEnum.CODE,
                    newMap,
                    newReadyChartValue,
                    properties
                )
            } catch (error) {
                showToast(`${error?.status}! ${error.message}`, AlertType.ERROR)
            } finally {
                setIsUpdating(false)
            }
        }

        const handleDeleteReadyChartClick = value => {
            try {
                setIsDeleting(true)
                const currentIndex = readyCharts.indexOf(value)
                const newChecked = [...readyCharts]

                if (currentIndex === -1) {
                    newChecked.push(value)
                } else {
                    newChecked.splice(currentIndex, 1)
                }

                setReadyCharts(newChecked)
                const newMap = new Map(readyChartsMap)
                const newMapValue = newMap.get(value)
                if (datasetId > 0 && newMapValue?.mark !== QlikReadyChartOperationEnum.CREATE) {
                    newMap.set(value, {
                        name: newMapValue.name,
                        properties: newMapValue.properties,
                        mark: QlikReadyChartOperationEnum.REMOVE
                    })
                } else {
                    newMap.delete(value)
                }
                setReadyChartsMap(newMap)
                setDeleteDialogOpen(false)
                handleReadyChartsCallback(null, newMap, '', '{}', true)
            } catch (error) {
                showToast(
                    t(translation.daasetReadyChartDeeleteConfirmationPrimaryText),
                    AlertType.ERROR
                )
            } finally {
                setIsDeleting(false)
            }
        }

        const handleSelectReadyChartRow = value => {
            if (value) {
                const mapValue = readyChartsMap.get(value)?.properties || {}
                handleReadyChartsCallback(
                    JsonViewerEnum.CODE,
                    readyChartsMap,
                    value,
                    JSON.stringify(mapValue || {})
                )
            }
        }

        const handleDeleteConfirmationDialogClose = () => {
            setDeleteDialogOpen(false)
        }

        const handleDeleteConfirmationDialog = (chart: string) => {
            const newMap = new Map(readyChartsMap)
            const value = newMap.get(chart)
            if (datasetId > 0 && value?.mark === QlikReadyChartOperationEnum.CREATE) {
                handleDeleteReadyChartClick(chart)
            } else if (datasetId > 0) {
                setDeleteDialogOpen(true)
            } else {
                handleDeleteReadyChartClick(chart)
            }
        }

        const { classes } = useStyles()
        const theme = useTheme()

        return (
            <Box>
                <Box display="flex">
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography className={classes.primaryText}>
                            {t(translation.datasetReadyChart)}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            className={classes.buttonAdd}
                            title="Add"
                            onClick={() => handleNewReadyChartClick()}>
                            {t(translation.datasetReadyChartAddBtn)}
                        </Button>
                    </Box>
                </Box>

                <Box className={classes.listCustomChartsContainer}>
                    <List>
                        {readyCharts
                            ?.sort((a, b) => (a > b ? 1 : -1))
                            ?.map((chart, index) => {
                                return (
                                    !isChartRemovedHelper(chart) && (
                                        <ListItem
                                            key={chart}
                                            role={undefined}
                                            dense
                                            button
                                            className={classes.listItem}
                                            style={{
                                                backgroundColor:
                                                    chart === selectedChart
                                                        ? theme.palette.info.main
                                                        : null
                                            }}
                                            onClick={() => handleSelectReadyChartRow(chart)}>
                                            <ListItemText
                                                id={chart}
                                                primary={chart}
                                                classes={{
                                                    primary:
                                                        chart === selectedChart
                                                            ? classes.listItemTextSelected
                                                            : classes.listItemText
                                                }}
                                            />
                                            <ListItemSecondaryAction
                                                style={{ marginRight: '20px' }}>
                                                <IconTooltip
                                                    title={t(
                                                        translation.datasetReadyChartEditTooltip
                                                    )}>
                                                    <IconButton
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            color:
                                                                chart === selectedChart
                                                                    ? theme.palette.info
                                                                          .contrastText
                                                                    : theme.palette.text.primary
                                                        }}
                                                        edge="end"
                                                        aria-label="edit"
                                                        size="small"
                                                        onClick={handleEditReadyChartClick(chart)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </IconTooltip>
                                            </ListItemSecondaryAction>
                                            <ListItemSecondaryAction
                                                classes={{ root: classes.listSecondaryActionRoot }}>
                                                <IconTooltip
                                                    title={t(
                                                        translation.datasetReadyChartRemoveTooltip
                                                    )}>
                                                    <IconButton
                                                        color="primary"
                                                        edge="end"
                                                        aria-label="delete"
                                                        style={{
                                                            backgroundColor: 'transparent',
                                                            color:
                                                                chart === selectedChart
                                                                    ? theme.palette.info
                                                                          .contrastText
                                                                    : theme.palette.text.primary
                                                        }}
                                                        size="small"
                                                        onClick={() =>
                                                            handleDeleteConfirmationDialog(chart)
                                                        }>
                                                        {isDeleting ? (
                                                            <CircularProgress
                                                                color={color}
                                                                size={16}
                                                                className={
                                                                    classes.buttonProgressDelete
                                                                }
                                                            />
                                                        ) : (
                                                            <DeleteIcon />
                                                        )}
                                                    </IconButton>
                                                </IconTooltip>
                                                {deleteDialogOpen && (
                                                    <ConfirmationDialog
                                                        primaryText={t(
                                                            translation.daasetReadyChartDeeleteConfirmationPrimaryText
                                                        )}
                                                        hideBackdrop={true}
                                                        noText={t(
                                                            translation.datasetReadyChartDeleteConfirmatonNo
                                                        )}
                                                        yesText={t(
                                                            translation.datasetReadyChartDeleteConfirmatonYes
                                                        )}
                                                        dialogTitleText={t(
                                                            translation.datasetReadyChartConfirmationDialog
                                                        )}
                                                        onClose={
                                                            handleDeleteConfirmationDialogClose
                                                        }
                                                        onNo={handleDeleteConfirmationDialogClose}
                                                        onYes={() => {
                                                            handleDeleteReadyChartClick(chart)
                                                        }}
                                                    />
                                                )}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                )
                            })}
                    </List>
                </Box>
                {isPopoverVisible && (
                    <Backdrop
                        sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                        open={isPopoverVisible}>
                        <Box className={classes.popoverContainer}>
                            <Box className={classes.popoversHeader}>
                                <Typography className={classes.popoverTitleContainer}>
                                    {t(translation.datasetReadyChartAdd)}
                                </Typography>
                            </Box>
                            <Box display="flex" className={classes.popoverReadyChartContainer}>
                                <Typography className={classes.popoverReadyChartTitle}>
                                    {t(translation.datasetReadyChartName)}
                                </Typography>
                                <Box flexGrow={1}>
                                    <InputBase
                                        className={classes.popoverInput}
                                        placeholder={t(translation.datasetReadyChartPlaceholderNew)}
                                        inputProps={{ 'aria-label': 'ready chart' }}
                                        error={isValid}
                                        onChange={e =>
                                            handleOnChangeInputText(e.target.value.toLowerCase())
                                        }
                                        value={newReadyChartValue}
                                    />
                                </Box>
                            </Box>

                            <Box pl={2} pt={1} pr={2} minHeight="25px">
                                {!isValid && newReadyChartValue !== '' && (
                                    <Typography
                                        style={{
                                            color: theme.palette.error.main,
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                        {t(translation.datasetReadyChartNameErrorMsg)}
                                    </Typography>
                                )}
                            </Box>

                            <Box className={classes.popoverButtonContainer}>
                                <Button
                                    onClick={() => setIsPopoverVisible(false)}
                                    className={classes.popoverButtonCancel}>
                                    {t(translation.datasetBtnCancel)}
                                </Button>
                                <Button
                                    onClick={() => handleSaveReadyChartClick()}
                                    className={classes.popoverButtonSave}
                                    disabled={!isValid}>
                                    {isUpdating ? (
                                        <CircularProgress
                                            color={color}
                                            size={16}
                                            className={classes.buttonProgressUpdate}
                                        />
                                    ) : (
                                        t(translation.datasetBtnSave)
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </Backdrop>
                )}
            </Box>
        )
    }
)

const useStyles = makeStyles()((theme: Theme) => ({
    primaryText: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '14px'
    },

    listCustomChartsContainer: {
        marginTop: '5px',
        height: '130px',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        overflowY: 'scroll',
        backgroundColor: darken(theme.palette.background.default, 0.025)
    },
    listItemText: {
        color: theme.palette.text.primary,
        fontSize: '0.875rem'
    },
    listItemTextSelected: {
        color: theme.palette.info.contrastText,
        fontSize: '0.875rem'
    },

    listItem: {
        paddingTop: '2px',
        paddingBottom: '2px',
        fontSize: '0.82rem',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },

    buttonAdd: {
        paddingLeft: '15px',
        paddingRight: '15px',
        height: '24px',
        borderRadius: '4px',
        minWidth: '75px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.main,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.main,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.main,
            boxShadow: 'none'
        },
        '&:disabled': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.disabled,
            boxShadow: 'none'
        }
    },
    popoverContainer: {
        position: 'absolute',
        width: '400px',
        height: '200px',
        top: '275px',
        right: '200px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: darken(theme.palette.background.paper, 0),
        zIndex: 1
    },
    popoversHeader: {
        padding: '8px',
        marginBottom: '15px',
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    popoverTitleContainer: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    popoverReadyChartContainer: {
        marginLeft: '8px',
        marginRight: '8px',
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        height: '40px',
        padding: '8px',
        paddingTop: '10px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    popoverReadyChartTitle: {
        position: 'absolute',
        fontSize: '10px',
        top: '56px',
        left: '12px'
    },
    popoverInput: {
        color: theme.palette.text.primary,
        width: '-webkit-fill-available',
        marginLeft: theme.spacing(1),
        flex: 1,
        height: '24px',
        fontSize: '14px'
    },
    popoverButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: '8px',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: '20px'
    },
    popoverButtonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:disabled': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.disabled,
            boxShadow: 'none'
        }
    },
    popoverButtonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        minWidth: '96px',
        height: '36px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        }
    },
    listSecondaryActionRoot: {
        right: '5px'
    },
    buttonProgressUpdate: {
        color: theme.palette.secondary.contrastText
    },
    buttonProgressDelete: {
        color: theme.palette.text.primary
    }
}))
