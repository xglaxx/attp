import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
export default async function (frames, dir) {
   const tempId = Date.now();
   const concatPath = path.join(dir, `concat-${tempId}.txt`);
   const outputPath = path.join(dir, `output-${tempId}.webp`);
   const fps = Math.round(1 / frames[0].duration);
   const concatLines = [
      `file '${frames[0].path}'`,
      `duration ${frames[0].duration.toFixed(4)}`
   ];
   for (const frame of frames) {
      concatLines.push(`file '${frame.path}'`);
      concatLines.push(`duration ${frame.duration.toFixed(4)}`);
   }
   // O SEGREDO: Repetir o último frame sem a tag 'duration' para fechar o arquivo
   concatLines.push(`file '${frames[frames.length - 1].path}'`);
   const options = [
      "-vcodec", "libwebp_anim",
      "-vf", [
         "scale='if(gte(iw,ih),300,-1)':'if(gte(iw,ih),-1,300)'",
         "pad=300:300:(ow-iw)/2:(oh-ih)/2:color=black@0.0",
         `fps=${fps}`
      ].join(","),
      "-loop", "0",
      "-vsync", "cfr",
      "-an",
      "-qscale:v", "75",
      "-method", "6",
      "-pix_fmt", "yuva420p"
   ];
   fs.writeFileSync(concatPath, concatLines.join("\n"));
   return new Promise((resolve, reject) => {
      const cmd = ffmpeg().input(concatPath);
      cmd.inputOptions(["-f", "concat", "-safe", "0"]);
      cmd.on("error", (err) => {
         reject(err);
      })
      .on("end", () => resolve(fs.readFileSync(outputPath)))
      .addOutputOptions(options)
      .toFormat("webp")
      .save(outputPath);
   });
}