import React, { FC, useState } from 'react'

import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Box, Theme } from '@mui/material'
import { IconButton } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip, AlertType, ConfirmationDialog, useAlertContext } from '@libs/common-ui'
import { ReportDimensions, ReportMeasures } from '@libs/core-models'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'

interface IQlikReportingLockerIconButtonProps {
    isOpen?: boolean
    isCreated?: boolean
    reportId: number
    dimensions: ReportDimensions[]
    measures: ReportMeasures[]
}

const QlikReportingLockerIconButton: FC<IQlikReportingLockerIconButtonProps> = ({
    isOpen = true,
    isCreated = false,
    reportId,
    dimensions,
    measures
}) => {
    const [cloneDialogOpen, setCloneDialogOpen] = useState<boolean>(false)
    const { t } = useI18n()
    const { cloneReport, setReportIsLoading } = useQlikReportingContext()
    const { showToast } = useAlertContext()

    const { classes } = useStyles()

    const handleCloneReport = async () => {
        try {
            setReportIsLoading(true)
            await cloneReport(reportId, dimensions, measures)
            setCloneDialogOpen(false)
        } catch (error) {
            console.log('Qplus Error: ', error)
            showToast(t(translation.reportingToastCloneError), AlertType.ERROR)
        } finally {
            setReportIsLoading(false)
        }
    }

    const onOpenCloneDialog = () => {
        setCloneDialogOpen(true)
    }

    const onCloseCloneDialog = () => {
        setCloneDialogOpen(false)
    }

    return (
        <Box
            width="60px"
            display="flex"
            justifyContent="center;"
            alignContent="center"
            height="100%">
            <IconTooltip title={isOpen ? 'UnLocked' : 'Locked'}>
                <IconButton
                    color="primary"
                    aria-label="locker"
                    component="span"
                    classes={{
                        root: isOpen && !isCreated ? classes.iconButton : classes.iconButtonLocked
                    }}
                    onClick={!isOpen ? onOpenCloneDialog : null}>
                    {isOpen ? <LockOpenIcon /> : <LockIcon />}
                </IconButton>
            </IconTooltip>
            {cloneDialogOpen && (
                <ConfirmationDialog
                    primaryText={t(translation.reportingDialogUnlockMsg)}
                    hideBackdrop={false}
                    noText={t(translation.reportingDialogConfirmationNo)}
                    yesText={t(translation.reportingDialogConfirmationYes)}
                    dialogTitleText={t(translation.reportingDialogConfirmationTitle)}
                    onClose={onCloseCloneDialog}
                    onNo={onCloseCloneDialog}
                    onYes={() => {
                        handleCloneReport()
                    }}
                />
            )}
        </Box>
    )
}

export default QlikReportingLockerIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    iconText: {
        fontSize: '0.9rem'
    },
    iconButton: {
        width: '60px',
        '&:hover': {
            backgroundColor: 'transparent'
        },
        '&:hover $icon': {
            color: 'rgba(0, 0, 0, 0.9) !important'
        }
    },
    iconButtonLocked: {
        backgroundColor: 'transparent',
        color: theme.palette.info.contrastText,
        '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.info.contrastText
        },
        '&:hover $icon': {
            color: theme.palette.info.contrastText
        }
    }
}))
