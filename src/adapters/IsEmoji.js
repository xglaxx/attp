export default (char) => {
   return /\p{Extended_Pictographic}/u.test(char);
};