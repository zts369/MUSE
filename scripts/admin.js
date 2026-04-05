function openAddModal() {
    document.getElementById('modal-title').innerText = 'Add New Room';
    document.getElementById('roomForm').action = '/admin/rooms/add';

    document.getElementById('room-name').value = '';
    document.getElementById('room-category').value = 'room';
    document.getElementById('room-price').value = '';
    document.getElementById('room-available').value = 'true';
    document.getElementById('room-sqm').value = '';
    document.getElementById('room-maxguests').value = '';
    document.getElementById('room-beds').value = '';
    document.getElementById('room-bath').value = '';
    document.getElementById('room-desc').value = '';
    document.getElementById('room-longerdesc').value = '';
    document.getElementById('room-amenities').value = '';
    document.getElementById('room-images').value = '';

    document.getElementById('roomModal').style.display = 'flex';
}

function openEditModal(btn) {
    const d = btn.dataset;

    document.getElementById('modal-title').innerText = 'Edit Room';
    document.getElementById('roomForm').action = '/admin/rooms/edit/' + d.mongoid;

    document.getElementById('room-name').value = d.name || '';
    document.getElementById('room-category').value = d.category || 'room';
    document.getElementById('room-price').value = d.price || '';
    document.getElementById('room-available').value = d.available === 'true' ? 'true' : 'false';
    document.getElementById('room-sqm').value = d.sqm || '';
    document.getElementById('room-maxguests').value = d.maxguests || '';
    document.getElementById('room-beds').value = d.beds || '';
    document.getElementById('room-bath').value = d.bath || '';
    document.getElementById('room-desc').value = d.description || '';
    document.getElementById('room-longerdesc').value = d.longer || '';
    document.getElementById('room-amenities').value = d.amenities || '';
    document.getElementById('room-images').value = (d.images || '').replace(/,/g, '\n');

    document.getElementById('roomModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('roomModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('roomModal');
    if (event.target === modal) {
        closeModal();
    }
});
