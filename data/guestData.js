// guestData.js
const guestDataStore = {
    "Jonathan Loughran": {
        email: "jonathan@human.com",
        phone: "0917-123-4567",
        bookings: [
            // Active
            { id: "HT-1001", room: "Moonlight Room", in: "2026-02-20", out: "2026-02-22", adults: 2, children: 0, total: 2000, status: "Reserved" },
            { id: "HT-1004", room: "Lunar Delux Suite", in: "2026-02-20", out: "2026-05-22", adults: 4, children: 2, total: 18900, status: "Reserved" },
            // Past (History)
            { id: "HT-0950", room: "Twilight Cozy Room", in: "2025-12-10", out: "2025-12-12", adults: 2, children: 1, total: 3200, status: "Checked-Out" },
            { id: "HT-0820", room: "Starlight Room", in: "2025-10-01", out: "2025-10-05", adults: 4, children: 0, total: 4200, status: "Checked-Out" }
        ]
    },
    "Iren Phillin Ding": {
        email: "iren@human.com",
        phone: "0917-123-4567",
        bookings: [
            { id: "HT-2001", room: "Moonlight Room", in: "2026-02-21", out: "2026-02-22", adults: 2, children: 0, total: 2000, status: "Reserved" },
            { id: "HT-1050", room: "Lunar Deluxe Suite", in: "2025-11-21", out: "2025-11-23", adults: 4, children: 2, total: 18900, status: "Checked-Out" }
        ]
    },
    "Arisha Beri": {
        email: "arishaberi@human.com",
        phone: "0917-123-4567",
        bookings: [
            { id: "HT-3001", room: "Moonlight Room", in: "2026-02-22", out: "2026-02-24", adults: 2, children: 0, total: 2000, status: "Reserved" },
            { id: "HT-0901", room: "Lunar Deluxe Suite", in: "2025-08-15", out: "2025-08-20", adults: 2, children: 0, total: 18900, status: "Checked-Out" }
        ]
    },
    "Jason Derulo": {
        email: "jason@human.com",
        phone: "0917-123-4567",
        bookings: [
            { id: "HT-4001", room: "Moonlight Room", in: "2026-02-20", out: "2026-02-22", adults: 2, children: 0, total: 2000, status: "Reserved" }
        ]
    },
    "Zhupin Sio": {
        email: "zhupin@human.com",
        phone: "0917-123-4567",
        bookings: [
            { id: "HT-5001", room: "Moonlight Room", in: "2026-02-20", out: "2026-02-22", adults: 2, children: 0, total: 2000, status: "Reserved" }
        ]
    }
};