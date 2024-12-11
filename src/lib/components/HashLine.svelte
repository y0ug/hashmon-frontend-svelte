<script lang="ts">
  import type { HashStatus } from "$lib/types";
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

  let { hash }: { hash: HashStatus } = $props();
</script>

<tr>
  <td>
    <div class="flex space-x-2">
      <a href="/hash/{hash.sha256}" class="btn btn-ghost btn-sm text-primary">
        <i class="fas fa-eye"></i>
      </a>
      <form action="?/delete" method="POST">
        <input type="hidden" name="sha256" value={hash.sha256} />
        <button type="submit" class="btn btn-ghost btn-sm text-error">
          <i class="fas fa-trash"></i>
        </button>
      </form>
    </div>
  </td>
  <td>{hash.filename}</td>
  <td>{hash.build_id}</td>
  <td>{dayjs(hash.last_check_at).fromNow()}</td>
  <!-- <td>{hash.alerted_by?.join(", ") || "None"}</td> -->
  <td>
    <span
      class={Object.values(hash.providers).some((p) => p)
        ? "badge  flex items-center badge-error"
        : "badge  flex items-centerbadge-success"}
    >
      <i class="fas fa-check-circle mr-1"></i>Active
    </span>
  </td>
  <td>
    <div class="flex items-center">
      <span class="text-sm font-mono mr-2">{hash.sha256}</span>
      <button class="btn btn-ghost btn-sm">
        <i class="fas fa-copy"></i>
      </button>
    </div>
  </td>
</tr>
