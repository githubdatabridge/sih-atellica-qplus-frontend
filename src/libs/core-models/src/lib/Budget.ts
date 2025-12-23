export class Budget {
    id: number
    customerId?: string
    year?: number
    type?: string
    period?: string
    level?: string
    isUploaded?: boolean

    constructor(budget) {
        this.id = budget.id
        this.customerId = budget.customerId
        this.year = budget.year
        this.type = budget.type
        this.period = budget.period
        this.level = budget.level
        this.isUploaded = budget.isUploaded
    }
}
