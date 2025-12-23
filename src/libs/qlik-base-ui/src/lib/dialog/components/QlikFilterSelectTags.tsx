import React, { FC } from 'react'

import { Autocomplete, TextField, Theme } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

import { useI18n } from '@libs/common-providers'

import translations from '../constants/translations'

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(3)
        }
    },
    inputRoot: { padding: '2px', fontSize: '0.825rem' },
    listbox: { fontSize: '0.825rem' },
    groupLabel: { fontSize: '0.825rem' },
    tabs: { minHeight: 0, maxWidth: '350px' },
    option: { fontSize: '0.825rem' }
}))

type TOptionTag = {
    id: string
    name: string
}

interface IQlikFilterSelectTagsProps {
    tags: TOptionTag[]
    onHandleSelectTagCallback: (tags: TOptionTag[]) => void
}

const QlikFilterSelectTags: FC<IQlikFilterSelectTagsProps> = React.memo(
    ({ tags, onHandleSelectTagCallback }) => {
        const { classes } = useStyles()

        const [value, setValue] = React.useState<any>([])
        const { t } = useI18n()

        return (
            <div className={classes.root}>
                <Autocomplete
                    value={value}
                    fullWidth
                    classes={{
                        inputRoot: classes.inputRoot,
                        groupLabel: classes.groupLabel,
                        option: classes.option,
                        listbox: classes.listbox
                    }}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                        onHandleSelectTagCallback(newValue)
                    }}
                    size="small"
                    multiple
                    limitTags={1}
                    id="tags-filled"
                    style={{ width: '350px' }}
                    options={tags.map(option => option.name)}
                    freeSolo
                    renderInput={params => (
                        <TextField
                            {...params}
                            variant="filled"
                            label={t(translations.dialogFilterSearchByTags)}
                            placeholder={t(translations.dialogFilterSearch)}
                            InputLabelProps={{
                                sx: { fontSize: '0.825rem' }
                            }}
                        />
                    )}
                />
            </div>
        )
    }
)

export default QlikFilterSelectTags
