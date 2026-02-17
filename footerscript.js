document.addEventListener("DOMContentLoaded", () => {

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const foot = document.getElementById('footer-placeholder');
            if(foot) foot.innerHTML = data;
        });
});