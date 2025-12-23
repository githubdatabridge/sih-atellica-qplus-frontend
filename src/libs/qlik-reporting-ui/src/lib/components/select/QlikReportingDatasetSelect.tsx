import React, { FC, useEffect } from 'react'

import { Theme } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { useAlertContext, AlertType } from '@libs/common-ui'
import {
    ReportDataset,
    ReportDimensions,
    ReportMeasures,
    ReportFilters,
    ReportVisualizations
} from '@libs/core-models'
import {
    useQlikAppContext,
    useQlikLoaderContext,
    useQlikMasterItemContext
} from '@libs/qlik-providers'

import translation from '../../constants/translations'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useDatasetMapper } from '../../hooks'

interface IQlikReportingDatasetSelectProps {
    isEnabled?: boolean
    reportDimensions: ReportDimensions[]
    reportMeasures: ReportMeasures[]
    datasets: ReportDataset[]
    onDatasetChangeHandler: (
        dataset: ReportDataset,
        dimensions: ReportDimensions[],
        measures: ReportMeasures[],
        filterList: ReportFilters[],
        visualizations: ReportVisualizations[],
        qlikAppId: string
    ) => void
}

const QlikReportingDatasetSelect: FC<IQlikReportingDatasetSelectProps> = ({
    reportDimensions,
    reportMeasures,
    datasets,
    isEnabled = true,
    onDatasetChangeHandler
}) => {
    const { qAppMap } = useQlikAppContext()
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [dataset, setDataset] = React.useState<ReportDataset>(null)
    const {
        reportDataset,
        setReportIsLoading,
        setReportSelectDatasets,
        setReportSelectDimensions,
        setReportSelectMeasures
    } = useQlikReportingContext()

    const { isQlikMasterItemLoading } = useQlikLoaderContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap } = useQlikMasterItemContext()
    const { showToast } = useAlertContext()

    const { setDatasetMapper } = useDatasetMapper()

    const { t } = useI18n()

    useEffect(() => {
        setReportSelectDatasets(datasets)
    }, [datasets, setReportSelectDatasets])

    useEffect(() => {
        if (reportDataset && datasets.length > 0) {
            const sDataset = datasets?.find(ds => ds.id === reportDataset.id)
            setDataset(sDataset)
        } else {
            setDataset(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportDataset])

    useEffect(() => {
        if (reportDataset && reportDimensions?.length > 0) {
            let dimensions: ReportDimensions[] = null
            dimensions = reportDataset
                ? setDatasetMapper(reportDataset.dimensions, reportDimensions)
                : []
            setReportSelectDimensions(dimensions)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportDataset, reportDimensions])

    useEffect(() => {
        if (reportDataset && reportMeasures?.length > 0) {
            let measures: ReportMeasures[] = null
            measures = reportDataset ? setDatasetMapper(reportDataset.measures, reportMeasures) : []
            setReportSelectMeasures(measures)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportDataset, reportMeasures])

    useEffect(() => {
        setIsLoading(isQlikMasterItemLoading)
    }, [isQlikMasterItemLoading])

    const handleChange = async event => {
        let dimensions,
            measures,
            filters = []
        setReportIsLoading(true)

        const sDataset = datasets?.find(item => event.target.value === item.id)
        if (sDataset) {
            const mDimensions = qMasterDimensionsMap.get(sDataset.qlikAppId) || []
            const mMeasures = qMasterMeasuresMap.get(sDataset.qlikAppId) || []
            if (mDimensions && mDimensions?.length > 0) {
                dimensions = setDatasetMapper(sDataset.dimensions, mDimensions)
                filters = setDatasetMapper(sDataset.filters, mDimensions, false)
            }
            if (mMeasures && mMeasures?.length > 0) {
                measures = setDatasetMapper(sDataset.measures, mMeasures)
            }

            const visualizations = sDataset?.visualizations || []
            const qlikAppId = sDataset?.qlikAppId

            if (
                (dimensions?.length > 0 || measures?.length > 0 || filters?.length > 0) &&
                qlikAppId
            ) {
                onDatasetChangeHandler(
                    sDataset,
                    dimensions,
                    measures,
                    filters,
                    visualizations,
                    qlikAppId
                )
            } else {
                showToast(t(translation.reportingDatasetErrorMsg), AlertType.ERROR)
            }
        } else {
            onDatasetChangeHandler(null, [], [], [], [], '')
        }

        if (sDataset) {
            const qApp = qAppMap.get(sDataset.qlikAppId)
            setDataset(sDataset)
            qApp?.qApi?.clearAll()
        }
    }

    const { classes } = useStyles()
    const isReportDesigned = !isLoading

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="view-select-outlined-label" className={classes.inputLabel}>
                {t(translation.reportingDatasetTitle)}
            </InputLabel>
            <Select
                variant="standard"
                labelId="view-select-outlined-label"
                id="view-select-outlined"
                value={isLoading ? 'SYS' : dataset?.id ? String(dataset.id) : 'SYS'}
                key={isLoading ? 'SYS' : dataset?.id ? String(dataset.id) : 'SYS'}
                onChange={handleChange}
                label="Dataset"
                className={classes.select}
                disableUnderline={true}
                disabled={!isEnabled}>
                <MenuItem value={'SYS'} className={classes.menuItem} disabled={!isEnabled}>
                    <em>
                        {isReportDesigned
                            ? t(translation.reportingDatasetSelectNone)
                            : t(translation.reportingDatasetSelectLoading)}
                    </em>
                </MenuItem>
                {isReportDesigned &&
                    datasets?.map((item, i) => (
                        <MenuItem
                            value={item.id}
                            className={classes.menuItem}
                            key={i}
                            disabled={!isEnabled}>
                            {item.title}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    )
}

export default QlikReportingDatasetSelect

const useStyles = makeStyles()((theme: Theme) => ({
    formControl: {
        width: '100%',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        height: '44px',
        marginRight: '64px',
        marginBottom: '4px'
    },
    inputLabel: {
        transform: 'translate(14px, 18px) scale(1)',
        border: '0px solid',
        textAlign: 'left',
        height: '30px',
        marginTop: '-15px',
        marginLeft: '-5px',
        fontSize: '12px',
        color: theme.palette.text.secondary
    },
    select: {
        textAlign: 'left',
        height: '30px',
        fontSize: '15px',
        fontWeight: 500,
        paddingLeft: '10px'
    },
    menuItem: {
        height: '30px'
    }
}))
