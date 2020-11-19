const formDom=document.getElementById('form');
const submitButtonDom=document.getElementById('submit-button');
const inputMortgageDom=document.getElementById('input-mortgage');
const inputInterestDom=document.getElementById('input-interest');
const inputInstalmentDom=document.getElementById('input-instalment');
const sustainableMortgageAnswerDom=document.getElementById('sustainable-mortgage-answer');
const sustainableMortgageQuestionDom=document.getElementById('sustainable-mortgage-question');
const minimumInstalmentDom=document.getElementById('minimum-instalment');
const minInstalmentValueDom=document.getElementById('min-instalment-value');
const debtVariationDom=document.getElementById('debt-variation');
const instructionDebtVariationDom=document.getElementById('instruction-debt-variation');
const yearsToPayOffDom=document.getElementById('years-to-pay-off');

formDom.addEventListener('submit', (event)=>{
    event.preventDefault();
    clearPreviousData()
    checkSustainability();
})

function checkSustainability () {
    sustainableMortgageQuestionDom.classList.remove('display-none');
    const inputMortgageValue=inputMortgageDom.value;
    const inputInterestRate=inputInterestDom.value;
    const inputInstalmentValue=inputInstalmentDom.value;
    const instalmentValueYear1=inputInstalmentValue * 12;
    const interestValueYear1=inputMortgageValue/100 * inputInterestRate;
    const totalDebtYear1= +inputMortgageValue + interestValueYear1;
    if (instalmentValueYear1>interestValueYear1){
        instructionDebtVariationDom.classList.remove('display-none');
        sustainableMortgageAnswerDom.innerText='Yes';  
        showDebtVariation({year:1, debt:totalDebtYear1});
        const debtVariations=(calculateYearlyDebtVariations(totalDebtYear1, instalmentValueYear1, inputInterestRate));
        debtVariations.forEach(variation=>{
            showDebtVariation(variation);
        });
        const lastDebtVariation=debtVariations[debtVariations.length-1];
        yearsToPayOffDom.classList.remove('display-none');
        if (lastDebtVariation.debt<=instalmentValueYear1) {
            const yearsToPayOff=lastDebtVariation.year;
            yearsToPayOffDom.innerText='You will finish paying your debt in ' + yearsToPayOff + ' years';
        } else {
            yearsToPayOffDom.innerText='You will not finish paying your debt in 50 years';
        }
    } else {
        sustainableMortgageAnswerDom.innerText="No";
        minimumInstalmentDom.classList.remove('display-none');
        let minInstalment=interestValueYear1 /12 + 50;
        minInstalmentValueDom.innerText=minInstalment.toFixed(2);    
    }
}

function calculateYearlyDebtVariations(initialDebt, instalmentYearlyValue, rate){
    let yearlyVariation;
    const result=[];
    let debt=initialDebt;
    for (let i=2; i<=50 && debt>0; i++){
        let yearNum=i;
        debt -= instalmentYearlyValue;
        debt += debt/100*rate;
        result.push(yearlyVariation={year:yearNum, debt: +debt.toFixed(2)})
    } 
    return result;
}
    
function showDebtVariation(object){
    const lineInformation=document.createElement('li');
    debtVariationDom.appendChild(lineInformation);
    if (object.debt<=0) {
        object.debt=0;
    }
    lineInformation.innerText='£ '+ object.debt;
}   

function clearPreviousData (){
    minimumInstalmentDom.innerText='';
    minInstalmentValueDom.innerText='';
    debtVariationDom.innerText='';
    yearsToPayOffDom.innerText='';    
    instructionDebtVariationDom.innerText='';
}