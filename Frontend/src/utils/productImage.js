// Shared helpers for resolving a product's display image.
//
// Priority: real uploaded images (heroImage / gallery) first; when a product has
// none, we fall back to a curated stock photo picked by the product's *category
// name* (and title) so the placeholder actually looks like what the product is
// about instead of being random/unrelated.
//
// (source.unsplash.com's keyword-search redirect was retired, so we point
// straight at known-good photo IDs on images.unsplash.com.)

const BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

export const resolveUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/logos/')) return url;
  return `${BASE}${url}`;
};

export const ensureAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const CATEGORY_PHOTOS = [
  { match: /robot|arm|servo|actuator|humanoid|bipedal|rover/i, photos: ['1581092160607-ee22621dd758', '1485827404703-89b55fcc595e', '1563770660941-20978e870e26', '1581092335397-9583fe92d232'] },
  { match: /ai hardware|jetson|tpu|accelerator|neural|compute/i, photos: ['1487058792275-0ad4aaf24ca7', '1550751827-4bd374c3f58b', '1526374965328-7f61d4dc18c5'] },
  { match: /everyday ai|wearable|glass|earbud|audio|ring/i, photos: ['1572635196237-14b3f281503f', '1590658268037-6bf12165a8df', '1605100804763-247f67b3557e'] },
  { match: /smart home|home automation|sensor array|matter|thread/i, photos: ['1558618666-fcd25c85cd64', '1513694203232-719a280e022f', '1585771724684-38269d6639fd'] },
  { match: /iot|lora|gateway|esp32|wireless|connectivity/i, photos: ['1518770660439-4636190af475', '1558618666-fcd25c85cd64', '1451187580459-43490279c0fa'] },
  { match: /development board|pico|raspberry|stm32|microcontroller/i, photos: ['1461749280684-dccba630e2f6', '1518770660439-4636190af475', '1526374965328-7f61d4dc18c5'] },
  { match: /electronic|stepper|motor driver|sensor|component/i, photos: ['1518770660439-4636190af475', '1581092335397-9583fe92d232', '1550751827-4bd374c3f58b'] },
  { match: /travel|flight|airline|booking/i, photos: ['1436491865332-7a61a109cc05', '1488646953014-85cb44e25828', '1464037866556-6812c9d1c72e'] },
  { match: /matrimonial|wedding|marriage/i, photos: ['1519225421980-715cb0215aed', '1606800052052-a08af7148866', '1583939003579-730e3918a45a'] },
  { match: /logistics|parcel|delivery|courier/i, photos: ['1601584115197-04ecc0da31d7', '1566576912321-d58ddd7a6088', '1494412574643-ff11b0a5c1c3'] },
  { match: /ride|taxi|cab|car rental/i, photos: ['1502877338535-766e1452684a', '1511919884226-fd3cad34687c', '1494976388531-d1058494cdd8'] },
  { match: /hrms|hr |human resource/i, photos: ['1521737604893-d14cc237f11d', '1522202176988-66273c2fd55f', '1600880292203-757bb62b4baf'] },
  { match: /crm|sales/i, photos: ['1551288049-bebda4e38f71', '1460925895917-afdab827c52f', '1552664730-d307ca884978'] },
  { match: /e-?commerce|shopping|store/i, photos: ['1556742049-0cfed4f6a45d', '1472851294608-062f824d29cc', '1483985988355-763728e1935b'] },
  { match: /finance|banking|payment/i, photos: ['1563013544-824ae1b704d3', '1559526324-4b87b5e36e44', '1454165804606-c3d57bc86b40'] },
  { match: /education|learning|course/i, photos: ['1503676260728-1c00da094a0b', '1523240795612-9a054b0db644', '1509062522246-3755977927d7'] },
  { match: /health|medical|hospital|clinic/i, photos: ['1538108149393-fbbd81895907', '1576091160550-2173dba999ef', '1530497610245-94d3c16cda28'] },
  { match: /food|restaurant|delivery app/i, photos: ['1504674900247-0877df9cc836', '1551218808-94e220e084d2', '1466637574441-749b8f19452f'] },
  { match: /real estate|property/i, photos: ['1560518883-ce09059eeffa', '1568605114967-8130f3a36994', '1512917774080-9991f1c4c750'] },
];

const DEFAULT_PHOTOS = ['1518770660439-4636190af475', '1581091226825-a6a2a5aee158', '1487058792275-0ad4aaf24ca7'];

function photoIdsForProduct(product) {
  if (!product) return DEFAULT_PHOTOS;
  const haystack = `${product.category || ''} ${product.title || ''}`;
  const found = CATEGORY_PHOTOS.find((c) => c.match.test(haystack));
  return found ? found.photos : DEFAULT_PHOTOS;
}

// A deterministic, category-relevant stock photo for a product. `salt` lets the
// same product get different (but stable) photos in different sections.
export function categoryImage(product, salt = '', width = 1600, height = 1000) {
  const photos = photoIdsForProduct(product);
  const seedKey = `${product?.slug || product?.title || 'product'}-${salt}`;
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) hash = (hash * 31 + seedKey.charCodeAt(i)) >>> 0;
  const photoId = photos[hash % photos.length];
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

export function getFavicon(url) {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

const KNOWN_VERIFIED_LOGOS = {
  'onlinego logistics': '/logos/onlinego_logistics_logo.png',
  'online go logistics': '/logos/onlinego_logistics_logo.png',
  'onlinego': '/logos/onlinego_bus_logo.png',
  'online go': '/logos/onlinego_bus_logo.png',
  'aibus': '/logos/aibus_logo.png',
  'ai bus': '/logos/aibus_logo.png',
  'gymproplus': '/logos/gymproplus_logo.png',
  'gympro plus': '/logos/gymproplus_logo.png',
  'gym pro plus': '/logos/gymproplus_logo.png',
  'healthyfood': '/logos/healthyfood_logo.png',
  'aitourism': '/logos/aitourism_logo.png',
  'lovenzea': '/logos/lovenzea_logo.png',
  'worknai hrms': '/logos/worknai_hrms_logo.png',
  'worknai crm': '/logos/worknai_crm_logo.png',
  'billpay': '/logos/worknai_crm_logo.png',
  'goairclass': '/logos/goairclass_logo.png',
  'nexthire': '/logos/nexthire_logo.png',
  'itjobx': '/logos/nexthire_logo.png',
  'mobilepay': '/logos/mobilepay_logo.png',
  'pginfo': '/logos/pginfo_logo.png',
  'pg info': '/logos/pginfo_logo.png',
};

export function productLogo(product) {
  if (!product) return null;
  // If product has a direct uploaded or configured real logo, use it first!
  if (product.logoUrl && isLikelyImageUrl(product.logoUrl)) {
    return resolveUrl(product.logoUrl);
  }
  const key = (product.title || '').toLowerCase().trim();
  // Check exact/longest matches first to prevent partial match collisions (e.g. onlinego logistics vs onlinego)
  for (const [k, v] of Object.entries(KNOWN_VERIFIED_LOGOS)) {
    if (key.includes(k)) return v;
  }
  if (product.url) return getFavicon(product.url);
  return null;
}

// The best display image for a product: real uploaded image if available,
// otherwise a category-based placeholder. `salt` varies the placeholder.
export function productImage(product, salt = '', width = 1600, height = 1000) {
  if (!product) return categoryImage(null, salt, width, height);
  if (product?.gallery?.length && isLikelyImageUrl(product.gallery[0])) return resolveUrl(product.gallery[0]);
  if (product?.heroImage && isLikelyImageUrl(product.heroImage)) return resolveUrl(product.heroImage);
  if (product?.overviewImage && isLikelyImageUrl(product.overviewImage)) return resolveUrl(product.overviewImage);
  return categoryImage(product, salt, width, height);
}

export const CATEGORY_GRADIENTS = {
  'blood donation': 'from-rose-500 via-red-500 to-red-600 shadow-red-500/25 text-white',
  'health': 'from-rose-500 via-red-500 to-pink-600 shadow-rose-500/25 text-white',
  'medical': 'from-rose-500 via-red-500 to-red-600 shadow-red-500/25 text-white',
  'automobile': 'from-amber-500 via-orange-500 to-red-500 shadow-orange-500/25 text-white',
  'car rental': 'from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/25 text-white',
  'travel': 'from-sky-400 via-blue-500 to-indigo-600 shadow-sky-500/25 text-white',
  'flight': 'from-sky-400 via-blue-500 to-indigo-600 shadow-sky-500/25 text-white',
  'logistics': 'from-blue-500 via-indigo-600 to-violet-700 shadow-indigo-500/25 text-white',
  'fintech': 'from-emerald-400 via-teal-500 to-emerald-700 shadow-emerald-500/25 text-white',
  'finance': 'from-emerald-400 via-teal-500 to-emerald-700 shadow-emerald-500/25 text-white',
  'saas': 'from-violet-500 via-indigo-600 to-purple-700 shadow-violet-500/25 text-white',
  'crm': 'from-indigo-500 via-blue-600 to-cyan-600 shadow-indigo-500/25 text-white',
  'e-commerce': 'from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/25 text-white',
  'shopping': 'from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/25 text-white',
  'real estate': 'from-purple-500 via-violet-600 to-indigo-700 shadow-purple-500/25 text-white',
  'property': 'from-purple-500 via-violet-600 to-indigo-700 shadow-purple-500/25 text-white',
  'matrimonial': 'from-pink-500 via-rose-500 to-red-500 shadow-pink-500/25 text-white',
  'wedding': 'from-pink-500 via-rose-500 to-red-500 shadow-pink-500/25 text-white',
  'social': 'from-pink-400 via-fuchsia-500 to-purple-600 shadow-fuchsia-500/25 text-white',
  'hrms': 'from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'hr': 'from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'consulting': 'from-cyan-500 via-blue-600 to-indigo-700 shadow-cyan-500/25 text-white',
  'education': 'from-blue-500 via-indigo-600 to-violet-600 shadow-blue-500/25 text-white',
  'food': 'from-orange-400 via-amber-500 to-red-500 shadow-orange-500/25 text-white',
};

export function getCategoryGradient(category = '') {
  const cat = String(category || '').toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_GRADIENTS)) {
    if (cat.includes(key)) return val;
  }
  return 'from-violet-600 via-indigo-600 to-purple-700 shadow-violet-500/25 text-white';
}

export function isLikelyImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) return false;
  if (
    trimmed.includes('chatgpt.com') ||
    trimmed.includes('openai.com') ||
    trimmed.includes('wallpapersden.com') ||
    trimmed.includes('wallpaperflare.com') ||
    trimmed.includes('WhatsApp_Image_2026-07-09_at_2.02.12_PM_dg7hyd')
  ) {
    return false;
  }
  return true;
}

// All available visual previews / screenshots for a product
export function productAllImages(product) {
  if (!product) return [];
  const list = [];
  const seen = new Set();

  const addImage = (rawUrl) => {
    if (!rawUrl || !isLikelyImageUrl(rawUrl)) return;
    const resolved = resolveUrl(rawUrl);
    // Normalize URL key (strip query params, protocol, trailing slash) to deduplicate images
    const key = resolved.split('?')[0].replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(resolved);
    }
  };

  // 1. Primary: Use the showcase screenshots from gallery (set in Admin panel)
  if (Array.isArray(product.gallery) && product.gallery.length > 0) {
    product.gallery.forEach(addImage);
  }

  // 2. Fallback: If gallery was empty, use heroImage, overviewImage, or benefitsImage
  if (list.length === 0) {
    if (product.heroImage) addImage(product.heroImage);
    if (product.overviewImage) addImage(product.overviewImage);
    if (product.benefitsImage) addImage(product.benefitsImage);
  }

  // 3. Ensure at least 2 distinct views so the spotlight showcase can cycle smoothly
  if (list.length < 2) {
    const photos = photoIdsForProduct(product);
    photos.forEach((photoId) => {
      const url = `https://images.unsplash.com/photo-${photoId}?w=1600&h=1000&fit=crop&q=80`;
      addImage(url);
    });
  }

  return list;
}

