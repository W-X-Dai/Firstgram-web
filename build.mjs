import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("./dist/", import.meta.url);
const files = ["index.html", "styles.css", "script.js", "assets"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await cp(new URL(`./${file}`, import.meta.url), new URL(`./dist/${file}`, import.meta.url), {
    recursive: true,
  });
}

console.log("Firstgram waitlist built to dist/");
