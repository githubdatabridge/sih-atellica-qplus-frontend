import { CoreService } from './core'

export class QlikService {
    async isActive(): Promise<boolean> {
        return await CoreService.getApi().get(`/qlik/is-active`)
    }

    async reload(): Promise<any> {
        CoreService.getApi().post('/qlik-jobs', {})
    }

    async partialReload(): Promise<any> {
        CoreService.getApi().post('/qlik-jobs/partial', {})
    }

    async checkJobIsRunning(): Promise<boolean> {
        const res = await CoreService.getApi().get('/qlik-jobs/check')
        return res?.inProgress ?? false
    }

    async setViewedJob(jobId: number): Promise<boolean> {
        return await CoreService.getApi().patch(`/qlik-jobs/${jobId}`, {})
    }
}

export const qlikService = new QlikService()
