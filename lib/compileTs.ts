/**
 * Builds a ts file to a directory
 * @param filePath The file path
 * @param outputDir Directory to output the compiled file
 * @returns void
 */
export async function compile(
  filePath: string,
  outputDir: string
): Promise<void> {
  await Bun.build({
    entrypoints: [filePath],
    outdir: outputDir,
    minify: true,
  });
}
