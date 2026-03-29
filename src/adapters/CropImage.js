import path from "path";
import { exec } from 'child_process';
export default async function (imgPath, dir,  width, height) {
   // Cortar a imagem em 512x512 sem perder a originalidade da imagem/foto (fundo transparente)
   return new Promise(async (resolve, reject) => {
      const filter = [
         "crop=w='min(iw,ih)':h='min(iw,ih)'",
         `scale=${width}:${height}:force_original_aspect_ratio=increase`,
         `pad=${width}:${height}:-1:-1`,
         "split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=0x00FF00[p];[b][p]paletteuse=alpha_threshold=230"
      ].join(",");
      const resizeImg = path.join(dir, "resize-img-"+Date.now()+".png");
      exec(`ffmpeg -y -i "${imgPath}" -vf "${filter}" "${resizeImg}"`, (error) => {
         if (error) reject(error);
         
         resolve(resizeImg);
      });
   });
}