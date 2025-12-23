import React, { FC } from 'react'

import ReactHtmlParser from 'react-html-parser'

import { Box, darken, IconButton, Typography } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import DarkTooltip from '../tooltips/Tooltip/DarkTooltip'

export interface IQlikAppInfoIconProps {
    initials: string
    title: string
    text: string
    backgroundColor?: string
    color?: string
    height?: number
    width?: number
    fontSize?: string
    fontWeight?: number
}

const AppInfoIcon: FC<IQlikAppInfoIconProps> = ({
    initials,
    title,
    text,
    backgroundColor,
    color,
    fontSize = '0.825rem',
    fontWeight,
    height = 15,
    width = 15
}) => {
    const { classes } = useStyles()

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
                            color,
                            fontWeight: 500,
                            fontSize: '0.825rem'
                        }}>
                        {title}
                    </Typography>
                    <Typography
                        style={{
                            color,
                            fontSize: '0.8rem',
                            fontWeight: 300
                        }}>
                        {text ? ReactHtmlParser(text) : null}
                    </Typography>
                </Box>
            }>
            <Box style={{ marginTop: '-5px', marginLeft: '-2px' }}>
                <IconButton
                    size="small"
                    classes={{ root: classes.button }}
                    style={{
                        backgroundColor: backgroundColor ? darken(backgroundColor, 0.5) : undefined,
                        width: `${width + 3}px`,
                        height: `${height + 3}px`,
                        borderRadius: '50px',
                        color: color,
                        fontSize: fontSize,
                        fontWeight: fontWeight
                    }}>
                    {initials?.toUpperCase()}
                </IconButton>
            </Box>
        </DarkTooltip>
    )
}

const useStyles = makeStyles()(() => ({
    button: { padding: '0px' }
}))

export default React.memo(AppInfoIcon)
