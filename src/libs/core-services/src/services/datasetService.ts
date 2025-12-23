import { Dataset } from '@libs/common-models'

import { CoreService } from './core'

interface NewDataset {
    qlikAppId?: string
    title?: string
    description?: string
    label?: string
    tags?: string[]
    dimensions?: any[]
    measures?: any[]
    visualizations?: any[]
    filters?: any[]
}

interface DatasetPayload {
    qlikAppId?: string
    title: string
    description?: string
    label?: string
    tags?: string[]
    dimensions?: QItem[]
    measures?: QItem[]
    visualizations?: any[]
    filters?: QItem[]
}

interface QItem {
    qId: string
    label?: string
}

class DatasetService {
    async getAllDatasets(perPage = 100, query?: string): Promise<any[]> {
        const datasets: Dataset[] = []

        const response = await CoreService.getApi().get(
            query ? `/datasets${query}&perPage=${perPage}` : `/datasets?perPage=${perPage}`
        )
        const pages = response.pagination.lastPage
        const promises: Promise<any>[] = []

        if (pages > 1) {
            for (let i = 1; i < pages; i++) {
                promises.push(
                    CoreService.getApi().get(
                        query
                            ? `/datasets${query}&page=${i}&perPage=${perPage}`
                            : `/datasets?perPage=${perPage}`
                    )
                )
            }
            const data = await Promise.all(promises)
            const newDatasets = []
            for (const dataset of data) {
                const pageDatasets = dataset.data.map(item => new Dataset(item))
                newDatasets.push(...datasets.concat(pageDatasets))
            }
            const seen = new Set()
            const uniqueDatasets = newDatasets.filter(el => {
                const duplicate = seen.has(el.id)
                seen.add(el.id)
                return !duplicate
            })
            return this.sortArray(uniqueDatasets)
        } else {
            const reports = response.data.map(item => new Dataset(item))
            return this.sortArray(reports)
        }
    }

    async getDataset(id: number) {
        return await CoreService.getApi().get(`/datasets/${id}`)
    }

    async getDatasetExport() {
        return await CoreService.getApi().get('/datasets/export')
    }

    async createDataset(newDataset: NewDataset) {
        const payload: DatasetPayload = {
            qlikAppId: newDataset.qlikAppId,
            title: newDataset.title,
            tags: newDataset.tags,
            dimensions: this.mapData(newDataset.dimensions),
            measures: this.mapData(newDataset.measures),
            filters: this.mapData(newDataset.filters),
            visualizations: newDataset.visualizations
        }
        if (newDataset.description) payload.description = newDataset.description
        if (newDataset.label) payload.label = newDataset.label

        const response = await CoreService.getApi().post('/datasets', payload)
        return response.data
    }

    async updateDataset(datasetId: number, newDataset: NewDataset) {
        const payload: DatasetPayload = {
            qlikAppId: newDataset.qlikAppId,
            title: newDataset.title,
            tags: newDataset.tags,
            dimensions: this.mapData(newDataset.dimensions),
            measures: this.mapData(newDataset.measures),
            filters: this.mapData(newDataset.filters),
            visualizations: newDataset.visualizations
        }
        if (newDataset.description) payload.description = newDataset.description
        if (newDataset.label) payload.label = newDataset.label

        const response = await CoreService.getApi().put(`/datasets/${datasetId}`, payload)
        return response.data
    }

    async deleteDataset(id: number, cascade = true) {
        return await CoreService.getApi().delete(`/datasets/${id}?cascade=${cascade}`)
    }

    private mapData(data: any) {
        const mappedData: QItem[] = []
        data.forEach(item => {
            const el: QItem = { qId: item.qLibraryId }
            if (item.isEdited) el.label = item.label
            mappedData.push(el)
        })
        return mappedData
    }

    private sortArray(datasets: Dataset[]) {
        return (
            datasets?.sort(function (a, b) {
                if (a.title < b.title) {
                    return -1
                }
                if (a.title > b.title) {
                    return 1
                }
                return 0
            }) || []
        )
    }
}

export const datasetService = new DatasetService()
