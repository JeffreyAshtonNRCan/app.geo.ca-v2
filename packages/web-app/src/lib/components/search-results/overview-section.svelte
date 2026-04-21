<script lang="ts">
  import { marked } from 'marked';

  let { overviewData, isLoading } = $props();

  let html = $state('');

  $effect(() => {
  // clear old content when loading starts
    if (isLoading) {
      html = '';
      return;
    }
  
    // parse when data arrives
    if (overviewData?.overview) {
      html = getHtml(overviewData.overview);
    }
});

  const getHtml = (text: string) => {
    if (!text) return '';

    const lines = text.split('\n');

    let inDatasetSection = false;
    let listItems: string[] = [];
    let output: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^The following datasets are available:/i.test(trimmed)) {
        inDatasetSection = true;
        output.push(line);
        continue;
      }

      if (inDatasetSection && /^[“"]/.test(trimmed)) {
        listItems.push(
          `* ${trimmed
            .replace(/^[“"]\s*/, '')
            .replace(/[”"](?=\s*\()/, '')}`
        );
        continue;
      }

      if (
        inDatasetSection &&
        !/^[“"]/.test(trimmed) &&
        !/^The following datasets are available:/i.test(trimmed)
      ) {
        if (listItems.length) {
          output.push('');
          output.push(...listItems);
          output.push('');
          listItems = [];
        }
        inDatasetSection = false;
      }

      output.push(line);
    }

    if (listItems.length) {
      output.push('');
      output.push(...listItems);
      output.push('');
    }

    const final = output
      .join('\n')
      .replace(/([^\n])\n(\* )/g, '$1\n\n$2')
      .replace(/(\* .+)(\n(?!\* ))/g, '$1\n\n')
      .replace(/\n{3,}/g, '\n\n');

    return marked.parse(final, {
      gfm: true,
      breaks: false
    });
  };
</script>

{#if !overviewData}
  <!-- 🔥 skeleton -->
  <div class="mt-6 px-5 md:px-0">
    <div class="bg-gray-100 border border-gray-200 rounded-lg px-5 py-5 shadow-md">
      <div class="font-custom-style-h2 mb-4">AI Overview</div>
      <hr class="mb-4 border-gray-200" />
      <div class="bg-white rounded-md px-5 py-4 border border-gray-200 shadow-sm">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          <div class="h-4 bg-gray-300 rounded w-full"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <!-- ✅ content -->
  <div class="mt-6 px-5 md:px-0">
    <div class="bg-gray-100 border border-gray-200 rounded-lg px-5 py-5 shadow-md">
      <details open>
        <summary class="cursor-pointer font-custom-style-h2 mb-4">
          AI Overview
        </summary>

        <hr class="mb-4 border-gray-200" />

        <div class="bg-white rounded-md px-5 py-4 border border-gray-200 shadow-sm">
          {#if html}
            <div class="prose max-w-none mt-2">
              {@html html}
            </div>
          {:else}
            <div class="text-gray-500 text-sm">
              No overview available.
            </div>
          {/if}
        </div>
      </details>
    </div>
  </div>
{/if}