import React, { ReactNode, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import Container from '@mui/material/Container'
import { Theme, useTheme } from '@mui/material'
import { useWindowDimensions } from '@databridge/qplus'

import Header from './Header'
import SubHeader from './SubHeader'
import { View } from 'app/shared/models/View'
import { getComplianceDefinition } from 'app/shared/definitions/compliance'
import { getAuditDefinition } from 'app/shared/definitions/audit'
import { getReportingViews } from 'app/shared/definitions/reporting'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        maxWidth: '100% !important',
        padding: '0px !important',
        height: '100%',
        overflowY: 'hidden'
    },
    main: {
        flexGrow: 1,
        position: 'relative',
        backgroundColor: theme.palette.common.base1,
        padding: '0px',
        overflowY: 'hidden'
    }
}))

type LayoutProps = { children: ReactNode }

const Layout = ({ children }: LayoutProps) => {
    const [currentPage, setCurrentPage] = useState<string>('')
    const [currentViews, setCurrentViews] = useState<View[]>([])
    const [iHeight, setIHeight] = useState<number>(0)
    const { height } = useWindowDimensions()
    const { classes } = useStyles()
    const { pathname } = useLocation()
    const theme = useTheme()

    useEffect(() => {
        setIHeight(height)
    }, [height])

    useEffect(() => {
        let page = ''
        if (pathname) {
            if (pathname.includes('compliance')) {
                page = 'compliance'
            } else if (pathname.includes('audit')) {
                page = 'audit'
            } else if (pathname.includes('reporting')) {
                page = 'reporting'
            } else if (pathname.includes('pinwall')) {
                page = 'pinwall'
            } else {
                page = 'administration'
            }
            setCurrentPage(page)
        }
    }, [pathname])

    useEffect(() => {
        let views: View[] = []
        if (currentPage && iHeight > 0) {
            if (currentPage === 'compliance') {
                views = getComplianceDefinition(iHeight, theme)
            }
            if (currentPage === 'audit') {
                views = getAuditDefinition(iHeight)
            }
            if (currentPage === 'reporting') {
                views = getReportingViews()
            }
        }
        setCurrentViews(views)
    }, [currentPage, theme, iHeight])

    if (iHeight === 0 || !currentPage) return null

    return (
        <Container className={classes.root}>
            <Header />
            {currentPage !== 'administration' && (
                <SubHeader page={currentPage} pageViews={currentViews} />
            )}
            <main className={classes.main} style={{ height: `${iHeight}px` }}>
                {children}
            </main>
        </Container>
    )
}

export default React.memo(Layout)
