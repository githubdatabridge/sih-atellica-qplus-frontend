import React, { useState, useEffect } from 'react'

import ReactHtmlParser from 'react-html-parser'
import { useLocation } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Popover from '@mui/material/Popover'
import { useTheme, Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import SvgWhatIsNewIcon from '../../res/icons/SvgWhatIsNewIcon'
import translation from './constants/translations'

const useStyles = makeStyles()((theme: any) => ({
    paper: {
        overflowX: 'unset',
        overflowY: 'unset',
        maxWidth: '400px',
        '&::before': {
            content: '""',
            position: 'absolute',
            marginRight: '-0.71em',
            top: 0,
            right: '50%',
            width: 10,
            height: 10,
            backgroundColor: theme.palette.primary.dark,
            boxShadow: theme.shadows[1],
            transform: 'translate(50%, -50%) rotate(314deg)',
            clipPath: 'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))'
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    typography: {
        padding: theme.spacing(2),
        color: theme.palette.text.hint
    },
    typographyTitle: {
        padding: theme.spacing(2),
        color: theme.palette.text.hint,
        fontWeight: 600
    },
    grid: {
        padding: theme.spacing(),
        background: theme.palette.primary.dark
    }
}))
export interface IWhatsNewPopoverProps {
    pageId?: string
    anchorEl: Element
    text: string
    onClose?: () => void
    onGotItCallback?: () => void
}
const WhatsNewPopover: React.FC<IWhatsNewPopoverProps> = ({
    pageId,
    anchorEl,
    text,
    onClose,
    onGotItCallback
}) => {
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const location = useLocation()
    const theme = useTheme()
    const { t } = useI18n()

    useEffect(() => {
        if (!pageId) setOpen(true)

        if (location.pathname.includes(pageId)) {
            setOpen(true)
        }
    }, [])

    const handleClose = event => {
        setOpen(false)
        if (onClose) onClose()
    }

    const handleOnGotItClick = (isGotIt: boolean) => {
        setOpen(isGotIt)
        if (onGotItCallback) {
            onGotItCallback()
        }
    }

    return (
        <Backdrop className={classes.backdrop} open={open}>
            <Popover
                id={'new-menu'}
                classes={{ paper: classes.paper }}
                open={open}
                anchorEl={anchorEl}
                onClose={e => handleClose(e)}
                disablePortal={true}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}>
                <Grid
                    container
                    justifyContent="flex-end"
                    direction="column"
                    className={classes.grid}>
                    <Grid item>
                        <Box display="flex" alignItems="center">
                            <Box>
                                <SvgWhatIsNewIcon color={theme.palette.secondary.main} />
                            </Box>
                            <Box>
                                <Typography className={classes.typographyTitle}>
                                    {t(translation.whatIsNewTitle)}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <Typography className={classes.typography}>
                            {ReactHtmlParser(text)}
                        </Typography>
                    </Grid>
                    <Grid item container justifyContent="flex-end">
                        <Button variant="contained" onClick={() => handleOnGotItClick(false)}>
                            {t(translation.whatIsNewGotIt)}
                        </Button>
                    </Grid>
                </Grid>
            </Popover>
        </Backdrop>
    )
}
export default WhatsNewPopover
