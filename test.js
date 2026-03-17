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
      emojisDir: "source/emojis/",
      output: "tmp/attp-"+Date.now()
   });
   tt.selectEmojis("Google");
   tt.selectFont("CourierPrime-Regular");
   const output = await tt.start(); // => Resultado: Arquivo
   console.log("Attp:", output);
   process.exit();
})();