<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let providers = data.providers;
</script>

<div class="flex flex-col items-center justify-center h-screen bg-base-100 p-4">
  <div class="text-center mb-8">
    <h1 class="text-4xl font-bold mb-4">Welcome to HashMon Dashboard</h1>
    <p class="mb-6">Please log in using one of the available providers.</p>
  </div>
  <div class="flex flex-col space-y-4">
    {#if providers}
      {#if providers.length == 0}
        <p>No login providers are available.</p>
      {:else}
        {#each providers as provider}
          <form action="/login/{provider.name}" method="POST">
            <button
              class="btn btn-primary w-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <!-- Replace with provider-specific icon if available -->
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Login with {provider.name}
            </button>
          </form>
        {/each}
      {/if}
    {/if}
  </div>
</div>

<style>
</style>
