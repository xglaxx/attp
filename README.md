# 🚀 ATTP Sticker Generator (Emoji Support)
   ## Transforme textos e emojis em stickers animados vibrantes com facilidade.
# 📖 Sobre o Projeto
   Este é um motor de renderização de Stickers ATTP (Animated Text To Picture) desenvolvido em Node.js. Ele não apenas anima o texto com cores vibrantes, mas integra de forma nativa imagens de emojis, garantindo que suas figurinhas fiquem ricas em detalhes e perfeitamente centralizadas.
# ✨ Diferenciais
   • **🌈 Ciclo de Cores Dinâmico**: Suporte a múltiplos frames com cores alternadas.
   • **🎭 Suporte a Emojis**: Renderiza emojis PNG diretamente no sticker junto com o texto.
   • **🧠 Fallback de Emoji**: Se um emoji composto (pele/gênero) não existir, ele busca a versão base automaticamente.
   • **📐 Texto Dinâmico**: Quebra de linha inteligente e ajuste automático do tamanho da fonte para caber no 512x512.
   • **⚖️ Altamente Customizável**: Controle de FPS, cores de borda, margens e caminhos de arquivos via Classe de Configuração.
   • **🧹 Auto-Cleanup**: Gerenciamento automático de arquivos temporários.
# 🛠️ Pré-requisitos
   • Antes de começar, certifique-se de ter o **FFmpeg(^22v)** instalado no seu sistema (No Termux: `pkg install ffmpeg`).
   • Uma pasta com os [emojis do Google](https://github.com/googlefonts/noto-emoji/tree/main/png/) ou pode ser outro Emoji de preferência sua, mas, em formato PNG (72x72 recomendado).
   • Necessário ter um arquivo [TTF/OTF](https://www.nerdfonts.com/font-downloads) para que seja aplicado no texto da imagem.
# ⚙️ Opções de Configuração (API)
| Propriedade | Tipo | Padrão | Descrição |<br>
| :--- | :---: | :---: | :--- |<br>
| `fontPath` | `String` | `""` | Caminho do arquivo .ttf ou .otf. |<br>
| `emojisPath` | `String` | `"./"` | Pasta contendo os emojis PNG. |<br>
| `colors` | `Array` | `['red', ...]` | Cores que o texto assumirá em cada frame. |<br>
| `edgeColors` | `Array` | `[]` | Cores da borda (contorno) do texto. |<br>
| `fps` | `Number` | `10` | Velocidade da animação. |<br>
| `limitText` | `Number` | `150` | Limite máximo de caracteres. |<br>
| `margin` | `Number` | `5` | Recuo lateral para evitar que o texto encoste na borda. |<br>
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
      const path = require("path");
      const dir = __dirname;
      const tt = new Attp({
         dir,
         fontDir: "fonts/",
         emojisDir: "emojis/",
         output: "attp-"+Date.now(),
         text: "🥀Attp",
      });
      tt.selectEmoji("Google");
      tt.selectFont("CourierPrime-Regular");
      (async () => {
         await tt.start(); // => Resultado: Arquivo
         process.exit();
      })();
   ```
   4. Mudar/Selecionar a **fonte**
   ```javascript
      // Diretório
      tt.changeFont("./fonts/minha-fonte.ttf");
      // Ou Selecionar
      tt.selectFont("minha-fonte"); // Pode usar: Nome do ARQUIVO ou Index. Só funciona se tiver fontes dentro da pasta.
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
      tt.selectEmoji("Google");
      // Carregar o pacote de emojis diretamente
      tt.changeEmojis("./Google/"); // Esteja ciente que as imagens(emojis) estejam dentro da pasta.
      //------//
      // Porém... Isso só vai funcionar se tiver com o diretório de cada pacote de emojis (ex.: Google, WhatsApp e etc...).
   ```
# 📂 Estrutura de Pastas Esperada
   Para o suporte a emojis funcionar, seus arquivos devem seguir o padrão: emoji_u[unicode].png.
   Exemplo: emoji_u1f337.png (Tulipa).
# ⚠️ Observações dos Objects
   1. *fontDir"*: Não precisa direcionar totalmente a pasta das fontes, pois o *dir* já está fazendo esse trabalho.
   2. *emojis"*: Não precisa direcionar totalmente a pasta dos emojis, pois o *dir* já está fazendo esse trabalho.
   3. *output*: Apenas o Nome do arquivo é necessário (Recomendo não ter espaço ou caracteres que atrapalhe o Arquivo).
   4. *dir*: Ele tem um papel crucial de: Salvar o arquivo, criar pasta temporária, local das fontes e emojis.
## 🖼️ Resultado Final
<div align="center">
   <h2>✨ Demonstração</h2>
   <img src="./tmp/test/attp.webp" width="250" alt="Sticker Animado">
   <p>
      <i>Exemplo de renderização com ciclo de cores e emojis.</i>
   </p>
</div>