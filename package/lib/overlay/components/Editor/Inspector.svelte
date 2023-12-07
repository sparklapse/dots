<script lang="ts">
  export let options: { [key: string]: any };

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

<h2>Inspector</h2>
<div>
  {#each Object.keys(options) as option}
    <div>
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
