document.addEventListener("DOMContentLoaded", function() {
    loadThemePreference();
    setTimeout(() => {
        document.documentElement.classList.remove('dark-theme-loading');
    }, 50);

    const lang = document.documentElement.lang || 'en';
    const pathPrefix = getPathPrefix();

    loadComponent('header', lang, 'main-header').then(() => {
        updateActiveLinks();
        const isDark = document.body.classList.contains('dark-theme');
        updateThemeIcon(isDark);
    });

    initializeAccordion();

    function getPathPrefix() {
        const path = window.location.pathname;
        if (path.includes('/tr/resizer/')) return '../../';
        if (path.includes('/tr/') || path.includes('/resizer/')) return '../';
        return '';
    }

    function loadComponent(component, lang, targetId) {
        const filePath = `${pathPrefix}layout/${component}_${lang}.html`;
        return fetch(filePath)
            .then(response => response.ok ? response.text() : '')
            .then(data => {
                const element = document.getElementById(targetId);
                if (element) element.innerHTML = data;
            })
            .catch(() => {});
    }

    function initializeAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = header.nextElementSibling;
                const icon = header.querySelector('.accordion-icon');

                item.classList.toggle('accordion-active');
                if (item.classList.contains('accordion-active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    icon.classList.add('rotate-180');
                } else {
                    content.style.maxHeight = '0px';
                    icon.classList.remove('rotate-180');
                }
            });
        });
    }

    function updateActiveLinks() {
        const currentPath = window.location.pathname;
        const navConverter = document.getElementById('nav-converter');
        const navResizer = document.getElementById('nav-resizer');

        navConverter.className = 'text-gray-600 hover:text-gray-900 font-medium transition-colors';
        navResizer.className = 'text-gray-600 hover:text-gray-900 font-medium transition-colors';

        if (currentPath.includes('resizer')) {
            navResizer.className = 'text-gray-900 font-bold';
        } else {
            navConverter.className = 'text-gray-900 font-bold';
        }

        const langEn = document.getElementById('lang-en');
        const langTr = document.getElementById('lang-tr');

        if (lang === 'tr') {
            langTr.className = 'font-bold text-gray-900';
            langEn.className = 'text-gray-500 hover:text-gray-900 font-medium';
        } else {
            langEn.className = 'font-bold text-gray-900';
            langTr.className = 'text-gray-500 hover:text-gray-900 font-medium';
        }

        const isResizerPage = currentPath.includes('/resizer');
        if (langEn.tagName === 'A') langEn.href = isResizerPage ? "/resizer/" : "/";
        if (langTr.tagName === 'A') langTr.href = isResizerPage ? "/tr/resizer/" : "/tr/";
    }

    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    window.toggleTheme = function() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.classList.add('theme-switching');

        document.documentElement.classList.add('theme-switching');
        const isDark = document.body.classList.contains('dark-theme');

        if (isDark) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(false);
            clearFaqInlineStyles();
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
            clearFaqInlineStyles();
        }

        if (themeToggle) {
            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple';
            themeToggle.appendChild(ripple);
            setTimeout(() => ripple.remove(), 150);
        }

        setTimeout(() => {
            document.documentElement.classList.remove('theme-switching');
            if (themeToggle) themeToggle.classList.remove('theme-switching');
        }, 150);
    };

    function clearFaqInlineStyles() {
        const faqSections = document.querySelectorAll('section');
        faqSections.forEach(section => {
            const faqTitle = section.querySelector('h2');
            if (faqTitle && (faqTitle.textContent.includes('FAQ') || faqTitle.textContent.includes('Soru'))) {
                section.removeAttribute('style');
                faqTitle.removeAttribute('style');
                const accordionContents = section.querySelectorAll('.accordion-content');
                accordionContents.forEach(content => {
                    const item = content.parentElement;
                    if (item.classList.contains('accordion-active')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    function updateThemeIcon(isDark) {
        setTimeout(() => {
            const sunIcons = document.querySelectorAll('.sun-icon');
            const moonIcons = document.querySelectorAll('.moon-icon');
            sunIcons.forEach(icon => {
                icon.style.display = isDark ? 'block' : 'none';
                icon.style.opacity = isDark ? '1' : '0';
                icon.style.visibility = isDark ? 'visible' : 'hidden';
            });
            moonIcons.forEach(icon => {
                icon.style.display = isDark ? 'none' : 'block';
                icon.style.opacity = isDark ? '0' : '1';
                icon.style.visibility = isDark ? 'hidden' : 'visible';
            });
        }, 50);
    }
});
