import { EventEmitter, Graphics } from "pixi.js";
import Matter, { Bodies, type Body } from "matter-js";
import { config } from "../config";

interface Props {
  x: number;
  y: number;
}

export class Peg extends EventEmitter {
  graphics: Graphics;
  body: Body;

  x: number;
  y: number;

  id: number;

  constructor({ x, y }: Props) {
    super();

    this.x = x;
    this.y = y;

    this.graphics = new Graphics()
      .circle(this.x, this.y, config.pegs.radius)
      .fill(config.pegs.fillColor);

    // Set pivot to the center so scaling works correctly
    this.graphics.pivot.set(this.x, this.y);
    this.graphics.position.set(this.x, this.y);

    this.body = Bodies.circle(this.x, this.y, config.pegs.radius, {
      isStatic: true,
    });

    this.body.label = config.pegs.label;

    this.id = this.body.id;
  }

  onCollision(velocity: Matter.Vector) {
    this.emit("hit", { velocity, graphics: this.graphics });
  }
}
