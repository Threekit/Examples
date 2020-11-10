const duration = 1000; // ms

const animations = [
  {
    fromTo: [0, 5],
    // the path to the node property
    path: {
      name: "Box",
      plug: "PolyMesh",
      properties: { name: "Stretch" },
      property: "stretchDistance",
    },
  },
];

// assign these to the window if you want to use them in a custom script
window.animationStart = null;
window.isForward = false;

function toggleAnimation() {
  window.animationStart = null;
  window.isForward = !window.isForward;

  requestAnimationFrame(step);
}

function step(timestamp) {
  if (window.animationStart === null) window.animationStart = timestamp;
  const elapsed = timestamp - window.animationStart;

  if (elapsed < duration) {
    animations.map(({ fromTo, path }) => {
      const range = fromTo[1] - fromTo[0];
      const value = window.isForward
        ? range * (elapsed / duration)
        : range * ((duration - elapsed) / duration);

      window.player.scene.set(
        { ...path, from: window.player.instanceId },
        value
      );
    });

    // execute next frame
    requestAnimationFrame(step);
  } else {
    // set final value
    animations.map(({ fromTo, path }) =>
      window.player.scene.set(
        { ...path, from: window.player.instanceId },
        window.isForward ? fromTo[1] : fromTo[0]
      )
    );
    // clear animation start
    window.animationStart = null;
  }
}

async function init() {
  const player = await window.threekitPlayer({
    assetId: "c8e85909-6f44-492e-9f6f-31fecfaef359",
    authToken: "00000000-0000-0000-0000-000000000000",
    el: document.getElementById("player-el"),
  });

  window.player = player;
  window.configurator = await player.getConfigurator();
}

init();
