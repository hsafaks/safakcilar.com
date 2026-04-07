document.addEventListener("DOMContentLoaded", function() {
    // 1. Güncel Tarih
    const dateEl = document.getElementById('date-now');
    if(dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Verileri (VUK 565 ve 2026 YDO Artışları Uygulanmış)
    renderMuhasebeTRData();

    // 3. Resmi Gazete Akışı
    fetchResmiGazete();
});

function renderMuhasebeTRData() {
    // MuhasebeTR ve Resmi Tebliğlere göre 2026 kesinleşen/uygulanan değerler
    const data = [
        {
            title: "2026 İşçilik & SGK",
            items: [
                "Brüt Asgari Ücret: 32.105,50 TL (2026 Ocak)",
                "SGK Taban: 32.105,50 TL",
                "SGK Tavan: 240.791,25 TL",
                "Günlük Asgari Ücret: 1.070,18 TL",
                "SGK İdari Para Cezaları: 32.105,50 TL (Tam)"
            ]
        },
        {
            title: "2026 Vergi & İstisnalar",
            items: [
                "Yemek İstisnası (Günlük): 245 TL + KDV",
                "Yol İstisnası (Günlük): 122 TL",
                "Fatura Kesme Sınırı (VUK): 10.000 TL",
                "Amortisman Sınırı: 10.000 TL",
                "Binek Araç Kiralama Gider Kısıtı: 42.000 TL"
            ]
        },
        {
            title: "2026 GİB Vergi Takvimi",
            items: [
                "KDV & Muhtasar: Takip eden ayın 28. günü",
                "SGK Prim Ödemesi: Takip eden ayın son günü",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "Gelir Vergisi Beyanı: 31 Mart 2026",
                "Kurumlar Vergisi Beyanı: 30 Nisan 2026"
            ]
        }
    ];

    const container = document.getElementById('mali-data-grid');
    if(container) {
        container.innerHTML = data.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-caret-right"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const list = document.getElementById('rg-feed-container');
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxy);
        const data = await response.json();

        if (data.status === 'ok' && list) {
            list.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="far fa-file-pdf" style="color:#162a78; margin-right:12px"></i> ${item.title}
                    </a>
                </div>
            `).join('');
        }
    } catch (e) {
        if(list) list.innerHTML = "<p style='padding:40px; text-align:center; color:#64748b'>Mevzuat verileri güncelleniyor, lütfen sayfayı yenileyiniz.</p>";
    }
}
