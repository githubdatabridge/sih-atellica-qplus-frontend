import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
}

const SvgExpandIcon: FC<Props> = props => {
    return (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" {...props}>
            <path
                d="M16.3758 7.87576L19 10.5L16.3758 13.1242M18.5396 10.4993L13.2303 10.5M4.62424 13.1242L2 10.5L4.62424 7.87576M2.46045 10.5007L7.7697 10.5M7.87576 4.62424L10.5 2L13.1242 4.62424M10.4993 2.46045L10.5 7.7697M13.1242 16.3758L10.5 19L7.87576 16.3758M10.5007 18.5396L10.5 13.2303"
                stroke="#ABAEC0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default SvgExpandIcon
