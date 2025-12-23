import React, { FC, ReactNode } from 'react'

import Grid, { GridProps } from '@mui/material/Grid'

export interface IPageGridProps {
    gridOptions?: GridProps
    children?: ReactNode
}

const PageGrid: FC<IPageGridProps> = ({ gridOptions, children }) => {
    return (
        <Grid container {...gridOptions}>
            {children}
        </Grid>
    )
}

export default React.memo(PageGrid)
