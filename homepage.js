// ============================================
// HOMEPAGE JAVASCRIPT
// ============================================

// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

// Check if user has visited before using cookies
const hasVisitedBefore = getCookie('hasVisitedHomepage');

if (hasVisitedBefore) {
    // Skip loading screen for returning visitors
    document.body.classList.remove('loading');
    document.getElementById('loading-screen').style.display = 'none';
    
    // Start page animations immediately
    setTimeout(() => {
        startPageAnimations();
    }, 100);
} else {
    // First-time visitor - show loading screen
    // Set cookie to expire in 30 days
    setCookie('hasVisitedHomepage', 'true', 30);
    
    // Loading animation
    let blendEases = (startEase, endEase, blender) => {
        var s = gsap.parseEase(startEase),
            e = gsap.parseEase(endEase),
            blender = gsap.parseEase(blender || "power3.inOut");
        return function(v) {
            var b = blender(v);
            return s(v) * (1 - b) + e(v) * b;
        };
    }
    
    gsap.set('#loading-svg', {
        visibility: 'visible'
    });
    
    let loadingTl = gsap.timeline({
        repeat: 0, // No repeat - single cycle for 2 seconds total
        onComplete: function() {
            // Fade out loading screen
            document.getElementById('loading-screen').classList.add('fade-out');
            
            // Show main content
            document.body.classList.remove('loading');
            
            // Remove loading screen after fade completes
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
            
            // Start all CSS animations immediately after loading screen fades
            setTimeout(() => {
                startPageAnimations();
            }, 100);
        }
    });
    
    loadingTl.to('#leader', {
        duration: 4,
        x: 36*3,
        ease: blendEases('circ.in', 'expo')
    })
    .to('.follower', {
        duration: 2,
        svgOrigin: gsap.utils.wrap(['328 300', '364 300', '400 300', '436 300', '472 300']),
        rotation: -180,
        stagger: {
            amount: 2
        },
        ease: blendEases('circ.in', 'expo')
    }, 0)
    .to('#whole', {
        x: 36,
        duration: 5,
        ease: 'linear',
    }, 0)
    .to('.follower', {
        duration: 1.5,
        stagger: {
            amount: 1,
            repeat: 1,
            yoyo: true
        },
        ease: blendEases('power3.in', 'expo'),
        fillOpacity: 0
    }, 0);
    
    // Adjust timeScale to make total duration ~2 seconds
    loadingTl.timeScale(2.5);
}

// Function to start all page animations
function startPageAnimations() {
    // Add animate class to all elements that need to animate
    document.querySelector('.salutation').classList.add('animate');
    document.querySelector('.name').classList.add('animate');
    document.querySelector('.title').classList.add('animate');
    document.querySelector('.description').classList.add('animate');
    document.querySelector('.cta').classList.add('animate');
    document.querySelector('.upperbackground').classList.add('animate');
    document.querySelector('.girlplayinggames').classList.add('animate');
    document.querySelector('.bottombackground').classList.add('animate');
    
    // Start name looping after name animation completes
    // Name animation: 0.3s delay + 1.2s duration = 1.5s
    // Add small buffer of 0.2s = 1.7s total
    setTimeout(() => {
        startNameLoop();
    }, 1700);
}

// ============================================
// TEXT LOOPING EFFECT
// ============================================

let nameLoopTimeline;

function startNameLoop() {
  const wordList = document.querySelector('[data-looping-words-list]');
  const words = Array.from(wordList.children);
  const totalWords = words.length;
  const wordHeight = 100 / totalWords;
  let currentIndex = 0;

  function moveWords() {
    currentIndex++;

    gsap.to(wordList, {
      yPercent: -wordHeight * currentIndex,
      duration: 1.2,
      ease: 'elastic.out(1, 0.85)',
      onComplete: function() {
        if (currentIndex >= totalWords - 1) {
          wordList.appendChild(wordList.children[0]);
          currentIndex--;
          gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
          words.push(words.shift());
        }
      }
    });
  }

  // Start looping with initial delay
  nameLoopTimeline = gsap.timeline({ repeat: -1, delay: 1 })
    .call(moveWords)
    .to({}, { duration: 2 })
    .repeat(-1);
}

// ============================================
// INTERACTIVE PARTICLE BACKGROUND
// ============================================

(function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system (Space Effect)
    const particles = [];
    const particleCount = 150; // Increased particle count
    const mouse = { x: null, y: null, radius: 100 }; // Decreased mouse radius for more subtle interaction
    
    // Track mouse position
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.2; // Slower movement
            this.vy = (Math.random() - 0.5) * 0.2; // Slower movement
            this.size = Math.random() * 1.5 + 0.5; // Smaller size for star effect
        }
        
        update() {
            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.vx -= Math.cos(angle) * force * 0.2;
                    this.vy -= Math.sin(angle) * force * 0.2;
                }
            }
            
            // Apply velocity
            this.x += this.vx;
            this.y += this.vy;
            
            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            // Keep within bounds
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
        }
        
        draw() {
            // Star-like color (Yellow #fdcd00)
            ctx.fillStyle = 'rgba(253, 205, 0, 0.8)'; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) { // Shorter connection distance
                    const opacity = (1 - distance / 80) * 0.15; // Lower opacity for subtle lines
                    ctx.strokeStyle = `rgba(234, 125, 109, ${opacity})`; // Coral #ea7d6d lines
                    ctx.lineWidth = 0.5; // Thinner lines
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Start animation after loading screen
    setTimeout(() => {
        animate();
    }, 100);
})();

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================

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
