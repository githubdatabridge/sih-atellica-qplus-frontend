import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Theme } from '@mui/material'
import { useQplusBootstrapContext } from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import { View } from '../shared/models/View'
import useSearchParamsQuery from '../shared/hooks/useSearchParamsQuery'
import SubHeaderWrapper from './SubHeaderWrapper'
import { Page } from './components/select/SelectView'

interface ISubHeaderProps {
    pageViews: View[]
    page: string
}

const SubHeader: React.FC<ISubHeaderProps> = ({ pageViews, page }) => {
    const [isHeader, setIsHeader] = useState<boolean>(true)
    const [views, setViews] = useState<View[]>([])
    const [parentPages, setParentPages] = useState<Page[]>([])
    const [subPages, setSubPages] = useState<string[]>([])
    const [currentSubPage, setCurrentSubPage] = useState<string>('')

    const { setIsHeaderVisible } = useAppContext()
    const { q } = useQplusBootstrapContext()
    const {
        searchParams: { view },
        setSearchParams
    } = useSearchParamsQuery()

    const theme = useTheme<Theme>()
    const findFirstTab = (pageViews, viewName) =>
        pageViews?.find(v => v?.view === viewName)?.subViews?.[0]?.tabs?.[0]?.url
    const findUrl = (pageViews, viewName) => pageViews?.find(v => v?.view === viewName)?.url
    const findView = (pageViews, url) => pageViews?.find(v => v?.url === url)?.view

    const getSubViews = useCallback((pageViews: View[], viewName: string) => {
        const tSubPages = pageViews
            .filter(v => v?.view === viewName)
            .flatMap(v => v.subViews.map(sv => sv.title))
        setSubPages(tSubPages)
        setCurrentSubPage(tSubPages[0])
    }, [])

    useEffect(() => {
        q?.resize()
    }, [isHeader, q])

    useEffect(() => {
        const parentPages = pageViews?.map(v => ({
            label: v.view,
            route: v.route,
            url: findUrl(pageViews, v.view)
        }))
        setParentPages(parentPages)
        setViews(pageViews)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, pageViews])

    useEffect(() => {
        if (views.length > 0) {
            if (views[0]?.url) {
                setSearchParams(view || views[0].url || '')
                getSubViews(views, findView(views, view) || views[0].view)
            } else {
                setSearchParams('', '')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, views])

    const setUrlHelper = (pageViews, viewName) => {
        const url = findUrl(pageViews, viewName)
        const firstTab = findFirstTab(pageViews, viewName)
        if (url) {
            setSearchParams(url, firstTab)
        }
    }

    const handlePageChangeCallback = (page: string) => {
        setUrlHelper(views, page)
        getSubViews(views, page)
    }

    const handleSubPageChangeCallback = (subPage: string) => {
        setCurrentSubPage(subPage)
    }

    const handleHeaderToggle = (toggle: boolean) => {
        setIsHeaderVisible(toggle)
        setIsHeader(toggle)
    }

    return (
        <SubHeaderWrapper
            parentPages={parentPages}
            subPages={subPages}
            currentSubPage={currentSubPage}
            shouldHideSubSettings={true}
            handlePageChangeCallback={handlePageChangeCallback}
            handleSubPageChangeCallback={handleSubPageChangeCallback}
            handleHeaderToggleCallback={handleHeaderToggle}
            isHeaderVisible={isHeader}
        />
    )
}

export default SubHeader
