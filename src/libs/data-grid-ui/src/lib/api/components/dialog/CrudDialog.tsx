import React, { FC } from 'react'

import { Box } from '@mui/material'

import { DraggableDialog } from '@libs/common-ui'

import useDataGridCrudDialog from '../../hooks/useDataGridCrudDialog'
import { IDataGridCrudDialog } from '../../types'

const CrudDialog: FC<IDataGridCrudDialog> = ({
    keyField,
    title,
    mode,
    crud,
    onHide,
    refetch,
    editRowId,
    selectedRow,
    crudColumns,
    setSelectedRow
}) => {
    const { actionBlock, deleteBlock, newAndEditBlock, actionBlockClass } = useDataGridCrudDialog({
        mode,
        crud,
        onHide,
        refetch,
        editRowId,
        selectedRow,
        crudColumns,
        setSelectedRow,
        keyField
    })
    return (
        <DraggableDialog title={title} dismissDialogCallback={onHide} hideBackdrop={false}>
            {mode === 'delete' ? (
                deleteBlock
            ) : (
                <>
                    {newAndEditBlock}
                    <Box className={actionBlockClass}>{actionBlock}</Box>
                </>
            )}
        </DraggableDialog>
    )
}

export default CrudDialog
