interface IInfoOptions {
    title: string
    text: string
    color?: string
}

export interface IBoxPanelProps {
    actionsNode?: unknown
    infoOptions?: IInfoOptions
    title?: string
    subtitle?: string
    highlighted?: boolean
}
