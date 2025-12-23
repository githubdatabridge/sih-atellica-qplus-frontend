import QixObjectApi from './qix.global.doc.object'

const QLIK_FETCH_LIMIT = 1000

interface IQixHypercubeLayoutPageInfo {
    totalWidth: number
    totalHeight: number
    pageHeight: number
    numberOfPages: number
}

export class QlikDataService {
    async getHypercubeMeta(qixModel: QixObjectApi): Promise<IQixHypercubeLayoutPageInfo | null> {
        try {
            const qixLayout = await qixModel.getHypercubeLayout()

            const totalWidth: number = qixLayout.qHyperCube.qSize.qcx
            const totalHeight: number = qixLayout.qHyperCube.qSize.qcy
            const pageHeight: number = Math.floor(QLIK_FETCH_LIMIT / totalWidth)
            const numberOfPages: number = Math.ceil(totalHeight / pageHeight)

            return {
                totalWidth,
                totalHeight,
                pageHeight,
                numberOfPages
            }
        } catch (error) {
            return null
        }
    }

    async getHypercubeData(qixModel: QixObjectApi, page: EngineAPI.INxPage): Promise<any> {
        const qData: EngineAPI.INxCellRows[] = []
        try {
            const qixLayout = await qixModel.getHypercubeLayout()
            const totalWidth: number = qixLayout.qHyperCube.qSize.qcx
            const totalHeight: number = qixLayout.qHyperCube.qSize.qcy
            const pageHeight: number = Math.floor(QLIK_FETCH_LIMIT / totalWidth)
            const numberOfPages: number = Math.ceil(totalHeight / pageHeight)

            const promises: Promise<EngineAPI.INxDataPage[]>[] = []

            for (let i = 0; i < numberOfPages; i++) {
                promises.push(qixModel.getHyperCubeData('/qHyperCubeDef', [page]))
            }

            const data = await Promise.all(promises)
            for (const currentData of data) {
                for (const qMatrix of currentData[0].qMatrix) {
                    qData.push(qMatrix)
                }
            }

            return qData
        } catch (error) {}
    }
}

export const qlikDataService = new QlikDataService()
