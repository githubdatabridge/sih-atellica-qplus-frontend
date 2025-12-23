import React, { FC } from 'react'

interface Props {
    props?: React.SVGProps<SVGSVGElement>
    color?: string
}

const SvgIconControlSelectAll: FC<Props> = ({ props, color = '#000' }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path d="M13 10.5001H10.5V13.0001H13V10.5001Z" fill={color} />
            <path d="M10.5 8.49988H8.50003V10.4999H10.5V8.49988Z" fill={color} />
            <path d="M15 12.9996H13V14.9996H15V12.9996Z" fill={color} />
            <path d="M15 8.49988H13.5V9.99988H15V8.49988Z" fill={color} />
            <path d="M10 13.499H8.50003V14.999H10V13.499Z" fill={color} />
            <path d="M13 3.00012H10.5V5.50012H13V3.00012Z" fill={color} />
            <path
                d="M15 7.5H8.50003V1H15V7.5ZM9.87503 6.125H13.625V2.375H9.87503V6.125Z"
                fill={color}
            />
            <path d="M5.50003 3.00012H3.00003V5.50012H5.50003V3.00012Z" fill={color} />
            <path
                d="M7.5007 7.5003H1.0007V1.00031H7.5007V7.5003ZM2.3757 6.1253H6.1257V2.37531H2.3757V6.1253Z"
                fill={color}
            />
            <path d="M5.50003 10.5001H3.00003V13.0001H5.50003V10.5001Z" fill={color} />
            <path
                d="M7.50004 14.9999H1.00005V8.49988H7.50004V14.9999ZM2.37505 13.6249H6.12504V9.87488H2.37505V13.6249Z"
                fill={color}
            />
        </svg>
    )
}

export default SvgIconControlSelectAll
