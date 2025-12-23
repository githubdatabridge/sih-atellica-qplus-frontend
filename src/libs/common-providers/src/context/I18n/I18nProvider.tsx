/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC, ReactElement, useState, useCallback, useRef, useEffect } from 'react'

import { defaultLabels, defaultLanguages } from '@libs/translations'

import { I18nContext, LabelModel, LanguageModel } from './I18nContext'

interface Props {
    locale?: string
    langs?: LanguageModel[]
    children: ReactElement
}

export const I18nProvider: FC<Props> = ({ children, locale = 'EN', langs = [] }) => {
    const [currentLanguageLocale, setCurrentLanguageLocale] = useState<string>(locale)
    const [languagesInStore, setLanguagesInStore] = useState<LanguageModel[]>([])
    const [labels, setLabelsDictionary] = useState<any>({})
    const [labelsInStore, setStoreLabels] = useState<LabelModel[]>([])
    const [labelsIsLoading, setLabelsLoading] = useState<boolean>(true)

    let languagesRef = useRef<LanguageModel[]>([]).current

    useEffect(() => {
        if (langs && langs.length > 0) {
            loadLanguages(langs)
        } else {
            loadLanguages(defaultLanguages)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [langs])

    useEffect(() => {
        if (languagesInStore && languagesInStore?.length > 0) {
            const currentLanguage = getCurrentLanguageByLocale(locale)
            const labels = defaultLabels() as LabelModel[]
            const scopedLabels = labels.filter(x =>
                languagesInStore?.find(y => y.locale === x.locale)
            )
            setStoreLabels(scopedLabels)
            if (currentLanguage) {
                loadLanguageLabels(currentLanguage.locale!, scopedLabels)
                setCurrentLanguageLocale(currentLanguage.locale!)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [languagesInStore])

    const onLanguageChange = useCallback(
        (locale: string, overwriteLabels: LabelModel[] = []) => {
            const lang = languagesInStore?.find(
                (lang: { locale: any }) => lang.locale.toLowerCase() === locale.toLowerCase()
            )
            if (lang) {
                // PAM: Merge label data from store with the new one
                const mergedLabelsData = mergeWithoutDupes(labelsInStore, overwriteLabels)
                setStoreLabels(mergedLabelsData)
                loadLanguageLabels(lang.locale, mergedLabelsData)
                setCurrentLanguageLocale(locale)
            } else {
                console.log('Qplus language not found', locale)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [labelsInStore, languagesInStore]
    )

    const getCurrentLanguageByLocale = useCallback(
        (locale: string) => {
            const currentLanguage = languagesRef?.find((l: LanguageModel) => {
                return l.locale.toLowerCase() === locale.toLowerCase()
            })

            if (!currentLanguage)
                console.log('Qplus lang', `${locale} not supported`, 'Fallback: SYS')

            return currentLanguage || { locale: 'SYS', title: 'System' }
        },
        [languagesRef]
    )

    const loadLanguageLabels = async (locale: string, lbls: LabelModel[]) => {
        if (!locale) return
        const currentLangLabels = lbls?.filter(l => {
            return l.locale === locale
        })
        const labelDictionary = currentLangLabels?.reduce(
            (a, x) => ({ ...a, [x.key]: x.title }),
            {}
        )
        setLabelsDictionary(labelDictionary)
    }

    const setLabelsIsLoading = useCallback((isLoading: any) => {
        setLabelsLoading(isLoading)
    }, [])

    // PAM: Merge Without Dupes.
    const mergeWithoutDupes = (a: LabelModel[], b: LabelModel[]) => {
        const concatLabels = a.concat(b) // merge two arrays
        const mapSet = new Map()
        for (const label of concatLabels) {
            mapSet.set(label.key + '_' + label.locale, label)
        }
        return [...mapSet.values()]
    }

    const setLabelsInStore = useCallback(
        (newLabels: LabelModel[]) => {
            // PAM: Merge label data from store with the new one
            const mergedLabelsData = mergeWithoutDupes(labelsInStore, newLabels)

            // PAM: Set new labels
            setStoreLabels(mergedLabelsData as LabelModel[])
        },
        [labelsInStore]
    )

    const loadLanguages = async (loadedLanguages: any) => {
        setLanguagesInStore(loadedLanguages)
        languagesRef = loadedLanguages
    }

    const setLangsInStore = useCallback((langs: LanguageModel[]) => {
        const scopedLanguages = defaultLanguages.filter(x => langs.find(y => y.locale === x.locale))
        loadLanguages(scopedLanguages || defaultLanguages)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const providerValue = React.useMemo(
        () => ({
            labelsIsLoading,
            labels,
            labelsInStore,
            languagesInStore,
            currentLanguageLocale,
            loading: false,
            setLabelsInStore,
            setLangsInStore,
            onLanguageChange,
            getCurrentLanguageByLocale,
            setLabelsIsLoading
        }),
        [
            labelsIsLoading,
            labels,
            languagesInStore,
            labelsInStore,
            currentLanguageLocale,
            onLanguageChange,
            getCurrentLanguageByLocale,
            setLabelsIsLoading,
            setLabelsInStore,
            setLangsInStore
        ]
    )

    return <I18nContext.Provider value={providerValue}>{children}</I18nContext.Provider>
}

export default I18nProvider
