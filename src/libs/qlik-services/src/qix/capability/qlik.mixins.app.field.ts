import { QField } from '@libs/qlik-models'

import { utilService } from '../../services/utilService'

export default class QlikMixinAppFieldApi {
    _qPlusGetFieldData(qData: any): QField[] {
        return utilService.flatten(qData)
    }

    async _qPlusGetFieldValues(app: any, def: any): Promise<any> {
        return new Promise(resolve => {
            app.createList(def, (reply: { qListObject: { qDataPages: { qMatrix: any[] }[] } }) => {
                resolve(
                    reply &&
                        reply.qListObject &&
                        reply.qListObject.qDataPages &&
                        reply.qListObject.qDataPages[0] &&
                        reply.qListObject.qDataPages[0].qMatrix &&
                        reply.qListObject.qDataPages[0].qMatrix.map(opt => opt[0])
                )
            })
        })
    }
}
