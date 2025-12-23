import React, { FC, ReactNode, useState, useEffect } from 'react'

import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import BarChartIcon from '@mui/icons-material/BarChart'
import ClearIcon from '@mui/icons-material/Clear'
import PieChartIcon from '@mui/icons-material/PieChart'
import SettingsIcon from '@mui/icons-material/Settings'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TableChartIcon from '@mui/icons-material/TableChart'
import { Theme } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Popper from '@mui/material/Popper'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext } from '@libs/common-providers'
import { IconTooltip, LayoutDivider } from '@libs/common-ui'

import { useQlikVisualizationContext } from '../../QlikVisualizationContext'
import { IQlikVisualizationCoreTypeOptions } from '../../QlikVisualizationCore'
import QlikVisualizationPreferencesDialog from '../dialog/QlikVisualizationPreferencesDialog'

const QlikVisualizationPopperList: FC<IQlikVisualizationCoreTypeOptions> = ({
    types,
    css,
    showSettings = true,
    handleVisualizationClickCallback
}) => {
    const { classes } = useStyles()
    const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
    const [type, setType] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [iconNode, setIconNode] = useState<ReactNode>(null)
    const { vizChangeNode } = useBaseUiContext()
    const { setVisualizationObject, setVisualizationOptions, visualizationType } =
        useQlikVisualizationContext()

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popper' : undefined

    const renderIcon = (vizType: string) => {
        switch (vizType) {
            case 'table':
                return <TableChartIcon className={classes.iconImage} />
            case 'linechart':
                return <ShowChartIcon className={classes.iconImage} />
            case 'barchart':
                return <BarChartIcon className={classes.iconImage} />
            case 'piechart':
                return <PieChartIcon className={classes.iconImage} />
            default:
                return ''
        }
    }

    useEffect(() => {
        setIconNode(visualizationType ? renderIcon(visualizationType) : null)
        setType(visualizationType)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualizationType])

    const handleClick = (event: { currentTarget: any }) => {
        if (!anchorEl) setAnchorEl(event.currentTarget)
    }

    const handleVisualizationAction = (type: string) => {
        setIconNode(type ? renderIcon(type) : null)
        setType(type)

        if (setVisualizationObject) setVisualizationObject({})
        if (setVisualizationOptions) setVisualizationOptions({})

        if (handleVisualizationClickCallback) {
            handleVisualizationClickCallback(type)
        }
    }

    return (
        <div>
            <IconTooltip title="Swap visualization">
                <IconButton
                    size="small"
                    onClick={handleClick}
                    className={iconNode ? classes.iconButtonActive : classes.iconButtonMenu}>
                    {iconNode || vizChangeNode || <AutoGraphIcon className={classes.iconImage} />}
                </IconButton>
            </IconTooltip>
            <Popper id={id} open={open} anchorEl={anchorEl} style={{ zIndex: 10000 }}>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <List
                        className={classes.list}
                        onMouseLeave={() => setAnchorEl(null)}
                        style={{ ...css }}>
                        {types?.map((type, index) => (
                            <ListItem
                                key={index}
                                className={
                                    index !== types.length ? classes.listDividerBottom : null
                                }>
                                <IconButton
                                    size="small"
                                    onClick={() => handleVisualizationAction(type)}
                                    className={classes.iconButton}>
                                    {renderIcon(type)}
                                </IconButton>
                            </ListItem>
                        ))}
                        {iconNode && (
                            <>
                                <ListItem className={classes.listAction}>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleVisualizationAction('')}
                                        className={classes.iconButtonAction}>
                                        <ClearIcon className={classes.iconImage} />
                                    </IconButton>
                                </ListItem>
                                {showSettings && (
                                    <>
                                        <LayoutDivider className={classes.listDividerTop} />
                                        <ListItem className={classes.listAction}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setIsOpenDialog(true)}
                                                className={classes.iconButtonAction}>
                                                <SettingsIcon className={classes.iconImage} />
                                            </IconButton>
                                        </ListItem>
                                    </>
                                )}
                            </>
                        )}
                    </List>
                </ClickAwayListener>
            </Popper>
            {isOpenDialog && (
                <QlikVisualizationPreferencesDialog
                    vizType={type}
                    handleCloseCallback={() => setIsOpenDialog(false)}
                />
            )}
        </div>
    )
}

export default QlikVisualizationPopperList

const useStyles = makeStyles()((theme: Theme) => ({
    iconImage: {
        width: '22px',
        height: '22px'
    },
    iconButtonActive: {
        color: theme.palette.secondary.main
    },
    iconButtonMenu: {
        color: theme.palette.primary.main
    },
    iconButton: {
        padding: 0,
        marginLeft: '-4px',
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.secondary.main
        },
        '&:focus': {
            color: theme.palette.secondary.main
        },
        '&:hover $icon': {
            color: theme.palette.secondary.main
        }
    },
    iconButtonAction: {
        padding: 0,
        marginLeft: '-4px',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ECECEC',
        width: '46px',
        padding: 0,
        marginTop: '-2px'
    },
    listDividerBottom: {
        borderBottom: `1px solid ${theme.palette.info.contrastText}`
    },
    listDividerTop: {
        listDividerTop: `1px solid ${theme.palette.info.contrastText}`,
        height: '2px',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText
    },
    listAction: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText
    }
}))
