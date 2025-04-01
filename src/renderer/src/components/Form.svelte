<script>
  import { onMount } from 'svelte'

  import Icon from 'svelte-awesome'
  import check from 'svelte-awesome/icons/check'
  import hand from '../assets/hand.png?url'

  import Container from './Container.svelte'
  import Button from './Button.svelte'

  import {
    message,
    deploy_results,
    selected,
    iconDir,
    iconMess,
    dirValid
  } from '../store.js'

  import { 
    changeSelection,
    handleDirSelect,
    handleChangeMessage,
    do_deploy,
    reset
  } from "../scripts/funcs.js";

  let inputDir
  let inputMsg
  let inputDpl
  let inputRst

  const handleKeydown = (e) => {
    if (['Tab', 'Enter', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      e.preventDefault()
      changeSelection(e)
    }
    switch ($selected) {
      case 'dir':
        inputMsg?.blur()
        inputDir?.focus()
        break

      case 'msg':
        inputDir?.blur()
        inputMsg?.focus()
        break
    }
  }

  const handleInput = (e) => {
    e.preventDefault()

    handleChangeMessage()
  }

  onMount(() => {
    inputDir?.focus()
  })
</script>

<svelte:window onkeydown={(e) => handleKeydown(e)} />

<div class="flex h-50" style="justify-content: flex-start;">
  <Container classesOuter={'h-95'}>
    <form class="center space-between">
      <div class="form-element">
        <label for="inputSource">
          {#if $selected === 'dir'}
            <img src={hand} alt="hand icon" />
          {:else}
            📦
          {/if}
        </label>

        <Button
          classesOuter={'dir-btn outer'}
          classesInner={'inner'}
          handleClick={handleDirSelect}
          ref={inputDir}
          label={'CHOOSE DIR...'}
          disabled={false}
        />

        <div class="icon">
          <Icon data={$iconDir} color={$dirValid ? 'green' : 'red'} />
        </div>
      </div>

      <div class="form-element">
        <label for="inputMsg">
          {#if $selected === 'msg'}
            <img src={hand} alt="hand icon" />
          {:else}
            🏷️
          {/if}
        </label>

        <input
          class="text-center"
          name="inputMsg"
          type="text"
          placeholder="Enter message"
          spellcheck="false"
          bind:this={inputMsg}
          bind:value={$message}
          oninput={(e) => handleInput(e)}
          required
        />

        <div class="icon">
          <Icon data={$iconMess} color={$iconMess === check ? 'green' : 'red'} />
        </div>
      </div>

      <div class="controls">
        <Button
          classesOuter={'btn'}
          handleClick={do_deploy}
          ref={inputDpl}
          label={'DEPLOY'}
          disabled={!$dirValid || !($iconMess === check)}
        />

        <Button
          classesOuter={'btn'}
          handleClick={reset}
          ref={inputRst}
          label={'RESET'}
          disabled={$deploy_results.length <= 0}
        />
      </div>
    </form>
  </Container>
</div>
