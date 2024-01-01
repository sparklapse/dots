<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let label: string;
  export let value: string;

  const dispatch = createEventDispatcher<{ click: void }>();
</script>

<div class="flex justify-end">
  <button class="dots-btn w-40" name={label} on:click={() => dispatch("click")}>{value}</button>
</div>
