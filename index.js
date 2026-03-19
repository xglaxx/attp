import fs from "fs";
import path from "path";
import PImage from "pureimage";
import GraphemeSplitter from "grapheme-splitter";
import isEmoji from "./src/adapters/IsEmoji.js";
import wrapText from "./src/adapters/WrapText.js";
import ConfigAttp from "./src/ports/ConfigAttp.js";
import BreakText from "./src/adapters/BreakText.js";
import convertWebp from "./src/adapters/FfmpegWebp.js";
import loadEmojiGeral from "./src/adapters/LoadEmoji.js";
import changeFontGeral from "./src/adapters/ChangeFont.js";
import { fileURLToPath } from "url";
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);
const splitter = new GraphemeSplitter();

export default class Attp extends ConfigAttp {
   constructor(options) {
      super(options);
   }
   
   listEmojis() {
      let diretoryEmojis = path.join(_dirname, "source/emojis/");
      if (this.emojisDir) diretoryEmojis = path.join(this.dir, this.emojisDir);
      
      const pastEmojis = {};
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
   
   selectEmojis(name) {
      let select;
      const listPast = this.listEmojis();
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
         throw new Error("Não foi aplicado/selecionado o diretório do emojis que será usado.");
      }
      
      return loadEmojiGeral(char, this.emojisPath, PImage);
   }
   
   listFonts() {
      let diretoryFonts = path.join(_dirname, "source/fonts/");
      if (this.fontDir) diretoryFonts = path.join(this.dir, this.fontDir);
      
      const readPast = (dir) => {
         try {
            return fs.readdirSync(dir);
         } catch (err) {
            return [];
         }
      }
      const pastFont = { all: [] };
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
                     } catch (err) {
                        console.log("openPastByFont.error:", err)
                        delete pastFont[p+"-"+f];
                     }
                  }
               }
            }
         }
      };
      openPastByFont(diretoryFonts, pastFont.all);
      return pastFont;
   }
   
   selectFont(name) {
      let select;
      const listPast = this.listFonts();
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
   
   async start(text = this.text) {
      if (!text) {
         throw new Error("Não foi adicionado nenhum texto. Por favor, adicione algum texto para que eu possa dar continuidade.");
      } else if (!this.fontName) {
         throw new Error("Você não declarou a font que será usada!");
      }
      
      text = splitter.splitGraphemes(text.trim()).join('');
      let { lines: textLines, fontSize: sizeText } = BreakText(text, {
         fontSize: this.fontSize,
         padding: this.padding,
         limitText: this.limitText,
         width: this.size, height: this.size
      });
      let lines = [];
      const maxWidth = this.size - (this.margin * 2);
      const tempDir = fs.mkdtempSync(path.join(this.dir, "attp-"));
      const tempImg = PImage.make(this.size, this.size);
      const tempCtx = tempImg.getContext('2d');
      tempCtx.clearRect(0, 0, this.size, this.size); 
      while (true) {
         tempCtx.font = `${sizeText - 1.0}pt '${this.fontName}'`;
         lines = wrapText(tempCtx, textLines, maxWidth);
         const totalHeight = lines.length * (sizeText * 1.2);
         if (totalHeight < maxWidth || sizeText <= 19) break;
         sizeText -= 5;
      }
      
      const emojiSize = sizeText * 1.1; // Emoji ligeiramente maior que a fonte para destaque
      const lineHeight = sizeText * 1.2;
      const startY = 20 + (this.size - (lines.length * lineHeight)) / 2 + (lineHeight / 2);
      for (let i = 0; i < this.colors.length; i++) {
         const img = PImage.make(this.size, this.size);
         const ctx = img.getContext('2d');
         ctx.clearRect(0, 0, this.size, this.size);
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
            
            let currentX = (this.size - (totalLineWidth - 5)) / 2;
            for (let char of parts) {
               if (isEmoji(char)) {
                  const startYEmoji = (y - (lineHeight / 2)) - 15;
                  const imgEmoji = await this.loadEmoji(char).catch(() => null);
                  if (imgEmoji) {
                     if (imgEmoji.width === 72 && imgEmoji.height === 72) ctx.drawImage(imgEmoji, currentX, startYEmoji, sizeText, sizeText);
                  }
                  
                  currentX += sizeText - 8.0;
               } else {
                  let charWidth = ctx.measureText(char).width;
                  if (char === " ") {
                     charWidth = charWidth * 0.5; // Reduz a largura do espaço pela metade
                  }
                  if (this.edgeColors.length) {
                     ctx.fillStyle = this.edgeColors[this.colors.length - i] || 'black'; // Cor da borda;
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
         const p = path.join(tempDir, `f_${i}.png`);
         await PImage.encodePNGToStream(img, fs.createWriteStream(p));
      }
      
      return convertWebp(tempDir, this).finally(() => {
         fs.rmSync(tempDir, { recursive: true, force: true });
      });
   }
}