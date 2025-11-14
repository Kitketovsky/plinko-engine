import { type Graphics } from "pixi.js";
import { Peg } from "../core/peg";
import gsap from "gsap";

export class AnimationController {
  constructor() {}

  subscribeToPeg(peg: Peg) {
    peg.on("hit", ({ graphics }) => {
      this.animatePegHit(graphics);
    });
  }

  private animatePegHit(graphics: Graphics) {
    gsap.to(graphics.scale, {
      x: 1.4,
      y: 1.4,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        graphics.scale.set(1);
      },
    });
  }
}
