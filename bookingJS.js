function goToStep(stepNumber) {
    // 1. Hide all sections with the class 'booking-step'
    document.querySelectorAll('.booking-step').forEach(step => {
        step.style.display = 'none';
    });

    // 2. Show the specific step
    document.getElementById('step-' + stepNumber).style.display = 'block';

    // 3. Update the Stepper UI
    updateStepper(stepNumber);
}

function updateStepper(stepNumber) {
    const subtitle = document.getElementById('step-subtitle');
    if (stepNumber === 1) subtitle.innerText = "SELECT YOUR DATES";
    if (stepNumber === 2) subtitle.innerText = "SELECT YOUR ROOM";
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach((step, index) => {
        const circle = step.querySelector('.circle');
        const currentStepIndex = index + 1;

        if (currentStepIndex < stepNumber) {
            // Step is finished: Show checkmark
            step.classList.add('active');
            circle.innerHTML = '✓'; 
        } else if (currentStepIndex === stepNumber) {
            // Step is current: Show number and highlight
            step.classList.add('active');
            circle.innerHTML = currentStepIndex;
        } else {
            // Step is upcoming: Show number and remove highlight
            step.classList.remove('active');
            circle.innerHTML = currentStepIndex;
        }
    });
}

