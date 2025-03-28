import { writable } from 'svelte/store'

export const muted = writable(true)

export const dir_path = writable(null)
export const message = writable(null)

export const deploy_results = writable([])

export const counters = writable({})
