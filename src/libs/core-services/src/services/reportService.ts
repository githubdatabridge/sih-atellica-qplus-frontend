import { Action, Report } from '@libs/common-models'
import {
    ReportExport,
    ReportPatchPayload,
    ReportPayload,
    SharedReportUsers,
    ShareReportPayload
} from '@libs/core-models'

import { actionService } from './actionService'
import { CoreService } from './core'

interface PaginationData {
    hasMore: boolean
    page: number
    total: number
}

interface ITableDefaultFilter {
    accessor: string
    value: string | number
    operator: string
}

class ReportService {
    async getTotal(query?: string) {
        const response = await CoreService.getApi().get(
            query ? `/reports${query}&perPage=1` : `/reports?perPage=1`
        )
        return response.pagination.total
    }

    async getAllReports(perPage = 100, query?: string, withSorting = true, shouldIterate = true) {
        const response = await CoreService.getApi().get(
            query ? `/reports${query}&perPage=${perPage}` : `/reports?perPage=${perPage}`
        )
        let reports = response.data

        // If there are more pages, fetch them
        if (response.pagination.lastPage > 1 && shouldIterate) {
            const promises = []
            for (let i = 2; i <= response.pagination.lastPage; i++) {
                promises.push(
                    CoreService.getApi().get(
                        query
                            ? `/reports${query}&page=${i}&perPage=${perPage}`
                            : `/reports?page=${i}&perPage=${perPage}`
                    )
                )
            }
            const additionalData = await Promise.all(promises)
            reports = reports.concat(...additionalData.map(d => d.data))
        }

        const allReports = reports.map(item => new Report(item))

        const sortedReports = withSorting ? this.sortArray(allReports) : allReports

        return { data: sortedReports, total: response.pagination.total }
    }

    async getParamReports(
        perPage = 10,
        page?: number,
        searchColumns?: string,
        searchOperator?: string,
        searchQuery?: string,
        orderByColumn = 'createdAt',
        orderByOperator?: string,
        filter?: string,
        defaultFilter?: ITableDefaultFilter[]
    ) {
        let url = `/reports?perPage=${perPage}&page=${page}`

        if (searchQuery?.length > 0) {
            url += `&search${searchColumns}[${searchOperator}]=${searchQuery}`
        }

        if (orderByColumn?.length > 0) {
            url += `&orderBy[${orderByColumn}][${orderByOperator}]`
        }

        if (filter?.length > 0) {
            url += filter
        }

        if (defaultFilter) {
            defaultFilter.forEach(({ accessor, value, operator }) => {
                const filterKey = `filter[${accessor}][${operator}]`
                url += `&${filterKey}=${value.toString()}`
            })
        }

        const response = await CoreService.getApi().get(url)

        return {
            data: response?.data?.map(item => new Report(item)),
            pagination: response?.pagination,
            operators: response?.operators
        }
    }

    async getReports(query?: string) {
        const response = await CoreService.getApi().get(query ? `/reports${query}` : '/reports')
        const reports = response.data.map(item => new Report(item))
        return this.sortArray(reports)
    }

    async getReport(reportId: number) {
        const response = await CoreService.getApi().get(`/reports/${reportId}`)
        return new Report(response)
    }

    async cloneReport(reportId: number) {
        const response = await CoreService.getApi().post(`/reports/${reportId}`, null)
        return new Report(response.data)
    }

    async createReport(payload: ReportPayload) {
        const response = await CoreService.getApi().post('/reports', payload)
        return new Report(response.data)
    }

    async deleteReport(reportId: number) {
        const response = await CoreService.getApi().delete(`/reports/${reportId}`)
        return { response }
    }

    async updateReport(reportId: number, payload: ReportPayload) {
        const response = await CoreService.getApi().put(`/reports/${reportId}`, payload)
        return new Report(response.data)
    }

    async patchReport(reportId: number, payload: ReportPatchPayload) {
        const response = await CoreService.getApi().patch(`/reports/${reportId}`, payload)
        return new Report(response.data)
    }

    async exportReport(report: ReportExport) {
        return btoa(JSON.stringify(report)) // returns encoded string
    }

    async importReport(link: string) {
        return JSON.parse(atob(link)) // returns ReportExport
    }

    async getSharedWithMeReports(userAppId?: string, perPage = 100, shouldIterate = true) {
        if (!userAppId) {
            return { data: [], total: 0 }
        }
        const response = await CoreService.getApi().get(`/reports/shared?perPage=${perPage}`)
        const reports: Report[] = []
        const pages = response.pagination.lastPage
        const promises: Promise<any>[] = []
        let uniqReports: Report[]

        if (pages > 1 && shouldIterate) {
            for (let i = 1; i < pages; i++) {
                promises.push(CoreService.getApi().get(`/reports/shared?perPage=${perPage}`))
            }
            const data = await Promise.all(promises)
            const newReports = []
            for (const report of data) {
                const pageReports = report.data.map(item => new Report(item))
                newReports.push(...reports.concat(pageReports))
            }
            const seen = new Set()
            uniqReports = newReports.filter(el => {
                const duplicate = seen.has(el.id)
                seen.add(el.id)
                return !duplicate
            })
        } else {
            uniqReports = response.data.map(item => new Report(item))
        }
        const sortedReports = this.sortArray(uniqReports) || []
        return { data: sortedReports, total: response.pagination.total }
    }

    async getReportUsers(reportId: number, includeMe = false) {
        const response: SharedReportUsers[] = await CoreService.getApi().get(
            `/reports/${reportId}/users?includeMe=${includeMe}`
        )
        return response
    }

    async shareReport(reportId: number, payload: ShareReportPayload) {
        const response: SharedReportUsers[] = await CoreService.getApi().post(
            `/reports/${reportId}/share`,
            payload
        )
        return response
    }

    async unshareReport(reportId: number, payload: ShareReportPayload) {
        const config = {
            data: {
                ...payload
            }
        }
        await CoreService.getApi().delete(`/reports/${reportId}/share`, config)
        return
    }

    async getMentionedReports(
        page = 1
    ): Promise<{ actions: Action[]; pagination: PaginationData }> {
        const response = await CoreService.getApi().get(
            `/actions/reports?filter[viewedAt][eq]=null&page=${page}`
        )

        const actions = response.data.map((a: any) => new Action(a))

        const pagination = {
            total: response.pagination.total,
            page: response.pagination.currentPage,
            hasMore: response.pagination.lastPage > response.pagination.currentPage
        }

        return {
            actions,
            pagination
        }
    }

    async markReportMentionsAsRead(mentions: Action[]): Promise<number[]> {
        const updatedMentionsRequests = mentions.map((a: Action) => {
            const actionPayload = {
                actionId: a.id,
                payload: { viewedAt: new Date() }
            }

            return actionService.editAction(actionPayload)
        })

        const updatedMentions = await Promise.all(updatedMentionsRequests)

        return updatedMentions.map((a: any) => a.id)
    }

    sortArray(reports: Report[]) {
        return (
            reports?.sort(function (a, b) {
                if (a.updatedAt > b.updatedAt) {
                    return -1
                }
                if (a.updatedAt < b.updatedAt) {
                    return 1
                }
                return 0
            }) || []
        )
    }
}

export const reportService = new ReportService()
