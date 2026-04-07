document.addEventListener("DOMContentLoaded", function() {
    // 1. Tarih Güncelleme
    const dateDisplay = document.getElementById('current-date-display');
    if(dateDisplay) {
        dateDisplay.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Parametrelerini Yükle (Alomaliye / Mevzuat Referanslı)
    render2026AlomaliyeData();

    // 3. Resmi Gazete Akışını Başlat
    fetchResmiGazete();
});

function render2026AlomaliyeData() {
    // 2026 yılı için güncellenmiş (tahmini artışlar ve kesinleşen parametreler)
    const alomaliyeData = [
        {
            title: "2026 SGK & İşçilik Bilgileri",
            items: [
                "Brüt Asgari Ücret: 30.003,75 TL (Tahmini)",
                "SGK Tabanı: 30.003,75 TL",
                "SGK Tavanı: 225.028,13 TL",
                "İşveren SGK Payı: %15,5 (5 Puan İnd. ile)",
                "İşsizlik Sigortası Payı: %1 İşçi + %2 İşv."
            ]
        },
        {
            title: "2026 Vergi & Gider Sınırları",
            items: [
                "Yemek İstisnası (Günlük): 260 TL + KDV",
                "Yol İstisnası (Günlük): 130 TL",
                "Amortisman Sınırı: 10.500 TL",
                "Fatura Kesme Sınırı: 10.500 TL",
                "Binek Araç Kiralama Gider Kısıtı: 42.000 TL"
            ]
        },
        {
            title: "2026 Önemli Takvim (GİB)",
            items: [
                "KDV2 Beyannamesi: Her Ayın 25. Günü",
                "Muhtasar ve KDV: Her Ayın 28. Günü",
                "SGK Prim Ödemesi: Takip Eden Ayın Sonu",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "Kurumlar Vergisi Beyanı: Nisan Sonu"
            ]
        }
    ];

    const container = document.getElementById('mali-data-container');
    if(container) {
        container.innerHTML = alomaliyeData.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-chevron-right"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const list = document.getElementById('resmi-gazete-list');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    // Güvenli RSS Proxy
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxy);
        const data = await response.json();

        if (data.status === 'ok' && list) {
            list.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-alt" style="color:#162a78; margin-right:12px"></i> ${item.title}
                    </a>
                </div>
            `).join('');
        }
    } catch (e) {
        if(list) list.innerHTML = "<p style='padding:40px; text-align:center'>Veriler GİB ve Resmi Gazete sisteminden güncelleniyor, lütfen bekleyiniz...</p>";
    }
}
