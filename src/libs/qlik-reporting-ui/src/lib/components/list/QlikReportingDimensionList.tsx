import React, { FC, useState, useEffect, useRef } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import {
    Box,
    InputBase,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    ListItemSecondaryAction,
    ListItemText,
    Checkbox,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Typography,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { ListLoader, IconTooltip } from '@libs/common-ui'
import { ReportDimensions } from '@libs/core-models'
import { QlikSelectionSingleAppField } from '@libs/qlik-selection-ui'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'
import QlikReportingEmptyList from './QlikReportingEmptyList'

export type TQlikReportingDimensionList = {
    checkBoxItem: string
    checkBoxItemChecked: string
    checkBoxItemIntermediate: string
}

export interface IQlikReportingDimensionListProps {
    qlikAppId?: string
    handleToggleDimensionChange(reportSelectedDimensions: ReportDimensions[]): any
    filterColor?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    height?: number
    isReportEnabled?: boolean
    isBaseChart?: boolean
    color?: any
    classNames: Partial<TQlikReportingDimensionList>
}

const QlikReportingDimensionList: FC<IQlikReportingDimensionListProps> = React.memo(
    ({
        qlikAppId,
        filterColor,
        height = 200,
        handleToggleDimensionChange,
        isReportEnabled = true,
        isBaseChart = true,
        color = 'secondary',
        classNames
    }) => {
        const { reportIsLoading, reportVizType, reportSelectDimensions, reportSelectedDimensions } =
            useQlikReportingContext()
        const { reportingFilterNode, reportingClearNode, reportingSearchNode, reportingSortNode } =
            useQlikReportingUiContext()
        const [dimensions, setDimensions] = useState<ReportDimensions[]>([])
        const [dimensionsChecked, setDimensionsChecked] = useState<ReportDimensions[]>([])
        const [isLoading, setIsLoading] = useState<boolean>(true)
        const [isToggling, setIsToggling] = useState<boolean>(false)
        const [isDisabled, setIsDisabled] = useState<boolean>(true)
        const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
        const { classes } = useStyles()
        const anchorRef = useRef(null)
        const [open, setOpen] = useState(false)
        const [asc, setAsc] = useState(true)

        const { t } = useI18n()

        useEffect(() => {
            setDimensions(reportSelectDimensions)
        }, [reportSelectDimensions])

        useEffect(() => {
            setDimensionsChecked(reportSelectedDimensions)
        }, [reportSelectedDimensions])

        useEffect(() => {
            if (!reportIsLoading) {
                setIsToggling(false)
            }
            setIsLoading(reportIsLoading)
        }, [reportIsLoading])

        useEffect(() => {
            setIsDisabled(reportVizType ? false : true)
        }, [reportVizType, setIsDisabled])

        const handleSort = (isAsc: boolean) => {
            setAsc(isAsc)
            const sorted = dimensions?.sort((a, b) => {
                if (a.title > b.title) {
                    return isAsc ? 1 : -1
                }
                if (a.title < b.title) {
                    return isAsc ? -1 : 1
                }
                return 0
            })
            setDimensions([...sorted])
            setOpen(false)
        }

        const handleCheckedSort = () => {
            const sorted = dimensions?.filter(obj => {
                return dimensionsChecked.indexOf(obj) === -1
            })
            setDimensions([...dimensionsChecked, ...sorted])
            setDimensionsChecked([...dimensionsChecked])
            setOpen(false)
        }

        const handleDimensionToggle = value => () => {
            const currentIndex = indexOf(value.qLibraryId)
            const newChecked = [...dimensionsChecked]

            if (currentIndex === -1) {
                newChecked.push(value)
            } else {
                newChecked.splice(currentIndex, 1)
            }

            setDimensionsChecked(newChecked)
            handleToggleDimensionChange(newChecked)
            setIsToggling(true)
        }

        const indexOf = (id: string) => {
            const index = -1
            for (let i = 0; i < dimensionsChecked?.length; i++) {
                if (dimensionsChecked[i].qLibraryId === id) {
                    return i
                }
            }
            return index
        }

        const handleOpenSearchClick = () => {
            setIsSearchActive(true)
        }

        const handleClearClick = () => {
            setDimensionsChecked([])
            handleToggleDimensionChange([])
        }

        const handleCloseSearchClick = () => {
            setIsSearchActive(false)
            setDimensions(reportSelectDimensions)
        }

        const handleSearchChange = e => {
            // Variable to hold the original version of the list
            let currentList: ReportDimensions[] = []
            // Variable to hold the filtered list before putting into state
            let newList: ReportDimensions[] = []

            // If the search bar isn't empty
            if (e.target.value !== '') {
                // Assign the original list to currentList
                currentList = [...reportSelectDimensions]

                newList = currentList.filter(item => {
                    return item.label.toLowerCase().includes(e.target.value.toLowerCase())
                })
            } else {
                // If the search bar is empty, set newList to original task list
                newList = [...reportSelectDimensions]
            }
            // Set the filtered state based on what our rules added to newList
            setDimensions(newList)
        }

        const handleClose = event => {
            if (anchorRef?.current && anchorRef.current.contains(event.target)) {
                return
            }
            setOpen(false)
        }

        const renderListHeader = () => {
            const isDimControlsDisabled =
                isDisabled || !isReportEnabled || dimensionsChecked.length === 0
            const isTextDisabled = isDisabled || !isReportEnabled || dimensions?.length === 0
            return (
                <Box display="flex">
                    <Box className={classes.listHeaderContainer}>
                        <IconTooltip title={t(translation.reportingClearAllIconTooltip)}>
                            <IconButton
                                aria-label="clear"
                                onClick={handleClearClick}
                                className={!isDimControlsDisabled ? classes.listHeaderIcon : null}
                                sx={{ padding: '0px', marginRight: '6px' }}
                                disabled={isDimControlsDisabled}>
                                {reportingClearNode || <DeleteIcon />}
                            </IconButton>
                        </IconTooltip>
                        <Typography
                            className={
                                isTextDisabled
                                    ? classes.listTitleTextDisabled
                                    : classes.listTitleText
                            }>
                            {t(translation.reportingDimensions)}
                        </Typography>
                    </Box>
                    <Box>
                        <div>
                            <IconTooltip title="Sort">
                                <IconButton
                                    aria-label="sort"
                                    onClick={() => setOpen(true)}
                                    className={
                                        !isDimControlsDisabled ? classes.listHeaderIcon : null
                                    }
                                    sx={{ padding: '0px', marginLeft: '10px' }}
                                    disabled={isDimControlsDisabled}>
                                    {reportingSortNode || <SortIcon />}
                                </IconButton>
                            </IconTooltip>
                            <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                placement="left-end"
                                role={undefined}
                                transition
                                disablePortal
                                style={{
                                    zIndex: 1000000000,
                                    position: 'absolute',
                                    left: '45px',
                                    top: '10px'
                                }}>
                                {({ TransitionProps }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            zIndex: 1000000000
                                        }}>
                                        <Paper sx={{ zIndex: 1000000000, minWidth: '150px' }}>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList
                                                    autoFocusItem={open}
                                                    id="menu-avatar-grow"
                                                    sx={{
                                                        zIndex: 1000000000,
                                                        fontSize: '0.875rem'
                                                    }}>
                                                    <MenuItem
                                                        className={classes.menuItem}
                                                        onClick={
                                                            asc
                                                                ? () => handleSort(false)
                                                                : () => handleSort(true)
                                                        }>
                                                        {asc
                                                            ? t(
                                                                  translation.reportingPopperSortingAlphabeticalDesc
                                                              )
                                                            : t(
                                                                  translation.reportingPopperSortingAlphabeticalAsc
                                                              )}
                                                    </MenuItem>
                                                    <MenuItem
                                                        disabled={!dimensionsChecked.length}
                                                        className={classes.menuItem}
                                                        onClick={handleCheckedSort}>
                                                        {t(
                                                            translation.reportingPopperSortingChecked
                                                        )}
                                                    </MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                    </Box>
                    <Box>
                        <IconTooltip title={t(translation.reportingDimensionsSearch)}>
                            <IconButton
                                aria-label="search"
                                onClick={handleOpenSearchClick}
                                disabled={isTextDisabled}
                                className={!isTextDisabled ? classes.listHeaderIcon : null}>
                                {reportingSearchNode || <SearchIcon />}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                </Box>
            )
        }

        const renderSearchBox = () => {
            return (
                <Box display="flex">
                    <Box flexGrow={1}>
                        <InputBase
                            className={classes.input}
                            placeholder={t(translation.reportingSearchPlaceholder)}
                            inputProps={{ 'aria-label': 'search dimensions' }}
                            onChange={e => handleSearchChange(e)}
                            autoFocus
                            disabled={!isReportEnabled}
                        />
                    </Box>
                    <Box>
                        <IconTooltip title={t(translation.reportingDialogCloseTooltip)}>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseSearchClick}
                                disabled={isDisabled || !isReportEnabled}
                                className={!isDisabled ? classes.listHeaderIcon : null}>
                                <CloseIcon />
                            </IconButton>
                        </IconTooltip>
                    </Box>
                </Box>
            )
        }

        return (
            <List
                className={
                    !isDisabled && isReportEnabled ? classes.listRoot : classes.listRootDisabled
                }>
                <li key={`section-dimension`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        <ListSubheader
                            className={classes.listSubheader}
                            sx={isDisabled && !isReportEnabled ? { color: '#bdbdbd' } : null}>
                            {!isSearchActive ? renderListHeader() : renderSearchBox()}
                        </ListSubheader>
                        {!isLoading || isToggling ? (
                            !dimensions || dimensions?.length === 0 || !isBaseChart ? (
                                <QlikReportingEmptyList
                                    message={
                                        !isBaseChart
                                            ? t(translation.reportingDimensionsReadyChart)
                                            : t(translation.reportingDimensionsEmpty)
                                    }
                                    height={`${height - 10}px`}
                                />
                            ) : (
                                dimensions?.map(item => {
                                    const labelId = `checkbox-list-label-${item.qLibraryId}`

                                    return (
                                        <ListItem
                                            key={item.qLibraryId}
                                            role={undefined}
                                            dense
                                            button
                                            className={classes.listItem}
                                            disabled={isDisabled || !isReportEnabled}>
                                            <Checkbox
                                                color={color}
                                                edge="start"
                                                onClick={
                                                    isReportEnabled
                                                        ? handleDimensionToggle(item)
                                                        : null
                                                }
                                                className={`${classes.listItemCheckbox} ${
                                                    classNames?.checkBoxItem || ''
                                                }`}
                                                classes={{
                                                    checked: `${classes.listItemChecked} ${
                                                        classNames?.checkBoxItemChecked || ''
                                                    }`,
                                                    indeterminate: `${
                                                        classes.listItemIntermediate
                                                    } ${classNames?.checkBoxItemIntermediate || ''}`
                                                }}
                                                checked={indexOf(item.qLibraryId) > -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                            <ListItemText
                                                id={labelId}
                                                primary={`${item?.label || 'N/A'}`}
                                                classes={{
                                                    primary: classes.listItemText
                                                }}
                                            />

                                            {indexOf(item.qLibraryId) > -1 ? (
                                                <ListItemSecondaryAction>
                                                    <QlikSelectionSingleAppField
                                                        qlikAppId={qlikAppId}
                                                        fieldName={item.fieldDef}
                                                        color={filterColor}
                                                        tooltipOptions={{
                                                            isNative: true
                                                        }}>
                                                        {reportingFilterNode || <FilterAltIcon />}
                                                    </QlikSelectionSingleAppField>
                                                </ListItemSecondaryAction>
                                            ) : null}
                                        </ListItem>
                                    )
                                })
                            )
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                sx={{ height }}>
                                {ListLoader(height, Math.floor(height / 30), 30)}
                            </Box>
                        )}
                    </ul>
                </li>
            </List>
        )
    }
)

export default QlikReportingDimensionList

const useStyles = makeStyles()((theme: Theme) => ({
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: '1rem'
    },
    listRoot: {
        maxHeight: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        padding: 0
    },
    listHeaderIcon: {
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.text.secondary
        }
    },
    listRootDisabled: {
        maxHeight: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        padding: 0
    },
    listItemText: {
        color: theme.palette.text.primary,
        fontSize: '0.875rem'
    },
    listItemCheckbox: {
        marginRight: '10px',
        width: '20px',
        height: '20px',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    listItemChecked: {},
    listItemIntermediate: {},
    listTitleText: {
        fontWeight: 600,
        fontSize: '0.925rem'
    },
    listTitleTextDisabled: {
        fontWeight: 600,
        fontSize: '0.925rem',
        color: theme.palette.text.disabled
    },
    listItem: {
        paddingTop: '2px',
        paddingBottom: '2px',
        fontSize: '0.82rem',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    listSection: {
        backgroundColor: 'inherit'
    },
    listSubheader: {
        fontWeight: 500,
        textAlign: 'left',
        color: theme.palette.text.primary,
        paddingRight: '0px',
        paddingLeft: '2px'
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0
    },
    listHeaderContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        display: 'flex'
    },
    menuItem: {
        fontSize: '0.825rem'
    }
}))
