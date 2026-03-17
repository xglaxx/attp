export default (text, config) => {
   let { width, height, fontSize, limitText, padding } = { width: 512, height: 512, fontSize: 12, limitText: 256, padding: 20, ...(config || {}) };
   const breakLines = (string, maxChars) => {
      let textNew = '', countTxt = '', textInt = ''; // texto inteiro
      var numStr = 0;
      const textArray = string.split(/ +/);
      for (let str of textArray) { // Quebra frase até um limite
         if (str.length >= maxChars) {
            var txt = '', num = 0;
            const letras = str.split('');
            for (var i = 0; i < letras.length; i++) {
               if (num > maxChars) {
                  num = 0;
                  txt += (letras[i].trim().length ? '-\n' : '\n');
               } else {
                  num++;
               }
               txt += letras[i];
            }
            
            textNew = '';
            textInt += ' '+txt;
         } else if (textNew.length >= maxChars) {
            textNew = '';
            textInt += '\n'+str;
         } else {
            textInt += ' '+str;
            textNew += ' '+str;
         }
         textInt = textInt.trim();
      }
      if (limitText) { // Apagar texto até um limite
         for (let i = 0; i < textInt.length; i++) {
            let now = countTxt + textInt[i];
            const inTx = now.split(/ +/).pop();
            const inPlv = textInt.split(/ +/).find(j => j === inTx);
            if (now.length > limitText && inPlv) {
               now = now.trim();
               textInt = (now.slice(0, now.length - inPlv.length).trim() +' [...]');
               break;
            } else {
               countTxt = now;
            }
         }
      }
      return textInt.split('\n');
   };
   
   let lines = [], lineHeight = (fontSize + 8);
   // Ajusta tamanho da fonte até caber na altura
   while (true) { // Feito pelo GPT
      const maxCharsPerLine = Math.floor((width - (padding * 2)) / (fontSize * 0.6)); // estimativa largura
      lines = breakLines(text, maxCharsPerLine);
      lineHeight = fontSize + 8;
      const totalHeight = (lines.length * lineHeight + padding * 2);
      if (totalHeight <= height || fontSize <= 10) break;
      fontSize -= 2; // reduz até caber
   }
   return { lines, fontSize, lineHeight };
};