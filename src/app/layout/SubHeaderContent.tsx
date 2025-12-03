import { FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import querystring from 'query-string'
import { makeStyles } from 'tss-react/mui'
import { Box, CircularProgress, IconButton, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined'
import {
    QplusBaseIconTooltip,
    QplusBookmarkCreateDialog,
    QplusBookmarkListDialog,
    QplusFilterDialog,
    QplusSelectionBarDocked,
    useQplusReportingContext,
    useQplusSelectionContext,
    useWindowDimensions,
    useQplusLoaderContext
} from '@databridge/qplus'

import { useAppContext } from 'app/context/AppContext'
import ClearButton from 'app/layout/components/button/ClearButton'
import SelectionBar from 'app/layout/components/chip/SelectionBar'

import SelectView, { Page } from './components/select/SelectView'

interface SubHeaderContentProps {
    parentPages: Page[]
    handleOnPageChangeCallback: (page: string) => void
    subPages?: string[]
    currentSubPage?: string
    handleOnSubPageChangeCallback?: (subPage: string) => void
    additionalContent?: React.ReactNode
    subMenuOptions?: React.ReactNode
    shouldHideSubSettings?: boolean
    enableFilters?: boolean
}

const SubHeaderContent: FC<SubHeaderContentProps> = ({
    parentPages,
    handleOnPageChangeCallback,
    additionalContent,
    shouldHideSubSettings = false,
    enableFilters = true
}) => {
    const location = useLocation()
    const { pathname: pageId } = useLocation()
    const name = /[^/]*$/.exec(location.pathname)[0]
    const theme = useTheme<Theme>()
    const [selectionCounter, setSelectionCounter] = useState<number>(0)
    const [selectionBarWidth, setSelectionBarWidth] = useState<number>()
    const [dockedSelectionBarWidth, setDockedSelectionBarWidth] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { isQlikMasterItemLoading } = useQplusLoaderContext()
    const { qGlobalSelectionCount } = useQplusSelectionContext()
    const { clearReport } = useQplusReportingContext()
    const { width } = useWindowDimensions()
    const { pages } = useAppContext()

    const { classes } = useStyles()

    const appContext = useAppContext()

    const queryString = querystring.stringify({
        op: 'create'
    })

    useEffect(() => {
        setIsLoading(isQlikMasterItemLoading)
    }, [isQlikMasterItemLoading])

    useEffect(() => {
        const x = qGlobalSelectionCount > 0 ? width - 800 : width - 600
        setSelectionBarWidth(width - 450)
        setDockedSelectionBarWidth(x)
    }, [qGlobalSelectionCount, width])

    useEffect(() => {
        setSelectionCounter(qGlobalSelectionCount)
    }, [qGlobalSelectionCount])

    const handleOnReportClearClick = () => {
        clearReport()
    }

    const PAGE_NAME = pageId.includes('compliance') ? 'compliance' : 'audit'

    return (
        <div className={classes.container}>
            <Box display="flex" className={classes.view}>
                <Box p={1} flexGrow={0} width="25%" maxWidth="300px" minWidth="300px">
                    <SelectView
                        pages={parentPages}
                        handleOnPageChangeCallback={handleOnPageChangeCallback}
                    />
                </Box>

                <Box flexGrow={1} width="60%">
                    <SelectionBar width={selectionBarWidth} />
                </Box>

                <Box
                    width="15%"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    flexDirection="row">
                    {name === 'reporting' ? (
                        <Box mr={1}>
                            <QplusBaseIconTooltip title="Add Report">
                                <IconButton
                                    className={classes.actionButton}
                                    onClick={handleOnReportClearClick}>
                                    <Typography className={classes.actionButtonText}>
                                        Add Report
                                    </Typography>
                                </IconButton>
                            </QplusBaseIconTooltip>
                        </Box>
                    ) : null}
                    {name === 'pinwall' ? (
                        <Box mr={1}>
                            <QplusBaseIconTooltip title={'Add PinWall'}>
                                <IconButton
                                    className={classes.actionButton}
                                    component={Link}
                                    to={`${pageId}?${queryString}`}
                                    key="header-create">
                                    <Typography className={classes.actionButtonText}>
                                        Add PinWall
                                    </Typography>
                                </IconButton>
                            </QplusBaseIconTooltip>
                        </Box>
                    ) : null}
                </Box>
            </Box>

            <Box display="flex" className={classes.subView}>
                <Box p={1} flexGrow={0} width="25%" maxWidth="300px" minWidth="300px"></Box>

                <Box flexGrow={1} width={'100%'}>
                    <Box display="flex" className={classes.clearContainer}>
                        {selectionCounter > 0 ? (
                            <Box pl="41px" mr="-5px">
                                <ClearButton />
                            </Box>
                        ) : null}
                        <Box flexGrow="1">
                            <QplusSelectionBarDocked
                                color="secondary"
                                showAppWatermark={false}
                                cssChipDocked={{
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    letterSpacing: 0,
                                    height: '40px',
                                    borderWidth: '0px',
                                    marginRight: '10px',
                                    borderRadius: '4px',
                                    backgroundColor: theme.palette.common.highlight10
                                }}
                                cssChipFixed={{
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    letterSpacing: 0,
                                    height: '40px',
                                    borderWidth: '0px',
                                    marginRight: '10px',
                                    borderRadius: '4px',
                                    backgroundColor: theme.palette.common.highlight5
                                }}
                                cssTabs={
                                    name === 'compliance' || name === 'audit'
                                        ? {
                                              marginBottom: '10px',
                                              width: `${dockedSelectionBarWidth}px`
                                          }
                                        : { width: `${dockedSelectionBarWidth}px` }
                                }
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    alignSelf="self-end"
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    pb="4px">
                    <Box pr={2}>
                        <QplusBookmarkCreateDialog
                            classNames={{
                                iconButton: classes.controlButton,
                                iconButtonDisabled: classes.controlButtonDisabled
                            }}
                            enableIsPublic={false}
                            icon={<BookmarkAddOutlinedIcon />}
                        />
                    </Box>
                    <Box pr={2}>
                        <QplusBookmarkListDialog
                            classNames={{ iconButton: classes.controlButton }}
                            icon={<BookmarksOutlinedIcon />}
                            scopedToPath={true}
                        />
                    </Box>

                    {name !== 'pinwall' &&
                        name !== 'reporting' &&
                        (isLoading ? (
                            <IconButton className={classes.controlButton}>
                                <CircularProgress color="secondary" size={20} />
                            </IconButton>
                        ) : (
                            <QplusFilterDialog
                                defaultFilters={appContext.defaultFilters}
                                qlikAppIds={[pages.get(PAGE_NAME)]}
                                isDisabled={!enableFilters || isLoading}
                                classNames={{
                                    iconButton: classes.controlButton
                                }}
                            />
                        ))}
                    {!shouldHideSubSettings ? additionalContent : null}
                </Box>
            </Box>
        </div>
    )
}

export default SubHeaderContent

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        width: '100%',
        minHeight: '150px',
        backgroundColor: theme.palette.background.default
    },
    controlButton: {
        borderRadius: '50px',
        backgroundColor: theme.palette.common.base1,
        color: theme.palette.primary.main
    },
    controlButtonDisabled: {
        borderRadius: '50px',
        backgroundColor: `${theme.palette.common.base1} !important`,
        color: theme.palette.text.disabled
    },
    view: {
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '16px',
        paddingBottom: '0px'
    },
    subView: {
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px'
    },
    clearContainer: {
        paddingTop: '12px'
    },
    iconButton: {
        backgroundColor: theme.palette.common.highlight10,
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.common.highlight20
        }
    },
    iconText: {
        fontSize: '0.9rem'
    },
    actionButton: {
        height: '35px',
        width: '120px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '25px',
        backgroundColor: 'transparent',
        color: theme.palette.common.primaryText,
        marginTop: '2px',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '20px',
        textAlign: 'center',
        boxShadow: 'none',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.common.highlight10,
            boxShadow: 'none'
        },
        '&:focus': {
            backgroundColor: '#EBEBEB',
            color: theme.palette.secondary.dark,
            boxShadow: 'none'
        }
    },
    actionButtonText: {
        fontSize: '14px',
        fontWeight: 600,
        color: theme.palette.common.primaryText
    }
}))
