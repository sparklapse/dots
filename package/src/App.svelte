<script lang="ts">
  import "../lib/overlay/components/web";
</script>

<div class="screen">
  <h1>Dots overlay</h1>

  <h2>Screen</h2>
  <dots-screen>
    <source-test x="100" y="50" width="200" />
  </dots-screen>

  <h2>Editor</h2>
  <dots-editor>
    <source-test x="100" y="50" width="200" />
  </dots-editor>
</div>

<style>
  .screen {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
</style>
