import React, { FC, useRef, useEffect, useState } from 'react'

import { Tabs, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useWindowDimensions } from '@libs/common-hooks'
import { ReportDataset, ReportMeasures, ReportDimensions } from '@libs/core-models'

import QlikReportingSelectionChip from '../chip/QlikReportingSelectionChip'

interface IQlikReportingSelectionTabsProps {
    reportDimensions: ReportDimensions[]
    reportMeasures: ReportMeasures[]
    reportDataset: ReportDataset
    cssTabs?: any
    cssChip?: any
    color?: string
    onRemoveItemCallbackHandler?(id: string, type: string)
}

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: { minHeight: 0, maxWidth: '100%' }
}))

const QlikReportingSelectionTabs: FC<IQlikReportingSelectionTabsProps> = ({
    reportDimensions,
    reportMeasures,
    reportDataset,
    onRemoveItemCallbackHandler,
    cssChip,
    cssTabs
}) => {
    const { classes } = useStyles()
    const targetRef = useRef<any>()
    const { width } = useWindowDimensions()
    const [containerWidth, setContainerWidth] = useState<number>(width)

    useEffect(() => {
        setContainerWidth(width - 700)
    }, [width])

    if (reportDimensions.length === 0 && reportMeasures.length === 0 && !reportDataset) return null

    const onRemoveItemClickHandler = (id: string, type: string) => {
        if (onRemoveItemCallbackHandler) onRemoveItemCallbackHandler(id, type)
    }

    return (
        <Tabs
            classes={{ root: classes.tabs }}
            sx={{
                width: `${containerWidth}px`,
                maxWidth: '1130px',
                marginLeft: '0px',
                paddingTop: '8px',
                ...cssTabs
            }}
            value={false}
            ref={targetRef}
            onChange={() => undefined}
            variant="scrollable"
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            {reportDataset ? (
                <QlikReportingSelectionChip
                    id={String(reportDataset.id)}
                    type={'DS'}
                    item={reportDataset.title}
                    color={reportDataset.color}
                    key={reportDataset.id}
                    onRemoveChipHandler={onRemoveItemClickHandler}
                />
            ) : null}
            {reportDimensions?.map(d => {
                return (
                    <QlikReportingSelectionChip
                        id={d.qLibraryId}
                        type={'D'}
                        item={d.label}
                        color={d.color}
                        key={d.qLibraryId}
                        cssChip={cssChip}
                        onRemoveChipHandler={onRemoveItemClickHandler}
                    />
                )
            })}
            {reportMeasures.map(m => {
                return (
                    <QlikReportingSelectionChip
                        id={m.qLibraryId}
                        type={'M'}
                        item={m.label}
                        color={m.color}
                        key={m.qLibraryId}
                        cssChip={cssChip}
                        onRemoveChipHandler={onRemoveItemClickHandler}
                    />
                )
            })}
        </Tabs>
    )
}

export default QlikReportingSelectionTabs
