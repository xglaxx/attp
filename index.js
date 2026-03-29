import fs from "fs";
import path from "path";
import PImage from "pureimage";
import GraphemeSplitter from "grapheme-splitter";
import isEmoji from "./src/adapters/IsEmoji.js";
import wrapText from "./src/adapters/WrapText.js";
import ConfigAttp from "./src/ports/ConfigAttp.js";
import cropImage from "./src/adapters/CropImage.js";
import BreakText from "./src/adapters/BreakText.js";
import convertWebp from "./src/adapters/FfmpegWebp.js";
import loadEmojiGeral from "./src/adapters/LoadEmoji.js";
import textPutImage from "./src/adapters/TextPutImage.js";
import changeFontGeral from "./src/adapters/ChangeFont.js";
import pngSequenceToWebp from "./src/adapters/PngSequenceToWebp.js";
import { fileURLToPath } from "url";
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);
const splitter = new GraphemeSplitter();
const pastFont = { all: [] };
const pastEmojis = {};

export default class Attp extends ConfigAttp {
   constructor(options) {
      super(options);
   }
   
   listEmojis() {
      let diretoryEmojis = path.join(_dirname, "source/emojis/");
      if (this.emojisDir) diretoryEmojis = path.join(this.dir, this.emojisDir);
      for (const o in pastEmojis) {
         delete pastEmojis[o];
      }
      
      const ListEmojis = fs.readdirSync(diretoryEmojis);
      ListEmojis.forEach((pasta, index) => {
         const local = path.join(diretoryEmojis, pasta+"/");
         const countEmojis = fs.readdirSync(local);
         pastEmojis[pasta] = {
            index,
            name: pasta,
            countEmojis: countEmojis.length,
            local
         };
      });
      return pastEmojis;
   }
   
   selectEmojis(name, reloadEmoji = false) {
      let select;
      const listPast = (!reloadEmoji && Object.keys(pastEmojis).length) ? pastEmojis : this.listEmojis();
      for (const v of Object.values(listPast)) {
         if (v.name === name || v.index === name) {
            select = v;
         }
         if (select) break;
      }
      if (select) {
         this.emojisPath = select.local;
      }
      return select;
   }
   
   async changeEmojis(diretory) {
      if (!(fs.existsSync(diretory) && diretory.endsWith("/"))) {
         throw new Error("Não foi encontrado o diretório dessa pasta: "+diretory);
      }
      
      let Emojis = fs.readdirSync(diretory);
      Emojis = Emojis.filter((v, i) => v.endsWith(".png"));
      if (!Emojis.length) {
         throw new Error("Não foi encontrado nenhum emojis com a imagem PNG!");
      } else {
         this.emojisPath = diretory;
      }
   }
   
   async loadEmoji(char) {
      if (!this.emojisPath) {
         console.error("(🚫ERROR🚫) loadEmoji:", "Não foi aplicado/selecionado o diretório do emojis que será usado.");
         return null;
      }
      
      return loadEmojiGeral(char, this.emojisPath, PImage);
   }
   
   listFonts() {
      let diretoryFonts = path.join(_dirname, "source/fonts/");
      if (this.fontDir) diretoryFonts = path.join(this.dir, this.fontDir);
      for (const o in pastFont) {
         delete pastFont[o];
      }
      
      pastFont.all = [];
      const readPast = (dir) => {
         try {
            return fs.readdirSync(dir);
         } catch (err) {
            return [];
         }
      };
      const openPastByFont = (dir, arr) => {
         var index = 0;
         for (const p of readPast(dir)) {
            if (p.endsWith(".ttf") || p.endsWith(".otf")) {
               arr.push({
                  index,
                  local: dir,
                  font: p,
                  name: path.basename(p, ".ttf", ".otf")
               });
               index++;
            } else {
               index = 0;
               const openListFonts = path.join(dir, p+"/");
               for (const f of readPast(openListFonts)) {
                  if (f.endsWith(".ttf") || f.endsWith(".otf")) {
                     if (!(p in pastFont)) pastFont[p] = [];
                     pastFont[p].push({
                        index,
                        local: openListFonts,
                        font: f,
                        name: path.basename(f, ".ttf", ".otf")
                     });
                     index++;
                  } else {
                     const pass = pastFont[p+"-"+f] = [];
                     try {
                        const stats = fs.statSync(openListFonts+f+"/");
                        if (stats.isDirectory()) {
                           openPastByFont(openListFonts+f+"/", pass);
                        }
                     } catch (err) { }
                  }
               }
            }
         }
      };
      openPastByFont(diretoryFonts, pastFont.all);
      for (const tag in pastFont) {
         if (!pastFont[tag].length) {
            delete pastFont[tag]; // Vai ser deletado o object se não houver nenhuma fonte adicionada.
         }
      }
      return pastFont;
   }
   
   selectFont(name, reloadFont = false) {
      let select;
      const listPast = (!reloadFont && pastFont.all.length) ? pastFont : this.listFonts();
      for (const p in listPast) {
         for (const v of listPast[p]) {
            if (v.name === name || v.font === name || v.index === name) {
               select = v;
            }
            if (select) break;
         }
      }
      if (select) {
         this.changeFont(select.local+select.font, select.name);
      }
      return select;
   }
   
   changeFont(diretoryFont, nameFont) {
      this.fontName = changeFontGeral(diretoryFont, PImage, nameFont);
   }
   
   async background(pathImage = this.pathImage) {
      const pastAttp = fs.mkdtempSync(path.join(this.dir, "attp-background-"));
      try {
         if (!fs.existsSync(pathImage)) {
            if (this.colorBackground) {
               const img = PImage.make(this.width, this.height);
               const ctx = img.getContext('2d');
               ctx.fillStyle = this.colorBackground;
               ctx.fillRect(0, 0, this.width, this.height);
               pathImage = path.join(pastAttp, "background-"+Date.now()+".png");
               await PImage.encodePNGToStream(img, fs.createWriteStream(pathImage));
            } else {
               throw new Error("Não existe o arquivo imagem para adicionar o Background ou não foi adicionado nenhuma cor específica: "+this.pathImage);
            }
         }
         
         const { images } = await this.start();
         const back = await cropImage(pathImage, pastAttp, this.width, this.height);
         const tempFrames = fs.mkdtempSync(path.join(pastAttp, "frames-"));
         for (const { buffer: bufferImg, index: i } of images) {
            const imgDir = path.join(tempFrames, (i+1)+".png");
            fs.writeFileSync(imgDir, bufferImg);
         }
         
         await textPutImage(back, tempFrames, this.width, this.height);
         const framesEdit = fs.readdirSync(tempFrames).sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
         });
         const duration = Math.max(0.01, this.delay / 1000); // segundos, mínimo 10ms
         const frames = framesEdit.map((frame, index) => ({
            index,
            path: path.join(tempFrames, frame),
            duration
         }));
         return {
            images: () => {
               const bufferFrames = frames.map((f, i) => ({
                  index: i,
                  buffer: fs.readFileSync(f.path)
               }));
               fs.rmSync(pastAttp, { recursive: true, force: true });
               return bufferFrames;
            },
            image: () => {
               const buffer = fs.readFileSync(frames[0].path);
               fs.rmSync(pastAttp, { recursive: true, force: true });
               return buffer;
            },
            webp: pngSequenceToWebp(frames, pastAttp).finally(() => {
               fs.rmSync(pastAttp, { recursive: true, force: true });
            })
         };
      } catch (error) {
         fs.rmSync(pastAttp, { recursive: true, force: true });
         throw new Error(error);
      }
   }
   
   async start(text = this.text) {
      if (!text) {
         throw new Error("Não foi adicionado nenhum texto. Por favor, adicione algum texto para que eu possa dar continuidade.");
      }
      if (!this.fontName) {
         throw new Error("Você não declarou a font que será usada!");
      }
      if (!this.colors.length) {
         throw new Error("Não foi aplicado nenhuma cor específica para a fonte do texto.");
      }
      
      text = splitter.splitGraphemes(text.trim()).join('');
      let { lines: textLines, fontSize: sizeText } = BreakText(text, {
         padding: this.padding,
         fontSize: this.fontSize,
         limitText: this.limitText,
         width: this.width, height: this.height
      });
      let lines = [];
      const maxWidth = this.width - (this.margin * 2);
      const maxHeight = this.height - (this.margin * 2);
      const pastAttp = fs.mkdtempSync(path.join(this.dir, "attp-"));
      const tempFrames = fs.mkdtempSync(path.join(pastAttp, "frames-"));
      const tempImg = PImage.make(this.width, this.height);
      const tempCtx = tempImg.getContext('2d');
      tempCtx.clearRect(0, 0, this.width, this.height); 
      while (true) {
         tempCtx.font = `${sizeText - 1.0}pt '${this.fontName}'`;
         lines = wrapText(tempCtx, textLines, maxWidth);
         const totalHeight = lines.length * (sizeText * 1.2);
         if (totalHeight < maxHeight || sizeText <= 19) break;
         sizeText -= 5;
      }
      
      const emojiSize = sizeText * 1.1; // Emoji ligeiramente maior que a fonte para destaque
      const lineHeight = sizeText * 1.2;
      const startY = 20 + (this.height - (lines.length * lineHeight)) / 2 + (lineHeight / 2);
      for (let i = 0; i < this.colors.length; i++) {
         const img = PImage.make(this.width, this.height);
         const ctx = img.getContext('2d');
         ctx.clearRect(0, 0, this.width, this.height);
         ctx.font = `${sizeText - 1.0}pt '${this.fontName}'`;
         ctx.textAlign = 'left';
         ctx.verticalAlign = 'middle';
         for (let j = 0; j < lines.length; j++) {
            const line = lines[j].trim();
            const parts = splitter.splitGraphemes(line);
            const y = startY + (j * lineHeight);
            let totalLineWidth = 0;
            for (let char of parts) {
               if (isEmoji(char)) {
                  totalLineWidth += sizeText - 5.0;
               } else {
                  totalLineWidth += ctx.measureText(char).width;
               }
            }
            
            let currentX = (this.width - (totalLineWidth - 5)) / 2;
            for (let char of parts) {
               if (isEmoji(char)) {
                  const startYEmoji = (y - (lineHeight / 2)) - 15;
                  const imgEmoji = await this.loadEmoji(char).catch(() => null);
                  if (imgEmoji) {
                     if (imgEmoji.width === 72 && imgEmoji.height === 72) ctx.drawImage(imgEmoji, currentX, startYEmoji, sizeText, sizeText);
                  }
                  
                  currentX += sizeText - 5.0;
               } else {
                  let charWidth = ctx.measureText(char).width;
                  if (char === " ") {
                     charWidth = charWidth * 0.5; // Reduz a largura do espaço pela metade
                  }
                  if (this.edgeColors.length) {
                     ctx.fillStyle = this.edgeColors[i - this.colors.length] || 'black'; // Cor da borda;
                     ctx.fillText(char, currentX - 2, y - 2);
                     ctx.fillText(char, currentX + 2, y - 2);
                     ctx.fillText(char, currentX - 2, y + 2);
                     ctx.fillText(char, currentX + 2, y + 2);
                  }
                  
                  ctx.fillStyle = this.colors[i];
                  ctx.fillText(char, currentX, y);
                  currentX += charWidth;
               }
            }
         }
         const p = path.join(tempFrames, `f_${i}.png`);
         await PImage.encodePNGToStream(img, fs.createWriteStream(p));
      }
      const frames = fs.readdirSync(tempFrames).sort((a, b) => {
         return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });
      return {
         images: () => {
            const bufferFrames = frames.map((f, i) => ({
               index: i,
               buffer: fs.readFileSync(path.join(tempFrames, f))
            }));
            fs.rmSync(pastAttp, { recursive: true, force: true });
            return bufferFrames;
         },
         image: () => {
            const buffer = fs.readFileSync(path.join(tempFrames, frames[0]));
            fs.rmSync(pastAttp, { recursive: true, force: true });
            return buffer;
         },
         webp: convertWebp(tempFrames, pastAttp, this.fps).finally(() => {
            fs.rmSync(pastAttp, { recursive: true, force: true });
         })
      };
   }
}