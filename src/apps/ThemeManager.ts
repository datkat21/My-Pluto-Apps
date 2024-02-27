import { Html } from "../types/Html";
import { Package } from "../types/Package";
import { ThemeLib } from "../types/lib/ThemeLib";
import { VirtualFS } from "../types/lib/VirtualFS";
import { WindowSystem, WsWindow } from "../types/lib/WindowSystem";
import {
  CURSOR_DEFAULT,
  CURSOR_EW,
  CURSOR_NESW,
  CURSOR_NOT_ALLOWED,
  CURSOR_NS,
  CURSOR_NWSE,
  CURSOR_POINTER,
  CURSOR_TEXT,
} from "./ThemeManager/lib/cursors";

import { themeList } from "./ThemeManager/lib/themeList";

const pkg: Package = {
  name: "Theme Manager",
  description: "Browse and install themes with ease",
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

    // Create a window
    MyWindow = new Win({
      title: "Theme Manager",
      content: "",
      width: 840,
      height: 480,
      pid: Root.PID,
      onclose: () => {
        Root.Lib.onEnd();
      },
    });

    let wrapTemp = MyWindow.window.querySelector(".win-content");

    if (wrapTemp !== null) wrapper = Root.Lib.html.from(wrapTemp);

    const Html = Root.Lib.html;

    const vfs = (await Root.Lib.loadLibrary("VirtualFS")) as VirtualFS;
    const themeLib = (await Root.Lib.loadLibrary("ThemeLib")) as ThemeLib;

    // const oldTheme = appearanceConfig.theme;

    new Html("h1").text("Theme Manager").appendTo(wrapper);
    new Html("p")
      .text("Install and try out various different themes")
      .appendTo(wrapper);

    const theneListDiv = new Html("div")
      // .class("row", "gap", "row-wrap")
      .style({
        display: "grid",
        "grid-template-columns": "repeat(auto-fill, 400px)",
        "grid-gap": "8px",
        "place-content": "center",
      })
      .appendTo(wrapper);

    for (const theme of themeList) {
      const themeHtml = new Html("div");

      themeHtml
        .class("col", "gap")
        .styleJs({
          background: "var(--wallpaper)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "2rem",
          borderRadius: "0.5rem",
          width: "400px",
          color: "var(--text)",
        })
        .appendMany(
          new Html("span")
            .class("h2")
            .text(theme.name)
            .style({ "word-wrap": "break-word" }),
          new Html("span")
            .text(theme.description)
            .style({ "word-wrap": "break-word" })
        );

      const themeWindowWrapper = new Html("div")
        .style({ position: "relative", height: "170px" })
        .appendTo(themeHtml);

      const themeValues = theme.values as { [key: string]: string };

      let keys = Object.keys(theme.values);
      for (let i = 0; i < keys.length; i++) {
        themeHtml.style({ [`--${keys[i]}`]: themeValues[keys[i]] });
      }

      let fill = "";
      let stroke = "white";

      if (theme.values !== undefined && theme.values !== null) {
        fill = theme.values.primary;
      }

      function url(x: string) {
        return `url("${x}")`;
      }
      function stringify(str: string) {
        return url(
          str
            .replace("black", encodeURIComponent(fill))
            .replace("white", encodeURIComponent(stroke))
        );
      }

      themeHtml.elm.style.setProperty("--wallpaper", `url(${theme.wallpaper})`);
      themeHtml.elm.style.setProperty(
        "--cursor-default",
        stringify(CURSOR_DEFAULT)
      );
      themeHtml.elm.style.setProperty(
        "--cursor-pointer",
        stringify(CURSOR_POINTER)
      );
      themeHtml.elm.style.setProperty("--cursor-text", stringify(CURSOR_TEXT));
      themeHtml.elm.style.setProperty(
        "--cursor-resize-ns",
        stringify(CURSOR_NS)
      );
      themeHtml.elm.style.setProperty(
        "--cursor-resize-ew",
        stringify(CURSOR_EW)
      );
      themeHtml.elm.style.setProperty(
        "--cursor-resize-nwse",
        stringify(CURSOR_NWSE)
      );
      themeHtml.elm.style.setProperty(
        "--cursor-resize-nesw",
        stringify(CURSOR_NESW)
      );
      themeHtml.elm.style.setProperty(
        "--cursor-not-allowed",
        stringify(CURSOR_NOT_ALLOWED)
      );

      new Html("div")
        .class("win-window-decorative", "focus")
        .styleJs({ boxShadow: "unset", width: "100%", height: "170px" })
        .appendMany(
          new Html("div")
            .class("win-titlebar")
            .appendMany(
              new Html("div")
                .class("buttons")
                .appendMany(
                  new Html("button").class("win-btn", "win-minimize")
                ),
              new Html("div")
                .class("outer-title")
                .styleJs({ pointerEvents: "none" })
                .appendMany(new Html("div").class("title").text("Preview")),
              new Html("div")
                .class("buttons")
                .appendMany(new Html("button").class("win-btn", "win-close"))
            ),
          new Html("div")
            .class("win-content")
            .class("col", "gap", "ovh")
            .appendMany(
              new Html("div")
                .class("row", "gap", "row-wrap")
                .appendMany(
                  new Html("button").text("Button"),
                  new Html("button").class("primary").text("Primary"),
                  new Html("button").class("danger").text("Danger"),
                  new Html("button").class("success").text("Success"),
                  new Html("input").attr({ placeholder: "Text input" })
                )
            )
        )
        .appendTo(themeWindowWrapper);

      themeHtml.appendMany(
        new Html("button")
          .style({ padding: "14px" })
          .text("Apply")
          .on("click", async () => {
            const themePath =
              "Root/Pluto/config/themes/" + theme.name + ".theme";

            await vfs.writeFile(themePath, JSON.stringify(theme));

            const appearanceConfig = JSON.parse(
              await vfs.readFile("Root/Pluto/config/appearanceConfig.json")
            );
            appearanceConfig["theme"] = theme.name + ".theme";
            await vfs.writeFile(
              "Root/Pluto/config/appearanceConfig.json",
              JSON.stringify(appearanceConfig)
            );

            await themeLib.setCurrentTheme(theme);
          })
      );

      themeHtml.appendTo(theneListDiv);
    }

    return Root.Lib.setupReturns((m) => {
      console.log("Example received message: " + m);
    });
  },
};

export default pkg;
