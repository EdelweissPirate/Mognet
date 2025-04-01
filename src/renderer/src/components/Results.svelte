<script>
  import { dir_path, counters } from '../store.js'
</script>

<div
  class="outer flex center col"
  style="width: 100% !important; height: 25% !important; margin-bottom: 0.125rem"
>
  <div class="inner results flex col center">
    <div
      class="fill flex col center"
      style="padding: 0.25rem !important; border-radius: 0px !important; margin:auto"
    >
      {#if $dir_path}
        <p class="w-fill" style="text-align: left">{$dir_path.split('\\').pop()}</p>
      {:else}
        <p class="w-fill" style="text-align: left">** No source set **</p>
      {/if}
      <div class="flex row w-fill" style="border-radius: 0px !important;">
        <div class="flex col w-50" style="border-radius: 0px !important;">
          <p>Total packages: {$counters.counter_all}</p>
          <p>Moved packages: {$counters.counter_moved}</p>
        </div>
        <div class="flex col w-50" style="border-radius: 0px !important;">
          <p>Success packages: {$counters.counter_success}</p>
          <p>Failed packages: {$counters.counter_fail}</p>
        </div>
      </div>
    </div>
  </div>
</div>
