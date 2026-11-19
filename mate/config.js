// Optional school-managed PeerServer/ICE configuration. Keep service secrets out of this file.
// Use short-lived TURN credentials if adding a private TURN relay.
export const NETWORK_CONFIG={
  peerOptions:{debug:0},
  // Public broker for pilot sessions. Replace with a private WSS broker for regular use.
  relay:{url:'wss://broker.emqx.io:8084/mqtt'},
  directWaitMs:5000,
  roomPrefix:'patio-mate-v1-',
  connectTimeoutMs:18000,
  maxHumans:12,
};
