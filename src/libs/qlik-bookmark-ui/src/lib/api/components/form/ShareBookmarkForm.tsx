import React, { FC, useState, useCallback } from 'react'

import { useAsyncFn, useMount } from 'react-use'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Checkbox, Typography, CircularProgress, Button, useTheme, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

import { makeStyles } from 'tss-react/mui'

import { useAuthContext, useI18n } from '@libs/common-providers'
import {
    IconTooltip,
    IAutoCompleteData,
    BaseAutoComplete,
    useAlertContext,
    AlertType
} from '@libs/common-ui'
import { BookmarkShare, ShareBookmarkPayload } from '@libs/core-models'
import { useQlikBookmarkContext } from '@libs/qlik-providers'

import translation from '../../constants/translations'

export interface IQlikShareBookmarkFormProps {
    onCloseCallback: any
}

const ShareBookmarkForm: FC<IQlikShareBookmarkFormProps> = ({ onCloseCallback }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [users, setUsers] = useState<any[]>([])
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [, setIsSearchActive] = useState<boolean>(false)
    const [switchInProgress, setSwitchInProgress] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')
    const [entries, setEntries] = useState<IAutoCompleteData[]>([])
    const [bookmarkId, setBookmarkId] = useState<string>('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const { appUserList, appUser } = useAuthContext()
    const { getPublicBookmarks, getSharedUsersByBookmarkId, shareBookmark, unShareBookmark } =
        useQlikBookmarkContext()
    const { showToast } = useAlertContext()
    const { classes } = useStyles()
    const theme = useTheme<Theme>()
    const { t } = useI18n()

    const columns = [
        { id: 'checkbox', label: '', format: 'checkbox', visible: true },
        {
            id: 'userName',
            label: t(translation.dlgShareColumnUserLabel),
            format: 'string',
            visible: true
        }
    ]

    const [_, getAndSetUsers] = useAsyncFn(async (id: number) => {
        let sharedWithUsers: BookmarkShare[] = []
        const allUsers = appUserList.filter(item => item.appUserId !== appUser?.appUserId) as any
        if (id > 0) {
            sharedWithUsers = await getSharedUsersByBookmarkId(id)
        }
        allUsers.map((u: any) => {
            u.sharedWith = !!sharedWithUsers?.find(s => s.appUserId === u.appUserId)
        })
        setUsers(allUsers)
        setAllUsers(allUsers)
    }, [])

    const handleOpenSearchClick = () => {
        setSearchText('')
        setIsSearchActive(true)
    }

    const handleCloseSearchClick = () => {
        setSearchText('')
        setIsSearchActive(false)
        setUsers(allUsers)
    }

    const handleSearchChange = (e: any) => {
        setPage(0)
        const newUserList = [...allUsers]

        if (e.target.value !== '') {
            let filteredList: any[] = []
            filteredList = newUserList.filter(item => {
                return item.name.toLowerCase().includes(e.target.value.toLowerCase())
            })
            setUsers(filteredList ?? [])
        } else {
            setUsers(allUsers)
        }
        setSearchText(e.target.value)
    }

    const onSaveShared = async () => {
        onCloseCallback()
    }

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const handleOnShareWithChange = async (user: any, checked: boolean) => {
        try {
            setSwitchInProgress(true)
            const currentUserList = [...allUsers]
            const currentFilteredUsers = [...users]
            const changedUser = currentUserList.find(u => u.appUserId === user.appUserId)
            changedUser.sharedWith = checked
            if (checked) {
                const selectedUsers: ShareBookmarkPayload = {
                    appUserIds: []
                }
                currentUserList.forEach(u => {
                    if (u.sharedWith) {
                        selectedUsers.appUserIds.push(u.appUserId)
                    }
                })
                await shareBookmark(Number(bookmarkId), selectedUsers)
                showToast(t(translation.dlgShareMsgSuccess), AlertType.SUCCESS)
            } else {
                const unselectedUser: ShareBookmarkPayload = {
                    appUserIds: [changedUser.appUserId]
                }
                await unShareBookmark(Number(bookmarkId), unselectedUser)
                showToast(t(translation.dlgUnshareMsgSuccess), AlertType.SUCCESS)
            }
            setAllUsers(currentUserList)
            setUsers(currentFilteredUsers)
        } catch (error) {
            showToast(t(translation.dlgShareMsgError), AlertType.ERROR)
        } finally {
            setSwitchInProgress(false)
        }
    }

    const handleOnDataChangeCallback = useCallback(
        async (value: IAutoCompleteData) => {
            try {
                setIsLoading(true)
                setBookmarkId(value?.entry?.key ?? '')
                await getAndSetUsers(Number(value?.entry?.key))
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
        },
        [getAndSetUsers]
    )

    useMount(async () => {
        setIsLoading(true)
        const items: IAutoCompleteData[] = []
        const bList = await getPublicBookmarks()
        for (const bookmark of bList.data) {
            const filteredBookmarks = bookmark.bookmarkItems.find(b => !b.qlikState?.qsBookmarkId)
            if (filteredBookmarks) {
                items.push({
                    entry: {
                        key: String(bookmark.id),
                        value: bookmark.name
                    }
                })
            }
        }

        setEntries(items)
        setIsLoading(false)
    })

    const isSavedEnabled = !switchInProgress

    return (
        <Box display="flex" className={classes.container}>
            <Box className={classes.header}>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box textAlign="left">
                        <BaseAutoComplete
                            isLoadingData={isLoading}
                            label={t(translation.dlgShareSelectLabel)}
                            inlineLabel={true}
                            options={entries}
                            width={260}
                            size="small"
                            handleChangeCallback={handleOnDataChangeCallback}
                            classNames={{
                                root: classes.autoCompleteRoot,
                                inputRoot: classes.autoCompleteInputRoot,
                                input: classes.autoCompleteInput,
                                listItem: classes.autoCompleteListItem,
                                label: classes.autoCompleteLabel,
                                option: classes.autoCompleteOption,
                                listbox: classes.autoCompleteListbox
                            }}
                        />
                    </Box>
                    <Box display="flex" pt={1} pb={1} className={classes.searchContainer}>
                        <IconTooltip title={t(translation.dlgShareSearchTooltip)}>
                            <IconButton
                                aria-label="search"
                                onClick={handleOpenSearchClick}
                                className={classes.iconButton}>
                                <SearchIcon className={classes.icon} />
                            </IconButton>
                        </IconTooltip>
                        <Box flexGrow={1}>
                            <InputBase
                                className={classes.input}
                                placeholder={t(translation.dlgShareSearchPlaceholder)}
                                inputProps={{ 'aria-label': 'search users' }}
                                onChange={e => handleSearchChange(e)}
                                value={searchText}
                            />
                        </Box>
                        {searchText ? (
                            <IconTooltip title={t(translation.dlgShareSearchCloseTooltip)}>
                                <IconButton
                                    aria-label="searchClose"
                                    onClick={handleCloseSearchClick}
                                    className={classes.iconButton}>
                                    <CloseIcon className={classes.icon} />
                                </IconButton>
                            </IconTooltip>
                        ) : null}
                    </Box>
                </Box>
            </Box>

            <TableContainer className={classes.tableContainer}>
                {!bookmarkId ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        textAlign="center"
                        minHeight={`300px`}
                        width="100%"
                        sx={{ border: `1px solid ${theme.palette.divider}` }}>
                        <Typography
                            style={{ fontSize: '0.825rem', fontStyle: 'oblique', opacity: 0.6 }}>
                            {t(translation.dlgShareTableNoBookmarkMsg)}
                        </Typography>
                    </Box>
                ) : !isLoading ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map(column =>
                                    column.visible ? (
                                        <TableCell
                                            key={column.id}
                                            className={classes.tableCell}
                                            sx={{
                                                width: column.format === 'checkbox' ? '5%' : '95%'
                                            }}
                                            align={
                                                column.format === 'checkbox' ? 'center' : 'left'
                                            }>
                                            {column.label}
                                        </TableCell>
                                    ) : null
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users && users.length > 0 ? (
                                users
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(row => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}>
                                                {columns.map(column => {
                                                    return column.visible ? (
                                                        <TableCell
                                                            sx={{
                                                                width:
                                                                    column.format === 'checkbox'
                                                                        ? '5%'
                                                                        : '95%',
                                                                paddingLeft:
                                                                    column.format === 'checkbox'
                                                                        ? '5px'
                                                                        : '16px'
                                                            }}
                                                            align={
                                                                column.format === 'checkbox'
                                                                    ? 'center'
                                                                    : 'left'
                                                            }
                                                            key={column.id}
                                                            className={classes.tableRowCell}>
                                                            {column.id === 'userName' ? (
                                                                <Typography
                                                                    className={
                                                                        classes.userNameLabel
                                                                    }>
                                                                    {row.name}
                                                                </Typography>
                                                            ) : column.id === 'checkbox' ? (
                                                                <Checkbox
                                                                    color="secondary"
                                                                    checked={!!row.sharedWith}
                                                                    onChange={e =>
                                                                        handleOnShareWithChange(
                                                                            row,
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    disableRipple
                                                                    disabled={switchInProgress}
                                                                    size="medium"
                                                                />
                                                            ) : null}
                                                        </TableCell>
                                                    ) : null
                                                })}
                                            </TableRow>
                                        )
                                    })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            textAlign="center"
                                            minHeight={`250px`}
                                            width="100%">
                                            <Typography
                                                style={{
                                                    fontSize: '0.925rem',
                                                    fontStyle: 'oblique'
                                                }}>
                                                {t(translation.dlgShareTableEmptyUserMsg)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <Box className={classes.loaderContainer}>
                        <CircularProgress sx={{ color: theme.palette.secondary.main }} size={48} />
                    </Box>
                )}
            </TableContainer>
            {bookmarkId && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
            <Box mb={2} mt={2} display="flex" justifyContent="flex-end">
                <Button
                    onClick={onCloseCallback}
                    className={classes.buttonCancel}
                    disabled={!isSavedEnabled}>
                    {t(translation.dlgShareTableButtonCancelLabel)}
                </Button>
                <Button
                    onClick={onSaveShared}
                    className={classes.buttonSave}
                    disabled={!isSavedEnabled}>
                    {switchInProgress ? (
                        <CircularProgress className={classes.buttonProgress} size={20} />
                    ) : (
                        t(translation.dlgShareTableButtonCloseLabel)
                    )}
                </Button>
            </Box>
        </Box>
    )
}

export default ShareBookmarkForm

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        width: '100%',
        flexDirection: 'column',
        padding: 20
    },
    header: {
        width: '100%',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px'
    },
    title: {
        fontWeight: 600,
        color: theme.palette.text.primary
    },
    searchContainer: {
        fontWeight: 600,
        textAlign: 'left',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
        height: '40px',
        width: '260px',
        marginTop: '16px',
        marginLeft: '16px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.background.default
        }
    },
    iconButton: {
        color: theme.palette.background.default,
        width: '24px',
        height: '24px',
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.secondary.dark
        }
    },
    icon: {
        width: '24px',
        height: '24px'
    },
    input: {
        color: theme.palette.text.primary,
        marginLeft: theme.spacing(1),
        flex: 1,
        height: '24px',
        fontSize: '14px'
    },
    usersContainer: {
        flexDirection: 'column',
        display: 'flex',
        width: '100%'
    },
    titleBox: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: '100%',
        borderBottomWidth: '3px',
        color: theme.palette.text.primary,
        borderBottomColor: theme.palette.divider
    },
    tableCell: {
        fontWeight: 600,
        color: theme.palette.text.primary,
        borderBottomWidth: '3px',
        fontSize: '14px',
        borderBottomColor: theme.palette.divider
    },
    tableRowCell: {
        padding: '5px',
        paddingLeft: '15px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '13px',
        overflow: 'hidden',
        borderBottomWidth: '1px',
        borderBottomColor: theme.palette.divider
    },
    checked: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: `${theme.palette.secondary.contrastText} !important`
    },
    checkbox: {
        color: theme.palette.text.primary,
        marginRight: '6px',
        width: '24px',
        height: '24px',
        '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: 'transparent'
        }
    },
    checkboxSelected: {
        color: theme.palette.secondary.dark,
        marginRight: '6px',
        width: '24px',
        height: '24px',
        '&:hover': {
            color: theme.palette.secondary.main,
            backgroundColor: 'transparent'
        }
    },
    buttonProgress: {
        color: theme.palette.secondary.contrastText
    },
    buttonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
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
    buttonSave: {
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
        }
    },
    tableContainer: {
        height: '325px'
    },
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    userNameLabel: {
        color: theme.palette.text.primary,
        fontSize: '14px'
    },
    autoCompleteInputRoot: {
        fontSize: '0.925rem'
    },
    autoCompleteInput: {
        fontsize: '1rem'
    },
    autoCompleteRoot: {
        height: '25px'
    },
    autoCompleteListItem: {
        fontsize: '0.9rem'
    },
    autoCompleteLabel: {
        fontsize: '0.9rem'
    },
    autoCompleteOption: {
        fontSize: '0.9rem',
        padding: 0
    },
    autoCompleteListbox: {
        fontSize: '0.825rem',
        padding: 0
    }
}))
