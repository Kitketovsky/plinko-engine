import { Peg } from "./peg";
import { type Body, Vector, Composite } from "matter-js";
import { config } from "../config";
import { SoundController } from "../controllers/sound-manager";
import { AnimationController } from "../controllers/animation-controller";
import { CollisionController } from "../controllers/collision-controller";
import { engine, app } from "./state";

export class Board {
  pegs: Map<number, Peg>;

  constructor() {
    this.pegs = new Map<number, Peg>();

    this.createPegs();

    const soundManager = new SoundController();
    const animationController = new AnimationController();
    const collisionController = new CollisionController(engine);

    [...this.pegs.values()].forEach((peg) => {
      soundManager.subscribeToPeg(peg);
      animationController.subscribeToPeg(peg);
    });

    collisionController.register("ball-peg", this);
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
    const availableGapSpace = app.screen.width - totalPegWidth;
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
        });

        this.pegs.set(peg.id, peg);

        app.stage.addChild(peg.graphics);
        Composite.add(engine.world, peg.body);
      }
    }
  }

  handleCollision(bodyA: Body, bodyB: Body) {
    const pegBody = bodyA.label === config.pegs.label ? bodyA : bodyB;
    const peg = this.pegs.get(pegBody.id);

    if (!peg) return;

    const velocity = Vector.sub(bodyA.velocity, bodyB.velocity);

    peg.onCollision(velocity);
  }
}
