<script lang="ts">
  import { enhance } from "$app/forms";
  let { creating } = $props();
</script>

<div>
  <div class="card shadow-lg mb-8">
    <div class="card-body">
      <h2 class="text-2xl mb-4">Add New Hash</h2>
      <form
        method="POST"
        action="?/create"
        use:enhance={() => {
          creating = true;
          return async ({ update }) => {
            await update();
            creating = false;
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
            <span class="label-text">comment</span>
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
