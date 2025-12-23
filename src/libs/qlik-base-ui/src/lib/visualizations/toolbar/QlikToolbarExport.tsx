import React, { FC, useState } from 'react'

import { useMediaQuery } from 'react-responsive'

import FileDownloadIcon from '@mui/icons-material/FileDownload'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableViewIcon from '@mui/icons-material/TableView'
import {
    MenuList,
    MenuItem,
    Menu,
    IconButton,
    Typography,
    Box,
    CircularProgress
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'

import { makeStyles } from 'tss-react/mui'

import { useI18n, useBaseUiContext } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import { useQlikVisualizationContext } from '../QlikVisualizationContext'
import translation from './constants/translations'

type TQlikToolbarrExportClasses = {
    icon?: string
    iconButton?: string
}

export interface IQlikToolbarExportProps {
    types?: Array<'xlsx' | 'pdf' | 'png'>
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    cssButtonIcon?: any
    cssIcon?: any
    classNames?: Partial<TQlikToolbarrExportClasses>
}

const useStyles = makeStyles()(() => ({
    listIcon: {
        minWidth: '30px'
    },
    iconButton: {
        padding: 0,
        paddingLeft: 4
    },
    list: {
        padding: 0,
        paddingLeft: 4,
        paddingRight: 4,
        minWidth: '100px'
    },
    root: {
        minHeight: '10px',
        height: '40px',
        padding: 0
    }
}))

const QlikToolbarExport: FC<IQlikToolbarExportProps> = ({
    types,
    color = 'secondary',
    cssButtonIcon,
    cssIcon,
    classNames
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const { onVisualizationExport } = useQlikVisualizationContext()
    const {
        exportNode,
        exportPdfNode,
        exportPngNode,
        exportXlsxNode,
        cssQlikToolbarExportMenuItem,
        cssQlikToolbarExportTypography
    } = useBaseUiContext()
    const isTablet = useMediaQuery({ query: '(max-width: 1100px)' })

    const { t } = useI18n()

    const openExportMenu = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const closeExportMenu = () => {
        setAnchorEl(null)
    }

    const handleExport = async (types: string) => {
        setIsLoading(true)
        await onVisualizationExport(types)
        setIsLoading(false)
        closeExportMenu()
    }

    const responsiveListItem = () => (isTablet ? { minWidth: '25px' } : {})
    const responsiveIcon = () => (isTablet ? { width: '15px' } : {})

    const { classes } = useStyles()
    return (
        <>
            <IconTooltip title={t(translation.exportTooltip)}>
                <IconButton
                    onClick={openExportMenu}
                    size="small"
                    style={responsiveIcon()}
                    color="primary"
                    sx={{ ...cssButtonIcon }}
                    className={classNames?.iconButton || ''}>
                    {exportNode || (
                        <FileDownloadIcon sx={{ ...cssIcon }} className={classNames?.icon || ''} />
                    )}
                </IconButton>
            </IconTooltip>
            <Menu
                id="exportMenu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeExportMenu}>
                {isLoading && (
                    <Box
                        display="flex"
                        position="absolute"
                        top={0}
                        left={0}
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                        style={{
                            opacity: 0.8,
                            zIndex: 14000
                        }}>
                        <CircularProgress color={color} size={24} />
                    </Box>
                )}
                <MenuList
                    classes={{
                        root: classes.list
                    }}>
                    {types?.includes('pdf') && (
                        <MenuItem
                            style={{ ...cssQlikToolbarExportMenuItem }}
                            onClick={() => {
                                handleExport('pdf')
                            }}
                            classes={{ root: classes.root }}
                            divider
                            disabled={isLoading}>
                            <ListItemIcon
                                style={responsiveListItem()}
                                classes={{ root: classes.listIcon }}>
                                <IconButton
                                    classes={{ root: classes.iconButton }}
                                    color="primary"
                                    style={responsiveIcon()}
                                    className={classNames?.iconButton || ''}>
                                    {exportPdfNode || (
                                        <PictureAsPdfIcon
                                            fontSize="small"
                                            sx={{ ...cssIcon }}
                                            className={classNames?.icon || ''}
                                        />
                                    )}
                                </IconButton>
                            </ListItemIcon>
                            <Typography
                                sx={{ fontSize: '0.825rem', ...cssQlikToolbarExportTypography }}>
                                PDF
                            </Typography>
                        </MenuItem>
                    )}
                    {types?.includes('xlsx') && (
                        <MenuItem
                            style={{ ...cssQlikToolbarExportMenuItem }}
                            onClick={() => {
                                handleExport('xlsx')
                            }}
                            classes={{ root: classes.root }}
                            divider
                            disabled={isLoading}>
                            <ListItemIcon
                                style={responsiveListItem()}
                                classes={{ root: classes.listIcon }}>
                                <IconButton
                                    color="primary"
                                    size="small"
                                    classes={{ root: classes.iconButton }}
                                    style={responsiveIcon()}
                                    className={classNames?.iconButton || ''}>
                                    {exportXlsxNode || (
                                        <TableViewIcon
                                            fontSize="small"
                                            sx={{ ...cssIcon }}
                                            className={classNames?.icon || ''}
                                        />
                                    )}
                                </IconButton>
                            </ListItemIcon>
                            <Typography
                                sx={{ fontSize: '0.825rem', ...cssQlikToolbarExportTypography }}>
                                XLSX
                            </Typography>
                        </MenuItem>
                    )}
                    {types?.includes('png') && (
                        <MenuItem
                            style={{ ...cssQlikToolbarExportMenuItem }}
                            onClick={() => {
                                handleExport('png')
                            }}
                            classes={{ root: classes.root }}
                            divider
                            disabled={isLoading}>
                            <ListItemIcon
                                style={responsiveListItem()}
                                classes={{ root: classes.listIcon }}>
                                <IconButton
                                    color="primary"
                                    size="small"
                                    classes={{ root: classes.iconButton }}
                                    style={responsiveIcon()}
                                    className={classNames?.iconButton || ''}>
                                    {exportPngNode || (
                                        <InsertPhotoIcon
                                            fontSize="small"
                                            sx={{ ...cssIcon }}
                                            className={classNames?.icon || ''}
                                        />
                                    )}
                                </IconButton>
                            </ListItemIcon>
                            <Typography
                                sx={{ fontSize: '0.825rem', ...cssQlikToolbarExportTypography }}>
                                PNG
                            </Typography>
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </>
    )
}

export default QlikToolbarExport
