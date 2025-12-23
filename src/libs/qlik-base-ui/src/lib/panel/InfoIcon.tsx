import React, { FC } from 'react'

import ReactHtmlParser from 'react-html-parser'

import Info from '@mui/icons-material/Info'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { DarkTooltip } from '@libs/common-ui'

type TQlikInfoClasses = {
    iconButton?: string
    icon?: string
}

export interface IQlikInfoIconProps {
    title: string
    text: string
    color?: 'primary' | 'secondary' | 'default' | 'inherit'
    icon?: React.ReactNode
    classNames?: TQlikInfoClasses
}

const InfoIcon: FC<IQlikInfoIconProps> = ({ icon, title, text, color = 'primary', classNames }) => {
    const theme = useTheme()
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
                            color:
                                color === 'primary'
                                    ? theme.palette.primary.contrastText
                                    : color === 'secondary'
                                    ? theme.palette.secondary.contrastText
                                    : theme.palette.text.primary,
                            fontWeight: 500
                        }}>
                        {title}
                    </Typography>
                    <Typography
                        style={{
                            color:
                                color === 'primary'
                                    ? theme.palette.primary.contrastText
                                    : color === 'secondary'
                                    ? theme.palette.secondary.contrastText
                                    : theme.palette.text.primary,
                            fontSize: '0.85rem',
                            fontWeight: 400
                        }}>
                        {text ? ReactHtmlParser(text) : <></>}
                    </Typography>
                </Box>
            }>
            <Box style={{ width: '44px', textAlign: 'center' }}>
                <IconButton size="small" color={color} className={classNames?.iconButton || ''}>
                    {icon || <Info className={classNames?.icon || ''} />}
                </IconButton>
            </Box>
        </DarkTooltip>
    )
}

export default React.memo(InfoIcon)
