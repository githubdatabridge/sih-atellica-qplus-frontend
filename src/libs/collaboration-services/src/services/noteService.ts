import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'

import {
    Note,
    UserLabel,
    NoteChecklist,
    ChecklistModel,
    LabelWithNotes,
    TagLabel,
    NoteFilter,
    QlikStateModel
} from '@libs/collaboration-models'

import { SocialService } from './core'

interface CreateNotePayload {
    visualizationId: number | null
    qlikState?: QlikStateModel | null
    appUserId?: string
    title: string
    description: string
    archive: boolean
    reminderAt?: Date | null
    color: string
}

export class NoteService {
    basePath = '/notes'

    async createNote(payload: CreateNotePayload): Promise<Note> {
        const { data: note } = await SocialService.getApi().post('/notes', payload)

        return new Note(note)
    }

    async fetchNotes(params?: any, textParams = ''): Promise<Note[]> {
        const response = await SocialService.getApi().get(
            `/notes${textParams && `?${textParams}`}`,
            {
                params
            }
        )

        return response.data.map((note: any) => new Note(note))
    }

    async fetchNote(noteId: number): Promise<Note> {
        const note = await SocialService.getApi().get(`/notes/${noteId}`)

        return new Note(note)
    }

    async removeNote(noteId: number): Promise<AxiosResponse> {
        const data = await SocialService.getApi().delete(`/notes/${noteId}`)

        return data
    }

    async updateNote(noteId: string, payload: Partial<Note>): Promise<Note> {
        const { data } = await SocialService.getApi().put(`/notes/${noteId}`, payload)

        return new Note(data)
    }

    async fetchNotesByLabels(labels: TagLabel[], filter: NoteFilter): Promise<LabelWithNotes[]> {
        try {
            const labelNotes: LabelWithNotes[] = []
            let tabParams = {}

            if (filter === NoteFilter.ALL) tabParams = {}

            if (filter === NoteFilter.OVERDUE)
                tabParams = {
                    'filter[reminderAt][lt]': dayjs().toISOString(),
                    'filter[isSnoozed][not]': 1
                }

            if (filter === NoteFilter.DUE_TODAY)
                tabParams = {
                    'filter[reminderAt][gt]': dayjs().startOf('date').toISOString(),
                    'filter[reminderAt][lt]': dayjs().endOf('date').toISOString(),
                    'filter[isSnoozed][not]': 1
                }

            await Promise.all(
                labels.map(async label => {
                    const labelFilter = {
                        labels: `[${label.id}]`
                    }

                    const notes = await this.fetchNotes({ ...labelFilter, ...tabParams })

                    if (!notes.length) return

                    labelNotes.push({
                        label,
                        notes
                    })
                })
            )

            const notesWithoutLabels = await this.fetchNotes({
                unlabelled: true,
                ...tabParams
            })

            if (notesWithoutLabels.length > 0) {
                labelNotes.push({
                    label: new TagLabel({
                        id: 0,
                        //qsUserId: '',
                        appUserId: '',
                        name: 'Without labels',
                        handle: 'Without labels',
                        color: 'grey'
                    }),
                    notes: notesWithoutLabels
                })
            }

            return labelNotes
        } catch (error) {
            return []
        }
    }

    async addChecklistItem(
        noteId: number,
        payload: Partial<ChecklistModel>
    ): Promise<NoteChecklist> {
        const requestUrl = `${this.basePath}/${noteId}/checklists`

        const data = await SocialService.getApi().post(requestUrl, payload)

        return new NoteChecklist(data)
    }

    async updateChecklistItem(
        noteId: number,
        checklistId: number,
        payload: Partial<ChecklistModel>
    ): Promise<NoteChecklist> {
        const requestUrl = `${this.basePath}/${noteId}/checklists/${checklistId}`

        const data = await SocialService.getApi().put(requestUrl, payload)

        return new NoteChecklist(data)
    }

    async removeChecklistItem(noteId: number, checklistId: number): Promise<AxiosResponse> {
        const requestUrl = `${this.basePath}/${noteId}/checklists/${checklistId}`

        const res = await SocialService.getApi().delete(requestUrl)

        return res
    }

    async assignNoteLabel(noteId: number, labelId: number): Promise<UserLabel> {
        const requestUrl = `${this.basePath}/${noteId}/labels/${labelId}`

        const response = await SocialService.getApi().post(requestUrl, {})

        return response.data
    }

    async removeNoteLabel(noteId: number, labelId: number): Promise<AxiosResponse> {
        const requestUrl = `${this.basePath}/${noteId}/labels/${labelId}`

        const data = await SocialService.getApi().delete(requestUrl)

        return data
    }

    async getNoteCount(visualizationId: number): Promise<any> {
        const requestUrl = `${this.basePath}/visualizations/count/${visualizationId}`

        const data = await SocialService.getApi().get(requestUrl)

        return data
    }
}

export const noteService = new NoteService()
