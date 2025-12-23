import React, { useState } from 'react'

import { FileDownload } from '@mui/icons-material'
import { CircularProgress, Button, Theme, darken } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'
import { datasetService } from '@libs/core-services'

import translation from '../../constants/translations'
import useFileHandler from '../../hooks/useFileHandler'

export interface IQlikAdminExportButtonProps {
    disabled?: boolean
}

const QlikAdminExportButton = ({ disabled = false }: IQlikAdminExportButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { downloadJsonFile } = useFileHandler()
    const { classes } = useStyles()
    const { t } = useI18n()
    const fileName = 'exported_dataset.json'

    const handleExportReport = async () => {
        try {
            setIsLoading(true)
            const exportedData = await datasetService.getDatasetExport()
            downloadJsonFile(exportedData, fileName)
        } catch (error) {
            console.error('Qplus Error', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <IconTooltip title={t(translation.datasetExportTooltip)}>
            <Button
                onClick={handleExportReport}
                disabled={disabled || isLoading}
                className={`${classes.buttonAction} ${
                    disabled || isLoading ? classes.buttonDisabled : ''
                }`}
                startIcon={!isLoading && <FileDownload />}>
                {isLoading ? (
                    <CircularProgress color="inherit" size={24} />
                ) : (
                    t(translation.datasetExportButton)
                )}
            </Button>
        </IconTooltip>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    buttonAction: {
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        textTransform: 'capitalize',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: '25px',
        minWidth: '115px'
        // Additional styling can go here
    },
    buttonDisabled: {
        border: `0px solid ${theme.palette.primary.main}`,
        color: theme.palette.text.primary,
        backgroundColor: `${theme.palette.action.disabledBackground} !important`, // Overrides the default disabled background
        '& .MuiButton-startIcon': {
            color: darken(theme.palette.text.disabled, 0.4) // Applies the disabled text color to the icon as well
        }
    }
    // Adjust or remove other styles that are no longer needed
}))

export default QlikAdminExportButton
