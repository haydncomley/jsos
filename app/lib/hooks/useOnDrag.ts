import { useEffect, useState } from "react"

export const useOnDrag = (
    element: React.RefObject<HTMLElement>,
    onMove: (left: number, top: number, leftDelta: number, topDelta: number) => void,
    onMoveEnd?: () => void,
) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!element.current) return;

        let isStarting = false;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let lastDx = 0;
        let lastDy = 0;

        const handleMouseDown = (e: MouseEvent) => {
            if (e.target !== element.current) return;
            startX = e.clientX;
            startY = e.clientY;
            isStarting = true;
        }

        const handleMouseUp = () => {
            if (isDragging && element.current) {
                onMoveEnd?.();
            }

            setIsDragging(false);
            isDragging = false;
            isStarting = false;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const ddX = lastDx - dx;
            const ddY = lastDy - dy;
            lastDx = dx;
            lastDy = dy;
            if (!isStarting || !element.current) return;

            if (!isDragging) {
                const deltaMagnitude = Math.sqrt(dx * dx + dy * dy);
                if (deltaMagnitude > 5) {
                    setIsDragging(true);
                    isDragging = true;
                }
                return;
            }

            onMove?.(dx, dy, ddX, ddY);
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