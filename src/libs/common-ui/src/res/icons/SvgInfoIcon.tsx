import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
}

const SvgInfoIcon: FC<Props> = props => {
    return (
        <svg width="9" height="18" viewBox="0 0 9 18" fill="none" {...props}>
            <path
                d="M1.91406 7.49841H4.35238V16.3373"
                stroke="#ABAEC0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M1 16.6421H7.70538H1Z" fill="#ABAEC0" />
            <path
                d="M1 16.6421H7.70538"
                stroke="#ABAEC0"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
            />
            <path
                d="M3.82813 0C3.48201 0 3.14366 0.102636 2.85588 0.294928C2.56809 0.487221 2.34379 0.760533 2.21134 1.0803C2.07888 1.40007 2.04423 1.75194 2.11175 2.09141C2.17928 2.43087 2.34595 2.74269 2.59069 2.98744C2.83543 3.23218 3.14725 3.39885 3.48672 3.46637C3.82618 3.5339 4.17805 3.49924 4.49782 3.36679C4.81759 3.23434 5.09091 3.01003 5.2832 2.72225C5.47549 2.43446 5.57812 2.09612 5.57812 1.75C5.57812 1.28587 5.39375 0.840751 5.06556 0.512563C4.73737 0.184374 4.29225 0 3.82813 0Z"
                fill="#ABAEC0"
            />
        </svg>
    )
}

export default SvgInfoIcon
