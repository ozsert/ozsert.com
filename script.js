document.addEventListener('DOMContentLoaded', function () {
    const defaultLang = 'tr';
    let currentLang = localStorage.getItem('language') || defaultLang;

    // AI Credits Banner Animation
    const aiCreditsBanner = document.querySelector('.ai-credits-banner');
    if (aiCreditsBanner) {
        // Add subtle hover effect
        aiCreditsBanner.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        aiCreditsBanner.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        // Intersection Observer for scroll-based animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(aiCreditsBanner);
    }

    // Function to fetch and apply translations
    function loadTranslations(lang) {
        return fetch(`locales/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang}.json`);
                }
                return response.json();
            })
            .then(data => {
                if (!i18next.hasResourceBundle(lang, 'translation')) {
                    i18next.addResourceBundle(lang, 'translation', data, true, true);
                }
                i18next.changeLanguage(lang, (err, t) => {
                    if (err) return console.error('something went wrong loading', err);
                    updateContent();
                    updateLanguageToggle(lang);
                    document.documentElement.lang = lang; // Update HTML lang attribute
                    localStorage.setItem('language', lang); // Save language preference
                });
            })
            .catch(error => console.error('Error loading translation file:', error));
    }

    // i18next initialization
    i18next.init({
        lng: currentLang, // Set language based on stored preference or default
        fallbackLng: defaultLang, // Fallback language if currentLang's files are missing
        debug: true,
        resources: {} // Initialize with empty resources, will be loaded dynamically
    }, function (err, t) {
        if (err) return console.error(err);
        // Load initial language
        loadTranslations(currentLang);
    });

    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            // Handle attributes like 'content' for meta tags
            if (key.startsWith('[content]')) {
                const attrKey = key.substring(9); // Remove '[content]'
                element.setAttribute('content', i18next.t(attrKey));
            } else {
                element.innerHTML = i18next.t(key);
            }
        });
        // Update title separately
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-i18n');
            document.title = i18next.t(titleKey);
        }
    }

    function updateLanguageToggle(lang) {
        const langTr = document.getElementById('lang-tr');
        const langEn = document.getElementById('lang-en');
        if (lang === 'tr') {
            langTr.style.fontWeight = 'bold';
            langEn.style.fontWeight = 'normal';
        } else {
            langEn.style.fontWeight = 'bold';
            langTr.style.fontWeight = 'normal';
        }
    }

    // Language toggle event listeners
    document.getElementById('lang-tr')?.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentLang !== 'tr') {
            loadTranslations('tr').then(() => currentLang = 'tr');
        }
    });

    document.getElementById('lang-en')?.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentLang !== 'en') {
            loadTranslations('en').then(() => currentLang = 'en');
        }
    });

    const newsList = document.getElementById('ai-news-list');
    const rssFeedUrl = 'https://yapayzeka101.substack.com/feed';
    // Using RSS2JSON API to fetch and convert the RSS feed to JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    if (newsList) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // RSS2JSON returns JSON directly
            })
            .then(data => {
                // Check if the API call was successful and if items exist
                if (data.status !== 'ok' || !data.items || data.items.length === 0) {
                    console.error('Error fetching or parsing news feed from RSS2JSON:', data.message || 'No items found');
                    newsList.innerHTML = '<p>No news items found or error fetching feed.</p>';
                    return;
                }

                const items = data.items;
                let html = "";

                items.forEach((item, index) => {
                    // Limiting to 5 posts, adjust as needed
                    if (index < 5) {
                        const title = item.title;
                        const link = item.link;
                        let imageUrl = null;
                        let description = item.description || item.content_text || ''; // Get description

                        // Strip HTML tags from description and truncate
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = description;
                        description = tempDiv.textContent || tempDiv.innerText || "";
                        const maxDescLength = 100; // Max length for description snippet
                        let descriptionSnippet = description.substring(0, maxDescLength);
                        if (description.length > maxDescLength) {
                            descriptionSnippet += "...";
                        }

                        // Extract image URL from enclosure or thumbnail
                        if (item.enclosure) {
                            if (Array.isArray(item.enclosure)) {
                                const imageEnclosure = item.enclosure.find(enc => enc.type && enc.type.startsWith('image/'));
                                if (imageEnclosure) {
                                    imageUrl = imageEnclosure.link;
                                }
                            } else if (typeof item.enclosure === 'object' && item.enclosure.link) {
                                if (item.enclosure.type && item.enclosure.type.startsWith('image/')) {
                                    imageUrl = item.enclosure.link;
                                } else if (!item.enclosure.type) { // If type is not specified, but link exists
                                    imageUrl = item.enclosure.link;
                                }
                            }
                        }

                        // Fallback to thumbnail if enclosure didn't provide an image
                        if (!imageUrl && item.thumbnail) {
                            imageUrl = item.thumbnail;
                        }

                        // Prepare inline style for background image
                        const styleAttribute = imageUrl ? `style="background-image: url('${imageUrl}');"` : 'style="background-color: var(--light-gray);"'; // Fallback background color

                        html += `<li ${styleAttribute}>
                                    <div class="ai-news-content">
                                        <h3>${title}</h3>
                                        <p>${descriptionSnippet}</p>
                                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more-link">Read more &rarr;</a>
                                        <div class="modal-text" style="display:none;">${description}</div>
                                    </div>
                                 </li>`;
                    }
                });
                newsList.innerHTML = html;
               // console.log("",html);

  

            })
            .catch(error => {
                console.error('Error fetching or processing RSS feed with RSS2JSON:', error);
                if (newsList) {
                    newsList.innerHTML = '<p>Could not load latest news at the moment. Please try again later.</p>';
                }
            });
    } else {
        console.log("#ai-news-list element not found.");
    }

        // Modal functionality
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const modalTextContent = document.getElementById('modalTextContent');
        const closeButton = document.querySelector('.close-button');
    
        document.querySelectorAll('.read-more-link').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default link behavior
    
                const listItem = this.closest('li');
                const backgroundImage = listItem.style.backgroundImage.slice(4, -1).replace(/'/g, "").replace(/"/g, ""); // Get image URL
                const textForModal = listItem.querySelector('.modal-text').innerHTML; // Changed from textContent to innerHTML
    
                modalImage.src = backgroundImage;
                modalTextContent.innerHTML = textForModal; // Changed from textContent to innerHTML
                modal.style.display = 'block';
            });
        });
    
        if (closeButton) {
            closeButton.onclick = function () {
                modal.style.display = 'none';
            }
        }
    
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    
        // Optional: Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                modal.style.display = 'none';
            }
        });
    }else {
        console.log("imageModal element not found.");
    }
    
    // Carousel dot navigation functionality
    function initializeCarouselDots() {
        // Get all carousel sections
        document.querySelectorAll('section#ai-topics').forEach((section, sectionIndex) => {
            const carousel = section.querySelector('#ai-topics-list');
            const dots = section.querySelectorAll('.carousel-dots .dot');
            
            if (!carousel || !dots.length) return;
            
            // Add click event to each dot
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.getAttribute('data-index'));
                    const items = carousel.querySelectorAll('li');
                    
                    if (items[index]) {
                        // Calculate the scroll position
                        const scrollLeft = items[index].offsetLeft - carousel.offsetLeft;
                        
                        // Smooth scroll to the target item
                        carousel.scrollTo({
                            left: scrollLeft,
                            behavior: 'smooth'
                        });
                        
                        // Update active dot
                        dots.forEach(d => d.classList.remove('active'));
                        dot.classList.add('active');
                    }
                });
            });
            
            // Update active dot on scroll
            carousel.addEventListener('scroll', () => {
                const scrollPosition = carousel.scrollLeft;
                const items = carousel.querySelectorAll('li');
                
                // Find the closest item to the current scroll position
                let closestIndex = 0;
                let closestDistance = Infinity;
                
                items.forEach((item, idx) => {
                    const distance = Math.abs(item.offsetLeft - carousel.offsetLeft - scrollPosition);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestIndex = idx;
                    }
                });
                
                // Update active dot
                dots.forEach(d => d.classList.remove('active'));
                if (dots[closestIndex]) {
                    dots[closestIndex].classList.add('active');
                }
            });
        });
    }
    
    // Initialize carousel dots after content is loaded
    initializeCarouselDots();
    
    // Reinitialize after language change to ensure functionality
    i18next.on('languageChanged', function() {
        setTimeout(initializeCarouselDots, 100); // Small delay to ensure DOM is updated
    });

});
