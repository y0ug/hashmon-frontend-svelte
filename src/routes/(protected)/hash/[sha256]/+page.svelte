<script lang="ts">
  import HashDetail from "$lib/components/HashDetail.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let hash = data.hash;
</script>

<div class="container mx-auto px-4 mt-20">
  {#if hash}
    <HashDetail {hash} />
  {:else}
    <div class="text-center">
      <h2 class="text-2xl font-bold">Hash Not Found</h2>
      <a class="btn btn-primary mt-4" href="/hash">Go Back</a>
    </div>
  {/if}
</div>
