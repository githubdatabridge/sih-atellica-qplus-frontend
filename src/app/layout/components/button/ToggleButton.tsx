import React, { FC, useState } from 'react'
import { IconButton } from '@mui/material'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { QplusBaseIconTooltip } from '@databridge/qplus'

interface IToggleButtonProps {
    handleToggleHeaderCallback: (toggle: boolean) => void
}

const ToggleButton: FC<IToggleButtonProps> = ({ handleToggleHeaderCallback }) => {
    const [toggle, setToggle] = useState<boolean>(true)

    const handleShowHeaderClick = () => {
        setToggle(!toggle)
        handleToggleHeaderCallback(!toggle)
    }

    return (
        <QplusBaseIconTooltip title={toggle ? 'Hide' : 'Show'}>
            <IconButton aria-label="Header" onClick={handleShowHeaderClick} sx={{ zIndex: 2 }}>
                {toggle ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
        </QplusBaseIconTooltip>
    )
}

export default ToggleButton
