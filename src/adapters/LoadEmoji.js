import fs from "fs";
import path from "path";
import util from "util";
import { exec } from "child_process";
import emojiToCodePoint from "./EmojiToCodePoint.js";
const emojiCache = new Map();
const execSync = util.promisify(exec);
const findNameFile = (f, arrayCode) => {
   if (!f.endsWith(".png")) return false;
   
   const joinCode = arrayCode.join('—').toLocaleLowerCase();
   const splitEmoji = f.split(/[-_]/g).join('—').toLocaleLowerCase();
   const isFile = Boolean(splitEmoji.indexOf(joinCode+".png") !== -1 || joinCode.split('—').find((v) => v+".png" === splitEmoji));
   return isFile
}
export default async (emoji, dir, PImage) => {
   const arrayCode = emojiToCodePoint(emoji);
   if (!Array.isArray(arrayCode)) return null;
   if (emojiCache.has(arrayCode.join('.'))) return emojiCache.get(arrayCode.join('.'));
   
   return new Promise(async (resolve, reject) => {
      if (!fs.existsSync(dir)) reject({ message: "Não foi encontrado a pasta para renderizar os emojis images.", error: dir });
      
      try {
         var file;
         const emojis = fs.readdirSync(dir);
         for (let e of emojis) {
            if (findNameFile(e, arrayCode)) {
               file = path.join(dir, e);
               break;
            }
         }
         if (!file) reject({ message: "Não foi encontrado o emoji (PNG).", error: arrayCode });
         
         let image = await PImage.decodePNGFromStream(fs.createReadStream(file));
         if (image.width !== 72 || image.height !== 72) {
            await execSync(`magick ${file} -resize 72x72 ${file}`);
            image = await PImage.decodePNGFromStream(fs.createReadStream(file));
         }
         
         image.path = file;
         emojiCache.set(arrayCode.join('.'), image); 
         resolve(image);
      } catch (err) {
         reject(err);
      }
   });
};