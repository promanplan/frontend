'use client';

import dynamic from 'next/dynamic';


import { useColorScheme } from '@/lib/hooks/useColorScheme';

const ExcalidrawPrimitive = dynamic(async () => (await import('@excalidraw/excalidraw')).Excalidraw, {
    ssr: false,
});

const Excalidraw = () => {
    const { theme } = useColorScheme();
    return (
        <div className="relative h-[calc(100svh-72px)] overflow-hidden">
            <ExcalidrawPrimitive
                initialData={{
                    appState: {
                        viewBackgroundColor: '#0000',
                        currentItemFontFamily: 1,
                    },
                }}
            />
        </div>
    );
};

export default Excalidraw;
