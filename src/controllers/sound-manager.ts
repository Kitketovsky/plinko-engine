import Matter from "matter-js";
import { sound } from "@pixi/sound";
import { Peg } from "../core/peg";

import popSoundSource from "./../assets/sounds/pop.mp3";

export class SoundController {
  private activeSounds = 0;
  private maxSimultaneous = 5;
  private isMuted = false;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  subscribeToPeg(peg: Peg) {
    peg.on("hit", ({ velocity }) => {
      this.playPegHit(velocity);
    });
  }

  initialize() {
    const loadSounds = () => {
      this.isInitialized = true;
      sound.add("pop", popSoundSource);
    };

    document.addEventListener("click", loadSounds, { once: true });
  }

  private playPegHit(velocity: Matter.Vector) {
    if (!this.isInitialized) return;
    if (this.activeSounds >= this.maxSimultaneous) return;
    if (this.isMuted) return;

    const speed = Matter.Vector.magnitude(velocity);
    const maxSpeed = 10;
    const volume = Math.min(speed / maxSpeed, 1);

    sound.play("pop", { volume });

    this.activeSounds++;

    setTimeout(() => {
      this.activeSounds--;
    }, 200);
  }
}
