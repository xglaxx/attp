import path from "path";
import Attp from "./index.js";
import { fileURLToPath } from "url";
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName)+"/";
const pross = process.argv;
const text = (pross[2] || "🥀Attp");
(async () => {
   const tt = new Attp({
      text: text,
      dir: _dirname,
      fontDir: "source/fonts/",
      emojisDir: "source/emojis/"
   });
   tt.selectEmojis("Google");
   tt.selectFont("CourierPrime-Regular");
   const att = await tt.start(); // => {images, image, webp}
   const webp = await att.webp();
   const output = path.join(_dirname, "tmp/attp-"+Date.now()+".webp");
   fs.writeFileSync(output, webp);
   console.log("Attp:", output);
   process.exit();
})();