import fs from "fs";
import path from "path";

function isNumber(val) {
   val = Number(val);
   return (!isNaN(val) ? val : 0);
}

export default class ConfigAttp {
   constructor(options) {
      this._fps = 10;
      this._text = "";
      this._size = 512;
      this._margin = 5;
      this._dir = "./";
      this._padding = 16;
      this._fontSize = 80;
      this._edgeColors = [];
      this._limitText = 150;
      this._output = "attp-"+Date.now()+".webp";
      this._colors = ['red', 'lime', 'yellow', 'magenta', 'cyan'];
      this._sets(options);
   }
   
   get text() {
      return this._text;
   }
   set text(str) {
      this._text = String(str);
   }
   
   get fps() {
      return this._fps;
   }
   set fps(number) {
      this._fps = isNumber(number) || this._fps;
      if (this._fps <= 9) {
         console.warn("⚠️ AVISO: Recomendo deixar acima de 10 FPS!");
      } 
   }
   
   get limitText() {
      return this._limitText;
   }
   set limitText(number) {
      this._limitText = isNumber(number) || this._limitText;
   }
   
   get size() {
      return this._size;
   }
   set size(number) {
      this._size = isNumber(number) || this._size;
   }
   
   get margin() {
      return this._margin;
   }
   set margin(number) {
      this._margin = isNumber(number) || this._margin;
   }
   
   get padding() {
      return this._padding;
   }
   set padding(number) {
      this._padding = isNumber(number) || this._padding;
   }
   
   get fontSize() {
      return this._fontSize;
   }
   set fontSize(number) {
      this._fontSize = isNumber(number) || this._fontSize;
   }
   
   get dir() {
      return this._dir;
   }
   set dir(diretory) {
      if (!(fs.existsSync(diretory) && diretory.endsWith("/"))) {
         throw new Error("Não foi encontrado a pasta: "+diretory);
      }
      
      this._dir = diretory;
   }
   
   get output() {
      return this._output;
   }
   set output(nameFile) {
      if (nameFile) {
         let output;
         if (/([a-zA-Z0-9_&$+.])\//.test(nameFile)) {
            output = path.join(this.dir, path.dirname(nameFile), path.basename(nameFile));
         } else {
            output = path.join(this.dir, path.basename(nameFile));
         }
         if (fs.existsSync(output)) {
            console.warn(`⚠️ AVISO: O arquivo "${output}" já existe!`);
         }
         if (!output.endsWith(".webp")) output += ".webp";
         
         this._output = output;
      } else {
         this._output = path.join(this.dir, path.basename(this._output));
      }
   }
   
   get edgeColors() {
      return this._edgeColors;
   }
   set edgeColors(array) {
      this._edgeColors = Array.isArray(array) ? array : this._edgeColors;
   }
   
   get colors() {
      return this._colors;
   }
   set colors(array) {
      this._colors = Array.isArray(array) ? array : this._colors;
      if (!this._colors.length) {
         this._colors = ["white"];
         console.warn("⚠️ AVISO: Não tem nenhuma coloração na fonte, o padrão foi para a cor: WHITE");
      }
   }
   
   _sets(options) {
      if (typeof options !== "object") throw new Error(`O "options" não é uma configuração object {}!`);
      
      this.fps = options?.fps;
      this.dir = options?.dir;
      this.text = options.text;
      this.size = options?.size;
      this.output = options?.output;
      this.margin = options?.margin;
      this.colors = options?.colors;
      this.fontDir = options?.fontDir;
      this.padding = options?.padding;
      this.fontSize = options?.fontSize;
      this.limitText = options?.limitText;
      this.emojisDir = options?.emojisDir;
      this.edgeColors = options?.edgeColors;
   }
   
}