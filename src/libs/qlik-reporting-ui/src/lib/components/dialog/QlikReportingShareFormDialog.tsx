import React, { FC } from 'react'

import { useAsyncFn, useMount, useUnmount } from 'react-use'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Checkbox, Typography, CircularProgress, Button, Theme } from '@mui/material'
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
import { IconTooltip, AlertType, useAlertContext } from '@libs/common-ui'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { TQlikReportingCoreClasses } from '../../QlikReportingCore'

export interface IQlikReportingShareFormDialogProps {
    reportId: number
    classNames?: Partial<TQlikReportingCoreClasses>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    onClose: any
}

const QlikReportingShareFormDialog: FC<IQlikReportingShareFormDialogProps> = ({
    reportId,
    color = 'secondary',
    classNames,
    onClose
}) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [users, setUsers] = React.useState([])
    const [allUsers, setAllUsers] = React.useState([])
    const [, setIsSearchActive] = React.useState<boolean>(false)
    const [isSaveInProgress, setIsSaveInProgress] = React.useState<boolean>(false)
    const [switchInProgress, setSwitchInProgress] = React.useState<boolean>(false)
    const [searchText, setSearchText] = React.useState<string>('')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const { appUserList, appUser } = useAuthContext()
    const { isReportSystem, getReportUsers, shareReport, unShareReport, refreshReportUsers } =
        useQlikReportingContext()
    const { showToast } = useAlertContext()
    const { classes } = useStyles()
    const { t } = useI18n()

    const columns = [
        { id: 'checkbox', label: '', format: 'checkbox', visible: true },
        {
            id: 'userName',
            label: t(translation.reportingDialogShareTableUserColumnLabel),
            format: 'string',
            visible: true
        }
    ]

    const [_, getAndSetUsers] = useAsyncFn(async () => {
        let allUsers = []
        if (!isReportSystem) {
            allUsers = appUserList.filter(item => item.appUserId !== appUser?.appUserId) as any
            const sharedWithUsers = await getReportUsers(reportId, false)
            allUsers.map(u => {
                u.sharedWith = !!sharedWithUsers?.find(s => s.appUserId === u.appUserId)
            })
        }
        setUsers(allUsers)
        setAllUsers(allUsers)
    }, [isReportSystem])

    const handleOpenSearchClick = () => {
        setSearchText('')
        setIsSearchActive(true)
    }

    const handleCloseSearchClick = () => {
        setSearchText('')
        setIsSearchActive(false)
        setUsers(allUsers)
    }

    const handleSearchChange = e => {
        setPage(0)
        const newUserList = [...allUsers]

        if (e.target.value !== '') {
            let filteredList: any[] = []
            filteredList = newUserList.filter(item => {
                return item.name.toLowerCase().includes(e.target.value.toLowerCase())
            })
            setUsers(filteredList)
        } else {
            setUsers(allUsers)
        }
        setSearchText(e.target.value)
    }

    const onSaveShared = () => {
        setIsSaveInProgress(true)
        const selectedUsers: any = {
            appUserIds: []
        }
        allUsers.forEach(u => {
            if (u.sharedWith) {
                selectedUsers.appUserIds.push(u.id)
            }
        })
        setIsSaveInProgress(false)
        onClose()
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const handleOnShareWithChange = async (user, checked) => {
        try {
            setSwitchInProgress(true)
            const currentUserList = [...allUsers]
            const currentFilteredUsers = [...users]
            const changedUser = currentUserList?.find(u => u.appUserId === user.appUserId)
            changedUser.sharedWith = checked
            if (checked) {
                const selectedUsers: any = {
                    appUserIds: []
                }
                currentUserList.forEach(u => {
                    if (u.sharedWith) {
                        selectedUsers.appUserIds.push(u.appUserId)
                    }
                })
                await shareReport(reportId, selectedUsers)
                showToast(t(translation.reportingDialogShareMsgSuccess), AlertType.SUCCESS)
            } else {
                const unselectedUser: any = {
                    appUserIds: [changedUser.appUserId]
                }
                await unShareReport(reportId, unselectedUser)
                showToast(t(translation.reportingDialogUnshareMsgSuccess), AlertType.SUCCESS)
            }
            setAllUsers(currentUserList)
            setUsers(currentFilteredUsers)
        } catch (error) {
            showToast(t(translation.reportingDialogShareMsgError), AlertType.ERROR)
        } finally {
            setSwitchInProgress(false)
        }
    }

    useMount(async () => {
        setIsLoading(true)
        await getAndSetUsers()
        setIsLoading(false)
    })

    useUnmount(async () => {
        await refreshReportUsers()
    })

    return (
        <Box display="flex" className={classes.container}>
            <Box className={classes.header}>
                <Box display="flex" className={classes.searchContainer}>
                    <IconTooltip title={t(translation.reportingShareDialogSearch)}>
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
                            fullWidth
                            placeholder={t(translation.reportingSearchPlaceholder)}
                            inputProps={{ 'aria-label': 'search users' }}
                            onChange={e => handleSearchChange(e)}
                            value={searchText}
                        />
                    </Box>
                    {searchText ? (
                        <IconTooltip title={t(translation.reportingDialogSearchTooltip)}>
                            <IconButton
                                aria-label="search"
                                onClick={handleCloseSearchClick}
                                className={classes.iconButton}>
                                <CloseIcon className={classes.icon} />
                            </IconButton>
                        </IconTooltip>
                    ) : null}
                </Box>
            </Box>
            <TableContainer className={classes.tableContainer}>
                {!isLoading ? (
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
                                            minHeight={`325px`}
                                            width="100%">
                                            <Typography
                                                style={{
                                                    fontSize: '0.925rem',
                                                    fontStyle: 'oblique'
                                                }}>
                                                {t(translation.reportngDialogShareEmptyUserListMsg)}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <Box className={classes.loaderContainer}>
                        <CircularProgress color={color} size={48} />
                    </Box>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box mb={2} mt={5} display="flex" justifyContent="flex-end">
                <Button
                    onClick={onClose}
                    className={`${classes.buttonCancel} ${classNames?.buttonCancel}`}
                    disabled={isSaveInProgress}>
                    {t(translation.reportingDialogFormBtnCancel)}
                </Button>
                <Button
                    onClick={onSaveShared}
                    disabled={isSaveInProgress}
                    className={`${classes.buttonSave} ${classNames?.buttonSave}`}>
                    {isSaveInProgress ? (
                        <CircularProgress color={color} size={20} />
                    ) : (
                        t(translation.reportingDialogFormBtnClose)
                    )}
                </Button>
            </Box>
        </Box>
    )
}

export default QlikReportingShareFormDialog

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        width: '100%',
        flexDirection: 'column',
        paddingLeft: '20px',
        paddingRight: '20px'
    },
    header: {
        width: '100%',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
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
        width: '500px',
        padding: '8px',
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
        height: '280px'
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
    }
}))
