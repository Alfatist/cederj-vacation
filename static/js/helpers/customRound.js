const decimalPlaces = 4;

export function customRound(number){
  let numberToFix = Math.pow(10, decimalPlaces);
  return Math.ceil(number * numberToFix) / numberToFix;
}