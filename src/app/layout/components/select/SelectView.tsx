import React, { FC, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { CircularProgress, Theme } from '@mui/material'

import useSearchParamsQuery from 'app/shared/hooks/useSearchParamsQuery'

interface SelectSubViewProp {
    pages: Page[]
    handleOnPageChangeCallback: (view: string) => void
}

export interface Page {
    label: string
    route: string
    url?: string
}

const SelectView: FC<SelectSubViewProp> = ({ pages, handleOnPageChangeCallback }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [views, setViews] = useState<Page[]>([])
    const [view, setView] = useState<string>(pages[0]?.label || '')
    const { classes } = useStyles()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const {
        searchParams: { view: viewUrl }
    } = useSearchParamsQuery()

    useEffect(() => {
        setIsLoading(true)
        const uniquePages = [...new Set(pages)]
        setViews(uniquePages)
        if (uniquePages.length) {
            const currentPage = uniquePages.find(page => page.route === pathname)
            const initialPage = currentPage ? currentPage.label : uniquePages[0].label
            setView(initialPage)
        }
        setIsLoading(false)
    }, [navigate, pages, pathname])

    useEffect(() => {
        setIsLoading(true)
        if (viewUrl !== null) {
            setView(pages?.find(p => p?.url === viewUrl)?.label)
        } else {
            setView(pages[0]?.label || '')
        }
        setIsLoading(false)
    }, [pages, viewUrl])

    const handleChange = event => {
        if (event.target.value) {
            handleOnPageChangeCallback(event.target.value)
            setView(event.target.value)
        }
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="view-select-outlined-label" className={classes.inputLabel}>
                View
            </InputLabel>
            <Select
                variant="standard"
                labelId="view-select-outlined-label"
                id="view-select-outlined"
                value={view}
                key={view}
                onChange={handleChange}
                label="view"
                disableUnderline
                className={classes.select}>
                <MenuItem value="" className={classes.menuItem}>
                    {isLoading ? (
                        <CircularProgress size={20} color="secondary" />
                    ) : (
                        <em>Select View</em>
                    )}
                </MenuItem>

                {views?.map((item, i) => {
                    return (
                        <MenuItem value={item.label} className={classes.menuItem} key={item.label}>
                            <Link className={classes.link} to={item.route}>
                                {item.label}
                            </Link>
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectView

const useStyles = makeStyles()((theme: Theme) => ({
    loaderControl: {
        minWidth: '100%'
    },
    link: {
        display: 'flex',
        flex: 1,
        textDecoration: 'none',
        color: theme?.palette.common.primaryText
    },
    formControl: {
        width: '100%',
        height: '45px',
        backgroundColor: theme?.palette.common.highlight5,
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        marginLeft: '10px',
        borderBottom: `1px solid ${theme?.palette.common.primaryText}`
    },
    select: {
        textAlign: 'left',
        height: '30px',
        fontSize: '15px',
        fontWeight: 600,
        paddingLeft: '10px'
    },
    menuItem: {
        height: '30px'
    },
    inputLabel: {
        height: '30px',
        marginTop: '-15px',
        marginLeft: '-5px',
        fontSize: '12px',
        color: theme?.palette.common.secondaryText,
        transform: 'translate(14px, 18px) scale(1)',
        border: '0px solid'
    }
}))
