/** @type {import("svelte/compiler").PreprocessorGroup} */
export const dotsPreprocess = {
  name: "dots-preprocess",
  script: async ({ content, filename }) => {
    if (!filename?.endsWith("lib/Source.svelte")) return;

    const { options } = await import("../src/config");

    // Define the options as reactive props
    const optionKeys = Object.keys(options);
    const optionExports = optionKeys
      .map((option) => {
        let value = options[option];
        if (typeof value === "string") value = `"${value}"`;
        return `export let ${option} = ${value};`;
      })
      .join(" ");
    content = content.replace(/\/\* \$options\$ \*\//g, optionExports);

    return {
      code: content,
    };
  },
  markup: async ({ content, filename }) => {
    if (!filename?.endsWith("lib/Source.svelte")) return;

    const { options } = await import("../src/config");

    // Define the options as bindings to the custom element
    const optionKeys = Object.keys(options);
    const optionBindings = optionKeys.map((option) => `{${option}}`).join(" ");
    content = content.replace(/\$use-options/g, optionBindings);

    return {
      code: content,
    };
  },
};
