export type StripePrice = {
    stripeProductID: string
    labelKey: string
}

export type StripeProduct = {
    labelKey: string
    id: string
    stripeProductPrices: StripePrice[]
}

export class StripeProductPrices {
    value?: StripeProduct[]

    constructor(productPrices: any) {
        this.value = productPrices.value
    }
}
