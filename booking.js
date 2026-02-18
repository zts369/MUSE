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
    if (stepNumber === 3) subtitle.innerText = "SELECT YOUR PAYMENT";
    if (stepNumber === 4) subtitle.innerText = "CONFIRM BOOKING DETAILS";
    const steps = document.querySelectorAll('.stepper .step');
    steps.forEach((step, index) => {
        const circle = step.querySelector('.circle');
        const currentStepIndex = index + 1;

        if (currentStepIndex < stepNumber) {
            step.classList.remove('active');
            circle.innerHTML = '✓'; 
        } else if (currentStepIndex === stepNumber) {
            step.classList.add('active');
            circle.innerHTML = currentStepIndex;
        } else {
            step.classList.remove('active');
            circle.innerHTML = currentStepIndex;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('credit-card-details');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
});

