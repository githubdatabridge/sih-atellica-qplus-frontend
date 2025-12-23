import { useState, useCallback } from 'react'

import { QAction, QActionEnum } from '@libs/qlik-models'
import { useQlikApp, useQlikAppContext } from '@libs/qlik-providers'
import { QlikAppApi } from '@libs/qlik-services'

const useQlikAppAction = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })
    const { qAppId } = useQlikApp()
    const { qAppMap } = useQlikAppContext()

    // PAM:handles the callbacks with resolve
    const getContentVar = (appApi: QlikAppApi, action: QAction) => {
        return new Promise((resolve, _reject) => {
            appApi?.$apiVariable.getContent(action.key, (reply: any) => {
                resolve(
                    reply && reply.qContent && reply.qContent.qIsNum
                        ? reply.qContent.qNum
                        : reply.qContent.qString
                )
            })
        })
    }

    // PAM:handles the callbacks with resolve
    const createValueExpression = (appApi: QlikAppApi, action: QAction) => {
        return new Promise((resolve, reject) => {
            appApi?.createGenericObject(
                {
                    [action.key]: {
                        qValueExpression: action.value
                    }
                },
                (reply: any) => {
                    resolve(reply[action.key])
                }
            )
        })
    }

    const createStringExpression = (appApi: QlikAppApi, action: QAction) => {
        return new Promise((resolve, reject) => {
            appApi?.createGenericObject(
                {
                    [action.key]: {
                        qStringExpression: action.value
                    }
                },
                (reply: any) => {
                    resolve(reply[action.key])
                }
            )
        })
    }

    const setQlikAction = useCallback(async (action: QAction) => {
        let r,
            l,
            s = null
        const values = []
        const qApp = qAppMap.get(action?.qAppId || qAppId)
        if (qApp?.qApi) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                switch (action.name) {
                    case QActionEnum.SET_NUM_VALUE:
                        r = await qApp?.qApi?.$apiVariable.setNumValue(action.key, action.value)
                        break
                    case QActionEnum.SET_STRING_VALUE:
                        r = await qApp?.qApi?.$apiVariable.setStringValue(action.key, action.value)
                        break
                    case QActionEnum.GET_CONTENT:
                        r = await getContentVar(qApp?.qApi, action)
                        break
                    case QActionEnum.CLEAR_FIELD:
                        r = await qApp?.qApi?.qApp.removeSelection(action.key)
                        break
                    case QActionEnum.CLEAR_ALL:
                        r = await qApp?.qApi?.qApp.removeAllSelections()
                        break
                    case QActionEnum.LOCK_ALL:
                        r = await qApp?.qApi?.lockAll()
                        break
                    case QActionEnum.UNLOCK_ALL:
                        r = await qApp?.qApi?.unlockAll()
                        break
                    case QActionEnum.LOCK_FIELD:
                        r = await qApp?.qApi?.getField(action.key)
                        l = await r.$apiField.lock()
                        break
                    case QActionEnum.UNLOCK_FIELD:
                        r = await qApp?.qApi?.getField(action.key)
                        l = await r.$apiField.unlock()
                        break
                    case QActionEnum.APPLY_BOOKMARK:
                        r = await qApp?.qApi?.$apiBookmark.apply(action.key)
                        break
                    case QActionEnum.SELECT_FIELD_VALUES:
                        for (const v of action.value.split(',')) {
                            if (action.isNum) {
                                values.push({ qIsNumeric: true, qNumber: v })
                            } else {
                                values.push({ qText: v })
                            }
                        }
                        r = await qApp?.qApi?.selectFieldValues(
                            action.key,
                            values,
                            action?.toggle,
                            action?.softLock
                        )
                        break
                    case QActionEnum.CREATE_VALUE_EXPR:
                        r = await createValueExpression(qApp?.qApi, action)
                        break
                    case QActionEnum.CREATE_STRING_EXPR:
                        r = await createStringExpression(qApp?.qApi, action)
                        break
                    case QActionEnum.SELECT_VALUE_EXPR:
                        s = action.isNum
                            ? await createValueExpression(qApp?.qApi, action)
                            : await createStringExpression(qApp?.qApi, action)
                        r = await qApp?.qApi?.selectFieldValues(
                            action.key,
                            action.isNum ? [{ qIsNumeric: true, qNumber: s }] : [{ qText: s }],
                            action?.toggle,
                            action?.softLock
                        )
                        break
                    default:
                        break
                }
                setQAction({ loading: false, qResponse: { r, l }, error: null })
                return r
            } catch (error) {
                setQAction({ loading: false, qResponse: null, error: error })
            }
        }
    }, [])

    return { qAction, setQlikAction }
}

export default useQlikAppAction
