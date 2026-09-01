const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function normalizeTr(s) {
  return s.toLowerCase()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u');
}

function tipBul(title) {
  const t = normalizeTr(title);
  if (t.includes('yonetmelik')) return { k: 'yonetmelik', l: 'Yönetmelik' };
  if (t.includes('teblig')) return { k: 'teblig', l: 'Tebliğ' };
  if (t.includes('cumhurbaskanligi kararnamesi') || t.includes('c.b.k')) return { k: 'cbk', l: 'C.B.K.' };
  if (t.includes('kanun')) return { k: 'kanun', l: 'Kanun' };
  if (t.includes('genelge')) return { k: 'genbel', l: 'Genelge' };
  if (t.includes('karar')) return { k: 'karar', l: 'Karar' };
  if (t.includes('ilan') || t.includes('ihale') || t.includes('yargi')) return { k: 'ilan', l: 'İlan' };
  return { k: 'diger', l: 'Diğer' };
}

function formatDate(dateStr) {
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  return `${d}.${m}.${y}`;
}

async function fetchDay(dateStr) {
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const url = `https://www.resmigazete.gov.tr/eskiler/${y}/${m}/${dateStr}.htm`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return [];
    
    const buf = await res.arrayBuffer();
    const decoder = new TextDecoder('windows-1254');
    const html = decoder.decode(buf);
    
    const regex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const items = [];
    
    while ((match = regex.exec(html)) !== null) {
      let href = match[1].trim();
      let text = match[2]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/^[–\-—\s]+/, '')
        .trim();
      
      if (!text || text.length < 8) continue;
      const upper = text.toUpperCase();
      if (upper === 'PDF' || upper === 'HTML' || upper.startsWith('HTML BÖLÜM') || upper.startsWith('PDF BÖLÜM')) continue;
      if (text.includes('Fihrist') || text.includes('İçindekiler') || text.includes('YÜRÜTME VE İDARE') || text.includes('YASAMA BÖLÜMÜ')) continue;
      
      if (!href.startsWith('http')) {
        if (href.startsWith('/')) {
          href = `https://www.resmigazete.gov.tr${href}`;
        } else {
          href = `https://www.resmigazete.gov.tr/eskiler/${y}/${m}/${href}`;
        }
      }
      
      items.push({
        title: text,
        link: href,
        date: formatDate(dateStr),
        tip: tipBul(text)
      });
    }
    return items;
  } catch (e) {
    console.warn(`Could not fetch ${dateStr}: ${e.message}`);
    return [];
  }
}

async function main() {
  const allItems = [];
  const now = new Date();
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}${m}${day}`;
    
    const items = await fetchDay(dateStr);
    if (items.length > 0) {
      console.log(`${formatDate(dateStr)}: ${items.length} baslik bulundu.`);
      allItems.push(...items);
    }
  }
  
  const outFile = path.join(__dirname, '..', 'resmigazete.json');
  fs.writeFileSync(outFile, JSON.stringify(allItems, null, 2), 'utf8');
  console.log(`Toplam ${allItems.length} baslik ${outFile} dosyasina kaydedildi.`);
}

main();

