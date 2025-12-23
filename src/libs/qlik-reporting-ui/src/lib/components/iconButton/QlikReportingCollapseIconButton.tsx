import React, { FC, useState } from 'react'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Box } from '@mui/material'
import { IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { IconTooltip } from '@libs/common-ui'

interface IQlikReportingCollapseIconButtonProps {
    handleCollapseCallback: (isCollapsed: boolean) => void
}

const QlikReportingCollapseIconButton: FC<IQlikReportingCollapseIconButtonProps> = ({
    handleCollapseCallback
}) => {
    const [collapse, setCollapse] = useState<boolean>(false)

    const handleCollapseClick = () => {
        setCollapse(!collapse)
        handleCollapseCallback(!collapse)
    }

    const { classes } = useStyles()

    return (
        <Box
            width="100%"
            className={classes.container}
            textAlign="center"
            style={{ marginLeft: !collapse ? '-75px' : '-5px' }}>
            <IconTooltip title={!collapse ? 'Hide' : 'Show'}>
                <IconButton
                    aria-label="collapse"
                    onClick={handleCollapseClick}
                    className={classes.iconButton}>
                    {collapse ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                </IconButton>
            </IconTooltip>
        </Box>
    )
}

export default QlikReportingCollapseIconButton

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        zIndex: 1
    },
    iconButton: {
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        }
    }
}))
