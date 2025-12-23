import React, { FC, useEffect, useRef, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import {
    Box,
    Checkbox,
    ClickAwayListener,
    Grow,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Theme,
    Typography
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip, ListLoader } from '@libs/common-ui'
import { ReportMeasures } from '@libs/core-models'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'
import QlikReportingEmptyList from '../list/QlikReportingEmptyList'

export type TQlikReportingMeasureList = {
    checkBoxItem: string
    checkBoxItemChecked: string
    checkBoxItemIntermediate: string
}

export interface IQlikReportingMeasureListProps {
    handleToggleMeasureChange(reportSelectedMeasures: ReportMeasures[]): void
    height?: number
    isReportEnabled?: boolean
    isBaseChart?: boolean
    color?: any
    classNames: Partial<TQlikReportingMeasureList>
}

const QlikReportingMeasureList: FC<IQlikReportingMeasureListProps> = React.memo(
    ({
        height = 200,
        handleToggleMeasureChange,
        isReportEnabled = true,
        isBaseChart = true,
        color = 'secondary',
        classNames
    }) => {
        const { reportIsLoading, reportVizType, reportSelectMeasures, reportSelectedMeasures } =
            useQlikReportingContext()
        const { reportingSortNode, reportingClearNode, reportingSearchNode } =
            useQlikReportingUiContext()
        const [measures, setMeasures] = useState<ReportMeasures[]>([])
        const [measuresChecked, setMeasuresChecked] = useState<ReportMeasures[]>([])
        const [isToggling, setIsToggling] = useState<boolean>(false)
        const [isLoading, setIsLoading] = useState<boolean>(true)
        const [isDisabled, setIsDisabled] = useState<boolean>(true)
        const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
        const { classes } = useStyles()
        const anchorRef = useRef(null)
        const [open, setOpen] = useState(false)
        const [asc, setAsc] = useState(true)

        const { t } = useI18n()

        useEffect(() => {
            setMeasures(reportSelectMeasures)
        }, [reportSelectMeasures])

        useEffect(() => {
            setMeasuresChecked(reportSelectedMeasures)
        }, [reportSelectedMeasures])

        useEffect(() => {
            if (!reportIsLoading) {
                setIsToggling(false)
            }
            setIsLoading(reportIsLoading)
        }, [reportIsLoading])

        useEffect(() => {
            setIsDisabled(reportVizType ? false : true)
        }, [reportVizType, setIsDisabled])

        const handleMeasureToggle = (value: any) => () => {
            const currentIndex = indexOf(value.qLibraryId)
            const newChecked = [...measuresChecked]

            if (currentIndex === -1) {
                newChecked.push(value)
            } else {
                newChecked.splice(currentIndex, 1)
            }

            setMeasuresChecked(newChecked)
            handleToggleMeasureChange(newChecked)
            setIsToggling(true)
        }

        const indexOf = (id: string) => {
            const index = -1
            for (let i = 0; i < measuresChecked?.length; i++) {
                if (measuresChecked[i].qLibraryId === id) {
                    return i
                }
            }
            return index
        }

        const handleOpenSearchClick = () => {
            setIsSearchActive(true)
        }

        const handleClearClick = () => {
            setMeasuresChecked([])
            handleToggleMeasureChange([])
        }

        const handleCloseSearchClick = () => {
            setIsSearchActive(false)
            setMeasures(reportSelectMeasures)
        }

        const handleSearchChange = e => {
            // Variable to hold the original version of the list
            let currentList: ReportMeasures[] = []
            // Variable to hold the filtered list before putting into state
            let newList: ReportMeasures[] = []

            // If the search bar isn't empty
            if (e.target.value !== '') {
                // Assign the original list to currentList
                currentList = [...reportSelectMeasures]

                newList = currentList.filter(item => {
                    return item.label.toLowerCase().includes(e.target.value.toLowerCase())
                })
            } else {
                // If the search bar is empty, set newList to original task list
                newList = [...reportSelectMeasures]
            }
            // Set the filtered state based on what our rules added to newList
            setMeasures(newList)
        }

        const handleSort = (isAsc: boolean) => {
            setAsc(isAsc)
            const sorted = measures?.sort((a, b) => {
                if (a.title > b.title) {
                    return isAsc ? 1 : -1
                }
                if (a.title < b.title) {
                    return isAsc ? -1 : 1
                }
                return 0
            })
            setMeasures([...sorted])
            setOpen(false)
        }

        const handleCheckedSort = () => {
            const sorted = measures?.filter(obj => {
                return measuresChecked.indexOf(obj) === -1
            })
            setMeasures([...measuresChecked, ...sorted])
            setMeasuresChecked([...measuresChecked])
            setOpen(false)
        }

        const handleClose = event => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return
            }
            setOpen(false)
        }

        const renderListHeader = () => {
            const isMeasureBinDisabled =
                isDisabled || !isReportEnabled || measuresChecked.length === 0
            const isTextDisabled = isDisabled || !isReportEnabled || measures?.length === 0
            return (
                <Box display="flex">
                    <Box className={classes.listHeaderContainer}>
                        <IconTooltip title={t(translation.reportingClearAllIconTooltip)}>
                            <IconButton
                                aria-label="clear"
                                onClick={handleClearClick}
                                className={!isMeasureBinDisabled ? classes.listHeaderIcon : null}
                                sx={{ padding: '0px', marginRight: '6px' }}
                                disabled={isMeasureBinDisabled}>
                                {reportingClearNode || <DeleteIcon />}
                            </IconButton>
                        </IconTooltip>
                        <Typography
                            className={
                                isTextDisabled
                                    ? classes.listTitleTextDisabled
                                    : classes.listTitleText
                            }>
                            {t(translation.reportingMeasures)}
                        </Typography>
                    </Box>
                    <Box>
                        <div>
                            <IconTooltip title="Sort">
                                <IconButton
                                    aria-label="sort"
                                    onClick={() => setOpen(true)}
                                    className={
                                        !isMeasureBinDisabled ? classes.listHeaderIcon : null
                                    }
                                    sx={{ padding: '0px', marginLeft: '10px' }}
                                    disabled={isMeasureBinDisabled}>
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
                                                        disabled={!measuresChecked.length}
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
                        <IconTooltip title={t(translation.reportingMeasuresSearch)}>
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
                            inputProps={{ 'aria-label': 'search measures' }}
                            onChange={e => handleSearchChange(e)}
                            autoFocus
                            disabled={!isReportEnabled}
                        />
                    </Box>
                    <Box>
                        <IconTooltip title={t(translation.reportingControlCloseTooltip)}>
                            <IconButton
                                aria-label="search"
                                onClick={handleCloseSearchClick}
                                disabled={isDisabled || !isReportEnabled}
                                className={
                                    !isDisabled && isReportEnabled ? classes.listHeaderIcon : null
                                }>
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
                <li key={`section-measure`} className={classes.listSection}>
                    <ul className={classes.ul}>
                        <ListSubheader
                            className={classes.listSubheader}
                            sx={isDisabled || !isReportEnabled ? { color: '#bdbdbd' } : null}>
                            {!isSearchActive ? renderListHeader() : renderSearchBox()}
                        </ListSubheader>

                        {!isLoading || isToggling ? (
                            !measures || measures?.length === 0 || !isBaseChart ? (
                                <QlikReportingEmptyList
                                    message={
                                        !isBaseChart
                                            ? t(translation.reportingMeasuresReadyChart)
                                            : t(translation.reportingMeasuresEmpty)
                                    }
                                    height={`${height}px`}
                                />
                            ) : (
                                measures?.map(item => {
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
                                                        ? handleMeasureToggle(item)
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
                                sx={{ height: height }}>
                                {ListLoader(height, Math.floor(height / 30), 30)}
                            </Box>
                        )}
                    </ul>
                </li>
            </List>
        )
    }
)

export default QlikReportingMeasureList

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
    listTitleText: {
        fontWeight: 600,
        fontSize: '0.925rem'
    },
    listTitleTextDisabled: {
        fontWeight: 600,
        fontSize: '0.925rem',
        color: theme.palette.text.disabled
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
    listItem: {
        paddingTop: '2px',
        paddingBottom: '2px',
        fontSize: '0.82rem',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    listItemChecked: {},
    listItemIntermediate: {},
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
