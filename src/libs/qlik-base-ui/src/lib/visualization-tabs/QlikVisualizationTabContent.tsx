import React from 'react'

import Box from '@mui/material/Box'

import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => ({
    tabContent: {
        background: '#FFF',
        borderBottom: '1px solid #EBEBEB',
        borderRight: '1px solid #EBEBEB',
        borderLeft: '1px solid #EBEBEB',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
    },
    tabContentSocial: {
        background: '#FFF',
        borderBottom: '1px solid #EBEBEB',
        borderRight: '1px solid #EBEBEB',
        borderLeft: '1px solid #EBEBEB'
    }
}))

interface IQlikTabsContentProps {
    children?: React.ReactNode
    value: any
    index: any
    enableSocialBar?: boolean
    height?: string
    isVertical?: boolean
    classNames?: Partial<TQlikTabsContentClasses>
}

export type TQlikTabsContentClasses = {
    tabContent?: string
    tabContentSocial?: string
}

const QlikTabsContent: React.FC<IQlikTabsContentProps> = ({
    children,
    value,
    index,
    enableSocialBar,
    height,
    isVertical,
    classNames,
    ...other
}) => {
    const { classes } = useStyles()
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
            className={
                enableSocialBar
                    ? `${classes.tabContentSocial} ${classNames.tabContentSocial}`
                    : `${classes.tabContent} ${classNames.tabContent}`
            }>
            {value === index && <Box style={{ height: height ? height : null }}>{children}</Box>}
        </div>
    )
}

export default React.memo(QlikTabsContent)
