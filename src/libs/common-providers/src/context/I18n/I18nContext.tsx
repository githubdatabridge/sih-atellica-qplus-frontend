import { createContext, useContext } from 'react'

export type LanguageModel = {
    locale: string
    title: string
}

export type LabelModel = {
    locale: string
    key: string
    title: string
}

type I18nType = {
    labelsIsLoading: boolean
    labelsInStore: LabelModel[]
    labels: any
    languagesInStore: LanguageModel[]
    currentLanguageLocale: string | undefined
    loading: boolean
    onLanguageChange: (locale: string, overwriteLabels?: LabelModel[]) => void
    setLangsInStore: (langs: LanguageModel[]) => void
    setLabelsInStore: (labelsData: LabelModel[]) => void
    setLabelsIsLoading: (isLoading: any) => void
    getCurrentLanguageByLocale: (locale: string) => LanguageModel
}

export const I18nContext = createContext<I18nType>({
    labelsIsLoading: false,
    labelsInStore: undefined,
    labels: {},
    languagesInStore: [],
    currentLanguageLocale: undefined,
    loading: false,
    setLabelsIsLoading: _isLoading => {
        throw new Error('setLabelsIsLoading() not implemented')
    },
    setLabelsInStore: _labelsData => {
        throw new Error('setLabelsInStore() not implemented')
    },
    setLangsInStore: _labelsData => {
        throw new Error('setLangsInStore() not implemented')
    },
    onLanguageChange: (_locale: string, _overwriteLabels?: LabelModel[]) => {
        throw new Error('onLanguageChange() not implemented')
    },
    getCurrentLanguageByLocale: _locale => {
        throw new Error('getCurrentLanguageByLocale() not implemented')
    }
})

export const useI18nContext = () => {
    return useContext(I18nContext)
}

export const useI18n = () => {
    const translation = useContext(I18nContext)

    const t = (k: string) => {
        if (translation.loading) return ' '
        const value = translation.labels[k]
        if (!value) {
            return k
        }
        return value
    }

    return { t }
}
