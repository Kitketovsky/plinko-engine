export const config = {
  board: {
    offsetX: 0,
    offsetY: 200,
    rows: 8,
    cols: 12,
    gapY: 80,
    gapX: 100,
  },
  pegs: {
    label: "Peg",
    radius: 8,
    fillColor: 0xff0000,
  },
  ball: {
    label: "Ball",
    radius: 10,
    fillColor: 0x000000,

    rigidBodyOptions: {
      restitution: 0.7,
      friction: 0.4,
      density: 1,
    },
  },
};
