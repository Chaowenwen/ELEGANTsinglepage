// 导航栏滚动效果
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Vue 应用初始化
    const app = new Vue({
        el: '#app',
        data: {
            showForm: false,
            formData: {
                name: '',
                email: '',
                destination: '',
                travelDate: '',
                message: ''
            },
            errors: {},
            destinations: [
                { value: 'europe', label: 'Europe' },
                { value: 'asia', label: 'Asia' },
                { value: 'africa', label: 'Africa' },
                { value: 'americas', label: 'Americas' }
            ]
        },
        methods: {
            toggleForm() {
                console.log('Toggle form clicked, current showForm:', this.showForm);
                this.showForm = !this.showForm;
                console.log('New showForm value:', this.showForm);
                // 强制更新DOM
                this.$forceUpdate();
            },
            submitForm() {
                console.log('Form submitted');
                this.errors = {};
                
                if (!this.formData.name) {
                    this.errors.name = '请输入您的姓名';
                }
                
                if (!this.formData.email) {
                    this.errors.email = '请输入您的邮箱';
                } else if (!this.validateEmail(this.formData.email)) {
                    this.errors.email = '请输入有效的邮箱地址';
                }
                
                if (!this.formData.destination) {
                    this.errors.destination = '请选择目的地';
                }
                
                if (!this.formData.travelDate) {
                    this.errors.travelDate = '请选择旅行日期';
                }
                
                if (Object.keys(this.errors).length === 0) {
                    console.log('表单数据：', this.formData);
                    this.showForm = false;
                    this.resetForm();
                }
            },
            cancelForm() {
                console.log('Form cancelled');
                this.showForm = false;
                this.resetForm();
            },
            resetForm() {
                this.formData = {
                    name: '',
                    email: '',
                    destination: '',
                    travelDate: '',
                    message: ''
                };
                this.errors = {};
            },
            validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }
        },
        mounted() {
            console.log('Vue instance mounted');
            // 确保表单初始状态为隐藏
            this.showForm = false;
        }
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hero Carousel Functionality
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let autoSlideInterval;
    const totalItems = items.length;
    
    // Initialize carousel
    function initCarousel() {
        if (items.length > 0) {
            items[currentIndex].classList.add('active');
            startAutoSlide();
        }
    }
    
    // Show specific slide
    function showSlide(index) {
        items.forEach(item => item.classList.remove('active'));
        currentIndex = (index + totalItems) % totalItems;
        items[currentIndex].classList.add('active');
    }
    
    // Navigation functions
    function prevSlide() {
        showSlide(currentIndex - 1);
        resetAutoSlide();
    }
    
    function nextSlide() {
        showSlide(currentIndex + 1);
        resetAutoSlide();
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        autoSlideInterval = setInterval(nextSlide, 6000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners for carousel controls
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
        });
    }
    
    // Initialize carousel
    initCarousel();

    // 初始化其他功能
    try {
        initializeDestinationSearch();
        initializeAccordion();
        initializeStoryPanels();
    } catch (error) {
        console.warn('Some features could not be initialized:', error);
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 初始化目的地搜索功能
function initializeDestinationSearch() {
    const searchInput = document.getElementById('destination-search');
    const confirmBtn = document.getElementById('confirm-search');
    const backBtn = document.getElementById('back-button');
    const cards = document.querySelectorAll('.destination-card');
    const expandBtn = document.getElementById('expand-cards-btn');
    const collapseBtn = document.getElementById('collapse-cards-btn');
    const expandBtns = document.querySelectorAll('.expand-btn');
    const initialCardCount = 6;

    // 初始只显示前6张卡片
    cards.forEach((card, index) => {
        if (index >= initialCardCount) {
            card.style.display = 'none';
        }
    });

    // 搜索功能
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.toLowerCase();
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            searchInput.style.display = 'none';
            confirmBtn.style.display = 'none';
            backBtn.style.display = 'block';
            expandBtn.style.display = 'none';
            collapseBtn.style.display = 'none';
        });
    }

    // 返回按钮
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.style.display = 'block';
            confirmBtn.style.display = 'block';
            backBtn.style.display = 'none';
            expandBtn.style.display = 'block';
            collapseBtn.style.display = 'none';

            cards.forEach((card, index) => {
                if (index >= initialCardCount) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
            });
        });
    }

    // Show All/Collapse 按钮
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            cards.forEach(card => card.style.display = 'block');
            expandBtn.style.display = 'none';
            collapseBtn.style.display = 'block';
        });
    }

    if (collapseBtn) {
        collapseBtn.addEventListener('click', () => {
            cards.forEach((card, index) => {
                if (index >= initialCardCount) {
                    card.style.display = 'none';
                }
            });
            expandBtn.style.display = 'block';
            collapseBtn.style.display = 'none';
        });
    }

    // 展开/折叠按钮
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cardDetails = e.target.nextElementSibling;
            const isExpanded = cardDetails.classList.contains('active');
            
            if (isExpanded) {
                cardDetails.classList.remove('active');
                e.target.textContent = 'Learn More';
            } else {
                cardDetails.classList.add('active');
                e.target.textContent = 'Show Less';
            }
        });
    });
}

// 初始化手风琴功能
function initializeAccordion() {
    const buttons = document.querySelectorAll('.accordion-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isActive = button.classList.contains('active');

            // 关闭所有其他面板
            buttons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.classList.remove('active');
                }
            });

            // 切换当前面板
            button.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
}

// 初始化故事面板功能
function initializeStoryPanels() {
    // 故事展开/折叠功能
    window.toggleStory = function(id) {
        const extraContent = document.getElementById(`extra-${id}`);
        const button = extraContent.previousElementSibling;
        
        if (extraContent.classList.contains('show')) {
            extraContent.classList.remove('show');
            button.textContent = 'Read More';
        } else {
            extraContent.classList.add('show');
            button.textContent = 'Read Less';
        }
    };

    // 故事面板切换功能
    window.removeClass = function(val) {
        const elements = [
            document.getElementById('reykjavik'),
            document.getElementById('capetown'),
            document.getElementById('dubrovnik')
        ];
        
        // 先隐藏所有面板
        elements.forEach(element => {
            if (element) {
                element.classList.add('dn');
                element.style.display = 'none';
                element.style.opacity = '0';
                element.style.visibility = 'hidden';
            }
        });

        // 显示选中的面板
        const index = Math.max(0, Math.min(val - 1, 2));
        const selectedPanel = elements[index];
        if (selectedPanel) {
            selectedPanel.classList.remove('dn');
            selectedPanel.style.display = 'flex';
            selectedPanel.style.opacity = '1';
            selectedPanel.style.visibility = 'visible';
        }
    };

    window.ReturnBack = function() {
        const elements = [
            document.getElementById('reykjavik'),
            document.getElementById('capetown'),
            document.getElementById('dubrovnik')
        ];
        
        elements.forEach(element => {
            if (element) {
                element.classList.add('dn');
                element.style.display = 'none';
                element.style.opacity = '0';
                element.style.visibility = 'hidden';
            }
        });
    };

    // 为故事面板添加点击事件监听器
    const storyPanels = document.querySelectorAll('.hero-panel');
    storyPanels.forEach((panel, index) => {
        panel.addEventListener('click', function(e) {
            e.preventDefault();
            removeClass(index + 1);
        });
    });

    // 为返回按钮添加点击事件监听器
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            ReturnBack();
        });
    });
} 