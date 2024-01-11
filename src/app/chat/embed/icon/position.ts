import { useMediaQuery } from "@mantine/hooks"

export const useWindowPosition = () => {
    const isMobile = useMediaQuery('(max-device-width: 480px)', false, { getInitialValueInEffect: false });

    return {
        bottom: isMobile ? '0' : '20px',
        right: isMobile ? '0' : '20px',
        height: isMobile ? '100%' : '680px',
        width: isMobile ? '100%' : '400px',
    }


}
