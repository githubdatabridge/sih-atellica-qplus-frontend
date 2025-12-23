import React, { FC, useEffect, useState, useMemo } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import { ButtonBase, Box, Typography, hexToRgb, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useRgbAsNumber } from '@libs/common-hooks'

type TTabsButtonClasses = {
    root: any
    nav: any
    content: any
}

type TTabButtonClasses = {
    root: any
    selected: any
}

interface ITabButton {
    title: string
    search: string
    component: React.ReactNode
    classNames?: Partial<TTabButtonClasses>
}

interface ITabsButton {
    tabs: ITabButton[]
    classNames?: Partial<TTabsButtonClasses>
    onTabButtonClickCallback?: (title?: string) => void
}

const TabsButton: FC<ITabsButton> = React.memo(({ tabs, classNames, onTabButtonClickCallback }) => {
    const [currentSearch, setCurrentSearch] = useState<string>('')
    const location = useLocation()
    const navigate = useNavigate()
    const { getRGB } = useRgbAsNumber()

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
                fontSize: '16px',
                minWidth: '175px',
                color: theme.palette.text.primary,
                background: theme.palette.background.default,
                padding: '15px 30px',
                borderRadius: '8px 8px 0 0',
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                opacity: 0.5,
                height: '56px',
                transition: 'opacity .23s ease, background .23s ease',
                '&:hover': {
                    opacity: 1
                },
                '& > span': {
                    width: '100%'
                },
                '@media (max-width: 887px)': {
                    fontSize: '15px',
                    padding: '12px 20px'
                },
                '@media (max-width: 739px)': {
                    fontSize: '14px',
                    padding: '11px 15px'
                },
                '@media (max-width: 652px)': {
                    fontSize: '13px',
                    padding: '10px'
                }
            },
            selected: {
                fontWeight: 500,
                fontSize: '16px',
                minWidth: '175px',
                color: theme.palette.text.primary,
                padding: '15px 30px',
                borderRadius: '8px 8px 0 0',
                height: '56px',
                transition: 'opacity .23s ease, background .23s ease',
                opacity: 1,
                background: theme.palette.background.paper,
                boxShadow: `inset 0 3px 0 ${theme.palette.secondary.main}`,
                '& > span': {
                    width: '100%'
                },
                '@media (max-width: 887px)': {
                    fontSize: '15px',
                    padding: '12px 20px'
                },
                '@media (max-width: 739px)': {
                    fontSize: '14px',
                    padding: '11px 15px'
                },
                '@media (max-width: 652px)': {
                    fontSize: '13px',
                    padding: '10px'
                }
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

    const { classes } = useStyles()

    const currentTab = tabs?.find(tab => tab.search === currentSearch)

    const renderComponent = useMemo(() => {
        return (
            <Box key={currentTab?.title} className={`${classes.content} ${classNames?.content}`}>
                {currentTab?.component}
            </Box>
        )
    }, [classNames?.content, classes.content, currentTab?.component, currentTab?.title])

    return (
        <Box className={`${classes.tabs} ${classNames?.root}`}>
            <Box className={`${classes.nav} ${classNames?.nav}`}>
                {tabs.map(tab => (
                    <ButtonBase
                        key={tab.title}
                        className={
                            (currentSearch === tab.search &&
                                `${classes.selected} ${tab?.classNames?.selected}`) ||
                            `${classes.root} ${tab?.classNames?.root}`
                        }
                        onClick={() => {
                            navigate(`${location.pathname}?${tab.search}`)
                            if (onTabButtonClickCallback) {
                                onTabButtonClickCallback(tab.title)
                            }
                        }}>
                        <Typography>{tab.title}</Typography>
                    </ButtonBase>
                ))}
            </Box>
            {renderComponent}
        </Box>
    )
})

export default TabsButton
