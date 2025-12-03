import { View } from 'app/shared/models/View'

export const getReportingViews = (height?: number): View[] => {
    return [
        {
            view: 'Self Service Reporting',
            route: '/apps/dashboards/reporting',
            subViews: []
        },
        {
            view: 'Pin Wall',
            route: '/apps/dashboards/reporting/pinwall',
            subViews: []
        }
    ]
}
