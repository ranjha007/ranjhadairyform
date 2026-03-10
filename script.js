// script.js
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let theme = 'light';
        
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
        
        localStorage.setItem('theme', theme);
    });

    // --- 3D Interactive Background Canvas ---
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return; // Guard clause if canvas is missing
    const ctx = canvas.getContext('2d');

    let particlesArray;
    
    // Mouse tracking for parallax
    let mouse = {
        x: null,
        y: null,
        radius: 150
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Make canvas fill screen
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', function() {
        initCanvas();
        initParticles();
    });

    // Particle Object
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            // Check theme to draw either dark or light particles
            if(document.body.classList.contains('dark-mode')) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            } else {
                 ctx.fillStyle = 'rgba(37, 99, 235, 0.06)'; // primary color faded
            }
            ctx.fill();
        }

        update() {
            // Check collision with mouse for 3D bounce/parallax effect
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                // Move away from mouse
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Gently drift back to normal pace and handle screen edges
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }

            // Normal drifting
            this.x += this.directionX;
            this.y += this.directionY;
            this.baseX += this.directionX;
            this.baseY += this.directionY;

            // Reset particles if they drift off screen fully
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
               this.x = Math.random() * canvas.width;
               this.y = canvas.height + this.size; // Reset to bottom
               this.baseX = this.x;
               this.baseY = this.y;
            }

            this.draw();
        }
    }

    // Create particle array
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 20) + 5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2; // slow drift
            let directionY = (Math.random() * -1) - 0.2;  // drift upwards
            let color = 'rgba(37, 99, 235, 0.05)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    // Start background animation
    initCanvas();
    initParticles();
    animate();
});
