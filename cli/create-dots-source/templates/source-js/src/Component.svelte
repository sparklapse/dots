<!-- Logic and scripts go here -->
<script>
  export let color;
  export let fontSize;
  export let flip;
</script>

<!-- Your content goes here -->
<div class="component">
  <h1 style={`color: ${color}; font-size: ${fontSize}px; transform: scaleX(${flip ? -1 : 1})`}>
    Hello world!
  </h1>
</div>

<!-- Styles go here and are scoped! -->
<style>
  .component {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
