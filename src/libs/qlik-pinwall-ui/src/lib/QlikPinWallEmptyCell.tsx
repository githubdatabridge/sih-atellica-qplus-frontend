import { Link, useLocation } from 'react-router-dom'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Typography, useTheme, Theme } from '@mui/material'

import { useI18n } from '@libs/common-providers'

import translation from './constants/translations'
import { useGridWallContext } from './contexts/grid-wall-context'

const QlikPinWallEmptyCell = (props: any) => {
    const { t } = useI18n()
    const theme = useTheme<Theme>()

    const { pathname, search } = useLocation()
    const { isFixed, setCellPosition } = useGridWallContext()

    const searchQueryParams = search ? `${search}&` : '?'

    return (
        <Link
            to={
                !isFixed
                    ? `${pathname}${searchQueryParams}op=pick&x=${props.x}&y=${props.y}`
                    : pathname
            }
            style={{
                height: '100%',
                textDecoration: 'none',
                cursor: !isFixed ? 'pointer' : 'default'
            }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                onClick={() => setCellPosition({ x: props.x, y: props.y })}
                bgcolor="#fff">
                {!isFixed && (
                    <>
                        <Box
                            sx={{
                                borderRadius: '50%',
                                padding: '4px',
                                width: '32px',
                                height: '32px',
                                color: theme.palette.text.primary,
                                opacity: 0.6
                            }}>
                            <AddCircleIcon />
                        </Box>
                        <Typography
                            sx={{
                                paddingTop: 4,
                                fontWeight: 600,
                                fontSize: 12,
                                color: theme.palette.text.primary,
                                opacity: 0.6,
                                textDecoration: 'none'
                            }}>
                            {t(translation.pinwallAddVisualization)}
                        </Typography>
                    </>
                )}
            </Box>
        </Link>
    )
}

export default QlikPinWallEmptyCell
