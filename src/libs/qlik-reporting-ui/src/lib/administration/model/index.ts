export enum QlikReadyChartOperationEnum {
    CREATE = 'create',
    REMOVE = 'remove',
    CHANGE_NAME = 'changeName',
    NONE = 'none'
}

export type TQlikReadyChart = {
    name: string
    properties: any
    mark?: QlikReadyChartOperationEnum
    markParam?: string
}

export enum JsonViewerEnum {
    CODE = 'code',
    JSON = 'json',
    VIEW = 'chart'
}
