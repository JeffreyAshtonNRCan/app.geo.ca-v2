<script lang="ts">
  interface Props {
    direction?: 'horizontal' | 'vertical';
    value: number;
    min?: number;
    max?: number;
  }

  let { direction = 'vertical', value = $bindable(), min = 20, max = 80 }: Props = $props();

  let handle: HTMLDivElement;
  let dragging = $state(false);

  function pointerDown(event: PointerEvent) {
    event.preventDefault();

    const container = handle.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const startX = event.clientX;
    const startY = event.clientY;
    const startValue = value;

    dragging = true;
    handle.setPointerCapture(event.pointerId);

    function pointerMove(e: PointerEvent) {
      let deltaPercent: number;

      if (direction === 'vertical') {
        deltaPercent = ((e.clientX - startX) / rect.width) * 100;
      } else {
        deltaPercent = ((e.clientY - startY) / rect.height) * 100;
      }

      value = Math.min(max, Math.max(min, startValue + deltaPercent));
    }

    function pointerUp(e: PointerEvent) {
      dragging = false;
      handle.releasePointerCapture(e.pointerId);

      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('pointerup', pointerUp);
    }

    // Tell GeoView the layout changed.
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
  }
</script>

<!--todo tabindex="0"-->
<div
  bind:this={handle}
  class="splitter"
  class:dragging
  class:vertical={direction === 'vertical'}
  class:horizontal={direction === 'horizontal'}
  role="separator"
  aria-orientation={direction}
  onpointerdown={pointerDown}
>
  <div class="grip"></div>
</div>

<style>
  .splitter {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    touch-action: none;
    background: #f3f4f6;
    transition: background 0.15s ease;
  }

  .splitter:hover,
  .splitter.dragging {
    background: #d1d5db;
  }

  .vertical {
    width: 12px;
    cursor: col-resize;
  }

  .horizontal {
    height: 6px;
    cursor: row-resize;
  }

  .vertical .grip {
    width: 2px;
    height: 36px;
    border-radius: 1px;
    background: #9ca3af;
  }

  .horizontal .grip {
    width: 32px;
    height: 2px;
    border-radius: 1px;
    background: #9ca3af;
  }
</style>
