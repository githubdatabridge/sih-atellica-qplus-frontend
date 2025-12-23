import React, { memo, FC } from 'react'

import { Chip, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

export interface IQlikFilterTagProps {
    id: string
    tag: string
    cssChip?: any
}

const QlikFilterTag: FC<IQlikFilterTagProps> = ({ id, tag, cssChip }) => {
    const useStyles = makeStyles()((theme: Theme) => ({
        chipRoot: {
            marginRight: '10px',
            border: `0px solid`,
            borderRadius: '32px',
            borderTopLeftRadius: 70,
            borderTopRightRadius: 70,
            borderBottomLeftRadius: 70,
            borderBottomRightRadius: 70,
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.secondary.contrastText,
            '&:focus': {
                backgroundColor: 'none'
            },
            marginBottom: '2px',
            height: '27px'
        },
        iconButton: {
            cursor: 'pointer !important'
        },
        chipText: {
            color: '#FFF',
            fontSize: '10px',
            fontWeight: 400
        }
    }))
    const { classes } = useStyles()
    const { t } = useI18n()

    const chipContent = (
        <p style={{ fontWeight: cssChip?.fontWeight || 400 }}>
            {t(tag.substring(tag.indexOf('_') + 1).toUpperCase())}
        </p>
    )

    return (
        <Chip
            variant="filled"
            classes={{
                root: classes.chipRoot,
                label: classes.chipText
            }}
            style={cssChip}
            label={chipContent}
        />
    )
}

export default memo(QlikFilterTag)
