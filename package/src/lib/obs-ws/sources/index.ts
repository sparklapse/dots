export const load = async () => {
  const browserSource = await import("./browser");
  const displayCapture = import("./display-capture");
  const gameCapture = await import("./game-capture");
  const windowCapture = await import("./window-capture");

  await Promise.allSettled([browserSource, displayCapture, gameCapture, windowCapture]);
};

export const tags = [
  "obs-browser",
  "obs-display-capture",
  "obs-game-capture",
  "obs-window-capture",
];
