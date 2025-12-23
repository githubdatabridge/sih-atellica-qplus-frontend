import { CoreService } from './core'

class DummyService {
    async getParamData(
        perPage = 10,
        page?: number,
        searchColumns?: string,
        searchOperator?: string,
        searchQuery?: string,
        orderByColumn = 'createdAt',
        orderByOperator?: string,
        filter?: string
    ) {
        const response = {
            data: [
                {
                    id: 48,
                    createdAt: '2022-09-07T12:30:33.181Z',
                    updatedAt: '2022-09-07T12:30:33.181Z',
                    deletedAt: null,
                    name: 'Cat',
                    description: '3',
                    count: 2,
                    testId: 1,
                    isDummy: false,
                    test: {
                        id: 1,
                        name: '1_name'
                    }
                },
                {
                    id: 46,
                    createdAt: '2022-09-06T13:04:36.864Z',
                    updatedAt: '2022-09-06T13:04:47.478Z',
                    deletedAt: null,
                    name: 'No',
                    description: 'Yes',
                    count: 12,
                    testId: 1,
                    isDummy: false,
                    test: {
                        id: 1,
                        name: '1_name'
                    }
                },
                {
                    id: 45,
                    createdAt: '2022-09-06T12:38:58.417Z',
                    updatedAt: '2022-09-06T12:39:33.335Z',
                    deletedAt: null,
                    name: 'Yay',
                    description: 'ha1',
                    count: 44,
                    testId: 123,
                    isDummy: false,
                    test: {
                        id: 123,
                        name: '123_name'
                    }
                },
                {
                    id: 43,
                    createdAt: '2022-08-22T11:55:27.920Z',
                    updatedAt: '2022-08-29T13:20:33.622Z',
                    deletedAt: null,
                    name: 'Patric 2 Update 2',
                    description: 'Thank You',
                    count: 2,
                    testId: 123,
                    isDummy: true,
                    test: {
                        id: 123,
                        name: '123_name'
                    }
                },
                {
                    id: 42,
                    createdAt: '2022-08-22T10:51:17.630Z',
                    updatedAt: '2022-08-22T10:51:17.630Z',
                    deletedAt: null,
                    name: 'Save',
                    description: 'Save',
                    count: 1,
                    testId: 1,
                    isDummy: true,
                    test: {
                        id: 1,
                        name: '1_name'
                    }
                },
                {
                    id: 41,
                    createdAt: '2022-08-22T10:51:02.340Z',
                    updatedAt: '2022-08-22T10:51:02.340Z',
                    deletedAt: null,
                    name: 'Save',
                    description: 'Save',
                    count: 1,
                    testId: 1,
                    isDummy: false,
                    test: {
                        id: 1,
                        name: '1_name'
                    }
                },
                {
                    id: 39,
                    createdAt: '2022-08-17T13:33:38.213Z',
                    updatedAt: '2022-08-18T14:57:30.901Z',
                    deletedAt: null,
                    name: 'My Luv E',
                    description: 'asha',
                    count: 44,
                    testId: 55,
                    isDummy: true,
                    test: {
                        id: 55,
                        name: '55_name'
                    }
                },
                {
                    id: 38,
                    createdAt: '2022-08-17T12:11:29.760Z',
                    updatedAt: '2022-08-18T14:54:11.793Z',
                    deletedAt: null,
                    name: 'Everything is Fine',
                    description: 'Yes',
                    count: 1,
                    testId: 55,
                    isDummy: true,
                    test: {
                        id: 55,
                        name: '55_name'
                    }
                },
                {
                    id: 37,
                    createdAt: '2022-08-17T12:10:32.728Z',
                    updatedAt: '2022-08-18T14:54:36.959Z',
                    deletedAt: null,
                    name: 'WelcomeAboard',
                    description: '123',
                    count: 123,
                    testId: 1,
                    isDummy: false,
                    test: {
                        id: 1,
                        name: '1_name'
                    }
                },
                {
                    id: 34,
                    createdAt: '2022-08-17T10:40:46.985Z',
                    updatedAt: '2022-08-17T10:40:46.985Z',
                    deletedAt: null,
                    name: 'NovoIme',
                    description: '123',
                    count: 1,
                    testId: 55,
                    isDummy: true,
                    test: {
                        id: 55,
                        name: '55_name'
                    }
                }
            ],
            pagination: {
                total: 21,
                lastPage: 3,
                perPage: 10,
                currentPage: 1,
                from: 0,
                to: 10
            },
            operators: {
                filter: {
                    id: ['eq', 'not'],
                    name: ['eq', 'not', 'like'],
                    description: ['eq', 'not', 'like'],
                    count: ['eq', 'lt', 'gt', 'lte', 'gte', 'not'],
                    testId: ['eq', 'not'],
                    createdAt: ['eq', 'lt', 'gt', 'lte', 'gte', 'not'],
                    updatedAt: ['eq', 'lt', 'gt', 'lte', 'gte', 'not']
                },
                search: {
                    name: ['eq', 'like'],
                    testId: ['eq', 'like'],
                    description: ['eq', 'like'],
                    count: ['eq', 'like']
                },
                orderBy: ['createdAt', 'id', 'updatedAt', 'title', 'count']
            }
        }
        return {
            data: response?.data,
            pagination: response?.pagination,
            operators: response?.operators
        }
    }

    async updateRecord(id: number, payload) {
        const response = await CoreService.getApi().put(`/dummies/${id}`, payload)
        return response.data
    }

    async createRecord(payload) {
        const response = await CoreService.getApi().post('/dummies', payload)
        return response.data
    }

    async deleteRecord(id: number) {
        return await CoreService.getApi().delete(`/dummies/${id}`)
    }
}

export const dummyService = new DummyService()
