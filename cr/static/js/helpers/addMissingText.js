import { weights } from "../weightsDisciplines.js"

export function addMissingtext(){
  let text = document.querySelector("[data-id='weights']")
  

  let listKeys = Object.keys(weights);
  text.innerHTML = `
    <h2>Carga Horária</h2>
    <table class="formulas">
    ${listKeys.map((valor ) => {return `<tr><th>${valor}</th><td>${weights[valor]}</td></tr>`}).join("\n")}
    </table>
    
  `
}