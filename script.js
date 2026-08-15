document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle (simple version)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            // For a production app, you'd add a dedicated mobile menu drawer here.
            // For now, we simply toggle display if needed or keep it simple.
            alert('Menu mobile acionado! (Adicione uma classe para mostrar o menu drawer aqui)');
        });
    }

    // Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.animate-up, .section-zoom, .animate-signature');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Injeta o SVG da assinatura apenas quando entra na tela para a animação começar do zero
                if (entry.target.classList.contains('animate-signature') && !entry.target.hasAttribute('data-loaded')) {
                    entry.target.setAttribute('data-loaded', 'true');
                    entry.target.innerHTML = ''; // Remove o fallback de texto
                    
                    const obj = document.createElement('object');
                    obj.type = 'image/svg+xml';
                    obj.data = 'animated.svg';
                    obj.className = 'signature-svg';
                    entry.target.appendChild(obj);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Text Wave Animation (Ida e Volta)
    const waveText = document.querySelector('.text-wave');
    if (waveText) {
        const text = waveText.textContent;
        waveText.textContent = '';
        const chars = [];
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            if (char !== ' ') {
                span.classList.add('wave-char');
                chars.push({ span, index: chars.length });
            }
            waveText.appendChild(span);
        });

        const totalChars = chars.length;
        let direction = 1; // 1 = ida, -1 = volta
        
        function playWave() {
            chars.forEach(({span, index}) => {
                // Se a direção for 1 (ida), o delay cresce do início ao fim.
                // Se a direção for -1 (volta), o delay cresce do fim pro início.
                const delay = direction === 1 ? index * 0.05 : (totalChars - 1 - index) * 0.05;
                
                // Reinicia a animação para poder tocar de novo
                span.style.animation = 'none';
                void span.offsetWidth; // trigger reflow
                
                // Aplica a animação com o novo delay
                span.style.animation = `charWavePulse 0.6s ${delay}s forwards ease-in-out`;
            });
            
            // Calcula o tempo que a onda leva para atravessar todos os caracteres + a duração do bump
            const maxDelay = (totalChars - 1) * 0.05;
            const waveDuration = (maxDelay * 1000) + 600;
            
            // Ao final dessa onda, inverte a direção e agenda a próxima
            setTimeout(() => {
                direction *= -1;
                setTimeout(playWave, 800); // Pausa de 0.8s entre as ondas
            }, waveDuration);
        }
        
        // Inicia o ciclo
        playWave();
    }
});
