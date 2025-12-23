import React, { memo, FC } from 'react'

import StarIcon from '@mui/icons-material/Star'
import { Chip, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'
import { useQlikExpression } from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

export interface IQlikCalculatedSelectionFieldProps {
    qlikAppId: string
    titleExpression: string
    kpiExpression: string
    calcExpression?: string
    cssChipCalculated?: any
    isVertical?: boolean
}

const QlikCalculatedSelectionField: FC<IQlikCalculatedSelectionFieldProps> = ({
    qlikAppId,
    titleExpression,
    kpiExpression,
    calcExpression,
    cssChipCalculated,
    isVertical = false
}) => {
    const useStyles = makeStyles()((theme: Theme) => ({
        chipRoot: {
            marginRight: isVertical ? '0px' : '10px',
            width: isVertical && '100%',
            border: `2px solid #7e868c`,
            borderRadius: '32px',
            borderTopLeftRadius: 70,
            borderTopRightRadius: 70,
            borderBottomLeftRadius: 70,
            borderBottomRightRadius: 70,
            backgroundColor: '#EBEBEB',
            color: theme.palette.primary.dark
        },
        svgIcon: {
            fontSize: '1.7rem',
            color: theme.palette.primary.dark
        },
        chipText: {
            color: theme.palette.primary.dark
        },
        icon: {
            color: theme.palette.primary.dark
        },
        tooltip: {
            padding: 0
        },
        verticalTooltip: {
            padding: '10px 0px'
        }
    }))

    const { classes } = useStyles()
    const { qAppId } = useQlikApp(qlikAppId)

    const {
        qKpis: [qFieldLabel, qFieldValue, qCalcExpression]
    } = useQlikExpression({
        qlikAppId: qAppId,
        expressions: [titleExpression, kpiExpression, calcExpression || '-1']
    })

    const fieldContent = (
        <>
            <p style={{ fontWeight: 500, color: cssChipCalculated['color'] }}>{qFieldLabel}</p>
            <p style={{ fontSize: '10px', color: cssChipCalculated['color'] }}>
                {' '}
                {qFieldValue?.length <= 20 ? qFieldValue : `${qFieldValue?.slice(0, 20)}...`}
            </p>
        </>
    )

    const onStarClickHandler = () => {
        return
    }

    return parseInt(qCalcExpression) === -1 ? (
        <Chip
            variant="filled"
            classes={{
                root: classes.chipRoot,
                label: classes.chipText,
                deleteIcon: classes.icon,
                deleteIconColorPrimary: classes.icon,
                deleteIconColorSecondary: classes.icon
            }}
            label={fieldContent}
            deleteIcon={
                <IconTooltip title={'Default Selection'}>
                    <IconButton size="small">
                        <StarIcon className={classes.svgIcon} />
                    </IconButton>
                </IconTooltip>
            }
            onDelete={onStarClickHandler}
            style={cssChipCalculated}
        />
    ) : null
}

export default memo(QlikCalculatedSelectionField)
