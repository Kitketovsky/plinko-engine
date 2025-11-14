import Matter, { Bodies, Composite } from "matter-js";
import { Application, Graphics, Renderer, Text } from "pixi.js";
import { config } from "../config";

interface Props {
  app: Application<Renderer>;
  engine: Matter.Engine;
}

export class Slots {
  app: Application<Renderer>;
  engine: Matter.Engine;
  slotsMultiplierData: Map<number, number>;

  slotGap: number;

  constructor({ app, engine }: Props) {
    this.app = app;
    this.engine = engine;
    this.slotsMultiplierData = new Map<number, number>();

    if (config.slots.slotAmount % 2 !== 1) {
      throw new Error("Amount of slots must be odd");
    }

    const { wall, slotAmount } = config.slots;

    this.slotGap =
      (this.app.screen.width - wall.width / 2 - slotAmount + 1 * wall.width) /
      slotAmount;

    this.createBottomBoundary();
    this.createSlots();
    this.listenForBallDrops();
  }

  createSlots() {
    for (let i = 0; i <= config.slots.slotAmount; i++) {
      this.createSlotWall(i);
      this.createSlotSensor(i);
      this.renderMultiplierText(i);
    }
  }

  createSlotWall(index: number) {
    // WARN: Matter.Bodies.rectangle expects center x, y
    // but Graphics on default mode uses top-left x, y

    const x = index * this.slotGap;
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

  createSlotSensor(index: number) {
    const x =
      index * this.slotGap + config.slots.wall.width / 2 + this.slotGap / 2;
    const y = this.app.screen.height - config.slots.wall.height + 5;
    const w = this.slotGap;
    const h = 2;

    const slotSensorGraphics = new Graphics({
      pivot: { x: this.slotGap / 2, y: 1 },
    }).rect(x, y, w, h);

    this.app.stage.addChild(slotSensorGraphics);

    const slotSensorBody = Bodies.rectangle(x, y, w, h, {
      label: config.slots.sensor.label,
      isSensor: true,
      isStatic: true,
    });

    this.slotsMultiplierData.set(
      slotSensorBody.id,
      config.slots.multipliers[index]
    );

    Composite.add(this.engine.world, slotSensorBody);
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

    const y = this.app.screen.height - (config.slots.wall.height / 100) * 60;

    multiplierText.position.set(x, y);

    this.app.stage.addChild(multiplierText);
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
          labels.includes(config.ball.label) &&
          labels.includes(config.slots.sensor.label);

        if (!isBallAndSlotEntryCollision) {
          continue;
        }

        const sensor =
          pair.bodyA.label === config.slots.sensor.label
            ? pair.bodyA
            : pair.bodyB;

        const multiplier = this.slotsMultiplierData.get(sensor.id);

        if (!multiplier) {
          throw new Error(`No multiplier has been found in body ${sensor.id}`);
        }

        console.log("body", sensor.id, "multiplier", multiplier);
      }
    });
  }
}
