<script lang="ts">
  import type { User } from "$lib/types";
  interface Props {
    user: User;
  }

  let { user }: Props = $props();
</script>

<div class="bg-base-200 p-6 rounded-lg shadow-lg max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-4">User Profile</h2>
  <div class="flex items-center space-x-4 mb-4">
    {#if user.picture}
      <img
        src={user.picture}
        alt="profile"
        class="w-16 h-16 rounded-full object-cover"
      />
    {:else}
      <div
        class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl text-white"
      >
        {#if user.name}
          {user.name.charAt(0).toUpperCase()}
        {/if}
      </div>
    {/if}
    <div>
      <p class="font-semibold">{user.name}</p>
      <p class="text-sm text-gray-600">{user.email}</p>
    </div>
  </div>
  <p><strong>Sub:</strong> {user.sub}</p>
  <!-- Add more user details as needed -->
</div>
