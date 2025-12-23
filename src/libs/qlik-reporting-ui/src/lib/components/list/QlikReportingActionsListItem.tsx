import React, { FC, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, List, ListItem, ListItemText, Menu } from '@mui/material'

import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translations'

interface IQlikReportingActionsListItemProps {
    id: number
    isAdmin?: boolean
    readOnly: boolean
    sharedWithMe?: boolean
    onReportDeleteCallback?: (id: number) => void
    onReportRestoreCallback?: (id: number) => void
    onReportUnshareCallback?: (id: number) => void
}

const QlikReportingActionsListItem: FC<IQlikReportingActionsListItemProps> = ({
    id,
    isAdmin = false,
    readOnly,
    sharedWithMe = false,
    onReportDeleteCallback,
    onReportRestoreCallback,
    onReportUnshareCallback
}) => {
    const { t } = useI18n()

    const [anchorEl, setAnchorEl] = useState(null)
    const location = useLocation()

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleDeleteReport = async (id: number) => {
        try {
            // Delete Report Callback function
            onReportDeleteCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleRestoreReport = async (id: number) => {
        try {
            // Restore Report Callback function
            onReportRestoreCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleUnshareReport = async (id: number) => {
        try {
            // Unshare Report Callback function
            onReportUnshareCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const getReportLink = (reportId: number) => {
        if (!location?.pathname) return ''

        const pageId = location.pathname.replace(/_/g, '/')

        const params = new URLSearchParams({
            type: 'reports',
            reportId: `${reportId}`
        })

        return `${pageId}?${params.toString()}`
    }

    const actionsReport = (
        <>
            <ListItem
                key={`${id}-restore`}
                dense
                button
                onClick={() => handleRestoreReport(id)}
                component={Link}
                to={getReportLink(id)}>
                <ListItemText
                    primary={t(translation.reportingDialogMgmtListTableActionRestore)}
                    sx={{ fontSize: '0.875rem' }}
                    disableTypography
                />
            </ListItem>
            {!readOnly ? (
                <ListItem key={`${id}-delete`} dense button onClick={() => handleDeleteReport(id)}>
                    <ListItemText
                        primary={t(translation.reportingDialogMgmtListTableActionRemove)}
                        sx={{ fontSize: '0.875rem' }}
                        disableTypography
                    />
                </ListItem>
            ) : null}
            {sharedWithMe ? (
                <ListItem
                    key={`${id}-unshare`}
                    dense
                    button
                    onClick={() => handleUnshareReport(id)}>
                    <ListItemText
                        primary={t(translation.reportingDialogMgmtListTableActionUnshare)}
                        sx={{ fontSize: '0.875rem' }}
                        disableTypography
                    />
                </ListItem>
            ) : null}
        </>
    )

    return (
        <div className="flex items-center">
            <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: 500
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 0,
                    horizontal: 'left'
                }}>
                <List disablePadding>{actionsReport}</List>
            </Menu>
        </div>
    )
}

export default QlikReportingActionsListItem
