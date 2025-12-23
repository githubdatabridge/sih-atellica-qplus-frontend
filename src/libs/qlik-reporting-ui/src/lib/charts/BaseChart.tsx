import ReportingTextField from '../components/base/TextField'

export const BaseChart = ({ color }) => {
    return (
        <>
            <ReportingTextField
                label="Title"
                placeHolder="Please enter a title"
                path="title"
                identifier="title"
                color={color}
            />
            <ReportingTextField
                label="SubTitle"
                placeHolder="Please enter a subtitle"
                path="subtitle"
                identifier="subtitle"
                color={color}
            />
            <ReportingTextField
                label="Footnote"
                placeHolder="Please enter a footnote"
                path="footnote"
                identifier="footnote"
                color={color}
            />
        </>
    )
}
