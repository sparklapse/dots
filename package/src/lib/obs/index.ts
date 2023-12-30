import OBSWebSocket, { EventSubscription } from "obs-websocket-js/msgpack";

// declare global {
//   interface Window {
//     __dots_obs: OBSWebSocket;
//   }
// }

export const connect = async (port: number = 4455, password?: string) => {
  const obs = new OBSWebSocket();

  if (obs.identified) {
    console.warn("OBS is already connected");
    return obs;
  }

  await obs.connect(`ws://localhost:${port}`, password, {
    eventSubscriptions: EventSubscription.InputVolumeMeters,
  });

  obs.on("VendorEvent", ({ vendorName, eventType, eventData }) => {
    console.log({ vendorName, eventType, eventData });
  });

  // window.__dots_obs = obs;
  return obs;
};
