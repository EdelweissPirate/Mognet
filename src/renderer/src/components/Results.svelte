<script>
  import Entry from './Entry.svelte'

  import { dir_path, deploy_results, counters } from '../store.js'
</script>

<div class="flex center col fill space-around">
  <div class="results">
    {#if $dir_path}
      <p>{$dir_path.split('\\').pop()}</p>
    {:else}
      <p>** No source set **</p>
    {/if}
    <div class="flex row w-fill">
      <div class="flex col w-50">
        <p>Total packages: {$counters.counter_all}</p>
        <p>Moved packages: {$counters.counter_moved}</p>
      </div>
      <div class="flex col w-50">
        <p>Success packages: {$counters.counter_success}</p>
        <p>Failed packages: {$counters.counter_fail}</p>
      </div>
    </div>
  </div>

  <ul class="scroll-box">
    {#each $deploy_results as result}
      <Entry {result} />
    {/each}
  </ul>
</div>
