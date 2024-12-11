<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import updateLocale from "dayjs/plugin/updateLocale";
  import type { StatsResponse } from "$lib/types";
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

  let { stats }: { stats: StatsResponse } = $props();
  let totalHash = 1234;
  let activeMonitor = 987;
  let alertToday = 12;
  let lastCheck = new Date().setMinutes(new Date().getMinutes() - 2);
</script>

<div class="stats shadow">
  <!-- Total Hashes -->
  <div class="stat">
    <div class="stat-figure text-primary">
      <div class="stat-figure text-secondary">
        <div class="p-3 bg-primary bg-opacity-10 rounded-lg">
          <i class="fas fa-hashtag text-primary text-2xl"></i>
        </div>
      </div>
    </div>
    <div class="stat-title">Total Hashes</div>
    <div class="stat-value text-primary">{stats.total_hashes}</div>
  </div>

  <!-- Active Monitors -->
  <div class="stat">
    <div class="stat-figure text-secondary">
      <div class="p-3 bg-success bg-opacity-10 rounded-lg">
        <i class="fas fa-check text-success text-2xl"></i>
      </div>
    </div>
    <div class="stat-title">Total Found</div>
    <div class="stat-value text-secondary">{stats.total_hashes_found}</div>
  </div>

  <!-- Alerts Today -->
  <div class="stat">
    <div class="stat-figure text-secondary">
      <div class="p-3 bg-warning bg-opacity-10 rounded-lg">
        <i class="fas fa-bell text-warning text-2xl"></i>
      </div>
    </div>
    <div class="stat-title">Alert Today</div>
    <div class="stat-value text-secondary">{stats.hashes_found_today}</div>
  </div>

  <!-- Last Check -->
  <div class="stat">
    <div class="stat-figure text-secondary">
      <div class="p-3 bg-info bg-opacity-10 rounded-lg">
        <i class="fas fa-clock text-info text-2xl"></i>
      </div>
    </div>
    <div class="stat-title">Last Check</div>
    <div class="stat-value text-secondary">
      {dayjs(stats.global_last_check_at).fromNow()}
    </div>
  </div>
</div>
