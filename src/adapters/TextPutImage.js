import fs from "fs";
export default async function (pathImg, gifFrames, width, height) {
   // Colocar a imagem/foto em baixo em todos os frames extraído.
   return new Promise(async (resolve, reject) => {
      exec(`magick mogrify -gravity Center -resize ${width}x${height}^ -extent ${width}x${height} -background transparent -draw "image DstOver 0,0 ${width},${height} '${pathImg}'" "${gifFrames}/*.png"`, (err) => {
         if (err) reject(err);
         
         fs.existsSync(pathImg) && fs.unlinkSync(pathImg);
         resolve(gifFrames);
      });
   });
}