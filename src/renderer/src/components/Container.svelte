<script>
  let { children, classesOuter, classesInner } = $props()
</script>

<div class={`outer ${String(classesOuter)}`}>
  <div class={`inner ${String(classesInner)}`}>
    {@render children?.()}
  </div>
</div>
