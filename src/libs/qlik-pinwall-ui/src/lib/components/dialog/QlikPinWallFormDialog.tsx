import React, { FC, useCallback, useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { Box, Button, CircularProgress, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { AlertDuration, AlertType, DraggableDialog, useAlertContext } from '@libs/common-ui'
import { pinWallService } from '@libs/core-services'
import { useQlikSelectionContext } from '@libs/qlik-providers'

import { URL_QUERY_PARAM_VALUE_TYPE_PINWALL } from '../../constants/constants'
import translation from '../../constants/translations'
import { useGridWallContext } from '../../contexts/grid-wall-context'
import { useQlikPinWallDispatch, useQlikPinWallState } from '../../contexts/qlik-pin-wall-context'
import { addPinWall, updatePinWall } from '../../contexts/store/pinWall.actions'
import { useReplaceQueryParams } from '../../hooks'
import { TQlikPinWallClasses } from '../../QlikPinWall'
import QlikPinWallForm from '../form/QlikPinWallForm'
import QlikPinWallLayoutForm from '../form/QlikPinWallLayoutForm'
import QlikPinWallStylesForm from '../form/QlikPinWallStylesForm'
import QlikPinWallStepper from '../stepper/QlikPinWallStepper'

interface QlikPinWallFormDialogProps {
    classNames?: Partial<TQlikPinWallClasses>
    op?: string
}

const QlikPinWallFormDialog: FC<QlikPinWallFormDialogProps> = ({ classNames, op = 'create' }) => {
    const [padding, setPadding] = React.useState<number>(0)
    const [margin, setMargin] = React.useState<number>(0)
    const [step, setStep] = React.useState<number>(1)
    const [title, setTitle] = useState('')
    const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search))
    const [description, setDescription] = useState('')
    const [objectCount, setObjectCount] = useState(9)
    const [loading, setIsLoading] = useState(false)
    const { setReplaceQueryParams } = useReplaceQueryParams()
    const { setIsFixed, setRows } = useGridWallContext()
    const { detachFieldsFromContext } = useQlikSelectionContext()
    const navigate = useNavigate()
    const { pathname: pageId } = useLocation()
    const { t } = useI18n()
    const { showToast } = useAlertContext()
    const { activePinWall } = useQlikPinWallState()
    const dispatch = useQlikPinWallDispatch()

    const { classes } = useStyles()

    const replaceQueryParamHelper = useCallback(
        (pId: number) => {
            setReplaceQueryParams(pId, URL_QUERY_PARAM_VALUE_TYPE_PINWALL)
        },
        [setReplaceQueryParams]
    )

    useEffect(() => {
        if (activePinWall && op === 'edit') {
            setTitle(activePinWall?.title || '')
            setDescription(activePinWall?.description || '')
            setObjectCount(activePinWall?.content?.cellCount || 9)
            setPadding(activePinWall?.content?.meta?.layout?.padding || 0)
            setMargin(activePinWall?.content.meta?.layout?.margin || 0)
        }
    }, [activePinWall, op])

    const onResetFields = () => {
        setTitle('')
        setDescription('')
        setObjectCount(9)
        setPadding(0)
        setMargin(0)
        detachFieldsFromContext()
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true)
            const pinWall = await pinWallService.createPinWall({
                title,
                description,
                content: {
                    cells: [],
                    cellCount: objectCount,
                    meta: {
                        layout: {
                            padding,
                            margin
                        }
                    }
                }
            })
            // Add Empty Rows
            setRows([])
            dispatch(addPinWall(pinWall))
            replaceQueryParamHelper(pinWall.id)

            setIsFixed(false)
            onResetFields()
            showToast(
                t(translation.pinwallToastMsgCreateSuccess),
                AlertType.SUCCESS,
                AlertDuration.VERY_LONG
            )
        } catch (error) {
            showToast(
                t(translation.pinwallToastMsgCreateError),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        } finally {
            setIsLoading(false)
        }
    }

    const onUpdate = async () => {
        try {
            if (!activePinWall) return
            setIsLoading(true)
            const pinWall = await pinWallService.updatePinWall(activePinWall.id, {
                title,
                description,
                content: {
                    ...activePinWall.content,
                    cellCount: objectCount,
                    meta: {
                        layout: {
                            padding,
                            margin
                        }
                    }
                }
            })
            dispatch(updatePinWall(pinWall))
            setIsFixed(true)
            showToast(
                t(translation.pinwallToastMsgEditSuccess),
                AlertType.SUCCESS,
                AlertDuration.VERY_LONG
            )
        } catch (error) {
            onResetFields()
            showToast(
                t(translation.pinwallToastMsgEditError),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        } finally {
            onResetFields()
            setIsLoading(false)
        }
    }

    const handleOnObjectCountChange = (count: number) => setObjectCount(count)

    const handleOnTitleChange = (title: string) => setTitle(title)

    const handleOnDescriptionChange = (description: string) => setDescription(description)

    const handleOnPaddingChange = (padding: number) => setPadding(padding)

    const handleOnMarginChange = (margin: number) => setMargin(margin)

    const handleStepChange = async () => {
        if (step === 1 && (!title || !description)) {
            return showToast(
                t(translation.pinwallValidationMsg),
                AlertType.ERROR,
                AlertDuration.VERY_LONG
            )
        }
        if (step === 3) {
            op === 'create' ? await onSubmit() : await onUpdate()
            handleOnDialogCloseClick()
            return
        }
        setStep(step + 1)
    }

    const handleStepBack = () => {
        if (step === 1) {
            return
        }
        setStep(step - 1)
    }

    const handleOnDialogCloseClick = () => {
        const params = new URLSearchParams(window.location.search)
        params.delete('op')
        setSearchParams(params)
        navigate(`${pageId}?${params.toString()}`)
    }

    const isButtonDisabled = loading || !title || !description

    return (
        <DraggableDialog
            closeTooltipText={t('qplus-dialog-close')}
            title={
                op === 'create'
                    ? t(translation.pinwallDialogNewTitle)
                    : t(translation.pinwallDialogEditTitle)
            }
            dismissDialogCallback={handleOnDialogCloseClick}
            pageId={pageId}
            searchParams={searchParams}
            hideBackdrop={false}
            dialogProps={{ maxWidth: 'sm' }}>
            <Box display="flex" flexDirection="column" p={2} flexGrow="1">
                <QlikPinWallStepper step={step} />
                {step === 1 && (
                    <QlikPinWallForm
                        defaultTitle={title}
                        defaultDescription={description}
                        onSetDescriptionCallback={handleOnDescriptionChange}
                        onSetTitleCallback={handleOnTitleChange}
                    />
                )}
                {step === 2 && (
                    <QlikPinWallLayoutForm
                        onSetLayoutCallback={handleOnObjectCountChange}
                        defaultCellCount={objectCount}
                    />
                )}
                {step === 3 && (
                    <QlikPinWallStylesForm
                        defaultMargin={margin}
                        defaultPadding={padding}
                        onMarginCallback={handleOnMarginChange}
                        onPaddingCallback={handleOnPaddingChange}
                    />
                )}
                <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
                    {step !== 1 ? (
                        <Button
                            onClick={handleStepBack}
                            className={`${classes.buttonCancel} ${classNames?.buttonCancel || ''}`}>
                            {t(translation.pinwallStepperBack)}
                        </Button>
                    ) : null}
                    <Box mr={2} />
                    <Button
                        onClick={handleStepChange}
                        className={
                            isButtonDisabled
                                ? classes.buttonDisabled
                                : `${classes.buttonSave} ${classNames?.buttonSave || ''}`
                        }
                        disabled={isButtonDisabled}>
                        {step !== 3 ? (
                            t(translation.pinwallStepperNext)
                        ) : loading ? (
                            <CircularProgress color="secondary" size={20} />
                        ) : (
                            t(translation.pinwallDialogNewSave)
                        )}
                    </Button>
                </Box>
            </Box>
        </DraggableDialog>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    buttonCancel: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: `${theme.palette.background.default} !important`,
            boxShadow: 'none'
        },
        textTransform: 'none'
    },
    buttonSave: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            boxShadow: 'none'
        },
        textTransform: 'none'
    },
    buttonDisabled: {
        paddingLeft: '25px',
        paddingRight: '25px',
        height: '36px',
        borderRadius: '25px',
        minWidth: '96px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${theme.palette.text.disabled}`,
        color: theme.palette.text.disabled,
        textTransform: 'none'
    }
}))

export default QlikPinWallFormDialog
