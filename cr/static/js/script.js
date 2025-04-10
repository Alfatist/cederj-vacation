import { weights } from "./weightsDisciplines.js";
import { addMissingtext } from "./helpers/addMissingText.js"

let mainForm = document.getElementById("mainForm")
let labels = document.querySelectorAll("[data-id='label_field']");
let resultParagraph = document.getElementById("result");
const inputCountLimit = 4;

labels.forEach( (label) => {
  label.addEventListener("click", () => {
    if(label.parentNode.childElementCount === inputCountLimit + 1){
      alert(`O número máximo de vezes que o aluno pode cursar a mesma disciplina é ${inputCountLimit}!`)
      return 
    }
    let input = label.nextElementSibling;
    let newInput = _createNewInputBasedOnAnother(input);
    label.parentNode.appendChild(newInput);
    
  });
});

addMissingtext();


mainForm.addEventListener("submit", submitMainForm)

function submitMainForm(e){
  e.preventDefault();
  let inputs = document.querySelectorAll("[data-id='fields'] input");
  let sumDivision = 0;
  let sumDividend = 0;
  inputs.forEach((input) => {
    if(input.value !== "" && typeof parseFloat(input.value) === "number") {
      console.log(parseFloat(input.value));
      console.log(input.getAttribute("name"))
      let weight = weights[input.getAttribute("name")] ?? weights["PADRÃO"] ;
      sumDivision += weight;
      sumDividend += +input.value * weight;
    }
  });
  console.log(sumDividend, sumDivision)
  resultParagraph.innerText = sumDividend > 0 ? `Seu CR será de: ${Math.round(sumDividend * 10/sumDivision)/10 }` : "Você não digitou nenhuma nota válida!";
  
}

function _createNewInputBasedOnAnother(input){
  let newInput = input.cloneNode(false);
  newInput.value = "";
  let pressTimer;
  newInput.classList.add("addedInput");
  newInput.setAttribute("required", "required")
  newInput.addEventListener("mousedown", () => {
    newInput.classList.add("removingInput");
    pressTimer = setTimeout(() => {
      newInput.parentNode.removeChild(newInput);
      }, 1000);
    });

    newInput.addEventListener("mouseup", () => {
      newInput.classList.remove("removingInput");
      clearTimeout(pressTimer);
    });

    newInput.addEventListener("mouseleave", () => {
      newInput.classList.remove("removingInput");
      clearTimeout(pressTimer);
    });
  return newInput;
}


