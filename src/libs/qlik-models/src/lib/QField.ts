export interface QField {
    qText: string
    qNum: string
    qState: string
    qElemNumber: number
}

export const Q_FIELD_TYPES = {
    discrete: 'D',
    numeric: 'N',
    timestamp: 'T'
}

export const Q_MEASURE_TYPES = {
    U: Q_FIELD_TYPES.discrete,
    A: Q_FIELD_TYPES.discrete,
    I: Q_FIELD_TYPES.numeric,
    R: Q_FIELD_TYPES.numeric,
    F: Q_FIELD_TYPES.numeric,
    M: Q_FIELD_TYPES.numeric,
    D: Q_FIELD_TYPES.timestamp,
    T: Q_FIELD_TYPES.timestamp,
    TS: Q_FIELD_TYPES.timestamp,
    IV: Q_FIELD_TYPES.discrete
}

export const Q_FIELD_TAGS = {
    date: '$date',
    timestamp: '$timestamp',
    ascii: '$ascii',
    text: '$text',
    numeric: '$numeric',
    integer: '$integer'
}

export interface QAppFieldOptions {
    rows: number
    frequencyMode: string
}
