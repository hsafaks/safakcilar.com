document.addEventListener("DOMContentLoaded", function() {
    // Tarih Güncelleme
    const dateEl = document.getElementById('current-date-display');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
    }

    // Mali Verileri Yükle
    renderMaliData();

    // Resmi Gazete Çek (Anlık)
    fetchResmiGazete();
});

function renderMaliData() {
    const maliData = [
        {
            title: "Asgari Ücret & SGK 2025",
            items: [
                "Brüt Asgari Ücret: 20.002,50 TL",
                "Net Asgari Ücret: 17.002,12 TL",
                "İşverene Maliyet: 23.502,94 TL",
                "SGK Tabanı: 20.002,50 TL",
                "SGK Tavanı: 150.018,75 TL"
            ]
        },
        {
            title: "Vergi & İstisnalar 2025",
            items: [
                "Yemek İstisnası (Günlük): 170,00 TL + KDV",
                "Yol Yardımı (Günlük): 88,00 TL",
                "Fatura Kesme Sınırı: 6.900 TL",
                "Amortisman Sınırı: 6.900 TL",
                "Kira Stopaj Oranı: %20"
            ]
        },
        {
            title: "Mali Takvim",
            items: [
                "Muhtasar & KDV: Ayın 28. Günü",
                "SGK Prim Ödemesi: Ayın Son Günü",
                "Geçici Vergi: 17 Şubat / Mayıs / Ağustos",
                "Gelir Vergisi Beyanı: Mart Sonu",
                "Kurumlar Vergisi Beyanı: Nisan Sonu"
            ]
        }
    ];

    const container = document.getElementById('mali-data-container');
    if (container) {
        container.innerHTML = maliData.map(section => `
            <div class="mali-card">
                <h3>${section.title}</h3>
                <ul>
                    ${section.items.map(item => `<li><i class="fas fa-check-circle" style="color:#22c55e; margin-right:8px"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazete() {
    const listContainer = document.getElementById('resmi-gazete-list');
    // RSS verisini JSON'a çeviren güvenli proxy (HTTPS uyumlu)
    const rssUrl = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const proxyApi = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(proxyApi);
        const data = await response.json();

        if (data.status === 'ok' && listContainer) {
            listContainer.innerHTML = data.items.slice(0, 10).map(item => `
                <div class="rg-item">
                    <a href="${item.link}" target="_blank">
                        <i class="fas fa-file-pdf"></i> ${item.title}
                    </a>
                </div>
            `).join('');
        } else {
            throw new Error("Veri hatası");
        }
    } catch (error) {
        if (listContainer) {
            listContainer.innerHTML = `
                <div style="padding:40px; text-align:center; color:#64748b">
                    <p>Resmi Gazete verileri şu an çekilemiyor.</p>
                    <a href="https://www.resmigazete.gov.tr" target="_blank" style="color:#1e3a8a">Buraya tıklayarak doğrudan ulaşabilirsiniz.</a>
                </div>
            `;
        }
    }
}
