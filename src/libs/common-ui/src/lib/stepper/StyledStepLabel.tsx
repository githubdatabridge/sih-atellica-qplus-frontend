import { StepLabel, Theme } from '@mui/material'

import { withStyles } from 'tss-react/mui'

const StyledStepLabel = withStyles(StepLabel, (theme: Theme) => ({
    completed: {
        color: theme.palette.secondary.main
    },
    alternativeLabel: {
        color: theme.palette.text.primary // Just text label (COMPLETED)
    },
    active: {
        color: theme.palette.primary.main
    }
}))

export default StyledStepLabel
