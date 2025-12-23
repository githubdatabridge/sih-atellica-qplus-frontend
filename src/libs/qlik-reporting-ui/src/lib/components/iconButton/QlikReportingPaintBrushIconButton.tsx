import React, { FC } from 'react'

import BrushIcon from '@mui/icons-material/Brush'
import { IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'

type TQlikReportingPaintBrushIconButton = {
    iconButton: string
}

export interface IQlikReportingPaintBrushIconButtonProps {
    classNames: Partial<TQlikReportingPaintBrushIconButton>
}

const QlikReportingPaintBrushIconButton: FC<IQlikReportingPaintBrushIconButtonProps> = ({
    classNames
}) => {
    const { classes } = useStyles()

    return (
        <IconTooltip title={'Author'}>
            <IconButton
                color="primary"
                aria-label="locker"
                component="span"
                classes={{
                    root: `${classes.iconButton} ${classNames?.iconButton || ''}`
                }}>
                {<BrushIcon />}
            </IconButton>
        </IconTooltip>
    )
}

export default QlikReportingPaintBrushIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    iconText: {
        fontSize: '0.9rem'
    },
    iconButton: {
        height: '28px',
        width: '28px',
        background: theme.palette.primary.main,
        color: theme.palette.secondary.main,
        '&:hover': {
            background: theme.palette.primary.main,
            color: theme.palette.secondary.main
        }
    }
}))
