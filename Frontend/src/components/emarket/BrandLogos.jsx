import React from 'react';

// Crisp, high-precision SVG vector icons for official hardware manufacturers
export const BRAND_ICONS = {
  'nvidia': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#76B900]" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.948 10.744c.485-.292.93-.414 1.343-.414 1.157 0 1.942.84 1.942 2.062 0 1.192-.785 2.032-1.942 2.032-.413 0-.858-.122-1.343-.414v-3.266zm-2.02 5.093c1.077.587 2.229.866 3.42.866 2.518 0 4.298-1.745 4.298-4.329 0-2.583-1.78-4.329-4.298-4.329-1.191 0-2.343.279-3.42.866v6.926zm10.747-9.014c-1.99-1.353-4.48-2.08-7.327-2.08-3.082 0-5.83.843-7.948 2.398V4.872H0v14.256h2.4v-2.327c2.118 1.556 4.866 2.398 7.948 2.398 2.847 0 5.337-.727 7.327-2.08 2.148-1.46 3.325-3.528 3.325-5.996s-1.177-4.536-3.325-5.996zm-1.385 9.774c-1.57 1.054-3.57 1.62-5.942 1.62-2.528 0-4.665-.644-6.196-1.846v-7.66c1.531-1.202 3.668-1.846 6.196-1.846 2.372 0 4.372.566 5.942 1.62 1.678 1.127 2.612 2.76 2.612 4.886s-.934 3.759-2.612 4.886z"/>
    </svg>
  ),
  'raspberry pi': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#C51A4A]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.012 3.235c-.482-.823-1.56-.99-2.32-.403-.68.525-.795 1.516-.277 2.22.457.621 1.258.91 2.01.696-.062-.916.143-1.875.587-2.513zm-3.042.842c-.742-.315-1.637.038-1.99.782-.317.67-.008 1.488.665 1.83.6.304 1.34.135 1.77-.38-.073-.787-.073-1.643-.445-2.232zm6.064 0c-.372.589-.372 1.445-.445 2.232.43.515 1.17.684 1.77.38.673-.342.982-1.16.665-1.83-.353-.744-1.248-1.097-1.99-.782zm-3.022 2.673c-.752.214-1.553-.075-2.01-.696-.518-.704-.403-1.695.277-2.22.76-.587 1.838-.42 2.32.403.444.638.649 1.597.587 2.513-.393.078-.79.078-1.174 0zm-2.03 2.19c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm4.06 0c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm-6.12 3.1c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm8.18 0c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm-4.1 3.13c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm-3.06 1.05c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1zm6.12 0c-1.16 0-2.1.94-2.1 2.1s.94 2.1 2.1 2.1 2.1-.94 2.1-2.1-.94-2.1-2.1-2.1z"/>
    </svg>
  ),
  'arduino': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#00979D]" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 6C13.88 6 12.5 8.1 12 9.07 11.5 8.1 10.12 6 7.5 6 3.36 6 0 9.36 0 13.5S3.36 21 7.5 21c2.62 0 4-2.1 4.5-3.07.5.97 1.88 3.07 4.5 3.07 4.14 0 7.5-3.36 7.5-7.5S20.64 6 16.5 6zm-9 12.75c-2.9 0-5.25-2.35-5.25-5.25S4.6 8.25 7.5 8.25c2.32 0 3.75 2.17 4.25 3.25-.5 1.08-1.93 3.25-4.25 3.25zm9 0c-2.32 0-3.75-2.17-4.25-3.25.5-1.08 1.93-3.25 4.25-3.25 2.9 0 5.25 2.35 5.25 5.25s-2.35 5.25-5.25 5.25zM5.25 12.75h4.5v1.5h-4.5v-1.5zm11.25-2.25v2.25H14.25v1.5h2.25v2.25h1.5v-2.25h2.25v-1.5h-2.25V10.5h-1.5z"/>
    </svg>
  ),
  'espressif': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#E7352C]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l7.5 3.75v7.9L12 20.2l-7.5-3.75v-7.9L12 4.8zm-1 3.2v4h-2v2h2v4h2v-4h2v-2h-2V8h-2z"/>
    </svg>
  ),
  'unitree robotics': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#38BDF8]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm1 11a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
      <path d="M4 12a8 8 0 0113.66-5.66l-1.42 1.42A6 6 0 006 12H4zm16 0a8 8 0 01-13.66 5.66l1.42-1.42A6 6 0 0018 12h2z"/>
    </svg>
  ),
  'dji': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#000000] dark:text-[#FFFFFF]" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 7h4v2h-2v6h2v2h-4V7zm6 0h4c1.66 0 3 1.34 3 3v4c0 1.66-1.34 3-3 3h-4V7zm2 2v6h2c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1h-2zm6.5-2h2v10h-2V7z"/>
    </svg>
  ),
  'stmicroelectronics': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#03234B] dark:text-[#3B82F6]" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5h20v4H2V5zm0 5h14v4H2v-4zm0 5h18v4H2v-4z"/>
    </svg>
  ),
  'slamtec': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#10B981]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 1112 20v2a10 10 0 000-20z"/>
    </svg>
  ),
  'sensirion': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#06B6D4]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  'plaud.ai': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#8B5CF6]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3zm5 7v3a5 5 0 01-10 0V9H5v3a7 7 0 006 6.93V21H9v2h6v-2h-2v-2.07A7 7 0 0019 12V9h-2z"/>
    </svg>
  ),
  'huawei': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#FF0000]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8 6 6 10 6 14c0 3.31 2.69 6 6 6s6-2.69 6-6c0-4-2-8-6-12zm0 18c-2.21 0-4-1.79-4-4 0-2.8 1.5-6 4-9 2.5 3 4 6.2 4 9 0 2.21-1.79 4-4 4z"/>
    </svg>
  ),
  'kuka': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#EA580C]" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4h4v6l5-6h5l-6 7 7 9h-5l-5-7-1 1v6H3V4z"/>
    </svg>
  ),
  'sparkfun': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#E11D48]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L9 9H2l6 4.5L5.5 21 12 16.5 18.5 21 16 13.5l6-4.5h-7L12 2z"/>
    </svg>
  ),
  'apple': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-zinc-900 dark:text-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.74c.62-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.02-.49 2.64-1.24z"/>
    </svg>
  ),
  'home assistant': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#41BDF5]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 4.5l5 5V18h-3v-4H10v4H7v-6.5l5-5z"/>
    </svg>
  ),
  'rabbit': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#FF4500]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="9" cy="10" r="1.5" fill="#ffffff"/>
      <circle cx="15" cy="10" r="1.5" fill="#ffffff"/>
      <path d="M10 15c1 1 3 1 4 0" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'ecovacs': (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#0080FF]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"/>
      <rect x="7" y="11" width="10" height="2" rx="1" fill="#ffffff"/>
    </svg>
  ),
};

export const OFFICIAL_BRAND_IMAGES = {
  'nvidia': '/emarket/brands/nvidia.svg',
  'raspberry pi': '/emarket/brands/raspberry-pi.svg',
  'arduino': '/emarket/brands/arduino.svg',
  'espressif': '/emarket/brands/espressif.svg',
  'dji': '/emarket/brands/dji.svg',
  'stmicroelectronics': '/emarket/brands/stmicroelectronics.svg',
  'huawei': '/emarket/brands/huawei.svg',
  'sparkfun': '/emarket/brands/sparkfun.svg',
  'meta': '/emarket/brands/meta.svg',
  'sony': '/emarket/brands/sony.svg',
  'unitree': '/emarket/brands/unitree.svg',
};

export function getBrandLogo(brandName) {
  if (!brandName) return null;
  const key = brandName.toLowerCase();

  for (const [k, imgPath] of Object.entries(OFFICIAL_BRAND_IMAGES)) {
    if (key.includes(k)) {
      const isDarkLogo = k === 'sony' || k === 'dji';
      return (
        <img
          src={imgPath}
          alt={brandName}
          className={`w-full h-full object-contain ${isDarkLogo ? 'dark:brightness-0 dark:invert' : ''}`}
          loading="lazy"
        />
      );
    }
  }

  for (const [k, icon] of Object.entries(BRAND_ICONS)) {
    if (key.includes(k)) return icon;
  }

  // Default clean chip vector
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-violet-500" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2v2H4v2H2v12h2v2h2v2h12v-2h2v-2h2V6h-2V4h-2V2H6zm2 4h8v12H8V6zm2 2v8h4V8h-4z"/>
    </svg>
  );
}
