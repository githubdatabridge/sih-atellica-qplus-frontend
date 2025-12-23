import React, { FC, useEffect, useRef, useState, useCallback } from 'react'

import { Tabs, Theme, styled } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext } from '@libs/common-providers'
import { QlikDateRangePicker, QlikSelectVariable } from '@libs/qlik-base-ui'
import { QFieldFilter, QMultiAppFields } from '@libs/qlik-models'
import { useQlikAppContext, useQlikSelectionContext } from '@libs/qlik-providers'

import { TQlikSelectionBarClasses } from '../../QlikSelectionBar'
import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionField from '../chip/QlikSelectionField'
import QlikSelectionMultiAppField from '../chip/QlikSelectionMultiAppField'

interface IQlikSelectionListProps {
    cssChipReadOnly?: any
    cssChipSelected?: any
    cssChipCalculated?: any
    cssChipDocked?: any
    cssChipFixed?: any
    cssChipGlobal?: any
    cssTabs?: any
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    lastUpdated?: any
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
    classNames?: TQlikSelectionBarClasses
}

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: {
        minHeight: 0,
        maxWidth: '95%'
    },
    vertical: {
        width: '100%',
        zIndex: 1
    },
    scrollButton: {
        color: theme.palette.text.primary
    }
}))

const CustomTabs = styled(Tabs)({
    '& .MuiTabs-scrollButtons.Mui-disabled': {
        // This ensures no space is taken and the button is not visible
        width: 0,
        height: 0,
        padding: 0,
        margin: 0,
        visibility: 'hidden'
        // you can add more styles if needed
    }
})

const QlikSelectionList: FC<IQlikSelectionListProps> = ({
    cssChipReadOnly,
    cssChipSelected,
    cssChipDocked,
    cssChipFixed,
    cssChipGlobal,
    cssTabs,
    color,
    isVertical = false,
    showSelectedValues = true,
    showAppWaterMark = false,
    tooltipOptions,
    classNames
}) => {
    const { classes } = useStyles()
    const targetRef = useRef<any>()
    const { qlikSelectionBarWidth } = useBaseUiContext()
    const [, setTabWidth] = useState<string>('')
    const [selectedArray, setSelectedArray] = useState<any[]>([])
    const [dockedFieldsArray, setDockedFieldsArray] = useState<QFieldFilter[]>([])
    const [dockedSelectedArray, setDockedSelectedArray] = useState<QFieldFilter[]>([])
    const [multiAppFieldArray, setMultiAppFieldArray] = useState<QMultiAppFields[]>([])
    const { qIsAppMapLoading } = useQlikAppContext()
    const { qIsSelectionMapLoading, qGlobalDockedFields, qSelectionMap, qGlobalMultiAppFields } =
        useQlikSelectionContext()

    const cleanFieldNameHelper = useCallback(
        (fieldName: string) =>
            fieldName.length && fieldName[0] === '=' ? fieldName.slice(1) : fieldName,
        []
    )

    const findInSelections = useCallback((d: any, qlikAppId: string, selections: any[]) => {
        const dockedFieldName = d.qFieldName?.[0] === '=' ? d.qFieldName.slice(1) : d.qFieldName
        return selections?.find(x => {
            const selectionFieldName = x.fieldName?.[0] === '=' ? x.fieldName.slice(1) : x.fieldName
            return selectionFieldName === dockedFieldName && d.qAppId === qlikAppId
        })
    }, [])

    useEffect(() => setTabWidth(qlikSelectionBarWidth), [setTabWidth, qlikSelectionBarWidth])

    useEffect(() => {
        if (qIsAppMapLoading || qIsSelectionMapLoading) return

        const filteredMultiAppFields = qGlobalMultiAppFields.filter(m => !m.isHidden)

        const multiAppSelectedFields = Object.entries(qSelectionMap).flatMap(([key, value]) =>
            filteredMultiAppFields.filter(fields =>
                fields.qFields.some(field =>
                    value.qSelectedFields?.some(
                        sField => sField.fieldName === field.qFieldName && key === field.qAppId
                    )
                )
            )
        )

        const multiAppSelectedFieldsUnique = [
            ...new Map(multiAppSelectedFields.map(item => [item['key'], item])).values()
        ]

        setMultiAppFieldArray(multiAppSelectedFieldsUnique)
    }, [
        qIsAppMapLoading,
        qIsSelectionMapLoading,
        qGlobalMultiAppFields,
        findInSelections,
        qSelectionMap
    ])

    useEffect(() => {
        if (qIsAppMapLoading || qIsSelectionMapLoading) return

        const sNewSelectedArray: any[] = []
        const dSelectedArray: QFieldFilter[] = []

        for (const [key, value] of qSelectionMap) {
            if (value?.qDockedFields?.length > 0) {
                for (const d of value.qDockedFields) {
                    const s = findInSelections(d, key, value.qSelections)
                    d.selection = s ? s : undefined
                    dSelectedArray.push(d)
                }
            }
            if (value?.qSelections) {
                sNewSelectedArray.push({ value: value.qSelections, key })
            }
        }

        dSelectedArray.sort((a, b) => a?.rank - b?.rank)

        setSelectedArray(sNewSelectedArray)
        setDockedSelectedArray(dSelectedArray)
        setDockedFieldsArray(qGlobalDockedFields)
    }, [
        qIsAppMapLoading,
        qIsSelectionMapLoading,
        qGlobalDockedFields,
        qSelectionMap,
        findInSelections
    ])

    if (
        (selectedArray.length === 0 && dockedSelectedArray.length === 0) ||
        qIsAppMapLoading ||
        qIsSelectionMapLoading
    ) {
        return null
    }

    return (
        <CustomTabs
            orientation={isVertical ? 'vertical' : 'horizontal'}
            classes={{
                scrollButtons: `${classes.scrollButton} ${classNames?.tabScrollButton}`,
                root: isVertical
                    ? `${classes.vertical} ${classNames?.tabVertical}`
                    : `${classes.tabs} ${classNames?.tabHorizontal}`
            }}
            style={cssTabs || (!isVertical && { width: qlikSelectionBarWidth })}
            value={false}
            ref={targetRef}
            onChange={() => undefined}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            {multiAppFieldArray.map((m, i) => (
                <QlikSelectionMultiAppField
                    key={`${m.label}_${i}_multi_app`}
                    color={color}
                    cssChip={cssChipGlobal}
                    cssChipSelected={cssChipSelected}
                    isVertical={isVertical}
                    fields={m.qFields}
                    label={m.label}
                    softLock={m.softLock}
                    toggle={m.toggle}
                    showSelectedValues={showSelectedValues}
                    tooltipOptions={tooltipOptions}
                />
            ))}
            {dockedSelectedArray?.map((d, i) => {
                const selectionFieldName = cleanFieldNameHelper(d.qFieldName)
                const commonProps = {
                    key: `${selectionFieldName}_${i}_docked_selected_list`,
                    qlikAppId: d.qAppId,
                    showAppWaterMark
                }

                return d?.dateOptions ? (
                    <QlikDateRangePicker
                        {...commonProps}
                        height={d.dateOptions?.height}
                        width={d.dateOptions?.width}
                        css={d.dateOptions?.css}
                        cssDefinedRange={d.dateOptions?.cssDefinedRange}
                        cssIconBox={d.dateOptions?.cssIconBox}
                        cssButtonText={d.dateOptions?.cssButtonText}
                        cssIconCalendar={d.dateOptions?.cssIconCalendar}
                        fieldName={d.qFieldName}
                        dateFormat={d?.dateOptions?.dateFormat}
                        qlikDateFormat={d?.dateOptions?.qlikDateFormat}
                        labelDefault={d?.label}
                    />
                ) : d?.variableOptions ? (
                    <QlikSelectVariable {...commonProps} variableOptions={d.variableOptions} />
                ) : (
                    <QlikSelectionField
                        {...commonProps}
                        isVertical={isVertical}
                        fieldName={d.qFieldName}
                        label={d.label}
                        isFixed={d.isFixed}
                        toggle={d.toggle}
                        softLock={d.softLock}
                        infoOptions={d.infoOptions}
                        isReadOnly={d.isReadOnly}
                        showSelectedValues={showSelectedValues}
                        docked={true}
                        locked={d?.selection ? d.selection.locked : false}
                        qSelected={d?.selection ? d.selection.qSelected : ''}
                        selectedCount={d?.selection ? d.selection.selectedCount : 0}
                        dockedFields={dockedFieldsArray}
                        cssChipReadOnly={cssChipReadOnly}
                        cssChipSelected={cssChipSelected}
                        cssChipDocked={cssChipDocked}
                        cssChipFixed={cssChipFixed}
                        color={color}
                        sortCriterias={{
                            autoSort: d?.autoSort,
                            qExpression: d?.qSortCriterias?.qExpression,
                            qSortByAscii: d?.qSortCriterias?.qSortByAscii,
                            qSortByExpression: d?.qSortCriterias?.qSortByExpression,
                            qSortByFrequency: d?.qSortCriterias?.qSortByFrequency,
                            qSortByGreyness: d?.qSortCriterias?.qSortByGreyness,
                            qSortByLoadOrder: d?.qSortCriterias?.qSortByLoadOrder,
                            qSortByNumeric: d?.qSortCriterias?.qSortByNumeric,
                            qSortByState: d?.qSortCriterias?.qSortByState,
                            reverseSort: d?.reverseSort
                        }}
                        tooltipOptions={tooltipOptions}
                    />
                )
            })}

            {selectedArray?.map((v, index) =>
                v?.value
                    ?.filter(s => {
                        const selectionFieldName = cleanFieldNameHelper(s.fieldName)
                        const isInDockedArray = dockedFieldsArray?.find(
                            d =>
                                cleanFieldNameHelper(d.qFieldName) === selectionFieldName &&
                                d.qAppId === v.key
                        )

                        return !isInDockedArray
                    })
                    .map((s, i) => (
                        <QlikSelectionField
                            isVertical={isVertical}
                            key={`${cleanFieldNameHelper(s.fieldName)}_${index}_${i}_list`}
                            qlikAppId={v.key}
                            fieldName={s.fieldName}
                            docked={false}
                            locked={s.locked}
                            qSelected={s.qSelected}
                            selectedCount={s.selectedCount}
                            dockedFields={dockedFieldsArray}
                            cssChipSelected={cssChipSelected}
                            cssChipDocked={cssChipDocked}
                            color={color}
                            showSelectedValues={showSelectedValues}
                            showAppWaterMark={showAppWaterMark}
                            sortCriterias={{
                                autoSort: s?.autoSort,
                                qExpression: s?.qSortCriterias?.qExpression,
                                qSortByAscii: s?.qSortCriterias?.qSortByAscii,
                                qSortByExpression: s?.qSortCriterias?.qSortByExpression,
                                qSortByFrequency: s?.qSortCriterias?.qSortByFrequency,
                                qSortByGreyness: s?.qSortCriterias?.qSortByGreyness,
                                qSortByLoadOrder: s?.qSortCriterias?.qSortByLoadOrder,
                                qSortByNumeric: s?.qSortCriterias?.qSortByNumeric,
                                qSortByState: s?.qSortCriterias?.qSortByState,
                                reverseSort: s?.reverseSort
                            }}
                            tooltipOptions={tooltipOptions}
                            classNames={{
                                primaryText: classNames?.chipPrimaryText || '',
                                secondaryText: classNames?.chipSecondaryText || ''
                            }}
                        />
                    ))
            )}
        </CustomTabs>
    )
}

export default React.memo(QlikSelectionList)
