import React, { FC, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, List, ListItem, ListItemText, Menu } from '@mui/material'

import { QBookmark } from '@libs/qlik-models'

export interface IDataGridListItemAction {
    icon?: React.ReactNode
    label: string
    handleOnClickCallback?: (record: any) => void
}

export interface IDataGridActionsListProps {
    record: QBookmark
    index: string
    handleListItemLoadingCallback: (index: string) => void
    actions?: IDataGridListItemAction[]
    classNames?: any
}

export const ColumnActionsList: FC<IDataGridActionsListProps> = ({
    actions,
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

    const handleListItemClick = async (action: IDataGridListItemAction) => {
        try {
            handleListItemLoadingCallback(index)
            if (action?.handleOnClickCallback) {
                await action.handleOnClickCallback(record)
            }
            setAnchorEl(null)
        } finally {
            handleListItemLoadingCallback('')
        }
    }

    const listItemAction = (a: any, i: number) => (
        <ListItem key={`${i}-${a.label}`} dense onClick={() => handleListItemClick(a)} button>
            <ListItemText primary={a.label} sx={{ fontSize: '0.875rem' }} disableTypography />
        </ListItem>
    )

    const RenderActions = actions?.map((a: any, i: number) => listItemAction(a, i))

    return (
        <div className="flex items-center">
            <IconButton onClick={handleMenuOpen} classes={{ root: classNames?.tableCellAction }}>
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
                <List disablePadding>{RenderActions}</List>
            </Menu>
        </div>
    )
}
