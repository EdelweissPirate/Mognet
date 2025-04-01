<script>
  let { classesOuter, classesInner, label, ref, handleClick, disabled } = $props()
</script>

<button
  {disabled}
  class={`${String(classesOuter)}`}
  onclick={(e) => handleClick(e)}
  bind:this={ref}
>
  <div class={`flex center row ${String(classesInner)}`}>
    <p>{label}</p>
  </div>
</button>
