import React, { ReactNode, useCallback } from 'react'
import { useMount } from 'react-use'
import {
    useQplusGetHypercubeData,
    useQplusGetObject,
    useQplusGetVisualizations,
    useQplusFieldListData,
    useQplusApp,
    useQplusI18nContext,
    useQplusValueExpression
} from '@databridge/qplus'

import { labelTag } from 'app/shared/options/labelOptions'
import { hiddenTagOptions } from 'app/shared/options/hiddenFieldsOptions'
import { expIsUserGuard } from 'app/shared/options/userOptions'
import { useAppContext } from 'app/context/AppContext'

const transformData = (data: any) => {
    const sData: any[] = []
    for (let index = 0; index < data?.length; index++) {
        const item = {
            locale: 'SYS',
            key: data[index][0].qText,
            title: data[index][1].qText
        }
        sData.push(item)
    }
    return sData
}

type ActionProps = { children: ReactNode }

const Actions = React.memo(({ children }: ActionProps) => {
    const { setLabelsInStore, setLabelsIsLoading } = useQplusI18nContext()
    const { qAppId } = useQplusApp()
    const { setObject } = useQplusGetObject()
    const { setHypercubeData } = useQplusGetHypercubeData()
    const { setMasterVisualizationList } = useQplusGetVisualizations()
    const { setFieldListData } = useQplusFieldListData()
    const { setValueExpression } = useQplusValueExpression()
    const { setIsUserGuard, setHiddenFields } = useAppContext()

    const loadTranslations = useCallback(async () => {
        // @ts-ignore
        const mLanguageTable = await setMasterVisualizationList([labelTag], 'table', qAppId)

        if (mLanguageTable && mLanguageTable.length > 0) {
            // @ts-ignore
            const model = await setObject('', mLanguageTable[0].qLibraryId, null)
            if (model) {
                const qData = await setHypercubeData(
                    '/qHyperCubeDef',
                    model,
                    model.layout.qHyperCube.qSize,
                    qAppId
                )
                const data = transformData(qData)

                setLabelsInStore(data)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadVariables = useCallback(async () => {
        await setValueExpression(
            'isGuard',
            expIsUserGuard,
            function (reply: any) {
                setIsUserGuard(reply?.isGuard === -1)
            },
            qAppId
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadHiddenFields = useCallback(async () => {
        const f = await setFieldListData(qAppId, true)
        const filteredItems = f?.filter(i => i.qTags.indexOf(hiddenTagOptions) >= 0)
        const newFilteredItems = filteredItems?.map(f => f.qName)

        setHiddenFields(newFilteredItems)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useMount(async () => {
        try {
            await loadVariables()
            await loadTranslations()
            await loadHiddenFields()
        } finally {
            setLabelsIsLoading(false)
        }
    })

    return <>{children}</>
})

export default Actions
