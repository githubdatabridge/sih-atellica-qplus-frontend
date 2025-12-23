import React, { memo, FC, useState, useEffect } from 'react'

import ClearIcon from '@mui/icons-material/Clear'
import SyncIcon from '@mui/icons-material/Sync'
import { Chip, ClickAwayListener, IconButton, Theme, useTheme } from '@mui/material'

import { milliseconds } from 'date-fns'
import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { LightTooltip, IconTooltip } from '@libs/common-ui'
import { QMultiAppField } from '@libs/qlik-models'
import { useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'
import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionMultiAppFieldTooltip from '../tooltip/QlikSelectionMultiAppTooltip'

type TQlikSelectionMultiAppFieldClasses = {
    root?: string
    label?: string
}

export interface IQlikSelectionMultiAppFieldProps {
    fields?: QMultiAppField[]
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    label?: string
    toggle?: boolean
    softLock?: boolean
    cssChip?: any
    cssChipSelected?: any
    isVertical?: boolean
    primaryIcon?: React.ReactNode
    deleteIcon?: React.ReactNode
    iconColor?: 'primary' | 'secondary' | 'info' | 'default'
    showSelectedValues?: boolean
    tooltipOptions?: TQlikSelectionTooltipOptions
    classNames?: TQlikSelectionMultiAppFieldClasses
}

const QlikSelectionMultiAppField: FC<IQlikSelectionMultiAppFieldProps> = React.memo(
    ({
        fields,
        color,
        label,
        toggle,
        softLock,
        cssChip,
        cssChipSelected,
        primaryIcon,
        iconColor = 'primary',
        deleteIcon,
        isVertical = false,
        showSelectedValues = true,
        tooltipOptions,
        classNames
    }) => {
        const [isOpen, setIsOpen] = useState<boolean>(false)
        const [counter, setCounter] = useState<number>(0)
        const [text, setText] = useState<string>('')
        const [milliSeconds] = useState<number>(new Date().getMilliseconds())
        const { qAppMap } = useQlikAppContext()
        const { qSelectionMap, qGlobalSelectionCount } = useQlikSelectionContext()
        const { t } = useI18n()

        useEffect(() => {
            let selectionCount = 0
            const sSelectedArray = []
            for (const [key, value] of qSelectionMap) {
                for (const field of fields) {
                    if (field.qAppId === key) {
                        if (value.qSelectedFields) {
                            for (const selectedField of value.qSelectedFields) {
                                if (selectedField?.fieldName === field.qFieldName) {
                                    if (
                                        selectedField?.values &&
                                        selectedField?.values?.length > 0
                                    ) {
                                        selectionCount =
                                            selectionCount + selectedField?.values?.length
                                        sSelectedArray.push(...selectedField.values)
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const uniqueSelectedArray = [...new Set(sSelectedArray)]
            setText(uniqueSelectedArray.join(','))
            setCounter(selectionCount)
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [qSelectionMap])

        useEffect(() => {
            if (qGlobalSelectionCount === 0) {
                setCounter(qGlobalSelectionCount)
            }
        }, [qGlobalSelectionCount])

        const translatedFieldName = t(label)

        const fieldContent = (
            <>
                <p
                    style={{
                        fontWeight:
                            counter > 0 ? cssChipSelected?.fontWeight : cssChip?.fontWeight || 500,
                        fontSize:
                            counter > 0 ? cssChipSelected?.fontSize : cssChip?.fontSize || '14px',
                        color: counter > 0 ? cssChipSelected?.color : cssChip?.color
                    }}>
                    {translatedFieldName}
                </p>
                {showSelectedValues ? (
                    <p
                        style={{
                            fontWeight:
                                counter > 0
                                    ? cssChipSelected?.fontWeight
                                    : cssChip?.fontWeight || 500,
                            fontSize: '9px',
                            color: counter > 0 ? cssChipSelected?.color : cssChip?.color || '#000'
                        }}>
                        {text ? (text?.length < 20 ? text : `${text?.slice(0, 19)}...`) : ''}
                    </p>
                ) : null}
            </>
        )

        const handleTooltipClose = e => {
            //PAM-20210125: Workaround ClickAwayListener
            let forceClosed = true
            const path = e?.composedPath() || e?.path
            for (const node of path) {
                if (node.id?.includes(`qplus-multi-app-field-${milliSeconds}`)) {
                    forceClosed = false
                    break
                }
            }
            setIsOpen(!forceClosed)
        }

        const handleToggleTooltipOpen = event => {
            if (
                event.target.localName === 'span' ||
                event.target.localName === 'div' ||
                event.target.localName === 'p'
            )
                setIsOpen(prev => !prev)
        }

        const handleSelectValueCounterCallback = (counter: number) => {
            setCounter(counter)
        }

        const handleClearClick = async () => {
            for (const field of fields) {
                const app = qAppMap.get(field.qAppId)
                const f = await app.qApi.getField(field.qFieldName)
                await f.$apiField.clear()
            }
            setCounter(0)
            setText('')
        }

        const useChipStyles = makeStyles()((theme: Theme) => ({
            chipRoot: {
                minWidth: '138px',
                marginRight: isVertical ? '0px' : '10px',
                width: isVertical && '100%',
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderTopLeftRadius: 70,
                borderTopRightRadius: 70,
                borderBottomLeftRadius: 70,
                borderBottomRightRadius: 70,
                backgroundColor: theme.palette.primary.main,
                '@media (max-width: 1001px)': !isVertical
                    ? {
                          width: '100%',
                          marginRight: '0px'
                      }
                    : {}
            },
            chipLabel: {
                color: theme.palette.primary.contrastText,
                minWidth: '100px'
            }
        }))

        const { classes: chipClasses } = useChipStyles()
        const theme = useTheme()

        return (
            <ClickAwayListener onClickAway={e => handleTooltipClose(e)}>
                <LightTooltip
                    id={`qplus-multi-app-field-${milliSeconds}`}
                    PopperProps={{
                        disablePortal: false
                    }}
                    arrow
                    open={isOpen}
                    onClose={() => handleTooltipClose}
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
                    title={
                        <QlikSelectionMultiAppFieldTooltip
                            onTooltipClose={() => setIsOpen(false)}
                            fields={fields}
                            toggle={toggle}
                            softLock={softLock}
                            color={color}
                            width={tooltipOptions?.width || ''}
                            height={tooltipOptions?.height || ''}
                            onSelectValuesCallback={handleSelectValueCounterCallback}
                        />
                    }>
                    <div>
                        <Chip
                            variant="filled"
                            itemID={`chip_${milliseconds}`}
                            classes={{
                                root: `${chipClasses.chipRoot} ${classNames?.root}`,
                                label: `${chipClasses.chipLabel} ${classNames?.label}`
                            }}
                            style={counter > 0 ? cssChipSelected : cssChip}
                            label={fieldContent}
                            deleteIcon={
                                counter > 0 ? (
                                    <IconTooltip title={t(translation.clearFilter)}>
                                        <IconButton
                                            onClick={handleClearClick}
                                            color={iconColor}
                                            sx={{
                                                cursor: 'pointer',
                                                color: cssChipSelected?.color
                                                    ? cssChipSelected?.color
                                                    : undefined
                                            }}>
                                            {deleteIcon || <ClearIcon />}
                                        </IconButton>
                                    </IconTooltip>
                                ) : (
                                    <IconTooltip title={t(translation.globalFilter)}>
                                        <IconButton
                                            size="small"
                                            color={iconColor}
                                            data-tag={'C'}
                                            onClick={() => undefined}
                                            style={{ cursor: 'pointer' }}>
                                            {primaryIcon || <SyncIcon />}
                                        </IconButton>
                                    </IconTooltip>
                                )
                            }
                            onClick={e => handleToggleTooltipOpen(e)}
                            onDelete={e => (counter > 0 ? handleClearClick() : undefined)}
                        />
                    </div>
                </LightTooltip>
            </ClickAwayListener>
        )
    }
)

export default memo(QlikSelectionMultiAppField)
