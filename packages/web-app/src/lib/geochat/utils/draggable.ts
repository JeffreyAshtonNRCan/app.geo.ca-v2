import type { Action } from 'svelte/action';

export const draggable: Action<HTMLElement> = (node) => {
    const panel = node.closest('#chatbot-panel') as HTMLElement | null;

    if (!panel) {
        console.warn('draggable: #chatbot-panel not found');
        return {};
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function handleMouseDown(event: MouseEvent) {
        // Left mouse button only
        if (event.button !== 0) {
            return;
        }

        const rect = panel.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        // Switch from bottom/right positioning to top/left positioning
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';

        isDragging = true;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) {
            return;
        }

        const maxLeft = window.innerWidth - panel.offsetWidth;
        const maxTop = window.innerHeight - panel.offsetHeight;

        const left = Math.max(
            0,
            Math.min(event.clientX - offsetX, maxLeft)
        );

        const top = Math.max(
            0,
            Math.min(event.clientY - offsetY, maxTop)
        );

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
    }

    function handleMouseUp() {
        isDragging = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    node.addEventListener('mousedown', handleMouseDown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMouseDown);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    };
};