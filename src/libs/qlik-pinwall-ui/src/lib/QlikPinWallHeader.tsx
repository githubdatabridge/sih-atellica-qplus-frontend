import React, { FC, useCallback, useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import AddIcon from '@mui/icons-material/AddPhotoAlternate'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CopyIcon from '@mui/icons-material/FileCopy'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import InfoIcon from '@mui/icons-material/Info'
import RefreshIcon from '@mui/icons-material/Refresh'
import SaveIcon from '@mui/icons-material/Save'
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material'
import { darken, useTheme, Theme } from '@mui/material/styles'

import { uniq } from 'lodash-es'
import querystring from 'query-string'
import { makeStyles } from 'tss-react/mui'

import { useQuery } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { ConfirmationDialog, IconTooltip } from '@libs/common-ui'
import { PinWall } from '@libs/core-models'
import { pinWallService } from '@libs/core-services'
import { QlikFilterDialog } from '@libs/qlik-base-ui'
import { useQlikBootstrapContext, useQlikSelectionContext } from '@libs/qlik-providers'

import {
    URL_QUERY_PARAM_PINWALL_ID,
    URL_QUERY_PARAM_TYPE,
    URL_QUERY_PARAM_VALUE_TYPE_PINWALL
} from './constants/constants'
import translation from './constants/translations'
import { useGridWallContext, useQlikPinWallDispatch, useQlikPinWallState } from './contexts'
import { useQlikPinWallUiContext } from './contexts/QlikPinWallUiContext'
import {
    addPinWall,
    deletePinWall,
    executeUpdating,
    getPinWallFilters,
    refreshPinWall,
    setActivePinWall,
    setPinWallRefreshInMilliseconds,
    updatePinWall
} from './contexts/store/pinWall.actions'
import { useReplaceQueryParams } from './hooks'
import { IQlikPinWallProps } from './QlikPinWall'

const PinWallHeader: FC<IQlikPinWallProps> = ({
    maxNumberOfWalls = 10,
    views = [
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
    onOpenFullscreen,
    isToolbarWithDivider,
    isDisabled,
    classNames,
    color,
    LoaderComponent
}) => {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [eraseDialogOpen, setEraseDialogOpen] = useState<boolean>(false)
    const [cloneDialogOpen, setCloneDialogOpen] = useState<boolean>(false)
    const [initialPw, setInitialPw] = useState<PinWall>(null)
    const [qlikAppIds, setQlikAppIds] = useState<string[]>([])

    const { pathname: pageId, search } = useLocation()
    const searchParams = new URLSearchParams(window.location.search)
    const queryParams = useQuery()
    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { setIsFixed, isFixed } = useGridWallContext()
    const { q } = useQlikBootstrapContext()
    const { setDockedFields } = useQlikSelectionContext()
    const {
        pinwallAddNode,
        pinwallCancelNode,
        pinwallCloneNode,
        pinwallEditNode,
        pinwallEraseNode,
        pinwallRemoveNode,
        pinwallSaveNode,
        cssPinwallControlButtonIcon,
        cssPinwallHeader
    } = useQlikPinWallUiContext()

    const { pinWalls, pinWallableReports, activePinWall, loading, isUpdating } =
        useQlikPinWallState()

    const { detachFieldsFromContext } = useQlikSelectionContext()
    const dispatch = useQlikPinWallDispatch()
    const { t } = useI18n()

    const createQuery = querystring.stringify({
        op: 'create'
    })
    const editQuery = querystring.stringify({
        op: 'edit'
    })
    const [selectedPw, setSelectedPw] = useState<string>('')

    const { classes } = useStyles()
    const theme = useTheme()

    const checkIfPinWallIsEmpty = useCallback((pinwall: PinWall) => {
        let isEmpty = true
        if (pinwall) {
            for (const cell of pinwall.content.cells) {
                if (cell?.reportId) {
                    isEmpty = false
                    break
                }
            }
        }
        return isEmpty
    }, [])

    const refreshPinWallQlikAppIds = useCallback(
        async (pinwall: PinWall) => {
            if (!pinwall) return
            if (pinwall?.content?.cells?.length > 0) {
                const pinnedReportIds = pinwall?.content?.cells.filter(c => c?.reportId > 0)
                const qAppIds = []

                for (const pinnedReport of pinnedReportIds) {
                    for (const report of pinWallableReports) {
                        if (report.id === pinnedReport.reportId) {
                            qAppIds.push(report.dataset.qlikAppId)
                        }
                    }
                }
                const uniqueQAppIds = uniq(qAppIds)
                setQlikAppIds(uniqueQAppIds)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pinWallableReports]
    )

    const replaceQueryParamHelper = useCallback(
        (pId: number) => {
            setReplaceQueryParams(pId, URL_QUERY_PARAM_VALUE_TYPE_PINWALL)
        },
        [setReplaceQueryParams]
    )

    const renderActivePinWall = useCallback(() => {
        if (activePinWall && isFixed) {
            setInitialPw({ ...activePinWall })
            getPinWallFilters(dispatch, activePinWall.id, false)
            refreshPinWallQlikAppIds(activePinWall)
            const changePinWalls = [...pinWalls]
            const pw = changePinWalls?.find(p => p?.title === activePinWall?.title)
            if (pw) replaceQueryParamHelper(pw.id)
        }

        if (!isFixed || !activePinWall) {
            setDockedFields([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePinWall, isFixed, pinWalls])

    useEffect(() => {
        setDisabled(isDisabled || loading || pinWalls.length === 0)
    }, [isDisabled, loading, pinWalls?.length])

    useEffect(() => {
        renderActivePinWall()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePinWall, isFixed])

    useEffect(() => {
        let uPinWall = null
        const queryPinWallId = queryParams.get(URL_QUERY_PARAM_PINWALL_ID) || ''
        const queryPinWallType = queryParams.get(URL_QUERY_PARAM_TYPE) || ''
        if (pinWalls.length > 0 && Number(queryPinWallId) > 0 && queryPinWallType === 'pinwalls') {
            uPinWall = pinWalls?.find(pw => pw.id === Number(queryPinWallId))
            if (uPinWall && uPinWall?.title !== selectedPw) {
                dispatch(setActivePinWall(uPinWall))
                setSelectedPw(uPinWall.title)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams])

    useEffect(() => {
        if (!isFixed) {
            setInitialPw(activePinWall)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFixed])

    useEffect(() => {
        if (!isUpdating) {
            setIsFixed(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdating])

    const handleOnDeletePinWallClick = async (id: number) => {
        try {
            await pinWallService.deletePinWall(id)
            dispatch(deletePinWall(id))
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleOnClonePinWallClick = async () => {
        try {
            if (!activePinWall) return
            const { title, description, content } = activePinWall

            const newPinWall = await pinWallService.createPinWall({
                title: `${title} ${t(translation.pinwallCopyText)}`,
                description: description || `${title} ${t(translation.pinwallCopyText)}`,
                content
            })
            dispatch(addPinWall(newPinWall))
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }
    const handleChangePinWall = async event => {
        const isActive = activePinWall?.title === event.target.value
        if (isActive) return
        const changePinWalls = [...pinWalls]
        const pw = changePinWalls.find(p => p.title === event.target.value)
        replaceQueryParamHelper(pw.id)
    }

    const handleRefreshPinWallClick = useCallback(() => {
        refreshPinWall(dispatch, activePinWall.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePinWall?.id])

    const handlePinWallEditMode = async () => {
        try {
            if (q) q?.resize()
            if (!isFixed) {
                // If PinWall is saved dispatch update operation
                dispatch(executeUpdating(true))
                // Sets timestamp to re-trigger update action in PinWallContent
                dispatch(setPinWallRefreshInMilliseconds(new Date().valueOf()))
            } else {
                setIsFixed(false)
            }
        } catch (error) {
            console.log('Qplus error', error)
        }
    }

    const handleCancelOnClick = async () => {
        try {
            // Restore original saved pinwall
            await refreshPinWall(dispatch, activePinWall.id)
            setIsFixed(true)
        } catch (error) {
            console.log('Qplus error', error)
        }
    }

    const handleOnEraseClick = () => {
        try {
            // Erase pinwall client side
            const uPinWall = JSON.parse(JSON.stringify(activePinWall))
            if (uPinWall) {
                uPinWall.content.cells = uPinWall.content.cells.map(cell => {
                    if (cell?.reportId) {
                        delete cell.reportId
                    }
                    cell.visualizationId = `empty-${cell.x}-${cell.y}`

                    return cell
                })
            }
            // Update pinwall with empty tiles
            dispatch(updatePinWall(uPinWall))
        } catch (error) {
            console.log('Qplus error', error)
        }
    }

    const handleOnCloseDialogClick = (type: string) => {
        switch (type) {
            case 'erase':
                setEraseDialogOpen(false)
                break

            case 'delete':
                setDeleteDialogOpen(false)
                break

            case 'clone':
                setCloneDialogOpen(false)
                break

            default:
                break
        }
    }

    const searchQueryParams = search ? `${search}&` : '?'

    const renderControls = () => {
        const isEmpty = checkIfPinWallIsEmpty(activePinWall)
        return (
            <Box
                className={`${classes.actionsContainer} ${classNames?.actionsContainer || ''}`}
                sx={{
                    display: 'flex',
                    height: '100%',
                    justifyItems: 'center',
                    alignItems: 'center'
                }}>
                <Box flexGrow={1}></Box>
                <Box display="flex" justifyContent="center" mr={2}>
                    <IconTooltip title={t(translation.pinwallRefreshIconTooltip)}>
                        <IconButton
                            edge="end"
                            color={color}
                            className={classNames?.refreshButton || ''}
                            onClick={handleRefreshPinWallClick}
                            disabled={disabled || !isFixed}>
                            <RefreshIcon fontSize="medium" />
                        </IconButton>
                    </IconTooltip>
                </Box>
                {views.includes('Filter') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <QlikFilterDialog
                            classNames={{
                                iconButton: `${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`
                            }}
                            qlikAppIds={qlikAppIds}
                            isDisabled={disabled || !isFixed}
                            color={color}
                            LoaderComponent={LoaderComponent}
                        />
                    </Box>
                )}
                {views.includes('Clone') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallToolbarClone)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                onClick={() => setCloneDialogOpen(true)}
                                disabled={
                                    disabled || !isFixed || pinWalls?.length >= maxNumberOfWalls
                                }>
                                {pinwallCloneNode || <CopyIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}

                {views.includes('Erase') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallToolbarErase)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                onClick={() => setEraseDialogOpen(true)}
                                disabled={disabled || isEmpty || isFixed}>
                                {pinwallEraseNode || <ClearIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}

                {views.includes('Delete') && activePinWall && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallToolbarDelete)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                disabled={disabled || !isFixed}
                                onClick={() => setDeleteDialogOpen(true)}>
                                {pinwallRemoveNode || <DeleteIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}

                {!isFixed && views.includes('Edit') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallToolbaModeEdit)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                disabled={disabled}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                component={Link}
                                to={`${pageId}${searchQueryParams}${editQuery}`}>
                                {pinwallEditNode || <EditIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {views.includes('Add') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallCreateNew)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                component={Link}
                                to={`${pageId}${searchQueryParams}${createQuery}`}
                                disabled={loading || !isFixed || isDisabled}
                                key="header-create">
                                {pinwallAddNode || <AddIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
                {!isFixed && views.includes('Cancel') ? (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallDialogCancelTooltip)}>
                            <IconButton
                                sx={{ ...cssPinwallControlButtonIcon }}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                aria-label="favorite"
                                component="span"
                                onClick={handleCancelOnClick}
                                disabled={disabled}
                                className={
                                    isFixed
                                        ? `${classes.fixed} ${classNames?.actionButton || ''}`
                                        : `${classes.nonFixed} ${
                                              classNames?.actionButtonActive || ''
                                          }`
                                }>
                                {pinwallCancelNode || <CloseIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                ) : null}
                <Box
                    className={classes.boxControl}
                    ml={0.0025}
                    style={{
                        borderLeft: !isToolbarWithDivider
                            ? '0px !important'
                            : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                    }}>
                    <IconTooltip
                        title={
                            isFixed
                                ? t(translation.pinwallEditTooltip)
                                : t(translation.pinwallSaveTooltip)
                        }>
                        <IconButton
                            classes={{
                                root: classes.iconButtonRoot,
                                disabled: classes.iconButtonDisabled
                            }}
                            sx={{ ...cssPinwallControlButtonIcon }}
                            className={
                                isFixed
                                    ? `${classes.fixed} ${classNames?.actionButton || ''}`
                                    : `${classes.nonFixed} ${classNames?.actionButtonActive || ''}`
                            }
                            disabled={disabled}
                            onClick={handlePinWallEditMode}>
                            {isFixed
                                ? pinwallEditNode || <EditIcon className={classes.iconSize} />
                                : pinwallSaveNode || <SaveIcon className={classes.iconSize} />}
                        </IconButton>
                    </IconTooltip>
                </Box>
                {isFixed && views.includes('Fullscreen') && (
                    <Box
                        className={classes.boxControl}
                        style={{
                            borderLeft: !isToolbarWithDivider
                                ? '0px !important'
                                : `1px solid  ${darken(theme.palette.divider, 0.1)}`
                        }}>
                        <IconTooltip title={t(translation.pinwallDialogFullscreenTooltip)}>
                            <IconButton
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}
                                sx={{ ...cssPinwallControlButtonIcon }}
                                className={`${classes.iconButton} ${
                                    classNames?.actionButton || ''
                                }`}
                                disabled={disabled}
                                onClick={onOpenFullscreen}>
                                {<FullscreenIcon className={classes.iconSize} />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
            </Box>
        )
    }

    const renderSelectPinWall = () => {
        return (
            <Box display="flex">
                <Box flexGrow={1}>
                    <FormControl className={classes.formControl} sx={{ height: '45px' }}>
                        <InputLabel id="view-select-outlined-label" className={classes.inputLabel}>
                            {t(translation.pinwallSelectInputLabel)}
                        </InputLabel>
                        <Tooltip title={activePinWall?.description || 'N/A'}>
                            <Select
                                variant="standard"
                                labelId="view-select-outlined-label"
                                id="view-select-outlined"
                                value={selectedPw}
                                key={selectedPw}
                                onChange={handleChangePinWall}
                                label="view"
                                className={classes.select}
                                disableUnderline={true}
                                disabled={disabled || !isFixed}>
                                {!disabled &&
                                    pinWalls?.map(pw => {
                                        return (
                                            <MenuItem
                                                className={classes.menuItem}
                                                value={pw.title}
                                                key={pw.id}
                                                sx={{ height: '35px' }}>
                                                <Box display="flex" alignItems="center">
                                                    <Box flexGrow={1}> {t(pw.title)}</Box>
                                                </Box>
                                            </MenuItem>
                                        )
                                    })}
                            </Select>
                        </Tooltip>
                    </FormControl>
                </Box>
                {selectedPw && false && (
                    <Box display="flex" justifyContent="center" ml={2}>
                        <IconTooltip
                            title={t(
                                pinWalls[pinWalls?.findIndex(p => p.title === selectedPw)]
                                    ?.description || ''
                            )}>
                            <IconButton color="primary" disabled={disabled}>
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
            </Box>
        )
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                width="100%"
                height="50px"
                className={`${classes.header} ${classNames?.header}`}
                sx={{ ...cssPinwallHeader }}>
                <Box
                    className={`${classes.containerDataset} ${classNames?.datasetContainer || ''}`}>
                    {renderSelectPinWall()}
                </Box>
                <Box flexGrow={1}>{renderControls()}</Box>
            </Box>

            <Box className={classes.root}>
                {eraseDialogOpen && (
                    <ConfirmationDialog
                        pageId={pageId}
                        searchParams={searchParams}
                        primaryText={t(translation.pinwallDialogConfirmationEraseMsg)}
                        noText={t(translation.pinwallDialogConfirmationNo)}
                        yesText={t(translation.pinwallDialogConfirmationYes)}
                        dialogTitleText={t(translation.pinwallDialogConfirmationTitle)}
                        onClose={() => handleOnCloseDialogClick('erase')}
                        onNo={() => handleOnCloseDialogClick('erase')}
                        onYes={() => {
                            handleOnEraseClick()
                            handleOnCloseDialogClick('erase')
                            detachFieldsFromContext()
                        }}
                        hideBackdrop={false}
                    />
                )}
                {deleteDialogOpen && (
                    <ConfirmationDialog
                        pageId={pageId}
                        searchParams={searchParams}
                        primaryText={t(translation.pinwallDialogConfirmationDeleteMsg)}
                        noText={t(translation.pinwallDialogConfirmationNo)}
                        yesText={t(translation.pinwallDialogConfirmationYes)}
                        dialogTitleText={t(translation.pinwallDialogConfirmationTitle)}
                        onClose={() => handleOnCloseDialogClick('delete')}
                        onNo={() => handleOnCloseDialogClick('delete')}
                        onYes={() => {
                            handleOnDeletePinWallClick(activePinWall.id)
                            handleOnCloseDialogClick('delete')
                        }}
                        hideBackdrop={false}
                    />
                )}
                {cloneDialogOpen && (
                    <ConfirmationDialog
                        pageId={pageId}
                        searchParams={searchParams}
                        primaryText={t(translation.pinwallCloneConfirmationDialog)}
                        noText={t(translation.pinwallDialogConfirmationNo)}
                        yesText={t(translation.pinwallDialogConfirmationYes)}
                        dialogTitleText={t(translation.pinwallDialogConfirmationTitle)}
                        onClose={() => handleOnCloseDialogClick('clone')}
                        onNo={() => handleOnCloseDialogClick('clone')}
                        onYes={() => {
                            handleOnClonePinWallClick()
                            handleOnCloseDialogClick('clone')
                        }}
                        hideBackdrop={false}
                    />
                )}
            </Box>
        </>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '0px',
        paddingRight: '16px'
    },
    header: {
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${darken(theme.palette.divider, 0.1)}`
    },
    containerDataset: {
        background: theme.palette.background.default,
        textAlign: 'left',
        minWidth: '300px',
        maxWidth: '352px',
        paddingLeft: 4
    },
    activeHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: '-20px'
    },
    actionsContainer: { background: theme.palette.background.default },
    iconButton: {
        width: '55px',
        height: '50px',
        color: theme.palette.primary.dark,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        },
        borderRadius: '0px !important'
    },
    iconButtonCancel: {
        height: '50px',
        width: '55px',
        cursor: 'pointer',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.dark
        },
        borderRight: `1px solid ${theme.palette.secondary.contrastText}`
    },
    iconButtonRoot: {
        height: '50px',
        width: '55px',
        borderRadius: '0px !important'
    },
    iconButtonDisabled: {},
    fixed: {
        cursor: 'pointer',
        color: theme.palette.primary.dark,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    },
    nonFixed: {
        cursor: 'pointer',
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark,
        '&:hover': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.dark
        }
    },
    boxControl: {
        height: '100%',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        width: '55px'
    },
    leftContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flex: 1
    },
    pinwallNameContainer: {
        width: '32%',
        marginLeft: '8px',
        paddingRight: '10px',
        paddingTop: '8px'
    },
    formControl: {
        width: '100%',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        marginLeft: '10px',
        height: '44px',
        marginRight: '64px',
        marginBottom: '4px'
    },
    inputLabel: {
        transform: 'translate(14px, 18px) scale(1)',
        border: '0px solid',
        textAlign: 'left',
        height: '30px',
        marginTop: '-15px',
        marginLeft: '-5px',
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    },
    select: {
        textAlign: 'left',
        height: '30px',
        fontSize: '15px',
        fontWeight: 500,
        paddingLeft: '10px',
        minWidth: '200px'
    },
    menuItem: {
        height: '30px'
    },
    iconSize: {
        width: '24px',
        height: '24px'
    }
}))

export default PinWallHeader
