<script lang="ts">
  export let label: string;
  export let value: string;
</script>

<div class="editor">
  <label class="title" for={label}>{label}</label>
  <textarea name={label} bind:value />
</div>

<style>
  .editor {
    display: flex;
    flex-direction: column;
  }

  .editor label {
    text-transform: capitalize;
  }

  .editor textarea {
    resize: vertical;
  }
</style>
