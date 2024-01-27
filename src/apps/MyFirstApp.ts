import { Html } from "../types/Html";
import { Package } from "../types/Package";
import { WindowSystem, WsWindow } from "../types/lib/WindowSystem";

const pkg: Package = {
  name: "TypeScript Example",
  description: "The first ever typed app in Pluto!",
  ver: 1.5,
  type: "process",
  async exec(Root) {
    // temp. wrapper
    let wrapper: Html = new Root.Lib.html("div");
    let MyWindow: WsWindow;

    console.log("Hello from example package", Root.Lib);

    Root.Lib.setOnEnd(() => MyWindow.close());

    // This is how to import a library with types
    const Win = ((await Root.Lib.loadLibrary("WindowSystem")) as WindowSystem)
      .win;

    // This is how to import a library that doesn't have types
    // Components don't have types (yet)
    const Sidebar = ((await Root.Lib.loadComponent("Sidebar")) as any);

    // Create a window
    MyWindow = new Win({
      title: "TypeScript Example",
      content: "",
      onclose: () => {
        Root.Lib.onEnd();
      },
    });

    let wrapTemp = MyWindow.window.querySelector(".win-content");

    if (wrapTemp !== null) wrapper = Root.Lib.html.from(wrapTemp);

    /* Heading */
    new Root.Lib.html("h1").text("TypeScript Example App 2024").appendTo(wrapper);
    /* Paragraph */
    new Root.Lib.html("p").html("The first ever typed app in Pluto!").appendTo(wrapper);
    /* Button with modal */
    new Root.Lib.html("button")
      .text("Hello, world")
      .appendTo(wrapper)
      .on("click", (e) => {
        const ev = e as MouseEvent;
        Root.Modal.alert(
          `Hello!
Cursor Position: ${ev.clientX}, ${ev.clientY}
My PID: ${Root.PID}
My Token: ${Root.Token}`
        );
      });
    /* Spawn an app */
    new Root.Lib.html("button")
      .text("Spawn another")
      .appendTo(wrapper)
      .on("click", (e) => {
        Root.Lib.launch("apps:Example", wrapper);
      });
    /* Example close button */
    new Root.Lib.html("button")
      .text("End Process")
      .appendTo(wrapper)
      .on("click", (e) => {
        Root.Lib.onEnd();
      });

    return Root.Lib.setupReturns((m) => {
      console.log("Example received message: " + m);
    });
  },
};

export default pkg;
