import { QFieldSelectionInfo, QFieldSelectedInfo } from '@libs/qlik-models'

export default class QlikMixinAppSelectionApi {
    /**
     * Get current selections
     */
    async _qPlusGetSelectionInfo(qSelections: any): Promise<QFieldSelectionInfo | null> {
        const fields: QFieldSelectedInfo[] = []
        try {
            qSelections.map((s: any) => {
                fields.push({
                    fieldName: s.fieldName,
                    selected: s.qSelected,
                    selectedCount: s.selectedCount,
                    totalCount: s.totalCount
                })
            })

            return { fields }
        } catch (e) {
            throw new Error(e.message)
            return null
        }
    }
}
