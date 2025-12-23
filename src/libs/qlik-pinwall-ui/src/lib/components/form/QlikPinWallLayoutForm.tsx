import React, { FC, ChangeEvent, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { useTheme, Theme } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import SvgGridLayout_3_3 from '../../icons/SvgGridLayout_3_3'
import SvgGridLayout_4_4 from '../../icons/SvgGridLayout_4_4'

interface QlikPinWallLayoutFormProps {
    defaultCellCount?: number
    onSetLayoutCallback: (cells: number) => void
}

const QlikPinWallLayoutForm: FC<QlikPinWallLayoutFormProps> = ({
    onSetLayoutCallback,
    defaultCellCount = 0
}) => {
    const [cellCount, setCellCount] = useState<number>(9)
    const { t } = useI18n()
    const theme = useTheme()
    const { classes } = useStyles()

    useEffect(() => {
        setCellCount(defaultCellCount)
    }, [defaultCellCount])

    const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
        setCellCount(Number(event.target.value))
        onSetLayoutCallback(Number(event.target.value))
    }

    const controlProps = item => ({
        checked: cellCount === item,
        onChange: handleChange,
        value: item,
        name: 'layout-radio-button-demo',
        inputProps: { 'aria-label': item }
    })

    return (
        <Box display="flex" width="100%" p={2} textAlign="center">
            <Box width="50%">
                <FormControlLabel
                    value={9}
                    control={<Radio {...controlProps(9)} color="secondary" />}
                    label="3*3 Grid"
                    classes={{
                        label: classes.formLabel
                    }}
                />
                <Box>
                    <SvgGridLayout_3_3 color={theme.palette.primary.main} />
                </Box>
            </Box>
            <Box width="50%">
                <FormControlLabel
                    value={16}
                    control={<Radio {...controlProps(16)} color="secondary" />}
                    label="4*4 Grid"
                    classes={{
                        label: classes.formLabel
                    }}
                />
                <Box>
                    <SvgGridLayout_4_4 color={theme.palette.primary.main} />
                </Box>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles()(() => ({
    formLabel: {
        fontWeight: 500,
        fontSize: '0.825rem'
    }
}))

export default QlikPinWallLayoutForm
