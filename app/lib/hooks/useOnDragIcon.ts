import { useEffect, useState } from "react"

export const useOnDragIcon = (
    element: React.RefObject<HTMLElement>,
    onMove?: (left: number, top: number) => void
) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!element.current) return;

        let isStarted = false;
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        const handleMouseDown = (e: MouseEvent) => {
            startX = e.clientX;
            startY = e.clientY;
            isStarted = true;
        }

        const handleMouseUp = (e: MouseEvent) => {
            if (isDragging && element.current) {
                const bounds = element.current.getBoundingClientRect();
                onMove?.(bounds.left, bounds.top);
                element.current.style.transform = '';
                e.preventDefault();
            }

            setIsDragging(false);
            isDragging = false;
            isStarted = false;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!isStarted || !element.current) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (!isDragging) {
                const deltaMagnitude = Math.sqrt(dx * dx + dy * dy);
                if (deltaMagnitude > 5) {
                    setIsDragging(true);
                    isDragging = true;
                }
                return;
            }

            element.current.style.transform = `translate(${dx}px, ${dy}px)`;
        }

        element.current.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            element.current?.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [element])

    return {
        isDragging
    }
}