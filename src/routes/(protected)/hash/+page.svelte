<script lang="ts">
  import { deleteHash } from "$lib/api";
  import AddHashForm from "$lib/components/AddHashForm.svelte";
  import AddHashFormModal from "$lib/components/AddHashFormModal.svelte";
  import HashDetail from "$lib/components/HashDetail.svelte";
  import HashLine from "$lib/components/HashLine.svelte";
  import Stats from "$lib/components/Stats.svelte";
  import type { HashStatus } from "$lib/types";
  import type { ActionData, PageData } from "./$types";
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import updateLocale from "dayjs/plugin/updateLocale";

  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few secs",
      m: "a min",
      mm: "%d mins",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });
  let { data, form }: { data: PageData; form: ActionData } = $props();

  // async function handleSubmit(event: {
  //   currentTarget: EventTarget & HTMLFormElement;
  // }) {
  //   event.preventDefault();
  // }
  //
  let creating = $state(false);
  let deleting: HashStatus[] = $state([]);
  let isCreateHashOpen = $state(false);
  let searchTerm = "";

  let filteredHashes = [];
  const searchHashes = () => {
    return (filteredHashes = data.hashes.filter((h) => {
      let sha256 = h.sha256.toLowerCase();
      return sha256.includes(searchTerm.toLowerCase());
    }));
  };
</script>

<div class="container mx-auto p-4">
  <div class="max-w-8xl mx-auto">
    <div class="justify-center items-center flex">
      <Stats />
    </div>

    {#if form?.error}
      <p class="error">{form?.error}</p>
    {/if}

    {#if creating}
      <p>Submitting hash...</p>
    {/if}

    <AddHashFormModal {creating} bind:isCreateHashOpen />
  </div>

  <div class="card shadow-lg">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Hash List</h2>
        <div class="flex space-x-4">
          <!-- Search Input -->
          <div class="form-control">
            <div class="relative">
              <input
                type="text"
                placeholder="Search hashes..."
                class="input input-bordered w-full pr-10 pl-10"
                bind:value={searchTerm}
                oninput={searchHashes}
              />
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>

          <!-- Filter Button -->
          <button class="btn btn-ghost">
            <i class="fas fa-filter mr-2"></i>Filter
          </button>

          <!-- Export Button -->
          <button class="btn btn-ghost">
            <i class="fas fa-download mr-2"></i>Export
          </button>

          <!-- Add Button -->
          <button
            class="btn btn-ghost"
            onclick={() => (isCreateHashOpen = true)}
            ><i class="fas fa-add mr-2"></i>Add Hash</button
          >
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Filename</th>
              <th>Build ID</th>
              <th>Last Checked</th>
              <th>Status</th>
              <th>SHA256</th>
            </tr>
          </thead>
          <tbody>
            {#each data.hashes.filter((v) => !deleting.includes(v)) as hash (hash.sha256)}
              <HashLine {hash} />
            {/each}
            <!-- Repeat <tr> for more rows -->
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4">
        <div class="form-control">
          <select class="select select-bordered">
            <option>10 per page</option>
            <option>20 per page</option>
            <option>50 per page</option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <button class="btn btn-ghost btn-sm" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="text-sm">Page 1 of 10</span>
          <button class="btn btn-ghost btn-sm">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
