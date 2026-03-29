import fs from "fs";
import path from "path";
import { exec } from "child_process";
export default (tempDir, dir, fps) => new Promise((resolve, reject) => {
   const output = path.join(dir, "attp-"+Date.now()+".webp");
   const ffmpegCmd = `ffmpeg -y -framerate ${fps} -i "${tempDir}/f_%d.png" -vcodec libwebp -lossless 0 -q:v 80 -loop 0 -an -vsync 0 "${output}"`;
   exec(ffmpegCmd, (err) => {
      if (err) reject(err);
      
      const webp = fs.readFileSync(output);
      resolve(webp);
   });
});