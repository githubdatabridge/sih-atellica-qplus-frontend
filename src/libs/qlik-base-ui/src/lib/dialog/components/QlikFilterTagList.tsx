import React, { FC, useRef } from 'react'

import { Tabs, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import QlikFilterTag from './QlikFilterTag'

interface IQlikFilterTagListProps {
    tags: string[]
    cssTabs?: any
    cssChip?: any
    width?: string
}

const useStyles = makeStyles()((theme: Theme) => ({
    tabs: { minHeight: 0, maxWidth: '100%' }
}))

const QlikFilterTagList: FC<IQlikFilterTagListProps> = ({ tags = [], cssChip, cssTabs, width }) => {
    const { classes } = useStyles()
    const targetRef = useRef<any>()

    if (tags?.length === 0) return null

    return (
        <Tabs
            classes={{ root: classes.tabs }}
            style={{
                width: `${width}`,
                maxWidth: '1200px',
                marginLeft: '15px',
                ...cssTabs
            }}
            value={false}
            ref={targetRef}
            onChange={() => undefined}
            scrollButtons={true}
            allowScrollButtonsMobile={true}
            variant="scrollable"
            indicatorColor="secondary"
            textColor="primary"
            aria-label="scrollable force tabs example">
            {tags?.map(tag => {
                const key = uuidv4()
                return <QlikFilterTag id={key} tag={tag} key={key} cssChip={cssChip} />
            })}
        </Tabs>
    )
}

export default QlikFilterTagList
