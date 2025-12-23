import React, { Children, cloneElement, FC, ReactNode, useEffect, useState } from 'react'

import {
    Box,
    Container,
    DialogActions,
    DialogContent,
    Paper,
    Step,
    StepLabel,
    Stepper
} from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import StyledActionButton from '../button/StyledActionButton'
import StyledLoadingButton from '../button/StyledLoadingButton'

interface IBaseStepperProps {
    steps: any[] | string[]
    onSubmit: () => void
    loading: boolean
    cssClasses?: {
        dialogContent: string
        dialogContainer: string
        dialogStepper: string
        dialogPaper: string
        buttonAction: string
        buttonSave: string
    }
    actionDisabled?: (activeStep: number) => boolean
    children: ReactNode
}

const useStyles = makeStyles()(() => ({
    dialogContainer: {
        padding: '0 10%',
        '.MuiFormControl-root': {
            width: '100%'
        }
    },
    dialogPaper: {
        width: '100%',
        padding: '0px',
        minHeight: '500px',
        zIndex: 1019
    },
    dialogStepper: {
        '& .MuiStepLabel-root .Mui-completed': {
            color: 'secondary.main' // circle color (COMPLETED)
        },
        '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
            color: 'text.primary' // Just text label (COMPLETED)
        },
        '& .MuiStepLabel-root .Mui-active': {
            color: 'primary.main' // circle color (ACTIVE)
        },
        '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
            color: 'text.primary' // Just text label (ACTIVE)
        },
        '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
            fill: 'text.primary' // circle's number (ACTIVE)
        }
    },
    dialogContent: {
        padding: '0px',
        flex: '0.95 1'
    },
    buttonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'none'
    },
    buttonAction: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textTransform: 'none'
    }
}))

const BaseStepper: FC<IBaseStepperProps> = ({
    steps,
    onSubmit,
    loading,
    cssClasses,
    actionDisabled,
    children
}) => {
    const { classes } = useStyles()
    const currentClass = cssClasses || {
        dialogContent: classes?.dialogContent,
        dialogContainer: classes?.dialogContainer,
        dialogStepper: classes?.dialogStepper,
        dialogPaper: classes?.dialogPaper,
        buttonAction: classes?.buttonAction,
        buttonSave: classes.buttonSave
    }
    const [activeStep, setActiveStep] = useState<number>(0)
    const [disableNext, setDisableNext] = useState<boolean>(false)
    const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1)
    const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1)

    useEffect(
        () => actionDisabled && setDisableNext(!actionDisabled(activeStep)),
        [activeStep, disableNext, actionDisabled]
    )

    return (
        <>
            <DialogContent className={currentClass?.dialogContent}>
                <Container className={currentClass?.dialogContainer}>
                    <Paper elevation={0} className={currentClass?.dialogPaper}>
                        <Stepper alternativeLabel activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {}
                                return (
                                    <Step
                                        key={`${label}+${index}`}
                                        {...stepProps}
                                        className={currentClass?.dialogStepper}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                )
                            })}
                        </Stepper>
                        <Box sx={{ width: '80%', margin: '0 auto' }}>
                            {/* @ts-ignore  */}
                            {Children.map(
                                children,
                                (child: any, index: number) =>
                                    activeStep === index && cloneElement(child)
                            )}
                        </Box>
                    </Paper>
                </Container>
            </DialogContent>
            <DialogActions sx={{ marginTop: 3 }}>
                <StyledActionButton
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    className={currentClass?.buttonAction}>
                    Back
                </StyledActionButton>
                {activeStep === steps.length - 1 ? (
                    <StyledLoadingButton
                        loading={loading}
                        onClick={async () => onSubmit()}
                        disabled={disableNext}
                        className={currentClass?.buttonSave}>
                        Save
                    </StyledLoadingButton>
                ) : (
                    <StyledActionButton
                        className={currentClass?.buttonAction}
                        onClick={handleNext}
                        disabled={disableNext}>
                        Next
                    </StyledActionButton>
                )}
            </DialogActions>
        </>
    )
}

export default BaseStepper
