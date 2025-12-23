export class NoteChecklist {
    id: number
    text: string
    checked: boolean

    constructor(data: any) {
        this.id = data.id
        this.text = data.text
        this.checked = Boolean(data.checked)
    }
}

export class ChecklistModel {
    id?: number | null
    text: string
    checked: boolean

    constructor(data: any) {
        this.id = data.id || undefined
        this.text = data.text
        this.checked = Boolean(data.checked) || false
    }
}
