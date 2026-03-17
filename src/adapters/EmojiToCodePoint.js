import isEmoji from "./IsEmoji.js";
export default (emoji) => {
   if (!isEmoji(emoji)) return null;
   
   return Array.from(emoji).map(char => char.codePointAt(0).toString(16).toLowerCase()).join("_"); 
};