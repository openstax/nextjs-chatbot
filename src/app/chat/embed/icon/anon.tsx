'use client'
import { Providers } from '@/components/providers';
import { LaunchIcon } from '@/components/launch-icon'
import './styles.scss';

export const AnonIcon = () => {

    return (
        <Providers>
            <LaunchIcon isOpen={false} />
        </Providers>
    )
}
