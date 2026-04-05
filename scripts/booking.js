function goToStep(stepNumber) {
    // 1. Hide all sections with the class 'booking-step'
    document.querySelectorAll('.booking-step').forEach(step => {
        step.style.display = 'none';
    });

    if (stepNumber === 3 || stepNumber === 4) {
        if (typeof updatePricingDisplay === 'function') {
            updatePricingDisplay();
        }
    }

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

    // Date Validation: Check-out cannot be before check-in
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');

    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', function () {
            // Set the minimum check-out date to the selected check-in date
            checkOutInput.min = this.value;

            // If the current check-out date is earlier than the new check-in date, reset it
            if (checkOutInput.value && checkOutInput.value < this.value) {
                checkOutInput.value = this.value;
            }
        });
    }

    window.updatePricingDisplay = function() {
        const checkInVal = document.getElementById('checkInDate').value;
        const checkOutVal = document.getElementById('checkOutDate').value;
        const roomsCount = parseInt(document.getElementById('roomsCount').value) || 1;
        const adultGuests = document.getElementById('adultGuests').value || 1;
        const childGuests = document.getElementById('childGuests').value || 0;
        
        const form = document.getElementById('booking-form');
        const pricePerNight = parseFloat(form.getAttribute('data-room-price')) || 0;

        let nights = 1;
        if (checkInVal && checkOutVal) {
            const timeDiff = new Date(checkOutVal).getTime() - new Date(checkInVal).getTime();
            nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        }

        const subtotal = pricePerNight * roomsCount * nights;
        const formattedSubtotal = '₱' + subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        // Update Step 3 Pricing
        const step3Sub = document.getElementById('step3-subtotal');
        const step3Total = document.getElementById('step3-total');
        if (step3Sub) step3Sub.innerText = formattedSubtotal;
        if (step3Total) step3Total.innerText = formattedSubtotal;

        // Update Step 4 Confirmation info
        const step4CheckIn = document.getElementById('step4-checkin');
        const step4CheckOut = document.getElementById('step4-checkout');
        const step4Adults = document.getElementById('step4-adults');
        const step4Children = document.getElementById('step4-children');
        const step4Sub = document.getElementById('step4-subtotal');
        const step4Total = document.getElementById('step4-total');

        if (step4CheckIn && checkInVal) {
            // format check in date nicely
            step4CheckIn.innerText = "Arriving: " + new Date(checkInVal).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric'});
        }
        if (step4CheckOut && checkOutVal) {
            step4CheckOut.innerText = "Departing: " + new Date(checkOutVal).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric'});
        }
        if (step4Adults) step4Adults.innerText = `Adults: ${adultGuests}`;
        if (step4Children) step4Children.innerText = `Children: ${childGuests}`;
        if (step4Sub) step4Sub.innerText = formattedSubtotal;
        if (step4Total) step4Total.innerText = formattedSubtotal;
    };

    // Handle "Complete Booking" submission
    const completeBtn = document.getElementById('complete-booking-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', async function () {
            const form = document.getElementById('booking-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                goToStep(1); // take them back if they missed something
                return;
            }

            const roomId = form.getAttribute('data-room-id');
            const paymentMethodInput = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'hotel';
            const specialRequest = document.getElementById('specialRequest') ? document.getElementById('specialRequest').value : '';

            const data = {
                checkInDate: checkInInput.value,
                checkOutDate: checkOutInput.value,
                adultGuests: document.getElementById('adultGuests').value,
                childGuests: document.getElementById('childGuests').value,
                roomsCount: document.getElementById('roomsCount').value,
                paymentMethod: paymentMethod,
                specialRequest: specialRequest
            };

            if (paymentMethod === 'card') {
                data.cardDetails = {
                    cardNumber: document.getElementById('cardNumber') ? document.getElementById('cardNumber').value : '',
                    expiryDate: document.getElementById('expiryDate') ? document.getElementById('expiryDate').value : '',
                    cvv: document.getElementById('cvv') ? document.getElementById('cvv').value : '',
                    billingAddress: document.getElementById('billingAddress') ? document.getElementById('billingAddress').value : ''
                };
            }

            try {
                const response = await fetch(`/book/${roomId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const contentType = response.headers.get("content-type");
                if (response.ok) {
                    const result = await response.json();
                    if (result.redirectUrl) {
                        window.location.href = result.redirectUrl;
                    } else {
                        window.location.href = '/user/home'; // Fallback redirect
                    }
                } else {
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const result = await response.json();
                        alert("Booking failed: " + (result.message || "Unknown error"));
                    } else {
                        const text = await response.text();
                        alert("Booking failed with HTML/Text response. Status: " + response.status + "\n" + (text.substring(0, 100)));
                    }
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Network or script error occurred: " + error.message);
            }
        });
    }
});

