document.addEventListener("DOMContentLoaded", function() {
    // 1. Önce statik olan mali verileri yükle (İnternet hızı ne olursa olsun görünür)
    loadMaliVeriler();
    
    // 2. Tarihi güncelle
    const tarihElement = document.getElementById('current-date');
    if(tarihElement) {
        tarihElement.innerText = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // 3. Resmi Gazete'yi çek (Güvenli bağlantı sağlandığında çalışacaktır)
    fetchResmiGazete();
});

function loadMaliVeriler() {
    const data = [
        {
            title: "Asgari Ücret & SGK (2025)",
            items: [
                "Brüt Asgari Ücret: 20.002,50 TL",
                "Net Asgari Ücret: 17.002,12 TL",
                "İşverene Toplam Maliyet: 23.502,94 TL",
                "SGK Taban: 20.002,50 TL | Tavan: 150.018,75 TL"
            ]
        },
        {
            title: "Vergi & İstisnalar (2025)",
            items: [
                "Yemek İstisnası (Günlük): 170,00 TL + KDV",
                "Yol Yardımı (Günlük): 88,00 TL",
                "Kira Stopaj Oranı: %20",
                "Engellilik İndirimi (1. Derece): 6.900 TL"
            ]
        },
        {
            title: "Yasal Limitler (2025)",
            items: [
                "Fatura Kesme Sınırı: 6.900 TL",
                "Amortisman Sınırı: 6.900 TL",
                "Mesken Kira İstisnası: 33.000 TL",
                "Değer Artış Kazancı İstisnası: 87.000 TL"
            ]
        }
    ];

    const container = document.getElementById('mali-bilgi-container');
    if(container) {
        container.innerHTML = data.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-arrow-right" style="color:#1e3a8a; font-size:0.8rem"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const container = document.getElementById('rg-feed');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && container) {
            container.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-alt"></i> ${item.title}
                    </a>
                    <span class="rg-date" style="font-size:0.8rem; color:#64748b">${new Date().toLocaleDateString('tr-TR')}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        if(container) container.innerHTML = "<p>Resmi Gazete verilerine şu an ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz.</p>";
    }
}
