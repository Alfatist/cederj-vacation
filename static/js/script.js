import { resultScores } from './resultScores.js';

let mainForm = document.getElementById("mainForm")

mainForm.addEventListener("submit", submitMainForm)

function submitMainForm(e){
  e.preventDefault();
  let ad1 = document.getElementById("nota ad1")
  let ap1 = document.getElementById("nota ap1")
  let ad2 = document.getElementById("nota ad2")
  let ap2 = document.getElementById("nota ap2")
  let ap3 = document.getElementById("nota ap3")
  let resultParagraph = document.getElementById("result");

  
  let resultJson = resultScores(_customParseNumber(ad1.value), _customParseNumber(ap1.value), _customParseNumber(ad2.value), _customParseNumber(ap2.value), _customParseNumber(ap3.value));
  resultParagraph.innerText = resultJson.texto
  ad1.value = resultJson.values.ad1
  ad2.value = resultJson.values.ad2
  ap1.value = resultJson.values.ap1
  ap2.value = resultJson.values.ap2
  ap3.value = resultJson.values.ap3
  
}

function _customParseNumber(string){
  if(string == "") return null;
  return +string
}