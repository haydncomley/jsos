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
                onMove?.(parseInt(element.current.style.gridColumnStart), parseInt(element.current.style.gridRowStart));
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
            const gridSize = 0.5 * 16;

            if (!isDragging) {
                const deltaMagnitude = Math.sqrt(dx * dx + dy * dy);
                if (deltaMagnitude > 5) {
                    setIsDragging(true);
                    isDragging = true;
                }
                return;
            }

            const iconLeft = e.clientX - (element.current.clientWidth / 2);
            const iconTop = e.clientY - (element.current.clientHeight / 2);

            element.current.style.gridColumnStart = `${Math.max(Math.round(iconLeft / gridSize), 0)}`;
            element.current.style.gridRowStart = `${Math.max(Math.round(iconTop / gridSize), 0)}`;
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