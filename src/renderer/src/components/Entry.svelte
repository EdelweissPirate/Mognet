<script>
  import Icon from 'svelte-awesome'
  import check from 'svelte-awesome/icons/check'
  import times from 'svelte-awesome/icons/times'

  export let result

  function truncateString(str) {
    return str.length > 15 ? str.slice(0, 15) + '...' : str
  }
</script>

<div class="entry flex center row w-fill space-between border-dark p-half">
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
      <Icon data={check} color={'green'} scale="1.5" />
    {:else}
      <Icon data={times} color={'red'} scale="1.5" />
    {/if}
  </div>
</div>
