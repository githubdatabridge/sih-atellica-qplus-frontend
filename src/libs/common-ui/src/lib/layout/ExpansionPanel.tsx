import React, { ReactNode, FC } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

interface IExpansionPanelItems {
    title: string
    component: ReactNode
    icon?: any
}

export interface IExpansionPanelProps {
    panels: IExpansionPanelItems[]
    gridOptions?: GridProps
    children?: ReactNode
}

const ExpansionPanel: FC<IExpansionPanelProps> = ({
    panels,
    gridOptions = {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12
    }
}) => {
    const [expanded, setExpanded] = React.useState<string | false>('panel0')

    const handleChange = (panel: string) => (
        _event: React.ChangeEvent<any>,
        newExpanded: boolean
    ) => {
        setExpanded(newExpanded ? panel : false)
    }

    const renderPanels = panels.map((panel, panelIndex) => {
        const panelString = `panel${panelIndex}`
        const panelIcon = panel.icon && <img src={panel.icon} alt="" />

        return (
            <Accordion
                square
                expanded={expanded === panelString}
                onChange={handleChange(panelString)}
                TransitionProps={{ unmountOnExit: true }}
                key={panelString}>
                <AccordionSummary
                    aria-controls={`${panelString}d-content`}
                    id={`${panelString}d-header"`}>
                    {panelIcon}
                    <Box display="flex" alignItems="center">
                        <Typography>{panel.title}</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>{panel.component}</AccordionDetails>
            </Accordion>
        )
    })

    return (
        <Grid item {...gridOptions}>
            {renderPanels}
        </Grid>
    )
}

export default React.memo(ExpansionPanel)
