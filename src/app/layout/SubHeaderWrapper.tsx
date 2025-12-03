import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { AppBar, Box, Theme, Toolbar } from '@mui/material'

import { OFFSET_COLLAPSED, OFFSET_EXPANDED } from 'app/common/config'
import SubHeaderContent from './SubHeaderContent'
import { Page } from './components/select/SelectView'
import ToggleButton from './components/button/ToggleButton'

interface ISubHeaderWrapperProps {
    parentPages: Page[]
    subPages?: string[]
    currentSubPage?: string
    shouldHideSubSettings?: boolean
    isHeaderVisible?: boolean
    handlePageChangeCallback?: (page: string) => void
    handleSubPageChangeCallback?: (subPage: string) => void
    handleHeaderToggleCallback?: (toggle: boolean) => void
}

const SubHeaderWrapper: React.FC<ISubHeaderWrapperProps> = ({
    parentPages,
    subPages = [],
    currentSubPage = '',
    shouldHideSubSettings = true,
    isHeaderVisible = true,
    handlePageChangeCallback,
    handleSubPageChangeCallback,
    handleHeaderToggleCallback
}) => {
    const [isHeader, setIsHeader] = useState<boolean>(isHeaderVisible)
    const { classes } = useStyles()

    useEffect(() => {
        setIsHeader(isHeaderVisible)
    }, [isHeaderVisible])

    return (
        <>
            <div style={{ display: !isHeader ? 'none' : 'block' }}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar disableGutters>
                        <Box className={classes.header}>
                            <SubHeaderContent
                                parentPages={parentPages}
                                subPages={subPages}
                                currentSubPage={currentSubPage}
                                shouldHideSubSettings={shouldHideSubSettings}
                                handleOnPageChangeCallback={handlePageChangeCallback}
                                handleOnSubPageChangeCallback={handleSubPageChangeCallback}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>
            </div>

            <Box
                position="absolute"
                sx={{
                    marginTop: isHeaderVisible
                        ? `${OFFSET_EXPANDED - 15}px`
                        : `${OFFSET_COLLAPSED - 15}px`,
                    marginLeft: '50%'
                }}>
                <Box width="100%" className={classes?.toggle} textAlign="center">
                    <ToggleButton handleToggleHeaderCallback={handleHeaderToggleCallback} />
                </Box>
            </Box>
        </>
    )
}

const useStyles = makeStyles()((theme: Theme) => ({
    appBar: {
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'inset 0 -1px 0 0 #EBEBEB',
        marginTop: 72
    },
    header: {
        boxShadow: '0 0 0rem rgba(0,0,0,0.20);',
        width: '100%'
    },
    toggle: {
        height: '20px'
    }
}))

export default SubHeaderWrapper
