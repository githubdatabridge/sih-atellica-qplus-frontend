import React, { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Toolbar, useTheme } from '@mui/material'
import { QplusSelectionBarSelected } from '@databridge/qplus'

interface Props {
    onSelectionChange?: (count: number) => void
    isVertical?: boolean
    width?: number
}

function SelectionBar({ onSelectionChange, isVertical = false, width }: Props): ReactElement {
    const { classes } = useStyles()
    const theme = useTheme()

    return (
        <>
            {<Toolbar />}
            <Box className={classes.selectionBar} display="flex" flexGrow={1}>
                <QplusSelectionBarSelected
                    isVertical={isVertical}
                    showAppWatermark={false}
                    color="secondary"
                    cssTabs={{
                        marginTop: isVertical ? '-50px' : '0px',
                        width: `${width}px`
                    }}
                    cssChipSelected={{
                        color: theme.palette.text.primary,
                        fontSize: '14px',
                        fontWeight: 500,
                        letterSpacing: 0,
                        height: '40px',
                        borderWidth: '0px',
                        marginRight: '10px',
                        borderRadius: '25px',
                        backgroundColor: theme.palette.common.highlight10
                    }}
                />
            </Box>
        </>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    selectionBar: {
        boxShadow: 'none',
        backgroundColor: 'transparent',
        zIndex: 99999,
        width: '100%',
        marginTop: '-55px'
    }
}))

export default SelectionBar
