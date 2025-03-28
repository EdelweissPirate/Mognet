<script>
  import Icon from 'svelte-awesome'
  import check from 'svelte-awesome/icons/check'
  import times from 'svelte-awesome/icons/times'
  import clockO from 'svelte-awesome/icons/clockO'

  import { dir_path, message, deploy_results, counters } from '../store.js'
  import { playSound } from '../sounds.js'

  // export let do_deploy
  // export let reset
  export let disabled_reset

  let inputValueDir = $dir_path
  let inputValueMessage = $message
  let dirValid = false
  let timeoutDirCheck = null
  let timeoutMessCheck = null

  let iconDir = times
  let iconMess = times

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

<div class="flex h-50">
  <form>
    <div class="form-element">
      <label for="inputSource">📦</label>
      <input
        class="text-center"
        name="inputSource"
        type="text"
        placeholder="Enter dir path"
        spellcheck="false"
        bind:value={inputValueDir}
        oninput={(e) => handleChangeDir(e)}
        required
      />
      <div class="icon">
        <Icon data={iconDir} color={dirValid ? 'green' : 'red'} />
      </div>
    </div>

    <div class="form-element">
      <label for="inputLabel">🏷️</label>
      <input
        class="text-center"
        name="inputLabel"
        type="text"
        placeholder="Enter message"
        spellcheck="false"
        bind:value={inputValueMessage}
        oninput={(e) => handleChangeMessage(e)}
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
        DEPLOY CARGO
      </button>

      <button disabled={disabled_reset} class="btn" onclick={(e) => reset(e)}>RESET</button>
    </div>
  </form>
</div>

<!-- npx @threlte/gltf@latest ./road.glb -s -->
