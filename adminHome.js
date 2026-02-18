function switchTab(tabId, e) {
    const targetTab = document.getElementById(tabId);
    if (!targetTab) return;

    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    targetTab.classList.add('active');
    
    if (e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    }
    
    const titles = {
        'rooms': 'Room Management',
        'reports': 'Financial Reports'
    };
    
    const titleEl = document.getElementById('tab-title');
    if (titleEl) titleEl.innerText = titles[tabId] || 'Dashboard';
}

function openEditModal(roomName, price, status, desc) {
    document.getElementById('modal-title').innerText = 'Edit Room';
    document.getElementById('room-name').value = roomName;
    document.getElementById('room-price').value = price;
    document.getElementById('room-status').value = status;
    document.getElementById('room-desc').value = desc || '';
    document.getElementById('roomModal').style.display = 'flex';
}

function openAddModal() {
    document.getElementById('modal-title').innerText = 'Add New Room';
    document.getElementById('room-name').value = '';
    document.getElementById('room-price').value = '';
    document.getElementById('room-status').value = 'Available';
    document.getElementById('room-desc').value = '';
    document.getElementById('roomModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('roomModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('roomModal');
    if (event.target == modal) {
        closeModal();
    }
}