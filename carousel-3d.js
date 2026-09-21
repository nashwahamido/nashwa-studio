// 3D Carousel JavaScript
// Dark/Light Mode Toggle Script
   (function() {
       const themeCheckbox = document.getElementById('theme-checkbox');
       const body = document.body;
       
       // Check for saved theme preference
       const savedTheme = localStorage.getItem('theme');
       if (savedTheme === 'light') {
           body.classList.add('light-mode');
           themeCheckbox.checked = true;
       }
       
       // Toggle theme on checkbox change
       themeCheckbox.addEventListener('change', function() {
           body.classList.toggle('light-mode');
           
           // Save preference
           if (body.classList.contains('light-mode')) {
               localStorage.setItem('theme', 'light');
           } else {
               localStorage.setItem('theme', 'dark');
           }
       });
   })();
(function() {
    const carousel = document.getElementById('carousel-3d');
    const items = document.querySelectorAll('.carousel-3d-item');
    const prevBtn = document.querySelector('.carousel-3d-prev');
    const nextBtn = document.querySelector('.carousel-3d-next');
    const dots = document.querySelectorAll('.carousel-3d-dot');
    
    let currentIndex = 0;
    const totalItems = items.length;
    
    // Function to update carousel positions and classes
    function updateCarousel() {
        items.forEach((item, index) => {
            // Remove all position classes
            item.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');
            
            // Calculate position relative to current index
            let position = index - currentIndex;
            
            
            if (position < -Math.floor(totalItems / 2)) {
                position += totalItems;
            } else if (position > Math.ceil(totalItems / 2)) {
                position -= totalItems;
            }
            
            
            if (position === 0) {
                item.classList.add('active');
            } else if (position === -1) {
                item.classList.add('prev');
            } else if (position === 1) {
                item.classList.add('next');
            } else if (position < -1) {
                item.classList.add('hidden-left');
            } else if (position > 1) {
                item.classList.add('hidden-right');
            }
        });
        
        // navigation dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Navigate to previous item
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }
    
    // Navigate to next item
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }
    
    // Navigate to specific item
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Initialize carousel
    updateCarousel();
})();
