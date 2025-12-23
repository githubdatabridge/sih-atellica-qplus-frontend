import React, { FC, useEffect, useRef, useState } from 'react'

import { Tabs, Theme, styled } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext } from '@libs/common-providers'
import { QlikDateRangePicker, QlikSelectVariable } from '@libs/qlik-base-ui'
import { QFieldFilter } from '@libs/qlik-models'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { TQlikSelectionBarDockedClasses } from '../../QlikSelectionBarDocked'
import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionField from '../chip/QlikSelectionField'

interface IQlikSelectionListDockedProps {
    cssChipDocked?: any
    cssChipFixed?: any
    cssTabs?: any
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
    classNames?: TQlikSelectionBarDockedClasses
}

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: { minHeight: 0, maxWidth: '95%' },
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

const QlikSelectionListDocked: FC<IQlikSelectionListDockedProps> = ({
    cssChipDocked,
    cssChipFixed,
    cssTabs,
    color,
    isVertical = false,
    showSelectedValues = false,
    showAppWaterMark = false,
    tooltipOptions,
    classNames
}) => {
    const [currentDockedFilters, setCurrentDockedFilters] = useState<QFieldFilter[]>([])
    const { classes } = useStyles()
    const targetRef = useRef<any>()
    const { qlikSelectionBarWidth } = useBaseUiContext()
    const [tabWidth, setTabWidth] = useState<string>('')
    const { qGlobalDockedFields, qIsSelectionMapLoading } = useQlikSelectionContext()

    useEffect(() => {
        if (qGlobalDockedFields) {
            setCurrentDockedFilters(qGlobalDockedFields || [])
        }
    }, [qGlobalDockedFields])

    useEffect(() => {
        setTabWidth(qlikSelectionBarWidth)
    }, [setTabWidth, qlikSelectionBarWidth])

    if (qIsSelectionMapLoading || currentDockedFilters.length === 0) return null

    return (
        <CustomTabs
            orientation={isVertical ? 'vertical' : 'horizontal'}
            classes={
                isVertical
                    ? {
                          root: `${classes.vertical} ${classNames?.tabVertical}`,
                          scrollButtons: `${classes.scrollButton} ${classNames?.tabScrollButton}`
                      }
                    : {
                          root: `${classes.tabs} ${classNames?.tabHorizontal}`,
                          scrollButtons: `${classes.scrollButton} ${classNames?.tabScrollButton}`
                      }
            }
            style={cssTabs ? cssTabs : !isVertical ? { width: tabWidth } : {}}
            value={false}
            ref={targetRef}
            onChange={() => undefined}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            {currentDockedFilters?.map((d, i) => {
                const fieldName =
                    d.qFieldName.length && d.qFieldName[0] === '='
                        ? d.qFieldName.slice(1)
                        : d.qFieldName
                return d?.dateOptions ? (
                    <QlikDateRangePicker
                        key={`${fieldName}_${i}_docked`}
                        height={d.dateOptions?.height}
                        width={d.dateOptions?.width}
                        css={d.dateOptions?.css}
                        cssDefinedRange={d.dateOptions?.cssDefinedRange}
                        cssIconBox={d.dateOptions?.cssIconBox}
                        cssButtonText={d.dateOptions?.cssButtonText}
                        cssIconCalendar={d.dateOptions?.cssIconCalendar}
                        fieldName={fieldName}
                        showAppWaterMark={showAppWaterMark}
                        dateFormat={d?.dateOptions?.dateFormat}
                        qlikDateFormat={d?.dateOptions?.qlikDateFormat}
                        labelDefault={d?.label}
                        qlikAppId={d.qAppId}
                    />
                ) : d?.variableOptions ? (
                    <QlikSelectVariable
                        qlikAppId={d.qAppId}
                        variableOptions={d.variableOptions}
                        showAppWaterMark={showAppWaterMark}
                        key={`${d.variableOptions.variableName}_${i}_docked`}
                    />
                ) : (
                    <QlikSelectionField
                        isVertical={isVertical}
                        key={`${fieldName}_${i}_docked`}
                        qlikAppId={d.qAppId}
                        label={d.label}
                        fieldName={d.qFieldName}
                        isFixed={d.isFixed}
                        toggle={d.toggle}
                        softLock={d.softLock}
                        infoOptions={d.infoOptions}
                        isReadOnly={d.isReadOnly}
                        showSelectedValues={showSelectedValues}
                        showAppWaterMark={showAppWaterMark}
                        docked={true}
                        locked={false}
                        qSelected={''}
                        selectedCount={0}
                        dockedFields={qGlobalDockedFields}
                        cssChipDocked={cssChipDocked}
                        cssChipFixed={cssChipFixed}
                        color={color}
                        tooltipOptions={tooltipOptions}
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
                        classNames={{
                            primaryText: classNames?.chipPrimaryText || '',
                            secondaryText: classNames?.chipSecondaryText || ''
                        }}
                    />
                )
            })}
        </CustomTabs>
    )
}

export default React.memo(QlikSelectionListDocked)
