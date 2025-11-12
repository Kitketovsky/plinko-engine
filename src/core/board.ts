import { Application, Renderer } from "pixi.js";
import { Peg } from "./peg";
import { Engine, Events } from "matter-js";
import { sound } from "@pixi/sound";

import popSoundSource from "./assets/sounds/pop.mp3";
import { config } from "../config";

interface Props {
  app: Application<Renderer>;
  engine: Engine;
}

export class Board {
  app: Application<Renderer>;
  engine: Engine;

  constructor({ app, engine }: Props) {
    this.app = app;
    this.engine = engine;
  }

  calculateBoardSize() {
    const width =
      config.pegs.radius * 2 * config.board.rows +
      config.board.gapX * (config.board.rows - 1);

    const height =
      config.pegs.radius * 2 * config.board.rows +
      config.board.gapY * (config.board.rows - 1);

    return { width, height };
  }

  createPegs() {
    const pegDiameter = config.pegs.radius * 2;
    const totalPegWidth = pegDiameter * config.board.cols;
    const availableGapSpace = this.app.screen.width - totalPegWidth;
    const gapX = availableGapSpace / (config.board.cols - 1);
    const gapY = config.board.gapY;

    for (let row = 1; row <= config.board.rows; row++) {
      for (let col = 1; col <= config.board.cols; col++) {
        if (row % 2 === 0 && col === config.board.cols) {
          continue;
        }

        const x =
          config.board.offsetX +
          (col - 1) * (pegDiameter + gapX) +
          config.pegs.radius +
          (row % 2 === 0 ? (pegDiameter + gapX) / 2 : 0);

        const y = config.board.offsetY + config.pegs.radius + (row - 1) * gapY;

        const peg = new Peg({
          x,
          y,
          engine: this.engine,
        });

        this.app.stage.addChild(peg.graphics);
      }
    }
  }

  createCollisionDetector() {
    const popSound = sound.add("pop", popSoundSource);

    document.addEventListener(
      "click",
      async () => {
        Events.on(this.engine, "collisionStart", (event) => {
          const pairs = event.pairs;

          for (const pair of pairs) {
            const labels = [pair.bodyA.label, pair.bodyB.label];

            if (
              labels.includes(config.ball.label) &&
              labels.includes(config.pegs.label)
            ) {
              popSound.play({ volume: 0.5 });
            }
          }
        });
      },
      { once: true }
    );
  }

  render() {
    this.createPegs();
    this.createCollisionDetector();
  }
}
