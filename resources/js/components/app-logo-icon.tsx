import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 0L40 10V30L20 40L0 30V10L20 0ZM20 6.5L34 13.5V26.5L20 33.5L6 26.5V13.5L20 6.5ZM20 13L27 16.5V23.5L20 27L13 23.5V16.5L20 13Z"
            />
        </svg>
    );
}
