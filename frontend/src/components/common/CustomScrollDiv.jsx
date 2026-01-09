import React, { useState, useEffect, useRef, useCallback } from "react";

const SCROLL_BOX_MIN_HEIGHT = 20;

export default function CustomScrollDiv({ children, className, ...props }) {
    const [hovering, setHovering] = useState(false);
    const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
    const [scrollBoxTop, setScrollBoxTop] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [lastScrollThumbPosition, setLastScrollThumbPosition] = useState(0);
    const [hasScroll, setHasScroll] = useState(false);

    const scrollHostRef = useRef();

    const handleMouseOver = useCallback(() => {
        setHovering(true);
    }, []);

    const handleMouseOut = useCallback(() => {
        if (!isDragging) {
            setHovering(false);
        }
    }, [isDragging]);

    const handleScroll = useCallback(() => {
        if (!scrollHostRef.current) return;
        const { scrollTop, scrollHeight, offsetHeight } = scrollHostRef.current;

        let newTop = (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight;
        // Fix bounds
        newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
        setScrollBoxTop(newTop);
    }, [scrollBoxHeight]);

    const handleScrollThumbMouseDown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setLastScrollThumbPosition(e.clientY);
        setIsDragging(true);
    }, []);

    const handleDocumentMouseUp = useCallback((e) => {
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
            setHovering(false); // Hide on release if not hovering, mimics native behavior
        }
    }, [isDragging]);

    const handleDocumentMouseMove = useCallback(
        (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                const scrollHostElement = scrollHostRef.current;
                const { scrollHeight, offsetHeight } = scrollHostElement;

                let deltaY = e.clientY - lastScrollThumbPosition;
                let newScrollHostTop = (scrollHeight / offsetHeight) * deltaY;

                setLastScrollThumbPosition(e.clientY);

                // Update Scroll Host
                scrollHostElement.scrollTop = Math.min(
                    scrollHostElement.scrollTop + newScrollHostTop,
                    scrollHeight - offsetHeight
                );
            }
        },
        [isDragging, lastScrollThumbPosition]
    );

    const contentRef = useRef();

    const updateScrollMetrics = useCallback(() => {
        if (!scrollHostRef.current) return;
        const { clientHeight, scrollHeight } = scrollHostRef.current;
        const scrollThumbPercentage = clientHeight / scrollHeight;
        const scrollThumbHeight = Math.max(
            scrollThumbPercentage * clientHeight,
            SCROLL_BOX_MIN_HEIGHT
        );
        setScrollBoxHeight(scrollThumbHeight);
        setHasScroll(scrollHeight > clientHeight);
    }, []);

    useEffect(() => {
        const scrollHost = scrollHostRef.current;
        const content = contentRef.current;

        if (!scrollHost || !content) return;

        const observer = new ResizeObserver(() => {
            updateScrollMetrics();
        });

        observer.observe(scrollHost);
        observer.observe(content);

        // Initial check
        updateScrollMetrics();

        return () => observer.disconnect();
    }, [updateScrollMetrics]);

    useEffect(() => {
        document.addEventListener("mousemove", handleDocumentMouseMove);
        document.addEventListener("mouseup", handleDocumentMouseUp);
        document.addEventListener("mouseleave", handleDocumentMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleDocumentMouseMove);
            document.removeEventListener("mouseup", handleDocumentMouseUp);
            document.removeEventListener("mouseleave", handleDocumentMouseUp);
        };
    }, [handleDocumentMouseMove, handleDocumentMouseUp]);

    return (
        <div
            className={`relative h-full overflow-hidden ${className}`}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            {...props}
        >
            <div
                ref={scrollHostRef}
                className="h-full w-full overflow-y-auto scrollbar-hide pr-[20px] box-content" // Hide native scrollbar via CSS class or util
                onScroll={handleScroll}
                style={{
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* IE 10+ */
                    paddingRight: '17px', /* Push native scrollbar out of view if needed, but styling usually handles it */
                    width: '100%'
                }}
            >
                <style jsx>{`
            div::-webkit-scrollbar { 
                display: none; 
            } 
        `}</style>
                <div ref={contentRef} className="min-h-full w-full">
                    {children}
                </div>
            </div>

            {/* Scrollbar Track/Thumb */}
            {hasScroll && (
                <div
                    className={`absolute top-0 right-0 h-full w-[8px] bg-transparent transition-opacity duration-200 ${hovering || isDragging ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div
                        className="w-full bg-primary-400 rounded-full cursor-pointer hover:bg-primary-200 transition-colors"
                        style={{
                            height: `${scrollBoxHeight}px`,
                            top: `${scrollBoxTop}px`,
                            position: "absolute",
                        }}
                        onMouseDown={handleScrollThumbMouseDown}
                    />
                </div>
            )}
        </div>
    );
}
