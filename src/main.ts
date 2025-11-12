import { Application } from "pixi.js";
import { Engine } from "matter-js";
import { initDevtools } from "@pixi/devtools";
import { PegBoard } from "./peg-board";
import { Ball } from "./ball";

const pegBoardConfig = {
  rows: 6,
  gapY: 40,
  gapX: 50,
  radius: 8,
  fill: 0xff0000,
};

(async () => {
  const app = new Application();

  await app.init({ background: "white", resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const engine = Engine.create();

  const board = new PegBoard({
    config: pegBoardConfig,
    app,
    engine,
  });

  board.render();

  const ball = new Ball({
    config: { x: app.screen.width / 2, y: 10, r: 10, color: 0x000000 },
    app,
    engine,
  });

  ball.launch();

  app.ticker.add(() => {
    Engine.update(engine, 16);
  });

  initDevtools({ app });
})();
