<script lang="ts">
  export let label: string;
  export let value: string;
</script>

<div class="flex flex-col gap-1">
  <label class="capitalize" for={label}>{label}</label>
  <textarea class="dots-input w-full" name={label} bind:value />
</div>
