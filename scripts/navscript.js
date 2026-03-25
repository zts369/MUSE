document.addEventListener("DOMContentLoaded", () => {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navPlaceholder = document.getElementById('nav-placeholder');
            if (navPlaceholder) {
                navPlaceholder.innerHTML = data;
                highlightActivePage();
            }
        });
});

function highlightActivePage() {
    // Get the current page filename (e.g., "index.html")
    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    
    const navLinks = document.querySelectorAll('.nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}