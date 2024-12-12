<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
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
  import VisibilityIntervalManager from "$lib/VisibilityIntervalManager";
  import { onMount } from "svelte";

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
  let formPerPage: HTMLFormElement | null = $state(null);

  onMount(() => {
    let intervalManager = new VisibilityIntervalManager(30, () => {
      invalidate("app:hashes");
      console.log("Fetching data...");
    });
    intervalManager.initialize();
    return () => {
      intervalManager.destroy();
    };
  });
  // let info = $derived(data.data);
  //
  // Function to handle filter changes
  let selectedFilter = data.currentFilter || "";
  function handleFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    selectedFilter = select.value;

    // Get current URL search parameters
    const url = new URL(window.location.href);
    url.searchParams.set("filter", selectedFilter || ""); // Set or remove the filter

    // Reset to page 1 when filter changes
    url.searchParams.set("page", "1");

    // Navigate to the updated URL
    goto(url.toString(), { replaceState: false });
  }
</script>

<div class="container mx-auto p-4">
  <div class="max-w-8xl mx-auto">
    <div class="justify-center items-center flex">
      <Stats stats={data.stats} />
    </div>

    {#if form?.error}
      <p class="error">{form?.error}</p>
    {/if}

    {#if creating}
      <p>Submitting hash...</p>
    {/if}

    <AddHashFormModal {creating} bind:isCreateHashOpen />
    <noscript>
      <AddHashForm {creating} />
    </noscript>
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
              />
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              >
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>

          <!-- Filter Button -->
          <!-- <button class="btn btn-ghost"> -->
          <!--   <i class="fas fa-filter mr-2"></i>Filter -->
          <!-- </button> -->

          <!-- Filter Dropdown -->
          <div class="relative inline-block text-left">
            <!-- <div> -->
            <!--   <button -->
            <!--     type="button" -->
            <!--     class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" -->
            <!--     id="filter-menu" -->
            <!--     aria-expanded="true" -->
            <!--     aria-haspopup="true" -->
            <!--   > -->
            <!--     <i class="fas fa-filter mr-2"></i>Filter -->
            <!--     <svg -->
            <!--       class="-mr-1 ml-2 h-5 w-5" -->
            <!--       xmlns="http://www.w3.org/2000/svg" -->
            <!--       viewBox="0 0 20 20" -->
            <!--       fill="currentColor" -->
            <!--       aria-hidden="true" -->
            <!--     > -->
            <!--       <path -->
            <!--         fill-rule="evenodd" -->
            <!--         d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" -->
            <!--         clip-rule="evenodd" -->
            <!--       /> -->
            <!--     </svg> -->
            <!--   </button> -->
            <!-- </div> -->

            <!-- Dropdown panel, show/hide based on dropdown state -->
            <!-- <select> -->
            <!--   <option>All</option> -->
            <!--   <option>Found by provider</option> -->
            <!--   <option>Not found</option> -->
            <!-- </select> -->
          </div>
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
      {#await data.data}
        <div>Loading...</div>
      {:then hashes}
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Actions</th>
                <th>Comment</th>
                <th>Last Checked</th>
                <th>Status</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {#each hashes.hashes.filter((v) => !deleting.includes(v)) as hash (hash.hash)}
                <HashLine {hash} />
              {/each}
              <!-- Repeat <tr> for more rows -->
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="form-control">
            <form bind:this={formPerPage}>
              <input type="hidden" name="page" value={hashes.page} />
              <select
                name="per_page"
                class="select select-bordered"
                onchange={() => formPerPage?.submit()}
                bind:value={hashes.per_page}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button type="submit" class="btn btn-ghost" aria-label="submit"
                ><i class="fa-solid fa-check"></i></button
              >
            </form>
          </div>
          <div class="flex items-center space-x-2">
            <a
              href="?per_page={hashes.per_page}&page={hashes.page - 1}"
              class="btn btn-ghost btn-sm {hashes.page == 1
                ? 'btn-disabled'
                : ''}"
              aria-label="Previous page"
            >
              <i class="fas fa-chevron-left"></i>
            </a>
            <span class="text-sm"
              >Page {hashes.page} of {hashes.total_pages}</span
            >
            <a
              href="?per_page={hashes.per_page}&page={hashes.page + 1}"
              class="btn btn-ghost btn-sm {hashes.page == hashes.total_pages
                ? 'btn-disabled'
                : ''}"
              aria-label="Next page"
            >
              <i class="fas fa-chevron-right"></i>
            </a>
          </div>
        </div>
      {/await}
    </div>
  </div>
</div>
