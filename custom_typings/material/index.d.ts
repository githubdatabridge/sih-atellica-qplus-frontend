import '@mui/material/styles'

declare module '@mui/material/styles/createPalette' {
    interface IInsightThemeBackground {
        disabled?: string
    }
    interface CommonColors {
        white: string
        black: string
        gray: string
        background?: IInsightThemeBackground
        highlight5?: string
        highlight10?: string
        highlight15?: string
        highlight20?: string
        highlight30?: string
        highlight40?: string
        /* Base Colors */
        base0?: string
        base1?: string
        base2?: string
        base3?: string
        base4?: string
        /* UI Colors */
        ui0?: string
        ui1?: string
        ui2?: string
        ui3?: string
        ui4?: string
        ui5?: string
        ui6?: string
        ui7?: string
        /* Functional Colors */
        functionalred?: string
        functionalyellow?: string
        functionalgreen?: string
        /* Supporting Colors */
        support1?: string
        support2?: string
        support3?: string
        support4?: string
        support5?: string
        support6?: string
        support1tint?: string
        support2tint?: string
        support3tint?: string
        support4tint?: string
        support5tint?: string
        support6tint?: string
        support1shade?: string
        support2shade?: string
        support3shade?: string
        support4shade?: string
        support5shade?: string
        support6shade?: string
        /* Type Colors */
        whiteText?: string
        highlightText?: string
        primaryText?: string
        secondaryText?: string
        disabledText?: string
        /* Opacities */
        opacity1?: number
        opacity2?: number
        opacity3?: number
        opacity4?: number
        opacity5?: number
        opacity6?: number
        opacity7?: number
        /* Color Exceptions */
        whiteDisabledText?: string
        logo1?: string
        logo2?: string
        /* Font Types */
        superHeader?: CSSProperties
        header1?: CSSProperties
        header2?: CSSProperties
        title1?: CSSProperties
        title2?: CSSProperties
        body1?: CSSProperties
        body2?: CSSProperties
    }
}
