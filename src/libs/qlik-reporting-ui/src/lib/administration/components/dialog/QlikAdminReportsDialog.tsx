import { Link } from 'react-router-dom'

import { Box, Container, DialogContent, Grid, Button, Paper, Theme, useTheme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip, renderVizType } from '@libs/common-ui'
import { reportService } from '@libs/core-services'
import {
    ColumnTypeEnum,
    DataGridApiTable,
    DataTypesEnum,
    OrderByDirectionEnum
} from '@libs/data-grid-ui'

import translations from '../../constants/translations'
import { useTableStyles } from '../../hooks/index'

type TQlikAdminReportsDialogClasses = {
    buttonOpenReport: string
    tableReportHeader: string
    tableReportCell: string
}

interface IQlikAdminReportsDialogProps {
    dismissDialogCallback: () => void
    datasetId: number
    classNames?: Partial<TQlikAdminReportsDialogClasses>
}

const QlikAdminReportsDialog = ({
    datasetId,
    classNames,
    dismissDialogCallback
}: IQlikAdminReportsDialogProps) => {
    const { t } = useI18n()
    const { classes } = useStyles()
    const theme = useTheme()
    const { classesTable } = useTableStyles()

    const tableData = {
        crud: {
            read: reportService.getParamReports
        },
        customActions: [],
        columns: [
            {
                accessor: 'id',
                label: 'Dataset Id',
                isKey: true,
                columnType: ColumnTypeEnum.CRUD,
                sortable: false,
                visible: false,
                width: '10%'
            },
            {
                accessor: 'visualizationType',
                label: t(translations.datasetReportDialogTableColumnType),
                columnType: ColumnTypeEnum.CRUD,
                dataType: DataTypesEnum.STRING,
                visible: true,
                width: '6%'
            },
            {
                accessor: 'title',
                label: t(translations.datasetReportDialogTableColumnTitle),
                columnType: ColumnTypeEnum.CRUD,
                dataType: DataTypesEnum.STRING,
                visible: true,
                searchable: true,
                sortable: true,
                width: '35%'
            },
            {
                accessor: 'description',
                label: t(translations.datasetReportDialogTableColumnDescription),
                columnType: ColumnTypeEnum.CRUD,
                dataType: DataTypesEnum.STRING,
                visible: true,
                width: '40%'
            },

            {
                accessor: 'reportLink',
                label: t(translations.datasetReportDialogTableColumnLink),
                columnType: ColumnTypeEnum.CRUD,
                dataType: DataTypesEnum.STRING,
                visible: true,
                width: '12%'
            }
        ],
        components: {
            visualizationType: (v: string) => (
                <span style={{ paddingLeft: '5px' }}>
                    <IconTooltip title={v}>
                        {renderVizType(v, theme.palette.text.primary)}
                    </IconTooltip>
                </span>
            ),
            reportLink: (link: any) => (
                <Box width="100%">
                    <Button
                        component={Link}
                        to={(link || '').replace(/^\/+/, '/')}
                        size="small"
                        variant="outlined"
                        className={`${classes.iconButton} ${classNames?.buttonOpenReport || ''}`}>
                        {t(translations.datasetReportDialogOpenAction)}
                    </Button>
                </Box>
            )
        },
        defaults: {
            orderByColumn: 'createdAt',
            orderByDirection: OrderByDirectionEnum.DESC,
            filters: datasetId
                ? [
                      { accessor: 'datasetId', operator: 'eq', value: datasetId },
                      { accessor: 'templateId', operator: 'not', value: 'null' },
                      { accessor: 'isSystem', operator: 'eq', value: 'true' }
                  ]
                : undefined
        }
    }

    return (
        <DraggableDialog
            dialogProps={{ maxWidth: 'lg' }}
            dismissDialogCallback={dismissDialogCallback}
            hideBackdrop={false}
            closeTooltipText={t('qplus-dialog-close')}
            title={t(translations.datasetReportDialogTitle)}>
            <DialogContent style={{ padding: '0px' }}>
                <Container style={{ padding: '0px', width: '100%' }}>
                    <Paper className={classes.root} elevation={0}>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <DataGridApiTable
                                        isCellWithBorder={true}
                                        borderColor={theme.palette.divider}
                                        rowsPerPage={5}
                                        data={tableData}
                                        height={500}
                                        classNames={{
                                            tableCellHeader: `${classesTable.tableHeader} ${
                                                classNames?.tableReportHeader || ''
                                            }`,
                                            tableCell: `${classesTable.tableCell} ${
                                                classNames?.tableReportCell || ''
                                            }`
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Container>
            </DialogContent>
        </DraggableDialog>
    )
}

export default QlikAdminReportsDialog

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
        boxShadow: 'none'
    },
    filterContainer: {
        minHeight: '70px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '25px',
        '@media (max-width: 586px)': {
            paddingRight: '25px'
        }
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10px',
        marginRight: '10px',
        '@media (max-width: 450px)': {
            marginLeft: '0px',
            marginTop: '5px'
        }
    },
    checkboxText: {
        fontSize: '14px',
        color: theme.palette.text.primary
    },
    input: {
        marginLeft: theme.spacing(1),
        width: '100%',
        fontSize: '1rem'
    },
    iconButton: {
        width: '80px',
        height: '34px',
        cursor: 'pointer',
        marginBottom: '5px'
    }
}))
