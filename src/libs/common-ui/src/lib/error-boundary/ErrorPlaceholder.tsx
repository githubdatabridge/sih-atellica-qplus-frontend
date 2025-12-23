import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Paper } from '@mui/material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

export interface IErrorPlaceholderProps {
    text?: string
}

const ErrorPlaceholder = ({ text }: IErrorPlaceholderProps) => {
    return (
        <Paper
            sx={{
                height: '100%',
                minHeight: '238px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box>
                <ErrorOutlineIcon
                    sx={{
                        color: 'red',
                        fontSize: '50px'
                    }}
                />
            </Box>
            <Typography color="primary">{text ? text : 'Something went wrong!'}</Typography>
        </Paper>
    )
}

export default ErrorPlaceholder
