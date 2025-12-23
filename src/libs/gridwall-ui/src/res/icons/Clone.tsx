import * as React from 'react'

function SvgClone(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.656 13h7.688A2.651 2.651 0 0018 10.361V2.64A2.651 2.651 0 0015.344 0H7.656A2.651 2.651 0 005 2.639v7.722A2.651 2.651 0 007.656 13zM6.063 2.639a1.59 1.59 0 011.593-1.583h7.688c.878 0 1.594.71 1.594 1.583v7.722a1.59 1.59 0 01-1.594 1.583H7.656a1.59 1.59 0 01-1.593-1.583V2.64z"
                fill="#ABAEC0"
            />
            <path
                d="M2.639 18h7.722A2.639 2.639 0 0013 15.368v-1.052a.527.527 0 00-1.056 0v1.052c0 .87-.71 1.58-1.583 1.58H2.64a1.583 1.583 0 01-1.583-1.58V7.632c0-.87.71-1.58 1.583-1.58h1.055a.527.527 0 100-1.052H2.64A2.639 2.639 0 000 7.632v7.736A2.639 2.639 0 002.639 18z"
                fill="#ABAEC0"
            />
        </svg>
    )
}

export default SvgClone
