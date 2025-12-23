import React, { FC, useEffect, useRef, useState } from 'react'

import { Tabs, Theme, styled } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useBaseUiContext } from '@libs/common-providers'
import { QSelection } from '@libs/qlik-models'
import { useQlikAppContext, useQlikSelectionContext } from '@libs/qlik-providers'

import { TQlikSelectionBarSelectedClasses } from '../../QlikSelectionBarSelected'
import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionField from '../chip/QlikSelectionField'

interface IQlikSelectionListSelectedProps {
    cssChipSelected?: any
    cssTabs?: any
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    isVertical?: boolean
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
    classNames?: TQlikSelectionBarSelectedClasses
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

const QlikSelectionListSelected: FC<IQlikSelectionListSelectedProps> = ({
    cssChipSelected,
    cssTabs,
    color,
    isVertical,
    showSelectedValues = true,
    showAppWaterMark = false,
    tooltipOptions,
    classNames
}) => {
    const { classes } = useStyles()
    const targetRef = useRef<any>()
    const [qlikSelectionValues, setQlikSelectionValues] = useState<QSelection[]>([])
    const [qlikSelectionCounter, setQlikSelectionCounter] = useState<number>(0)
    const { qlikSelectionBarWidth } = useBaseUiContext()
    const [, setTabWidth] = useState<string>('')
    const { qIsAppMapLoading } = useQlikAppContext()
    const { qIsSelectionMapLoading, qSelectionMap } = useQlikSelectionContext()

    useEffect(() => {
        setTabWidth(qlikSelectionBarWidth)
    }, [setTabWidth, qlikSelectionBarWidth])

    useEffect(() => {
        if (!qIsAppMapLoading && !qIsSelectionMapLoading) {
            const values = Array.from(qSelectionMap.values())
            setQlikSelectionValues(values)
            let count = 0
            for (const [, value] of qSelectionMap) {
                count = count + (value?.qSelectionCount || 0)
                setQlikSelectionCounter(count)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qIsSelectionMapLoading, qIsAppMapLoading, qSelectionMap])

    if (
        qIsAppMapLoading ||
        qIsSelectionMapLoading ||
        qlikSelectionValues.length === 0 ||
        qlikSelectionCounter === 0
    )
        return null

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
            style={cssTabs ? cssTabs : !isVertical ? { width: qlikSelectionBarWidth } : {}}
            value={false}
            ref={targetRef}
            onChange={() => undefined}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            {qlikSelectionValues?.map((selection, index) => {
                return selection?.qSelections?.map((s, i) => {
                    const fieldName =
                        s.fieldName.length && s.fieldName[0] === '='
                            ? s.fieldName.slice(1)
                            : s.fieldName

                    return (
                        <QlikSelectionField
                            isVertical={isVertical}
                            showSelectedValues={showSelectedValues}
                            showAppWaterMark={showAppWaterMark}
                            key={`${fieldName}_${index}_${i}_selected`}
                            qlikAppId={selection.qAppId}
                            fieldName={s.fieldName}
                            docked={false}
                            locked={s.locked}
                            qSelected={s.qSelected}
                            selectedCount={s.selectedCount}
                            dockedFields={selection.qDockedFields}
                            cssChipSelected={cssChipSelected}
                            color={color}
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
                    )
                })
            })}
        </CustomTabs>
    )
}

export default React.memo(QlikSelectionListSelected)
