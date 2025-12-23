const useButtonStyles = (selectedColor, contrastText) => {
    const fallbackColor = ''

    return {
        background: `${selectedColor} !important` || fallbackColor,
        color: `${contrastText} !important` || fallbackColor,
        '&:hover': {
            backgroundColor: `${selectedColor} !important` || fallbackColor,
            color: `${contrastText} !important` || fallbackColor
        },
        '&:focus': {
            backgroundColor: `${selectedColor} !important` || fallbackColor,
            color: `${contrastText} !important` || fallbackColor
        }
    }
}

export default useButtonStyles
