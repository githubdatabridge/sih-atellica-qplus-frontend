import { useTheme } from '@mui/material/styles'

export const useColorStyles = color => {
    const theme = useTheme()

    const getColorValue = colorName => {
        switch (colorName) {
            case 'primary':
                return theme.palette.primary.main
            case 'secondary':
                return theme.palette.secondary.main
            case 'info':
                return theme.palette.info.main
            case 'success':
                return theme.palette.success.main
            case 'warning':
                return theme.palette.warning.main
            case 'error':
                return theme.palette.error.main
            default:
                return 'inherit'
        }
    }

    const selectedColor = getColorValue(color)

    const contrastText =
        color === 'inherit'
            ? 'inherit'
            : theme.palette[color === 'primary' ? 'primary' : 'secondary'].contrastText

    return { selectedColor, contrastText }
}
