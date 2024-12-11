<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types.js";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { redirect } from "@sveltejs/kit";

  interface Props {
    data: LayoutData;
    children: Snippet;
  }
  let { data, children }: Props = $props();

  if (!data.user) {
    if (browser) {
      goto("/");
    } else {
      redirect(303, "/");
    }
  }
</script>

{#if data.user}
  {@render children()}
{:else}
  <p>Forbiden</p>
{/if}
