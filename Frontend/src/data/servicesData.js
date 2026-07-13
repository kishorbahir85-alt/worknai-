const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const servicesData = {

  /* ==================== DEVELOPMENT ==================== */

  'web3': {
    title: 'Web 3.0 Development',
    category: 'Development',
    subtitle: 'Leading the Web 3.0 revolution with blockchain, decentralized apps, and smart contracts that reshape digital trust.',
    hero: img('1639762681485-074b7f938ba0'),
    features: [
      { title: 'Blockchain Solutions', desc: 'We offer comprehensive blockchain development services, enabling businesses to harness decentralized networks. Our solutions enhance trust, security, and transparency across diverse industry domains.', image: img('1639322537228-f710d846310a') },
      { title: 'dApp Development', desc: 'We build decentralized applications that operate without central authority, giving users full control of their data and assets. Our dApps are secure, transparent, and highly performant.', image: img('1518770660439-4636190af475') },
      { title: 'Smart Contract Auditing', desc: 'We develop and audit smart contracts that automate complex business logic on the blockchain — eliminating intermediaries and reducing costs while ensuring reliability and security.', image: img('1620712943543-bcc4688e7485') },
    ],
    industries: [
      { title: 'Finance & Banking', desc: 'Blockchain-powered transactions that reduce fraud, lower fees, and enhance trust in financial systems.' },
      { title: 'Healthcare', desc: 'Secure interoperable health records and transparent pharmaceutical supply chains on distributed ledgers.' },
      { title: 'E-Commerce', desc: 'Decentralized marketplaces with smart contract payments and verifiable product authenticity.' },
      { title: 'Education', desc: 'Verifiable digital credentials, certificates, and decentralized course content ownership.' },
      { title: 'Supply Chain', desc: 'End-to-end product traceability from origin to consumer using immutable blockchain records.' },
      { title: 'Gaming', desc: 'NFT-powered game assets, true digital ownership, and play-to-earn economic models.' },
    ],
    challenges: [
      { title: 'Scalability', desc: 'We optimize blockchain networks and use Layer-2 solutions to handle high transaction volumes without sacrificing speed.' },
      { title: 'Security', desc: 'We conduct rigorous smart contract audits and penetration testing to protect against exploits and vulnerabilities.' },
      { title: 'Adoption Barriers', desc: 'We design intuitive UX that hides blockchain complexity, making Web 3.0 accessible to mainstream users.' },
    ],
    faqs: [
      { q: 'What is Web 3.0?', a: 'Web 3.0 is the next generation of the internet built on decentralized blockchain technology, offering greater privacy, user data ownership, and permissionless access.' },
      { q: 'What blockchain platforms do you work with?', a: 'We work with Ethereum, Polygon, Solana, Binance Smart Chain, and Hyperledger depending on your project\'s needs.' },
      { q: 'How long does a typical blockchain project take?', a: 'A simple smart contract can be delivered in 2-4 weeks. A full dApp with front-end integration typically takes 2-4 months.' },
      { q: 'Is blockchain development expensive?', a: 'Costs vary by complexity. We offer milestone-based pricing so you can start lean and scale as your project grows.' },
    ],
  },

  'ai-ml': {
    title: 'AI & Machine Learning',
    category: 'Development',
    subtitle: 'Intelligent solutions that learn, predict, and automate — transforming raw data into competitive advantage.',
    hero: img('1677442135703-1787eea5ce01'),
    features: [
      { title: 'Machine Learning Models', desc: 'We build custom ML models tailored to your data and business objectives — from predictive analytics and recommendation engines to fraud detection and demand forecasting.', image: img('1555255707-0e1e6ed8b21f') },
      { title: 'Natural Language Processing', desc: 'Our NLP solutions enable computers to understand, interpret, and generate human language — powering chatbots, sentiment analysis, document processing, and voice interfaces.', image: img('1531297484001-80022131f5a1') },
      { title: 'Computer Vision', desc: 'We develop vision systems that can identify objects, faces, defects, and patterns in images and video — ideal for quality control, security, retail, and healthcare diagnostics.', image: img('1518770660439-4636190af475') },
    ],
    industries: [
      { title: 'Healthcare', desc: 'AI-powered diagnostics, patient outcome prediction, and drug discovery acceleration.' },
      { title: 'Finance', desc: 'Fraud detection, credit scoring, algorithmic trading, and risk assessment models.' },
      { title: 'Retail', desc: 'Personalized recommendations, demand forecasting, and intelligent inventory management.' },
      { title: 'Manufacturing', desc: 'Predictive maintenance, defect detection, and process optimization using machine vision.' },
      { title: 'Logistics', desc: 'Route optimization, delivery time prediction, and warehouse automation with AI.' },
      { title: 'Education', desc: 'Adaptive learning platforms, automated grading, and personalized student journeys.' },
    ],
    challenges: [
      { title: 'Data Quality', desc: 'We help you collect, clean, and structure quality training data — the foundation of every reliable AI model.' },
      { title: 'Model Accuracy', desc: 'We use rigorous validation, hyperparameter tuning, and ensemble methods to maximize model performance.' },
      { title: 'Ethical AI', desc: 'We design fair, transparent, and explainable AI systems that comply with data privacy regulations.' },
    ],
    faqs: [
      { q: 'Do I need a large dataset to use AI?', a: 'Not always. We use transfer learning and synthetic data generation techniques that work effectively with smaller datasets.' },
      { q: 'How do you handle data privacy?', a: 'We implement data anonymization, on-premise model training, and GDPR-compliant data handling practices.' },
      { q: 'What is the difference between AI and ML?', a: 'AI is the broad concept of machines performing intelligent tasks. Machine Learning is a subset where machines learn patterns from data without being explicitly programmed.' },
      { q: 'How long does it take to build an AI model?', a: 'A basic model takes 4-8 weeks. Production-grade ML systems with data pipelines typically take 3-6 months.' },
    ],
  },

  'coding': {
    title: 'Coding & Development',
    category: 'Development',
    subtitle: 'Clean, scalable, and well-tested code built by engineers who ship products for real users.',
    hero: img('1461749280684-dccba630e2f6'),
    features: [
      { title: 'Full Stack Development', desc: 'From React frontends to Node.js backends and MongoDB databases — we build complete, production-ready web applications that are fast, secure, and maintainable.', image: img('1498050108023-c5249f4df085') },
      { title: 'API Development & Integration', desc: 'We design and build RESTful and GraphQL APIs that connect your systems, third-party services, and mobile apps into a cohesive, well-documented ecosystem.', image: img('1522252234503-e356a8816b93') },
      { title: 'Code Review & Optimization', desc: 'We audit existing codebases for performance bottlenecks, security vulnerabilities, and technical debt — then refactor for long-term maintainability and speed.', image: img('1517245386807-bb43f82c33c4') },
    ],
    industries: [
      { title: 'Startups', desc: 'MVP development with lean architecture — built to validate fast and scale when ready.' },
      { title: 'Enterprise', desc: 'Large-scale system development with microservices, CI/CD pipelines, and DevOps integration.' },
      { title: 'E-Commerce', desc: 'High-performance online stores with payment gateways, inventory management, and real-time order tracking.' },
      { title: 'Healthcare', desc: 'HIPAA-compliant applications for patient management, telemedicine, and clinical workflows.' },
      { title: 'Finance', desc: 'Secure, high-availability fintech platforms with real-time data processing and regulatory compliance.' },
      { title: 'Education', desc: 'Learning management systems, student portals, and interactive course platforms.' },
    ],
    challenges: [
      { title: 'Code Quality', desc: 'We enforce strict coding standards, automated testing, and peer code reviews on every project.' },
      { title: 'Scalability', desc: 'We design systems with horizontal scaling, caching layers, and database optimization from day one.' },
      { title: 'Delivery Speed', desc: 'We use agile sprints, CI/CD automation, and modular architecture to ship features faster without breaking things.' },
    ],
    faqs: [
      { q: 'Which tech stack do you specialize in?', a: 'We primarily work with the MERN stack (MongoDB, Express, React, Node.js), but also handle Python, .NET, PHP, and Flutter.' },
      { q: 'Do you follow coding standards?', a: 'Yes — we follow clean code principles, use ESLint/Prettier, write unit and integration tests, and document all APIs.' },
      { q: 'Can you take over an existing project?', a: 'Absolutely. We start with a code audit, understand the existing architecture, and integrate seamlessly into your workflow.' },
      { q: 'Do you provide post-launch support?', a: 'Yes, we offer flexible retainer plans for bug fixes, feature additions, and performance monitoring.' },
    ],
  },

  'mobile-app': {
    title: 'Mobile App Development',
    category: 'Development',
    subtitle: 'Native and cross-platform mobile apps that users love — designed for performance, simplicity, and scale.',
    hero: img('1512941937669-90a1b58e7e9c'),
    features: [
      { title: 'Android Development', desc: 'We build native Android apps in Kotlin and Java — optimized for performance, battery efficiency, and the full Android device ecosystem from budget to flagship.', image: img('1551650992-ee4fd47df41f') },
      { title: 'Cross-Platform with Flutter', desc: 'Using Flutter, we deliver beautiful, natively compiled apps for both iOS and Android from a single codebase — cutting development time in half without sacrificing quality.', image: img('1565849904461-04a58ad377e0') },
      { title: 'App UI/UX Design', desc: 'Our designers craft intuitive, visually stunning mobile interfaces that reduce friction, increase engagement, and keep users coming back — backed by user research and A/B testing.', image: img('1581291518857-4d27a822408d') },
    ],
    industries: [
      { title: 'Retail & Shopping', desc: 'Feature-rich shopping apps with personalized feeds, AR try-on, and one-click checkout.' },
      { title: 'Healthcare', desc: 'Patient-facing apps for appointment booking, teleconsultation, and medication reminders.' },
      { title: 'Logistics', desc: 'Driver and delivery management apps with real-time GPS, route optimization, and proof of delivery.' },
      { title: 'Finance', desc: 'Secure banking and investment apps with biometric authentication and real-time transaction tracking.' },
      { title: 'Education', desc: 'Interactive learning apps with video lessons, quizzes, progress tracking, and offline support.' },
      { title: 'Food & Beverage', desc: 'Restaurant apps with menu ordering, table reservations, loyalty rewards, and delivery tracking.' },
    ],
    challenges: [
      { title: 'Performance', desc: 'We profile and optimize apps for smooth 60fps animations, fast load times, and minimal battery drain on all devices.' },
      { title: 'Multiple Platforms', desc: 'We use shared codebases and design systems to maintain consistency across iOS and Android without duplicating effort.' },
      { title: 'App Store Approval', desc: 'We handle App Store and Google Play submissions, ensuring compliance with policies to avoid rejections and delays.' },
    ],
    faqs: [
      { q: 'Should I build native or cross-platform?', a: 'For most business apps, Flutter cross-platform is the best balance of cost and quality. Native is recommended only for performance-critical or hardware-intensive apps.' },
      { q: 'How long does app development take?', a: 'A simple app takes 6-10 weeks. A feature-rich social or e-commerce app typically takes 4-6 months.' },
      { q: 'Do you handle app store publishing?', a: 'Yes — we manage the complete Google Play and Apple App Store submission process including screenshots, descriptions, and compliance checks.' },
      { q: 'Will the app work offline?', a: 'We can implement offline-first architecture with local storage and background sync for apps that need to work without internet.' },
    ],
  },

  'software': {
    title: 'Software Development',
    category: 'Development',
    subtitle: 'Enterprise-grade software tailored to your exact business processes — built to grow with you.',
    hero: img('1531297484001-80022131f5a1'),
    features: [
      { title: 'Custom Enterprise Software', desc: 'We build bespoke software systems that automate your business operations — replacing spreadsheets and legacy tools with modern, integrated platforms that save time and reduce errors.', image: img('1504868584819-f8e8b4b6d7e3') },
      { title: 'SaaS Product Development', desc: 'From concept to cloud — we design and build multi-tenant SaaS products with subscription billing, role-based access, usage analytics, and the infrastructure to support thousands of customers.', image: img('1460925895917-afdab827c52f') },
      { title: 'Legacy System Migration', desc: 'We modernize outdated software by migrating to cloud-native architectures, modern tech stacks, and microservices — with zero data loss and minimal disruption to your business.', image: img('1558494949-ef010cbdcc31') },
    ],
    industries: [
      { title: 'Healthcare', desc: 'Hospital management systems, clinical workflow automation, and patient data platforms.' },
      { title: 'Finance', desc: 'Accounting software, ERP systems, and compliance management platforms.' },
      { title: 'Manufacturing', desc: 'Production planning, inventory management, and quality control systems.' },
      { title: 'Retail', desc: 'Point-of-sale systems, supply chain software, and customer loyalty platforms.' },
      { title: 'Government', desc: 'Citizen services portals, document management, and e-governance systems.' },
      { title: 'Education', desc: 'Student information systems, fee management, and learning analytics platforms.' },
    ],
    challenges: [
      { title: 'System Integration', desc: 'We design robust APIs and middleware to connect your new software with existing tools, databases, and third-party services.' },
      { title: 'User Adoption', desc: 'We involve your team throughout the design process and deliver training materials to ensure smooth onboarding and high adoption.' },
      { title: 'Data Security', desc: 'We implement role-based access, end-to-end encryption, audit logs, and regular security patches to protect sensitive business data.' },
    ],
    faqs: [
      { q: 'How is custom software different from off-the-shelf solutions?', a: 'Custom software is built exactly for your workflows. You own it, it grows with you, and you never pay per-seat licensing fees.' },
      { q: 'Do you provide a warranty after delivery?', a: 'Yes — we provide a minimum 3-month bug-fix warranty post-delivery, and ongoing maintenance contracts are available.' },
      { q: 'How do you handle changing requirements?', a: 'We use agile methodology with 2-week sprints, so requirements can evolve and be reprioritized throughout the project.' },
      { q: 'Who owns the source code?', a: 'You do. We transfer full source code ownership upon project completion.' },
    ],
  },

  /* ==================== SOLUTIONS ==================== */

  'fintech': {
    title: 'FinTech Solutions',
    category: 'Solutions',
    subtitle: 'Powerful financial technology that modernizes banking, payments, and investment — securely and at scale.',
    hero: img('1611974789855-9c2a0a7236a3'),
    features: [
      { title: 'Payment Gateway Integration', desc: 'We integrate and build payment solutions that handle credit cards, UPI, wallets, and BNPL — with PCI-DSS compliance, fraud detection, and real-time transaction monitoring.', image: img('1556742049-0cfed4f6a45d') },
      { title: 'Digital Banking Software', desc: 'We develop core banking platforms and neobank applications with account management, transaction history, KYC/AML compliance, and open banking API support.', image: img('1563986768494-4759ab7b0f72') },
      { title: 'Investment & Wealth Platforms', desc: 'From robo-advisors to portfolio trackers, we build tools that democratize investing — with real-time market data, automated rebalancing, and tax-loss harvesting features.', image: img('1611974789855-9c2a0a7236a3') },
    ],
    industries: [
      { title: 'Banking', desc: 'Digital branches, mobile banking apps, and loan origination systems.' },
      { title: 'Insurance', desc: 'Policy management, claims automation, and usage-based insurance platforms.' },
      { title: 'Wealth Management', desc: 'Portfolio management tools, robo-advisors, and client reporting dashboards.' },
      { title: 'Cryptocurrency', desc: 'Crypto exchanges, wallet apps, and DeFi protocol interfaces.' },
      { title: 'Lending', desc: 'Peer-to-peer lending platforms, credit scoring systems, and loan management software.' },
      { title: 'Payments', desc: 'QR payment systems, split billing apps, and merchant payment solutions.' },
    ],
    challenges: [
      { title: 'Regulatory Compliance', desc: 'We stay current with RBI, SEBI, and international regulations to ensure your platform operates within legal boundaries at all times.' },
      { title: 'Security', desc: 'We implement bank-grade encryption, multi-factor authentication, and real-time fraud monitoring to protect every transaction.' },
      { title: 'User Trust', desc: 'We design transparent, intuitive interfaces with clear fee disclosures and audit trails that build long-term user confidence.' },
    ],
    faqs: [
      { q: 'What compliance standards do you follow?', a: 'We design for PCI-DSS, RBI guidelines, KYC/AML requirements, and GDPR/PDPB data privacy standards.' },
      { q: 'Can you integrate with existing banking systems?', a: 'Yes — we have experience integrating with core banking systems via standard APIs and custom middleware solutions.' },
      { q: 'How do you prevent fraud?', a: 'We implement machine learning-based anomaly detection, velocity checks, device fingerprinting, and behavioral analytics.' },
      { q: 'Do you offer white-label FinTech products?', a: 'Yes — we offer white-label payment gateways and lending modules that can be customized and launched under your brand.' },
    ],
  },

  'e-learning': {
    title: 'E-Learning Solutions',
    category: 'Solutions',
    subtitle: 'Engaging digital education platforms that deliver knowledge to learners anywhere, anytime, on any device.',
    hero: img('1456513080510-7bf3a84b82f8'),
    features: [
      { title: 'Learning Management System', desc: 'We build full-featured LMS platforms with course creation tools, video hosting, assessments, progress tracking, certificates, and discussion forums — tailored to your institution or business.', image: img('1501504905252-8e3e4cf5a213') },
      { title: 'Virtual Classroom', desc: 'We integrate live video sessions, collaborative whiteboards, breakout rooms, and attendance tracking into seamless virtual classroom experiences for synchronous learning.', image: img('1488190211105-8b0e65b80b4e') },
      { title: 'Gamified Learning', desc: 'We design game-inspired learning experiences with badges, leaderboards, points, and progress streaks that dramatically improve completion rates and knowledge retention.', image: img('1513475382585-d06e58bcb0e0') },
    ],
    industries: [
      { title: 'Schools & Universities', desc: 'Digital campuses with attendance tracking, assignments, grading, and parent portals.' },
      { title: 'Corporate Training', desc: 'Employee onboarding, compliance training, and skill development programs at scale.' },
      { title: 'Certification Bodies', desc: 'Online exam platforms with proctoring, time limits, and instant digital certificates.' },
      { title: 'Healthcare Training', desc: 'CME credit tracking, clinical simulation modules, and medical education platforms.' },
      { title: 'Government', desc: 'Civil servant training portals, public awareness campaigns, and skill development initiatives.' },
      { title: 'EdTech Startups', desc: 'Subscription-based course marketplaces with instructor dashboards and revenue sharing.' },
    ],
    challenges: [
      { title: 'Learner Engagement', desc: 'We design micro-learning modules, interactive elements, and push notifications to maintain learner motivation through completion.' },
      { title: 'Content Management', desc: 'We build easy-to-use CMS tools that allow instructors to upload, update, and organize course materials without technical knowledge.' },
      { title: 'Accessibility', desc: 'We ensure platforms meet WCAG accessibility standards with closed captions, screen reader support, and offline download options.' },
    ],
    faqs: [
      { q: 'Can learners access courses on mobile?', a: 'Yes — all our e-learning platforms are fully mobile-responsive, and we also offer native mobile apps with offline video playback.' },
      { q: 'Do you support live classes?', a: 'Yes — we integrate with Zoom, Google Meet, or build custom WebRTC-based live streaming for virtual classrooms.' },
      { q: 'Can courses be sold to external students?', a: 'Absolutely — we build marketplace-style platforms with Razorpay/Stripe integration for course purchases and subscription plans.' },
      { q: 'What video formats are supported?', a: 'We support MP4, WebM, and YouTube/Vimeo embeds. We also implement adaptive bitrate streaming for smooth playback on slow connections.' },
    ],
  },

  'e-commerce': {
    title: 'E-Commerce Development',
    category: 'Solutions',
    subtitle: 'High-converting online stores and marketplaces built for growth, speed, and seamless customer experiences.',
    hero: img('1563013544-824ae1b704d3'),
    features: [
      { title: 'Custom Online Store', desc: 'We build bespoke e-commerce stores from scratch — with dynamic product catalogs, advanced filtering, wishlists, reviews, and a checkout flow optimized for maximum conversion.', image: img('1516321318423-f06f85e504b3') },
      { title: 'Multi-vendor Marketplace', desc: 'We develop platforms like Amazon or Flipkart — where multiple sellers can list products, manage inventory, and receive payouts — with admin oversight and commission management.', image: img('1472851294608-062f824d29cc') },
      { title: 'Headless Commerce', desc: 'We architect headless e-commerce solutions that separate the frontend from the backend, enabling blazing-fast storefronts with full flexibility to use any CMS, framework, or channel.', image: img('1460925895917-afdab827c52f') },
    ],
    industries: [
      { title: 'Fashion & Apparel', desc: 'Size guides, virtual try-on, and look-book features for fashion e-commerce.' },
      { title: 'Electronics', desc: 'Spec comparison, EMI options, and warranty management for electronics stores.' },
      { title: 'Food & Grocery', desc: 'Slot-based delivery, freshness tracking, and subscription orders for food e-commerce.' },
      { title: 'Home & Living', desc: 'AR room preview, bulk order pricing, and interior design integration for home stores.' },
      { title: 'Sports & Fitness', desc: 'Product bundles, membership subscriptions, and live stream shopping for sports brands.' },
      { title: 'Automotive', desc: 'Parts search by vehicle model, fitment guides, and B2B wholesale pricing for auto parts.' },
    ],
    challenges: [
      { title: 'Cart Abandonment', desc: 'We implement exit-intent popups, email recovery sequences, and one-click checkout to recover lost sales.' },
      { title: 'Performance', desc: 'We optimize page speed with lazy loading, CDN delivery, and database indexing to ensure fast load times even under peak traffic.' },
      { title: 'Logistics Integration', desc: 'We integrate with Shiprocket, Delhivery, and other logistics providers for real-time shipment tracking and automated label generation.' },
    ],
    faqs: [
      { q: 'Which payment gateways do you support?', a: 'We integrate Razorpay, PayU, Stripe, PayPal, and COD — plus UPI, wallets, and EMI options popular in India.' },
      { q: 'Can I manage the store myself?', a: 'Yes — we build intuitive admin dashboards where you can manage products, orders, discounts, and reports without any coding.' },
      { q: 'Do you handle SEO for the store?', a: 'Yes — we implement structured data, canonical URLs, sitemap generation, and page speed optimization for strong organic rankings.' },
      { q: 'Can the store handle high traffic?', a: 'Our stores are deployed on cloud infrastructure with auto-scaling, load balancing, and CDN to handle traffic spikes like sales events.' },
    ],
  },

  'e-health': {
    title: 'E-Health Solutions',
    category: 'Solutions',
    subtitle: 'Digital health technology that connects patients and providers — improving outcomes through data and innovation.',
    hero: img('1576091160399-112ba8d25d1d'),
    features: [
      { title: 'Telemedicine Platform', desc: 'We build HIPAA-compliant telemedicine platforms with video consultations, e-prescriptions, appointment scheduling, and secure patient-doctor messaging — accessible from any device.', image: img('1559757148-5c350d0d3c56') },
      { title: 'Electronic Health Records', desc: 'We develop EHR systems that centralize patient data — medical history, lab results, imaging, and prescriptions — with HL7/FHIR compatibility for interoperability across healthcare providers.', image: img('1576091160399-112ba8d25d1d') },
      { title: 'Health Monitoring Apps', desc: 'We create patient-facing health apps that track vitals, medications, fitness data, and chronic disease metrics — syncing with wearables and alerting care teams to anomalies.', image: img('1571019613454-1cb2f99b2d8b') },
    ],
    industries: [
      { title: 'Hospitals & Clinics', desc: 'OPD management, bed tracking, billing automation, and inter-department workflow systems.' },
      { title: 'Pharmacies', desc: 'Digital prescription verification, inventory management, and online medicine ordering platforms.' },
      { title: 'Insurance', desc: 'Claims automation, cashless hospitalization portals, and policy management for health insurers.' },
      { title: 'Medical Research', desc: 'Clinical trial management, patient recruitment platforms, and data collection tools.' },
      { title: 'Wellness', desc: 'Fitness tracking apps, mental health platforms, and nutrition monitoring tools.' },
      { title: 'Diagnostics', desc: 'Lab report sharing, home sample collection booking, and AI-assisted diagnostic tools.' },
    ],
    challenges: [
      { title: 'Data Privacy', desc: 'We implement HIPAA-compliant architecture with end-to-end encryption, audit logs, and strict access controls to protect patient information.' },
      { title: 'System Integration', desc: 'We ensure seamless data exchange between EHR systems, labs, pharmacies, and insurance platforms using HL7 and FHIR standards.' },
      { title: 'Regulatory Compliance', desc: 'We design platforms in compliance with DISHA, NDHM, and state health regulations applicable in India and internationally.' },
    ],
    faqs: [
      { q: 'Is telemedicine legal in India?', a: 'Yes — the Telemedicine Practice Guidelines 2020 by the Government of India legally permit online consultations by registered medical practitioners.' },
      { q: 'Can we integrate with existing hospital software?', a: 'Yes — we integrate with popular HMS like Practo, Cerner, and custom hospital systems through standard APIs and HL7/FHIR protocols.' },
      { q: 'Does the platform work on mobile?', a: 'All our e-health platforms are mobile-first with native Android/iOS apps for both patients and healthcare providers.' },
      { q: 'How is patient data stored?', a: 'Patient data is encrypted at rest and in transit, stored in secure cloud infrastructure with daily backups and geo-redundancy.' },
    ],
  },

  'realty': {
    title: 'Realty Management',
    category: 'Solutions',
    subtitle: 'Smart property technology that simplifies listing, selling, managing, and investing in real estate.',
    hero: img('1560520031-3a4dc4e9de0c'),
    features: [
      { title: 'Property Listing Platform', desc: 'We build real estate portals with advanced search filters, map-based browsing, virtual 360° tours, and EMI calculators — helping buyers find properties faster and developers close deals quicker.', image: img('1558618666-fcd25c85cd64') },
      { title: 'CRM for Real Estate', desc: 'Our real estate CRM tracks leads from inquiry to closure — with automated follow-ups, site visit scheduling, inventory management, and commission tracking for your sales team.', image: img('1486325212027-8081e485255e') },
      { title: 'Property Management System', desc: 'For landlords and property managers — we build systems that handle rent collection, maintenance requests, tenant communication, lease renewals, and financial reporting in one dashboard.', image: img('1560520031-3a4dc4e9de0c') },
    ],
    industries: [
      { title: 'Real Estate Agents', desc: 'Lead management, property matching, and automated client communication for agents.' },
      { title: 'Builders & Developers', desc: 'Project launch portals, booking management, and construction progress tracking for developers.' },
      { title: 'Co-living Operators', desc: 'Room allocation, facility booking, and community management for co-living businesses.' },
      { title: 'Commercial Leasing', desc: 'Tenant management, lease agreements, and CAM charge tracking for commercial properties.' },
      { title: 'Property Management', desc: 'Multi-property maintenance scheduling, vendor management, and owner reporting portals.' },
      { title: 'Rental Platforms', desc: 'Tenant screening, rent collection, and security deposit management for rental businesses.' },
    ],
    challenges: [
      { title: 'Document Management', desc: 'We build secure document repositories for agreements, NOCs, and title documents with e-signature support for paperless transactions.' },
      { title: 'Market Data', desc: 'We integrate real-time property valuation data, price trends, and neighborhood analytics to help buyers and sellers make informed decisions.' },
      { title: 'Virtual Tours', desc: 'We integrate 360° virtual tour technology and AR-based floor plan visualization to help buyers experience properties remotely.' },
    ],
    faqs: [
      { q: 'Can the platform list properties from multiple builders?', a: 'Yes — we build multi-developer portals where builders can manage their own listings, pricing, and inventory independently.' },
      { q: 'Do you support online booking and payments?', a: 'Yes — we integrate token amount payment, booking forms, and agreement generation directly into the platform.' },
      { q: 'Can tenants raise maintenance requests online?', a: 'Absolutely — tenants can submit requests with photos, track status, and rate service through the tenant portal.' },
      { q: 'Is data secure for property transactions?', a: 'All transaction data is encrypted, and document access is role-based to ensure only authorized parties can view sensitive information.' },
    ],
  },

  'vehicle': {
    title: 'Vehicle Management',
    category: 'Solutions',
    subtitle: 'Complete fleet management technology that tracks, optimizes, and reduces the cost of every vehicle in your operation.',
    hero: img('1503376780353-7e6692767b70'),
    features: [
      { title: 'Fleet Tracking & Telematics', desc: 'Real-time GPS tracking, geofencing alerts, speed monitoring, and route history for your entire fleet — accessible from a centralized dashboard on any device.', image: img('1449965408869-eefb5d3b303e') },
      { title: 'Driver Management', desc: 'Driver scorecards, behavior analytics, license expiry alerts, and performance leaderboards that improve safety culture and reduce accident liability across your fleet.', image: img('1503376780353-7e6692767b70') },
      { title: 'Maintenance Scheduling', desc: 'Predictive maintenance alerts based on mileage, engine hours, and service history — with automated workshop booking, cost tracking, and spare parts inventory management.', image: img('1527684651001-731c474bbb5a') },
    ],
    industries: [
      { title: 'Logistics & Delivery', desc: 'Route optimization, proof of delivery, and real-time customer ETA updates for logistics operations.' },
      { title: 'Ride-sharing', desc: 'Driver apps, passenger apps, dynamic pricing, and real-time matching for cab and bike services.' },
      { title: 'Corporate Fleet', desc: 'Employee cab booking, trip approval workflows, and monthly billing for corporate transport.' },
      { title: 'Public Transport', desc: 'Passenger apps with live bus tracking, digital ticketing, and route management for operators.' },
      { title: 'Last-mile Delivery', desc: 'Micro-delivery optimization, cash collection tracking, and delivery partner management.' },
      { title: 'Vehicle Rental', desc: 'Online booking, keyless access, damage reporting, and subscription plan management for rental operators.' },
    ],
    challenges: [
      { title: 'Real-time Tracking', desc: 'We use IoT GPS devices, WebSocket connections, and efficient data pipelines to deliver sub-30-second location updates at scale.' },
      { title: 'Fuel Management', desc: 'We integrate fuel sensors and consumption analytics to identify wastage, prevent fraud, and optimize fuel spend across the fleet.' },
      { title: 'Compliance', desc: 'We track permit expiry, fitness certificates, insurance renewals, and driver license validity with automated alerts before deadlines.' },
    ],
    faqs: [
      { q: 'What GPS hardware do you recommend?', a: 'We work with hardware-agnostic solutions compatible with popular Indian providers like Teltonika, Meitrack, and Concox.' },
      { q: 'Can drivers use the system on their phones?', a: 'Yes — we build driver apps for Android with trip acceptance, navigation, customer OTP, and earnings tracking.' },
      { q: 'How many vehicles can the system handle?', a: 'Our platform is architected to handle thousands of concurrent vehicle connections with auto-scaling cloud infrastructure.' },
      { q: 'Can I set geofence alerts?', a: 'Yes — create zones for depots, customer sites, or restricted areas and receive instant alerts when vehicles enter or exit.' },
    ],
  },

  /* ==================== RESOURCE OUTSOURCING ==================== */

  'virtual-staff': {
    title: 'Virtual Staff',
    category: 'Resource Outsourcing',
    subtitle: 'Skilled remote professionals who integrate into your team — delivering quality work across time zones.',
    hero: img('1588196749597-9ff075ee6b5b'),
    features: [
      { title: 'Dedicated Remote Teams', desc: 'We provide dedicated remote developers, designers, marketers, and analysts who work exclusively on your projects — fully integrated into your tools, processes, and culture.', image: img('1521737604893-d14f6c71e4e7') },
      { title: 'Staff Augmentation', desc: 'When your in-house team needs extra capacity, we quickly place skilled professionals who can hit the ground running — no lengthy hiring process, no long-term commitments required.', image: img('1528605248644-14dd04022da1') },
      { title: 'Managed Remote Squads', desc: 'We assemble and manage complete project squads with developers, QA, designers, and a project manager — you get the output, we handle the team operations.', image: img('1553877522-43269d4ea984') },
    ],
    industries: [
      { title: 'Information Technology', desc: 'Full-stack developers, DevOps engineers, and QA testers on demand.' },
      { title: 'Digital Marketing', desc: 'SEO specialists, content writers, social media managers, and ad campaign managers.' },
      { title: 'Finance & Accounting', desc: 'Bookkeepers, accountants, and financial analysts for remote finance operations.' },
      { title: 'Customer Support', desc: 'Chat support, email support, and voice agents for 24/7 customer service operations.' },
      { title: 'Design', desc: 'UI/UX designers, graphic designers, and video editors for creative requirements.' },
      { title: 'Research & Analysis', desc: 'Market researchers, data analysts, and business intelligence professionals.' },
    ],
    challenges: [
      { title: 'Communication', desc: 'We set up structured daily standups, project management tools, and clear escalation paths to keep remote teams aligned.' },
      { title: 'Quality Control', desc: 'We maintain quality through peer reviews, sprint demos, and defined acceptance criteria for every deliverable.' },
      { title: 'Time Zones', desc: 'We match staff to your business hours and implement async communication best practices for smooth cross-timezone collaboration.' },
    ],
    faqs: [
      { q: 'How quickly can you provide virtual staff?', a: 'For most roles, we can onboard a vetted professional within 3-7 business days.' },
      { q: 'Can I interview the staff before hiring?', a: 'Yes — we shortlist candidates and arrange technical interviews and trial tasks so you can evaluate fit before committing.' },
      { q: 'What tools do virtual staff use?', a: 'They work in your tools — Slack, Jira, GitHub, Figma, or whatever your team uses — ensuring seamless collaboration.' },
      { q: 'What if the assigned staff is not a good fit?', a: 'We offer a replacement guarantee — if you are not satisfied within the first 2 weeks, we replace the resource at no extra charge.' },
    ],
  },

  'offshore': {
    title: 'Offshore Employee',
    category: 'Resource Outsourcing',
    subtitle: 'Build high-performing offshore teams that deliver enterprise-quality work at a fraction of local hiring costs.',
    hero: img('1486312338219-ce68d2c6f44d'),
    features: [
      { title: 'Offshore Talent Sourcing', desc: 'We identify, vet, and place skilled offshore employees across engineering, design, operations, and support functions — handling background checks, technical assessments, and cultural alignment.', image: img('1573496359142-b8d87734a5a2') },
      { title: 'Dedicated Offshore Center', desc: 'We set up and operate dedicated offshore development centers under your brand — with office space, infrastructure, HR, payroll, and management handled entirely by us.', image: img('1522202176988-66273c7fd1f5') },
      { title: 'Project Outsourcing', desc: 'For complete project delivery, we assemble end-to-end offshore teams with defined SOWs, SLAs, and milestone-based delivery — giving you results without the overhead of managing the team.', image: img('1521737604893-d14f6c71e4e7') },
    ],
    industries: [
      { title: 'Software Development', desc: 'Offshore engineering teams for web, mobile, cloud, and AI development projects.' },
      { title: 'BPO & Back Office', desc: 'Data entry, claims processing, and business process outsourcing at scale.' },
      { title: 'Finance', desc: 'Offshore accounting, financial analysis, and bookkeeping for global businesses.' },
      { title: 'Healthcare BPO', desc: 'Medical coding, billing, transcription, and patient support operations.' },
      { title: 'E-Commerce', desc: 'Product listing, catalog management, customer service, and returns processing.' },
      { title: 'Legal Support', desc: 'Paralegal support, document review, contract drafting, and IP research.' },
    ],
    challenges: [
      { title: 'Cultural Alignment', desc: 'We provide cross-cultural training and facilitate team-building activities to bridge cultural differences and build cohesive teams.' },
      { title: 'IP Protection', desc: 'We implement strict NDAs, code ownership clauses, and security protocols to protect your intellectual property.' },
      { title: 'Management Overhead', desc: 'Our embedded team leads and project managers act as your on-the-ground management layer, eliminating the need for you to micromanage offshore staff.' },
    ],
    faqs: [
      { q: 'What is the cost advantage of offshore hiring?', a: 'Offshore hiring in India typically costs 40-70% less than equivalent talent in the US, UK, or Australia, including all management overhead.' },
      { q: 'Who manages the offshore employees day-to-day?', a: 'We provide a dedicated account manager and team lead who handle day-to-day management, attendance, and performance monitoring.' },
      { q: 'Can offshore employees attend our internal meetings?', a: 'Yes — we schedule overlapping work hours with your time zone to ensure real-time collaboration for critical meetings.' },
      { q: 'How is payroll handled?', a: 'We handle all payroll, statutory compliance, and benefits in India. You pay us a single monthly invoice.' },
    ],
  },

  'eor': {
    title: 'EOR Services',
    category: 'Resource Outsourcing',
    subtitle: 'Employer of Record services that let you hire talent in India without setting up a legal entity.',
    hero: img('1553877522-43269d4ea984'),
    features: [
      { title: 'Employer of Record', desc: 'We become the legal employer for your India-based workforce — handling employment contracts, statutory registrations, PF/ESI enrollment, and full compliance so you can focus on managing the work.', image: img('1507003211169-0a1dd7228f2d') },
      { title: 'Payroll Management', desc: 'We process monthly payroll, compute TDS, issue payslips, and handle full-and-final settlements — ensuring error-free, on-time payments with 100% statutory compliance.', image: img('1611974789855-9c2a0a7236a3') },
      { title: 'HR & Compliance', desc: 'From offer letters to exit formalities — we manage the entire employee lifecycle including leave management, appraisals, disciplinary procedures, and labour law compliance.', image: img('1553877522-43269d4ea984') },
    ],
    industries: [
      { title: 'Technology', desc: 'EOR for global tech companies hiring software engineers and IT professionals in India.' },
      { title: 'Marketing Agencies', desc: 'Compliant hiring for digital marketers, content creators, and campaign managers.' },
      { title: 'Finance', desc: 'EOR solutions for analysts, accountants, and financial professionals in India.' },
      { title: 'Legal Firms', desc: 'Compliant engagement of legal researchers, paralegals, and contract specialists.' },
      { title: 'Manufacturing', desc: 'EOR for back-office, procurement, and quality control professionals in manufacturing.' },
      { title: 'Healthcare', desc: 'EOR for medical billing, telehealth support, and clinical data management staff.' },
    ],
    challenges: [
      { title: 'Multi-State Compliance', desc: 'We navigate the complexity of India\'s state-specific labour laws, professional tax rates, and shops & establishments regulations.' },
      { title: 'Benefits Administration', desc: 'We design and administer competitive benefits packages — health insurance, gratuity, PF, and leave policies — that help attract and retain top talent.' },
      { title: 'Rapid Onboarding', desc: 'We onboard new hires within 48 hours, handling all paperwork, background verification, and system access setup.' },
    ],
    faqs: [
      { q: 'Do I need an Indian entity to use EOR?', a: 'No — that\'s the whole point of EOR. We act as the legal employer in India so you don\'t need to register a company here.' },
      { q: 'Who controls the employee\'s work?', a: 'You do. EOR is purely an administrative arrangement — you direct the employee\'s work, tasks, and goals as if they are your own.' },
      { q: 'What statutory benefits are employees entitled to?', a: 'Employees receive PF, ESI (where applicable), gratuity, paid leave, and health insurance as per Indian labour laws.' },
      { q: 'Can we convert EOR employees to direct employees later?', a: 'Yes — once you establish your own entity in India, we facilitate a smooth transfer of employment with zero disruption.' },
    ],
  },

  'it-infra': {
    title: 'IT Infrastructure',
    category: 'Resource Outsourcing',
    subtitle: 'Reliable, secure, and scalable IT infrastructure that keeps your business running 24/7 without interruption.',
    hero: img('1558494949-ef010cbdcc31'),
    features: [
      { title: 'Cloud Infrastructure Setup', desc: 'We architect and deploy cloud environments on AWS, Azure, or GCP — with auto-scaling, load balancing, CDN integration, and cost optimization strategies tailored to your workload.', image: img('1544197150-b99a580bb7a8') },
      { title: 'Network & Security Management', desc: 'We design and manage enterprise networks with firewalls, VPNs, intrusion detection, and zero-trust security models — protecting your business from threats around the clock.', image: img('1558494949-ef010cbdcc31') },
      { title: 'DevOps & CI/CD Pipelines', desc: 'We implement Docker, Kubernetes, and CI/CD pipelines that automate deployments, reduce human error, and enable your development team to ship features multiple times per day safely.', image: img('1460925895917-afdab827c52f') },
    ],
    industries: [
      { title: 'Finance', desc: 'High-availability infrastructure for banking systems with 99.99% uptime SLAs and disaster recovery.' },
      { title: 'Healthcare', desc: 'HIPAA-compliant cloud hosting, backup systems, and secure data exchange for health organizations.' },
      { title: 'E-Commerce', desc: 'Auto-scaling infrastructure that handles traffic spikes during sales events without downtime.' },
      { title: 'Government', desc: 'Secure on-premise and hybrid cloud solutions for government digital transformation projects.' },
      { title: 'Education', desc: 'Reliable video streaming, LMS hosting, and collaboration tool infrastructure for educational institutions.' },
      { title: 'Manufacturing', desc: 'IIoT infrastructure, industrial network setup, and ERP hosting for manufacturing operations.' },
    ],
    challenges: [
      { title: 'Minimizing Downtime', desc: 'We implement redundant infrastructure, automatic failover, and real-time monitoring to achieve 99.9%+ uptime for critical systems.' },
      { title: 'Security Threats', desc: 'We deploy layered security — WAF, DDoS protection, vulnerability scanning, and 24/7 SOC monitoring to defend against modern cyber threats.' },
      { title: 'Cost Optimization', desc: 'We right-size cloud resources, implement reserved instance strategies, and eliminate waste to reduce your cloud bill by 20-40%.' },
    ],
    faqs: [
      { q: 'Which cloud provider do you recommend?', a: 'AWS is our primary recommendation for most workloads, but we\'re certified across AWS, Azure, and GCP and will recommend based on your specific needs.' },
      { q: 'Do you offer 24/7 monitoring?', a: 'Yes — we provide round-the-clock infrastructure monitoring with automated alerting and an on-call response team for critical incidents.' },
      { q: 'Can you migrate our existing servers to the cloud?', a: 'Yes — we handle lift-and-shift migrations, re-platforming, and full cloud-native re-architecture depending on your goals and timeline.' },
      { q: 'How do you handle data backups?', a: 'We implement daily automated backups with point-in-time recovery, cross-region replication, and regular restore testing.' },
    ],
  },

  'workspaces': {
    title: 'Workspaces',
    category: 'Resource Outsourcing',
    subtitle: 'Flexible, fully-equipped workspaces for startups, remote teams, and enterprises — ready to move in.',
    hero: img('1497366216548-37526070297c'),
    features: [
      { title: 'Co-working Spaces', desc: 'Shared desks and private cabins in professional environments with high-speed internet, meeting rooms, printing facilities, and a vibrant community of entrepreneurs and professionals.', image: img('1497366754035-f2caad3c01ba') },
      { title: 'Virtual Offices', desc: 'A prestigious business address, mail handling, call answering, and meeting room access — everything a remote business needs to appear professional without paying for permanent office space.', image: img('1486325212027-8081e485255e') },
      { title: 'Managed Office Spaces', desc: 'Fully customized, branded office setups for larger teams — designed, furnished, and managed by us, with flexible lease terms that scale as your team grows.', image: img('1497366216548-37526070297c') },
    ],
    industries: [
      { title: 'Startups', desc: 'Flexible month-to-month desks in vibrant startup hubs with networking opportunities and mentorship access.' },
      { title: 'Freelancers', desc: 'Affordable hot desks with professional amenities for independent workers and consultants.' },
      { title: 'Remote Teams', desc: 'Dedicated floors or zones for distributed teams that need occasional in-person collaboration spaces.' },
      { title: 'SMEs', desc: 'Private offices for small teams that want professional space without the long-term commercial lease commitment.' },
      { title: 'Enterprise', desc: 'Large floor-plate managed offices for enterprise teams doing market entry or project-based work.' },
      { title: 'NGOs & Social Enterprises', desc: 'Subsidized workspace for nonprofits and social ventures making a positive community impact.' },
    ],
    challenges: [
      { title: 'Flexibility', desc: 'We offer short-term and rolling leases so you can scale your workspace up or down as your team size and business needs change.' },
      { title: 'Cost Efficiency', desc: 'Our workspace solutions cost 50-70% less than setting up and maintaining your own traditional office, with all utilities and maintenance included.' },
      { title: 'Collaboration', desc: 'We design common areas, organize networking events, and facilitate introductions to foster meaningful business connections within our workspace community.' },
    ],
    faqs: [
      { q: 'What is included in the workspace package?', a: 'High-speed WiFi, electricity, water, housekeeping, receptionist, printing, and access to meeting rooms are included in standard packages.' },
      { q: 'Can I use the workspace address for my company registration?', a: 'Yes — our virtual office and co-working addresses are accepted by GST, ROC, and banks for company registration purposes.' },
      { q: 'Are the workspaces available 24/7?', a: 'Dedicated desks and private offices offer 24/7 access. Hot desks are typically available during business hours (9am-9pm).' },
      { q: 'What is the minimum commitment period?', a: 'We offer day passes, monthly rolling contracts, and 6/12-month plans. No long-term lock-in is required for most workspace types.' },
    ],
  },
};

export const servicesByCategory = {
  Development: [
    { slug: 'web3',      label: 'Web 3.0' },
    { slug: 'ai-ml',     label: 'AI / ML' },
    { slug: 'coding',    label: 'Coding' },
    { slug: 'mobile-app',label: 'Mobile App' },
    { slug: 'software',  label: 'Software' },
  ],
  Solutions: [
    { slug: 'fintech',    label: 'FinTech' },
    { slug: 'e-learning', label: 'E-Learning' },
    { slug: 'e-commerce', label: 'E-Commerce' },
    { slug: 'e-health',   label: 'E-Health' },
    { slug: 'realty',     label: 'Realty Management' },
    { slug: 'vehicle',    label: 'Vehicle Management' },
  ],
  'Resource Outsourcing': [
    { slug: 'virtual-staff', label: 'Virtual Staff' },
    { slug: 'offshore',      label: 'Offshore Employee' },
    { slug: 'eor',           label: 'EOR Services' },
    { slug: 'it-infra',      label: 'IT Infrastructure' },
    { slug: 'workspaces',    label: 'Workspaces' },
  ],
};
