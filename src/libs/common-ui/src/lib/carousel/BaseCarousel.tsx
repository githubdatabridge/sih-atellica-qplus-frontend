import React, { useState, ReactNode, FC } from 'react'

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Grid, { GridProps } from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MobileStepper from '@mui/material/MobileStepper'

type TBaseCarouselClasses = {
    dot?: string
    dotActive?: string
    dots?: string
    positionBottom?: string
    positionStatic?: string
    positionTop?: string
    progress?: string
    root?: string
}

export interface IBaseCarouselProps {
    items: ReactNode[]
    gridOptions?: GridProps
    classNames?: Partial<TBaseCarouselClasses>
}

export const BaseCarousel: FC<IBaseCarouselProps> = ({ classNames, items, gridOptions }) => {
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const itemsCount = items.length

    const lastItemIndex = items.length - 1

    return (
        <Grid item {...gridOptions}>
            {items.map(
                (item, index) =>
                    index === activeStep && (
                        <React.Fragment key={`item_${index}`}> {item} </React.Fragment>
                    )
            )}
            <MobileStepper
                variant="dots"
                steps={itemsCount}
                position="static"
                activeStep={activeStep}
                classes={{
                    dot: classNames?.dot || undefined,
                    dotActive: classNames?.dotActive || undefined,
                    dots: classNames?.dots || undefined,
                    positionBottom: classNames?.positionBottom || undefined,
                    positionStatic: classNames?.positionStatic || undefined,
                    positionTop: classNames?.positionTop || undefined,
                    progress: classNames?.progress || undefined,
                    root: classNames?.root || undefined
                }}
                nextButton={
                    <IconButton
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === lastItemIndex}>
                        <KeyboardArrowRight />
                    </IconButton>
                }
                backButton={
                    <IconButton size="small" onClick={handleBack} disabled={activeStep === 0}>
                        <KeyboardArrowLeft />
                    </IconButton>
                }
            />
        </Grid>
    )
}

export default React.memo(BaseCarousel)
