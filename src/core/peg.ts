import { Graphics } from "pixi.js";
import { Bodies, Composite, Engine, type Body } from "matter-js";
import { config } from "../config";

interface Props {
  engine: Engine;
  x: number;
  y: number;
}

export class Peg {
  graphics: Graphics;
  rigidBody: Body;
  engine: Engine;

  constructor({ x, y, engine }: Props) {
    this.graphics = new Graphics()
      .circle(x, y, config.pegs.radius)
      .fill(config.pegs.fillColor);

    this.rigidBody = Bodies.circle(x, y, config.pegs.radius, {
      isStatic: true,
    });

    this.rigidBody.label = config.pegs.label;

    this.engine = engine;

    Composite.add(this.engine.world, this.rigidBody);
  }
}
