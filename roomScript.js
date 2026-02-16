document.addEventListener("DOMContentLoaded", () => {
    const filterLinks = document.querySelectorAll(".room-nav a");
    // Change this selector to target the link wrappers
    const roomWrappers = document.querySelectorAll(".room-list-btn"); 

    filterLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            filterLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const filterValue = link.getAttribute("data-filter");

            roomWrappers.forEach(wrapper => {
                // Look inside the wrapper to find the category from the .room-item
                const item = wrapper.querySelector(".room-item");
                const category = item.getAttribute("data-category");

                if (filterValue === "all" || category === filterValue) {
                    wrapper.style.display = "block"; // Show the whole link
                } else {
                    wrapper.style.display = "none";  // Hide the whole link
                }
            });
        });
    });
});