import React, { FC, useState } from 'react'

import Slider from '@mui/material/Slider'

import { withStyles } from 'tss-react/mui'

const QlikSlider = withStyles(Slider, theme => ({
    root: {
        color: theme.palette.secondary.main,
        height: 4,
        width: '400px'
    },
    thumb: {
        height: 18,
        width: 18,
        backgroundColor: '#fff',
        border: '1px solid currentColor',
        marginTop: -8,
        marginLeft: -8,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit'
        }
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)'
    },
    track: {
        height: 4,
        borderRadius: 2
    },
    rail: {
        height: 4,
        borderRadius: 2
    }
}))

const QlikSelectionSlider: FC = () => {
    const [, setValue] = useState<any>(null)
    return (
        <QlikSlider
            track={false}
            orientation="vertical"
            step={1}
            min={0}
            max={12}
            valueLabelDisplay="on"
            aria-label="qlik slider"
            defaultValue={1}
            onChange={(event, v) => {
                setValue(v)
            }}
        />
    )
}

export default QlikSelectionSlider
