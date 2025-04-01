<script>
  import Icon from 'svelte-awesome'
  import check from 'svelte-awesome/icons/check'
  import times from 'svelte-awesome/icons/times'

  export let result

  function truncateString(str) {
    return str.length > 20 ? str.slice(0, 20) + '...' : str
  }
</script>

<div class="entry outer">
  <div class="inner p-half" style="justify-content: space-between !important;">
      <div class="flex center row w-fill space-between">

          <div class="flex col w-20">
            <p>Name:</p>
            <p>Status:</p>
            <p>Mog:</p>
          </div>

          <div class="flex col w-60">
            <p>{truncateString(result.dir)}</p>
            <p>{result.status}</p>
            <p>{result.assignedMoogle}</p>
          </div>

          <div class="flex center col w-10">
            {#if result.status === 'Success'}
              <Icon data={check} color={'green'} scale="1.2" />
            {:else}
              <Icon data={times} color={'red'} scale="1.2" />
            {/if}
          </div>

      </div>
  </div>
</div>
