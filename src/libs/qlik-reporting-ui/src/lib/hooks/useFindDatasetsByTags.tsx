import { useState, useCallback } from 'react'

import { QMasterVisualization } from '@libs/qlik-models'

const useFindDatasetsByTags = () => {
    const [qAction, setQAction] = useState<any>({ loading: false, qResponse: null, error: null })

    const setFindDatasetsByTags = useCallback(
        (tags: string[] | string, masterVisualizations: QMasterVisualization[]) => {
            const masterVisualizationsByTag: QMasterVisualization[] = []
            for (let i = 0; i <= masterVisualizations.length - 1; i++) {
                const item = masterVisualizations[i]
                if (tags && tags.length > 0) {
                    for (const tag of tags) {
                        for (const itemTag of item.tags) {
                            if (itemTag.startsWith(tag)) {
                                masterVisualizationsByTag.push(item)
                            }
                        }
                    }
                }
            }
            const datasets =
                masterVisualizationsByTag.length > 0
                    ? masterVisualizationsByTag
                    : masterVisualizations

            setQAction({ loading: false, qResponse: { datasets }, error: null })
            return masterVisualizationsByTag.length > 0
                ? masterVisualizationsByTag
                : masterVisualizations
        },
        []
    )

    return { qAction, setFindDatasetsByTags }
}

export default useFindDatasetsByTags
