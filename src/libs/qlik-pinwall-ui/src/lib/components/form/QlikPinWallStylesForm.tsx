import React, { FC, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import { useTheme, Theme } from '@mui/material/styles'

import { useI18n } from '@libs/common-providers'

import translations from '../../constants/translations'
import { PinWallSlider } from '../base'

interface QlikPinWallStylesFormProps {
    defaultMargin?: number
    defaultPadding?: number
    onPaddingCallback: (padding: number) => void
    onMarginCallback: (margin: number) => void
}

const QlikPinWallStylesForm: FC<QlikPinWallStylesFormProps> = ({
    defaultMargin = 0,
    defaultPadding = 0,
    onPaddingCallback,
    onMarginCallback
}) => {
    const [padding, setPadding] = useState<number>(0)
    const [margin, setMargin] = useState<number>(0)
    const theme = useTheme()
    const { t } = useI18n()

    useEffect(() => {
        setMargin(defaultMargin)
    }, [defaultMargin])

    useEffect(() => {
        setPadding(defaultPadding)
    }, [defaultPadding])

    return (
        <Box pl={2} pr={2}>
            <PinWallSlider
                label={t(translations.pinwallSliderPadding)}
                name="padding"
                isNumber={true}
                minValue={0}
                maxValue={24}
                defaultValue={padding}
                color={theme.palette.secondary.main}
                step={1}
                onSliderChangeCallback={onPaddingCallback}
            />
            <PinWallSlider
                label={t(translations.pinwallSliderMargin)}
                name="margin"
                isNumber={true}
                minValue={0}
                maxValue={24}
                defaultValue={margin}
                color={theme.palette.secondary.main}
                step={1}
                onSliderChangeCallback={onMarginCallback}
            />
        </Box>
    )
}

export default QlikPinWallStylesForm
