import React, { FC, useEffect, useRef } from 'react'

import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { Box, Container, DialogContent, IconButton, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { DraggableDialog, IconTooltip } from '@libs/common-ui'
import { QFieldFilter } from '@libs/qlik-models'

import QlikFilterList from './components/QlikFilterList'
import translations from './constants/translations'

type TQlikFilterClasses = {
    iconButton?: string
}

export interface IQlikFilterDialogProps {
    title?: string
    qlikAppIds?: string[]
    filterIds?: string[]
    filterTags?: string[]
    onCloseCallbackHandler?: () => void
    defaultFilters?: QFieldFilter[]
    isDisabled?: boolean
    isEmptyWithoutFiltering?: boolean
    iconNode?: React.ReactNode
    cssButton?: any
    hideBackdrop?: boolean
    color?: 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning' | 'inherit'
    LoaderComponent?: JSX.Element
    classNames?: TQlikFilterClasses
}

const QlikFilterDialog: FC<IQlikFilterDialogProps> = React.memo(
    ({
        title,
        qlikAppIds = [],
        filterIds = [],
        filterTags = [],
        color,
        defaultFilters,
        iconNode,
        isDisabled = false,
        isEmptyWithoutFiltering = false,
        hideBackdrop = false,
        cssButton,
        LoaderComponent,
        classNames,
        onCloseCallbackHandler
    }) => {
        const { classes } = useStyles()
        const [open, setOpen] = React.useState<boolean>(false)
        const [disabled, setDisabled] = React.useState<boolean>(false)

        const { t } = useI18n()
        const newRef = useRef<any>()

        useEffect(() => {
            setDisabled(isDisabled)
        }, [isDisabled])

        const handleClickOpen = () => {
            setOpen(true)
        }

        const handleClose = () => {
            setOpen(false)
            if (onCloseCallbackHandler) {
                onCloseCallbackHandler()
            }
        }

        return (
            <>
                <div ref={newRef}>
                    <IconTooltip title={'Filter'}>
                        <IconButton
                            aria-label="filter-dialog"
                            color={color || 'primary'}
                            component="span"
                            disabled={disabled}
                            className={`${classes.iconButton} ${classNames?.iconButton}`}
                            style={{ ...cssButton }}
                            onClick={handleClickOpen}>
                            {iconNode || <FilterAltIcon width="24" height="24" />}
                        </IconButton>
                    </IconTooltip>
                </div>
                {open && !disabled && (
                    <DraggableDialog
                        dismissDialogCallback={handleClose}
                        closeTooltipText={t('qplus-dialog-close')}
                        title={title || t(translations.dialogFilterDialogTitle)}
                        dialogProps={{ maxWidth: 'md' }}
                        hideBackdrop={hideBackdrop}>
                        <DialogContent style={{ padding: '0px' }}>
                            <Container className={classes.container}>
                                <Box p={2}>
                                    <QlikFilterList
                                        qlikAppIds={qlikAppIds}
                                        filterTags={filterTags}
                                        filterIds={filterIds}
                                        isEmptyWithoutFiltering={isEmptyWithoutFiltering}
                                        height="400px"
                                        rowsPage={Math.floor(325 / 50)}
                                        defaultFilters={defaultFilters}
                                        LoaderComponent={LoaderComponent}
                                        color={color}
                                    />
                                </Box>
                            </Container>
                        </DialogContent>
                    </DraggableDialog>
                )}
            </>
        )
    }
)

export default QlikFilterDialog

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        padding: '0px',
        height: '500px'
    },
    paper: {
        flexGrow: 1,
        width: '100%',
        boxShadow: 'none',
        height: '500px'
    },
    rowLayout: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center' // To be vertically aligned
    },
    textField: {
        fontWeight: 500
    },
    box: {
        textAlign: 'center',
        borderBottom: '1px solid #ebebeb',
        paddingLeft: '0px',
        paddingRight: '0px',
        paddingBottom: '0px',
        paddingTop: '30px'
    },
    iconButton: {
        cursor: 'pointer'
    }
}))
