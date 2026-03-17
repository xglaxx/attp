import { exec } from "child_process";
export default (tempDir, ops) => new Promise((resolve, reject) => {
   const ffmpegCmd = `ffmpeg -y -framerate ${ops.fps} -i "${tempDir}/f_%d.png" -vcodec libwebp -lossless 0 -q:v 80 -loop 0 -an -vsync 0 "${ops.output}"`;
   exec(ffmpegCmd, (err) => {
      if (err) reject(err);
      
      resolve(ops.output);
   });
});