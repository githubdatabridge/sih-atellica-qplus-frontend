import React, { FC, useState, ReactNode } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { Box, useTheme } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { IconTooltip, LightTooltip } from '@libs/common-ui'

import QlikCardInfoSelect from './QlikCardInfoSelect'

export interface IQlikCardInfoSelectTooltipProps {
    id?: string
    qlikAppId: string
    fieldName: string
    stateName?: string
    isFirstElementPreSelected?: boolean
    calcFieldName?: string
    selectComponent: ReactNode
    className: string
}

const QlikCardInfoSelectTooltip: FC<IQlikCardInfoSelectTooltipProps> = ({
    id,
    qlikAppId,
    fieldName,
    stateName = '$',
    isFirstElementPreSelected = false,
    calcFieldName,
    selectComponent,
    className
}) => {
    const [isOpenMain, setIsMainOpen] = useState(false)
    const [milliSeconds, setMilliseconds] = useState<number>(new Date().getMilliseconds())

    const handleTooltipClose = e => {
        //PAM-20210125: Workaround ClickAwayListener
        let forceClosed = true
        // eslint-disable-next-line no-unsafe-optional-chaining
        for (const node of e?.path) {
            if (node.id?.includes(`T${milliSeconds}`)) {
                forceClosed = false
                return
            }
        }
        setIsMainOpen(!forceClosed)
    }

    const toggleTooltipOpen = () => {
        setIsMainOpen(prev => !prev)
    }

    const theme = useTheme()

    return (
        <ClickAwayListener onClickAway={e => handleTooltipClose(e)}>
            <LightTooltip
                id={`T${milliSeconds}`}
                PopperProps={{
                    disablePortal: false
                }}
                arrow
                open={isOpenMain}
                onClose={e => handleTooltipClose(e)}
                disableFocusListener
                disableHoverListener
                placement="bottom-start"
                componentsProps={{
                    tooltip: {
                        sx: {
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.getContrastText(theme.palette.text.primary),
                            boxShadow: theme.shadows[7],
                            maxWidth: 'none',
                            zIndex: 1,
                            padding: 0
                        }
                    },
                    popper: {
                        sx: {
                            zIndex: 2,
                            backgroundColor: theme.palette.background.paper
                        }
                    },
                    arrow: {
                        sx: {
                            color: theme.palette.background.paper,
                            '&::before': {
                                boxShadow: theme.shadows[7]
                            }
                        }
                    }
                }}
                sx={{ padding: 0 }}
                title={
                    <div>
                        <QlikCardInfoSelect
                            qlikAppId={qlikAppId}
                            fieldName={fieldName}
                            stateName={stateName}
                            calcFieldName={calcFieldName}
                            isFirstElementPreSelected={isFirstElementPreSelected}
                        />
                    </div>
                }>
                <Box alignItems="center" mt={1} width={1}>
                    <Box alignContent="center" p={0} style={{ color: '#FFF' }}>
                        <Box>
                            <Typography className={className}>
                                {selectComponent}
                                <IconTooltip title={'Search'}>
                                    <IconButton edge="end" size="small" onClick={toggleTooltipOpen}>
                                        <SearchIcon
                                            style={{
                                                marginLeft: '10px',
                                                marginBottom: '5px',
                                                cursor: 'pointer',
                                                color: '#FFF'
                                            }}
                                        />
                                    </IconButton>
                                </IconTooltip>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </LightTooltip>
        </ClickAwayListener>
    )
}

export default QlikCardInfoSelectTooltip
