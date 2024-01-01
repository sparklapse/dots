<script lang="ts">
  export let label: string;
  export let value: string;
</script>

<div class="flex">
  <p class="flex flex-col">
    {#if label}
      <span class="font-semibold capitalize">{label}:</span>
    {/if}
    <span class="italic">
      {value}
    </span>
  </p>
</div>
