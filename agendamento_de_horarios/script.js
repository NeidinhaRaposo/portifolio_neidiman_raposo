// Sistema de Agendamento - Hope Agenda
document.addEventListener('DOMContentLoaded', function () {

    // ===== NAVEGAÇÃO MOBILE =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ===== SCROLL SUAVE =====
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== BUSCA DINÂMICA =====
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
    }

    function performSearch(term) {
        console.log('Buscando por:', term);
        showNotification(`Buscando por: ${term}`, 'info');

        setTimeout(() => {
            showNotification('Encontramos 15 estabelecimentos para você!', 'success');
        }, 1000);
    }

    // ===== CATEGORIAS INTERATIVAS =====
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            filterByCategory(category, this);
        });
    });

    function filterByCategory(category, clickedCard) {
        categoryCards.forEach(card => card.classList.remove('selected'));

        if (clickedCard) {
            clickedCard.classList.add('selected');
        }

        showNotification(`Filtrando por: ${category}`, 'info');

        setTimeout(() => {
            showNotification(`Mostrando estabelecimentos de ${category}`, 'success');
        }, 500);
    }

    // ===== BOTÕES DE LOGIN E CADASTRO =====
    const entrarBtn = document.querySelector('.nav-buttons .btn-outline');
    const cadastrarBtn = document.querySelector('.nav-buttons .btn-primary');

    if (entrarBtn && entrarBtn.textContent.includes('Entrar')) {
        entrarBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openLoginModal();
        });
    }

    if (cadastrarBtn && cadastrarBtn.textContent.includes('Cadastrar')) {
        cadastrarBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openRegisterModal();
        });
    }

    // ===== BOTÕES DE AGENDAMENTO =====
    const agendarButtons = document.querySelectorAll('.btn-primary');

    agendarButtons.forEach(button => {
        if (button.textContent.includes('Agendar')) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const businessCard = this.closest('.business-card');
                const businessName = businessCard.querySelector('h3').textContent;

                openBookingModal(businessName);
            });
        }
    });

    // ===== MODAL DE LOGIN =====
    function openLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Entrar na sua conta</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form class="booking-form" id="loginForm">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" required placeholder="seu@email.com">
                            </div>
                            <div class="form-group">
                                <label>Senha</label>
                                <input type="password" required placeholder="Digite sua senha">
                            </div>
                            <div class="form-group" style="flex-direction: row; justify-content: space-between; align-items: center;">
                                <label style="margin: 0;">
                                    <input type="checkbox" style="width: auto; margin-right: 8px;"> Lembrar-me
                                </label>
                                <a href="#" style="color: #EF9A9A; text-decoration: none; font-size: 14px;">Esqueci minha senha</a>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline modal-cancel">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Entrar</button>
                            </div>
                            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(239, 154, 154, 0.18);">
                                <p style="color: #D6B8C1; margin: 0;">Não tem uma conta? <a href="#" id="switchToRegister" style="color: #EF9A9A; text-decoration: none; font-weight: 500;">Cadastre-se</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const overlay = modal.querySelector('.modal-overlay');

        function closeModal() {
            modal.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        const form = modal.querySelector('#loginForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(form)) {
                showNotification('Entrando...', 'info');

                setTimeout(() => {
                    closeModal();
                    showNotification('Login realizado com sucesso! Bem-vindo de volta!', 'success');
                }, 1500);
            }
        });

        const switchToRegister = modal.querySelector('#switchToRegister');
        switchToRegister.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
            setTimeout(() => {
                openRegisterModal();
            }, 300);
        });
    }

    // ===== MODAL DE CADASTRO =====
    function openRegisterModal() {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Criar uma conta</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form class="booking-form" id="registerForm">
                            <div class="form-group">
                                <label>Nome completo</label>
                                <input type="text" required placeholder="Seu nome completo">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" required placeholder="seu@email.com">
                            </div>
                            <div class="form-group">
                                <label>Telefone</label>
                                <input type="tel" required placeholder="(00) 00000-0000">
                            </div>
                            <div class="form-group">
                                <label>Senha</label>
                                <input type="password" required placeholder="Mínimo 8 caracteres" minlength="8">
                            </div>
                            <div class="form-group">
                                <label>Confirmar senha</label>
                                <input type="password" required placeholder="Digite a senha novamente">
                            </div>
                            <div class="form-group" style="flex-direction: row; align-items: flex-start;">
                                <input type="checkbox" required style="width: auto; margin-right: 8px; margin-top: 4px;">
                                <label style="margin: 0; font-size: 14px; color: #F2DADA;">Concordo com os <a href="#" style="color: #EF9A9A;">termos de uso</a> e <a href="#" style="color: #EF9A9A;">política de privacidade</a></label>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline modal-cancel">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Cadastrar</button>
                            </div>
                            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(239, 154, 154, 0.18);">
                                <p style="color: #D6B8C1; margin: 0;">Já tem uma conta? <a href="#" id="switchToLogin" style="color: #EF9A9A; text-decoration: none; font-weight: 500;">Entrar</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const phoneInput = modal.querySelector('input[type="tel"]');
        if (phoneInput) {
            applyPhoneMask(phoneInput);
        }

        const passwordInput = modal.querySelector('input[type="password"][placeholder*="Mínimo"]');
        const confirmPasswordInput = modal.querySelector('input[type="password"][placeholder*="Digite a senha"]');

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', function () {
                if (passwordInput.value !== this.value) {
                    this.classList.add('error');
                    showNotification('As senhas não coincidem!', 'error');
                } else {
                    this.classList.remove('error');
                }
            });
        }

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const overlay = modal.querySelector('.modal-overlay');

        function closeModal() {
            modal.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        const form = modal.querySelector('#registerForm');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (passwordInput.value !== confirmPasswordInput.value) {
                showNotification('As senhas não coincidem!', 'error');
                return;
            }

            if (validateForm(form)) {
                showNotification('Criando sua conta...', 'info');

                setTimeout(() => {
                    closeModal();
                    showNotification('Conta criada com sucesso! Bem-vindo ao Hope Agenda!', 'success');
                }, 1500);
            }
        });

        const switchToLogin = modal.querySelector('#switchToLogin');
        switchToLogin.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
            setTimeout(() => {
                openLoginModal();
            }, 300);
        });
    }

    // ===== MODAL DE AGENDAMENTO =====
    function openBookingModal(businessName) {
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Agendar - ${businessName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form class="booking-form">
                            <div class="form-group">
                                <label>Serviço</label>
                                <select required>
                                    <option value="">Selecione um serviço</option>
                                    <option value="consulta">Consulta</option>
                                    <option value="exame">Exame</option>
                                    <option value="procedimento">Procedimento</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data</label>
                                <input type="date" required>
                            </div>
                            <div class="form-group">
                                <label>Horário</label>
                                <select required>
                                    <option value="">Selecione um horário</option>
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Nome completo</label>
                                <input type="text" required>
                            </div>
                            <div class="form-group">
                                <label>Telefone</label>
                                <input type="tel" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" required>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline modal-cancel">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Confirmar Agendamento</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const phoneInput = modal.querySelector('input[type="tel"]');
        if (phoneInput) {
            applyPhoneMask(phoneInput);
        }

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const overlay = modal.querySelector('.modal-overlay');

        function closeModal() {
            modal.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        const form = modal.querySelector('.booking-form');
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm(form)) {
                showNotification('Processando agendamento...', 'info');

                setTimeout(() => {
                    closeModal();
                    showNotification('Agendamento confirmado! Você receberá um email de confirmação.', 'success');
                }, 1500);
            }
        });
    }

    // ===== NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // ===== ANIMAÇÕES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.category-card, .business-card, .step-card, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ===== TESTEMUNHOS AUTOMÁTICOS =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    function rotateTestimonials() {
        testimonialCards.forEach((card, index) => {
            card.style.opacity = index === currentTestimonial ? '1' : '0.6';
            card.style.transform = index === currentTestimonial ? 'scale(1.03)' : 'scale(1)';
        });

        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }

    if (testimonialCards.length > 1) {
        setInterval(rotateTestimonials, 5000);
    }

    // ===== VALIDAÇÃO DE FORMULÁRIOS =====
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // ===== MÁSCARA DE TELEFONE =====
    function applyPhoneMask(input) {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            value = value.replace(/(-\d{4})\d+?$/, '$1');
            e.target.value = value;
        });
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(applyPhoneMask);

    // ===== LAZY LOADING DE IMAGENS =====
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ===== BOTÃO VOLTAR AO TOPO =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log('Hope Agenda - Sistema de Agendamento carregado com sucesso!');

    setTimeout(() => {
        showNotification('Bem-vindo ao Hope Agenda! Encontre e agende seus serviços favoritos.', 'success');
    }, 1000);
});

// ===== ESTILOS ADICIONAIS VIA CSS =====
const additionalStyles = `
    .booking-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-overlay {
        position: absolute;
        inset: 0;
        background: rgba(12, 10, 34, 0.65);
        backdrop-filter: blur(6px);
    }

    .modal-content {
        background: linear-gradient(180deg, #2B245F 0%, #231B52 100%);
        border: 1px solid rgba(239, 154, 154, 0.22);
        border-radius: 18px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.45);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 1px solid rgba(239, 154, 154, 0.16);
    }

    .modal-header h3 {
        margin: 0;
        color: #FFF7F7;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #D6B8C1;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .modal-close:hover {
        background: rgba(239, 154, 154, 0.14);
        color: #FFF7F7;
    }

    .modal-body {
        padding: 24px;
    }

    .booking-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        font-weight: 500;
        color: #F2DADA;
    }

    .form-group input,
    .form-group select {
        padding: 12px;
        background: rgba(255, 247, 247, 0.05);
        border: 2px solid rgba(239, 154, 154, 0.14);
        border-radius: 10px;
        font-size: 16px;
        color: #FFF7F7;
        transition: all 0.3s ease;
    }

    .form-group input::placeholder {
        color: #D6B8C1;
    }

    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: #EF9A9A;
        box-shadow: 0 0 0 3px rgba(239, 154, 154, 0.14);
    }

    .form-group input.error,
    .form-group select.error {
        border-color: #F23A32;
    }

    .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(180deg, #2B245F 0%, #231B52 100%);
        border: 1px solid rgba(239, 154, 154, 0.18);
        border-radius: 14px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
        padding: 16px 20px;
        max-width: 400px;
        z-index: 10001;
        transform: translateX(100%);
        transition: all 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .notification-message {
        color: #FFF7F7;
        font-weight: 500;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #D6B8C1;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .notification-close:hover {
        background: rgba(239, 154, 154, 0.14);
        color: #FFF7F7;
    }

    .notification-info {
        border-left: 4px solid #EF9A9A;
    }

    .notification-success {
        border-left: 4px solid #F23A32;
    }

    .notification-error {
        border-left: 4px solid #A1054D;
    }

    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #F23A32, #A1054D);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 10px 20px rgba(161, 5, 77, 0.28);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        z-index: 1000;
    }

    .back-to-top.show {
        opacity: 1;
        transform: translateY(0);
    }

    .back-to-top:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 24px rgba(161, 5, 77, 0.35);
    }

    .category-card,
    .business-card,
    .step-card,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .category-card.animate-in,
    .business-card.animate-in,
    .step-card.animate-in,
    .testimonial-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .header.scrolled {
        background: rgba(20, 16, 53, 0.97);
        box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
    }

    .category-card.selected {
        border-color: rgba(239, 154, 154, 0.5);
        background: linear-gradient(180deg, rgba(56, 35, 90, 1), rgba(161, 5, 77, 0.28));
        box-shadow: 0 0 24px rgba(161, 5, 77, 0.18);
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 20px;
        }

        .form-actions {
            flex-direction: column;
        }

        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);