import React, { FC } from 'react'

import ReactHtmlParser from 'react-html-parser'

import { Box, Typography, useTheme, Theme } from '@mui/material'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translation from '../../constants/translations'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'
import SvgEmptyReporting from '../../icons/SvgEmptyReportingIcon'

export type TQlikReportinStepperClasses = {
    stepperLabel: string
    stepperActive: string
    stepperCompleted: string
    stepperIconCompleted: string
}

export interface IQlikReportingStepperProps {
    activeStep: number
    showWizardImage?: boolean
    classNames?: Partial<TQlikReportinStepperClasses>
}

const QlikReportingStepper: FC<IQlikReportingStepperProps> = ({
    activeStep = 1,
    showWizardImage = true,
    classNames
}) => {
    const theme = useTheme<Theme>()
    const { classes } = useStyles()
    const { t } = useI18n()
    const { reportingWizardNode } = useQlikReportingUiContext()

    const steps = [
        t(translation.reportingWizardStep1),
        t(translation.reportingWizardStep2),
        t(translation.reportingWizardStep3)
    ]

    return (
        <Box className={classes.content}>
            {showWizardImage
                ? reportingWizardNode || <SvgEmptyReporting color={theme.palette.primary.dark} />
                : null}
            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: '1.3rem',
                    paddingTop: '10px',
                    color: theme.palette.text.primary
                }}>
                {t(translation.reportingWizard)}
            </Typography>
            <Box mt={1} />
            <Stepper
                alternativeLabel
                activeStep={activeStep}
                classes={{
                    root: classes.root
                }}>
                {steps.map(label => (
                    <Step
                        key={label}
                        classes={{
                            root: classes.step
                        }}>
                        <StepLabel
                            classes={{
                                label: `${classes.stepperLabel} ${classNames?.stepperLabel || ''}`,
                                active: `${classes.stepperLabelActive}  ${
                                    classNames?.stepperActive || ''
                                }`,
                                completed: `${classes.stepperLabelCompleted}  ${
                                    classNames?.stepperCompleted || ''
                                }`
                            }}
                            StepIconProps={{
                                classes: {
                                    completed: `${classes.iconCompleted}  ${
                                        classNames?.stepperIconCompleted || ''
                                    }`
                                }
                            }}>
                            {ReactHtmlParser(label)}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box mt={2} />
        </Box>
    )
}

export default QlikReportingStepper

const useStyles = makeStyles()((theme: Theme) => ({
    content: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    root: {
        width: '100%'
    },
    step: {
        width: '18%'
    },
    stepperLabel: {
        color: theme.palette.text.disabled
    },
    stepperLabelActive: {
        color: `${theme.palette.text.primary} !important`,
        fontWeight: `${500} !important`
    },
    stepperLabelCompleted: {
        color: `${theme.palette.text.secondary} !important`,
        fontWeight: `${500} !important`
    },
    iconCompleted: {
        color: `${theme.palette.secondary.main} !important`
    }
}))
