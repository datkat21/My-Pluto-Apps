// src/apps/MyFirstApp.ts
var pkg = {
  name: "TypeScript Example",
  description: "The first ever typed app in Pluto!",
  ver: 1.5,
  type: "process",
  async exec(Root) {
    let wrapper = new Root.Lib.html("div");
    let MyWindow;
    console.log("Hello from example package", Root.Lib);
    Root.Lib.setOnEnd(() => MyWindow.close());
    const Win = (await Root.Lib.loadLibrary("WindowSystem")).win;
    const Sidebar = await Root.Lib.loadComponent("Sidebar");
    MyWindow = new Win({
      title: "TypeScript Example",
      content: "",
      onclose: () => {
        Root.Lib.onEnd();
      }
    });
    let wrapTemp = MyWindow.window.querySelector(".win-content");
    if (wrapTemp !== null)
      wrapper = Root.Lib.html.from(wrapTemp);
    new Root.Lib.html("h1").text("TypeScript Example App 2024").appendTo(wrapper);
    new Root.Lib.html("p").html("The first ever typed app in Pluto!").appendTo(wrapper);
    new Root.Lib.html("button").text("Hello, world").appendTo(wrapper).on("click", (e) => {
      const ev = e;
      Root.Modal.alert(`Hello!
Cursor Position: ${ev.clientX}, ${ev.clientY}
My PID: ${Root.PID}
My Token: ${Root.Token}`);
    });
    new Root.Lib.html("button").text("Spawn another").appendTo(wrapper).on("click", (e) => {
      Root.Lib.launch("apps:Example", wrapper);
    });
    new Root.Lib.html("button").text("End Process").appendTo(wrapper).on("click", (e) => {
      Root.Lib.onEnd();
    });
    return Root.Lib.setupReturns((m) => {
      console.log("Example received message: " + m);
    });
  }
};
var MyFirstApp_default = pkg;
export {
  MyFirstApp_default as default
};
