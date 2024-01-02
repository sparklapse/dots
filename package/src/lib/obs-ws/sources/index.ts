export const load = async () => {
  const browserSource = await import("./browser");
  const displayCapture = import("./display-capture");
  const windowCapture = await import("./window-capture");

  await Promise.allSettled([browserSource, displayCapture, windowCapture]);
};

export const tags = ["obs-browser", "obs-display-capture", "obs-window-capture"];
