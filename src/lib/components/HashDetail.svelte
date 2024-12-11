<script lang="ts">
  import type { HashStatus } from "$lib/types";

  let { hash }: { hash: HashStatus } = $props();
</script>

<div class="bg-base-200 p-6 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold mb-4">Hash Detail</h2>
  <ul class="list-none space-y-2">
    <li>
      <strong>SHA256:</strong>
      {hash.sha256}
    </li>
    <li>
      <strong>Filename:</strong>
      {hash.filename}
    </li>
    <li>
      <strong>Build ID:</strong>
      {hash.build_id}
    </li>
    <li>
      <strong>Last Checked:</strong>
      {new Date(hash.last_check_at).toLocaleString()}
    </li>
    <li>
      <strong>Alerted By:</strong>
      {hash.alerted_by?.join(", ") || "None"}
    </li>
    <li>
      <strong>Providers:</strong>
      <ul class="list-disc ml-5">
        {#each Object.entries(hash.providers) as [provider, status]}
          <li class={status ? "text-red-500" : "text-green-500"}>
            {provider}: {status ? "True" : "False"}
          </li>
        {/each}
      </ul>
    </li>
  </ul>
</div>

<style>
</style>
