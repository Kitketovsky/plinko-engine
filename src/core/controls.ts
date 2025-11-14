import { Ball } from "./ball";
import { app } from "./state";
import { random } from "gsap/all";

export class Controls {
  isAutolaunch = false;

  constructor() {
    this.setupControls();
  }

  private setupControls() {
    const launchButton = document.getElementById(
      "dev-tools_launch"
    ) as HTMLButtonElement;

    launchButton.addEventListener("click", this.launchNewBall);

    const autolaunch = document.getElementById(
      "dev-tools_autolaunch"
    ) as HTMLInputElement;

    let intervalId: number;

    autolaunch.addEventListener("click", () => {
      if (!this.isAutolaunch) {
        this.isAutolaunch = true;

        autolaunch.textContent = "Autolaunch: ON";

        intervalId = setInterval(() => {
          this.launchNewBall();
        }, 1000);
      } else {
        clearInterval(intervalId);
        autolaunch.textContent = "Autolaunch: OFF";
      }
    });
  }

  private launchNewBall() {
    new Ball({
      x: app.screen.width / 2 + random(-100, 100),
      y: 10,
    }).launch();
  }
}
