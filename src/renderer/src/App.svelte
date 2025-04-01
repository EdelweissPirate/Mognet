<script>
  import { onMount } from 'svelte'

  import Header from './components/Header.svelte'
  import Cctv from './components/CCTV.svelte'
  import Input from './components/Input.svelte'
  import Results from './components/Results.svelte'

  import { muted, deploy_results, counters } from './store.js'

  import { mogNames } from './assets/moogles.js'
  import { playSound } from './sounds.js'

  const randomMoogle = () => {
    const index = Math.floor(Math.random() * mogNames.length - 1) + 1
    return mogNames[index]
  }

  onMount(() => {
    window.api.onLoopUpdate((data) => {
      data.assignedMoogle = randomMoogle()

      deploy_results.update((results) => {
        return [data, ...results]
      })
    })

    window.api.onLoopDone((data) => {
      counters.update(() => {
        return data
      })
      playSound('kupo')
    })

    playSound('flute', () => {
      setTimeout(() => {
        if (!$muted) {
          playSound('music')
        }
      }, 1000)
    })
  })
</script>

<Header />

<section class="flex col outer">
  <div class="inner" style="padding: 0.5rem 0.125rem;">
    <div class="flex col w-50 m-half h-fill center space-between">
      <Input disabled_reset={$deploy_results.length <= 0} />
      <Cctv />
    </div>
    <div class="flex col w-50 m-half h-fill">
      <Results />
    </div>
  </div>
</section>
