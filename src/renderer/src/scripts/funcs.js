import { get } from 'svelte/store'
import { playSound } from './sounds.js'

import check from 'svelte-awesome/icons/check'
import times from 'svelte-awesome/icons/times'
import clockO from 'svelte-awesome/icons/clockO'

import { cleanString, randomMoogle } from './utils.js'

import {
  muted,
  message,
  counters,
  deploy_results,
  selected,
  iconDir,
  iconMess,
  dir_path,
  dirValid
} from '../store.js'

const selections = ['dir', 'msg']
let selected_index = 0

let timeoutDirCheck = null
let timeoutMessCheck = null

export const initFeedListener = () => {
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
      if (!get(muted)) {
        playSound('music')
      }
    }, 1000)
  })
}

export async function changeSelection(event) {
  if (event.key === 'Tab') {
    event.preventDefault()
  }

  if (event.key === 'Enter') {
    event.preventDefault()

    const _selected = get(selected)
    const _message = get(message)

    if (_selected === selections[0]) handleDirSelect(event)
    if (_selected === selections[1] && dirValid && _message.length > 0) do_deploy(event)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    reset(event)
  }

  let newIndex
  if (event.key === 'ArrowUp') {
    newIndex = selected_index - 1
    selected_index = newIndex
    playSound('moveSound')
  } else if (event.key === 'ArrowDown' || event.key === 'Tab') {
    newIndex = selected_index + 1
    selected_index = newIndex
    playSound('moveSound')
  }

  setSelection()
}

export function setSelection() {
  selected_index =
    selected_index > selections.length - 1
      ? 0
      : selected_index < 0
        ? selections.length - 1
        : selected_index

  selected.update(() => {
    return selections[selected_index]
  })
}

export const handleDirSelect = async (e) => {
  e.preventDefault()

  const newPath = await window.api.selectDir()

  if (newPath) {
    dir_path.update(() => {
      return newPath
    })
  }

  if (timeoutDirCheck) clearTimeout(timeoutDirCheck)

  timeoutDirCheck = setTimeout(async () => {
    const _dV = await window.api.checkDir(get(dir_path))

    dirValid.update(() => {
      return _dV
    })

    if (get(dirValid)) {
      iconDir.update(() => {
        return check
      })
      playSound('write')
    } else {
      iconDir.update(() => {
        return times
      })
      playSound('badSound')
    }
  }, 1000)
}

export const handleChangeMessage = async () => {
  const msg = get(message)

  message.update(() => {
    return cleanString(msg)
  })

  iconMess.update(() => {
    return clockO
  })

  if (timeoutMessCheck) clearTimeout(timeoutMessCheck)

  timeoutMessCheck = setTimeout(async () => {
    if (msg.length > 0) {
      iconMess.update(() => {
        return check
      })
      playSound('write')
    } else {
      iconMess.update(() => {
        return times
      })
      playSound('badSound')
    }
  }, 1000)
}

export const do_deploy = (e) => {
  e.preventDefault()

  clearResults()

  let data = {
    dir_path: get(dir_path),
    message: get(message)
  }

  data.dir_path = data.dir_path.replace(/[\n\r\t]/g, '')
  data.message = data.message.replace(/[\n\r\t]/g, '')

  playSound('kweh')
  window.api.deployCargo(data)
}

export const reset = (e) => {
  e.preventDefault()

  //
  iconDir.update(() => {
    return times
  })
  iconMess.update(() => {
    return times
  })

  dirValid.update(() => {
    return false
  })
  //

  dir_path.update(() => {
    return null
  })

  message.update(() => {
    return null
  })

  clearResults()

  selected_index = 0

  setSelection()

  playSound('cancel')
}

export const clearResults = () => {
  deploy_results.update(() => {
    return []
  })
  counters.update(() => {
    return {}
  })
}
