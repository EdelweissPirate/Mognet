<script>
  import feedVideo from '../assets/warehouse.mp4?url'
  import grainVideo from '../assets/grain.mp4?url'
  import { onMount } from 'svelte'

  let time = $state(new Date())

  let live = $state(false)

  const padNumber = (num) => {
    let string = String(num).split('')
    if (string.length < 2) {
      string = ['0', ...string].join('')
    } else {
      string = num.toString()
    }

    return string
  }

  // these automatically update when `time`
  // changes, because of the `$:` prefix
  let hours = $derived(padNumber(time.getHours()))
  let minutes = $derived(padNumber(time.getMinutes()))
  let seconds = $derived(padNumber(time.getSeconds()))

  let day = $derived(padNumber(time.getDate()))
  let month = $derived(padNumber(time.getMonth() + 1))
  let year = $derived(padNumber(time.getFullYear()))

  onMount(() => {
    setInterval(() => {
      time = new Date()
    }, 1000)

    setTimeout(() => {
      live = true
    }, 2000)
  })
</script>

<div class="h-50 w-fill outer" style={`position: relative`}>
  <div class="inner">
    <!-- Grain -->
    <div class="cctv-grain-holder">
      <video preload class="cctv-grain" src={grainVideo} autoplay loop>
        <track kind="captions" />
      </video>
    </div>

    <!-- Time -->
    <div class="cctv-time">
      <p style="width: 100%; font-family: 'Consolas' !important;">
        {hours + ':' + minutes + ':' + seconds + ' - '}
        {day + '/' + month + '/' + year}
      </p>
    </div>

    <!-- Bars -->
    <div class="cctv-bars">
      <div class="cctv-bar"></div>
      <div class="cctv-bar"></div>
    </div>

    <!-- Feed -->
    {#if live}
      <div class="cctv-video-holder">
        <video class="cctv-video" preload src={feedVideo} autoplay loop>
          <track kind="captions" />
        </video>
      </div>
    {:else}
      <!-- PLACEHOLDER -->
      <div class="cctv-placeholder">
        <p style="font-family: 'Consolas' !important;">Connecting to Mognet CCTV...</p>
      </div>
    {/if}
  </div>
</div>
