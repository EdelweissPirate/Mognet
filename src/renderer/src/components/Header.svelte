<script>
  import Icon from 'svelte-awesome'
  import timesRectangle from 'svelte-awesome/icons/timesRectangle'
  import volumeUp from 'svelte-awesome/icons/volumeUp'
  import volumeOff from 'svelte-awesome/icons/volumeOff'
  import windowMinimize from 'svelte-awesome/icons/windowMinimize'

  import { muted } from '../store.js'
  import { playSound, stopSound } from '../scripts/sounds.js'
  import { onMount } from 'svelte'

  let version

  onMount(async () => {
    version = await window.api.getVersion()
  })

  const handleClose = () => {
    stopSound('music')
    playSound('cancel')

    setTimeout(() => {
      window.api.closeApp()
    }, 200)
  }

  const handleMinimize = () => {
    stopSound('music')
    playSound('done')

    setTimeout(() => {
      window.api.minimizeApp()
    }, 200)
  }

  const handleMute = () => {
    muted.update(() => {
      const newMute = !$muted
      if (newMute) stopSound('music')
      if (!newMute) playSound('music')

      return newMute
    })
  }
</script>

<header class="flex row center space-between outer">
  <div class="fill inner flex row w-fill center p-1" style="justify-content: space-between;">
    <div class="draggable"></div>

    <div><h1>Mognet-Central <span>v{version}</span></h1></div>

    <div>
      <button onclick={handleMute} class="button-drag">
        {#if $muted}
          <Icon data={volumeOff} color="#f2f2f2" scale="1.2" />
        {:else}
          <Icon data={volumeUp} color="#f2f2f2" scale="1.2" />
        {/if}
      </button>
      <button onclick={handleMinimize} class="button-drag">
        <Icon data={windowMinimize} color="#f2f2f2" scale="1.2" />
      </button>
      <button onclick={handleClose} class="button-drag">
        <Icon data={timesRectangle} color="#f2f2f2" scale="1.2" />
      </button>
    </div>
  </div>
</header>
