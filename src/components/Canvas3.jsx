import { useEffect, useRef, useState } from "react";
import { Engine, Bodies, Runner, Composite, Composites, Body } from "matter-js";
import { ReactP5Wrapper } from "@p5-wrapper/react";

let isPressed;
let engine;
let cw = 400;
let ch = 400;
let playerControlKey;
let img;

export default function Canvas3(props) {
  isPressed = useRef(false);
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

    const runner = Runner.create();
    Runner.run(runner, engine.current);

    return () => {
      Runner.stop(runner);
      Composite.clear(engine.current.world, engine.current.world.bodies);
      Composite.remove(engine.current.world, engine.current.world.bodies);
      Engine.clear(engine.current);
    };
  }, []);

  const handleDown = () => {
    console.log(engine.current.world);
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle = (e) => {};

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
  p5.preload = preload(p5);
  p5.setup = setup(p5);
  p5.draw = draw(p5);
  p5.mousePressed = () => mousePressed(p5);
}
function setup(p5) {
  return () => {
    p5.createCanvas(400, 400);
  };
}
function draw(p5) {
  return () => {
    p5.background(250, 120, 0);
    p5.image(img, 0, 0, cw, ch);
    // p5.image(img, 0, 0, cw, ch, 0, 0, img.width / 8, img.height / 8);

    engine.current.world.bodies.forEach((body) => {
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
    p5.keyIsPressed ? keyPressed(p5) : (playerControlKey.current = undefined);
  };
}
function preload(p5) {
  img = p5.loadImage("./uv_checker_map.jpg");
}
function mousePressed(p5) {
  p5.loadPixels();
  console.log(p5.pixels);
  // console.log(engine.current.detector.pairs);
  // console.log(engine.current.world);
}
function keyPressed(p5) {
  playerControlKey.current != p5.key
    ? (playerControlKey.current = p5.key)
    : null;
}
