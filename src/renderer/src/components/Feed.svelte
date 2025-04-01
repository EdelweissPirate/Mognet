<script>
  import Entry from './Entry.svelte'
  import Results from './Results.svelte'

  import { deploy_results } from '../store.js'
</script>

<div class="flex center col fill outer">
  <div class="flex center col inner space-around">
    <Results />

    <ul class="scroll-box">
      {#each $deploy_results as result}
        <Entry {result} />
      {/each}
    </ul>
  </div>
</div>
