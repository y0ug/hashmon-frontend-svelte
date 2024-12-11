<script lang="ts">
  import { apiFetch } from "$lib/api";
  import { invalidateAll } from "$app/navigation";

  import type { PageData } from "./$types";
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const logout = async () => {
    await apiFetch(fetch, "/auth/logout");
    invalidateAll();
  };
</script>

<div>Private API for {data.user?.name}</div>
<div>
  <button onclick={logout}>Logout</button>
</div>
<div></div>
