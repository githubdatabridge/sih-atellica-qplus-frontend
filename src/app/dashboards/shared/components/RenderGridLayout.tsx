import React, { FC } from 'react'
import { makeStyles } from 'tss-react/mui'
import Grid from '@mui/material/Grid'
import { QplusVisualizationEmbed } from '@databridge/qplus'

type RenderGridLayoutProps = {
    qlikAppId?: string
    content: any
}

const RenderGridLayout: FC<RenderGridLayoutProps> = React.memo(({ qlikAppId = '', content }) => {
    const { classes } = useStyles()
    return content?.map((row, i) => {
        return (
            <Grid container key={`grid-container-${i}`}>
                {row.map((column, j) => {
                    if (column?.grid) {
                        const size = Math.floor(12 / content.length) as any
                        return (
                            <Grid
                                key={`grid-${j}`}
                                item
                                xs={12}
                                sm={12}
                                md={size}
                                lg={size}
                                xl={size}
                                className={classes.grid}>
                                <Grid container key={`grid-column-container-${i}`}>
                                    {column.grid.map((col, z) => {
                                        return (
                                            <Grid
                                                key={`grid-col-${col.id}`}
                                                item
                                                xs={col.xs}
                                                sm={col.sm}
                                                md={col.md}
                                                lg={col.lg}
                                                xl={col.xl}
                                                className={classes.gridNestedDetail}>
                                                <QplusVisualizationEmbed
                                                    key={`viz-embed-${col.id}`}
                                                    panelOptions={{
                                                        isVisible: true,
                                                        variableOptions: col?.variableOptions
                                                    }}
                                                    visualizationOptions={{
                                                        id: col.id,
                                                        qlikAppId: qlikAppId,
                                                        height: col.height,
                                                        titleOptions: {
                                                            disableQlikNativeTitles: true,
                                                            useQlikTitlesInPanel: true
                                                        },
                                                        enableFullscreen: true,
                                                        isToolbarOnPanel: true,
                                                        calculationCondition:
                                                            col?.calculationCondition ?? '',
                                                        ...(col?.export
                                                            ? {
                                                                  exportOptions: {
                                                                      types: col?.export
                                                                  }
                                                              }
                                                            : {})
                                                    }}
                                                />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid
                                key={`grid-col-${j}`}
                                item
                                xs={column.xs}
                                sm={column.sm}
                                md={column.md}
                                lg={column.lg}
                                xl={column.xl}
                                className={column?.isFilter ? classes.gridFilter : classes.grid}>
                                <QplusVisualizationEmbed
                                    key={`viz-embed-${j}`}
                                    panelOptions={{
                                        variableOptions: column?.variableOptions
                                    }}
                                    visualizationOptions={{
                                        id: column.id,
                                        qlikAppId: qlikAppId,
                                        height: column.height,
                                        titleOptions: {
                                            disableQlikNativeTitles: true,
                                            useQlikTitlesInPanel: !column?.isFilter
                                        },
                                        calculationCondition: column?.calculationCondition || '',
                                        enableFullscreen: !column?.isFilter,
                                        isToolbarOnPanel: !column?.isFilter,
                                        ...(column?.export
                                            ? {
                                                  exportOptions: {
                                                      types: column?.export
                                                  }
                                              }
                                            : {})
                                    }}
                                />
                            </Grid>
                        )
                    }
                })}
            </Grid>
        )
    })
})

export default RenderGridLayout

const useStyles = makeStyles()(() => ({
    grid: {
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingBottom: '4px',
        paddingTop: '4px'
    },
    gridFilter: {
        paddingLeft: '4px',
        paddingRight: '4px',
        paddingBottom: '4px',
        paddingTop: '4px',
        backgroundColor: 'transparent'
    },
    gridNestedDetail: {
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingTop: '0px'
    }
}))
