document.addEventListener("DOMContentLoaded", function() {
    // 1. Tarih Gösterimi
    const dateDisplay = document.getElementById('current-date-display');
    if(dateDisplay) {
        dateDisplay.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Verilerini Yükle
    render2026Data();

    // 3. Resmi Gazete Çek
    fetchResmiGazete();
});

function render2026Data() {
    const data2026 = [
        {
            title: "2026 Asgari Ücret & SGK",
            items: [
                "Brüt Asgari Ücret: (Aralık 2025'te netleşecek)",
                "SGK Taban: 20.002,50 TL (Güncel)",
                "SGK Tavan: 150.018,75 TL (Güncel)",
                "SGK İşsizlik Primi: %1 + %2",
                "İşveren SGK Teşvik: 5 Puanlık İndirim"
            ]
        },
        {
            title: "2026 Vergi & Muafiyetler",
            items: [
                "Yemek İstisnası: 170,00 TL + KDV",
                "Yol Yardımı: 88,00 TL (Günlük)",
                "Binek Araç Gider Kısıtlaması: %70",
                "Fatura Kesme Sınırı (VUK): 6.900 TL",
                "Kira Stopajı: %20"
            ]
        },
        {
            title: "Mali Takvim (GİB Senkron)",
            items: [
                "KDV/Muhtasar Beyan: Her ayın 28. günü",
                "SGK Tahakkuk/Ödeme: Ayın son günü",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "2. Geçici Vergi: 17 Ağustos 2026",
                "3. Geçici Vergi: 17 Kasım 2026"
            ]
        }
    ];

    const container = document.getElementById('mali-data-container');
    if(container) {
        container.innerHTML = data2026.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-check-double"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const list = document.getElementById('resmi-gazete-list');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    // RSS verisini HTTPS güvenliğiyle çekmek için Proxy kullanıyoruz
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxy);
        const data = await response.json();

        if (data.status === 'ok' && list) {
            list.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-alt"></i> ${item.title}
                    </a>
                </div>
            `).join('');
        }
    } catch (e) {
        if(list) list.innerHTML = "<p style='padding:40px; text-align:center'>Şu an Resmi Gazete bağlantısı kuruluyor. Lütfen HTTPS ayarlarınızı kontrol edin veya sayfayı yenileyin.</p>";
    }
}
