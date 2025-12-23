import React, { FC, ReactNode } from 'react'

import { Theme } from '@mui/material'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import { withStyles } from 'tss-react/mui'

interface CustomStyledLoadingButtonProps {
    loading: boolean
    children?: ReactNode
    disabled?: boolean
    className?: string
    classes?: {
        root?: string
        loadingIndicator?: string
        disabled?: string
    }
    onClick?: () => Promise<void>
}

const StyledButton = withStyles(Button, (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.primary.contrastText} !important`,
        '&:hover': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.primary.contrastText} !important`
        }
    },
    disabled: {
        backgroundColor: `${theme.palette.primary.contrastText} !important`,
        color: `${theme.palette.text.disabled} !important`,
        border: `1px solid ${theme.palette.text.disabled} !important`
    }
}))

const StyledLoadingButton: FC<CustomStyledLoadingButtonProps> = ({
    loading,
    children,
    classes,
    ...props
}) => (
    <StyledButton
        {...props}
        disabled={loading || props.disabled}
        className={classes?.root}
        classes={{ disabled: classes?.disabled }}>
        {loading ? <CircularProgress size={24} className={classes?.loadingIndicator} /> : children}
    </StyledButton>
)

export default StyledLoadingButton
