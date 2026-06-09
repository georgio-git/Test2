// Initialize Three.js Scene
let scene, camera, renderer, geometry, material, mesh;
let mouseX = 0, mouseY = 0;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create 3D objects
    const geometries = [
        new THREE.IcosahedronGeometry(1, 4),
        new THREE.TorusGeometry(1, 0.4, 16, 100),
        new THREE.OctahedronGeometry(1, 2)
    ];
    
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xe8b923, emissive: 0x332200 }),
        new THREE.MeshPhongMaterial({ color: 0x0f3460, emissive: 0x001a33 }),
        new THREE.MeshPhongMaterial({ color: 0x16213e, emissive: 0x000d1a })
    ];
    
    geometries.forEach((geometry, index) => {
        const material = materials[index];
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (index - 1) * 3;
        mesh.position.y = Math.sin(index) * 2;
        mesh.castShadow = true;
        scene.add(mesh);
    });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xe8b923, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x0f3460, 0.5);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);
    
    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    animate();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate meshes
    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.003;
            child.rotation.y += 0.005;
            child.position.y += Math.sin(Date.now() * 0.001) * 0.001;
        }
    });
    
    // Camera follow mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Scroll animations with GSAP
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Service cards animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services',
            start: 'top center',
            end: 'bottom center',
            markers: false
        },
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1
    });
    
    // Portfolio items animation
    gsap.from('.portfolio-item', {
        scrollTrigger: {
            trigger: '.portfolio',
            start: 'top center',
            end: 'bottom center',
            markers: false
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.15,
        duration: 1
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.from(stat, {
            scrollTrigger: {
                trigger: '.stats',
                start: 'top center'
            },
            textContent: 0,
            duration: 2,
            snap: { textContent: 1 },
            onUpdate: function() {
                stat.textContent = Math.ceil(gsap.getProperty(stat, 'textContent'));
            }
        });
    });
    
    // Contact form animation
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            end: 'bottom center'
        },
        opacity: 0,
        x: 50,
        duration: 1
    });
    
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            end: 'bottom center'
        },
        opacity: 0,
        x: -50,
        duration: 1
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// CTA Button interaction
function initCTAButtons() {
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        });
    });
}

// Form submission
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize everything on page load
window.addEventListener('load', () => {
    initThreeJS();
    initScrollAnimations();
    initMobileMenu();
    initCTAButtons();
    initContactForm();
    initSmoothScroll();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
});