import { Bodies, Composite, type Body } from "matter-js";
import { Graphics, TickerCallback } from "pixi.js";
import { config } from "../config";
import { app, engine } from "./state";

interface Props {
  x: number;
  y: number;
}

export class Ball {
  rigidBody: Body;
  graphics: Graphics;

  constructor({ x, y }: Props) {
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
    return x < 0 || x > app.screen.width || y > app.screen.height + 5;
  }

  launch() {
    app.stage.addChild(this.graphics);
    Composite.add(engine.world, this.rigidBody);

    const tickerCallback = () => {
      this.graphics.position.set(
        this.rigidBody.position.x,
        this.rigidBody.position.y
      );

      if (this.isOutOfBounds()) {
        this.remove(tickerCallback);
      }
    };

    app.ticker.add(tickerCallback);
  }

  remove(tickerCallback: TickerCallback<any>) {
    Composite.remove(engine.world, this.rigidBody);
    app.stage.removeChild(this.graphics);
    app.ticker.remove(tickerCallback);
  }
}
