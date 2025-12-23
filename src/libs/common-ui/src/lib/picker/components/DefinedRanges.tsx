import React from 'react'

import { List, ListItem, ListItemText, Typography } from '@mui/material'

import { isSameDay } from 'date-fns'

import { DefinedRange, DateRange } from '../types'

// eslint-disable-next-line no-unused-vars
type DefinedRangesProps = {
    setRange: (range: DateRange) => void
    selectedRange: DateRange
    ranges: DefinedRange[]
    cssDefinedRange?: any
}

const isSameRange = (first: DateRange, second: DateRange) => {
    const { startDate: fStart, endDate: fEnd } = first
    const { startDate: sStart, endDate: sEnd } = second
    if (fStart && sStart && fEnd && sEnd) {
        return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd)
    }
    return false
}

const DefinedRanges: React.FunctionComponent<DefinedRangesProps> = ({
    ranges,
    setRange,
    selectedRange,
    cssDefinedRange
}: DefinedRangesProps) => {
    return (
        <List style={{ width: '150px', marginTop: '-17px' }}>
            {ranges.map((range, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <ListItem
                    button
                    key={idx}
                    onClick={() => setRange(range)}
                    style={{
                        color: isSameRange(range, selectedRange) ? cssDefinedRange['color'] : null,
                        backgroundColor: isSameRange(range, selectedRange)
                            ? cssDefinedRange['backgroundColor']
                            : null,
                        borderBottom: '1px solid #EFEFEF',
                        textAlign: 'center'
                    }}>
                    <ListItemText
                        primary={
                            <Typography style={{ fontSize: '0.75rem' }}> {range.label}</Typography>
                        }></ListItemText>
                </ListItem>
            ))}
        </List>
    )
}

export default DefinedRanges
