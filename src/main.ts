import { Application } from "pixi.js";
import { Engine } from "matter-js";
import { initDevtools } from "@pixi/devtools";
import { Ball } from "./core/ball";
import { Board } from "./core/board";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Slots } from "./core/slots";

(async () => {
  const app = new Application();

  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(window.PIXI);

  await app.init({ background: "white", resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const engine = Engine.create();

  const board = new Board({
    app,
    engine,
  });

  board.render();

  // setInterval(() => {
  //   new Ball({
  //     x: app.screen.width / 2 + Math.random() * 100 - 50,
  //     y: 10,
  //     app,
  //     engine,
  //   }).launch();
  // }, 2000);

  new Slots({ app, engine });

  app.ticker.add(() => {
    Engine.update(engine);
  });

  initDevtools({ app });
})();
