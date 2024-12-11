<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let providers = data.providers;
</script>

<svelte:head>
  <title>HashMon - Login</title>
</svelte:head>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <h1 class="text-4xl font-bold mb-4">Login now!</h1>
      <p class="py-6">Please log in using one of the available providers.</p>
    </div>
    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div class="card-body">
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
  </div>
</div>
