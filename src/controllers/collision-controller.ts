import { type Body, Engine, Events } from "matter-js";
import { config } from "../config";

type CollisionType = "ball-peg" | "ball-slot" | null;

interface CollisionHandler {
  handleCollision(bodyA: Body, bodyB: Body): void;
}

export class CollisionController {
  private engine: Engine;
  private handlers = new Map<CollisionType, CollisionHandler>();

  constructor(engine: Engine) {
    this.engine = engine;

    this.setupListeners();
  }

  register(type: CollisionType, handler: CollisionHandler) {
    this.handlers.set(type, handler);
  }

  private setupListeners() {
    Events.on(this.engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      for (const pair of pairs) {
        const collisionType = this.getCollisionType(pair);

        if (!collisionType) continue;

        const handler = this.handlers.get(collisionType);

        if (!handler) continue;

        handler.handleCollision(pair.bodyA, pair.bodyB);
      }
    });
  }

  private getCollisionType(pair: Matter.Pair): CollisionType {
    const labels = [pair.bodyA.label, pair.bodyB.label];

    if (
      labels.includes(config.ball.label) &&
      labels.includes(config.pegs.label)
    ) {
      return "ball-peg";
    }

    if (
      labels.includes(config.ball.label) &&
      labels.includes(config.slots.sensor.label)
    ) {
      return "ball-slot";
    }

    return null;
  }
}
