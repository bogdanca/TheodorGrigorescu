
// Album Data Configuration
const albums = {
    'streetphotography': {
        title: 'Street Photography',
        cover: 'assets/cover_streetphotography.png',
        images: [
            'assets/streetphotography/1.jpg',
            'assets/streetphotography/2.jpg',
            'assets/streetphotography/3.jpg',
            'assets/streetphotography/4.jpg',
            'assets/streetphotography/5.jpg',
            'assets/streetphotography/6.jpg'
        ]
    },
    'analogue': {
        title: 'Analogue',
        cover: 'assets/cover_analogue.png',
        images: [
            'assets/analogue/1.jpg',
            'assets/analogue/2.jpg',
            'assets/analogue/3.jpg',
            'assets/analogue/4.jpg'
        ]
    },
    'projects': {
        title: 'Projects',
        cover: 'assets/cover_projects.png',
        images: [
            'assets/projects/1.jpg',
            'assets/projects/2.jpg',
            'assets/projects/5.jpg' // Correction based on actual file '5.jpg' instead of '3.jpg'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const path = window.location.pathname;

    // HOME PAGE LOGIC (if we are on index.html or root)
    if (path.endsWith('index.html') || path.endsWith('/')) {
        renderHomeAlbums();
    }

    // ALBUM PAGE LOGIC
    if (path.includes('album.html')) {
        renderAlbumPage();
        setupLightbox();
    }

    // CONTACT PAGE LOGIC
    if (path.includes('contact.html')) {
        setupContactButtons();
    }
});

function renderHomeAlbums() {
    const grid = document.querySelector('.album-grid');
    if (!grid) return;

    // Clear existing (if any)
    grid.innerHTML = '';

    // Order: Street Photography, Analogue, Projects
    const order = ['streetphotography', 'analogue', 'projects'];

    order.forEach(id => {
        const album = albums[id];
        const card = document.createElement('div');
        card.className = 'album-card';
        card.onclick = () => window.location.href = `album.html?id=${id}`;

        card.innerHTML = `
            <img src="${album.cover}" alt="${album.title}" class="album-cover">
            <h2 class="album-title">${album.title}</h2>
        `;
        grid.appendChild(card);
    });
}

function renderAlbumPage() {
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('id');
    const album = albums[albumId];

    if (!album) {
        document.querySelector('main').innerHTML = '<h2>Album not found</h2>';
        return;
    }

    // Set Title
    document.getElementById('album-title').textContent = album.title;

    // Render Images
    const grid = document.querySelector('.photo-grid');
    if (grid) {
        grid.innerHTML = ''; // Clear current content just in case
        album.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'photo-item';
            img.loading = 'lazy';
            img.alt = `${album.title} Photograph`;

            // Add click for lightbox
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(imgSrc));

            grid.appendChild(img);
        });
    }
}

// Lightbox Logic
function setupLightbox() {
    // Create lightbox DOM if not exists
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <img src="" alt="Full View" class="lightbox-img">
        `;
        document.body.appendChild(lightbox);

        // Close events
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
}

function openLightbox(src) {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('.lightbox-img');
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function setupContactButtons() {
    const emailBtn = document.getElementById('btn-email');
    const phoneBtn = document.getElementById('btn-phone');

    // Email Logic
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Simple de-obfuscation
            const user = 'theogrigorescu.photo';
            const domain = 'gmail.com';
            const email = `${user}@${domain}`;

            emailBtn.textContent = email;
            emailBtn.classList.add('revealed-email');
            window.location.href = `mailto:${email}`;
        });
    }

    // Phone Logic
    if (phoneBtn) {
        phoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const number = '+40 0733 767 659';
            const cleanNumber = '+400733767659';
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

            if (isMobile) {
                window.location.href = `tel:${cleanNumber}`;
            } else {
                phoneBtn.textContent = number;
            }
        });
    }
}
