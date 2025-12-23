import React, { FC } from 'react'

import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { IconButton, Box } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n, useBaseUiContext } from '@libs/common-providers'
import { IconTooltip } from '@libs/common-ui'

import { useQlikVisualizationContext } from '../QlikVisualizationContext'
import { IQlikVisualizationCoreTypeOptions } from '../QlikVisualizationCore'
import translation from './constants/translations'
import QlikToolbarExport, { IQlikToolbarExportProps } from './QlikToolbarExport'
import QlikToolbarInfo, { IQlikToolbarInfoProps } from './QlikToolbarInfo'
import QlikToolbarVizTypes from './QlikToolbarVizTypes'

type TQlikToolbarClassNames = {
    iconButton?: string
    icon?: string
}

export interface IQlikToolbarProps {
    exportOptions?: IQlikToolbarExportProps | undefined
    enableFullscreen?: boolean
    infoOptions?: IQlikToolbarInfoProps
    typeOptions?: IQlikVisualizationCoreTypeOptions
    isInline?: boolean
    className?: string
    classNames?: Partial<TQlikToolbarClassNames>
    disableToolbarCss?: boolean
}

const QlikToolbar: FC<IQlikToolbarProps> = ({
    exportOptions,
    enableFullscreen,
    infoOptions,
    typeOptions,
    className,
    classNames,
    isInline = false,
    disableToolbarCss = false
}) => {
    const { t } = useI18n()
    const { onVisualizationFullscreen } = useQlikVisualizationContext()
    const { fullscreenNode, cssQlikToolbar } = useBaseUiContext()

    const { classes } = useStyles()

    const classToolbar = `${
        disableToolbarCss ? '' : !isInline ? classes.box : classes.boxInline
    } ${className}`

    return (
        <Box display="flex" alignItems="center" width="100%" mb={0.5}>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end">
                {typeOptions?.types && (
                    <Box
                        className={classToolbar}
                        sx={!disableToolbarCss ? cssQlikToolbar ?? '' : ''}>
                        <QlikToolbarVizTypes {...typeOptions} />
                    </Box>
                )}
                {infoOptions && (
                    <Box
                        className={classToolbar}
                        sx={!disableToolbarCss ? cssQlikToolbar ?? '' : ''}>
                        <QlikToolbarInfo
                            title={infoOptions?.title}
                            text={infoOptions?.text}
                            color={infoOptions?.color}
                            classNames={{
                                icon: classNames?.icon || ''
                            }}
                        />
                    </Box>
                )}
                {exportOptions && (
                    <Box
                        className={classToolbar}
                        sx={!disableToolbarCss ? cssQlikToolbar ?? '' : ''}>
                        <QlikToolbarExport
                            {...exportOptions}
                            classNames={{ icon: classNames?.icon || '' }}
                        />
                    </Box>
                )}
                {enableFullscreen && (
                    <Box
                        className={classToolbar}
                        sx={!disableToolbarCss ? cssQlikToolbar ?? '' : ''}>
                        <IconTooltip title={t(translation.fullscreenTooltip)}>
                            <IconButton
                                onClick={onVisualizationFullscreen}
                                size="small"
                                className={classNames?.iconButton || ''}>
                                {fullscreenNode || (
                                    <OpenInFullIcon
                                        color="primary"
                                        fontSize="small"
                                        className={classNames?.icon || ''}
                                    />
                                )}
                            </IconButton>
                        </IconTooltip>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default QlikToolbar

const useStyles = makeStyles()((theme: any) => ({
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderLeft: '1px solid #ececec',
        borderBottom: '1px solid #ececec'
    },
    boxInline: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px'
    }
}))
