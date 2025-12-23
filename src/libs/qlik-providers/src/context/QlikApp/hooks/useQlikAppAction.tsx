import { useState, useCallback } from 'react'

import { QAction, QActionEnum } from '@libs/qlik-models'
import { QlikAppApi } from '@libs/qlik-services'

const useQlikAppAction = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

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

    const setQlikAction = useCallback(async (appApi: QlikAppApi, action: QAction) => {
        let r,
            l,
            s = null
        const values = []
        if (appApi) {
            try {
                setQAction({ loading: true, qResponse: null, error: null })
                switch (action.name) {
                    case QActionEnum.SET_NUM_VALUE:
                        r = await appApi?.$apiVariable.setNumValue(action.key, action.value)
                        break
                    case QActionEnum.SET_STRING_VALUE:
                        r = await appApi?.$apiVariable.setStringValue(action.key, action.value)
                        break
                    case QActionEnum.GET_CONTENT:
                        r = await getContentVar(appApi, action)
                        break
                    case QActionEnum.CLEAR_FIELD:
                        r = await appApi?.qApp.removeSelection(action.key)
                        break
                    case QActionEnum.CLEAR_ALL:
                        r = await appApi?.qApp.removeAllSelections()
                        break
                    case QActionEnum.LOCK_ALL:
                        r = await appApi?.lockAll()
                        break
                    case QActionEnum.UNLOCK_ALL:
                        r = await appApi?.unlockAll()
                        break
                    case QActionEnum.LOCK_FIELD:
                        r = await appApi?.getField(action.key)
                        l = await r.$apiField.lock()
                        break
                    case QActionEnum.UNLOCK_FIELD:
                        r = await appApi?.getField(action.key)
                        l = await r.$apiField.unlock()
                        break
                    case QActionEnum.APPLY_BOOKMARK:
                        r = await appApi?.$apiBookmark.apply(action.key)
                        break
                    case QActionEnum.SELECT_FIELD_VALUES:
                        for (const v of action.value.split(',')) {
                            if (action.isNum) {
                                values.push({ qIsNumeric: true, qNumber: v })
                            } else {
                                values.push({ qText: v })
                            }
                        }
                        r = await appApi?.selectFieldValues(
                            action.key,
                            values,
                            action?.toggle,
                            action?.softLock
                        )
                        break
                    case QActionEnum.CREATE_VALUE_EXPR:
                        r = await createValueExpression(appApi, action)
                        break
                    case QActionEnum.CREATE_STRING_EXPR:
                        r = await createStringExpression(appApi, action)
                        break
                    case QActionEnum.SELECT_VALUE_EXPR:
                        s = action.isNum
                            ? await createValueExpression(appApi, action)
                            : await createStringExpression(appApi, action)
                        r = await appApi?.selectFieldValues(
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
