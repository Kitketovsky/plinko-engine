import Matter, { Bodies, Composite } from "matter-js";
import { Graphics, Text } from "pixi.js";
import { config } from "../config";
import { app, engine } from "./state";

export class Slots {
  multiplierMap = new WeakMap<Matter.Body, number>();
  slotGap: number;

  constructor() {
    if (config.slots.slotAmount % 2 !== 1) {
      throw new Error("Amount of slots must be odd");
    }

    const { wall, slotAmount } = config.slots;

    this.slotGap =
      (app.screen.width - wall.width / 2 - slotAmount + 1 * wall.width) /
      slotAmount;

    this.createBottomBoundary();
    this.createSlots();
    this.listenForBallDrops();
  }

  createSlots() {
    for (let i = 0; i <= config.slots.slotAmount; i++) {
      this.createSlotWall(i);

      const isLast = i == config.slots.slotAmount;

      if (!isLast) {
        this.createSlotSensor(i);
        this.renderMultiplierText(i);
      }
    }
  }

  createSlotWall(index: number) {
    // WARN: Matter.Bodies.rectangle expects center x, y
    // but Graphics on default mode uses top-left x, y

    const x = index * this.slotGap;
    const y = app.screen.height - config.slots.wall.height / 2;
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

    app.stage.addChild(slotWallGraphics);

    const slotWallBody = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      label: config.slots.wall.label,
    });

    Composite.add(engine.world, slotWallBody);
  }

  createSlotSensor(index: number) {
    const x =
      index * this.slotGap + config.slots.wall.width / 2 + this.slotGap / 2;
    const y = app.screen.height - config.slots.wall.height + 5;
    const w = this.slotGap;
    const h = 2;

    const slotSensorGraphics = new Graphics({
      pivot: { x: this.slotGap / 2, y: 1 },
    }).rect(x, y, w, h);

    app.stage.addChild(slotSensorGraphics);

    const slotSensorBody = Bodies.rectangle(x, y, w, h, {
      label: config.slots.sensor.label,
      isSensor: true,
      isStatic: true,
    });

    this.multiplierMap.set(slotSensorBody, config.slots.multipliers[index]);

    Composite.add(engine.world, slotSensorBody);
  }

  renderMultiplierText(index: number) {
    const multiplierText = new Text({
      text: `x${config.slots.multipliers[index]}`,
      anchor: 0.5,
      resolution: 2,
      style: {
        fontSize: 16,
      },
    });

    const x = index * this.slotGap + this.slotGap / 2;

    const y = app.screen.height - (config.slots.wall.height / 100) * 60;

    multiplierText.position.set(x, y);

    app.stage.addChild(multiplierText);
  }

  createBottomBoundary() {
    const w = app.screen.width;
    const h = 10;
    const x = app.screen.width / 2;
    const y = app.screen.height + h / 2;

    const bottomBoundary = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
    });

    Composite.add(engine.world, bottomBoundary);
  }

  listenForBallDrops() {
    Matter.Events.on(engine, "collisionStart", (event) => {
      const pairs = event.pairs;

      for (const pair of pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        const isBallAndSlotEntryCollision =
          labels.includes(config.ball.label) &&
          labels.includes(config.slots.sensor.label);

        if (!isBallAndSlotEntryCollision) {
          continue;
        }

        const sensor =
          pair.bodyA.label === config.slots.sensor.label
            ? pair.bodyA
            : pair.bodyB;

        const multiplier = this.multiplierMap.get(sensor);

        if (!multiplier) {
          throw new Error(`No multiplier has been found for body ${sensor.id}`);
        }

        // TODO: add to the global score with multiplier
      }
    });
  }
}
