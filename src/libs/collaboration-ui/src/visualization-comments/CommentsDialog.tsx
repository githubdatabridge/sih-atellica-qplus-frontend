import React, { FC, memo } from 'react'

import { useLocation } from 'react-router-dom'

import DialogContent from '@mui/material/DialogContent'

import { CommentsProvider } from '@libs/collaboration-providers'
import { PaginationProvider, useI18n } from '@libs/common-providers'
import { DraggableDialog } from '@libs/common-ui'

import translation from '../constants/translation'
import CommentsList from './CommentsList'
import ParentCommentInput from './input/ParentCommentInput'

export interface ICommentsDialogProps {
    searchParams?: URLSearchParams
    hideBackdrop?: boolean
}

const CommentsDialog: FC<ICommentsDialogProps> = ({ searchParams, hideBackdrop = true }) => {
    const location = useLocation()
    const pageId = location.pathname

    const { t } = useI18n()

    return (
        <PaginationProvider>
            <CommentsProvider>
                <DraggableDialog
                    closeTooltipText={t('qplus-dialog-close')}
                    hideBackdrop={hideBackdrop}
                    searchParams={searchParams}
                    pageId={pageId}
                    title={t(translation.collaborationDialogTitle)}>
                    <ParentCommentInput />
                    <DialogContent style={{ padding: 0 }}>
                        <CommentsList />
                    </DialogContent>
                </DraggableDialog>
            </CommentsProvider>
        </PaginationProvider>
    )
}

export default memo(CommentsDialog)
