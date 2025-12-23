import React, { memo, FC } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Chip, IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import translation from '../../constants/translations'

export interface IQlikReportingSelectionChipProps {
    id: string
    item: string
    type: string
    color: string
    closeIconColor?: string
    cssChip?: any
    onRemoveChipHandler?(id: string, type: string)
}

const QlikReportingSelectionChip: FC<IQlikReportingSelectionChipProps> = ({
    id,
    type,
    item,
    color,
    closeIconColor = 'black',
    cssChip,
    onRemoveChipHandler
}) => {
    const useStyles = makeStyles()((theme: Theme) => ({
        chipRoot: {
            marginRight: '10px',
            borderRadius: '25px',
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main
            },
            '&:hover $svgIcon': {
                color: theme.palette.secondary.contrastText
            }
        },
        svgIcon: {
            fontSize: '1.5rem',
            color: 'transparent',
            cursor: 'pointer !important',
            '&:hover': {
                color: 'rgba(0, 0, 0, 0.9) !important'
            }
        },
        iconButton: {
            cursor: 'pointer !important',
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        chipText: {
            color: theme.palette.text.primary
        },
        icon: {
            color: closeIconColor
        }
    }))
    const { classes } = useStyles()

    const chipContent = <p style={{ fontWeight: cssChip?.fontWeight || 500 }}>{item}</p>

    const onCloseClickHandler = () => {
        if (onRemoveChipHandler) {
            onRemoveChipHandler(id, type)
        }
    }

    const { t } = useI18n()

    return (
        <Chip
            variant="filled"
            classes={{
                root: classes.chipRoot,
                label: classes.chipText,
                deleteIcon: classes.icon,
                deleteIconColorPrimary: classes.icon,
                deleteIconColorSecondary: classes.icon
            }}
            style={cssChip}
            label={chipContent}
            deleteIcon={
                <IconTooltip title={t(translation.reportingControlRemoveTooltip)}>
                    <IconButton
                        size="small"
                        onClick={() => onCloseClickHandler()}
                        className={classes.iconButton}>
                        <CloseIcon className={classes.svgIcon} />
                    </IconButton>
                </IconTooltip>
            }
            onDelete={onCloseClickHandler}
        />
    )
}

export default memo(QlikReportingSelectionChip)
