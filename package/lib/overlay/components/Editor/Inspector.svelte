<script lang="ts">
  import type { Transform } from "../../scene";

  export let options: { [key: string]: any };
  export let transform: Transform;

  const transformKeys = Object.keys(transform) as (keyof Transform)[];

  const handleChange =
    (option: string) =>
    (
      ev: Event & {
        currentTarget: EventTarget & HTMLInputElement;
      },
    ) => {
      switch (typeof options[option]) {
        case "boolean":
          options[option] = ev.currentTarget.checked;
          break;
        case "number":
          options[option] = parseFloat(ev.currentTarget.value);
          break;
        default:
          options[option] = ev.currentTarget.value;
      }
      options = { ...options };
    };
</script>

<div class="transform">
  <h3>Transform</h3>
  {#each transformKeys as param}
    <div class="control">
      <label for={param}>{param}</label>
      <input type="number" name={param} bind:value={transform[param]} />
    </div>
  {/each}
</div>
<div class="options">
  <h3>Options</h3>
  {#each Object.keys(options) as option}
    <div class="control">
      <label for={option}>{option}</label>
      <input
        type={typeof options[option] === "boolean"
          ? "checkbox"
          : typeof options[option] === "number"
            ? "number"
            : "text"}
        name={option}
        value={options[option]}
        on:change={handleChange(option)}
        on:input={handleChange(option)}
      />
    </div>
  {/each}
</div>
