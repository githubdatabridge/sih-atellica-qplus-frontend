import React, { FC } from 'react'

import { Link } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'
import { useTheme, Theme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useColorStyles } from '@libs/common-hooks'

import { useQlikPinWallUiContext } from '..'
import SvgEmptyWall from '../res/images/SvgEmptyWall'
import { useButtonStyles } from './hooks'

interface IQlikPinWallEmptyProps {
    isFullscreen?: boolean
    title: string
    description: string
    buttonText?: string
    height: number
    pageId?: string
    showActionButton?: boolean
    showWizardImage?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
}

const QlikPinWallEmpty: FC<IQlikPinWallEmptyProps> = ({
    isFullscreen = false,
    title,
    description,
    buttonText,
    height,
    pageId,
    showActionButton = true,
    showWizardImage = true,
    color = 'secondary'
}) => {
    const theme = useTheme()
    const { classes } = useStyles()
    const { pinwallWizardNode } = useQlikPinWallUiContext()
    const { selectedColor, contrastText } = useColorStyles(color)
    const buttonStyles = useButtonStyles(selectedColor, contrastText)

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                height: isFullscreen ? '100%' : `${height}px`,
                backgroundColor: theme.palette.background.paper
            }}>
            {showWizardImage
                ? pinwallWizardNode || <SvgEmptyWall color={theme.palette.primary.dark} />
                : null}
            <Typography className={classes.textTitle}>{title}</Typography>
            <Box mt={1} />
            <Typography className={classes.txtDescription}>{description}</Typography>
            <Box mt={2} />
            {showActionButton && (
                <Link to={`${pageId}?op=create`} style={{ textDecoration: 'none' }}>
                    <Button className={classes.button} sx={buttonStyles} variant="contained">
                        {buttonText}
                    </Button>
                </Link>
            )}
        </Box>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    textTitle: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '1rem',
        paddingTop: '10px'
    },
    txtDescription: {
        color: theme.palette.text.primary
    },
    button: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    }
}))

export default QlikPinWallEmpty
