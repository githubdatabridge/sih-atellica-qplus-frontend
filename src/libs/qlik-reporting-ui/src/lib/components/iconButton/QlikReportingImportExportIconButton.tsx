import { FC, useState, useEffect } from 'react'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import {
    MenuList,
    MenuItem,
    Menu,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Theme
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { useQlikLoaderContext } from '@libs/qlik-providers'

import translation from '../../constants/translations'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'

export type TQlikReportingImportExportIconButton = {
    menuButton: string
    buttonCancel: string
    buttonSave: string
}

interface IQlikReportingImportExportIconButtonProps {
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    openImportExportModal: any
    classNames: Partial<TQlikReportingImportExportIconButton>
}

const QlikReportingImportExportIconButton: FC<IQlikReportingImportExportIconButtonProps> = ({
    color = 'secondary',
    openImportExportModal,
    classNames
}) => {
    const { t } = useI18n()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)

    const [anchorEl, setAnchorEl] = useState(null)
    const {
        reportingImportExportNode,
        reportingImportNode,
        reportingExportNode,
        cssReportingControlButtonIcon
    } = useQlikReportingUiContext()

    const { isQlikMasterItemLoading } = useQlikLoaderContext()

    useEffect(() => {
        setDisabled(isQlikMasterItemLoading)
    }, [isQlikMasterItemLoading])

    const openExportMenu = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const closeExportMenu = () => {
        setAnchorEl(null)
    }

    const handleItemClick = (type: string) => {
        setIsLoading(true)
        openImportExportModal(type)
        closeExportMenu()
        setIsLoading(false)
    }

    const { classes } = useStyles()
    return (
        <>
            <IconTooltip title={t(translation.reportingImportExportTooltip)}>
                <IconButton
                    color="primary"
                    aria-label="import-export"
                    component="span"
                    classes={{
                        root: classes.iconButtonRoot,
                        disabled: classes.iconButtonDisabled
                    }}
                    disabled={disabled}
                    className={`${classes.iconButton} ${classNames?.menuButton || ''}`}
                    onClick={openExportMenu}
                    sx={{ ...cssReportingControlButtonIcon }}>
                    {reportingImportExportNode || (
                        <ImportExportIcon sx={{ width: '24px', height: '24px' }} />
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
                        sx={{
                            opacity: 0.8,
                            background: '#fff',
                            zIndex: 14000
                        }}>
                        <CircularProgress color={color} size={24} />
                    </Box>
                )}
                <MenuList>
                    <MenuItem
                        onClick={() => handleItemClick('export')}
                        disabled={isLoading || disabled}>
                        <ListItemIcon>
                            <IconButton
                                className={classes.iconButtonMenu}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}>
                                {reportingExportNode || <ArrowUpwardIcon />}
                            </IconButton>
                        </ListItemIcon>
                        <Typography className={classes.iconText}>
                            {t(translation.reportingImportExportModalBtnExport)}
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleItemClick('import')} disabled={isLoading}>
                        <ListItemIcon>
                            <IconButton
                                className={classes.iconButtonMenu}
                                classes={{
                                    root: classes.iconButtonRoot,
                                    disabled: classes.iconButtonDisabled
                                }}>
                                {reportingImportNode || <ArrowDownwardIcon />}
                            </IconButton>
                        </ListItemIcon>
                        <Typography className={classes.iconText}>
                            {t(translation.reportingImportExportModalBtnImport)}
                        </Typography>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default QlikReportingImportExportIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    iconButton: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        color: theme.palette.primary.dark,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    },
    iconButtonRoot: {
        padding: 0,
        height: '100%',
        width: '100%',
        borderRadius: '0px !important'
    },
    iconButtonDisabled: {},
    iconButtonMenu: {
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        color: theme.palette.primary.dark,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'transparent'
        }
    },
    iconText: {
        fontSize: '0.9rem'
    }
}))
