document.addEventListener('DOMContentLoaded', () => {
    const filterLinks = document.querySelectorAll('.room-nav a');
    const roomItems = document.querySelectorAll('.room-list > a'); // Selecting the anchor tags that wrap your items

    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Update Active State in UI
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const filterValue = link.getAttribute('data-filter');

            // 2. Filter the rooms
            roomItems.forEach(item => {
                // We look for the room-item div inside the anchor to check the category
                const category = item.querySelector('.room-item').getAttribute('data-category');

                if (filterValue === 'all') {
                    item.style.display = 'block';
                } else if (category === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});