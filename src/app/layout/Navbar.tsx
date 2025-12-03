import React, { useEffect, useState } from 'react'
import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import List from '@mui/material/List'

import { useAppContext } from 'app/context/AppContext'
import NavbarButtonLink from './components/button/NavbarButtonLink'
import { dashboardUrl } from './constants/constants'

const Navbar = () => {
    const [items, setItems] = useState<any>([])
    const { pages } = useAppContext()

    useEffect(() => {
        const menuItems = []
        if (pages) {
            if (pages.get('compliance')) {
                menuItems.push({
                    path: `${dashboardUrl}/compliance`,
                    title: 'Compliance'
                })
            }
            if (pages.get('audit')) {
                menuItems.push({ path: `${dashboardUrl}/audit`, title: 'Audit' })
            }
            if (pages.get('reporting')) {
                menuItems.push({
                    path: `${dashboardUrl}/reporting`,
                    title: 'Reporting'
                })
            }
        }

        setItems(menuItems)
    }, [pages])

    const { classes } = useStyles()

    if (!items || items.length === 0) return null

    return (
        <List component="nav" className={classes.list}>
            {items.map((item, index) => (
                <div key={`navbar-item-${index}`} className={classes.listItem}>
                    <NavbarButtonLink {...item} />
                </div>
            ))}
        </List>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    list: {
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        marginLeft: '50px',
        marginTop: '-10px',
        '@media (max-width: 1029px)': {
            marginLeft: '20px'
        },
        '@media (max-width: 951px)': {
            flexDirection: 'column',
            marginLeft: '0px',
            textAlign: 'center'
        }
    },
    listItem: {
        paddingRight: '10px',
        paddingLeft: '10px',
        '@media (max-width: 951px)': {
            alignSelf: 'center',
            width: '100%',
            paddingRight: '0px',
            paddingLeft: '0px'
        }
    }
}))

export default Navbar
