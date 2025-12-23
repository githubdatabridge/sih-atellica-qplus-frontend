import React, { FC, useState } from 'react'

import Iframe from 'react-iframe'
import { useMount } from 'react-use'

/* eslint-disable-next-line */
export interface IQlikSingleIntegrationIframeProps {
    isSsl?: boolean
    host: string
    vp?: string
    appId: string
    objectId?: string
    sheetId?: string
    identity?: string
    options?: string
    lang?: string
    callback?: string
    bookmarkId?: string
    select?: string
    theme?: string
    css?: any
    height?: string
}

export const QlikSingleIntegrationIframe: FC<IQlikSingleIntegrationIframeProps> = ({
    height,
    isSsl = true,
    host,
    vp,
    appId,
    objectId,
    sheetId,
    identity,
    options,
    lang = 'EN',
    callback,
    bookmarkId,
    select,
    theme,
    css
}) => {
    const [qlikUrl, setQlikUrl] = useState<string>('')

    useMount(async () => {
        const url = `${isSsl ? 'https' : 'http'}://${host}/${
            vp ? `${vp}/` : '/'
        }single/?appid=${appId}&`
        const qlikSheet = sheetId ? `sheet=${sheetId}&` : ''
        const qlikIdentity = identity ? `identity=${identity}&` : ''
        const qlikObject = objectId ? `object=${objectId}&` : ''
        const qTheme = theme ? `theme=${theme}&` : ''
        const qlikSelect = select ? `select=${select}&` : ''
        const qlikBookmark = bookmarkId ? `bookmark=${bookmarkId}&` : ''
        const qlikOptions = options ? `options=${options}&` : ''
        const customCallback = callback ? `select=${callback}&` : ''
        const qLang = lang ? `lang=${lang}` : ''
        const iFrameUrl = `${url}${qlikSheet}${qlikIdentity}${qlikObject}${qTheme}${qlikSelect}${qlikBookmark}${qlikOptions}${customCallback}${qLang}`

        setQlikUrl(iFrameUrl)
    })

    return <Iframe url={qlikUrl} width="100%" height={height} styles={{ ...css }} frameBorder={0} />
}

export default QlikSingleIntegrationIframe
