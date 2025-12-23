import React, { memo, FC, useState } from 'react'

import { Theme, useTheme } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'

import { makeStyles } from 'tss-react/mui'

import { LightTooltip } from '@libs/common-ui'

import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionFieldTooltip from '../tooltip/QlikSelectionFieldTooltip'
import QlikSelectionNativeFieldTooltip, {
    TQSortCriterias
} from '../tooltip/QlikSelectionNativeFieldTooltip'

export interface IQlikSelectionSingleAppFieldProps {
    qlikAppId?: string
    fieldName: string
    label?: string
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    toggle?: boolean
    softLock?: boolean
    sortCriterias?: TQSortCriterias
    tooltipOptions?: TQlikSelectionTooltipOptions
    children?: React.ReactNode
}

const QlikSelectionSingleAppField: FC<IQlikSelectionSingleAppFieldProps> = React.memo(
    ({
        qlikAppId,
        fieldName,
        label,
        color,
        toggle,
        softLock,
        sortCriterias = {
            autoSort: true
        },
        tooltipOptions,
        children
    }) => {
        const [isOpen, setIsOpen] = useState(false)
        const [dismiss] = useState(false)
        const [milliSeconds] = useState<number>(new Date().getMilliseconds())

        const handleTooltipClose = e => {
            //PAM-20210125: Workaround ClickAwayListener
            let forceClosed = true
            const path = e?.composedPath() || e?.path
            for (const node of path) {
                if (node.id?.includes(`qplus-single-app-field-${milliSeconds}`)) {
                    forceClosed = false
                    break
                }
            }
            setIsOpen(!forceClosed)
        }

        const toggleTooltipOpen = () => {
            setIsOpen(prev => !prev)
        }

        const theme = useTheme()
        const { classes } = useStyles()

        return !dismiss ? (
            <ClickAwayListener onClickAway={e => handleTooltipClose(e)}>
                <LightTooltip
                    id={`qplus-single-app-field-${milliSeconds}`}
                    PopperProps={{
                        disablePortal: false,
                        style: { zIndex: 1300 }
                    }}
                    arrow
                    open={isOpen}
                    onClose={handleTooltipClose}
                    disableFocusListener
                    disableHoverListener
                    placement="bottom-start"
                    classes={{
                        popper: classes.popper
                    }}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: theme.palette.background.paper,
                                color: theme.palette.getContrastText(theme.palette.text.primary),
                                boxShadow: theme.shadows[7],
                                maxWidth: 'none',
                                zIndex: 999,
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
                        tooltipOptions?.isNative ? (
                            <QlikSelectionNativeFieldTooltip
                                color={color}
                                fieldName={fieldName}
                                height={tooltipOptions?.height || ''}
                                label={label}
                                qlikAppId={qlikAppId}
                                sortCriterias={sortCriterias}
                                width={tooltipOptions?.width || ''}
                            />
                        ) : (
                            <QlikSelectionFieldTooltip
                                color={color}
                                fieldName={fieldName}
                                height={tooltipOptions?.height || ''}
                                onTooltipClose={() => setIsOpen(false)}
                                softLock={softLock}
                                toggle={toggle}
                                width={tooltipOptions?.width || ''}
                                qlikAppId={qlikAppId}
                            />
                        )
                    }>
                    <IconButton
                        color="primary"
                        edge="end"
                        aria-label="filter"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={toggleTooltipOpen}>
                        {children}
                    </IconButton>
                </LightTooltip>
            </ClickAwayListener>
        ) : null
    }
)

const useStyles = makeStyles()((theme: Theme & any) => ({
    popper: {
        zIndex: 2
    }
}))

export default memo(QlikSelectionSingleAppField)
