<script>
  import { onMount } from 'svelte'

  import Header from './components/Header.svelte'
  import Container from './components/Container.svelte'
  import Cctv from './components/CCTV.svelte'
  import Form from './components/Form.svelte'
  import Feed from './components/Feed.svelte'

  import { initFeedListener } from './scripts/funcs'

  onMount(() => {
    initFeedListener()
  })
</script>

<Header />
<Container classesOuter={'main'} classesInner={'padding-frame'}>
  <div class="flex col w-50 m-half h-fill center space-between">
    <Form />
    <Cctv />
  </div>
  <div class="flex col w-50 m-half h-fill">
    <Feed />
  </div>
</Container>
