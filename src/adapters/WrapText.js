export default (ctx, words, maxWidth) => {
   words = words.map((text) => text.replaceAll('-', ''));
   let lines = [];
   let currentLine = "";
   for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let width = Math.floor(ctx.measureText(currentLine+word).width);
      if (width < maxWidth) {
         currentLine += word;
      } else {
         const wordsText = word.split(/ +/);
         for (let v = 0; v < wordsText.length; v++) {
            const textWord = wordsText[v];
            width = Math.floor(ctx.measureText(currentLine+textWord).width);
            if (width < maxWidth) {
               currentLine += " "+textWord;
            } else {
               lines.push(currentLine);
               currentLine = textWord;
            }
         }
      }
   }
   if (currentLine !== "") {
      lines.push(currentLine);
   }
   return lines;
};