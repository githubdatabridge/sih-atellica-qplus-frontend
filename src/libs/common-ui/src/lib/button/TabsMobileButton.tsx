import React, { FC, useState, useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Popover, Tab, Typography, Theme } from '@mui/material'
import { hexToRgb } from '@mui/material/styles'

import { makeStyles } from 'tss-react/mui'

import { useRgbAsNumber } from '@libs/common-hooks'

type TTabsMobileButtonClasses = {
    root?: any
    nav?: any
    content?: any
    popover?: any
    indicatorTab?: any
    indicatorIcon?: any
}

type TTabsMobileAnchorOrigin = {
    vertical: string
    horizontal: string
}

type TTabsMobileTransformOrigin = {
    vertical: string
    horizontal: string
}

type TTabMobileButtonClasses = {
    root?: any
    selected?: any
}

interface ITabMobileButton {
    title: string
    search: string
    component: React.ReactNode
    classNames?: Partial<TTabMobileButtonClasses>
}

interface ITabsMobileButton {
    tabs: ITabMobileButton[]
    anchorOrigin?: TTabsMobileAnchorOrigin
    transformOrigin?: TTabsMobileTransformOrigin
    classNames?: Partial<TTabsMobileButtonClasses>
}

const MobileTabs: FC<ITabsMobileButton> = React.memo(
    ({ tabs, anchorOrigin, transformOrigin, classNames }: any) => {
        const [currentSearch, setCurrentSearch] = useState<string>('')
        const { getRGB } = useRgbAsNumber()
        const location = useLocation()
        const navigate = useNavigate()
        const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | HTMLDivElement | null>(
            null
        )
        const open = Boolean(anchorEl)
        const id = open ? 'simple-popover' : undefined

        const useStyles = makeStyles()((theme: Theme) => {
            const rgb = getRGB(hexToRgb(theme.palette.text.primary))

            return {
                content: {
                    background: theme.palette.background.paper,
                    borderRadius: '0 0 8px 8px'
                },
                tabs: {
                    background: theme.palette.background.paper,
                    boxShadow: `0 2px 16px rgb(${rgb} / 10%)`,
                    borderRadius: '8px'
                },
                nav: {
                    background: theme.palette.background.default,
                    display: 'flex',
                    justifyContent: 'flex-start'
                },
                root: {
                    fontWeight: 500,
                    fontSize: '14px',
                    color: theme.palette.text.primary,
                    background: theme.palette.background.default,
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    padding: '15px 30px',
                    borderRadius: '8px 8px 0 0',
                    opacity: 0.5,
                    height: '45px',
                    transition: 'opacity .23s ease, background .23s ease',
                    '&:hover': {
                        opacity: 1
                    }
                },
                selected: {
                    fontWeight: 500,
                    fontSize: '16px',
                    color: theme.palette.text.secondary,
                    padding: '15px 30px',
                    height: '45px',
                    transition: 'opacity .23s ease, background .23s ease',
                    opacity: 1,
                    background: theme.palette.background.paper
                },
                popover: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    minWidth: '265px',
                    marginLeft: '-30px'
                },
                indicatorTab: {
                    borderTop: `3px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.text.primary,
                    minWidth: '240px',
                    textTransform: 'none',
                    fontSize: '14px'
                },
                indicatorIcon: {
                    borderTop: `3px solid ${theme.palette.secondary.main}`,
                    color: theme.palette.text.primary,
                    opacity: 0.6,
                    height: '48px'
                }
            }
        })

        useEffect(() => {
            navigate(`${location.pathname}?${tabs[0].search}`)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        useEffect(() => {
            if (location?.search) {
                setCurrentSearch(location.search)
            }
        }, [location.search])

        const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
            setAnchorEl(event.currentTarget)
        }

        const handleClose = () => {
            setAnchorEl(null)
        }

        const { classes } = useStyles()

        const currentTab = tabs(tab => tab.search === currentSearch)

        return (
            <Box className={classes.tabs}>
                <Box className={classes.nav}>
                    <Tab
                        label={currentTab?.title || ''}
                        onClick={handleClick}
                        className={`${classes.indicatorTab} ${classNames?.indicatorTab}`}
                    />
                    <Box onClick={handleClick} style={{ cursor: 'pointer' }}>
                        <ExpandMoreIcon
                            fontSize="small"
                            color="primary"
                            className={`${classes.indicatorIcon} ${classNames?.indicatorIcon}`}
                        />
                    </Box>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        classes={{
                            paper: `${classes.popover} ${classNames?.popover}`
                        }}
                        anchorOrigin={{
                            vertical: anchorOrigin?.vertical ?? 'bottom',
                            horizontal: anchorOrigin?.horizontal ?? 'center'
                        }}
                        transformOrigin={{
                            vertical: transformOrigin?.vertical ?? 'top',
                            horizontal: transformOrigin?.horizonatal ?? 'center'
                        }}>
                        {tabs.map(tab => (
                            <ButtonBase
                                key={tab.title}
                                className={
                                    (currentSearch === tab.search &&
                                        `${classes.selected} ${tab?.classNames?.selected}`) ||
                                    `${classes.root} ${tab?.classNames?.root}`
                                }
                                onClick={() => navigate(`${location.pathname}?${tab.search}`)}>
                                <Typography> {tab.title}</Typography>
                            </ButtonBase>
                        ))}
                    </Popover>
                </Box>
                <Box className={`${classes.content} ${classNames?.content}`}>
                    {currentTab?.component}
                </Box>
            </Box>
        )
    }
)

export default MobileTabs
