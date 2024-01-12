import styled from '@emotion/styled'
import { FC, SVGProps } from "react";
import { Popover, Text } from '@mantine/core';
import { useMediaQuery } from "@mantine/hooks";

const Icon = styled.div({
    maxWidth: '150px',
    marginTop: 80,
    '&[role="button"]': {
        cursor: 'pointer',
    }
})

const SVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        data-testid="launch-chat-icon"
        viewBox="0 0 68 66"
        fill="none"
        {...props}
    >
        <g filter="url(#a)">
            <path
                fill="#fff"
                d="M8 4h38.64c7.18 0 13 5.82 13 13v24c0 7.18-5.821 13-13 13H21c-7.18 0-13-5.82-13-13V4Z"
            />
            <path
                stroke="#000"
                strokeLinecap="round"
                strokeWidth={0.8}
                d="M17.648 8.975c1.703-2.581 7.547-4.104 10.552-.223M35.869 8.758c1.703-2.582 7.547-4.104 10.552-.224"
            />
        </g>
        <rect
            width={42.94}
            height={10.372}
            fill="#83AE52"
            rx={1.5}
            transform="matrix(.99985 .01707 -.01126 .99994 12.149 11.377)"
        />
        <rect
            width={45.693}
            height={9.751}
            fill="#E37C50"
            rx={1.5}
            transform="matrix(1 -.00253 .00833 .99996 10.459 22.503)"
        />
        <rect
            width={38.813}
            height={8.949}
            fill="#E8CB5A"
            rx={1.5}
            transform="matrix(.99963 -.02729 .0187 .99982 15.446 33.304)"
        />
        <g filter="url(#b)">
            <path
                fill="#fff"
                d="M39.516 32.364c-2.795 7.671-9.87 5.994-12.08-.323-.407-1.165.577-2.264 1.812-2.235l8.525.194c1.245.029 2.17 1.192 1.743 2.364Z"
            />
        </g>
        <g filter="url(#c)">
            <circle
                cx={25.418}
                cy={15.68}
                r={6.762}
                fill="#fff"
                transform="rotate(90 25.418 15.68)"
            />
        </g>
        <ellipse
            cx={22.344}
            cy={14.656}
            fill="#393939"
            rx={3.279}
            ry={2.869}
            transform="rotate(90 22.344 14.656)"
        />
        <g filter="url(#d)">
            <circle
                cx={41.811}
                cy={15.68}
                r={6.762}
                fill="#fff"
                transform="rotate(90 41.811 15.68)"
            />
        </g>
        <ellipse
            cx={38.738}
            cy={14.656}
            fill="#393939"
            rx={3.279}
            ry={2.869}
            transform="rotate(90 38.738 14.656)"
        />
        <path
            fill="#5F6360"
            stroke="#5F6163"
            d="M31.708 44.3v-2.414h2.415l.966 5.313c-3.059 1.45-10.153 2.369-10.625 0-.483-2.415 4.346-3.06 7.244-2.898ZM37.989 46.716l.966-4.83h2.415v1.932c3.864.322 8.211.966 6.762 3.381-1.273 2.122-8.05.805-10.143-.483Z"
        />
        <defs>
            <filter
                id="a"
                width={67.639}
                height={66}
                x={0}
                y={0}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={4} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0" />
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_415_801" />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_415_801"
                    result="shape"
                />
            </filter>
            <filter
                id="b"
                width={20.279}
                height={15.669}
                x={23.343}
                y={29.805}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_415_801" />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_415_801"
                    result="shape"
                />
            </filter>
            <filter
                id="c"
                width={21.524}
                height={21.524}
                x={14.656}
                y={8.918}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_415_801" />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_415_801"
                    result="shape"
                />
            </filter>
            <filter
                id="d"
                width={21.524}
                height={21.524}
                x={31.049}
                y={8.918}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy={4} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_415_801" />
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_415_801"
                    result="shape"
                />
            </filter>
        </defs>
    </svg>
)

export const LaunchIcon: FC<{ onClick?:() => void, isOpen: boolean }> = ({ onClick, isOpen }) => {
    const isMobile = useMediaQuery('(max-device-width: 480px)', false, { getInitialValueInEffect: false });
    const iconDimension = isMobile ? 60 : 70
    if (isOpen) return null

    return (
        <Icon
            className="staxly-animation"
            role={onClick ? 'button' : ''}
            onClick={onClick}
        >
            <Popover width={140} opened position="top-end" withArrow arrowOffset={(iconDimension/2) - 6} offset={{ mainAxis: 7, crossAxis: 160 }} arrowSize={12}>
                <Popover.Target>
                    <div>
                        <SVG height={iconDimension} width={iconDimension} />
                    </div>
                </Popover.Target>
                <Popover.Dropdown>
                     <Text fs="italic" c="dark" size="sm">How can I help you learn?</Text>
                </Popover.Dropdown>
            </Popover>
        </Icon>
    );
}


