import React, { FC, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, List, ListItem, ListItemText, Menu } from '@mui/material'

import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translations'

interface IQlikDatasetDialogActionsListProps {
    id: number
    onDatasetDeleteCallback?: (id: number) => void
    onDatasetEditCallback?: (id: number) => void
    onShowReportCallback?: (id: number) => void
}

const QlikDatasetDialogActionsList: FC<IQlikDatasetDialogActionsListProps> = ({
    id,
    onDatasetDeleteCallback,
    onDatasetEditCallback,
    onShowReportCallback
}) => {
    const { t } = useI18n()

    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleDeleteDataset = async (id: number) => {
        try {
            // Delete Report Callback function
            onDatasetDeleteCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error: ', error)
        }
    }

    const handleEditDataset = async (id: number) => {
        try {
            // Restore Report Callback function
            onDatasetEditCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error: ', error)
        }
    }

    const handleShowReport = async (id: number) => {
        try {
            // Restore Report Callback function
            onShowReportCallback(id)
            setAnchorEl(null)
        } catch (error) {
            console.log('Qplus Error: ', error)
        }
    }

    const actionsReport = (
        <>
            <ListItem key={`${id}-restore`} dense button onClick={() => handleEditDataset(id)}>
                <ListItemText
                    primary={t(translation.datasetDialogTableActionEdit)}
                    sx={{ fontSize: '0.875rem' }}
                    disableTypography
                />
            </ListItem>
            <ListItem key={`${id}-delete`} dense button onClick={() => handleDeleteDataset(id)}>
                <ListItemText
                    primary={t(translation.datasetDialogTableActionDelete)}
                    sx={{ fontSize: '0.875rem' }}
                    disableTypography
                />
            </ListItem>
            <ListItem key={`${id}-show-report`} dense button onClick={() => handleShowReport(id)}>
                <ListItemText
                    primary={t(translation.datasetDialogTableActionShowReport)}
                    sx={{ fontSize: '0.875rem' }}
                    disableTypography
                />
            </ListItem>
        </>
    )

    return (
        <div className="flex items-center">
            <IconButton onClick={handleMenuOpen} classes={{}}>
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

export default QlikDatasetDialogActionsList
