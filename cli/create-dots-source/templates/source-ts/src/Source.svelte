<script context="module">
  import { field } from "@sparklapse/dots/overlay";

  export const label = "my-source";
  export const transform = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  };

  export const options = {
    color: field("text", "red"),
  };
</script>

<script lang="ts">
  export let color: string;
</script>

<div class="source" style:background-color={color}></div>

<style>
  :global(:host) {
    display: block;
    position: absolute;
  }

  .source {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
