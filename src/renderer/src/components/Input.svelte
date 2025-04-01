<script>
  import { onMount } from 'svelte'
  import Icon from 'svelte-awesome'
  import check from 'svelte-awesome/icons/check'
  import times from 'svelte-awesome/icons/times'
  import clockO from 'svelte-awesome/icons/clockO'
  import hand from '../assets/hand.png?url'

  import { dir_path, message, deploy_results, counters } from '../store.js'
  import { playSound } from '../sounds.js'

  // export let do_deploy
  // export let reset
  export let disabled_reset

  let inputDir
  let inputMsg
  let inputValueDir = $dir_path
  let inputValueMessage = $message
  let dirValid = false
  let timeoutDirCheck = null
  let timeoutMessCheck = null

  let iconDir = times
  let iconMess = times

  let selections = ['dir', 'msg']
  let selected_index = 0
  let selected = 'dir'

  //
  async function changeSelection(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
    }

    if (event.key === 'ArrowUp') {
      selected_index--
      playSound('moveSound')
    } else if (event.key === 'ArrowDown' || event.key === 'Tab') {
      selected_index++
      playSound('moveSound')
    }

    selected_index =
      selected_index > selections.length - 1
        ? 0
        : selected_index < 0
          ? selections.length - 1
          : selected_index

    selected = selections[selected_index]

    switch (selected) {
      case 'dir':
        inputDir?.focus()
        break

      case 'msg':
        inputMsg?.focus()
        break
    }
  }

  onMount(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    audioContext.resume()

    inputDir?.focus()
  })
  //

  const handleChangeDir = async (e) => {
    e.preventDefault()

    dir_path.update(() => {
      return inputValueDir
    })

    if (timeoutDirCheck) clearTimeout(timeoutDirCheck)

    iconDir = clockO

    timeoutDirCheck = setTimeout(async () => {
      dirValid = await window.api.checkDir($dir_path)
      if (dirValid) {
        iconDir = check
        playSound('write')
      } else {
        iconDir = times
        playSound('badSound')
      }
    }, 1000)
  }

  const handleChangeMessage = async (e) => {
    e.preventDefault()

    message.update(() => {
      return inputValueMessage
    })

    iconMess = clockO

    if (timeoutMessCheck) clearTimeout(timeoutMessCheck)

    timeoutMessCheck = setTimeout(async () => {
      if (inputValueMessage.length > 0) {
        iconMess = check
        playSound('write')
      } else {
        iconMess = times
        playSound('badSound')
      }
    }, 1000)
  }

  const do_deploy = (e) => {
    e.preventDefault()

    reset(e)

    let data = {
      dir_path: $dir_path,
      message: $message
    }

    data.dir_path = data.dir_path.replace(/[\n\r\t]/g, '')
    data.message = data.message.replace(/[\n\r\t]/g, '')

    window.api.deployCargo(data)
    playSound('kweh')
  }

  const reset = (e) => {
    e.preventDefault()

    deploy_results.update(() => {
      return []
    })
    counters.update(() => {
      return {}
    })
  }
</script>

<div class="flex h-50" style="justify-content: flex-start;">
  <div class="outer" style="height: 95%">
    <div class="inner">
      <form class="center space-between">
        <div class="form-element">
          <label for="inputSource">
            {#if selected === 'dir'}
              <img src={hand} alt="hand icon" />
            {:else}
              📦
            {/if}
          </label>
          <input
            class="text-center"
            name="inputSource"
            type="text"
            placeholder="Enter dir path"
            spellcheck="false"
            bind:this={inputDir}
            bind:value={inputValueDir}
            oninput={(e) => handleChangeDir(e)}
            onkeydown={(e) => changeSelection(e)}
            required
          />
          <div class="icon">
            <Icon data={iconDir} color={dirValid ? 'green' : 'red'} />
          </div>
        </div>

        <div class="form-element">
          <label for="inputLabel">
            {#if selected === 'msg'}
              <img src={hand} alt="hand icon" />
            {:else}
              🏷️
            {/if}</label
          >
          <input
            class="text-center"
            name="inputLabel"
            type="text"
            placeholder="Enter message"
            spellcheck="false"
            bind:this={inputMsg}
            bind:value={inputValueMessage}
            oninput={(e) => handleChangeMessage(e)}
            onkeydown={(e) => changeSelection(e)}
            required
          />
          <div class="icon">
            <Icon data={iconMess} color={iconMess === check ? 'green' : 'red'} />
          </div>
        </div>

        <div class="controls">
          <button
            class="btn"
            disabled={!dirValid || !(iconMess === check)}
            onclick={(e) => do_deploy(e)}
          >
            <div class="flex center row">
              <p>DEPLOY</p>
            </div>
          </button>

          <button disabled={disabled_reset} class="btn" onclick={(e) => reset(e)}>
            <div class="flex center row">
              <p>RESET</p>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- npx @threlte/gltf@latest ./road.glb -s -->
