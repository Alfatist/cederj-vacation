import { customRound } from "./helpers/customRound.js";

const average = 6;
const averageInAP3 = 5;

export function resultScores(ad1, ap1, ad2, ap2, ap3) {
  if( typeof ad1 !== "number" && typeof ap1 !== "number") throw Error("Necessário ad1 e ap1");
  [ad1, ap1, ad2, ap2, ap3] = _addMissingValuesIfAny(ad1, ap1, ad2, ap2, ap3);
  
  /** Caso precise alertar um texto no fim, adicione o texto a esta variável */ 
  let textToAlert = ""

  /** Resultado que retorna no final de tudo*/
  let result = {
    "texto": "",
    "values": {
      "ad1": ad1,
      "ap1": ap1,
      "ad2": ad2,
      "ap2": ap2,
      "ap3": ap3,
    }
  }

  let n1 = _obtainNx(ad1, ap1);

  if((typeof ap2 === "number") && (typeof ad2 === "number") && (typeof ap3 === "number")) _casead2ap2ap3(n1, ad2, ap2, ap3, result)  
  else if (typeof ap2 === "number" && typeof ad2 === "number") _casead2ap2(n1, ad2, ap2, result)
  else if (typeof ad2 === "number") _casead2(n1, ad2, result)
  else _casenone(n1, result);

  if(_checkIfPassedDirectly(n1)) _casePassedDirectly(result, true);  

  if(textToAlert != "") alert(textToAlert);
  return result
}

/** Normaliza os valores, ou seja, adiciona os valores faltantes com default e converte tudo para inteiro. 
 * Por exemplo, se AP3 foi passado mas ap2 não, ap2 será 0.
*/
function _addMissingValuesIfAny(ad1, ap1, ad2, ap2, ap3){
  if(typeof ap2 === "number" && typeof ad2 !== "number") ad2 = 0;
  if(typeof ap3 === "number" && typeof ap2 !== "number") ap2 = 0;
  return [ad1, ap1, ad2, ap2, ap3]; // optei por parseFloat no lugar de "+" em cada pois não quero que "NaN" vire "0"
}



/** Verifica se passou sem precisar de ap3*/
const _checkIfPassedDirectly = (n) => n / 2 === averageInAP3;

function _casePassedDirectly(result, isN1 = false){
  result["texto"] = `Parabéns, você passou direto!
  
  ${isN1? "Se lembre que, se não quiser fazer N2, você precisa comparecer a AP3, nem que seja só para assinar.\n\nComo é a N1, coloquei na tabela o necessário para não precisar ir para AP3." 
    : "No entanto, perceba que você só passou caso faça AP3, então é necessário fazê-la, nem que seja só para colocar o nome."}
    `; 
}

function _casenone(n1, result){
  if(n1/2 < 1) result["texto"] = `Não é possível passar sem precisar de AP3. \nAssumindo que você tire ${averageInAP3} na N2, precisará tirar ${averageInAP3} na ap3.`
  else { 
    let ad2 = 10;
    result["values"]["ad2"] = ad2;
    let needed = _howMuchNeededAp2(n1, ad2);
    result["texto"] = `Assumindo que você tire ${ad2} na AD2, precisará tirar ${needed} na ap2.`
  }
  
}

function _casead2(n1, ad2, result){
  if( (n1 + _obtainNx(ad2, 0))/2 === average) result["texto"] = `Sequer precisa de ap2, passou direto!`;
  else if(!_isPossibleToPassWithoutAP3(n1, ad2) ){
    let ap2 = average;
    result["values"]["ap2"] = ap2;
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, _obtainNx(ad2, ap2));
    result["values"]["ap3"] = howMuchNeededAp3;
    result["texto"] = `Não é possível passar só com a ap2. Assumindo que você tire a média ${average} na AP2, precisará tirar ${howMuchNeededAp3} na ap3.`
  }
  else{
    let needed = _howMuchNeededAp2(n1, ad2)
    result["values"]["ap2"] = needed;
    result["texto"] = `Para não ir à AP3, você precisa de ${needed} na AP2.`
  }
}

function _casead2ap2ap3(n1, ad2, ap2, ap3, result){
  let n2 = _obtainNx(ad2, ap2);
  let howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    

  result["texto"] = ap3 >= howMuchNeededAp3 ? "Parabéns, você passou ;)" : `Poxa, não foi dessa vez. Nesse caso a ap3 precisa ser no mínimo ${howMuchNeededAp3}`
}

function _casead2ap2(n1, ad2, ap2, result){
  let n2 = _obtainNx(ad2, ap2); 


  
  if((n1 + n2)/2 >= average) result["texto"] = "Você é CDF ou o quê? Passou direto! "
  else if(_checkIfPassedDirectly(n2)) _casePassedDirectly(result, false);
  else {
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    result["texto"] = `Terá que fazer a ap3, e esperar que tire ${howMuchNeededAp3}`;
    result["values"]["ap3"] = howMuchNeededAp3;
  }
  
}

function _isPossibleToPassWithoutAP3(n1, ad2){
  let x = new BigNumber(ad2)
  x = x.multipliedBy(0.1);
  let y = new BigNumber(n1);
  y = y.div(2);
  let result = y.plus(x).plus(4).toNumber() >= average;

  return customRound(result);
}

function _howMuchNeededAp3(n1, n2){
  if(n2 > n1) n1 = n2;
  return averageInAP3*2 - n1
}

function _howMuchNeededAp2(n1, ad2) {
  let x = new BigNumber(ad2)
  x = x.multipliedBy(0.1);
  let y = new BigNumber(n1);
  y = y.div(2);
  let result = new BigNumber(average - y - x);
  result = result.div(0.4);

  return customRound(result.toNumber());
}
  
function _obtainNx(ad, ap, pesoAdPorcento = 0.2, pesoApPorcento = 0.8){
  let x = new BigNumber(ad);
  let y = new BigNumber(ap);

  let pesoAd = new BigNumber(pesoAdPorcento);
  let pesoAp = new BigNumber(pesoApPorcento);

  x = x.multipliedBy(pesoAd);
  y = y.multipliedBy(pesoAp);

  return customRound(x.plus(y).toNumber());

}

