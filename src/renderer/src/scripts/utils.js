import { mogNames } from './moogles.js'

export const cleanString = (str) => {
  return str.replace(/[^a-zA-Z0-9 _-]/g, '')
}

export const truncateString = (str) => {
  return str.length > 20 ? str.slice(0, 20) + '...' : str
}

export const randomMoogle = () => {
  const index = Math.floor(Math.random() * mogNames.length - 1) + 1
  return mogNames[index]
}
