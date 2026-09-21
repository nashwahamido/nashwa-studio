(function() {
                const canvas = document.getElementById('particle-canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                function resizeCanvas() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;

                    console.log ("resized", canvas.width);
                    //animate();

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
                
                // Start animation
                animate();
            })();
           
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
          
            // Wait for DOM to be fully loaded
            document.addEventListener('DOMContentLoaded', function() {
                const form = document.getElementById('contact-form');
                const successMessage = document.getElementById('success-message');
                const sendAnotherBtn = document.getElementById('send-another');
                
                console.log('Form script loaded');
                
                // Form submission handler
                if (form) {
                    form.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log('Form submitted');
                        
                        const formData = new FormData(form);
                        const submitButton = form.querySelector('button[type="submit"]');
                        const originalText = submitButton.textContent;
                        
                        // Show loading state
                        submitButton.textContent = 'Sending...';
                        submitButton.disabled = true;
                        
                        try {
                            const response = await fetch('https://api.web3forms.com/submit', {
                                method: 'POST',
                                body: formData
                            });
                            
                            const data = await response.json();
                            console.log('Response:', data);
                            
                            if (data.success) {
                                // Hide form and show success message
                                form.style.display = 'none';
                                successMessage.style.display = 'block';
                                
                                // Trigger confetti
                                createConfetti();
                                
                                // Reset form
                                form.reset();
                            } else {
                                alert('Oops! Something went wrong. Please try again.');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            alert('Oops! Something went wrong. Please try again.');
                        } finally {
                            // Reset button
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }
                        
                        return false;
                    });
                }
                
                // Send another message button
                if (sendAnotherBtn) {
                    sendAnotherBtn.addEventListener('click', function() {
                        // Hide success message and show form
                        successMessage.style.display = 'none';
                        form.style.display = 'flex';
                    });
                }
                
                // Confetti animation function
                function createConfetti() {
                    const colors = ['#ea7d6d', '#fdcd00', '#ea7d6d', '#fdcd00']; // Coral and yellow
                    const confettiCount = 150;
                    const confettiElements = [];
                    
                    for (let i = 0; i < confettiCount; i++) {
                        const confetti = document.createElement('div');
                        confetti.className = 'confetti';
                        confetti.style.left = Math.random() * 100 + '%';
                        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        confetti.style.animationDelay = Math.random() * 0.5 + 's';
                        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                        document.body.appendChild(confetti);
                        confettiElements.push(confetti);
                    }
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confettiElements.forEach(el => el.remove());
                    }, 5000);
                }
            });
        