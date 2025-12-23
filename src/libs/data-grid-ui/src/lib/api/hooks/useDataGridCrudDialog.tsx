import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

import { makeStyles } from 'tss-react/mui'

import { BaseSwitch, ConfirmationDialog, StyledLoadingButton } from '@libs/common-ui'

import { DataTypesEnum, IDataGridCrudDialog } from '../types'

const useDataGridCrudDialog: ({
    mode,
    crud,
    onHide,
    refetch,
    keyField,
    editRowId,
    selectedRow,
    crudColumns,
    setSelectedRow
}: IDataGridCrudDialog) => {
    actionBlock: ReactNode
    deleteBlock: ReactNode
    newAndEditBlock: ReactNode
    actionBlockClass: any
} = ({
    mode,
    crud,
    onHide,
    refetch,
    keyField,
    editRowId,
    selectedRow,
    crudColumns,
    setSelectedRow
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<any>({})
    const formValueSetter = useCallback(
        (accessor: string, value: any) =>
            setSelectedRow((prevState: any) => ({ ...prevState, [accessor]: value })),
        [setSelectedRow]
    )

    const { classes: classesButton } = useButtonStyles()
    const { classes: classesSwitch } = useSwitcherStyles()
    const { classes: classesInput } = useInputStyles()
    const { classes: classesSelect } = useSelectStyles()

    const setErrorHelper = useCallback(
        (accessor: string, message: string) =>
            setErrors((prevState: any) => ({ ...prevState, [accessor]: message })),
        []
    )

    useEffect(() => {
        for (const col of crudColumns) {
            if (col?.validate && mode !== 'delete') {
                for (const val of col.validate) {
                    if (val?.rule(selectedRow[col.accessor])) {
                        return setErrorHelper(col.accessor, val.errorMessage)
                    } else {
                        setErrorHelper(col.accessor, '')
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow])

    const validateRuleHelper = (el: any, value: any): any => {
        if (el?.validate) {
            for (const val of el.validate) {
                if (val.rule(value)) {
                    return setErrorHelper(el.accessor, val.errorMessage)
                } else {
                    setErrorHelper(el.accessor, '')
                }
            }
        }
        formValueSetter(el.accessor, value)
    }

    const FORM_FIELD_TYPES = (
        el: {
            accessor: any
            label: any
            lookup: {
                data: {
                    map: (
                        arg0: (
                            item: {
                                [x: string]:
                                    | boolean
                                    | React.ReactChild
                                    | React.ReactFragment
                                    | React.ReactPortal
                                    | null
                                    | undefined
                            },
                            i: never
                        ) => JSX.Element
                    ) => any
                }
                key: string | number
                value: string | number
            }
            type: string | number
        },
        value: any
    ) =>
        ({
            [DataTypesEnum.STRING]: (
                <Box my={1} key={el.accessor}>
                    <TextField
                        placeholder={`Enter ${el.accessor} value`}
                        error={el?.accessor ? !!errors[el?.accessor] : false}
                        defaultValue={value}
                        label={
                            <Typography
                                align="left"
                                color="primary"
                                className={classesInput.textField}>
                                {el.label}
                            </Typography>
                        }
                        color="primary"
                        className={classesInput.inputRoot}
                        InputProps={{
                            classes: {
                                root: classesInput.inputRoot,
                                underline: classesInput.underline,
                                input: classesInput.inputText,
                                error: classesInput.error
                            }
                        }}
                        onChange={e => validateRuleHelper(el, e.target.value)}
                    />
                    <Typography variant="caption" display="block" gutterBottom color="secondary">
                        {el?.accessor ? !!errors[el.accessor] && errors[el.accessor] : ''}
                    </Typography>
                </Box>
            ),
            [DataTypesEnum.MULTILINE]: (
                <Box my={1} key={el.accessor}>
                    <TextField
                        id="outlined-multiline-static"
                        label={
                            <Typography
                                align="left"
                                color="primary"
                                className={classesInput.textField}>
                                {el.label}
                            </Typography>
                        }
                        error={el?.accessor ? !!errors[el?.accessor] : false}
                        multiline
                        rows={4}
                        defaultValue={value}
                        onChange={e => validateRuleHelper(el, e.target.value)}
                        placeholder={`Enter ${el.accessor} value`}
                        InputProps={{
                            classes: {
                                root: classesInput.multiline,
                                input: classesInput.inputText,
                                underline: classesInput.underline,
                                error: classesInput.error
                            }
                        }}
                    />
                    <Typography variant="caption" display="block" gutterBottom color="secondary">
                        {el?.accessor ? !!errors[el.accessor] && errors[el.accessor] : ''}
                    </Typography>
                </Box>
            ),
            [DataTypesEnum.INTEGER]: (
                <Box my={1} key={el.accessor}>
                    <TextField
                        placeholder={`Enter ${el.accessor} value`}
                        error={el?.accessor ? !!errors[el?.accessor] : false}
                        type="number"
                        defaultValue={+value}
                        label={
                            <Typography
                                align="left"
                                color="primary"
                                className={classesInput.textField}>
                                {el.label}
                            </Typography>
                        }
                        color="primary"
                        className={classesInput.inputRoot}
                        InputProps={{
                            classes: {
                                root: classesInput.inputRoot,
                                underline: classesInput.underline,
                                input: classesInput.inputText,
                                error: classesInput.error
                            }
                        }}
                        onChange={e => validateRuleHelper(el, e.target.value)}
                    />
                    <Typography variant="caption" display="block" gutterBottom color="secondary">
                        {el?.accessor ? !!errors[el.accessor] && errors[el.accessor] : ''}
                    </Typography>
                </Box>
            ),
            [DataTypesEnum.DATE]: (
                <Box my={1} key={el.accessor}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={el.label}
                            value={value}
                            onChange={(date: any) => formValueSetter(el.accessor, date)}
                        />
                    </LocalizationProvider>
                    <Typography variant="caption" display="block" gutterBottom color="secondary">
                        {el?.accessor ? !!errors[el.accessor] && errors[el.accessor] : ''}
                    </Typography>
                </Box>
            ),
            [DataTypesEnum.ARRAY]: (
                <Box my={1} key={el.accessor}>
                    <FormControl className={classesSelect.formControl}>
                        <InputLabel id="form-select-label" className={classesSelect.inputLabel}>
                            {el.label}
                        </InputLabel>
                        <Select
                            labelId="form-select-label"
                            error={el?.accessor ? !!errors[el?.accessor] : false}
                            id="form-select"
                            placeholder="Select Option"
                            value={value}
                            label={el.label}
                            className={classesSelect.select}
                            onChange={e => formValueSetter(el.accessor, e.target.value)}
                            disableUnderline={true}>
                            {Array.isArray(el?.lookup?.data) &&
                                el?.lookup?.data?.map((item: any, i: number) => (
                                    <MenuItem
                                        className={classesSelect?.menuItem}
                                        value={el?.lookup?.key ? item[el?.lookup?.key] : ''}
                                        key={`${i}`}>
                                        {item[el?.lookup?.value]}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <Typography variant="caption" display="block" gutterBottom color="secondary">
                        {el?.accessor ? !!errors[el.accessor] && errors[el.accessor] : ''}
                    </Typography>
                </Box>
            ),
            [DataTypesEnum.BOOLEAN]: (
                <Box my={1} key={el.accessor}>
                    <FormControlLabel
                        control={
                            <BaseSwitch
                                disableRipple
                                color="secondary"
                                inputProps={{
                                    'aria-labelledby': 'crud'
                                }}
                                onChange={e => formValueSetter(el.accessor, e.target.checked)}
                                checked={value}
                            />
                        }
                        classes={{
                            label: classesSwitch.switchLabel
                        }}
                        label={el?.label || ''}
                    />
                </Box>
            )
        }[el.type] || null)

    const isEmpty = Object.keys(selectedRow).length === 0

    const crudFields =
        !isEmpty &&
        crudColumns?.map(
            el => el.accessor !== keyField && FORM_FIELD_TYPES(el, selectedRow[el.accessor])
        )

    const crudHelper = useCallback(
        (res: any) => {
            res.status > 199 && res.status < 300 && refetch()
        },
        [refetch]
    )

    const onSubmit = useCallback(
        async (id: number, row?: any) => {
            try {
                setLoading(true)
                if (mode === 'new') {
                    if (crud?.create) return await crud.create(row).then(res => crudHelper(res))
                }
                if (mode === 'edit') {
                    if (crud?.update) return await crud.update(id, row).then(res => crudHelper(res))
                }
                if (mode === 'delete') {
                    if (crud?.delete) return await crud.delete(id).then(res => crudHelper(res))
                }
            } catch (error: any) {
                console.log('Qplus Error', error)
                throw new Error(error)
            } finally {
                setLoading(false)
                onHide()
            }
        },
        [crud, crudHelper, mode, onHide]
    )

    const newAndEditBlock = (
        <Box display="flex" flexDirection="column" p={2} alignItems="left">
            {crudFields}
        </Box>
    )

    const actionBlock = (
        <Box display="flex" sx={{ width: '100%', mb: 1, mt: 1 }} justifyContent="flex-end">
            <Box p={1}>
                <Button
                    variant="outlined"
                    className={classesButton.buttonCancel}
                    onClick={onHide}
                    disabled={loading}>
                    Cancel
                </Button>
            </Box>
            <Box p={1}>
                <StyledLoadingButton
                    loading={loading}
                    classes={{
                        loadingIndicator: classesButton.buttonLoading,
                        root: Object.values(errors).filter(Boolean).length
                            ? undefined
                            : classesButton.buttonNew,
                        disabled: classesButton.buttonDisabled
                    }}
                    onClick={() => onSubmit(editRowId, selectedRow)}
                    disabled={!!Object.values(errors).filter(Boolean).length}>
                    Save
                </StyledLoadingButton>
            </Box>
        </Box>
    )

    const deleteBlock = (
        <ConfirmationDialog
            primaryText={'Are you sure you want to delete this record?'}
            noText="No"
            yesText="Yes"
            dialogTitleText={'Confirmation Dialog'}
            onClose={onHide}
            onNo={onHide}
            onYes={() => {
                onSubmit(selectedRow?.id)
            }}
            hideBackdrop={false}
        />
    )

    return {
        actionBlock,
        deleteBlock,
        newAndEditBlock,
        actionBlockClass: classesButton.container
    }
}

const useButtonStyles = makeStyles()((theme: Theme) => ({
    container: {
        borderTop: `1px solid ${theme.palette.divider}`
    },
    buttonLoading: {
        color: theme.palette.primary.contrastText
    },
    buttonDisabled: {
        border: `1px solid ${theme.palette.text.disabled}`,
        color: `${theme.palette.text.disabled} !important`,
        backgroundColor: 'transparent',
        minWidth: '100px',
        height: '36px',
        borderRadius: '4px',
        textTransform: 'none'
    },
    buttonNew: {
        minWidth: '100px',
        height: '36px',
        borderRadius: '4px',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
            boxShadow: 'none'
        },
        '&:disabled': {
            color: theme.palette.primary.contrastText
        }
    },
    buttonCancel: {
        height: '36px',
        borderRadius: '4px',
        minWidth: '100px',
        border: `1px solid ${theme.palette.text.primary}`,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        textTransform: 'none',
        '&:hover': {
            border: `1px solid ${theme.palette.text.primary}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        },
        '&:focus': {
            border: `1px solid ${theme.palette.text.primary}`,
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 'none'
        }
    }
}))

const useSwitcherStyles = makeStyles()((theme: Theme) => ({
    switchLabel: {
        fontSize: '0.825rem'
    }
}))

const useInputStyles = makeStyles()((theme: Theme) => ({
    input: {
        fontSize: '0.825rem'
    },
    text: {
        fontSize: '0.825rem'
    },
    menuItem: {},
    listItem: {
        fontSize: '0.85rem',
        color: theme.palette.text.primary
    },
    customInputLabel: {
        '& legend': {
            visibility: 'visible'
        }
    },
    inputRoot: {
        color: theme.palette.text.primary,
        height: '40px',
        width: '100%'
    },
    underline: {
        color: '#e0e0e0',
        '&&&:before': {
            borderBottom: '0px solid #e0e0e0'
        },
        '&&:after': {
            border: `0px solid ${theme.palette.primary.main}`
        }
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`
        }
    },
    cssFocused: {},
    notchedOutline: {
        borderWidth: '1px',
        borderColor: `${theme.palette.divider} !important`
    },
    inputText: {
        color: theme.palette.text.primary,
        fontSize: '0.875rem'
    },
    textField: {
        fontWeight: 500,
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
        marginTop: '-5px'
    },
    multiline: {
        width: '568px',
        fontSize: '0.875rem',
        color: theme.palette.text.primary
    },
    error: {
        'input, textarea': {
            '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1
            },
            '&:-ms-input-placeholder': {
                color: theme.palette.text.secondary
            },
            '&::-ms-input-placeholder': {
                color: theme.palette.text.secondary
            },
            marginTop: '-5px'
        }
    }
}))

const useSelectStyles = makeStyles()((theme: Theme) => ({
    formControl: {
        width: '100%',
        height: '45px'
    },
    inputLabel: {
        transform: 'translate(14px, 18px) scale(1)',
        border: '0px solid',
        textAlign: 'left',
        marginTop: '-28px',
        fontSize: '0.725rem'
    },
    select: {
        textAlign: 'left',
        height: '40px',
        fontSize: '15px',
        fontWeight: 500,
        paddingLeft: '10px',
        width: '100%'
    },
    menuItem: {
        height: '30px'
    }
}))

export default useDataGridCrudDialog
