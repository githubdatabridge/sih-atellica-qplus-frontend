import React, { FC, useState, useEffect, useRef, Suspense, lazy } from 'react'

import { useNavigate } from 'react-router-dom'

import CommentIcon from '@mui/icons-material/Comment'
import { IconButton, useTheme, Theme } from '@mui/material'

import querystring from 'query-string'
import { makeStyles } from 'tss-react/mui'

import {
    useQlikBaseSocialContext,
    useNotificationContext
} from '@libs/collaboration-providers'
import { useQuery } from '@libs/common-hooks'
import { useI18n } from '@libs/common-providers'
import { IconTooltip, Badge } from '@libs/common-ui'

// Lazy load to defer Draft.js loading
const CommentsDialog = lazy(() => import('@libs/collaboration-ui').then(m => ({ default: m.CommentsDialog })))

import translation from '../../constants/translations'
import {
    URL_QUERY_PARAM_REPORT_ID,
    URL_QUERY_PARAM_TYPE,
    URL_QUERY_PARAM_VALUE_TYPE_COMMENTS
} from '../../constants/constants'
import { useQlikReportingContext } from '../../contexts/QlikReportingContext'
import { useQlikReportingUiContext } from '../../contexts/QlikReportingUiContext'

export type TQlikReportingCommentButtonClasses = {
    commentButton?: string
}

export interface IQlikReportingCommentButtonProps {
    classNames?: Partial<TQlikReportingCommentButtonClasses>
}

const QlikReportingCommentButton: FC<IQlikReportingCommentButtonProps> = ({ classNames }) => {
    const [reportIdentifier, setReportIdentifier] = useState<number>(0)
    const [queryType, setQueryType] = useState<string>('')
    const [queryString, setQueryString] = useState<string>('')
    const [isDisabled, setIsDisabled] = useState<boolean>(true)
    const [commentCount, setCommentCount] = useState<number>(0)
    const [searchParams, setSearchParams] = useState<URLSearchParams>(null)

    const { pageId, setReportId } = useQlikBaseSocialContext()
    const { reportId, isReportSystem, getReportCommentCount } = useQlikReportingContext()
    const { reportCommentCountChangedSubject } = useNotificationContext()
    const { reportingCommentNode, cssReportingControlButtonIcon } = useQlikReportingUiContext()

    const navigate = useNavigate()
    const queryParams = useQuery()

    // Using ref to be able to catch notification for the specific reportId only when this report is currently displayed
    const qReportId = useRef<number>(0)

    const { t } = useI18n()

    const setReportIdFromQuery = (reportId: number) => {
        qReportId.current = reportId
        const params = new URLSearchParams()
        params.append(URL_QUERY_PARAM_REPORT_ID, reportId.toString())
        setSearchParams(params)
    }

    useEffect(() => {
        // The button should be disabled based on the reportId from the reporting component
        qReportId.current = reportId || 0
        if (qReportId.current > 0 && !isReportSystem) {
            void (async () => {
                const commentCount = await getReportCommentCount(qReportId.current)
                setCommentCount(commentCount)
            })()
        } else {
            setCommentCount(0)
        }
        setReportIdFromQuery(qReportId.current)
        setIsDisabled(!reportId || Number.isNaN(qReportId.current) || qReportId.current === 0)
        setReportIdentifier(qReportId.current)
        setReportId(qReportId.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId, isReportSystem])

    useEffect(() => {
        setIsDisabled(isReportSystem || qReportId.current === 0)
    }, [reportId, isReportSystem])

    useEffect(() => {
        if (reportIdentifier > 0) {
            setQueryType(queryParams.get(URL_QUERY_PARAM_TYPE) || '')
            setQueryString(
                querystring.stringify({
                    reportId: reportId,
                    type: URL_QUERY_PARAM_VALUE_TYPE_COMMENTS
                })
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportIdentifier, queryParams.get(URL_QUERY_PARAM_TYPE)])

    useEffect(() => {
        if (reportCommentCountChangedSubject) {
            reportCommentCountChangedSubject.attach(_observer => {
                if (_observer.data.reportId === qReportId.current) {
                    setCommentCount(_observer.data.count)
                }
            })
        }
        return () => {
            reportCommentCountChangedSubject?.detach((_observer: any) => undefined)
        }
    }, [])

    const onOpenDialog = () => navigate(`${pageId}?${queryString}`)

    const { classes } = useStyles()
    const theme = useTheme<Theme>()

    return (
        <>
            <IconTooltip title={t(translation.reportingCommentsDialogTooltip)}>
                <IconButton
                    color="primary"
                    aria-label="comments"
                    component="span"
                    onClick={onOpenDialog}
                    className={`${classes.iconButton} ${classNames?.commentButton || ''}`}
                    classes={{
                        root: classes.iconButtonRoot,
                        disabled: classes.iconButtonDisabled
                    }}
                    disabled={isDisabled}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        ...cssReportingControlButtonIcon
                    }}>
                    <Badge
                        classes={{ badge: classes.customBadge }}
                        badgeContent={commentCount}
                        max={99}>
                        {reportingCommentNode || <CommentIcon className={classes.iconSize} />}
                    </Badge>
                </IconButton>
            </IconTooltip>

            {/* The report id should become from the social context to avoid sync issues here */}
            {queryType === URL_QUERY_PARAM_VALUE_TYPE_COMMENTS && reportIdentifier > 0 && (
                <Suspense fallback={null}>
                    <CommentsDialog searchParams={searchParams} hideBackdrop={false} />
                </Suspense>
            )}
        </>
    )
}

export default React.memo(QlikReportingCommentButton)

const useStyles = makeStyles()((theme: Theme) => ({
    text: {
        fontSize: '0.75rem'
    },
    iconButton: {
        height: '100%',
        width: '100%',
        backgroundColor: `transparent`,
        color: theme.palette.primary.dark,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText
        }
    },
    iconButtonRoot: {
        padding: 0,
        height: '100%',
        width: '100%',
        borderRadius: '0px !important'
    },
    iconButtonDisabled: {},
    customBadge: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        zIndex: 1,
        top: '-2px'
    },
    iconSize: {
        width: '24px',
        height: '24px'
    }
}))
