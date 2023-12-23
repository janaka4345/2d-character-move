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
let canvas;
let canvasMouse;
let player;
export default function ShooterRobot(props) {
  isPressed = useRef([{}]);
  engine = useRef(
    Engine.create({
      gravity: { x: 0, y: 0 },
    })
  );

  // playerControlKey = useRef();
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
    player = Bodies.circle(cw / 2, ch / 2, 50, {
      label: "player",
      // gravity: { x: 0, y: 0 },
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
  // p5.mouseDragged = (e) => mouseDragged(e, p5);
  p5.mousePressed = (e) => mousePressed(e, p5);
  // p5.mouseReleased = () => mouseReleased();
  p5.mouseMoved = (e) => mouseMoved(e, p5);
}
function setup(p5) {
  return () => {
    canvas = p5.createCanvas(400, 400);
    canvasMouse = Mouse.create(canvas.elt);
  };
}
function draw(p5) {
  return () => {
    p5.background(250, 120, 0);
    engine.current.world.bodies.forEach((body) => {
      if (body.label === "player") {
        p5.push();
        // p5.ellipseMode(p5.CENTER);
        // p5.rotate(body.angle);
        p5.fill(255, 204, 0);
        p5.circle(body.position.x, body.position.y, 100);
        p5.fill(255, 255, 255);
        p5.circle(
          body.position.x +
            Math.cos(
              Math.atan2(
                p5.mouseY - player.position.y,
                p5.mouseX - player.position.x
              )
            ) *
              10,
          body.position.y +
            Math.sin(
              Math.atan2(
                p5.mouseY - player.position.y,
                p5.mouseX - player.position.x
              )
            ) *
              10,
          60
        );
        p5.fill(0, 0, 0);
        p5.circle(
          body.position.x +
            Math.cos(
              Math.atan2(
                p5.mouseY - player.position.y,
                p5.mouseX - player.position.x
              )
            ) *
              20,
          body.position.y +
            Math.sin(
              Math.atan2(
                p5.mouseY - player.position.y,
                p5.mouseX - player.position.x
              )
            ) *
              20,
          30
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
      if (body.label === "bullet") {
        p5.push();
        p5.fill(0, 0, 0);
        p5.circle(body.position.x, body.position.y, 20);
        p5.pop();
      }
    });
  };
}
function mousePressed(e, p5) {
  const bullet = Bodies.circle(100, 100, 10, {
    label: "bullet",
    gravity: { x: 0, y: 0 },
    // setPosition: { x: 100, y: 100 },
  });
  Body.setVelocity(bullet, {
    x: 30,
    y: 30,
  });
  console.log(bullet);
  Composite.add(engine.current.world, [bullet]);

  // console.log(canvasMouse);
  // console.log(e);
}
function mouseMoved(e, p5) {
  // console.log(
  //   Math.atan2(-p5.mouseY + player.position.y, p5.mouseX - player.position.x)
  // );
  // player.position.x = p5.mouseX;
  // player.position.y = p5.mouseY;
  // e.srcElemement = "defaultCanvas0.p5Canvas";
  // console.log(e.clientX, e.clientY);
  // console.log(
  //   Math.atan2(-p5.mouseY + player.position.y, p5.mouseX - player.position.x)
  // );
  // console.log(e);
}
