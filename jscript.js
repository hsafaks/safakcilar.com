document.addEventListener("DOMContentLoaded", function() {
    fetchResmiGazete();
});

async function fetchResmiGazete() {
    const container = document.getElementById('rg-container');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    
    // RSS'i JSON'a çeviren ücretsiz bir API (rss2json)
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            let html = '';
            // İlk 5 başlığı göster
            data.items.slice(0, 5).forEach(item => {
                html += `
                    <div class="rg-item">
                        <i class="far fa-file-alt"></i> 
                        <a href="${item.link}" target="_blank">${item.title}</a>
                        <br><small>${new Date(item.pubDate).toLocaleDateString('tr-TR')}</small>
                    </div>
                `;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = "Veriler şu an alınamıyor. Lütfen doğrudan Resmi Gazete'yi ziyaret edin.";
        }
    } catch (error) {
        container.innerHTML = "Bir hata oluştu.";
        console.error(error);
    }
}
