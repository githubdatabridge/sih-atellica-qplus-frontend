import { Report } from '@libs/common-models'
import { PinWall, PinWallFilters, PinWallFiltersRaw } from '@libs/core-models'

export const setCommonFilters = (pinWall: PinWall, pinwallReports: Report[]) => {
    const reportFilters: any[] = []
    pinWall?.content?.cells?.forEach((cell: any) => {
        if (cell.reportId) {
            const report: any = pinwallReports.find(r => r.id === cell.reportId)
            if (report?.dataset.filters?.length > 0) reportFilters.push(report.dataset.filters)
        }
    })
    const arr = reportFilters.shift()
    if (!arr) return []
    const result = arr.reduce((common: any, item: any) => {
        if (reportFilters.every(inner => inner.some((_item: any) => _item.qId === item.qId))) {
            common.push(item)
        }
        return common
    }, [])

    return result
}

export const getPinWallFilterMappings = (pinWallFilters: PinWallFiltersRaw) => {
    return Object.entries(pinWallFilters).map(([qlikAppId, filters]) => {
        return { qlikAppId, filters }
    }) as PinWallFilters[]
}
