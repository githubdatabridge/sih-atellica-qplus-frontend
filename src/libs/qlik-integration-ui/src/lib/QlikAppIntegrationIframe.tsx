import React, { FC, useState } from 'react'

import Iframe from 'react-iframe'
import { useMount } from 'react-use'

/* eslint-disable-next-line */
export interface IQlikAppIntegrationIframeProps {
    isSsl?: boolean
    host: string
    vp?: string
    appId: string
    sheetId?: string
    path?: string
    css?: any
    height?: string
}

export const QlikAppIntegrationIframe: FC<IQlikAppIntegrationIframeProps> = ({
    height,
    isSsl = true,
    host,
    vp,
    appId,
    sheetId,
    path,
    css
}) => {
    const [qlikUrl, setQlikUrl] = useState<string>('')

    useMount(async () => {
        const url = `${isSsl ? 'https' : 'http'}://${host}/${vp ? `${vp}/` : '/'}sense/app/${appId}`
        const qlikSheet = sheetId ? `sheet/${sheetId}&` : ''
        const qlikPath = path ? `path=${path}&` : ''
        const iFrameUrl = `${url}/${qlikSheet}/state/analysis/${qlikPath}`

        setQlikUrl(iFrameUrl)
    })

    return <Iframe url={qlikUrl} width="100%" height={height} styles={{ ...css }} frameBorder={0} />
}

export default QlikAppIntegrationIframe
