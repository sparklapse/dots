<script lang="ts">
  export let label: string;
  export let value: string;
</script>

<label class="title" for={label}>{label}</label>
<input type="text" name={label} bind:value />

<style>
  .title {
    text-transform: capitalize;
  }
</style>
