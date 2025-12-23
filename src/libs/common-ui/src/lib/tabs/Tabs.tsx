import React, { FC, ReactNode } from 'react'

import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'

import { makeStyles } from 'tss-react/mui'

import TabsPanel from './TabsPanel'

const a11yProps = (index: any) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
})

export interface IQlikTabsProps {
    tabs: {
        title: string
        content: ReactNode
    }[]
    onChanged?(value: number): any
}

const Tabs: FC<IQlikTabsProps> = ({ tabs, onChanged }) => {
    const [value, setValue] = React.useState(0)

    const { classes } = useStyles()

    const handleChange = (_event: React.ChangeEvent<any>, newValue: number) => {
        setValue(newValue)
        if (onChanged) onChanged(newValue)
    }

    return (
        <div>
            <AppBar position="static">
                <MuiTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs"
                    classes={{ indicator: classes.indicator }}>
                    {tabs.map((tab, index) => (
                        <Tab
                            label={tab.title}
                            {...a11yProps(index)}
                            key={`${tab.title}-${index}`}
                        />
                    ))}
                </MuiTabs>
            </AppBar>
            {tabs.map((tab, index) => (
                <TabsPanel value={value} index={index} key={`tab-panel-${index}`}>
                    {tab.content}
                </TabsPanel>
            ))}
        </div>
    )
}

export default React.memo(Tabs)

const useStyles = makeStyles()((theme: any) => ({
    indicator: {
        bottom: '0px',
        height: 4,
        backgroundColor: theme.palette.info.main
    }
}))
