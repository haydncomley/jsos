import { useEffect, useState } from "react"

export const useOnDrag = (
    element: React.RefObject<HTMLElement>,
    onMove?: (left: number, top: number) => void
) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!element.current) return;

        let isStarting = false;
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        const handleMouseDown = (e: MouseEvent) => {
            const isTargetNotBorder = e.target !== element.current?.firstChild;
            const isTargetWithinDraggable = element.current?.querySelector('*[data-window-drag="true"]')?.contains(e.target as HTMLElement);
            if (isTargetNotBorder && !isTargetWithinDraggable) return;
            startX = e.clientX;
            startY = e.clientY;
            isStarting = true;
        }

        const handleMouseUp = () => {
            if (isDragging && element.current) {
                const bounds = element.current.getBoundingClientRect();
                element.current.style.left = `${bounds.left}px`;
                element.current.style.top = `${bounds.top}px`;
                onMove?.(bounds.left, bounds.top);
                element.current.style.transform = '';
            }

            setIsDragging(false);
            isDragging = false;
            isStarting = false;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!isStarting || !element.current) return;

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