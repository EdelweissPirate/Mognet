import { writable } from 'svelte/store'

import times from 'svelte-awesome/icons/times'

export const muted = writable(false)

export const dir_path = writable(null)
export const message = writable(null)

export const deploy_results = writable([])

export const counters = writable({})

export const selected = writable('dir')

export const dirValid = writable(false)

export const iconDir = writable(times)
export const iconMess = writable(times)
