document.addEventListener("DOMContentLoaded", function() {
    // 1. Tarihi Göster
    const dateField = document.getElementById('live-date');
    if(dateField) {
        dateField.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Verilerini Yükle
    initMaliData();

    // 3. Resmi Gazete'yi Çek
    fetchRG();
});

function initMaliData() {
    // MuhasebeTR ve VUK Tebliğlerine göre 2026 kesinleşen/uygulanan değerler
    const content = [
        {
            title: "2026 İşçilik & SGK",
            items: [
                "Brüt Asgari Ücret: 32.105,50 TL",
                "SGK Tabanı: 32.105,50 TL",
                "SGK Tavanı: 240.791,25 TL",
                "Günlük Asgari Ücret: 1.070,18 TL",
                "SGK İdari Para Cezası: 32.105,50 TL"
            ]
        },
        {
            title: "2026 Vergi Parametreleri",
            items: [
                "Yemek İstisnası (Günlük): 245 TL + KDV",
                "Yol İstisnası (Günlük): 122 TL",
                "Fatura Kesme Sınırı: 10.000 TL",
                "Amortisman Sınırı: 10.000 TL",
                "Binek Araç Gider Kısıtı: 42.000 TL"
            ]
        },
        {
            title: "Önemli Beyan Takvimi",
            items: [
                "KDV & Muhtasar: Takip eden ayın 28. günü",
                "SGK Prim Ödemesi: Takip eden ayın son günü",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "Gelir Vergisi Beyanı: 31 Mart 2026",
                "Kurumlar Vergisi Beyanı: 30 Nisan 2026"
            ]
        }
    ];

    const target = document.getElementById('mali-data-list');
    if(target) {
        target.innerHTML = content.map(card => `
            <div class="mali-card">
                <h3>${card.title}</h3>
                <ul>
                    ${card.items.map(item => `<li><i class="fas fa-angle-right"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchRG() {
    const listDiv = document.getElementById('resmi-gazete-content');
    const rss = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const proxy = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;

    try {
        const response = await fetch(proxy);
        const data = await response.json();

        if (data.status === 'ok' && listDiv) {
            listDiv.innerHTML = data.items.slice(0, 10).map(item => `
                <a href="${item.link}" target="_blank" class="rg-row">
                    <i class="far fa-file-alt" style="margin-right:15px; color:#162a78"></i> ${item.title}
                </a>
            `).join('');
        }
    } catch (e) {
        if(listDiv) listDiv.innerHTML = "<p style='padding:40px; text-align:center'>Şu an veriler çekilemiyor, lütfen daha sonra tekrar deneyiniz.</p>";
    }
}
