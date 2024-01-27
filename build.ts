import { compile } from "./lib/compileTs";
import { join } from "path";
import { watch } from "fs";
import { Glob } from "bun";

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

      scannedFiles.forEach((s) => {
        compile("./src/apps/" + s, "./public/dist/apps/");
      });

      console.log("Built", scannedFiles.length, "app(s).");
    }
  );

  console.log("Watching!");
}
