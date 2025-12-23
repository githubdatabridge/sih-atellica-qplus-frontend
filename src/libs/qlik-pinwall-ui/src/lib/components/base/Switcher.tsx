import React, { FC, useState } from 'react'

import { useMount } from 'react-use'

import { Box, FormControlLabel, useTheme, Theme } from '@mui/material'

import { BaseSwitch } from '@libs/common-ui'

interface Props {
    defaultValue: boolean
    label: string
    name: string
}

const PinWallSwitch: FC<Props> = ({ defaultValue, label, name }) => {
    const [value, setValue] = useState<boolean>(defaultValue)

    useMount(async () => {})

    const handleIsChecked = event => {
        const value = event.target.checked
        setValue(value)
    }

    const theme = useTheme()

    return (
        <Box mb={2} mt={4}>
            <FormControlLabel
                control={
                    <BaseSwitch
                        checked={value}
                        onChange={handleIsChecked}
                        name={name}
                        color="secondary"
                    />
                }
                label={label}
                sx={{ color: theme.palette.text.primary }}
            />
        </Box>
    )
}

export default PinWallSwitch
