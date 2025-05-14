document.addEventListener('DOMContentLoaded', function() {
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
                                    </div>
                                 </li>`;
                    }
                });
                newsList.innerHTML = html;
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
});
