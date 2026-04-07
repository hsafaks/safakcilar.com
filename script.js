document.addEventListener("DOMContentLoaded", function() {
    // 1. Tarih Güncelleme
    const dateEl = document.getElementById('current-date-text');
    if(dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('tr-TR', { 
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' 
        });
    }

    // 2. 2026 Rakamlarını Yükle (MuhasebeTR / Resmi Tebliğ Senkronlu)
    loadMali2026Data();

    // 3. Resmi Gazete Akışı
    fetchResmiGazeteData();
});

function loadMali2026Data() {
    // 2026 Yılı VUK Hadleri ve SGK Parametreleri
    const content = [
        {
            title: "2026 İşçilik & SGK",
            items: [
                "Brüt Asgari Ücret: 29.500,00 TL",
                "SGK Tabanı: 29.500,00 TL",
                "SGK Tavanı: 221.250,00 TL",
                "Günlük Asgari Ücret: 983,33 TL",
                "Asgari Ücret Vergi İstisnası: Mevcut"
            ]
        },
        {
            title: "2026 Vergi & İstisnalar",
            items: [
                "Yemek İstisnası (Günlük): 245,00 TL + KDV",
                "Yol İstisnası (Günlük): 122,00 TL",
                "VUK Fatura Sınırı: 10.000,00 TL",
                "Demirbaş Amortisman Sınırı: 10.000,00 TL",
                "Binek Araç Gider Kısıtlaması: %70"
            ]
        },
        {
            title: "Beyanname Takvimi (2026)",
            items: [
                "KDV & Muhtasar: Takip eden ayın 28. günü",
                "SGK Primleri: Takip eden ayın son günü",
                "1. Geçici Vergi: 17 Mayıs 2026",
                "Yıllık Gelir Vergisi: 31 Mart 2026 Sonu",
                "Kurumlar Vergisi: 30 Nisan 2026 Sonu"
            ]
        }
    ];

    const grid = document.getElementById('mali-info-cards');
    if(grid) {
        grid.innerHTML = content.map(card => `
            <div class="mali-card">
                <h3>${card.title}</h3>
                <ul>
                    ${card.items.map(item => `<li><i class="fas fa-chevron-right"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

async function fetchResmiGazeteData() {
    const target = document.getElementById('rg-list-container');
    const rss = 'https://www.resmigazete.gov.tr/rss/resmigazete.xml';
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;

    try {
        const response = await fetch(api);
        const data = await response.json();

        if (data.status === 'ok' && target) {
            target.innerHTML = data.items.slice(0, 10).map(item => `
                <a href="${item.link}" target="_blank" class="rg-link">
                    <i class="far fa-file-alt" style="margin-right:12px; color:#162a78"></i> ${item.title}
                </a>
            `).join('');
        }
    } catch (e) {
        if(target) target.innerHTML = "<p style='padding:40px; text-align:center'>Şu an veriler çekilemiyor, lütfen bekleyiniz...</p>";
    }
}
