<script lang="ts">
  export let label: string;
  export let value: string;
</script>

<div class="flex justify-between">
  <label class="capitalize" for={label}>{label}</label>
  <input class="dots-input" type="text" name={label} {value} readonly />
</div>
