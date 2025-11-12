import { Application, Container, Renderer } from "pixi.js";
import { Peg } from "./peg";
import { Engine } from "matter-js";

interface PegBoardConfig {
  rows: number;
  gapY: number;
  gapX: number;
  radius: number;
  fill: number;
}

interface Props {
  config: PegBoardConfig;
  app: Application<Renderer>;
  engine: Engine;
}

export class PegBoard {
  config: PegBoardConfig;
  app: Application<Renderer>;
  engine: Engine;

  constructor({ config, app, engine }: Props) {
    this.config = config;
    this.app = app;
    this.engine = engine;
  }

  calculateBoardSize() {
    const width =
      this.config.radius * 2 * this.config.rows +
      this.config.gapX * (this.config.rows - 1);

    const height =
      this.config.radius * 2 * this.config.rows +
      this.config.gapY * (this.config.rows - 1);

    return { width, height };
  }

  createPegs({
    offsetX,
    offsetY,
    width,
  }: {
    offsetX: number;
    offsetY: number;
    width: number;
  }) {
    const graphics = [];

    for (let row = 1; row <= this.config.rows; row++) {
      for (let col = 1; col <= row; col++) {
        const x =
          offsetX +
          width / 2 +
          (col - (row + 1) / 2) * (20 + this.config.gapX) +
          this.config.radius;

        const y =
          offsetY + this.config.radius + (row - 1) * (20 + this.config.gapY);

        const peg = new Peg({
          config: {
            x,
            y,
            r: this.config.radius,
            color: this.config.fill,
          },
          engine: this.engine,
        });

        graphics.push(peg.graphics);
      }
    }

    return graphics;
  }

  render() {
    const container = new Container();

    const { width, height } = this.calculateBoardSize();

    const offsetX = (this.app.screen.width - width) / 2 - this.config.radius;
    const offsetY = (this.app.screen.height - height) / 2;

    const pegs = this.createPegs({ offsetX, offsetY, width });

    container.addChild(...pegs);

    this.app.stage.addChild(container);
  }
}
