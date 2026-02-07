document.addEventListener("DOMContentLoaded", () => {
    const filterLinks = document.querySelectorAll(".room-nav a");
    const roomItems = document.querySelectorAll(".room-item");

    filterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // 1. Update active tab UI
            filterLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // 2. Filter logic
            const filterValue = link.getAttribute("data-filter");

            roomItems.forEach(item => {
                const category = item.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});