import React, { FC } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { useBaseUiContext } from '@libs/common-providers'

import { IconTooltip } from '../ui'

export interface IFullScreenDialogProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children?: React.ReactNode
    css?: any
    closeTooltipText?: string
    fixed?: boolean
    disableEnforceFocus?: boolean
}

export const FullScreenDialog: FC<IFullScreenDialogProps> = React.memo(
    ({
        isOpen,
        onClose,
        title,
        children,
        css,
        closeTooltipText,
        fixed = false,
        disableEnforceFocus = false
    }) => {
        const {
            cssFullscreenDialog,
            cssFullscreenDialogAppBar,
            cssFullscreenDialogToolbar,
            cssFullscreenDialogIcon,
            cssFullscreenDialogTitle
        } = useBaseUiContext()

        const position = fixed ? 'fixed' : 'relative'

        return (
            <Dialog
                fullScreen
                open={isOpen}
                onClose={onClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                disableEnforceFocus={disableEnforceFocus}
                style={{ zIndex: 1019, overflow: 'auto', ...cssFullscreenDialog }}>
                <Box display="flex" flexDirection="column" height="100%">
                    <AppBar position={position} sx={{ ...cssFullscreenDialogAppBar }}>
                        <Toolbar sx={{ ...cssFullscreenDialogToolbar }}>
                            <Box display="flex" width="100%" alignItems="center">
                                <Box flexGrow="1">
                                    <Typography
                                        variant="h6"
                                        style={{ flexGrow: 1, ...cssFullscreenDialogTitle }}>
                                        {title}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconTooltip title={closeTooltipText}>
                                        <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={onClose}
                                            aria-label="close"
                                            tabIndex={-5}
                                            size="large">
                                            <CloseIcon sx={{ ...cssFullscreenDialogIcon }} />
                                        </IconButton>
                                    </IconTooltip>
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Box
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        flexGrow="1"
                        width="100%"
                        style={css}>
                        {isOpen && children}
                    </Box>
                </Box>
            </Dialog>
        )
    }
)
