import React, { useState } from 'react'

import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'

export interface ILanguageMenuProps {
    languages: any[]
    currentLanguageId: any
    onLanguageChange?: (languageId: string) => void
}

const LanguageMenu: React.FC<ILanguageMenuProps> = ({
    languages,
    currentLanguageId,
    onLanguageChange
}) => {
    const [menu, setMenu] = useState(null)

    const currentLng = languages.find(lng => lng.id === currentLanguageId)

    const userMenuClick = (event: any) => {
        setMenu(event.currentTarget)
    }

    const userMenuClose = () => {
        setMenu(null)
    }

    function handleLanguageChange(languageId: string) {
        userMenuClose()

        onLanguageChange && onLanguageChange(languageId)
    }

    return (
        <>
            <Button className="h-64 w-64" onClick={userMenuClick}>
                <img
                    className="mx-4 min-w-20"
                    src={`assets/images/flags/${currentLng?.title}.png`}
                    alt={currentLng?.title}
                />

                <Typography className="mx-4 font-600">
                    {currentLng?.title?.toUpperCase()}
                </Typography>
            </Button>

            <Popover
                open={Boolean(menu)}
                anchorEl={menu}
                onClose={userMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                classes={{
                    paper: 'py-8'
                }}>
                {languages.map((lng: any) => (
                    <MenuItem key={lng.id} onClick={() => handleLanguageChange(lng.id)}>
                        <ListItemIcon
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'cemter',
                                position: 'relative',
                                maxWidth: '20px',
                                height: 'auto',
                                overflow: 'hidden',
                                borderRadius: '50%'
                            }}>
                            <img
                                src={`assets/images/flags/${lng.title}.png`}
                                alt={lng.title}
                                style={{
                                    maxWidth: '20px',
                                    height: '100%'
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText
                            sx={{ fontSize: '0.875rem' }}
                            primary={lng.title.toUpperCase()}
                        />
                    </MenuItem>
                ))}
            </Popover>
        </>
    )
}

export default LanguageMenu
