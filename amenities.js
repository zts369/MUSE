document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Find the parent card of the clicked arrow
        const currentCard = this.closest('.card');
        
        // Toggle the 'active' class
        currentCard.classList.toggle('active');
    });
});