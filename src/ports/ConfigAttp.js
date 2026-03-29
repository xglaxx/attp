import fs from "fs";
import path from "path";

function isNumber(val) {
   val = Number(val);
   return (!isNaN(val) ? val : 0);
}

export default class ConfigAttp {
   constructor(options) {
      this._fps = 10;
      this._delay = 50;
      this._text = ""; // Texto
      this._sizeHeight = this._sizeWidth = 512; // Altura / Largura;
      this._margin = 5; // Marge;
      this._dir = "./"; // Diretório principal;
      this._padding = 16; // Acolchoamento;
      this._fontSize = 80; // Tamanho do texto;
      this._edgeColors = []; // rgb;
      this._limitText = 150; // Limite de texto;
      this._colors = ['red', 'lime', 'yellow', 'magenta', 'cyan']; // Cor do texto;
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
   
   get delay() {
      return this._delay;
   }
   set delay(number) {
      this._delay = isNumber(number) || this._delay;
      if (this._delay <= 9) {
         console.warn("⚠️ AVISO: Recomendo deixar acima de 10 duração!");
      } 
   }
   
   get limitText() {
      return this._limitText;
   }
   set limitText(number) {
      this._limitText = isNumber(number) || this._limitText;
   }
   
   get width() {
      return this._sizeWidth;
   }
   set width(number) {
      this._sizeWidth = isNumber(number) || this._sizeWidth;
   }
   get height() {
      return this._sizeHeight;
   }
   set height(number) {
      this._sizeHeight = isNumber(number) || this._sizeHeight;
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
      this.height = options?.height;
      this.width = options?.width;
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