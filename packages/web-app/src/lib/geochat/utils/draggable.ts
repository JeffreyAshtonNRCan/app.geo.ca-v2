import type { Action } from 'svelte/action';

export const draggable: Action<HTMLElement> = (node) => {

    const panel = node.closest('#chatbot-panel');

    if (!(panel instanceof HTMLElement)) {
        console.warn('draggable: #chatbot-panel not found');
        return {};
    }

    const panelElement: HTMLElement = panel;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    let hasMoved = false;

    function handleMouseDown(event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }

        const rect = panelElement.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        hasMoved = false;
        isDragging = true;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) {
            return;
        }

        if (!hasMoved) {
            panelElement.style.right = 'auto';
            panelElement.style.bottom = 'auto';
            hasMoved = true;
        }

        const MARGIN = 10;

        const maxLeft =
            window.innerWidth - panelElement.offsetWidth - MARGIN;

        const maxTop =
            window.innerHeight - panelElement.offsetHeight - MARGIN;

        const left = Math.max(
            MARGIN,
            Math.min(event.clientX - offsetX, maxLeft)
        );

        const top = Math.max(
            MARGIN,
            Math.min(event.clientY - offsetY, maxTop)
        );

        panelElement.style.left = `${left}px`;
        panelElement.style.top = `${top}px`;
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