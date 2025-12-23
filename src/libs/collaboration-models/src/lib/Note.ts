import { format } from 'date-fns'
import { truncate } from 'lodash-es'

import { Visualization } from '@libs/common-models'

import { NoteChecklist } from './NoteChecklist'
import { QlikState } from './QlikState'
import { TagLabel } from './TagLabel'

export enum NoteFilter {
    ALL = 0,
    OVERDUE = 1,
    DUE_TODAY = 2
}

export interface LabelWithNotes {
    label: TagLabel
    notes: Note[]
}

export class Note {
    id: number
    visualizationId: number | null
    qlikStateId: number | null
    /*  qsUserId: string */
    appUserId: string
    title: string
    description: string
    archive: boolean
    createdAt: Date
    updatedAt: Date
    qlikState: QlikState | null
    reminderAt: Date
    visualization: Visualization | null
    checklists: NoteChecklist[]
    labels: any[]
    color: string
    isSnoozed: boolean
    isPinned: boolean

    constructor(note: any = {}) {
        this.id = note.id
        this.visualizationId = note.visualizationId
        this.qlikStateId = note.qlikStateId
        /*   this.qsUserId = note.qsUserId */
        this.appUserId = note.appUserId
        this.title = note.title
        this.description = note.description
        this.archive = Boolean(note.archive)
        this.qlikState = note.qlikState
        this.createdAt = new Date(note.createdAt)
        this.updatedAt = new Date(note.updatedAt)
        this.reminderAt = note.reminderAt
        this.visualization = note.visualization ? new Visualization(note.visualization) : null
        this.checklists = note.checklists
            ? note.checklists.map((nc: any) => new NoteChecklist(nc))
            : []
        this.labels = note.labels
        this.color = note.color
        this.isSnoozed = Boolean(note.isSnoozed)
        this.isPinned = Boolean(note.isPinned)
    }

    get hasTitle(): boolean {
        return Boolean(this.title)
    }

    get hasDescription(): boolean {
        return Boolean(this.description)
    }

    get hasChecklist(): boolean {
        return this.checklists.length > 0
    }

    get noteLink(): string | null {
        if (!this.visualizationId) return null

        const pageId = this.visualization?.pageId.replace(/_/g, '/')

        return `${pageId}?type=notes&visualizationId=${this.visualization?.id}&visComponentId=${this.visualization?.componentId}&activeNoteId=${this.id}`
    }

    get createdDate(): string {
        return format(this.createdAt, 'dd/MM/yyyy, HH:mm')
    }
    get reminderDateAndTime(): string | null {
        if (!this.reminderAt) return null
        return format(this.reminderAt, 'dd/MM/yyyy, HH:mm')
    }

    get shortTitle(): string {
        return truncate(this.title, { length: 24 })
    }

    get shortDescription(): string {
        return truncate(this.description, { length: 80 })
    }
}

export class NoteModel {
    /*  qsUserId: string */
    appUserId: string
    title: string
    description: string
    archive = false
    reminderAt: Date | null
    color: string
    checklists: any[]
    labels: any[]
    isSnoozed: boolean

    constructor(note: any = {}) {
        //this.qsUserId = note.qsUserId
        this.appUserId = note.appUserId
        this.title = note.title || ''
        this.description = note.description || ''
        this.reminderAt = note.reminderAt || null
        this.color = note.color || 'white'
        this.checklists = note.checklists || []
        this.labels = note.labels || []
        this.isSnoozed = note.isSnoozed || false
    }
}
