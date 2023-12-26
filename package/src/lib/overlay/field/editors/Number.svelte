<script lang="ts">
  export let label: string;
  export let value: number;
  export let step: number = 1;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
</script>

<div class="flex justify-between">
  <label class="capitalize" for={label}>{label}</label>
  <input class="dots-input" type="number" {step} {min} {max} name={label} bind:value />
</div>
