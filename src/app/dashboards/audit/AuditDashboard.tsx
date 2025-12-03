import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { Theme } from '@mui/material'
import {
    useQplusApp,
    useQplusClearAll,
    useQplusPreferencesContext,
    useQplusSelectionContext,
    useWindowDimensions
} from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import { View } from 'app/shared/models/View'
import useSearchParamsQuery from 'app/shared/hooks/useSearchParamsQuery'
import { getAuditDefinition } from 'app/shared/definitions/audit'
import DashboardTemplate from '../shared/components/DashboardTemplate'
import RenderGridLayout from '../shared/components/RenderGridLayout'
import PageTabs from '../shared/components/RenderTabs'
import {
    filterApplicationUser,
    filterChangedItem,
    filterLoggedAction,
    filterLoggedDate
} from './options/filters'

const AuditDashboard = () => {
    const PAGE_NAME = 'audit'

    const [windowHeight, setWindowHeight] = useState<number>(0)
    const [views, setViews] = useState<View[]>([])
    const [currentSubPage, setCurrentSubPage] = useState<string>('')

    const { height } = useWindowDimensions()
    const { setDefaultFilters, pages } = useAppContext()
    const { qAppId } = useQplusApp(pages.get(PAGE_NAME))
    const { setClearAll } = useQplusClearAll()
    const { userPreferences } = useQplusPreferencesContext()
    const { setDockedFields } = useQplusSelectionContext()
    const {
        searchParams: { view }
    } = useSearchParamsQuery()

    const theme = useTheme<Theme>()

    const findView = (jsonViews, url) => jsonViews?.find(v => v?.url === url)?.view

    const getSubViews = useCallback((jsonViews: View[], viewName: string) => {
        const tSubPages = jsonViews
            .filter(v => v?.view === viewName)
            .flatMap(v => v.subViews.map(sv => sv.title))
        setCurrentSubPage(tSubPages[0])
    }, [])

    const setDockedUnionArray = useCallback(
        (savedFilters, defaultFilters) => {
            const set1 = new Set(
                defaultFilters.map(({ qFieldName, qAppId }) =>
                    JSON.stringify({ qFieldName, qAppId })
                )
            )
            const uniqueArray = [...defaultFilters]

            savedFilters?.forEach(obj => {
                const key = JSON.stringify({
                    qFieldName: obj.qFieldName,
                    qAppId: obj.qAppId
                })
                if (!set1.has(key)) {
                    set1.add(key)
                    uniqueArray.push(obj)
                }
            })

            setDockedFields(uniqueArray)
        },
        [setDockedFields]
    )

    useEffect(() => {
        const jsonViews: View[] = getAuditDefinition(windowHeight - 200)
        setViews(jsonViews)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const defaultFilters = []
        defaultFilters.push({
            rank: -4,
            ...filterLoggedDate,
            isDocked: false,
            qAppId: pages.get(PAGE_NAME),
            isFixed: true,
            dateOptions: {
                height: '40px',
                width: '210px',
                dateFormat: 'dd/MM/yyyy',
                qlikDateFormat: 'dd/MM/yyyy',
                css: {
                    backgroundColor: theme.palette.common.highlight5,
                    height: '40px',
                    borderRadius: '4px',
                    marginRight: '10px'
                },
                cssDefinedRange: {
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.info.main
                },
                cssIconBox: {
                    width: '30px',
                    paddingRight: '10px',
                    paddingTop: '1px'
                },
                cssButtonText: {
                    textAlign: 'left',
                    paddingLeft: '10px',
                    opacity: 1
                },
                cssIconCalendar: {
                    color: theme.palette.common.secondaryText,
                    cursor: 'pointer'
                }
            }
        })
        defaultFilters.push({
            ...filterLoggedAction,
            qAppId: pages.get(PAGE_NAME),
            isDocked: false,
            isFixed: true,
            rank: -3
        })
        defaultFilters.push({
            ...filterApplicationUser,
            qAppId: pages.get(PAGE_NAME),
            isDocked: false,
            isFixed: true,
            rank: -2
        })
        defaultFilters.push({
            ...filterChangedItem,
            qAppId: pages.get(PAGE_NAME),
            isDocked: false,
            isFixed: true,
            rank: -1
        })

        const savedFilters = userPreferences?.additionalPreferences?.filters[PAGE_NAME]
        setDockedUnionArray(savedFilters, defaultFilters)
        setDefaultFilters(defaultFilters)
        return () => {
            setClearAll(qAppId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setWindowHeight(height)
    }, [height])

    useEffect(() => {
        if (views.length > 0) {
            getSubViews(views, findView(views, view) || views[0].view)
        }
    }, [views, view, getSubViews])

    const renderViews = () => {
        const currentPage = findView(views, view) || views[0].view
        return getAuditDefinition(windowHeight - 200)
            .filter(v => v.view === currentPage)
            .map((v: View, index: number) => {
                const subView = v.subViews.find(sv => sv.title === currentSubPage)
                return subView?.tabs ? (
                    <PageTabs
                        key={`page_tabs_${PAGE_NAME}_${view}_${index}`}
                        tabs={subView.tabs}
                        page={PAGE_NAME}
                    />
                ) : (
                    <RenderGridLayout
                        key={`grid_layout_${PAGE_NAME}_${index}`}
                        content={subView?.layout}
                        qlikAppId={qAppId}
                    />
                )
            })
    }

    if (windowHeight === 0 || !currentSubPage) return null

    return <DashboardTemplate>{renderViews()}</DashboardTemplate>
}

export default AuditDashboard
