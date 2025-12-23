export const OPERATORS_MAP = (type: string) =>
    ({
        eq: 'is equal',
        lt: 'lower than',
        gt: 'greater than',
        lte: 'lower than equal',
        gte: 'greater than equal',
        not: 'not',
        like: 'like'
    }[type] || 'eq')
