import { Html } from "../types/Html";
import { Package, PackageRoot } from "../types/Package";
import { VirtualFS } from "../types/lib/VirtualFS";
import { WindowSystem } from "../types/lib/WindowSystem";

declare global {
  interface Window {
    Hashes: any;
  }
}

const APP_STORE_CONFIG = {
  devMode: true,
  devPath: "http://localhost:3000/",
};

export default {
  name: "App Store",
  description: "Pluto App Store",
  ver: 1, // Compatible with core v1
  type: "process",
  privileges: [
    {
      privilege: "startPkg",
      description: "Open apps you have installed",
    },
  ],
  strings: {
    en_US: {
      appStore_welcome: "Welcome",
    },
  },
  exec: async function (Root) {
    let wrapper: Html;
    let StoreWindow: any;
    let pages: any;

    const Win = ((await Root.Lib.loadLibrary("WindowSystem")) as WindowSystem)
      .win;

    StoreWindow = new Win({
      title: `${Root.Lib.getString("systemApp_AppStore")} (BETA)`,
      pid: Root.PID,
      width: 700,
      height: 400,
      onclose: () => {
        Root.Lib.onEnd();
      },
      onresize() {
        const sbt = wrapper.qsa(".text-sidebar .sidebar-text");

        if (sbt === null) return;

        if (wrapper.elm.offsetWidth >= 520) {
          wrapper.qs(".text-sidebar").style({
            width: "var(--initial-width)",
          });
          sbt.forEach((t) => {
            t.styleJs({ opacity: "1", pointerEvents: "none" });
          });
        } else {
          wrapper.qs(".text-sidebar").style({
            width: "52px",
          });
          sbt.forEach((t) => {
            t.styleJs({ opacity: "0", pointerEvents: "none" });
          });
        }
      },
    });

    const Html = Root.Lib.html;

    Root.Lib.setOnEnd(() => StoreWindow.close());

    if (Root.Core === null) {
      return Root.Lib.onEnd();
    }
    if (Root.Core.startPkg === null) {
      return Root.Lib.onEnd();
    }

    const vfs = (await Root.Lib.loadLibrary("VirtualFS")) as VirtualFS;

    wrapper = Html.from(StoreWindow.window.querySelector(".win-content"));

    wrapper.classOn("row", "o-h", "h-100", "iframe");

    // TODO: TextSidebar type is currently missing
    const TextSidebar = (await Root.Lib.loadComponent("TextSidebar")) as any;

    TextSidebar.new(wrapper, [
      {
        icon: Root.Lib.icons.package,
        text: "Discover",
        title: "Discover",
        onclick() {
          pages.appsList();
        },
      },
      {
        icon: Root.Lib.icons.film,
        text: "Entertainment",
        title: "Entertainment",
        onclick() {
          pages.appsList("entertainment");
        },
      },
      {
        icon: Root.Lib.icons.book,
        text: "Work",
        title: "Work",
        onclick() {
          pages.appsList("work");
        },
      },
      {
        icon: Root.Lib.icons.gamepad,
        text: "Play",
        title: "Play",
        onclick() {
          pages.appsList("play");
        },
      },
      // {
      //   icon: Root.Lib.icons.wrench,
      //   text: "Settings",
      //   title: "Settings",
      //   onclick() {
      //     pages.settings();
      //   },
      // },
    ]);

    wrapper.qs(".text-sidebar").style({
      "--initial-width": wrapper.qs(".text-sidebar").elm.offsetWidth + "px",
      transition: "width var(--animation-duration) var(--easing-function)",
      width: "var(--initial-width)",
    });

    const sbt = wrapper.qsa(".text-sidebar .sidebar-text");

    if (sbt === null) {
      Root.Modal.alert("Failed to load app store UI");
      return Root.Lib.onEnd();
    }

    sbt.forEach((t) => {
      t.styleJs({
        transition: "opacity var(--animation-duration) var(--easing-function)",
      });
    });

    const container = new Root.Lib.html("div")
      .class("w-100", "ovh", "app-store")
      .appendTo(wrapper);

    const asFilePath = "Registry/AppStore";
    let asIndex: Record<string, any> = {};

    if ((await vfs.whatIs("Registry/AppStore/_AppStoreIndex.json")) !== null) {
      asIndex = JSON.parse(
        await vfs.readFile("Registry/AppStore/_AppStoreIndex.json")
      );
    }

    async function updateAsIndex() {
      if ((await vfs.whatIs("Registry/AppStore")) === null) {
        await vfs.createFolder("Registry/AppStore");
      }

      const apps = await vfs.list("Registry/AppStore");

      console.log(apps);

      await vfs.writeFile(
        "Registry/AppStore/_AppStoreIndex.json",
        JSON.stringify(asIndex)
      );
    }

    updateAsIndex();

    function makeAppNameSafe(pkg: string): string {
      return pkg.replace(/\//g, "--");
    }

    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    try {
      new Html("div").class("row", "fc").text("Loading...").appendTo(container);

      let host: string, repoHost: string;

      if (APP_STORE_CONFIG.devMode === true) {
        host = APP_STORE_CONFIG.devPath;
        repoHost = APP_STORE_CONFIG.devPath;
      } else {
        host = "https://zeondev.github.io/Pluto-AppStore/";
        // let host = "http://localhost:5501/";
        repoHost = "https://github.com/zeondev/Pluto-AppStore/blob/main/pkgs/";
      }

      const appStoreModule = (
        await import(`${host}import_new.js?t=` + performance.now())
      ).default;

      // Check if this is the right app store module
      if (appStoreModule.init) {
        await appStoreModule.init(host);

        const sysInfo = Root.Lib.systemInfo;

        function getAppCompatibility(
          appVersion: number,
          coreVersion: number
        ): {
          appCompatible: any;
          appCompatibleColor: any;
          appCompatibleIcon: any;
          appCompatibleReason: any;
        } {
          let appCompatible,
            appCompatibleColor,
            appCompatibleIcon,
            appCompatibleReason;
          if (
            parseFloat(coreVersion.toFixed(1)) <
            parseFloat(appVersion.toFixed(1))
          ) {
            // not compatible
            appCompatible = "err";
            appCompatibleReason = `Pluto version ${coreVersion.toFixed(
              1
            )} < App version ${appVersion.toFixed(1)}`;
          } else if (
            parseFloat(coreVersion.toFixed(1)) >
            parseFloat(appVersion.toFixed(1))
          ) {
            // warn of possible incompatibility
            appCompatible = "warn";
            appCompatibleReason = `Pluto version ${coreVersion.toFixed(
              1
            )} > App version ${appVersion.toFixed(1)}`;
          } else {
            appCompatible = "ok";
            appCompatibleReason = `Pluto version ${coreVersion.toFixed(
              1
            )} = App version ${appVersion.toFixed(1)}`;
          }

          if (appCompatible === "ok") {
            appCompatibleIcon = `<span class="row fc">${Root.Lib.icons.circleCheck}</span> Compatible`;
          } else if (appCompatible === "warn") {
            appCompatibleIcon = `<span class="row fc">${Root.Lib.icons.warning}</span> May be incompatible`;
          } else if (appCompatible === "err") {
            appCompatibleIcon = `<span class="row fc">${Root.Lib.icons.circleExclamation}</span> Not compatible`;
          }

          if (appCompatible === "ok") appCompatibleColor = "success";
          else if (appCompatible === "warn") appCompatibleColor = "warning";
          else if (appCompatible === "err") appCompatibleColor = "danger";

          return {
            appCompatible,
            appCompatibleColor,
            appCompatibleIcon,
            appCompatibleReason,
          };
        }

        async function installApp(pkg: any, app: any, force = false) {
          let appNameSafe = makeAppNameSafe(pkg);
          await fetch(
            `${host}pkgs/${pkg}/${app.assets.path}?t=` + performance.now()
          )
            .then(async (e) => {
              console.log(await vfs.whatIs(`${asFilePath}/${appNameSafe}.app`));
              if (
                (await vfs.whatIs(`${asFilePath}/${appNameSafe}.app`)) ===
                  null ||
                force == true
              ) {
                let result = await e.text();

                await vfs.writeFile(`${asFilePath}/${appNameSafe}.app`, result);

                const img = await new Promise((resolve, reject) => {
                  fetch(`${host}pkgs/${pkg}/${app.assets.icon}`)
                    .then((response) => response.blob())
                    .then((blob) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const dataURL = reader.result;
                        resolve(dataURL);
                      };
                      reader.readAsDataURL(blob);
                    })
                    .catch((error) => {
                      reject(error);
                    });
                });

                asIndex[appNameSafe] = Object.assign(app, { icon: img });

                // update as index
                await updateAsIndex();

                pages.appPage(app, pkg);
              } else if (
                (await vfs.whatIs(`${asFilePath}/${appNameSafe}.app`)) ===
                "file"
              ) {
                if (Root.Core == null) {
                  Root.Modal.alert(
                    Root.Lib.getString("systemApp_AppStore"),
                    "Something went terribly wrong.",
                    "body"
                  );
                  return Root.Lib.onEnd();
                }
                await Root.Core.startPkg(
                  "data:text/javascript," +
                    encodeURIComponent(
                      await vfs.readFile(`${asFilePath}/${appNameSafe}.app`)
                    ),
                  false,
                  true
                );
              }
            })
            .catch(() => {
              Root.Modal.alert(
                "Notice",
                `Something went wrong while installing the app.`,
                container.elm
              );
            });
        }

        const packageList = await appStoreModule.list();

        shuffleArray(packageList);

        pages = {
          async clear() {
            container.elm.innerHTML = "";
          },
          async appsList(category = "all") {
            this.clear();

            // Visual category name
            let categoryName = "";

            if (category === "all") {
              categoryName = "Discover";
            } else {
              categoryName = category[0].toUpperCase() + category.substring(1);
            }

            new Html("h2")
              // .style({ margin: "12px 8px 0 0" })
              .style({
                "background-image":
                  "linear-gradient(to bottom, var(--root) 65%, rgba(var(--root-rgb), 0))",
                padding: "8px 12px 8px 12px",
                margin: "0",
                position: "sticky",
                height: "48px",
                "background-color": "transparent",
                "z-index": "1",
                top: "0",
                display: "flex",
                "align-items": "center",
              })
              .text(categoryName)
              .appendTo(container);

            const appsList = new Html("div")
              .class("apps", "ovh", "fg")
              .appendTo(container);

            async function renderAppsList() {
              for (let appObj of packageList) {
                let app = Object.assign(appObj, {
                  repoUrl: repoHost + appObj.id,
                });
                const pkg = app.id;

                const { appCompatibleColor, appCompatibleIcon } =
                  getAppCompatibility(app.compatibleWith, sysInfo.version);

                if (
                  category === "all" ||
                  String(app.category).toLowerCase() === category
                ) {
                  let appCompatibleRow = undefined;
                  if (appCompatibleColor !== "success") {
                    appCompatibleRow = new Html("div")
                      .class("row")
                      .append(
                        new Html("div")
                          .html(appCompatibleIcon)
                          .class(appCompatibleColor, "row", "gap-mid", "fc")
                      );
                  }

                  new Html("div")
                    .class("app")
                    .appendMany(
                      new Html("div").class("col", "gap-mid").appendMany(
                        new Html("div").class("app-meta").appendMany(
                          new Html("img").class("app-icon").attr({
                            src: `${host}pkgs/${pkg}/${app.assets.icon}`,
                          }),
                          new Html("div")
                            .class("app-text")
                            .appendMany(
                              new Html("span")
                                .class("row", "gap", "ac", "row-wrap")
                                .appendMany(
                                  new Html("span").class("h3").text(app.name),
                                  new Html("span")
                                    .class("label")
                                    .text(`by ${app.author}`)
                                ),
                              new Html("span").text(app.shortDescription)
                            )
                        ),
                        appCompatibleRow as Html
                      )
                    )
                    .on("click", () => {
                      pages.appPage(app, pkg);
                    })
                    .appendTo(appsList);
                }
              }
            }

            renderAppsList();
          },
          // TODO: Type "app" and "pkg"
          async appPage(app: any, pkg: any) {
            this.clear();
            console.log("loading new app page");

            console.log(app, pkg);

            const appIconUrl = `${host}pkgs/${pkg}/${app.assets.icon}`;
            const appHasBanner: boolean = app.assets.banner ? true : false;
            const appBannerUrl = appHasBanner
              ? `${host}pkgs/${pkg}/${app.assets.banner}`
              : `${host}pkgs/${pkg}/${app.assets.icon}`;

            const {
              appCompatible,
              appCompatibleColor,
              appCompatibleIcon,
              appCompatibleReason,
            } = getAppCompatibility(app.compatibleWith, sysInfo.version);

            new Html("div")
              .class("app-banner", appHasBanner === false ? "no-banner" : null)
              .style({
                "--url": "url(" + appBannerUrl + ")",
              })
              .append(
                new Html("button")
                  .class("transparent", "square", "mc", "mhc")
                  .html(Root.Lib.icons.back)
                  .on("click", (e) => {
                    this.appsList();
                  })
              )
              .appendTo(container);

            let appNameSafe = makeAppNameSafe(pkg);

            async function makeInstallOrOpenButton() {
              let localHash = new window.Hashes.MD5().hex(
                await vfs.readFile(`${asFilePath}/${appNameSafe}.app`)
              );
              const appHash = await fetch(
                `${host}pkgs/${pkg}/${app.assets.path}?t=` + performance.now()
              ).then(async (e) => {
                return new window.Hashes.MD5().hex(await e.text());
              });

              const whatIsApp = await vfs.whatIs(
                `${asFilePath}/${appNameSafe}.app`
              );

              return [
                new Html("button")
                  .text(
                    whatIsApp === null
                      ? "Install"
                      : localHash !== appHash
                      ? "Update"
                      : whatIsApp === "file"
                      ? "Open"
                      : "Error"
                  )
                  .class("primary")
                  .attr({ id: "installButton" })
                  .on("click", async (e) => {
                    if (localHash !== appHash && whatIsApp !== null) {
                      await installApp(pkg, app, true);
                    } else if (localHash !== appHash && whatIsApp === null) {
                      if (appCompatible === "ok") {
                        await installApp(pkg, app, true);
                      } else {
                        const result = await Root.Modal.prompt(
                          "Notice",
                          `This app (made for ${app.compatibleWith}) may be incompatible with your current version of Pluto (${sysInfo.version}).\nAre you sure you want to continue installing?`,
                          container.elm
                        );

                        if (result === true) {
                          await installApp(pkg, app);
                        }
                      }
                    } else {
                      await installApp(pkg, app);
                    }
                  }),
                whatIsApp != null
                  ? new Html("button")
                      .text("Uninstall")
                      .class("danger")
                      .on("click", async (e) => {
                        let result = await Root.Modal.prompt(
                          "Are you sure?",
                          "Are you sure you want to delete this app?",
                          wrapper
                        );

                        if (result === true) {
                          await vfs.delete(`${asFilePath}/${appNameSafe}.app`);
                          // await Root.Modal.alert(
                          //   "App Deleted!",
                          //   `${app.name} has been successfully deleted!`
                          // );
                          pages.appPage(app, pkg);
                        }
                      })
                  : new Html("span"),
              ];
            }

            new Html("div")
              .class("app", "in-menu")
              .appendMany(
                new Html("div").class("app-meta").appendMany(
                  new Html("img").class("app-icon").attr({
                    src: appIconUrl,
                  }),
                  new Html("div")
                    .class("app-text")
                    .appendMany(
                      new Html("span")
                        .class("row", "gap", "ac", "row-wrap")
                        .appendMany(
                          new Html("span").class("h3").text(app.name),
                          new Html("span")
                            .class("label")
                            .text(`by ${app.author}`)
                        ),
                      new Html("span").text(app.description)
                    )
                ),
                new Html("div")
                  .class("app-buttons")
                  .appendMany(...(await makeInstallOrOpenButton()))
              )
              .appendTo(container);

            const rtf = new Intl.RelativeTimeFormat("en", { style: "short" });

            new Html("div")
              .class("app-whats-new")
              .appendMany(
                new Html("h2").text("What’s new"),
                new Html("span")
                  .class("label")
                  .text(`Version ${app.versions[0].ver}`),
                new Html("p")
                  .class("pre-wrap")
                  .text(
                    app.latestVersionInfo === ""
                      ? "(none)"
                      : app.latestVersionInfo
                  )
              )
              .appendTo(container);

            new Html("h2").text("More info").appendTo(container);

            new Html("div")
              .class("app-sub-details")
              .appendMany(
                // Compatibility
                new Html("div")
                  .class("app-sub-details-item")
                  .appendMany(
                    new Html("h3").text("Compatibility"),
                    new Html("div")
                      .class("row")
                      .append(
                        new Html("div")
                          .html(appCompatibleIcon)
                          .class(appCompatibleColor, "row", "fc", "gap")
                      ),
                    new Html("span").class("label").text(appCompatibleReason)
                  ),
                // Version history
                new Html("div").class("app-sub-details-item").appendMany(
                  new Html("h3").text("Versions"),
                  new Html("div").class("col", "w-100", "gap").appendMany(
                    new Html("div")
                      .class("fg", "row", "w-100", "fc")
                      .appendMany(
                        new Html("span").text(app.versions[0].ver),
                        new Html("span")
                          .class("ml-auto", "label")
                          .text(
                            new Date(app.versions[0].date).toLocaleDateString()
                          )
                      ),
                    app.versions.length > 1
                      ? new Html("details").appendMany(
                          new Html("summary").text(
                            "See older versions of this app"
                          ),
                          ...app.versions
                            .slice(1)
                            .map((v: { ver: string; date: string }) => {
                              return new Html("div")
                                .class("fg", "row", "w-100", "fc")
                                .appendMany(
                                  new Html("span").text(v.ver),
                                  new Html("span")
                                    .class("ml-auto", "label")
                                    .text(new Date(v.date).toLocaleDateString())
                                );
                            })
                        )
                      : undefined
                  )
                ),
                // Repository URL
                new Html("div").class("app-sub-details-item").appendMany(
                  new Html("h3").text("Source code"),
                  new Html("button")
                    .style({ margin: "0" })
                    .on("click", () => {
                      window.open(app.repoUrl);
                    })
                    .text("View on GitHub")
                )
              )
              .appendTo(container);
          },
          async settings() {
            this.clear();
            const box = new Html("div")
              .class("padded", "col", "gap")
              .appendTo(container);
            new Html("span")
              .class("h1")
              .text("Advanced Settings")
              .appendTo(box);

            const URLregex = new RegExp(
              /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
            );

            let inputValue = "";
            let useCustomRepo = false;

            const input = new Html("input")
              .attr({
                type: "text",
                placeholder: "Custom Repository URL",
              })
              .on("input", (e) => {
                let ev = e as InputEvent;
                if (ev.target === null) return;

                const evt = ev.target as HTMLInputElement;

                if (!evt.value.match(URLregex)) {
                  evt.style.borderColor = "var(--negative)";
                } else {
                  evt.style.borderColor = "var(--outline)";
                }
                inputValue = evt.value;
                if (useCustomRepo === true) {
                  host = evt.value;
                }
              })
              .appendTo(box);

            new Html("span")
              .appendMany(
                new Html("input")
                  .attr({
                    type: "checkbox",
                    id: Root.PID + "chk",
                  })
                  .on("input", async (e) => {
                    const ev = e as InputEvent;

                    if (ev.target === null) return;

                    const evt = ev.target as HTMLInputElement;

                    console.log(evt.checked);
                    if (evt.checked === true) {
                      let result = await Root.Modal.prompt(
                        "Are you sure",
                        "Are you sure you want to use a custom app store repository?",
                        wrapper
                      );

                      if (result === true) {
                        useCustomRepo = true;
                      } else {
                        evt.checked = false;
                        useCustomRepo = false;
                      }
                    } else {
                      useCustomRepo = false;
                    }
                  }),
                new Html("label")
                  .attr({
                    for: Root.PID + "chk",
                  })
                  .text("Use custom Server URL")
              )
              .appendTo(box);
          },
        };

        await pages.appsList();
      } else
        Root.Modal.alert(
          "Notice",
          "App Store module missing on server.",
          wrapper
        );
    } catch (e: any) {
      Root.Modal.alert(
        "Error",
        "Something went wrong, and we could not fetch app store database.\n\n" +
          e.message,
        wrapper
      );
    }

    return Root.Lib.setupReturns(async (m) => {
      if (m && m.type) {
        if (m.type === "refresh") {
          Root.Lib.getString = m.data;
          StoreWindow.setTitle(Root.Lib.getString("systemApp_AppStore"));
          Root.Lib.updateProcTitle(Root.Lib.getString("systemApp_AppStore"));
        }
      }
    });
  },
} as Package;