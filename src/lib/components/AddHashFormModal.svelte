<script lang="ts">
  import { enhance } from "$app/forms";
  let { creating, isCreateHashOpen = $bindable() } = $props();
</script>

<div>
  <div class="modal" class:modal-open={isCreateHashOpen}>
    <div class="modal-box">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onclick={() => (isCreateHashOpen = false)}>✕</button
        >
      </form>
      <h2 class="text-2xl mb-4">Add New Hash</h2>
      <form
        method="POST"
        action="?/create"
        use:enhance={() => {
          creating = true;
          return async ({ update }) => {
            await update();
            creating = false;
            isCreateHashOpen = false;
          };
        }}
        class="space-y-4"
      >
        <div class="">
          <div class="label">
            <span class="label-text">Hash*</span>
          </div>
          <input
            type="text"
            name="hash"
            class="input input-bordered w-full focus:outline-primary"
            disabled={creating}
            required
          />
        </div>
        <div class="">
          <div class="label">
            <span class="label-text">Comment</span>
          </div>
          <input
            type="text"
            name="comment"
            class="input input-bordered w-full focus:outline-primary"
            disabled={creating}
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" disabled={creating} class="btn btn-primary">
            Add Hash
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
