import React, { FC } from 'react'

import { Box } from '@mui/material'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'

export interface IQlikCardRatingProps {
    rating: number
}

const QlikCardRating: FC<IQlikCardRatingProps> = ({ rating }) => {
    const { classes } = useStyles()

    return (
        <Box alignItems="center" width={1}>
            <Typography className={classes.label}>
                <Rating
                    name="size-large"
                    defaultValue={rating}
                    size="large"
                    className={classes.rating}
                    readOnly
                />
            </Typography>
        </Box>
    )
}

export default QlikCardRating

const useStyles = makeStyles()((theme: any) => ({
    rating: {
        color: theme.palette.primary.light
    },
    label: {
        color: '#FFF',
        fontSize: '0.875rem',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: '16px',
        textAlign: 'center',
        paddingTop: '8px'
    }
}))
