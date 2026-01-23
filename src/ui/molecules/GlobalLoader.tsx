

export const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer Ring */}
                <div className="absolute h-24 w-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin" style={{ animationDuration: '2s' }}></div>

                {/* Middle Ring - Reverse Spin */}
                <div className="absolute h-16 w-16 rounded-full border-4 border-transparent border-r-primary/40 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>

                {/* Inner Ring */}
                <div className="absolute h-8 w-8 rounded-full border-4 border-transparent border-l-primary animate-pulse"></div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold tracking-[0.2em] text-foreground/80 font-sans">
                    TRADENOTZ
                </h1>
                <div className="flex items-center gap-1 h-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce delay-150"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300"></div>
                </div>
            </div>

            {/* Background geometric accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse duration-[5s]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000 duration-[7s]"></div>
            </div>
        </div>
    );
};
