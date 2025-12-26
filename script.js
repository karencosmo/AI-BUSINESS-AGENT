// Dynamic Reasoning Function
function generateReasons(investment, revenue, timeline, risk, roi, score){
    let reasons = [];

    if(roi >= 3){
        reasons.push("Revenue is very high compared to investment — strong financial upside.");
    } else if(roi >= 2){
        reasons.push("Revenue exceeds twice the investment — profitable scenario.");
    } else {
        reasons.push("Revenue is less than twice the investment — caution advised.");
    }

    if(timeline <= 3){
        reasons.push("Quick revenue generation reduces waiting risk.");
    } else if(timeline <= 6){
        reasons.push("Moderate timeline — manageable risk.");
    } else {
        reasons.push("Long timeline increases uncertainty and cash flow risk.");
    }

    if(risk === "Low" && roi < 2){
        reasons.push("Low risk tolerance not met — investment might be stressful.");
    } else if(risk === "Medium" && score < 50){
        reasons.push("Medium risk tolerance — caution required.");
    } else if(risk === "High"){
        reasons.push("High risk tolerance — potential for high reward.");
    }

    return reasons.slice(0,3); // Top 3 reasons
}

document.getElementById('decisionForm').addEventListener('submit', function(e){
    e.preventDefault();

    // Get Inputs
    const businessType = document.getElementById('businessType').value;
    const investment = parseFloat(document.getElementById('investment').value);
    const revenue = parseFloat(document.getElementById('revenue').value);
    const timeline = parseFloat(document.getElementById('timeline').value);
    const risk = document.getElementById('risk').value;

    // Initialize score
    let score = 0;

    // ROI Check
    const roi = revenue / investment;
    if(roi >= 2) score += 50;
    else score -= 20;

    // Timeline Check
    if(timeline <= 6) score += 30;
    else score -= 10;

    // Risk Check
    if(risk === "Low" && roi < 2) score -= 20;
    else if(risk === "High" && roi >= 1) score += 10;

    // Final Decision
    let decision = "";
    if(score >= 70) decision = "LAUNCH";
    else if(score >= 40) decision = "LAUNCH WITH CAUTION";
    else decision = "DO NOT LAUNCH";

    // Generate reasons dynamically
    let reasons = generateReasons(investment, revenue, timeline, risk, roi, score);

    // Next Actions
    let actions = [];
    if(decision === "LAUNCH" || decision === "LAUNCH WITH CAUTION"){
        actions.push("Prepare operations plan.");
        actions.push("Start marketing immediately.");
        actions.push("Validate product-market fit.");
    } else {
        actions.push("Reconsider investment.");
        actions.push("Test smaller pilot.");
        actions.push("Adjust business plan.");
    }

    // Output
    document.getElementById('decisionText').innerText = decision;
    document.getElementById('confidence').innerText = score + "%";

    const reasonsList = document.getElementById('reasonsList');
    reasonsList.innerHTML = "";
    reasons.forEach(r => {
        let li = document.createElement('li');
        li.innerText = r;
        reasonsList.appendChild(li);
    });

    const actionsList = document.getElementById('actionsList');
    actionsList.innerHTML = "";
    actions.forEach(a => {
        let li = document.createElement('li');
        li.innerText = a;
        actionsList.appendChild(li);
    });
});

// Copy Result Button
document.getElementById('copyButton').addEventListener('click', function(){
    let decision = document.getElementById('decisionText').innerText;
    let confidence = document.getElementById('confidence').innerText;
    let reasons = Array.from(document.getElementById('reasonsList').children).map(li => "- " + li.innerText).join("\n");
    let actions = Array.from(document.getElementById('actionsList').children).map(li => "- " + li.innerText).join("\n");

    let textToCopy = `Decision: ${decision}\nConfidence: ${confidence}\nReasons:\n${reasons}\nNext Actions:\n${actions}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Result copied! Share it now.");
    });
});