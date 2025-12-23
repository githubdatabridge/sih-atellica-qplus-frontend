import React, { FC, useState } from 'react'

import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { Box, Theme } from '@mui/material'
import { IconButton } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translations'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'

interface IQlikReportingFullscreenIconButtonProps {
    handleFullscreenCallback: (isFullscreend: boolean) => void
    isEnabled?: boolean
}

const QlikReportingFullscreenIconButton: FC<IQlikReportingFullscreenIconButtonProps> = ({
    handleFullscreenCallback,
    isEnabled = false
}) => {
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const { reportingFullscreenNode } = useQlikReportingUiContext()
    const { t } = useI18n()

    const handleFullscreenClick = (_fullscreen: boolean) => {
        setFullscreen(_fullscreen)
        handleFullscreenCallback(_fullscreen)
    }

    const { classes } = useStyles()

    return (
        <Box width="100%" className={classes.container} textAlign="center">
            <IconTooltip title={t(translation.reportingToolbarFullscreenTooltip)}>
                <IconButton
                    color="primary"
                    aria-label="settings"
                    component="span"
                    classes={{
                        root: classes.iconButton
                    }}
                    onClick={() => handleFullscreenClick(true)}
                    disabled={!isEnabled}>
                    {reportingFullscreenNode || <FullscreenIcon width={24} height={24} />}
                </IconButton>
            </IconTooltip>
        </Box>
    )
}

export default QlikReportingFullscreenIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        zIndex: 1
    },
    iconButton: {
        width: '34px',
        height: '34px',
        cursor: 'pointer',
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.secondary.main
        }
    }
}))
