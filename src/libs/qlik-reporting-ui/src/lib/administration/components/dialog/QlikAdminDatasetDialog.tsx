import React, { FC, useCallback, useEffect, useState } from 'react'

import {
    Box,
    Button,
    CircularProgress,
    Container,
    DialogActions,
    DialogContent,
    Paper,
    Theme
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { AlertDuration, AlertType, DraggableDialog, useAlertContext } from '@libs/common-ui'
import { ReportVisualizations } from '@libs/core-models'
import { QMasterDimension, QMasterMeasure, QMasterVisualization } from '@libs/qlik-models'
import { useQlikMasterItemContext } from '@libs/qlik-providers'

import { useQlikReportingContext } from '../../../..'
import translation from '../../constants/translations'
import QliDatasetChartOptions from '../../options/QlikDatasetChartOptions'
import QlikDatasetMasterItemOptions from '../../options/QlikDatasetMasterItemOptions'
import QlikDatasetForm from '../form/QlikDatasetForm'
import QlikDataSourceSelect from '../select/QlikDataSourceSelect'
import QlikDatasetStepper from '../stepper/QlikDatasetStepper'

export type TQlikDatasetClasses = {
    buttonSave: string
    buttonCancel: string
}

export type QlikDatasetProps = {
    qlikAppId: string
    title: string
    description?: string
    label?: string
    tags?: any[]
    dimensions?: any[]
    measures?: any[]
    visualizations?: any[]
    filters?: any[]
}

interface QlikAdminDatasetDialogProps {
    classNames?: TQlikDatasetClasses
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    editData?: QlikDatasetProps
    editDatasetId?: number
    isDisabled?: boolean
    open?: boolean
    op: string
    closeModal(): void
    onCreateNewDataset(): void
}

const initialNewDataSet: QlikDatasetProps = {
    qlikAppId: '',
    title: '',
    description: '',
    label: '',
    tags: [],
    dimensions: [],
    measures: [],
    visualizations: [],
    filters: []
}

const QlikAdminDatasetDialog: FC<QlikAdminDatasetDialogProps> = ({
    classNames,
    open,
    editData,
    editDatasetId,
    op,
    color = 'secondary',
    onCreateNewDataset,
    closeModal
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [measures, setMeasures] = useState<QMasterMeasure[]>([])
    const [dimensions, setDimensions] = useState<QMasterDimension[]>([])
    const [visualizations, setVisualizations] = useState<QMasterVisualization[]>([])
    const [qlikAppId, setQlikAppId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [step, setStep] = useState<number>(1)
    const [dataset, setDataset] = useState<any>(initialNewDataSet)
    const hasVisualizations = dataset?.visualizations?.length > 0

    const { classes } = useStyles()
    const { t } = useI18n()
    const { showToast } = useAlertContext()

    const { createDataset, updateDataset } = useQlikReportingContext()
    const { qMasterDimensionsMap, qMasterMeasuresMap, qMasterVisualizationsMap } =
        useQlikMasterItemContext()

    const isEmptyObject = obj => {
        return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object
    }

    const isVisualizationPayloadValid = (visualizations: any) => {
        let result = true
        const vis = visualizations?.filter(v => !v.isBaseChart)
        if (vis && vis.length > 0) {
            for (const v of vis) {
                if (isEmptyObject(v?.properties)) {
                    result = false
                    break
                }
            }
        }
        return result
    }

    useEffect(() => {
        if (qlikAppId) {
            const dims = qMasterDimensionsMap.get(qlikAppId)
            const meas = qMasterMeasuresMap.get(qlikAppId)
            const vis = qMasterVisualizationsMap.get(qlikAppId)
            if (dims?.length > 0) {
                setDimensions(dims)
            }
            if (meas?.length > 0) {
                setMeasures(meas)
            }
            if (vis?.length > 0) {
                setVisualizations(vis)
            }
        }
    }, [qMasterDimensionsMap, qMasterMeasuresMap, qMasterVisualizationsMap, qlikAppId])

    useEffect(() => {
        const dataset = JSON.parse(JSON.stringify(initialNewDataSet))
        if (op === 'edit') {
            setDataset(editData)
            setTitle(editData?.title)
            setQlikAppId(editData?.qlikAppId)
        } else {
            setDataset(dataset)
            setTitle(dataset?.title)
            setQlikAppId(dataset?.qlikAppId)
        }
    }, [editData, op])

    const valueSetterHelper = useCallback(
        (accessor: string, value: any) =>
            setDataset((prevState: any) => ({ ...prevState, [accessor]: value })),
        [setDataset]
    )

    const setQlikAppIdCallback = (value: string) => {
        setQlikAppId(value)
        valueSetterHelper('qlikAppId', value)
    }
    const setTitleCallback = (value: string) => {
        setTitle(value)
        valueSetterHelper('title', value)
    }
    const setDescriptionCallback = (value: string) => {
        valueSetterHelper('description', value)
    }
    const setLabelCallback = (value: string) => {
        valueSetterHelper('label', value)
    }
    const setTagsCallback = (value: any[]) => {
        valueSetterHelper('tags', value)
    }
    const setDimensionsCallback = (value: any[]) => {
        valueSetterHelper('dimensions', value)
    }
    const setMeasuresCallback = (value: any[]) => {
        valueSetterHelper('measures', value)
    }
    const setVisualizationsCallback = (value: ReportVisualizations[]) => {
        valueSetterHelper('visualizations', value)
    }
    const setFiltersCallback = (value: any[]) => {
        valueSetterHelper('filters', value)
    }

    const handleClose = () => {
        const dataset = JSON.parse(JSON.stringify(initialNewDataSet))
        setDataset(dataset)
        setStep(1)
        closeModal()
    }

    const handleStepChange = async () => {
        if (step === 1 && !dataset.qlikAppId) {
            return showToast('Qlik App Id is required', AlertType.ERROR, AlertDuration.VERY_LONG)
        }
        if (step === 2 && !dataset.title) {
            return showToast(
                t(translation.datasetDialogValidationErrorTitle),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        }
        if (step === 6) {
            setIsLoading(true)
            try {
                editData ? await handleUpdateNewDataset() : await handleCreateNewDataset()
            } catch (error) {
                console.log('Qplus Error', error)
            } finally {
                setIsLoading(false)
            }
            return
        }
        setDataset(dataset)
        setStep(step + 1)
    }

    const handleStepBack = () => {
        if (step === 1) {
            return
        }
        setStep(step - 1)
    }

    const handleCreateNewDataset = async () => {
        try {
            if (!isVisualizationPayloadValid(dataset?.visualizations)) {
                showToast(t(translation.datasetValidationErrorMsg), AlertType.ERROR)
                return
            }
            try {
                await createDataset(dataset)
                showToast(
                    t(translation.datasetCreateSuccessMsg),
                    AlertType.SUCCESS,
                    AlertDuration.VERY_LONG
                )
                handleClose()
                onCreateNewDataset()
            } catch (error) {
                showToast(t(translation.datasetCreateErrorMsg), AlertType.ERROR)
            }
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleUpdateNewDataset = async () => {
        try {
            if (!isVisualizationPayloadValid(dataset?.visualizations)) {
                showToast(t(translation.datasetValidationErrorMsg), AlertType.ERROR)
                return
            }
            try {
                await updateDataset(editDatasetId, dataset)
                showToast(
                    t(translation.datasetUpdateSuccessMsg),
                    AlertType.SUCCESS,
                    AlertDuration.VERY_LONG
                )
                handleClose()
                onCreateNewDataset()
            } catch (error) {
                showToast(t(translation.datasetUpdateErrorMsg), AlertType.ERROR)
            }
        } catch (error) {
            console.log('Qplus Error', error)
        }
    }

    const handleDatasetEraseCallback = () => {
        setDataset(initialNewDataSet)
        setTitle('')
    }

    const isActionEnabled = step === 1 ? !!qlikAppId : step === 2 ? !!title : true
    const isDatasetDesigned =
        (dataset?.qlikAppId &&
            dataset?.title &&
            (dataset?.dimensions?.length > 0 ||
                dataset?.measures?.length > 0 ||
                dataset?.filters?.length > 0)) ||
        dataset?.visualizations.length > 0

    return (
        open && (
            <DraggableDialog
                dialogProps={{ maxWidth: 'lg' }}
                dismissDialogCallback={handleClose}
                closeTooltipText={t('qplus-dialog-close')}
                hideBackdrop={false}
                title={
                    !editDatasetId
                        ? t(translation.datasetDialogCreateNewDataset)
                        : t(translation.datasetEditDialogTitle)
                }>
                <DialogContent className={classes.dialogContent}>
                    <Container className={classes.container}>
                        <Paper elevation={0} className={classes.root}>
                            <>
                                <QlikDatasetStepper step={step} />
                                {step === 1 ? (
                                    <Box>
                                        <QlikDataSourceSelect
                                            isDatasetDesigned={isDatasetDesigned}
                                            handleDatasetEraseCallback={handleDatasetEraseCallback}
                                            setQlikAppIdCallback={setQlikAppIdCallback}
                                            newDatasetQlikAppId={dataset.qlikAppId}
                                        />{' '}
                                    </Box>
                                ) : null}
                                {step === 2 ? (
                                    <QlikDatasetForm
                                        setTitleCallback={setTitleCallback}
                                        setDescriptionCallback={setDescriptionCallback}
                                        setLabelCallback={setLabelCallback}
                                        setTagsCallback={setTagsCallback}
                                        newDatasetTitle={dataset.title}
                                        newDatasetDescription={dataset.description}
                                        newDatasetLabel={dataset.label}
                                        newDatasetTags={dataset.tags}
                                    />
                                ) : null}
                                {step === 3 ? (
                                    <QlikDatasetMasterItemOptions
                                        data={dimensions}
                                        type="Dimensions"
                                        setDimensionsCallback={setDimensionsCallback}
                                        newDatasetDimensions={dataset.dimensions}
                                    />
                                ) : null}
                                {step === 4 ? (
                                    <QlikDatasetMasterItemOptions
                                        data={measures}
                                        type="Measures"
                                        setMeasuresCallback={setMeasuresCallback}
                                        newDatasetMeasures={dataset.measures}
                                    />
                                ) : null}
                                {step === 5 ? (
                                    <QlikDatasetMasterItemOptions
                                        data={dimensions}
                                        type="Filters"
                                        setFiltersCallback={setFiltersCallback}
                                        newDatasetFilters={dataset.filters}
                                    />
                                ) : null}
                                {step === 6 ? (
                                    <QliDatasetChartOptions
                                        datasetId={editDatasetId || 0}
                                        qlikAppId={dataset?.qlikAppId}
                                        setVisualizationsCallback={setVisualizationsCallback}
                                        visualizations={dataset?.visualizations || []}
                                        masterVisualizations={visualizations}
                                        selectedDimensions={dataset?.dimensions || []}
                                        selectedMeasures={dataset?.measures || []}
                                        color={color}
                                    />
                                ) : null}
                            </>
                        </Paper>
                    </Container>
                </DialogContent>

                <DialogActions>
                    {step !== 1 ? (
                        <Button
                            onClick={!isLoading ? handleStepBack : null}
                            className={`${classes.buttonCancel} ${classNames?.buttonCancel || ''}`}
                            disabled={isLoading}>
                            {t(translation.datasetDialogButtonPrevious)}
                        </Button>
                    ) : null}
                    <Button
                        onClick={
                            !isLoading && (step === 6 ? hasVisualizations : isActionEnabled)
                                ? handleStepChange
                                : null
                        }
                        disabled={isLoading || (step === 6 ? !hasVisualizations : !isActionEnabled)}
                        className={
                            isLoading || (step === 6 ? !hasVisualizations : !isActionEnabled)
                                ? classes.buttonDisabled
                                : `${classes.buttonSave} ${classNames?.buttonSave || ''}`
                        }>
                        {isLoading ? (
                            <CircularProgress
                                color={color}
                                size={16}
                                className={classes.buttonProgress}
                            />
                        ) : step !== 6 ? (
                            t(translation.datasetDialogButtonNext)
                        ) : (
                            t(translation.datasetDialogButtonSave)
                        )}
                    </Button>
                </DialogActions>
            </DraggableDialog>
        )
    )
}

export default QlikAdminDatasetDialog

const useStyles = makeStyles()((theme: Theme & any) => ({
    buttonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: '#FFF',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:disabled': {
            backgroundColor: theme.palette.grey,
            color: '#FFF',
            boxShadow: 'none'
        }
    },
    buttonDisabled: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${theme.palette.text.disabled}`,
        color: theme.palette.text.disabled,
        textTransform: 'none'
    },
    buttonProgress: {
        color: theme.palette.secondary.main
    },
    paper: {
        width: '850px',
        height: '800px',
        minWidth: '850px',
        minHeight: '800px',
        padding: '0px',
        zIndex: 1019
    },
    dialogTitle: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: 0,
        top: '5px',
        color: theme.palette.primary.contrastText
    },
    toolbarCloseIcon: {
        position: 'absolute',
        right: '8px',
        top: '5px',
        color: theme.palette.primary.contrastText,
        cursor: 'pointer'
    },
    root: {
        flexGrow: 1,
        width: '100%',
        minHeight: '520px',
        overflow: 'hidden'
    },
    buttonCancel: {
        marginRight: '20px',
        paddingLeft: '25px',
        paddingRight: '25px',
        minWidth: '96px',
        height: '36px',
        borderRadius: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        }
    },
    dialogTitleContainer: {
        backgroundColor: theme.palette.background.paper,
        padding: '4px'
    },
    dialogTitleBox: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1
    },
    dialogContent: {
        padding: '0px',
        flex: '0.95 1'
    },
    container: {
        padding: '0px'
    }
}))
