 const carousel = document.getElementById('roomCarousel');
            const track = carousel.querySelector('.carousel-track');
            const dots = document.getElementById('carouselDots');
            const cards = track.querySelectorAll('.room-card');
            
            let currentIndex = 0;
            const cardsToShow = window.innerWidth > 768 ? 3 : 1;
            const totalSlides = Math.ceil(cards.length / cardsToShow);

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.onclick = () => goToSlide(i);
                dots.appendChild(dot);
            }

            function scrollCarousel(direction) {
                currentIndex += direction;
                if (currentIndex < 0) currentIndex = 0;
                if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
                updateCarousel();
            }

            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
            }

            function updateCarousel() {
                const cardWidth = cards[0].offsetWidth + 24; // card width + gap
                const offset = -currentIndex * cardWidth * cardsToShow;
                track.style.transform = `translateX(${offset}px)`;
                
                document.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }

            document.querySelector('.scroll-indicator').addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.rooms-section').scrollIntoView({ behavior: 'smooth' });
            });

            // Trackpad Swipe Support
            let isThrottled = false;
            carousel.addEventListener('wheel', (e) => {
                // Check if scroll is primarily horizontal
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    if (!isThrottled) {
                        if (e.deltaX > 20) {
                            scrollCarousel(1);
                            isThrottled = true;
                            setTimeout(() => isThrottled = false, 500);
                        } else if (e.deltaX < -20) {
                            scrollCarousel(-1);
                            isThrottled = true;
                            setTimeout(() => isThrottled = false, 500);
                        }
                    }
                }
            }, { passive: false });