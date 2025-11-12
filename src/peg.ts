import { Graphics } from "pixi.js";
import { Bodies, Composite, Engine, type Body } from "matter-js";

interface PegConfig {
  x: number;
  y: number;
  r: number;
  color: number;
}

interface Props {
  config: PegConfig;
  engine: Engine;
}

export class Peg {
  graphics: Graphics;
  rigidBody: Body;
  engine: Engine;

  constructor({ config, engine }: Props) {
    const { x, y, r, color } = config;

    this.graphics = new Graphics().circle(x, y, r).fill(color);

    this.rigidBody = Bodies.circle(x, y, r, {
      isStatic: true,
    });

    this.engine = engine;

    Composite.add(this.engine.world, this.rigidBody);
  }
}
