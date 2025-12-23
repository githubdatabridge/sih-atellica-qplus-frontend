import React, { FC, useEffect, useState } from 'react'

import { QlikSocialCommentContext } from '@libs/collaboration-providers'
import { BasicUserInfo } from '@libs/common-models'
import { ConditionalWrapper } from '@libs/common-ui'

import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import QlikReportingCommentButton from '../button/QlikReportingCommentButton'

export type TQlikReportingCommentDialogClasses = {
    commentButton?: string
}

export interface IQlikReportingCommentDialogProps {
    classNames?: Partial<TQlikReportingCommentDialogClasses>
}

export const QlikReportingCommentDialog: FC<IQlikReportingCommentDialogProps> = ({
    classNames
}) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [userMentionSuggestions, setUserMentionSuggestions] = useState<BasicUserInfo[]>([])
    const { reportUserMentionSuggestions, reportId } = useQlikReportingContext()

    useEffect(() => {
        setIsDisabled(true)
        setUserMentionSuggestions(reportUserMentionSuggestions)
        setIsDisabled(false)
        return () => {
            setUserMentionSuggestions([])
        }
    }, [reportUserMentionSuggestions])

    useEffect(() => {
        setIsDisabled(!reportId || reportId === 0 || Number.isNaN(reportId))
    }, [reportId])

    return (
        <ConditionalWrapper
            condition={!isDisabled}
            wrapper={children => (
                <QlikSocialCommentContext.Provider
                    value={{
                        userMentionSuggestions
                    }}>
                    {children}
                </QlikSocialCommentContext.Provider>
            )}>
            <QlikReportingCommentButton
                classNames={{
                    commentButton: classNames?.commentButton || ''
                }}
            />
        </ConditionalWrapper>
    )
}

export default React.memo(QlikReportingCommentDialog)
