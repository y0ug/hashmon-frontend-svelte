<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/header.svelte";
  import type { LayoutData } from "./$types";
  import type { Snippet } from "svelte";
  import { apiFetch } from "$lib/api";
  import { invalidateAll } from "$app/navigation";

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  let { data, children }: Props = $props();
  let user = data.user;

  const logout = async () => {
    await apiFetch(fetch, "/auth/logout");
    invalidateAll();
    return false;
  };
</script>

<svelte:head>
  <title>HashMon</title>
</svelte:head>

<Header {user} {logout} />
<div class="flex justify-center mt-20">
  {@render children()}
</div>
