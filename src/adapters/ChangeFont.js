import fs from "fs";
import path from "path";
export default (diretoryFont, PImage, fontName) => {
   if (!(fs.existsSync(diretoryFont) && (diretoryFont?.endsWith(".ttf") || diretoryFont?.endsWith(".otf")))) {
      throw new Error(`Não foi encontrado a fonte: "${diretoryFont}"`);
   }
   
   fontName = fontName || path.basename(diretoryFont, ".ttf", ".otf");
   const font = PImage.registerFont(diretoryFont, fontName);
   font.loadSync();
   return fontName;
};