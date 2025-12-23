import TextField from '../components/base/TextField'

export const BaseChart = ({ color }) => {
    return (
        <>
            <TextField
                label="Title"
                placeHolder="Please enter a title"
                path="title"
                identifier="title"
                color={color}
            />
            <TextField
                label="SubTitle"
                placeHolder="Please enter a subtitle"
                path="subtitle"
                identifier="subtitle"
                color={color}
            />
            <TextField
                label="Footnote"
                placeHolder="Please enter a footnote"
                path="footnote"
                identifier="footnote"
                color={color}
            />
        </>
    )
}
