import React, { memo, FC, useEffect, useState } from 'react'

import { Chip, Container, Grid, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useQlikField, useQlikFieldSelect } from '@libs/qlik-capability-hooks'
import { useQlikApp } from '@libs/qlik-providers'

export interface IQlikFilterChipFieldProps {
    qlikAppId: string
    fieldName: string
    fieldTitle: string
    data: any
    cssLocked?: any
    cssPossible?: any
    cssChipSelected?: any
    cssExcluded?: any
}

const QlikFilterChipField: FC<IQlikFilterChipFieldProps> = ({
    qlikAppId,
    fieldTitle,
    fieldName,
    data,
    cssLocked,
    cssPossible,
    cssChipSelected,
    cssExcluded
}) => {
    const { classes } = useStyles()
    const [list, setList] = useState<any>([])
    const { qAppId } = useQlikApp(qlikAppId)

    const { setField } = useQlikField()
    const { setFieldSelect } = useQlikFieldSelect()

    const handleQlikSelection = async (qElemNumber: number, e) => {
        const qField = await setField(fieldName, qAppId)
        const r = await setFieldSelect(qField, [qElemNumber], qAppId, true)
    }

    useEffect(() => {
        setList(data)
        return () => {}
    }, [data])

    if (list.length === 0) return null

    const chips = []

    for (let i = 0; i <= list.length - 1; i++) {
        if (list[i].qText) {
            chips.push(
                <Chip
                    key={list[i].qElemNumber}
                    variant="filled"
                    classes={{
                        root:
                            list[i].qState === 'S'
                                ? classes.chipRoot
                                : list[i].qState === 'O'
                                ? classes.chipRootPossible
                                : list[i].qState === 'L'
                                ? classes.chipRootLocked
                                : classes.chipRootInactive,
                        label: classes.chipText,
                        deleteIcon: classes.icon,
                        deleteIconColorPrimary: classes.icon,
                        deleteIconColorSecondary: classes.icon
                    }}
                    label={list[i].qText}
                    onClick={e => handleQlikSelection(list[i].qElemNumber, e)}
                    style={
                        list[i].qState === 'S'
                            ? cssChipSelected
                            : list[i].qState === 'O'
                            ? cssPossible
                            : list[i].qState === 'L'
                            ? cssLocked
                            : cssExcluded
                    }
                />
            )
        }
    }

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid container>
                    <Grid item xs={12} sm={12}>
                        <Typography className={classes.chipTitle}>{fieldTitle}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {chips}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default memo(QlikFilterChipField)

const useStyles = makeStyles()((theme: Theme) => ({
    chipRoot: {
        marginRight: '40px !important',
        border: `2px solid ${theme.palette.secondary.dark}`,
        minWidth: '100px',
        borderRadius: '32px',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        backgroundColor: '#d0e0ec',
        color: '#000',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        height: '40px',
        marginBottom: '50px'
    },
    chipRootPossible: {
        border: '1px solid rgba(155,155,155,0.48)',
        backgroundColor: '#FFF',
        marginRight: '40px !important',
        minWidth: '100px',
        borderRadius: '32px',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        color: theme.palette.primary.dark,
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        height: '40px',
        marginBottom: '50px'
    },
    chipRootInactive: {
        border: '1px solid rgba(155,155,155,0.48)',
        backgroundColor: '#EFEFEF',
        marginRight: '40px !important',
        minWidth: '100px',
        borderRadius: '32px',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        color: theme.palette.primary.dark,
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        height: '40px',
        marginBottom: '50px'
    },
    chipRootLocked: {
        border: '1px solid rgba(155,155,155,0.48)',
        backgroundColor: theme.palette.primary.dark,
        marginRight: '40px !important',
        minWidth: '100px',
        borderRadius: '32px',
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        color: '#FFF',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        height: '40px',
        marginBottom: '50px'
    },
    chipTitle: {
        color: '#273540',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '20px',
        paddingBottom: '20px',
        paddingTop: '30px'
    },
    chipText: {
        color: '##71ACFF'
    },
    icon: {
        color: '#000'
    },
    tootlipArrow: {
        color: '#fff'
    },
    tooltipRoot: {
        border: 'solid 1.5px',
        borderColor: theme.palette.primary.main
    }
}))
