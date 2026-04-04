import fs from "fs";
import path from "path";
import util from "util";
import { exec } from "child_process";
import emojiToCodePoint from "./EmojiToCodePoint.js";
const emojiCache = new Map();
const execSync = util.promisify(exec);
const findNameFile = (file, arrayCode) => {
   var isFile = false;
   const splitName = file.split(/([-_.])/g);
   if (!file.endsWith(".png")) return false;
   for (const a of splitName) {
      const aLess = a.toLocaleLowerCase();
      for (const b of arrayCode) {
         const bLess = b.toLocaleLowerCase();
         if (aLess === bLess) {
            isFile = true; break;
         }
      }
   }
   return isFile;
}
export default async (emoji, dir, PImage) => {
   const arrayCode = emojiToCodePoint(emoji);
   if (!arrayCode) return null;
   if (emojiCache.has(arrayCode.join('.'))) return emojiCache.get(arrayCode.join('.'));
   
   return new Promise(async (resolve, reject) => {
      if (!fs.existsSync(dir)) reject({ message: "Não foi encontrado a pasta para renderizar os emojis images.", error: dir });
      
      let file = null;
      const emojis = fs.readdirSync(dir);
      for (let e of emojis) {
         if (findNameFile(e, arrayCode)) {
            file = path.join(dir, e);
         }
      }
      if (!(file && fs.existsSync(file))) reject({ message: "Não foi encontrado o emoji (PNG).", error: arrayCode });
      
      const streamImg = fs.createReadStream(file);
      const image = await PImage.decodePNGFromStream(streamImg);
      await execSync(`magick ${file} -resize 72x72 ${file}`);
      image.width = image.height = 72;
      image.path = file;
      emojiCache.set(arrayCode.join('.'), image); 
      resolve(image);
   });
};