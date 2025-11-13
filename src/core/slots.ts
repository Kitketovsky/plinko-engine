import Matter, { Bodies, Composite } from "matter-js";
import { Application, Graphics, Renderer } from "pixi.js";
import { config } from "../config";

interface Props {
  app: Application<Renderer>;
  engine: Matter.Engine;
}

export class Slots {
  app: Application<Renderer>;
  engine: Matter.Engine;

  constructor({ app, engine }: Props) {
    this.app = app;
    this.engine = engine;

    this.createBottomBoundary();
    this.createSlots();
  }

  createSlots() {
    const { wall, slotAmount } = config.slots;

    const slotWallGap =
      (this.app.screen.width - wall.width / 2 - slotAmount + 1 * wall.width) /
      slotAmount;

    for (let i = 0; i <= config.slots.slotAmount; i++) {
      this.createSlotWall({ index: i, slotWallGap });
      this.createSlotSensor({ index: i, slotWallGap });
    }
  }

  createSlotWall({
    index,
    slotWallGap,
  }: {
    index: number;
    slotWallGap: number;
  }) {
    // WARN: Matter.Bodies.rectangle expects center x, y
    // but Graphics on default mode uses top-left x, y

    const x = index * slotWallGap;
    const y = this.app.screen.height - config.slots.wall.height / 2;
    const w = config.slots.wall.width;
    const h = config.slots.wall.height;

    const slotWallGraphics = new Graphics({
      pivot: {
        x: config.slots.wall.width / 2,
        y: config.slots.wall.height / 2,
      },
    })
      .rect(x, y, w, h)
      .fill(0x0000ff);

    this.app.stage.addChild(slotWallGraphics);

    const slotWallBody = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      label: "SlotWall",
    });

    Composite.add(this.engine.world, slotWallBody);
  }

  createSlotSensor({
    index,
    slotWallGap,
  }: {
    index: number;
    slotWallGap: number;
  }) {
    const x =
      index * slotWallGap + config.slots.wall.width / 2 + slotWallGap / 2;
    const y = this.app.screen.height - config.slots.wall.height + 5;
    const w = slotWallGap;
    const h = 2;

    const slotSensorGraphics = new Graphics({
      pivot: { x: slotWallGap / 2, y: 1 },
    })
      .rect(x, y, w, h)
      .stroke(0xff0000);

    this.app.stage.addChild(slotSensorGraphics);

    const slotSensorBody = Bodies.rectangle(x, y, w, h, {
      label: "SlotSensor",
      isSensor: true,
      isStatic: true,
    });

    Composite.add(this.engine.world, slotSensorBody);
  }

  createBottomBoundary() {
    const thickness = 20;
    const width = this.app.screen.width;
    const height = this.app.screen.height;

    const bottomWall = Bodies.rectangle(
      width / 2,
      height + thickness / 2,
      width,
      thickness,
      {
        isStatic: true,
        label: "Boundary",
      }
    );

    Composite.add(this.engine.world, bottomWall);
  }

  listenForBallDrops() {
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      for (const pair of pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        const isBallAndSlotEntryCollision =
          labels.includes("Ball") && labels.includes("SlotEntry");

        if (!isBallAndSlotEntryCollision) {
          continue;
        }

        // TODO: Determine which slot the ball fell into and emit an event
      }
    });
  }
}
