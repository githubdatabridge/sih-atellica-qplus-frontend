import React, { useCallback, useEffect, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Checkbox, CircularProgress, IconButton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useDebounce } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { AppInfoIcon, BaseSearch, IconTooltip } from '@libs/common-ui'
import { QFieldFilter, QMasterDimension } from '@libs/qlik-models'
import {
    useQlikAppContext,
    useQlikLoaderContext,
    useQlikMasterItemContext,
    useQlikSelectionContext
} from '@libs/qlik-providers'

import translations from '../constants/translations'

type IFilterListProps = {
    qlikAppIds?: string[]
    filterIds?: string[]
    filterTags?: string[]
    height?: string
    rowsPage?: number
    defaultFilters?: QFieldFilter[]
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isEmptyWithoutFiltering?: boolean
    LoaderComponent?: JSX.Element
}

const QlikFilterList = React.memo(
    ({
        qlikAppIds = [],
        filterIds = [],
        filterTags = [],
        height,
        rowsPage = 5,
        LoaderComponent,
        color = 'secondary',
        isEmptyWithoutFiltering = false,
        defaultFilters = []
    }: IFilterListProps) => {
        const [isLoading, setIsLoading] = useState<boolean>(true)
        const [idToggleLoading, setIdToggleLoading] = useState<string>('')
        const [rows, setRows] = useState<QMasterDimension[]>([])
        const [selectedFilters, setSelectedFilters] = useState<QMasterDimension[]>([])
        const [qlikSelectedFilter, setQlikSelectedFilter] = useState<QMasterDimension[]>([])

        const [page, setPage] = useState(0)
        const [rowsPerPage, setRowsPerPage] = useState(rowsPage - 1)
        const [, setIsSearching] = useState(false)
        const [searchTerm, setSearchTerm] = useState<string>('')
        const debouncedSearchTerm = useDebounce(searchTerm, 300)
        const { qAppMap } = useQlikAppContext()
        const { isQlikMasterItemLoading } = useQlikLoaderContext()
        const { qMasterDimensionsMap } = useQlikMasterItemContext()
        const { qSelectionMap, setDockedFields } = useQlikSelectionContext()

        const isMobileSmall = useMediaQuery({ query: '(max-width: 394px)' })

        const { t } = useI18n()

        const cleanFieldNameHelper = (fieldName: string) => {
            return fieldName?.length && fieldName[0] === '=' ? fieldName?.slice(1) : fieldName
        }

        const isFilterFixedHelper = useCallback(
            (dim: QMasterDimension) => {
                let isFixed = false
                const selection = qSelectionMap?.get(dim.qAppId)
                const dockedFilters = selection.qDockedFields
                for (const d of dockedFilters) {
                    if (dim.qAppId === d.qAppId && d?.qFieldName === dim.fieldDef && d.isFixed) {
                        isFixed = true
                        break
                    }
                }
                return isFixed
            },
            [qSelectionMap]
        )

        const initFilters = useCallback(() => {
            const filterDimensions: QMasterDimension[] = []

            // Step 1: Get Master Dimensions and clean field Names and hide hidden fields
            if (qlikAppIds?.length > 0) {
                for (const a of qlikAppIds) {
                    const app = qAppMap.get(a)
                    if (qMasterDimensionsMap.size > 0) {
                        const dims = qMasterDimensionsMap.get(a)
                        if (dims && dims.length > 0) {
                            for (const dim of dims) {
                                const cleanFieldName = cleanFieldNameHelper(dim?.fieldDef)
                                if (
                                    app?.qHidePrefix !== cleanFieldName?.substring(0, 1) &&
                                    !app?.qHiddenFields?.includes(cleanFieldName)
                                ) {
                                    filterDimensions.push(dim)
                                }
                            }
                        }
                    }
                }
            } else {
                // Step 2: Get Master Dimension without filtering qlik App Ids
                for (const [key, value] of qMasterDimensionsMap) {
                    const app = qAppMap.get(key)
                    for (const dim of value) {
                        const cleanFieldName = cleanFieldNameHelper(dim?.fieldDef)
                        if (
                            app?.qHidePrefix !== cleanFieldName.substring(0, 1) &&
                            !app?.qHiddenFields?.includes(cleanFieldName)
                        ) {
                            filterDimensions.push(dim)
                        }
                    }
                }
            }

            // Step 3: Apply filterTags if present
            const dimensionsWithTagFilters =
                filterTags.length > 0
                    ? filterDimensions.filter(d => filterTags.every(tag => d.tags.includes(tag)))
                    : filterDimensions

            // Step 4: Apply filterIds if present
            const finalFilteredDimensions =
                filterIds.length > 0
                    ? dimensionsWithTagFilters.filter(d => filterIds.includes(d.qLibraryId))
                    : !isEmptyWithoutFiltering
                    ? dimensionsWithTagFilters
                    : []

            const sortedFilterDimensions = finalFilteredDimensions.sort((a, b) =>
                a?.label > b?.label ? 1 : -1
            )

            setRows([...sortedFilterDimensions])
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [qMasterDimensionsMap])

        const addSelectedFilters = useCallback(
            () => {
                const filters: QMasterDimension[] = []
                for (const [key, value] of qSelectionMap) {
                    if (
                        (qlikAppIds.length > 0 && qlikAppIds.includes(key)) ||
                        qlikAppIds.length === 0
                    ) {
                        const dockedFields = value.qDockedFields
                        for (let i = 0; i < dockedFields.length; i++) {
                            const dims = qMasterDimensionsMap.get(key)
                            const dim = dims.find(d => {
                                return (
                                    d.fieldDef === dockedFields[i]?.qFieldName &&
                                    d.qAppId === dockedFields[i]?.qAppId
                                )
                            })
                            filters.push({
                                qLibraryId: dockedFields[i]?.qLibraryId || dim?.qLibraryId,
                                fieldDef: dockedFields[i]?.qFieldName,
                                label: dockedFields[i]?.label,
                                tags: dockedFields[i]?.tags,
                                type: dockedFields[i]?.type,
                                qAppId: key
                            })
                        }
                    }
                }
                const differenceArray = filters.filter(
                    f1 =>
                        !defaultFilters.some(
                            f2 => f1?.qFieldName === f2?.qFieldName && f1?.qAppId === f2?.qAppId
                        )
                )
                setSelectedFilters(differenceArray)
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [qSelectionMap, qMasterDimensionsMap]
        )

        const updateFilters = (selectedFilters: QMasterDimension[]) => {
            const filters: QFieldFilter[] = []
            for (let i = 0; i < selectedFilters?.length; i++) {
                const isFilterFixed = isFilterFixedHelper(selectedFilters[i])
                const filter = {
                    id: selectedFilters[i].qLibraryId,
                    qLibraryId: selectedFilters[i].qLibraryId,
                    qFieldName: selectedFilters[i].fieldDef,
                    label: selectedFilters[i].label,
                    type: selectedFilters[i].type,
                    tags: selectedFilters[i].tags,
                    qAppId: selectedFilters[i].qAppId,
                    isDocked: !isFilterFixed,
                    isFixed: isFilterFixed,
                    toggle: false,
                    softLock: true,
                    rank: i + 1
                }
                filters.push(filter)
            }

            const differenceArray = filters.filter(f1 => {
                const sourceField =
                    f1.qFieldName.length && f1.qFieldName[0] === '='
                        ? f1.qFieldName.slice(1)
                        : f1.qFieldName

                return !defaultFilters.some(f2 => {
                    const targetField =
                        f2.qFieldName.length && f2.qFieldName[0] === '='
                            ? f2.qFieldName.slice(1)
                            : f2.qFieldName
                    return sourceField === targetField && f1?.qAppId === f2?.qAppId
                })
            })

            const mergedArray = [...defaultFilters, ...differenceArray]
            setDockedFields(mergedArray)
            setSelectedFilters(selectedFilters)
        }

        useEffect(() => {
            if (!isQlikMasterItemLoading) {
                initFilters()
                addSelectedFilters()
            }
            setIsLoading(isQlikMasterItemLoading)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isQlikMasterItemLoading])

        useEffect(() => {
            setQlikSelectedFilter(selectedFilters)
            if (!isLoading) {
                setIdToggleLoading('')
            }
        }, [isLoading, selectedFilters])

        useEffect(() => {
            if (debouncedSearchTerm) {
                setIsSearching(true)
                const results = requestSearch(debouncedSearchTerm)
                setIsSearching(false)
                setRows(results)
                setPage(0)
            } else {
                initFilters()
                addSelectedFilters()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedSearchTerm])

        const requestSearch = (searchedVal: string) => {
            const lowerSearchedVal = searchedVal.toLowerCase()

            // Step 1: Filter based on search and app criteria
            const filteredDimensions: QMasterDimension[] = Array.from(qMasterDimensionsMap).flatMap(
                ([key, dimensions]) => {
                    const app = qAppMap.get(key)
                    return dimensions.filter(dim => {
                        const cleanFieldName = cleanFieldNameHelper(dim?.fieldDef)
                        return (
                            (dim?.label
                                ? dim.label.toLowerCase().includes(lowerSearchedVal)
                                : dim.title.toLowerCase().includes(lowerSearchedVal)) &&
                            (qlikAppIds.length === 0 || qlikAppIds.includes(key)) &&
                            app?.qHidePrefix !== cleanFieldName?.substring(0, 1) &&
                            !app?.qHiddenFields?.includes(cleanFieldName)
                        )
                    })
                }
            )

            // Step 2: Remove duplicates based on qLibraryId and qlikAppId
            const uniqueDimensionsMap = new Map<string, QMasterDimension>()
            filteredDimensions.forEach(dim => {
                const compositeKey = `${dim.qLibraryId}-${dim.qAppId}`
                if (!uniqueDimensionsMap.has(compositeKey)) {
                    uniqueDimensionsMap.set(compositeKey, dim)
                }
            })
            const uniqueDimensions = Array.from(uniqueDimensionsMap.values())

            // Step 3: Apply filterTags if present
            const dimensionsWithTagFilters =
                filterTags.length > 0
                    ? uniqueDimensions.filter(d => filterTags.every(tag => d.tags.includes(tag)))
                    : uniqueDimensions

            // Step 4: Apply filterIds if present
            const finalFilteredDimensions =
                filterIds.length > 0
                    ? dimensionsWithTagFilters.filter(d => filterIds.includes(d.qLibraryId))
                    : !isEmptyWithoutFiltering
                    ? dimensionsWithTagFilters
                    : []

            return finalFilteredDimensions
        }

        const handleChangePage = useCallback((event, newPage) => {
            setPage(newPage)
        }, [])

        const handleChangeRowsPerPage = useCallback(event => {
            setRowsPerPage(+event.target.value)
            setPage(0)
        }, [])

        const handleClearClick = () => {
            const fixedFilters: QMasterDimension[] = []
            for (const filter of selectedFilters) {
                const isFixed = isFilterFixedHelper(filter)
                if (isFixed) fixedFilters.push(filter)
            }
            updateFilters(fixedFilters)
        }

        const handleFilterToggle = value => () => {
            setIdToggleLoading(value.qLibraryId)
            const currentIndex = indexOf(value.qLibraryId)
            const newChecked = [...qlikSelectedFilter]
            if (currentIndex === -1) {
                newChecked.push(value)
            } else {
                newChecked.splice(currentIndex, 1)
            }
            updateFilters(newChecked)
        }

        const indexOf = (key: string) => {
            const index = -1
            for (let i = 0; i < qlikSelectedFilter?.length; i++) {
                if (qlikSelectedFilter[i].qLibraryId === key) {
                    return i
                }
            }
            return index
        }

        const { classes } = useStyles()

        const validColor = color === 'inherit' ? 'default' : color

        if (isLoading) {
            return (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height={isMobileSmall ? height : '400px'}>
                    {LoaderComponent || <CircularProgress size="4rem" color={color} />}
                </Box>
            )
        }

        return (
            <>
                <Box display="flex" className={classes.baseSearchContainer}>
                    <Box flexGrow={1} width="inherit">
                        <BaseSearch
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onCancelSearch={() => setSearchTerm('')}
                            minWidth="50%"
                            className={classes.BaseSearch}
                            height="45px"
                        />
                    </Box>
                </Box>
                {rows?.length > 0 ? (
                    <>
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                            key={rows.length.toString()}>
                            <TableHead className={classes.tableHead}>
                                <TableRow className={classes.tableRow} style={{ height: '35px' }}>
                                    <TableCell
                                        className={classes.tableHeaderAction}
                                        classes={{ root: classes.tableCell }}
                                        style={{ width: '10%' }}>
                                        <IconTooltip
                                            title={t(translations.dialogFilterClearIconTooltip)}>
                                            <IconButton
                                                aria-label="clear"
                                                onClick={handleClearClick}
                                                className={classes.listHeaderIcon}
                                                style={{
                                                    padding: '0px',
                                                    paddingRight: '10px',
                                                    marginTop: '-13px'
                                                }}
                                                disabled={qlikSelectedFilter?.length === 0}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </IconTooltip>
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeader}
                                        classes={{ root: classes.tableCell }}
                                        style={{ width: '40%', paddingLeft: '15px' }}>
                                        {t(translations.dialogFilterListDimensions)}
                                    </TableCell>
                                    {qlikAppIds.length > 1 ? (
                                        <TableCell
                                            className={classes.tableHeaderAction}
                                            classes={{ root: classes.tableCell }}
                                            style={{ width: '10%' }}>
                                            {t(translations.dialogFilterListSource)}
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody style={{ boxShadow: 'none', height: '300px' }}>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((dim: QMasterDimension) => {
                                        const labelId = `checkbox-list-label-${dim.qLibraryId}`
                                        return (
                                            <TableRow
                                                key={dim.qLibraryId}
                                                className={classes.tableRow}>
                                                <TableCell
                                                    className={classes.cell}
                                                    classes={{ root: classes.tableCellAction }}
                                                    style={{ width: '10%' }}
                                                    component="th"
                                                    scope="row">
                                                    {idToggleLoading &&
                                                    idToggleLoading === dim.qLibraryId ? (
                                                        <Box sx={{ marginTop: '10px' }}>
                                                            <CircularProgress
                                                                size={20}
                                                                color="secondary"
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Checkbox
                                                            edge="start"
                                                            color={validColor}
                                                            onClick={handleFilterToggle(dim)}
                                                            checked={indexOf(dim.qLibraryId) > -1}
                                                            disabled={isFilterFixedHelper(dim)}
                                                            sx={{ marginTop: '-3px' }}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{
                                                                'aria-labelledby': labelId
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    className={classes.cell}
                                                    classes={{ root: classes.tableCell }}
                                                    style={{ width: '40%', marginTop: '2px' }}
                                                    component="th"
                                                    scope="row">
                                                    <Typography style={{ fontSize: '0.9rem' }}>
                                                        {dim?.label || dim?.title || ''}
                                                    </Typography>
                                                </TableCell>
                                                {qlikAppIds?.length > 1 && (
                                                    <TableCell
                                                        className={classes.cell}
                                                        classes={{ root: classes.tableCell }}
                                                        style={{ width: '10%', marginTop: '8px' }}
                                                        component="th"
                                                        scope="row">
                                                        <AppInfoIcon
                                                            initials={
                                                                qAppMap.get(dim.qAppId)?.qMeta
                                                                    ?.initials
                                                            }
                                                            title={qAppMap.get(dim.qAppId)?.qTitle}
                                                            text={
                                                                qAppMap.get(dim.qAppId)
                                                                    ?.qDescription
                                                            }
                                                            backgroundColor={
                                                                qAppMap.get(dim.qAppId)?.qMeta
                                                                    ?.backgroundColor
                                                            }
                                                            color={
                                                                qAppMap.get(dim.qAppId)?.qMeta
                                                                    ?.color
                                                            }
                                                        />
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    })}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                ) : (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="250px"
                        width="100%">
                        <Typography
                            style={{
                                fontSize: '0.925rem',
                                fontStyle: 'oblique'
                            }}>
                            {t(translations.dialogFilterListEmpty)}
                        </Typography>
                    </Box>
                )}
            </>
        )
    }
)

export default QlikFilterList

const useStyles = makeStyles()((theme: any) => ({
    BaseSearch: {
        border: '1px solid rgba(0, 0, 0, 0.2)',
        backgroundColor: theme.palette.background.default,
        borderRadius: '10px',
        height: '43px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxShadow: 'none',
        fontSize: '0.925rem',
        marginRight: '24px',
        '@media (max-width: 992px)': {
            marginTop: '5px'
        },
        '@media (max-width: 479px)': {
            marginRight: '0px'
        }
    },
    table: {
        color: 'black'
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '1px solid #e4e7ea',
        '@media (max-width: 600px)': {
            flexDirection: 'column'
        }
    },
    tableCell: {
        padding: '15px 0px 0px 15px',
        height: '51px',
        border: 'none',
        '@media (max-width: 600px)': {
            padding: '0px'
        }
    },
    tableCellAction: {
        padding: '10px 0px 0px 10px',
        border: 'none',
        '@media (max-width: 342px)': {
            paddingLeft: '5px'
        }
    },
    tableCell_4: {
        textAlign: 'start',
        padding: '0px 0px',
        '@media (max-width: 992px)': {
            gridRow: '1/3',
            gridColumn: '2/3',
            textAlign: 'end',
            padding: '10px 7px 0px 0px'
        }
    },
    tableCell_5: {
        gridRow: '2/3',
        gridColumn: '2/3',
        textAlign: 'end',
        padding: '0px 0px'
    },
    tableCell_6: {
        gridRow: '3/3',
        gridColumn: '2/3',
        textAlign: 'end',
        padding: '5px 0px 0px 0px',
        '& button': {
            padding: '0px 7px 0px 0px'
        }
    },
    tableHead: {
        '@media (max-width: 992px)': {
            display: 'none'
        }
    },
    tableHeaderAction: {
        fontWeight: 400,
        fontSize: '0.925rem',
        color: '#888D8F',
        padding: '5px 10px'
    },
    tableHeader: {
        fontWeight: 400,
        fontSize: '0.925rem',
        color: '#888D8F',
        padding: '5px 0px',
        width: '50%'
    },
    cell: {
        color: theme.palette.text.primary,
        fontSize: '0.825rem',
        '@media (max-width: 992px)': {
            borderBottom: 'none',
            height: '38px'
        }
    },
    cellAction: {
        textAlign: 'right',
        '@media (max-width: 992px)': {
            height: '38px',
            borderBottom: 'none'
        }
    },
    baseSearchContainer: {
        paddingBottom: '20px',
        width: '100%',
        '@media (max-width: 992px)': {
            flexDirection: 'column',
            paddingBottom: '0px',
            borderBottom: '1px solid #e4e7ea'
        }
    },
    listHeaderIcon: {
        color: theme.palette.primary.main
    },
    filterSelectBox: {
        display: 'flex',
        justifyContent: 'right',
        width: '100%',
        '@media (max-width: 992px)': {
            margin: '10px 0px'
        }
    }
}))
