# 🚀 ATTP Sticker Generator (Emoji Support)
   ## Transforme textos e emojis em stickers animados vibrantes com facilidade.
## 📖 Sobre o Projeto
   Este é um motor de renderização de Stickers ATTP (Animated Text To Picture) desenvolvido em Node.js. Ele não apenas anima o texto com cores vibrantes, mas integra de forma nativa imagens de emojis, garantindo que suas figurinhas fiquem ricas em detalhes e perfeitamente centralizadas.
## ✨ Diferenciais
   • **🌈 Ciclo de Cores Dinâmico**: Suporte a múltiplos frames com cores alternadas.<br>
   • **🎭 Suporte a Emojis**: Renderiza emojis PNG diretamente no sticker junto com o texto.<br>
   • **🧠 Fallback de Emoji**: Se um emoji composto (pele/gênero) não existir, ele busca a versão base automaticamente.<br>
   • **📐 Texto Dinâmico**: Quebra de linha inteligente e ajuste automático do tamanho da fonte para caber no 512x512.<br>
   • **⚖️ Altamente Customizável**: Controle de FPS, cores de borda, margens e caminhos de arquivos via Classe de Configuração.<br>
   • **🧹 Auto-Cleanup**: Gerenciamento automático de arquivos temporários.
## 🛠️ Pré-requisitos
   • Antes de começar, certifique-se de ter o **FFmpeg(^22v)** instalado no seu sistema (No Termux: `pkg install ffmpeg`).<br>
   • Uma pasta com os [emojis do Google](https://github.com/googlefonts/noto-emoji/tree/main/png/) ou pode ser outro Emoji de preferência sua, mas, em formato PNG (72x72 recomendado).<br>
   • Necessário ter um arquivo [TTF/OTF](https://www.nerdfonts.com/font-downloads) para que seja aplicado no texto da imagem.
## ⚙️ Opções de Configuração (API)
| Propriedade | Tipo | Padrão | Descrição |
| :--- | :---: | :---: | :--- |
| `dir` | `String` | `./` | Diretório geral. |
| `height` | `Number` | `512` | Altura da imagem. |
| `width` | `Number` | `512` | Largura da imagem. |
| `fontDir` | `String` | `""` | Diretório para as fontes. |
| `emojisDir` | `String` | `""` | Diretório de (cada) pacotes de emojis. |
| `colors` | `Array` | `['red', ...]` | Cores que o texto assumirá em cada frame. |
| `edgeColors` | `Array` | `[]` | Cores da borda (contorno) do texto. |
| `fps` | `Number` | `10` | Velocidade da animação. |
| `limitText` | `Number` | `150` | Limite máximo de caracteres. |
| `margin` | `Number` | `5` | Recuo lateral para evitar que o texto encoste na borda. |
# 🚀 Como usar
   1. Instalação
   ```bash
      npm install xglaxx/attp
   ```
   2. Instalar na biblioteca/package
   ```bash
      npm install pureimage grapheme-splitter
   ```
   3. Implementação
   ```javascript
      /*
      import Attp from "attp";
      import path from "path";
      import { fileURLToPath } from "url";
      const _fileName = fileURLToPath(import.meta.url);
      const dir = path.dirname(_fileName)+"/";
      */
      const Attp = require("attp").default;
      const dir = __dirname;
      const tt = new Attp({
         dir,
         fontDir: "fonts/",
         emojisDir: "emojis/",
         text: "🥀Attp",
      });
      tt.selectEmojis("Google");
      tt.selectFont("CourierPrime-Regular");
      (async () => {
         const att = await tt.start(); // => Resultado: Object{}
         const webp = await att.webp;
         //const images = att.images(); // => Array [{ index, buffer }]
         //const image = att.image(); // => Buffer
         console.log(webp); // => Buffer (webp);
         /*
            const outputImg = "attp-img-"+Date.now()+".png";
            const img = att.image(); // => Buffer (image); O resultado virá apenas 1 frame e não várias.
            fs.writeFileSync(path.join(dir, outputImg), img);
            console.log("Resultado da imagem:", outputImg);
         */
         // (⚠️) Só pode executar UMA função, pois ao dar o resultado, a pasta será totalmente excluída.
         process.exit();
      })();
   ```
   4. Mudar/Selecionar a **fonte**
   ```javascript
      // Diretório
      tt.changeFont("./fonts/minha-fonte.ttf");
      // Ou Selecionar
      tt.selectFont("minha-fonte"); // Pode usar: Nome do ARQUIVO ou Index. Só funciona se tiver fontes dentro da pasta.
      /*
         // Se quiser atualizar a lista de fonts...
         tt.selectFont("minha-font", true);
      */
      // Ver a lista de fontes
      const fonts = tt.listFonts(); // Só funciona se tiver fontes dentro da pasta.
      console.log(fonts) // => {}
   ```
   5. Ver lista / selecionar emoji
   ```javascript
      // Ver a lista de emojis de cada pacote.
      const emojisList = tt.listEmojis();
      console.log(emojisList); // => {}
      // Selecionar Emoji.
      tt.selectEmoji("Google"); // Porém... Isso só vai funcionar se tiver com o diretório de cada pacote de emojis (ex.: Google, WhatsApp e etc...).
      /*
         // Se quiser atualizar a lista de emojis...
         tt.selectEmoji("Google", true);
      */
      // Carregar o pacote de emojis diretamente
      tt.changeEmojis("./Google/"); // Esteja ciente que as imagens(emojis) estejam dentro da pasta.
   ```
   6. Adicionar uma imagem/foto/cor de fundo
   ```javascript
      tt.pathImage = "./attp.png";
      tt.colorBackground = "black" // Aceita nomes ('red'), hex ('#FF0000') e RGB ('rgb(255,0,0)').
      try {
         const resBack = await tt.background();
         const webp = await resBack.webp;
         //const images = resBack.images(); // => Array [{ index, buffer }]
         //const image = resBack.image(); // => Buffer
         console.log(webp) // => Buffer
      } catch (error) {
         console.error(error);
      }
      // (⚠️) Só pode executar UMA função, pois ao dar o resultado, a pasta será totalmente excluída.
   ```
## 📂 Estrutura de Pastas Esperada
   Para o suporte a emojis funcionar, seus arquivos devem seguir o padrão: emoji_u[unicode].png.<br>
   Exemplo: emoji_u1f337.png (Tulipa).
## ⚠️ Observações dos Objects
   1. *fontDir*: Não precisa direcionar totalmente a pasta das fontes, pois o *dir* já está fazendo esse trabalho.
   2. *emojisDir*: Não precisa direcionar totalmente a pasta dos emojis, pois o *dir* já está fazendo esse trabalho.
   3. *dir*: Ele tem um papel crucial de: Salvar o arquivo, criar pasta temporária, local das fontes e emojis.
<div align="center">
   <h2>✨ Demonstração ✨</h2>
      <img src="./tmp/test/attp.webp" width="250" alt="Sticker Animado">
   <p>
      <i>Exemplo de renderização com ciclo de cores e emojis.</i>
   </p>
</div>