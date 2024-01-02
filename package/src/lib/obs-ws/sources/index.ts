export const load = async () => {
  const displayCapture = import("./display-capture");
  const windowCapture = await import("./window-capture");

  await Promise.allSettled([displayCapture, windowCapture]);
};

export const tags = ["obs-display-capture", "obs-window-capture"];
