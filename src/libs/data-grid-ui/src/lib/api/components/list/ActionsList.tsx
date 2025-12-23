import React, { FC, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, List, ListItem, ListItemText, Menu } from '@mui/material'

import { IDataGridActionsListProps, IDataGridListItemAction } from '../../types'

export const ColumnActionsList: FC<IDataGridActionsListProps> = ({
    customActions,
    record,
    index,
    classNames,
    handleListItemLoadingCallback
}) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleListItemClick = (action: IDataGridListItemAction) => {
        try {
            handleListItemLoadingCallback(index)
            if (action?.handleOnClickCallback) {
                action.handleOnClickCallback(record)
            }
            setAnchorEl(null)
        } finally {
            handleListItemLoadingCallback(-1)
        }
    }

    const listItemAction = (a: any, i: number) => (
        <ListItem key={`${i}-${a.label}`} dense onClick={() => handleListItemClick(a)} button>
            <ListItemText primary={a.label} disableTypography />
        </ListItem>
    )

    const renderActions = customActions?.map((a: any, i: number) => listItemAction(a, i))

    const defaultTableCellAction = {
        padding: '10px 0px 0px 10px',
        border: 'none',
        '@media (max-width: 342px)': {
            paddingLeft: '5px'
        }
    }

    return (
        <div className="flex items-center">
            <IconButton
                onClick={handleMenuOpen}
                classes={{ root: classNames?.tableCellAction || defaultTableCellAction }}>
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
                <List disablePadding>{renderActions}</List>
            </Menu>
        </div>
    )
}
