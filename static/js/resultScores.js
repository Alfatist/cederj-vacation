import { customRound } from "./helpers/customRound.js";

const average = 6;
const averageInAP3 = 5;

export function resultScores(AD1, AP1, AD2, AP2, AP3) {
  if( typeof AD1 !== "number" && typeof AP1 !== "number") throw Error("Necessário AD1 e AP1");
  [AD1, AP1, AD2, AP2, AP3] = _ADdMissingValuesIfAny(AD1, AP1, AD2, AP2, AP3);
  
  /** Caso precise alertar um texto no fim, ADicione o texto a esta variável */ 
  let textToAlert = ""

  /** ResultaDo que retorna no final de tudo*/
  let result = {
    "texto": "",
    "values": {
      "AD1": AD1,
      "AP1": AP1,
      "AD2": AD2,
      "AP2": AP2,
      "AP3": AP3,
    }
  }

  let n1 = _obtainNx(AD1, AP1);

  if((typeof AP2 === "number") && (typeof AD2 === "number") && (typeof AP3 === "number")) _caseAD2AP2AP3(n1, AD2, AP2, AP3, result)  
  else if (typeof AP2 === "number" && typeof AD2 === "number") _caseAD2AP2(n1, AD2, AP2, result)
  else if (typeof AD2 === "number") _caseAD2(n1, AD2, result)
  else if(_checkIfPassedDirectly(n1)) _casePassedDirectly(result, true);  
  else _casenone(n1, result);

  if(textToAlert != "") alert(textToAlert);
  return result
}

/** Normaliza os valores, ou seja, ADiciona os valores faltantes com default e converte tudo para inteiro. 
 * Por exemplo, se AP3 foi passADo mas AP2 não, AP2 será 0.
*/
function _ADdMissingValuesIfAny(AD1, AP1, AD2, AP2, AP3){
  if(typeof AP2 === "number" && typeof AD2 !== "number") AD2 = 0;
  if(typeof AP3 === "number" && typeof AP2 !== "number") AP2 = 0;
  return [AD1, AP1, AD2, AP2, AP3]; // optei por parseFloat no lugar de "+" em cADa pois não quero que "NaN" vire "0"
}



/** Verifica se passou sem precisar de AP3*/
const _checkIfPassedDirectly = (n) => n / 2 === averageInAP3;

function _casePassedDirectly(result, isN1 = false){

  if(isN1) result.values.AD2 = 10;
  result["texto"] = `Parabéns, você passou direto!
  
  ${isN1? "Se lembre que, se não quiser fazer N2, você precisa comparecer a AP3, nem que seja só para assinar.\n\nComo é a N1, coloquei na tabela o necessário para não precisar ir para AP3." 
    : "No entanto, perceba que você só passou caso faça AP3, então é necessário fazê-la, nem que seja só para colocar o nome."}
    `; 
}

function _casenone(n1, result){
  if(n1/2 < 1) result["texto"] = `Não é possível passar sem precisar de AP3. \nAssumindo que você tire ${averageInAP3} na N2, precisará tirar ${averageInAP3} na AP3.`
  else { 
    let AD2 = 10;
    result["values"]["AD2"] = AD2;
    let needed = _howMuchNeededAp2(n1, AD2);
    result["texto"] = `Assumindo que você tire ${AD2} na AD2, precisará tirar ${needed} na AP2.`
  }
  
}

function _caseAD2(n1, AD2, result){
  if( (n1 + _obtainNx(AD2, 0))/2 === average) return result["texto"] = `Sequer precisa de AP2, passou direto!`;
  
  else if(!_isPossibleToPassWithoutAP3(n1, AD2) ){
    let AP2 = average;
    result["values"]["AP2"] = AP2;
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, _obtainNx(AD2, AP2));
    result["values"]["AP3"] = howMuchNeededAp3;
    result["texto"] = `Não é possível passar só com a AP2. Assumindo que você tire a média ${average} na AP2, precisará tirar ${howMuchNeededAp3} na AP3.`
  }
  else{
    let needed = _howMuchNeededAp2(n1, AD2)
    result["values"]["AP2"] = needed;
    result["texto"] = `Para não ir à AP3, você precisa de ${needed} na AP2.`
  }

  if (_checkIfPassedDirectly(n1)) result["texto"] += `\n\nVálido destacar que, com sua nota na AD1 e AP1, você sequer precisa da ap2. Basta ir para a AP3 e assinar seu nome.`;
}

function _caseAD2AP2AP3(n1, AD2, AP2, AP3, result){
  let n2 = _obtainNx(AD2, AP2);
  const howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    
  let finalScore = customRound((Math.max(n1, n2) + AP3) / 2);
  result["texto"] = finalScore >= averageInAP3 ? `Parabéns, você passou ;)` : `Poxa, não foi dessa vez. Nesse caso a AP3 precisa ser no mínimo ${howMuchNeededAp3}`
  result["texto"] += `\n\nNota: ${finalScore}`
}

function _caseAD2AP2(n1, AD2, AP2, result){
  let n2 = _obtainNx(AD2, AP2); 


  
  if((n1 + n2)/2 >= average) result["texto"] = "Você é CDF ou o quê? Passou direto!";
  else if(_checkIfPassedDirectly(n2)) _casePassedDirectly(result, false);
  else {
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    result["texto"] = `Terá que fazer a AP3, e esperar que tire ${howMuchNeededAp3}`;
    result["values"]["AP3"] = howMuchNeededAp3;
  }

  result["texto"] += `\n\nNota: ${customRound((n1 + n2) / 2)}`
  
}

function _isPossibleToPassWithoutAP3(n1, AD2){
  let x = new BigNumber(AD2)
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

function _howMuchNeededAp2(n1, AD2) {
  let x = new BigNumber(AD2)
  x = x.multipliedBy(0.1);
  let y = new BigNumber(n1);
  y = y.div(2);
  let result = new BigNumber(average - y - x);
  result = result.div(0.4);

  return customRound(result.toNumber());
}
  
function _obtainNx(AD, AP, pesoAdPorcento = 0.2, pesoApPorcento = 0.8){
  let x = new BigNumber(AD);
  let y = new BigNumber(AP);

  let pesoAd = new BigNumber(pesoAdPorcento);
  let pesoAp = new BigNumber(pesoApPorcento);

  x = x.multipliedBy(pesoAd);
  y = y.multipliedBy(pesoAp);

  return customRound(x.plus(y).toNumber());

}

