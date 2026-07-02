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

export const resolveUrl = (url) => (url && !/^https?:\/\//.test(url) ? `${BASE}${url}` : url);

const CATEGORY_PHOTOS = [
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
  const haystack = `${product.category || ''} ${product.title || ''}`;
  const found = CATEGORY_PHOTOS.find((c) => c.match.test(haystack));
  return found ? found.photos : DEFAULT_PHOTOS;
}

// A deterministic, category-relevant stock photo for a product. `salt` lets the
// same product get different (but stable) photos in different sections.
export function categoryImage(product, salt = '', width = 1600, height = 1000) {
  const photos = photoIdsForProduct(product);
  const seedKey = `${product.slug || product.title || 'product'}-${salt}`;
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) hash = (hash * 31 + seedKey.charCodeAt(i)) >>> 0;
  const photoId = photos[hash % photos.length];
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

// The best display image for a product: real uploaded image if available,
// otherwise a category-based placeholder. `salt` varies the placeholder.
export function productImage(product, salt = '', width = 1600, height = 1000) {
  if (product?.overviewImage) return resolveUrl(product.overviewImage);
  if (product?.heroImage) return resolveUrl(product.heroImage);
  if (product?.gallery?.length) return resolveUrl(product.gallery[0]);
  return categoryImage(product, salt, width, height);
}
