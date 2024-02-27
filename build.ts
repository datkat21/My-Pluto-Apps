import { compile } from "./lib/compileTs";
import { join } from "path";
import { watch } from "fs";
import { Glob } from "bun";
import path from "path";

export default async function build() {
  const watcher = watch(
    join(import.meta.dir, "./src"),
    { recursive: true },
    async (event, filename) => {
      console.log(`Detected ${event} in ${filename}`);

      if (filename === null) return;

      const glob = new Glob("*.{ts,tsx}");
      const scannedFiles = await Array.fromAsync(
        glob.scan({ cwd: "./src/apps" })
      );

      scannedFiles.forEach(async (s) => {
        await compile("./src/apps/" + s, "./public/dist/apps/");
        // const filePath =
        //   path.join("./public/dist/apps/", s.replace(".ts", "")) + ".js";
        // const f = Bun.file(filePath);
        // const t = await f.text();

        // Bun.write(filePath, `/* Compiled from ${s} with Pluto-TS-DevEnv ${require('./package.json').version} */\n${t}`);
      });

      console.log("Built", scannedFiles.length, "app(s).");
    }
  );

  console.log("Watching!");
}
