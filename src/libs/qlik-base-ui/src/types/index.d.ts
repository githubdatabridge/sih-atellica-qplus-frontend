declare module '*.svg' {
    const content: string
    export default content
}

declare module 'draft-js-mention-plugin' {
    export function defaultSuggestionsFilter(value: any, suggestions: any): any

    export default function createMentionPlugin(): any
}

declare module '*.css' {
    const content: { [className: string]: string }
    export default content
}
