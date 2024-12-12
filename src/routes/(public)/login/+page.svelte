<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let providers = data.providers;

  function getIconClasses(providerName: string): string {
    const brands = ["google", "github"];
    if (brands.includes(providerName.toLowerCase())) {
      return `fa-brands fa-${providerName.toLowerCase()} text-primary`;
    }
    return "fa-solid fa-right-to-bracket text-primary";
  }
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
                <button class="btn btn-neutral w-full">
                  <i class={getIconClasses(provider.name)}></i>
                  <span class="ml-2">
                    Login with {provider.name}
                  </span>
                </button>
              </form>
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>
