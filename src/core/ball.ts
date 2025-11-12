import { Bodies, Composite, Engine, type Body } from "matter-js";
import { Application, Graphics, Renderer, TickerCallback } from "pixi.js";
import { config } from "../config";

interface Props {
  app: Application<Renderer>;
  engine: Engine;
  x: number;
  y: number;
}

export class Ball {
  app: Application<Renderer>;
  engine: Engine;

  rigidBody: Body;
  graphics: Graphics;

  constructor({ app, engine, x, y }: Props) {
    this.app = app;
    this.engine = engine;

    this.rigidBody = Bodies.circle(
      x,
      y,
      config.ball.radius,
      config.ball.rigidBodyOptions
    );

    this.rigidBody.label = config.ball.label;

    // WARN: if we set the graphics position here, it will not update correctly
    this.graphics = new Graphics()
      .circle(0, 0, config.ball.radius)
      .fill(config.ball.fillColor);
  }

  isOutOfBounds() {
    const { x, y } = this.rigidBody.position;
    return x < 0 || x > this.app.screen.width || y > this.app.screen.height;
  }

  launch() {
    this.app.stage.addChild(this.graphics);
    Composite.add(this.engine.world, this.rigidBody);

    const tickerCallback = () => {
      this.graphics.position.set(
        this.rigidBody.position.x,
        this.rigidBody.position.y
      );

      if (this.isOutOfBounds()) {
        this.remove(tickerCallback);
      }
    };

    this.app.ticker.add(tickerCallback);
  }

  remove(tickerCallback: TickerCallback<any>) {
    Composite.remove(this.engine.world, this.rigidBody);
    this.app.stage.removeChild(this.graphics);
    this.app.ticker.remove(tickerCallback);
  }
}
