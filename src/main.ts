import { Application } from "pixi.js";
import { Engine } from "matter-js";
import { initDevtools } from "@pixi/devtools";
import { Board } from "./core/board";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Slots } from "./core/slots";
import { app, engine } from "./core/state";
import { Controls } from "./core/controls";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(window.PIXI);

(async () => {
  await app.init({ background: "white", resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  new Board();
  new Slots();
  new Controls();

  app.ticker.add(() => {
    Engine.update(engine);
  });

  initDevtools({ app });
})();
