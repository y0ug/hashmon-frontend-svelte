<script lang="ts">
  import Profile from "$lib/components/profile.svelte";
  import type { PageData } from "./$types";
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let user = data.user;
</script>

{#if user}
  <Profile {user} />
{/if}
