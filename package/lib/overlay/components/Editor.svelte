<script lang="ts">
  import Screen from "./Screen.svelte";
</script>

<Screen>
  <slot />
  <svelte:fragment slot="window">
    <h2>Editor overlay</h2>
  </svelte:fragment>
</Screen>
