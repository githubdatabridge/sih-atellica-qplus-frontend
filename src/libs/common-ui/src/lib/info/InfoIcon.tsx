import React, { FC } from 'react'

import ReactHtmlParser from 'react-html-parser'

import Info from '@mui/icons-material/Info'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import DarkTooltip from '../tooltips/Tooltip/DarkTooltip'

type TQlikInfoClasses = {
    iconButton?: string
    icon?: string
}

export interface IQlikInfoIconProps {
    title: string
    text: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    icon?: React.ReactNode
    classNames?: TQlikInfoClasses
}

const InfoIcon: FC<IQlikInfoIconProps> = ({ title, text, color = 'primary', icon, classNames }) => {
    const theme = useTheme()

    const textColor =
        color === 'primary'
            ? theme.palette.primary.contrastText
            : color === 'secondary'
            ? theme.palette.secondary.contrastText
            : color === 'info'
            ? theme.palette.info.contrastText
            : color === 'success'
            ? theme.palette.success.contrastText
            : color === 'error'
            ? theme.palette.error.contrastText
            : color === 'warning'
            ? theme.palette.warning.contrastText
            : theme.palette.common.white

    return (
        <DarkTooltip
            arrow
            disableFocusListener
            disableTouchListener
            placement="top-start"
            title={
                <Box p={1} style={{ maxWidth: '400px' }}>
                    <Typography
                        style={{
                            color: textColor,
                            fontWeight: 500,
                            fontSize: '0.825rem'
                        }}>
                        {title}
                    </Typography>
                    <Typography
                        style={{
                            color: textColor,
                            fontSize: '0.8rem',
                            fontWeight: 300
                        }}>
                        {text ? ReactHtmlParser(text) : <></>}
                    </Typography>
                </Box>
            }>
            <Box style={{ width: '44px', textAlign: 'center' }}>
                <IconButton color={color} size="small" className={classNames?.iconButton || ''}>
                    {icon || <Info className={classNames?.icon || ''} />}
                </IconButton>
            </Box>
        </DarkTooltip>
    )
}

export default React.memo(InfoIcon)
