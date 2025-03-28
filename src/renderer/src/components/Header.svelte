<script>
  import Icon from 'svelte-awesome'
  import timesCircle from 'svelte-awesome/icons/timesCircle'

  const handleClose = () => {
    window.api.closeApp()
  }
</script>

<header
  class="flex row w-fill center space-between p-1 bg-dark"
  style="position:absolute; top:0%; height: 12vh; border-radius: 0px !important"
>
  <div class="draggable"></div>
  <div><h1><span>Mognet-Central</span></h1></div>
  <button onclick={handleClose} class="button-drag">
    <Icon data={timesCircle} color="#f3e9d7" scale="1.2" />
  </button>
</header>
