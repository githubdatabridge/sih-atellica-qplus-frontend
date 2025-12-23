import React, { FC, useState, useEffect, useCallback } from 'react'

import { Box, Input, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'
import { BaseAutoComplete, ConfirmationDialog, IAutoCompleteData } from '@libs/common-ui'
import { useQlikAppContext, useQlikMasterItemContext } from '@libs/qlik-providers'

import translations from '../../constants/translations'

interface QlikDataSourceSelectProps {
    isDatasetDesigned: boolean
    setQlikAppIdCallback(value: string): void
    handleDatasetEraseCallback?: () => void
    newDatasetQlikAppId?: string
}

interface IQlikDataSourceData extends IAutoCompleteData {
    description?: string
}

const QlikDataSourceSelect: FC<QlikDataSourceSelectProps> = ({
    isDatasetDesigned,
    setQlikAppIdCallback,
    handleDatasetEraseCallback,
    newDatasetQlikAppId
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEraseDialogOpen, setIsEraseDialogOpen] = useState<boolean>(false)
    const [description, setDescription] = useState<string>('')
    const [entries, setEntries] = useState<IQlikDataSourceData[]>([])
    const [value, setValue] = useState<IQlikDataSourceData>(null)
    const [defaultValue, setDefaultValue] = useState<IQlikDataSourceData>(null)
    const { qAppMap } = useQlikAppContext()
    const { setQlikMasterItemsByAppId } = useQlikMasterItemContext()
    const { t } = useI18n()

    useEffect(() => {
        setIsLoading(true)
        const items: IQlikDataSourceData[] = []
        for (const [, value] of qAppMap) {
            if (newDatasetQlikAppId === value.qAppId) {
                setDefaultValue({
                    entry: {
                        key: value.qAppId,
                        value: value.qTitle
                    },
                    description: value.qDescription
                })
                setDescription(value?.qDescription || 'N/A')
                setQlikMasterItemsByAppId(value.qAppId)
            }
            items.push({
                entry: {
                    key: value.qAppId,
                    value: value.qTitle
                },
                description: value.qDescription
            })
        }
        setEntries(items)
        setIsLoading(false)
    }, [newDatasetQlikAppId, qAppMap, setQlikMasterItemsByAppId])

    const handleOnDataChangeCallback = useCallback(
        (value: IQlikDataSourceData) => {
            setValue(value)
            if (isDatasetDesigned) {
                setIsEraseDialogOpen(true)
            } else {
                setQlikAppIdCallback(value?.entry?.key)
                setDescription(value?.description)
                if (value?.entry?.key) {
                    setQlikMasterItemsByAppId(value?.entry?.key)
                }
            }
        },
        [isDatasetDesigned, setQlikAppIdCallback, setQlikMasterItemsByAppId]
    )

    const handleEraseDataset = () => {
        if (value) {
            setQlikAppIdCallback(value?.entry?.key)
            setDescription(value?.description)
            if (value?.entry?.key) {
                setQlikMasterItemsByAppId(value?.entry?.key)
            }

            handleDatasetEraseCallback()
        }
    }

    const { classes } = useStyles()

    return (
        <Box className={classes.mainContainer}>
            <Box textAlign="left" mb={8}>
                <BaseAutoComplete
                    isLoadingData={isLoading}
                    defaultValue={defaultValue}
                    label={t(translations.datasetDialogDatasourceSelect)}
                    inlineLabel={true}
                    options={entries}
                    width={300}
                    size="small"
                    handleChangeCallback={handleOnDataChangeCallback}
                    classNames={{
                        root: classes.autoCompleteRoot,
                        inputRoot: classes.autoCompleteInputRoot,
                        input: classes.autoCompleteInput,
                        listItem: classes.autoCompleteListItem,
                        label: classes.autoCompleteLabel,
                        option: classes.autoCompleteOption,
                        listbox: classes.autoCompleteListbox
                    }}
                />
            </Box>

            <Box>
                <Input
                    type="textarea"
                    className={classes.descriptionTextarea}
                    placeholder={t(translations.datasetDialogDescriptionPlaceholder)}
                    minRows={6}
                    multiline={true}
                    value={description}
                    readOnly={true}
                />
            </Box>
            {isEraseDialogOpen && (
                <ConfirmationDialog
                    primaryText={t(
                        translations.datasetDialogConfirmationEraseDatasourcePrimaryText
                    )}
                    hideBackdrop={false}
                    noText={t(translations.datasetConfirmationDialogNo)}
                    yesText={t(translations.datasetConfirmationDialogYes)}
                    dialogTitleText={t(translations.datasetConfirmationDialogTitle)}
                    onClose={() => setIsEraseDialogOpen(false)}
                    onNo={() => setIsEraseDialogOpen(false)}
                    onYes={() => {
                        handleEraseDataset()
                        setIsEraseDialogOpen(false)
                    }}
                />
            )}
        </Box>
    )
}

export default QlikDataSourceSelect

const useStyles = makeStyles()((theme: Theme) => ({
    mainContainer: {
        flexGrow: 1,
        flexDirection: 'column',
        display: 'flex',
        width: '100%',
        padding: '20px'
    },
    descriptionTextarea: {
        minHeight: '250px',
        padding: '8px',
        paddingRight: '30px',
        alignItems: 'baseline',
        background: theme.palette.background.default,
        width: '100%',
        fontSize: '0.825rem'
    },
    autoCompleteInputRoot: {
        fontSize: '0.925rem'
    },
    autoCompleteInput: {
        fontsize: '1rem'
    },
    autoCompleteRoot: {
        height: '25px'
    },
    autoCompleteListItem: {
        fontsize: '0.9rem'
    },
    autoCompleteLabel: {
        fontsize: '0.9rem'
    },
    autoCompleteOption: {
        fontSize: '0.9rem',
        padding: 0
    },
    autoCompleteListbox: {
        fontSize: '0.825rem',
        padding: 0
    }
}))
