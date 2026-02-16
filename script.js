document.addEventListener("DOMContentLoaded", () => {
    
    // Load Navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const nav = document.getElementById('navbar-placeholder');
            if(nav) nav.innerHTML = data;
        });

    // Load Footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const foot = document.getElementById('footer-placeholder');
            if(foot) foot.innerHTML = data;
        });
});