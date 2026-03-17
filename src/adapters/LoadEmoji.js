import fs from "fs";
import path from "path";
import emojiToCodePoint from "./EmojiToCodePoint.js";
const emojiCache = new Map();
export default async (emoji, dir, PImage) => {
   const code = emojiToCodePoint(emoji);
   if (!code) return null;
   if (emojiCache.has(code)) return emojiCache.get(code);
   
   return new Promise(async (resolve, reject) => {
      if (!fs.existsSync(dir)) reject({ message: "Não foi encontrado a pasta para renderizar os emojis images.", error: dir });
      
      const emojis = fs.readdirSync(dir);
      let file = path.join(dir, "emoji_u"+code+".png");
      for (let e of emojis) {
         if (e === path.basename(file)) {
            file = path.join(dir, e);
            break;
         } else {
            for (const f of code.split("_")) {
               const isCode = e === "emoji_u"+f+".png";
               if (isCode) {
                  file = path.join(dir, e);
                  break;
               }
            }
         }
      }
      if (!fs.existsSync(file)) reject({ message: "Não foi encontrado o emoji.", error: code });
      
      const streamImg = fs.createReadStream(file);
      const image = await PImage.decodePNGFromStream(streamImg);
      image.path = file;
      emojiCache.set(code, image); 
      resolve(image);
   });
};