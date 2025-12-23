import { format, formatDistance } from 'date-fns'

import { Dataset } from './Dataset'
import { QlikState } from './QlikState'
import { SocialUser } from './SocialUser'

export class Report {
    id: number
    templateId?: number
    content: any // json
    title: string
    description?: string
    appUserId?: string | null
    visualizationType: string
    pageId: string
    isSystem: boolean
    isCustomerReport?: boolean
    shared: boolean
    sharedWithOthers?: boolean
    isPinwallable: boolean
    dataset?: Dataset
    datasetId?: number
    qlikState?: QlikState
    user?: SocialUser
    createdAt: Date
    updatedAt: Date
    actionDate?: Date

    constructor(report: any, actionDate?: Date) {
        this.id = report.id
        this.templateId = report.templateId
        this.content = report.content
        this.title = report.title
        this.description = report.description
        this.qlikState = report.qlikState
        this.appUserId = report.appUserId
        this.visualizationType = report.visualizationType
        this.isPinwallable = report.isPinwallable
        this.isSystem = report.isSystem
        this.isCustomerReport = report?.isCustomerReport ? report.isCustomerReport : false
        this.shared = report.shared
        this.sharedWithOthers = report?.sharedWithOthers ? report.sharedWithOthers : false
        this.dataset = report.dataset
        this.datasetId = report.dataset?.id
        this.createdAt = new Date(report.createdAt)
        this.updatedAt = new Date(report.updatedAt)
        this.user = report.isSystem
            ? (this.getSystemUser(report?.user, this.isCustomerReport) as SocialUser)
            : new SocialUser(report?.user)
        this.pageId = report.pageId
        this.actionDate = actionDate ? new Date(actionDate) : null
    }

    private getSystemUser(user, isCustomerReport = false) {
        // Initialize default parts or split the name based on the dot
        const parts = user?.name ? user.name.split('.') : ['anonymous', 'user']

        // Determine the first name and handle based on presence of last name
        let firstName
        if (parts.length > 1) {
            // Capitalize the first letter of the first name if the last name exists
            firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        } else {
            // Use only the first two letters of the first name if no last name exists
            firstName =
                parts[0].length > 1 ? parts[0].substr(0, 2).toUpperCase() : parts[0].toUpperCase()
        }

        // Capitalize the first letter of the last name if it exists, otherwise set it as an empty string
        const lastName =
            parts.length > 1 ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : ''

        // Concatenate the full name, adding a space only if there is a last name
        const fullName = lastName ? `${firstName} ${lastName}` : firstName

        return {
            id: user?.appUserId || '',
            firstName: firstName,
            lastName: lastName,
            name: fullName,
            fullName,
            email: 'no-reply@databridge.ch',
            role: isCustomerReport ? 'ContentAdmin' : 'SysAdmin',
            initials:
                fullName?.replace(/\./g, '').substring(0, 2).toUpperCase() ||
                firstName?.substring(0, 2).toUpperCase() ||
                'AU'
        }
    }

    get reportLink(): string {
        if (!this.id) return ''

        const pageId = this.pageId.replace(/_/g, '/')

        const params = new URLSearchParams({
            type: 'reports',
            reportId: `${this.id}`
        })

        return `/${pageId}?${params.toString()}`
    }

    get userInitials(): string {
        try {
            const first = this.user.firstName[0]
            const last = this.user.lastName[0]
            return first + last
        } catch {
            return 'n/a'
        }
    }

    get hasLink(): boolean {
        return !!this.id
    }

    get createdDate(): string {
        return format(this.createdAt, 'dd/MM/yyyy, HH:mm')
    }

    get relativeDate(): string {
        return this.actionDate
            ? formatDistance(this.actionDate, new Date(), { addSuffix: true })
            : 'N/A'
    }
}
