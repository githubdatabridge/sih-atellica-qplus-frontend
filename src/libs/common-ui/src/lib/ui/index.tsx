import React, { ReactNode } from 'react'

import { Tooltip, TooltipProps } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Theme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import R from '../../res/R'

/*----------  Styles  ----------*/

const useStyles = makeStyles()((theme: Theme) => ({
    matchingBackground: {
        backgroundColor: R.colors.backgroundGreen
    },
    nonMatchingBackground: {
        backgroundColor: theme.palette.action.hover
    },
    avatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: theme.spacing(2),
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.action.disabled
    },
    replies: {
        paddingLeft: theme.spacing(7)
    },
    scrollBox: {
        overflowY: 'scroll',
        height: 0
    },
    empty: {},
    customTooltip: {
        background: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.text.primary),
        fontSize: '0.8rem',
        fontWeight: 400
    },
    customArrow: {
        color: theme.palette.primary.main
    }
}))

/*----------  Comments  ----------*/

type CommentBoxProps = {
    isMatchingSelection?: boolean
    isHighlighted?: boolean
    children: ReactNode
}

export const CommentBox: React.FC<CommentBoxProps & BoxProps> = React.memo(
    ({ isMatchingSelection = false, isHighlighted = false, children, ...props }) => {
        const { classes } = useStyles()
        return (
            <Box
                display="flex"
                flexDirection="column"
                flexGrow={1}
                className={
                    isMatchingSelection ? classes.matchingBackground : classes.nonMatchingBackground
                }
                style={{
                    backgroundColor: 'transparent',
                    border: isHighlighted ? `2px solid ${R.colors.socialGreen}` : null
                }}
                borderRadius="4px"
                padding={1}
                pt={0}
                {...props}>
                {children}
            </Box>
        )
    }
)

export const CommentAvatar: React.FC<CommentBoxProps> = React.memo(({ children }) => {
    const { classes } = useStyles()
    return <Avatar className={classes.avatar}>{children}</Avatar>
})

export const LoadingContent = React.memo((_props: any) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" flexGrow="1">
            <CircularProgress color="secondary" size={24} />
        </Box>
    )
})

export const IconTooltip: React.FC<TooltipProps> = React.memo(
    ({ children, title, placement = 'bottom' }) => {
        const { classes } = useStyles()
        return (
            <Tooltip
                classes={{
                    tooltip: classes.customTooltip,
                    arrow: classes.customArrow
                }}
                title={title}
                placement={placement}>
                <span>{children}</span>
            </Tooltip>
        )
    }
)
