import React, { FC } from 'react'

import { TextField, Theme, Autocomplete } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translations from '../../constants/translations'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(3)
        },
        minWidth: '300px',
        backgroundColor: theme.palette.background.default
    },
    inputRoot: {
        padding: '2px',
        fontSize: '0.825rem',
        backgroundColor: theme.palette.background.default
    },
    textFieldLabel: { fontSize: '0.825rem', color: theme.palette.text.primary, opacity: 0.6 },
    groupLabel: { fontSize: '8px', color: theme.palette.text.primary },
    tabs: { minHeight: 0, maxWidth: '350px' }
}))

type TOptionTag = {
    id: string
    name: string
}

interface IQlikReportFilterSelectTagsAutocompleteProps {
    tags: TOptionTag[]
    onHandleSelectTagCallback: (tags: TOptionTag[]) => void
}

const QlikReportFilterSelectTagsAutocomplete: FC<IQlikReportFilterSelectTagsAutocompleteProps> =
    React.memo(({ tags, onHandleSelectTagCallback }) => {
        const { classes } = useStyles()

        const [value, setValue] = React.useState<any>([])
        const { t } = useI18n()

        return (
            <div className={classes.root}>
                <Autocomplete
                    value={value}
                    classes={{ inputRoot: classes.inputRoot, groupLabel: classes.groupLabel }}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                        onHandleSelectTagCallback(newValue)
                    }}
                    size="small"
                    multiple
                    limitTags={1}
                    id="tags-filled"
                    style={{ width: '100%' }}
                    options={tags.map(option => option.name)}
                    freeSolo
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="filled"
                            InputLabelProps={{ className: classes.textFieldLabel }}
                            style={{ fontSize: '8px' }}
                            label={t(translations.reportingDialogFilterSearchByTags)}
                            placeholder={t(translations.reportingDialogFilterSearch)}
                        />
                    )}
                />
            </div>
        )
    })

export default QlikReportFilterSelectTagsAutocomplete
