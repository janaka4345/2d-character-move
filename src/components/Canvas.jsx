import { useEffect, useRef, useState } from "react";
import { Engine, Bodies, Runner, Composite } from "matter-js";
import { ReactP5Wrapper } from "@p5-wrapper/react";

let isPressed;
let engine;
export default function Canvas(props) {
  isPressed = useRef(false);
  engine = useRef(Engine.create());

  const [state, setState] = useState(0);

  useEffect(() => {
    const cw = 400;
    const ch = 400;

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

  const handleAddCircle = (e) => {
    // if (isPressed.current) {
    const ball = Bodies.rectangle(
      e.clientX,
      e.clientY,
      10 + Math.random() * 30,
      10 + Math.random() * 30,
      {
        // mass: 10,
        // restitution: 0.9,
        // friction: 0.005,

        label: "box",
      },
    );
    Composite.add(engine.current.world, [ball]);
    // }
  };

  return (
    <div
    // onMouseDown={handleDown}
    // onMouseUp={handleUp}
    // onMouseMove={handleAddCircle}
    // onClick={handleAddCircle}
    >
      <div

      // style={{ width: "100%", height: "100%" }}
      >
        <ReactP5Wrapper sketch={sketch} />
      </div>
      <button onClick={() => setState((prev) => prev + 1)}>click</button>
      <h1>{state}</h1>
    </div>
  );
}

function sketch(p5) {
  // p5.preload = preload(p5);
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
    engine.current.world.bodies.forEach((body) => {
      if (body.label === "box") {
        p5.push();
        p5.fill(255, 0, 0);
        p5.quad(
          body.vertices[0].x,
          body.vertices[0].y,
          body.vertices[1].x,
          body.vertices[1].y,
          body.vertices[2].x,
          body.vertices[2].y,
          body.vertices[3].x,
          body.vertices[3].y,
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
          body.vertices[3].y,
        );
        p5.pop();
      }
    });
  };
}
function mousePressed(p5) {
  const ball = Bodies.rectangle(
    p5.mouseX,
    p5.mouseY,
    10 + Math.random() * 30,
    10 + Math.random() * 30,
    {
      // mass: 10,
      // restitution: 0.9,
      // friction: 0.005,
      label: "box",
    },
  );
  Composite.add(engine.current.world, [ball]);
}
