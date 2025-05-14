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
                        // const description = item.description; // Optional: if you want to show a snippet
                        // const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''; // Optional

                        html += `<li><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></li>`;
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
