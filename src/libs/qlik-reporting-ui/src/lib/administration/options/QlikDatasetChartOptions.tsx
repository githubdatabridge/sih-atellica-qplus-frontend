import React, { FC, useState, useCallback, useEffect } from 'react'

import { Box, Typography, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { BaseAutoComplete, IAutoCompleteData } from '@libs/common-ui'
import { ReportVisualizations, ReportDimensions, ReportMeasures } from '@libs/core-models'
import { QMasterVisualization } from '@libs/qlik-models'
import { useQlikAppContext, useQlikSheetContext } from '@libs/qlik-providers'

import { REPORTING_BASE_CHARTS } from '../../constants/constants'
import { QlikEmptyViewerContainer } from '../components/container/QlikEmptyViewerContainer'
import { QlikJsonViewer } from '../components/input/QlikJsonViewer'
import { QlikBaseChartList } from '../components/list/QlikBaseChartList'
import { QlikReadyChartList } from '../components/list/QlikReadyChartList'
import translation from '../constants/translations'
import { QlikReadyChartOperationEnum, JsonViewerEnum, TQlikReadyChart } from '../model'

export interface IQliDatasetChartOptionsProps {
    id?: number
    qlikAppId?: string
    datasetId: number
    charts?: string[]
    visualizations?: ReportVisualizations[]
    masterVisualizations: QMasterVisualization[]
    selectedDimensions: ReportDimensions[]
    selectedMeasures: ReportMeasures[]
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    setVisualizationsCallback?(value: any[]): void
}

interface IQlikSheetsData extends IAutoCompleteData {
    cells?: any[]
}

interface IQlikSheetsObjectData extends IAutoCompleteData {
    properties?: any
}

const QliDatasetChartOptions: FC<IQliDatasetChartOptionsProps> = React.memo(
    ({
        datasetId = 0,
        charts = REPORTING_BASE_CHARTS,
        qlikAppId,
        visualizations,
        masterVisualizations,
        selectedDimensions,
        selectedMeasures,
        color,
        setVisualizationsCallback
    }) => {
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const [currentQlikAppid, setCurrentQlikAppId] = useState<string>(qlikAppId)
        const [timeInMilliseconds, setTimeInMilliseconds] = useState<number>(new Date().valueOf())
        const [isReadyChartSelected, setIsReadyChartSelected] = useState<boolean>(false)
        const [baseCharts, setBaseCharts] = useState<string[]>([])
        const [selectedReadyChart, setSelectedReadyChart] = useState<string>('')
        const [selectedReadyChartProperties, setSelectedReadyChartProperties] =
            useState<string>('{}')
        const [oldReadyChartProperties, setOldReadyChartProperties] = useState<string>('{}')
        const [viewer, setViewer] = useState<JsonViewerEnum>(JsonViewerEnum.CODE)
        const [oldReadyChartsMap, setOldReadyChartsMap] = React.useState<Map<string, any>>(
            new Map<string, any>()
        )
        const [readyChartsMap, setReadyChartsMap] = React.useState<Map<string, TQlikReadyChart>>(
            new Map<string, TQlikReadyChart>()
        )
        const [qlikSheetId, setQlikSheetId] = useState<string>('')
        const [qlikSheets, setQlikSheets] = useState<IQlikSheetsData[]>([])
        const [qlikObjects, setQlikObjects] = useState<IQlikSheetsObjectData[]>([])
        const [isSheetsLoading] = useState<boolean>(false)
        const [isObjectsLoading, setIsObjectsLoading] = useState<boolean>(false)
        const [timeInMillisecondsProperties, setTimeInMillisecondsProperties] = useState<number>(0)
        const [timeInMillisecondsAutocompleteSheet, setTimeInMillisecondsAutocompleteSheet] =
            useState<number>(0)
        const [timeInMillisecondsAutocompleteObject, setTimeInMillisecondsAutocompleteObject] =
            useState<number>(0)
        const { qAppMap } = useQlikAppContext()
        const { qSheetMap } = useQlikSheetContext()

        const { t } = useI18n()

        const mergeCharts = useCallback(
            (baseCharts: string[], readyCharts: Map<string, TQlikReadyChart>) => {
                const charts: ReportVisualizations[] = []
                for (const base of baseCharts) {
                    charts.push({
                        name: base,
                        isBaseChart: true,
                        properties: {}
                    })
                }
                for (const [key, value] of readyCharts) {
                    if (datasetId > 0) {
                        charts.push({
                            name: value.name,
                            isBaseChart: false,
                            properties: value.properties || {},
                            mark: value.mark,
                            markParam: value.markParam
                        })
                    } else {
                        charts.push({
                            name: key,
                            isBaseChart: false,
                            properties: value.properties || {}
                        })
                    }
                }
                if (setVisualizationsCallback) setVisualizationsCallback(charts)
            },
            []
        )

        const truncateStringHelper = (str, n) => {
            return str.length > n ? str.slice(0, n - 1) + '...' : str
        }

        useEffect(() => {
            setIsLoading(true)
            const sheets: IQlikSheetsData[] = []
            if (qlikAppId) {
                const qSheets = qSheetMap.get(qlikAppId)
                for (const qSheet of qSheets) {
                    sheets.push({
                        cells: qSheet.cells,
                        entry: {
                            key: qSheet.id,
                            value: qSheet.title
                        }
                    })
                }
                setQlikSheets(sheets)
                setIsLoading(false)
                setCurrentQlikAppId(qlikAppId)
            }
        }, [qSheetMap, qlikAppId])

        useEffect(() => {
            if (visualizations && visualizations.length > 0) {
                const baseChartsArray: string[] = []
                const readyChartsArray: string[] = []
                const readyChartsMapArray: Map<string, TQlikReadyChart> = new Map<
                    string,
                    TQlikReadyChart
                >()
                for (const visualization of visualizations) {
                    if (visualization.isBaseChart) {
                        baseChartsArray.push(visualization.name)
                    } else {
                        const readyChart =
                            datasetId > 0
                                ? {
                                      name:
                                          visualization?.mark ===
                                          QlikReadyChartOperationEnum.CHANGE_NAME
                                              ? visualization.markParam
                                              : visualization.name,
                                      properties: visualization.properties,
                                      mark:
                                          visualization?.mark === QlikReadyChartOperationEnum.CREATE
                                              ? QlikReadyChartOperationEnum.CREATE
                                              : visualization?.mark ===
                                                QlikReadyChartOperationEnum.REMOVE
                                              ? QlikReadyChartOperationEnum.REMOVE
                                              : visualization?.mark ===
                                                QlikReadyChartOperationEnum.CHANGE_NAME
                                              ? QlikReadyChartOperationEnum.CHANGE_NAME
                                              : QlikReadyChartOperationEnum.NONE,
                                      ...(visualization?.markParam && {
                                          markParam: visualization.markParam
                                      })
                                  }
                                : {
                                      name: visualization.name,
                                      properties: visualization.properties
                                  }

                        readyChartsArray.push(visualization.name)
                        readyChartsMapArray.set(visualization.name, readyChart)
                    }
                }
                setBaseCharts(baseChartsArray)
                setReadyChartsMap(readyChartsMapArray)
                setOldReadyChartsMap(readyChartsMapArray)
                mergeCharts(baseChartsArray, readyChartsMapArray)
            }
        }, [])

        useEffect(() => {
            ;(async () => {
                try {
                    setIsObjectsLoading(true)
                    if (qlikSheetId) {
                        for (const sheet of qlikSheets.filter(s => s.entry.key === qlikSheetId)) {
                            const vObjects: IQlikSheetsObjectData[] = []
                            for (const cell of sheet.cells) {
                                if (REPORTING_BASE_CHARTS.includes(cell.type)) {
                                    const qApp = qAppMap.get(currentQlikAppid)
                                    try {
                                        const obj = await qApp?.qApi?.getObjectProperties(cell.id)
                                        const layout = await obj?.getLayout()
                                        const id = layout?.qInfo?.qId
                                        const propTree = await obj?.getFullPropertyTree()
                                        const properties = propTree?.qProperty
                                        let title = ''
                                        if (properties?.qExtendsId) {
                                            const viz = masterVisualizations?.find(v => {
                                                return v.qLibraryId === properties.qExtendsId
                                            })
                                            title = viz.title
                                        } else {
                                            title = layout.title
                                        }
                                        vObjects.push({
                                            title: cell.type,
                                            entry: {
                                                key: id,
                                                value:
                                                    truncateStringHelper(title, 100) ||
                                                    `N/A - (${id})`
                                            },
                                            properties: properties
                                        })
                                    } catch (error) {
                                        console.log('Qplus Error', error)
                                    }
                                }
                            }
                            setQlikObjects(vObjects)
                            setIsObjectsLoading(false)
                        }
                    }
                } catch (error) {
                    console.log('Qplus Error', error)
                }
            })()

            return () => {
                // this now gets called when the component unmounts
            }
        }, [masterVisualizations, qlikSheetId, qlikSheets, qAppMap, currentQlikAppid])

        useEffect(() => {
            if (selectedReadyChart && selectedReadyChartProperties) {
                const updatedMap = new Map(readyChartsMap)
                const value = updatedMap.get(selectedReadyChart)
                updatedMap.set(selectedReadyChart, {
                    name: value.name,
                    properties: JSON.parse(selectedReadyChartProperties),
                    mark:
                        value?.mark === QlikReadyChartOperationEnum.CREATE
                            ? QlikReadyChartOperationEnum.CREATE
                            : value?.mark === QlikReadyChartOperationEnum.REMOVE
                            ? QlikReadyChartOperationEnum.REMOVE
                            : value?.mark === QlikReadyChartOperationEnum.CHANGE_NAME
                            ? QlikReadyChartOperationEnum.CHANGE_NAME
                            : QlikReadyChartOperationEnum.NONE,
                    ...(value?.markParam && {
                        markParam: value.markParam
                    })
                })
                setReadyChartsMap(updatedMap)
                mergeCharts(baseCharts, updatedMap)
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedReadyChartProperties])

        const handleBaseChartToggleCallback = useCallback(
            (charts: string[]) => {
                setIsReadyChartSelected(false)
                setSelectedReadyChart('')
                setBaseCharts(charts)
                mergeCharts(charts, readyChartsMap)
            },
            [mergeCharts, readyChartsMap]
        )

        const handleReadyChartsCallback = useCallback(
            (
                viewer = JsonViewerEnum.CODE,
                readyChartsMap: Map<string, TQlikReadyChart>,
                value: string,
                properties: any,
                isDeleted = false
            ) => {
                const oldProperties = oldReadyChartsMap.get(value) || {}
                setViewer(viewer)
                setSelectedReadyChart(value)
                setSelectedReadyChartProperties(properties)
                setOldReadyChartProperties(oldProperties)
                setReadyChartsMap(readyChartsMap)
                setTimeInMilliseconds(new Date().valueOf())
                setTimeInMillisecondsAutocompleteSheet(new Date().valueOf())
                setTimeInMillisecondsAutocompleteObject(new Date().valueOf())
                mergeCharts(baseCharts, readyChartsMap)
                setIsReadyChartSelected(!isDeleted)
            },
            [baseCharts, mergeCharts, oldReadyChartsMap]
        )

        const handleViewerInputChangeCallback = useCallback((properties: any) => {
            setSelectedReadyChartProperties(JSON.stringify(properties))
            setTimeInMillisecondsAutocompleteSheet(new Date().valueOf())
            setTimeInMillisecondsAutocompleteObject(new Date().valueOf())
        }, [])

        const handleAutocompleteQlikSheetsChange = useCallback((value: any) => {
            setQlikSheetId(value?.entry?.key || '')
            setTimeInMillisecondsAutocompleteObject(new Date().valueOf())
        }, [])

        const handleAutocompleteQlikObjectsChange = useCallback((value: any) => {
            if (value?.properties) {
                // Remove qId as this can lead to wrong behaviour when using the Qlik Visualizaton Api to render a chart
                value.properties.qInfo.qPlus =
                    value?.properties?.qInfo?.qId || value?.properties?.qExtendsId || ''
                value.properties.qInfo.qTimestamp = new Date().valueOf()
                delete value?.properties?.qInfo?.qId
                setTimeInMillisecondsProperties(new Date().valueOf())
                setSelectedReadyChartProperties(JSON.stringify(value?.properties))
            }
        }, [])

        const { classes } = useStyles()

        if (isLoading) return null

        return (
            <Box className={classes.root}>
                {/* left container */}
                <Box className={classes.containerLeft}>
                    <QlikBaseChartList
                        charts={charts}
                        checkedCharts={baseCharts}
                        handleBaseChartsCallback={handleBaseChartToggleCallback}
                        selectedDimensions={selectedDimensions}
                        selectedMeasures={selectedMeasures}
                    />
                    <Box mt={2} width="100%">
                        <QlikReadyChartList
                            datasetId={datasetId}
                            chartsMap={readyChartsMap}
                            selectedChart={selectedReadyChart}
                            color={color}
                            handleReadyChartsCallback={handleReadyChartsCallback}
                        />
                    </Box>
                </Box>

                {/* right container */}
                <Box className={classes.containerRight}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                            paddingTop: '6px',
                            paddingBottom: '6px',
                            paddingRight: '10px',
                            width: '100%'
                        }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="left">
                            <Typography className={classes.primaryText}>
                                {t(translation.datasetReadyChartAdvancedProperties)}
                            </Typography>
                        </Box>
                        <Box flexGrow={1} textAlign="right">
                            <BaseAutoComplete
                                reInitializeInMilliseconds={timeInMillisecondsAutocompleteSheet}
                                isLoadingData={isSheetsLoading}
                                label={t(translation.datasetReadyChartPickSheet)}
                                inlineLabel={false}
                                options={qlikSheets}
                                width={300}
                                size="small"
                                handleChangeCallback={handleAutocompleteQlikSheetsChange}
                                disabled={!isReadyChartSelected}
                                classNames={{
                                    root: classes.autoCompleteRoot,
                                    listbox: classes.autoCompleteListbox
                                }}
                            />
                        </Box>
                        <Box flexGrow={1} textAlign="right">
                            <BaseAutoComplete
                                reInitializeInMilliseconds={timeInMillisecondsAutocompleteObject}
                                isLoadingData={isObjectsLoading}
                                label={t(translation.datasetReadyChartPickObject)}
                                inlineLabel={false}
                                options={qlikObjects}
                                width={200}
                                size="small"
                                withIcon={false}
                                handleChangeCallback={handleAutocompleteQlikObjectsChange}
                                disabled={
                                    !isReadyChartSelected ||
                                    !qlikSheetId ||
                                    qlikObjects.length === 0
                                }
                                classNames={{
                                    root: classes.autoCompleteRoot,
                                    listbox: classes.autoCompleteListbox
                                }}
                            />
                        </Box>
                    </Box>
                    {isReadyChartSelected ? (
                        <QlikJsonViewer
                            id={timeInMilliseconds}
                            qlikAppId={currentQlikAppid}
                            updatePropertiesInMilliseconds={timeInMillisecondsProperties}
                            chart={selectedReadyChart}
                            chartProperties={selectedReadyChartProperties}
                            oldChartProperties={oldReadyChartProperties}
                            currentView={viewer}
                            handleViewerInputChangeCallback={handleViewerInputChangeCallback}
                        />
                    ) : (
                        <QlikEmptyViewerContainer />
                    )}
                </Box>
            </Box>
        )
    }
)

export default QliDatasetChartOptions

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        marginTop: '10px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '380px'
    },
    containerLeft: {
        display: 'flex',
        flex: 0.35,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxHeight: '-webkit-fill-available',
        minWidth: '350px'
    },
    containerRight: {
        display: 'flex',
        marginLeft: '20px',
        flex: 0.65,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxHeight: '-webkit-fill-available'
    },
    primaryText: {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: '14px'
    },
    checked: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: `${theme.palette.secondary.contrastText} !important`
    },
    autoCompleteRoot: {
        height: '25px',
        marginTop: '-8px'
    },
    autoCompleteListbox: {
        fontSize: '0.8rem',
        padding: 0
    }
}))
