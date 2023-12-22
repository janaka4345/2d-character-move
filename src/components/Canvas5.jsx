import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Bodies,
  Runner,
  Composite,
  Composites,
  Body,
  MouseConstraint,
  Mouse,
} from "matter-js";
import { ReactP5Wrapper } from "@p5-wrapper/react";

let isPressed;
let engine;
let cw = 400;
let ch = 400;
let playerControlKey;
let mConstraint;
let canvas;
let canvasMouse;
export default function Canvas4(props) {
  isPressed = useRef([{}]);
  engine = useRef(Engine.create());

  playerControlKey = useRef();
  const [state, setState] = useState(0);

  useEffect(() => {
    Composite.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, {
        isStatic: true,
        label: "wall",
      }),
      Bodies.rectangle(-10, ch / 2, 20, ch, {
        isStatic: true,
        label: "wall",
      }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, {
        isStatic: true,
        label: "wall",
      }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, {
        isStatic: true,
        label: "wall",
      }),
    ]);
    const player = Bodies.rectangle(cw / 2, ch / 2, 50, 50, {
      label: "player",
    });

    Composite.add(engine.current.world, [player]);

    const runner = Runner.create();
    Runner.run(runner, engine.current);

    return () => {
      Runner.stop(runner);
      Composite.clear(engine.current.world, engine.current.world.bodies);
      Composite.remove(engine.current.world, engine.current.world.bodies);
      Engine.clear(engine.current);
    };
  }, []);

  return (
    <div>
      <div>
        <ReactP5Wrapper sketch={sketch} />
      </div>
      <button onClick={() => setState((prev) => prev + 1)}>click</button>
      <h1>{state}</h1>
    </div>
  );
}

function sketch(p5) {
  p5.setup = setup(p5);
  p5.draw = draw(p5);
  p5.mouseDragged = (e) => mouseDragged(e, p5);
  p5.mousePressed = (e) => mousePressed(e, p5);
  p5.mouseReleased = () => mouseReleased();
}
function setup(p5) {
  return () => {
    canvas = p5.createCanvas(400, 400);
  };
}
function draw(p5) {
  return () => {
    p5.background(250, 120, 0);
    p5.push();
    p5.noFill();
    p5.beginShape();
    p5.strokeJoin(p5.ROUND);
    p5.stroke("purple");
    p5.strokeWeight(10);
    isPressed.current.forEach(({ x, y }) => {
      p5.vertex(x, y);
    });
    p5.endShape();
    p5.pop();
    engine.current.world.bodies.forEach((body) => {
      if (body.label === "player") {
        p5.push();
        p5.rectMode(p5.CENTER);
        playerControlKey.current === "d"
          ? Body.setVelocity(body, { x: 1, y: 0 })
          : null;
        p5.fill(255, 204, 0);
        p5.quad(
          body.vertices[0].x,
          body.vertices[0].y,
          body.vertices[1].x,
          body.vertices[1].y,
          body.vertices[2].x,
          body.vertices[2].y,
          body.vertices[3].x,
          body.vertices[3].y
        );
        p5.pop();
      }

      if (body.label === "wall") {
        p5.push();
        p5.fill(0, 255, 0);
        p5.quad(
          body.vertices[0].x,
          body.vertices[0].y,
          body.vertices[1].x,
          body.vertices[1].y,
          body.vertices[2].x,
          body.vertices[2].y,
          body.vertices[3].x,
          body.vertices[3].y
        );
        p5.pop();
      }
    });
  };
}

function mousePressed(e, p5) {
  console.log("pressed", e);
  // console.log(e);
}
function mouseReleased() {
  isPressed.current = [{}];
}
function keyPressed(p5) {
  console.log(p5);
  playerControlKey.current != p5.key
    ? (playerControlKey.current = p5.key)
    : null;
}
function mouseDragged(event, p5) {
  console.log("draged", event);
  isPressed.current.push({ x: event.offsetX, y: event.offsetY });
}
