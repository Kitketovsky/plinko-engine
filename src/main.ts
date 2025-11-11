import { Application, Container, Graphics } from "pixi.js";
import { initDevtools } from "@pixi/devtools";

const config = {
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

  const plinkoContainer = new Container();

  const width = config.radius * 2 * config.rows + config.gapX * (config.rows - 1);
  const height = config.radius * 2 * config.rows + config.gapY * (config.rows - 1);


  for (let i = 1; i <= config.rows; i++) {
    for (let j = 1; j <= i; j++) {
      // i - row number
      // j - circle number in the row

      const x = width / 2 + (j - (i + 1) / 2) * (20 + config.gapX) + config.radius;
      const y = config.radius + (i - 1) * (20 + config.gapY);

      const graphics = new Graphics().circle(x, y, config.radius).fill(config.fill);
      plinkoContainer.addChild(graphics);
    }
  }

  plinkoContainer.position.set((app.screen.width - width) / 2, (app.screen.height - height) / 2);

  const border = new Graphics()
    .rect(-10, -10, plinkoContainer.width + 20, plinkoContainer.height + 20)
    .stroke({ width: 2, color: 0x000000 });

  plinkoContainer.addChild(border);

  app.stage.addChild(plinkoContainer);

  initDevtools({ app });
})();
