import React, { memo, FC, useState, useEffect } from 'react'

import ReactHtmlParser from 'react-html-parser'

import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import LockIcon from '@mui/icons-material/Lock'
import { Box, Typography, useTheme, Theme } from '@mui/material'
import Chip from '@mui/material/Chip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'

import { milliseconds } from 'date-fns'
import { makeStyles } from 'tss-react/mui'

import { useI18n, useBaseUiContext } from '@libs/common-providers'
import { LightTooltip, IconTooltip, BaseSwitch, AppInfoIcon } from '@libs/common-ui'
import { QFieldFilter } from '@libs/qlik-models'
import { useQlikAppContext } from '@libs/qlik-providers'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import translation from '../../constants/translation'
import { TQlikSelectionTooltipOptions } from '../../types'
import QlikSelectionFieldTooltip from '../tooltip/QlikSelectionFieldTooltip'
import QlikSelectionNativeFieldTooltip, {
    TQSortCriterias
} from '../tooltip/QlikSelectionNativeFieldTooltip'

export type TQlikSelectionFieldClasses = {
    primaryText: string
    secondaryText: string
}

export interface IQlikSelectionFieldProps {
    qlikAppId: string
    docked?: boolean
    label?: string
    isFixed?: boolean
    locked: boolean
    toggle?: boolean
    softLock?: boolean
    isReadOnly?: boolean
    fieldName: string
    sortCriterias?: TQSortCriterias
    qSelected: string
    selectedCount: number
    dockedFields?: QFieldFilter[]
    cssChipSelected?: any
    cssChipReadOnly?: any
    cssChipDocked?: any
    cssChipFixed?: any
    infoOptions?: any
    tooltipOptions?: TQlikSelectionTooltipOptions
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    showSelectedValues?: boolean
    showAppWaterMark?: boolean
    isVertical?: boolean
    classNames?: Partial<TQlikSelectionFieldClasses>
    callbackReorderFilterChips?: () => void
}

/* copied from https://github.com/mui-org/material-ui/blob/v4.3.2/packages/material-ui/src/Menu/Menu.js#L21 */
const useMenuStyles = makeStyles()({
    /* Styles applied to the `Paper` component. */
    paper: {
        // specZ: The maximum height of a simple menu should be one or more rows less than the view
        // height. This ensures a tapable area outside of the simple menu with which to dismiss
        // the menu.
        maxHeight: 'calc(100% - 96px)',
        // Add iOS momentum scrolling.
        WebkitOverflowScrolling: 'touch',
        zIndex: 9999
    },
    /* Styles applied to the `List` component via `MenuList`. */
    list: {
        // We disable the focus ring for mouse, touch and keyboard users.
        outline: 0
    }
})

const QlikSelectionField: FC<IQlikSelectionFieldProps> = ({
    qlikAppId,
    fieldName,
    label,
    qSelected,
    docked = false,
    isFixed = false,
    toggle,
    softLock,
    isReadOnly = false,
    dockedFields = [],
    locked,
    sortCriterias,
    selectedCount,
    cssChipReadOnly,
    cssChipSelected,
    cssChipDocked,
    cssChipFixed,
    infoOptions,
    tooltipOptions,
    color,
    showSelectedValues = true,
    showAppWaterMark = true,
    isVertical = false,
    classNames
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dismiss, setDismiss] = useState<boolean>(false)
    const [milliSeconds] = useState<number>(new Date().getMilliseconds())
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = React.useState<null | any>(null)
    const [isLocked, setIsLocked] = useState<boolean>(false)

    const { setDockedFields } = useQlikSelectionContext()
    const { qAppMap } = useQlikAppContext()
    const { filterNode, dockedNode, lockedNode } = useBaseUiContext()
    const { t } = useI18n()

    const cleanFieldName = fieldName.length && fieldName[0] === '=' ? fieldName.slice(1) : fieldName

    const useStyles = makeStyles()((theme: Theme) => ({
        listItemRoot: {
            minWidth: '47px'
        },
        menuItemRoot: {
            '&:hover': {
                backgroundColor: `${theme.palette.background.default} !important`,
                color: `${theme.palette.text.primary} !important`
            }
        },
        icon: {
            color: theme.palette.primary.main
        },
        svgIcon: {
            fontSize: '1.3rem',
            color: theme.palette.text.primary,
            opacity: 1,
            cursor: 'pointer !important',
            marginRight: '5px'
        },
        svgIconInfo: {
            fontSize: '1.3rem',
            color: theme.palette.text.primary,
            opacity: 1,
            cursor: 'pointer !important',
            marginRight: '0px'
        },
        tooltipArrow: {
            color: theme.palette.secondary.main
        },
        tooltipRoot: {
            border: 'solid 1.5px',
            borderColor: theme.palette.primary.main
        },
        tooltip: {
            padding: 0,
            maxWidth: '500px',
            '@media (max-width: 1001px)': {
                padding: '10px 0px'
            }
        },
        verticalTooltip: {
            padding: '10px 0px'
        }
    }))

    const useChipStyles = makeStyles()((theme: Theme) => ({
        chipRoot: {
            minWidth: '138px',
            marginRight: isVertical ? '0px' : '10px',
            width: isVertical && '100%',
            border: cssChipReadOnly
                ? cssChipReadOnly?.border || '1px solid'
                : selectedCount > 0
                ? cssChipSelected?.border || '1px solid'
                : isFixed
                ? cssChipFixed?.border || '1px solid'
                : docked
                ? cssChipDocked?.border || '1px solid'
                : cssChipSelected?.border || '1px solid',
            borderColor:
                (selectedCount > 0
                    ? cssChipSelected?.borderColor
                    : isFixed
                    ? cssChipFixed?.borderColor
                    : docked
                    ? cssChipDocked?.borderColor
                    : cssChipSelected?.borderColor) || theme.palette.primary.main,
            borderTopLeftRadius: 70,
            borderTopRightRadius: 70,
            borderBottomLeftRadius: 70,
            borderBottomRightRadius: 70,
            backgroundColor:
                (selectedCount > 0
                    ? cssChipSelected?.background
                    : isFixed
                    ? cssChipDocked?.background
                    : docked
                    ? cssChipDocked?.background
                    : cssChipSelected?.background) || theme.palette.primary.main,
            '@media (max-width: 1001px)': !isVertical
                ? {
                      width: '100%',
                      marginRight: '0px'
                  }
                : {}
        },
        chipPrimaryText: {
            color:
                (selectedCount > 0
                    ? cssChipSelected?.color
                    : isFixed
                    ? cssChipFixed?.color
                    : docked
                    ? cssChipDocked?.color
                    : cssChipSelected?.color) || theme.palette.primary.contrastText,
            minWidth: '100px',
            fontSize: '0.9rem'
        },
        chipSecondaryText: {
            color:
                (selectedCount > 0
                    ? cssChipSelected?.color
                    : isFixed
                    ? cssChipFixed?.color
                    : docked
                    ? cssChipDocked?.color
                    : cssChipSelected?.color) || theme.palette.primary.contrastText,
            minWidth: '100px',
            fontSize: '0.625rem'
        }
    }))

    const { classes } = useStyles()
    const { classes: chipClasses } = useChipStyles()
    const { classes: menuClasses } = useMenuStyles()
    const theme = useTheme()

    useEffect(() => {
        setIsLocked(locked)
    }, [locked])

    const handleTooltipClose = e => {
        //PAM-20210125: Workaround ClickAwayListener
        let forceClosed = true
        const path = e?.composedPath() || e?.path
        for (const node of path) {
            if (node.id?.includes(`qplus-selection-field-${milliSeconds}`)) {
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

    const handleIconButtonClick = async (e: any, type: string) => {
        e.preventDefault()
        if (type === 'F' || type === 'D') {
            setIsOpen(true)
            return
        } else {
            const qApp = qAppMap.get(qlikAppId)
            if (!isReadOnly) {
                const f = await qApp.qApi.getField(fieldName)
                if (type === 'L') {
                    await f.$apiField.unlock()
                } else {
                    if (!docked) setDismiss(true)
                    await f.$apiField.clear()
                }
                setIsOpen(false)
            }
        }
    }

    const handleClearFieldClick = async () => {
        if (!isFixed) setDismiss(true)
        const qApp = qAppMap.get(qlikAppId)
        const field = await qApp?.qApi?.getField(fieldName)
        field?.$apiField.clear()
    }

    const handleContextMenuClose = () => {
        setOpen(false)
    }

    const handleIsDockedToggle = () => {
        if (!docked) {
            const a = [...dockedFields]
            if (
                !a.some(d => {
                    const sourceField =
                        d.qFieldName.length && d.qFieldName[0] === '='
                            ? d.qFieldName.slice(1)
                            : d.qFieldName

                    return `${sourceField}_${d.qAppId}` === `${cleanFieldName}_${qlikAppId}`
                })
            ) {
                a.push({
                    isDocked: true,
                    qFieldName: fieldName,
                    isFixed: false,
                    qAppId: qlikAppId,
                    rank: Math.abs(new Date().valueOf())
                })
                setDockedFields(a)
            }
        } else {
            const d = dockedFields.filter(d => {
                const sourceField =
                    d.qFieldName.length && d.qFieldName[0] === '='
                        ? d.qFieldName.slice(1)
                        : d.qFieldName

                return `${sourceField}_${d.qAppId}` !== `${cleanFieldName}_${qlikAppId}`
            })
            setDockedFields(d)
        }
    }

    const handleLockSelection = async () => {
        const qApp = qAppMap.get(qlikAppId)
        const lock = isLocked
        if (!lock) {
            const f = await qApp.qApi.getField(fieldName)
            await f.$apiField.lock()
        } else {
            const f = await qApp.qApi.getField(fieldName)
            await f.$apiField.unlock()
        }
        setIsLocked(!lock)
        setOpen(false)
    }

    const handleContextMenu = e => {
        e.preventDefault()
        setAnchorEl(e.currentTarget)

        setOpen(true)
    }

    const translatedFieldName = t(cleanFieldName)

    const fieldLabel =
        label ||
        (translatedFieldName === '-' || !!translatedFieldName
            ? cleanFieldName
            : translatedFieldName)

    const fieldContent = (
        <>
            <Box
                style={{
                    fontWeight: isReadOnly
                        ? cssChipReadOnly?.fontWeight
                        : selectedCount > 0
                        ? cssChipSelected?.fontWeight
                        : docked
                        ? isFixed
                            ? cssChipFixed?.fontWeight
                            : cssChipDocked?.fontWeight
                        : cssChipSelected?.fontWeight || 500,
                    fontSize: isReadOnly
                        ? cssChipReadOnly?.fontSize
                        : selectedCount > 0
                        ? cssChipSelected?.fontSize
                        : docked
                        ? isFixed
                            ? cssChipFixed?.fontSize
                            : cssChipDocked?.fontSize
                        : cssChipSelected?.fontSize || '14px',
                    color: isReadOnly
                        ? cssChipReadOnly?.color
                        : selectedCount > 0
                        ? cssChipSelected?.color
                        : docked
                        ? isFixed
                            ? cssChipFixed?.color
                            : cssChipDocked?.color
                        : cssChipSelected?.color
                }}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{ marginTop: showAppWaterMark && !qSelected ? '4px' : undefined }}>
                    {showAppWaterMark && !qSelected && (
                        <Box sx={{ paddingRight: '8px', marginTop: '3px' }}>
                            <AppInfoIcon
                                initials={qAppMap.get(qlikAppId)?.qMeta?.initials}
                                title={qAppMap.get(qlikAppId)?.qTitle || ''}
                                text={qAppMap.get(qlikAppId)?.qDescription || ''}
                                backgroundColor={qAppMap.get(qlikAppId)?.qMeta?.backgroundColor}
                                color={qAppMap.get(qlikAppId)?.qMeta?.color}
                                fontSize="0.8rem"
                                fontWeight={600}
                                width={14}
                                height={14}
                            />
                        </Box>
                    )}
                    <Box>
                        {fieldLabel ? (
                            fieldLabel?.length < 30 ? (
                                <Typography
                                    className={`${chipClasses.chipPrimaryText} ${
                                        classNames?.primaryText || ''
                                    }`}>
                                    {fieldLabel}
                                </Typography>
                            ) : (
                                <IconTooltip title={fieldLabel}>
                                    <Typography
                                        className={`${chipClasses.chipPrimaryText} ${
                                            classNames?.primaryText || ''
                                        }`}>
                                        {`${fieldLabel?.slice(0, 29)}...`}{' '}
                                    </Typography>
                                </IconTooltip>
                            )
                        ) : (
                            ''
                        )}
                    </Box>
                </Box>
            </Box>
            {showSelectedValues || showAppWaterMark ? (
                <Box
                    style={{
                        fontWeight: isReadOnly
                            ? cssChipReadOnly?.fontWeight
                            : selectedCount > 0
                            ? cssChipSelected?.fontWeight
                            : docked
                            ? isFixed
                                ? cssChipFixed?.fontWeight
                                : cssChipDocked?.fontWeight
                            : cssChipSelected?.fontWeight || 500,
                        fontSize: '9px',
                        color: isReadOnly
                            ? cssChipReadOnly?.color
                            : selectedCount > 0
                            ? cssChipSelected?.color
                            : docked
                            ? isFixed
                                ? cssChipFixed?.color
                                : cssChipDocked?.color
                            : cssChipSelected?.color || '#000'
                    }}>
                    <Box display="flex" alignItems="center" justifyContent="center">
                        {showAppWaterMark && qSelected && (
                            <Box sx={{ padding: '2px' }}>
                                <AppInfoIcon
                                    initials={qAppMap.get(qlikAppId)?.qMeta?.initials}
                                    title={qAppMap.get(qlikAppId)?.qTitle}
                                    text={qAppMap.get(qlikAppId)?.qDescription}
                                    backgroundColor={qAppMap.get(qlikAppId)?.qMeta?.backgroundColor}
                                    color={qAppMap.get(qlikAppId)?.qMeta?.color}
                                    fontSize="0.725rem"
                                    fontWeight={500}
                                    width={10}
                                    height={10}
                                />
                            </Box>
                        )}

                        <Box
                            sx={{
                                padding: showAppWaterMark ? '4px' : undefined,
                                marginTop: showAppWaterMark ? '-4px' : undefined
                            }}
                            flexGrow={1}>
                            {showSelectedValues &&
                                (qSelected ? (
                                    qSelected?.length < 20 ? (
                                        <Typography
                                            sx={{ opacity: 0.6 }}
                                            className={`${chipClasses.chipSecondaryText} ${
                                                classNames?.secondaryText || ''
                                            }`}>
                                            {qSelected}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            sx={{ opacity: 0.6 }}
                                            className={`${chipClasses.chipSecondaryText} ${
                                                classNames?.secondaryText || ''
                                            }`}>
                                            {`${qSelected?.slice(0, 19)}...`}{' '}
                                        </Typography>
                                    )
                                ) : (
                                    ''
                                ))}
                        </Box>
                    </Box>
                </Box>
            ) : null}
        </>
    )

    const id = open ? 'reference-popper' : undefined

    return !dismiss ? (
        <ClickAwayListener onClickAway={e => handleTooltipClose(e)}>
            <LightTooltip
                id={`qplus-selection-field-${milliSeconds}`}
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
                className={isVertical ? classes.verticalTooltip : classes.tooltip}
                title={
                    tooltipOptions?.isNative ? (
                        <QlikSelectionNativeFieldTooltip
                            fieldName={fieldName}
                            sortCriterias={sortCriterias}
                            label={label}
                            qlikAppId={qlikAppId}
                            color={color}
                            width={tooltipOptions?.width || ''}
                            height={tooltipOptions?.height || ''}
                        />
                    ) : (
                        <QlikSelectionFieldTooltip
                            onTooltipClose={() => setIsOpen(false)}
                            fieldName={fieldName}
                            qlikAppId={qlikAppId}
                            toggle={toggle}
                            softLock={softLock}
                            color={color}
                            width={tooltipOptions?.width || ''}
                            height={tooltipOptions?.height || ''}
                        />
                    )
                }>
                <div
                    onMouseLeave={handleContextMenuClose}
                    onContextMenu={e => handleContextMenu(e)}>
                    <Chip
                        variant="filled"
                        classes={{
                            root: chipClasses.chipRoot,
                            label: chipClasses.chipPrimaryText,
                            deleteIcon: classes.icon,
                            deleteIconColorPrimary: classes.icon,
                            deleteIconColorSecondary: classes.icon
                        }}
                        itemID={`chip_${milliseconds}`}
                        aria-describedby={id}
                        data-value={'demo'}
                        label={fieldContent}
                        deleteIcon={
                            <>
                                {infoOptions ? (
                                    <IconTooltip title={ReactHtmlParser(infoOptions?.title || '')}>
                                        <IconButton size="small" style={{ paddingRight: '0px' }}>
                                            <HelpOutlineIcon
                                                className={classes.svgIconInfo}
                                                style={{
                                                    color: infoOptions?.color || '#E87811'
                                                }}
                                            />
                                        </IconButton>
                                    </IconTooltip>
                                ) : null}
                                <IconTooltip
                                    title={`${
                                        isLocked
                                            ? t(translation.lockedFilter)
                                            : selectedCount > 0
                                            ? t(translation.clearField)
                                            : t(translation.dockedFilter)
                                    }`}>
                                    <IconButton
                                        size="small"
                                        data-tag={
                                            isLocked
                                                ? 'L'
                                                : isFixed && selectedCount === 0
                                                ? 'F'
                                                : docked && selectedCount === 0
                                                ? 'D'
                                                : 'C'
                                        }
                                        onClick={e =>
                                            handleIconButtonClick(
                                                e,
                                                isLocked
                                                    ? 'L'
                                                    : isFixed && selectedCount === 0
                                                    ? 'F'
                                                    : docked && selectedCount === 0
                                                    ? 'D'
                                                    : 'C'
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}>
                                        {!isLocked && selectedCount > 0 ? (
                                            <ClearIcon
                                                className={classes.svgIcon}
                                                style={{
                                                    color:
                                                        (isReadOnly
                                                            ? cssChipReadOnly?.iconColor
                                                            : selectedCount > 0
                                                            ? cssChipSelected?.iconColor
                                                            : isFixed
                                                            ? cssChipFixed?.iconColor
                                                            : docked
                                                            ? cssChipDocked?.iconColor
                                                            : cssChipSelected?.iconColor) ||
                                                        theme.palette.primary.contrastText
                                                }}
                                            />
                                        ) : isLocked ? (
                                            lockedNode ? (
                                                lockedNode
                                            ) : (
                                                <LockIcon
                                                    className={classes.svgIcon}
                                                    style={{
                                                        color:
                                                            (isReadOnly
                                                                ? cssChipReadOnly?.iconColor
                                                                : selectedCount > 0
                                                                ? cssChipSelected?.iconColor
                                                                : isFixed
                                                                ? cssChipFixed?.iconColor
                                                                : docked
                                                                ? cssChipDocked?.iconColor
                                                                : cssChipSelected?.iconColor) ||
                                                            theme.palette.primary.contrastText
                                                    }}
                                                />
                                            )
                                        ) : docked || !isFixed ? (
                                            dockedNode ? (
                                                dockedNode
                                            ) : (
                                                <FilterListIcon
                                                    className={classes.svgIcon}
                                                    style={{
                                                        color:
                                                            (isReadOnly
                                                                ? cssChipReadOnly?.iconColor
                                                                : selectedCount > 0
                                                                ? cssChipSelected?.iconColor
                                                                : isFixed
                                                                ? cssChipFixed?.iconColor
                                                                : docked
                                                                ? cssChipDocked?.iconColor
                                                                : cssChipSelected?.iconColor) ||
                                                            theme.palette.primary.contrastText
                                                    }}
                                                />
                                            )
                                        ) : filterNode ? (
                                            filterNode
                                        ) : (
                                            <FilterListIcon
                                                className={classes.svgIcon}
                                                style={{
                                                    color:
                                                        (isReadOnly
                                                            ? cssChipReadOnly?.iconColor
                                                            : selectedCount > 0
                                                            ? cssChipSelected?.iconColor
                                                            : isFixed
                                                            ? cssChipFixed?.iconColor
                                                            : docked
                                                            ? cssChipDocked?.iconColor
                                                            : cssChipSelected?.iconColor) ||
                                                        theme.palette.primary.contrastText
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                </IconTooltip>
                            </>
                        }
                        onClick={e => handleToggleTooltipOpen(e)}
                        onDelete={e =>
                            !isLocked && selectedCount > 0
                                ? handleClearFieldClick()
                                : handleContextMenu(e)
                        }
                        style={
                            isReadOnly
                                ? cssChipReadOnly
                                : selectedCount > 0
                                ? cssChipSelected
                                : docked
                                ? isFixed
                                    ? cssChipFixed
                                    : cssChipDocked
                                : cssChipSelected
                        }
                    />
                    <Popper
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        transition
                        placement="top"
                        sx={{ zIndex: 2 }}>
                        {({ TransitionProps }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    zIndex: 2
                                }}>
                                <Paper className={menuClasses.paper}>
                                    <MenuList className={menuClasses.list} autoFocus>
                                        <MenuItem
                                            disabled={selectedCount === 0}
                                            classes={{ root: classes.menuItemRoot }}>
                                            <FormControlLabel
                                                control={
                                                    <BaseSwitch
                                                        color="secondary"
                                                        checked={isLocked}
                                                        onChange={handleLockSelection}
                                                        name="lock"
                                                        disabled={selectedCount === 0}
                                                    />
                                                }
                                                label={t(translation.lockFilter)}
                                                sx={{ color: theme.palette.text.primary }}
                                            />
                                        </MenuItem>

                                        <MenuItem classes={{ root: classes.menuItemRoot }}>
                                            <FormControlLabel
                                                control={
                                                    <BaseSwitch
                                                        checked={isFixed || docked}
                                                        onChange={handleIsDockedToggle}
                                                        name="docked"
                                                        disabled={isFixed}
                                                        color="secondary"
                                                    />
                                                }
                                                label={t(translation.dockFilter)}
                                                sx={{ color: theme.palette.text.primary }}
                                            />
                                        </MenuItem>
                                    </MenuList>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
            </LightTooltip>
        </ClickAwayListener>
    ) : null
}

export default memo(QlikSelectionField)
