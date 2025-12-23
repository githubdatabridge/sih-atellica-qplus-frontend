export enum QActionEnum {
    SET_NUM_VALUE = 'setNumValueVar',
    SET_STRING_VALUE = 'setStringValueVar',
    GET_CONTENT = 'getContentVar',
    CLEAR_FIELD = 'clearField',
    CLEAR_ALL = 'clearAll',
    LOCK_ALL = 'lockAll',
    UNLOCK_ALL = 'unlockAll',
    LOCK_FIELD = 'lockField',
    UNLOCK_FIELD = 'unlockField',
    APPLY_BOOKMARK = 'applyBookmark',
    SELECT_FIELD_VALUES = 'selectFieldValues',
    CREATE_VALUE_EXPR = 'createValueExpression',
    CREATE_STRING_EXPR = 'createStringExpression',
    SELECT_VALUE_EXPR = 'selectValueExpression'
}

export type QAction = {
    qAppId?: string
    name: QActionEnum
    value?: any
    key?: string
    isNum?: boolean
    toggle?: boolean
    softLock?: boolean
}
