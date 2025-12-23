import { FC } from 'react'

import { Box, Typography, useTheme, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

interface QlikPinWallStepperProps {
    step: number
}

const QlikPinWallStepper: FC<QlikPinWallStepperProps> = ({ step }) => {
    const theme = useTheme<Theme>()
    const { classes } = useStyles()
    const { t } = useI18n()
    const steps = [
        {
            number: 1,
            primaryText: 'General',
            secondaryText: 'Add general info'
        },
        {
            number: 2,
            primaryText: 'Layout',
            secondaryText: 'Define your layout'
        },
        {
            number: 3,
            primaryText: 'Styling',
            secondaryText: 'Apply some styling'
        }
    ]

    const renderStepContainer = (
        step: any,
        isActive: boolean,
        isCompleted: boolean,
        index: number
    ) => {
        return (
            <Box key={index}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: index !== 2 ? 'center' : 'left',
                        alignItems: 'center'
                    }}>
                    <Box
                        className={classes.stepContainer}
                        sx={{
                            backgroundColor: isActive
                                ? theme.palette.primary.main
                                : isCompleted
                                ? theme.palette.secondary.main
                                : 'transparent',
                            border: `1px solid ${
                                !isActive && !isCompleted ? theme.palette.divider : 'transparent'
                            }`
                        }}>
                        <Typography
                            sx={{
                                color: isActive
                                    ? theme.palette.primary.contrastText
                                    : isCompleted
                                    ? theme.palette.secondary.contrastText
                                    : theme.palette.text.disabled,
                                textAlign: 'center',
                                fontSize: '16px',
                                fontWeight: 600
                            }}>
                            {step.number}
                        </Typography>
                    </Box>
                    {index !== 2 ? (
                        <Box className={classes.separatorContainer}>
                            <Box className={classes.separator}></Box>
                        </Box>
                    ) : null}
                </Box>
                <Box
                    className={classes.textContainer}
                    sx={{
                        marginRight: index !== 2 ? '75px' : 0,
                        marginLeft: index !== 2 ? '-75px' : '-32px'
                    }}>
                    <Typography
                        className={classes.primaryText}
                        sx={{
                            color: isActive
                                ? theme.palette.text.primary
                                : isCompleted
                                ? theme.palette.text.secondary
                                : theme.palette.text.disabled
                        }}>
                        {step.primaryText}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            color:
                                isActive || isCompleted
                                    ? theme.palette.text.secondary
                                    : theme.palette.text.disabled,
                            height: '16px'
                        }}>
                        {step.secondaryText}
                    </Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box className={classes.root}>
            {steps.map((item, index) =>
                renderStepContainer(item, step === index + 1, step > index + 1, index)
            )}
        </Box>
    )
}

export default QlikPinWallStepper

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px',
        paddingBottom: '20px',
        marginLeft: '10px'
    },

    stepContainer: {
        width: '32px',
        height: '32px',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    separatorContainer: {
        height: '32px',
        width: '150px',
        padding: '0px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    separator: {
        height: '2px',
        width: '130px',
        marginLeft: '8px',
        marginRight: '8px',
        borderRadius: '25px',
        backgroundColor: theme.palette.background.default
    },
    textContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '10px',
        textAlign: 'center'
    },
    primaryText: {
        fontSize: '14px',
        fontWeight: 600,
        height: '24px'
    }
}))
