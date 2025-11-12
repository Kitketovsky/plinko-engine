import { Bodies, Composite, Engine, type Body } from "matter-js";
import { Application, Graphics, Renderer } from "pixi.js";

interface BallConfig {
  x: number;
  y: number;
  r: number;
  color: number;
}

interface Props {
  config: BallConfig;
  app: Application<Renderer>;
  engine: Engine;
}

export class Ball {
  app: Application<Renderer>;
  engine: Engine;
  config: BallConfig;

  rigidBody: Body;
  graphics: Graphics;

  constructor({ config, app, engine }: Props) {
    this.app = app;
    this.engine = engine;
    this.config = config;

    this.rigidBody = Bodies.circle(config.x, config.y, config.r, {
      frictionAir: 0.03,
      restitution: 0.7,
      friction: 0.3,
    });

    // WARN: if we set the graphics position here, it will not update correctly
    this.graphics = new Graphics().circle(0, 0, config.r).fill(config.color);
  }

  launch() {
    this.app.stage.addChild(this.graphics);

    Composite.add(this.engine.world, this.rigidBody);

    this.app.ticker.add(() => {
      this.graphics.position.set(
        this.rigidBody.position.x,
        this.rigidBody.position.y
      );
    });
  }
}
