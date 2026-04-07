document.addEventListener("DOMContentLoaded", function() {
    // 1. Tarih Gösterimi
    const dateDisplay = document.getElementById('current-date-display');
    if(dateDisplay) {
        dateDisplay.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Verilerini Yükle (GİB ve Mevzuat Standartlı)
    render2026Data();

    // 3. Resmi Gazete Çek
    fetchResmiGazete();
});

function render2026Data() {
    const data2026 = [
        {
            title: "2026 Parametreleri",
            items: [
                "SGK Taban: 20.002,50 TL (Güncel)",
                "SGK Tavan: 150.018,75 TL (Güncel)",
                "Fatura Kesme Sınırı: 6.900 TL",
                "Amortisman Sınırı: 6.900 TL",
                "Binek Araç Gider Kısıtlılığı: %70"
            ]
        },
        {
            title: "Vergi & İstisnalar 2026",
            items: [
                "Yemek Bedeli İstisnası: 170 TL + KDV",
                "Yol Bedeli İstisnası: 88 TL (Günlük)",
                "Engellilik İndirimi (1. Derece): 6.900 TL",
                "Basit Usul Kazanç İstisnası: Mevcut",
                "Mesken Kira İstisnası: 33.000 TL"
            ]
        },
        {
            title: "Mali Takvim (GİB)",
            items: [
                "KDV & Muhtasar: Takip eden ayın 28. günü",
                "SGK Primleri: Takip eden ayın son günü",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "Yıllık Gelir Vergisi: Mart 2026 Sonu",
                "Kurumlar Vergisi: Nisan 2026 Sonu"
            ]
        }
    ];

    const container = document.getElementById('mali-data-container');
    if(container) {
        container.innerHTML = data2026.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-caret-right" style="color:#162a78"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const list = document.getElementById('resmi-gazete-list');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxy);
        const data = await response.json();

        if (data.status === 'ok' && list) {
            list.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-pdf" style="color:#162a78"></i> ${item.title}
                    </a>
                </div>
            `).join('');
        }
    } catch (e) {
        if(list) list.innerHTML = "<p style='padding:40px; text-align:center'>Veriler çekiliyor, lütfen bekleyiniz...</p>";
    }
}
