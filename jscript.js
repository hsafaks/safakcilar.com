document.addEventListener("DOMContentLoaded", function() {
    initSite();
});

function initSite() {
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    loadMaliVeriler();
    fetchResmiGazete();
}

function loadMaliVeriler() {
    const data = [
        {
            title: "Asgari Ücret & SGK (2025)",
            items: [
                "Brüt Asgari Ücret: 20.002,50 TL",
                "Net Asgari Ücret: 17.002,12 TL",
                "İşverene Maliyet: 23.502,94 TL",
                "SGK Tabanı: 20.002,50 TL",
                "SGK Tavanı: 150.018,75 TL"
            ]
        },
        {
            title: "Vergi Muafiyetleri (2025)",
            items: [
                "Yemek İstisnası (Günlük): 170,00 TL + KDV",
                "Yol Yardımı (Günlük): 88,00 TL",
                "Kira Stopajı: %20",
                "Binek Araç Gider Kısıtlaması: %70"
            ]
        },
        {
            title: "Önemli Beyan Takvimi",
            items: [
                "KDV & Muhtasar: Her ayın 28. günü",
                "SGK Primleri: Takip eden ayın sonu",
                "Geçici Vergi: 17 Şubat / Mayıs / Ağustos / Kasım",
                "Yıllık Gelir Vergisi: Mart Sonu"
            ]
        }
    ];

    const container = document.getElementById('mali-bilgi-container');
    container.innerHTML = data.map(section => `
        <div class="mali-card">
            <h3>${section.title}</h3>
            <ul>
                ${section.items.map(item => `<li><i class="fas fa-check-circle" style="color:#635bff"></i> ${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

async function fetchResmiGazete() {
    const container = document.getElementById('rg-feed');
    // RSS to JSON Proxy Service
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            container.innerHTML = data.items.slice(0, 8).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-pdf"></i> ${item.title}
                    </a>
                    <span class="rg-date">${new Date().toLocaleDateString('tr-TR')}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        container.innerHTML = "<p>Resmi Gazete verileri şu an çekilemiyor. Lütfen resmigazete.gov.tr adresini ziyaret edin.</p>";
    }
}
