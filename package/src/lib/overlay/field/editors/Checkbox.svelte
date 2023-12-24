<script lang="ts">
  export let label: string;
  export let value: boolean;
</script>

<div class="flex justify-between">
  <label class="capitalize" for={label}>{label}</label>
  <input class="dots-input" type="checkbox" name={label} bind:checked={value} />
</div>
