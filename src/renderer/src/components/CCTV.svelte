<script>
  import feedVideo from '../assets/warehouse.mp4?url'
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

<div class="h-50 w-fill border" style={`position: relative`}>
  <!-- Grain -->
  <!-- <div
    style="opacity: 0.35; position: absolute; width: 100%; height: 100%; overflow: hidden; top: 0%; z-index: 998"
  >
    <video
      preload
      style="
      width: 100%;
      height: 100%
      z-index: -100;
      background-size: cover;
      overflow: hidden;
      background-clip:content-box;
      "
      src={grainVideo}
      autoplay
      loop
    >
      <track kind="captions" />
    </video>
  </div> -->

  <!-- Time -->
  <div
    style="font-size:x-small; position: absolute; z-index: 997; color: #fff; bottom: 5%; right: 5%; padding: 0.25rem;"
  >
    <p style="width: 100%">
      {hours + ':' + minutes + ':' + seconds + ' - '}
      {day + '/' + month + '/' + year}
    </p>
  </div>

  <!-- Bars -->
  <div
    style="position: absolute; background-clip:content-box; overflow: hidden; top: 0%; z-index: 999; width:100%; height:100%; display: flex; flex-direction: column; justify-content: space-between;"
  >
    <div
      style="height: 6%; background-color: #000; padding: .25rem; border-radius: 0px !important"
    ></div>
    <div
      style="height: 6%; background-color: #000; padding: .25rem; border-radius: 0px !important"
    ></div>
  </div>

  <!-- Feed -->
  {#if live}
    <div
      style="position: absolute; width: 100%; height: 100%; overflow: hidden; top: 0%; z-index: 996"
    >
      <video
        preload
        style="
      width: 100%;
      height: 100%
      z-index: -100;
      background-size: cover;
      overflow: hidden;
      background-clip:content-box;
      "
        src={feedVideo}
        autoplay
        loop
      >
        <track kind="captions" />
      </video>
    </div>
  {/if}

  <!-- plACEHOLDER -->
  <div
    style="position: absolute; background-clip:content-box; overflow: hidden; top: 0%; z-index: -1; width:100%; height:100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #000; color: #fff; font-size: small"
  >
    <p>Connecting to Mognet CCTV...</p>
  </div>
</div>
