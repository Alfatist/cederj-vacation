const average = 6;
const averageInAP3 = 5;

export function resultScores(ad1, ap1, ad2, ap2, ap3) {
  if( typeof ad1 !== "number" && typeof ap1 !== "number") throw Error("Necessário ad1 e ap1");
  let n1 = (ad1*20)/100 + (ap1*80)/100;
  let textToAlert = ""
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

  let n2 = 0;


  if(n1 === 10) textToAlert = "Atenção! você tirou 10 na AD1 e AP1, então a AP3 vira só formalidade. Consulte o regulamento.\nO sistema assumirá que você deve fazer as provas.";

  if(typeof ap2 === "number" && typeof ad2 !== "number"){
    ad2 = 0;
    result["values"]["ad2"] = 0
  }
  if(typeof ap3 === "number" && typeof ap2 !== "number"){
    ap2 = 0;
    result["values"]["ap2"] = 0
  }

  if((typeof ap2 === "number") && (typeof ad2 === "number") && (typeof ap3 === "number")) _casead2ap2ap3(n1, ad2, ap2, ap3, result)  
  else if (typeof ap2 === "number" && typeof ad2 === "number") _casead2ap2(n1, ad2, ap2, result)
  else if (typeof ad2 === "number") _casead2(n1, ad2, result)
  else _casenone(n1, result);

  if(textToAlert != "") alert(textToAlert)
  return result
}

function _casenone(n1, result){
  if(n1/2 < 1) result["texto"] = `Não é possível passar sem precisar de AP3. \nAssumindo que você tire ${averageInAP3} na N2, precisará tirar ${averageInAP3} na ap3.`
  else { 
    let ad2 = 10;
    result["values"]["ad2"] = ad2;
    let needed = _howMuchNeededAp2(n1, ad2);
    result["texto"] = `\nAssumindo que você tire ${ad2} na AD2, precisará tirar ${needed} na ap2.`
  }
  
}

function _casead2(n1, ad2, result){
  if( (n1 + _calculateN2(ad2, 0))/2 === average) result["texto"] = `Sequer precisa de ap2, passou direto!`;
  else if(!_isPossibleToPassWithoutAP3(n1, ad2) ){
    let ap2 = average;
    result["values"]["ap2"] = ap2;
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, _calculateN2(ad2, ap2));
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
  let n2 = (ad2*20)/100 + (ap2*80)/100;
  let howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    

  result["texto"] = ap3 >= howMuchNeededAp3 ? "Parabéns, você passou ;)" : `Poxa, não foi dessa vez. Nesse caso a ap3 precisa ser no mínimo ${howMuchNeededAp3}`
}

function _casead2ap2(n1, ad2, ap2, result){
  let n2 = _calculateN2(ad2, ap2); 

  if((n1 + n2)/2 >= average) result["texto"] = "Você é CDF ou o quê? Passou direto! "
  else {
    let howMuchNeededAp3 = _howMuchNeededAp3(n1, n2);
    result["texto"] = `Terá que fazer a ap3, e esperar que tire ${howMuchNeededAp3}`;
    result["values"]["ap3"] = howMuchNeededAp3;
  }
}

function _calculateN2(ad2, ap2){
  return (ad2*20)/100 + (ap2*80)/100
}

function _isPossibleToPassWithoutAP3(n1, ad2){
  if(n1/2 + (ad2*10)/100 + 4 < average) return false;
  return true; 
}

function _howMuchNeededAp3(n1, n2){
  if(n2 > n1) n1 = n2;
  return averageInAP3*2 - n1
}

function _howMuchNeededAp2(n1, ad2) {
  return (average - (n1 / 2) - (ad2*0.1))/0.4
}
  
