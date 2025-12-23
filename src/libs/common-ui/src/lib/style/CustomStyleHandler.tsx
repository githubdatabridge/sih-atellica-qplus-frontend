import React from 'react'

import { useMount, useUpdateEffect } from 'react-use'

import { useTheme, Theme } from '@mui/material'

const CustomStyleHandler: React.FC<any> = ({ children }) => {
    const theme = useTheme()

    useMount(() => {
        const stylesheet: CSSStyleSheet = document.styleSheets[0]

        stylesheet.insertRule(
            `.draftJsMentionPlugin__mention__29BEd, .draftJsMentionPlugin__mention__29BEd:visited {
            color: #fff !important;
            cursor: text !important;
            display: inline-block;
            background: ${theme.palette.secondary.main} !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            border-radius: 10px !important;
            text-decoration: none;
            font-family: Open Sans !important;
        }`
        )
    })

    useUpdateEffect(() => {
        const stylesheet: any = document.styleSheets[0]

        stylesheet.deleteRule(0)

        stylesheet.insertRule(
            `.draftJsMentionPlugin__mention__29BEd, .draftJsMentionPlugin__mention__29BEd:visited {
            color: #fff !important;
            cursor: text !important;
            display: inline-block;
            background: ${theme.palette.secondary.main} !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            border-radius: 10px !important;
            text-decoration: none;
            font-family: Open Sans !important;

        }`
        )
    }, [theme])

    return <>{children}</>
}

export default React.memo(CustomStyleHandler)
