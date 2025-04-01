import Music from './assets/SFX/music_rotting_pizza.mp3?url'
import Flute from './assets/SFX/mog_flute.mp3?url'
import Kweh from './assets/SFX/Chocobo2.mp3?url'
import Kupo from './assets/SFX/moogle_noise.mp3?url'
import MoveSound from './assets/SFX/cursor-move.mp3?url'
import Accept from './assets/SFX/Cursor - Accept.mp3?url'
import Cancel from './assets/SFX/cursor-cancel.mp3?url'
import Write from './assets/SFX/Purchase.mp3?url'
import Done from './assets/SFX/Save Point.mp3?url'
import BadSound from './assets/SFX/Cursor - Buzzer.mp3?url'

export const sounds = {
  music: new Audio(Music),
  flute: new Audio(Flute),
  kweh: new Audio(Kweh),
  kupo: new Audio(Kupo),
  moveSound: new Audio(MoveSound),
  accept: new Audio(Accept),
  cancel: new Audio(Cancel),
  write: new Audio(Write),
  done: new Audio(Done),
  badSound: new Audio(BadSound)
}

Object.keys(sounds).forEach((sound) => {
  sounds[sound].loop = 0
  sounds[sound].volume = 0.7
})

sounds.music.loop = 1
sounds.music.volume = 0.3

export function playSound(sound, callback) {
  sounds[sound].currentTime = 0
  sounds[sound]?.play()

  if (callback) {
    sounds[sound].onended = () => {
      callback()
      sounds[sound].onended = () => {}
    }
  }
}

export function stopSound(sound) {
  sounds[sound]?.pause()
}
