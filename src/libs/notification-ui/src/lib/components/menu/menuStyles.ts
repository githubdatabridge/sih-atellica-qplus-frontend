import { Theme, darken } from '@mui/material'

import { makeStyles } from 'tss-react/mui'

export const createStyles = (color: string) =>
    makeStyles()((theme: Theme) => ({
        appBar: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${darken(theme.palette.divider, 0.05)}`,
            boxShadow: 'none'
        },
        toolbar: {
            padding: 0
        },
        menuTitleContainer: {
            alignContent: 'flex-start',
            minWidth: '250px',
            '@media (max-width: 390px)': {
                minWidth: '200px'
            },
            '@media (max-width: 330px)': {
                minWidth: '170px'
            }
        },
        divider: {
            backgroundColor: theme.palette.divider,
            height: 1
        },
        menuTitle: {
            fontWeight: 600,
            fontSize: '14px',
            flexGrow: 1
        },
        listItem: {
            minWidth: '25px',
            padding: '0px'
        },
        listIcon: {
            color: theme.palette.common.white
        },
        markRead: {
            fontWeight: 500,
            fontSize: '10px',
            flexGrow: 1
        },
        progress: {
            color: theme.palette.info.contrastText
        },
        progressMarkReadAll: {
            color: theme.palette.secondary.main
        },
        menuPaper: {
            width: 450,
            maxWidth: 450,
            color: theme.palette.primary.main,
            boxShadow: '0 2px 16px rgb(0 0 0 / 10%)',
            '@media (max-width: 510px)': {
                width: '90%'
            }
        },
        menuList: {
            paddingTop: '0px'
        },
        avatar: {
            backgroundColor: theme.palette.secondary.main,
            fontSize: '0.85rem',
            width: '31px',
            height: '31px'
        },
        user: {
            fontSize: '0.75rem',
            fontWeight: 600
        },
        company: {
            fontSize: '0.625rem',
            fontWeight: 550,
            color: '#FFFFFF99'
        },
        readAllIcon: {
            fill: theme.palette.primary.main
        },
        buttonInactive: {
            fontSize: '0.875rem',
            height: '30px',
            borderRadius: '25px',
            minWidth: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.disabled,
            '&:hover': {
                backgroundColor: `${theme.palette.background.default} !important`,
                boxShadow: 'none'
            },
            '&:focus': {
                backgroundColor: `${theme.palette.background.default} !important`,
                boxShadow: 'none'
            },
            cursor: 'pointer',
            '@media (max-width: 350px)': {
                minWidth: '120px'
            }
        },
        buttonActive: {
            fontSize: '0.875rem',
            fontWeight: 500,
            height: '30px',
            borderRadius: '25px',
            minWidth: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
                color === 'secondary'
                    ? theme.palette.secondary.main
                    : color === 'primary'
                    ? theme.palette.primary.main
                    : theme.palette.info.main,
            color:
                color === 'secondary'
                    ? theme.palette.secondary.contrastText
                    : color === 'primary'
                    ? theme.palette.primary.contrastText
                    : theme.palette.info.contrastText,
            '&:hover': {
                backgroundColor:
                    color === 'secondary'
                        ? theme.palette.secondary.main
                        : color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.info.main,
                color:
                    color === 'secondary'
                        ? theme.palette.secondary.contrastText
                        : color === 'primary'
                        ? theme.palette.primary.contrastText
                        : theme.palette.info.contrastText,
                boxShadow: 'none'
            },
            '&:focus': {
                backgroundColor:
                    color === 'secondary'
                        ? theme.palette.secondary.main
                        : color === 'primary'
                        ? theme.palette.primary.main
                        : theme.palette.info.main,
                color:
                    color === 'secondary'
                        ? theme.palette.secondary.contrastText
                        : color === 'primary'
                        ? theme.palette.primary.contrastText
                        : theme.palette.info.contrastText,
                boxShadow: 'none'
            },
            cursor: 'pointer',
            '@media (max-width: 350px)': {
                minWidth: '120px'
            }
        },
        commentChip: {
            paddingRight: '24px',
            '@media (max-width: 380px)': {
                paddingRight: '6px'
            }
        },
        dots: {
            animation: `$blink 1s infinite` // Use backticks for template literals
            // Additional styles can be added here
        },
        '@keyframes blink': {
            // Define the keyframes for animation within the same object
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 }
        }
    }))
