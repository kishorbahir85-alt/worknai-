import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/userModel.js';
import Product from './models/productModel.js';
import Course from './models/courseModel.js';
import Job from './models/jobModel.js';
import Blog from './models/blogModel.js';
import Tutorial from './models/tutorialModel.js';
import Service from './models/serviceModel.js';
import Partner from './models/partnerModel.js';
import Company from './models/companyModel.js';
import Trending from './models/trendingModel.js';
import Template from './models/templateModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/worknai';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  // Find or create admin user for postedBy reference
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = await User.findOne();
  }
  const adminId = admin?._id;

  // 1. SEED PRODUCTS
  console.log('Seeding Products...');
  const productsData = [
    {
      title: 'CarHub - Vehicle Rental Platform',
      tagline: 'Streamlined car rental & fleet tracking system for mobility operators.',
      description: 'Comprehensive car rental portal with automated reservations, GPS tracking, vehicle availability calendars, and payment processing.',
      category: 'Automobile',
      url: 'https://carhub.worknai.online',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
      features: ['Instant Online Booking', 'Fleet GPS Telematics', 'Dynamic Pricing Engine', 'Automated Invoicing'],
      benefits: ['35% higher fleet utilization', 'Zero manual double bookings', 'Real-time telemetry reports'],
      logoUrl: '/uploads/logos/logo_carhub.png',
      howItWorks: [
        { step: 1, title: 'Browse Fleet', description: 'Filter vehicles by class, transmission, price and location.' },
        { step: 2, title: 'Instant Verification', description: 'Quick KYC and driving license validation.' },
        { step: 3, title: 'Drive & Track', description: 'Keyless access and smart GPS tracking.' },
      ],
      faqs: [
        { question: 'Is security deposit refundable?', answer: 'Yes, processed within 24 hours of vehicle return.' },
        { question: 'What insurance coverage is included?', answer: 'Full comprehensive collision coverage is included.' },
      ],
      postedBy: adminId,
    },
    {
      title: 'ApexArm 6-DOF Robotic Arm Kit',
      tagline: 'Precision 6-axis robotic arm with ROS2 integration and 1.5kg payload.',
      description: 'Educational and research-grade 6-DOF robotic arm equipped with harmonic drive gears, absolute magnetic encoders, and ROS2 MoveIt kinematics support.',
      category: 'Robotics',
      url: 'https://worknai.online/emarket/robotics',
      techStack: ['ROS2', 'Python', 'C++', 'Harmonic Drives', 'CAN-Bus'],
      features: ['6-Axis Articulated Freedom', '0.05mm Repeatability Accuracy', 'Open-Source Python & C++ SDK', 'Gripper & Vacuum End-Effectors'],
      benefits: ['Ideal for lab automation & teaching', 'Real-time collision avoidance', 'Zero backlash precision joints'],
      heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'Aegis Rover - Autonomous Mobile Robot',
      tagline: 'LiDAR SLAM mapping, obstacle avoidance, and waypoint navigation rover.',
      description: 'Heavy-duty 4WD autonomous mobile robot (AMR) platform featuring 360-degree LiDAR, depth perception cameras, and onboard Jetson compute for warehouse mapping.',
      category: 'Robotics',
      url: 'https://worknai.online/emarket/robotics',
      techStack: ['ROS2', 'Jetson Orin', '2D/3D LiDAR', 'RTK-GPS', 'Gazebo'],
      features: ['360° 25m LiDAR Scanning', 'Stereo Visual Odometry', 'Up to 30kg Payload Capacity', 'Auto-Docking Battery Station'],
      benefits: ['Rapid indoor warehouse deployment', 'Autonomous obstacle evasion', 'Hot-swappable battery system'],
      heroImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'NovaBot Bipedal Walking Research Robot',
      tagline: '18-DOF bipedal dynamic walking robot with high-torque joint actuators.',
      description: 'Advanced bipedal humanoid robotics platform designed for locomotion control, balance reinforcement learning, and autonomous gait optimization.',
      category: 'Robotics',
      url: 'https://worknai.online/emarket/robotics',
      techStack: ['PyTorch', 'ROS2', 'MuJoCo', 'BLDC Actuators', 'IMU 9-Axis'],
      features: ['18 High-Torque BLDC Actuators', 'Reinforcement Learning Ready', 'Full-Body Dynamic Balance', 'Carbon Fiber Structural Frame'],
      benefits: ['Push-recovery compliance control', 'Open locomotion controller code', 'Modular limb replacement'],
      heroImage: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'DynamiX Pro Brushless Servo Actuator',
      tagline: 'Magnetic absolute encoder, CAN-FD bus control, and 35Nm peak torque.',
      description: 'Integrated brushless robotic joint actuator combining planetary gearbox, magnetic encoder, field-oriented controller (FOC), and driver in a compact housing.',
      category: 'Robotics',
      url: 'https://worknai.online/emarket/robotics',
      techStack: ['CAN-FD', 'FOC Motor Control', 'Planetary Reduction', 'RS485'],
      features: ['35Nm Peak Joint Torque', '17-Bit Single-Turn Absolute Encoder', 'Dual CAN-FD Daisy Chaining', 'Active Thermal Protection'],
      benefits: ['Sub-millimeter position control', 'Seamless multi-axis chaining', 'Plug-and-play ROS2 motor drivers'],
      heroImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'Jetson Orin Edge AI Developer Board',
      tagline: 'Up to 275 TOPS AI compute for real-time vision, LLMs, and robotics inference.',
      description: 'Next-generation embedded edge computing powerhouse engineered to run complex generative AI models, multi-camera vision pipelines, and ROS2 workloads at ultra-low power.',
      category: 'AI Hardware',
      url: 'https://worknai.online/emarket/ai-hardware',
      techStack: ['CUDA', 'TensorRT', 'PyTorch', 'Linux Ubuntu', 'DeepStream'],
      features: ['275 TOPS AI Performance', '64GB 256-bit LPDDR5 Memory', '8x GMSL2 Camera Connectors', 'Dual 10GbE Networking'],
      benefits: ['Run YOLOv8 at >120 FPS', 'Low-power 15W-60W modes', 'Industrial vibration-rated chassis'],
      heroImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'NeuralCore USB AI TPU Vision Accelerator',
      tagline: 'Plug-and-play 4 TOPS neural accelerator for Raspberry Pi, Mini PC, and laptops.',
      description: 'Ultra-compact USB-C neural processing coprocessor that offloads AI vision inference, object classification, and pose estimation from host CPUs.',
      category: 'AI Hardware',
      url: 'https://worknai.online/emarket/ai-hardware',
      techStack: ['TensorFlow Lite', 'ONNX Runtime', 'OpenCV', 'USB 3.1'],
      features: ['4 TOPS Edge TPU Compute', 'Direct USB Type-C 3.1 Host Link', 'Under 2.5W Power Consumption', 'Zero-Driver Linux & Mac Setup'],
      benefits: ['Instant 10x speedup for Raspberry Pi', 'Whisper audio & MobileNet support', 'Cool-touch aluminum body'],
      heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'VisionPro AI Dual-Lens Stereo Depth Camera',
      tagline: 'Hardware spatial depth mapping and on-device 4K real-time object tracking.',
      description: 'Industrial stereo vision camera featuring synchronized global shutter sensors, onboard depth calculation ASIC, and active IR illumination for zero-light mapping.',
      category: 'AI Hardware',
      url: 'https://worknai.online/emarket/ai-hardware',
      techStack: ['OpenCV', 'ROS2', 'Point Cloud', 'Stereo Depth ASIC'],
      features: ['0.2m to 20m Accurate Depth Range', 'Synchronized 120 FPS Global Shutter', 'Integrated 6-DOF IMU Sensor', 'IP65 Water & Dust Sealed'],
      benefits: ['Direct 3D point cloud generation', 'Sunlight-immune IR pattern projector', 'SDK support for Python, C++, ROS2'],
      heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'AuraGlass - AI Smart Audio Glasses',
      tagline: 'Open-ear acoustic audio, live AI voice companion, and polarized UV lenses.',
      description: 'Sleek everyday eyewear combining premium polarized UV400 lenses with directional open-ear micro-speakers, quad beamforming microphones, and tactile voice AI triggers.',
      category: 'Everyday AI',
      url: 'https://worknai.online/emarket/everyday-ai',
      techStack: ['Bluetooth 5.3', 'Qualcomm aptX', 'Voice AI SDK', 'Bone Conduction'],
      features: ['Directional Acoustic Micro-Drivers', 'Quad Beamforming Wind-Resistant Mics', '14-Hour Continuous Battery Life', 'Lightweight 38g Titanium Frame'],
      benefits: ['Hands-free phone & AI voice assistant', 'Situational environmental awareness', 'Interchangeable prescription lens frames'],
      heroImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'MemoVoice AI Smart Recording Badge',
      tagline: 'Dual-mic noise cancellation with on-device Whisper transcription and summarization.',
      description: 'Wearable magnetic audio badge that records meetings, lectures, and brainstorms, generating instant structured action items and summaries via companion AI sync.',
      category: 'Everyday AI',
      url: 'https://worknai.online/emarket/everyday-ai',
      techStack: ['Whisper AI', 'Bluetooth BLE', '64GB eMMC', 'AES-256 Encryption'],
      features: ['One-Touch Tactical Slide Recording', 'Dual Studio MEMS Microphones', '30-Hour Continuous Record Time', 'Hardware Encrypted Local Storage'],
      benefits: ['Zero cloud leaks with local encryption', 'Instant meeting bullet points', 'Ultra-lightweight magnetic clip design'],
      heroImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'OmniBuds Pro - AI Translation Earbuds',
      tagline: 'Real-time two-way voice translation in 40+ languages with active noise canceling.',
      description: 'True wireless stereo earbuds featuring real-time simultaneous two-way translation, adaptive active noise cancellation, and high-fidelity spatial audio.',
      category: 'Everyday AI',
      url: 'https://worknai.online/emarket/everyday-ai',
      techStack: ['Neural Translation', 'ANC 45dB', 'LDAC Codec', 'Bluetooth 5.4'],
      features: ['Simultaneous 40-Language Translation', '45dB Hybrid Active Noise Cancellation', '36-Hour Case Battery Endurance', 'Low-Latency 28ms Gaming Mode'],
      benefits: ['Seamless foreign language conversations', 'Studio-grade acoustic soundstage', 'Sweatproof IPX5 rating'],
      heroImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'AuraRing AI Sleep & Vital Biometric Ring',
      tagline: 'Titanium chassis tracking HRV, sleep stages, body temperature, and recovery score.',
      description: 'Featherlight aerospace titanium smart ring embedding medical-grade PPG optical sensors to monitor sleep architecture, heart rate variability, and stress levels 24/7.',
      category: 'Everyday AI',
      url: 'https://worknai.online/emarket/everyday-ai',
      techStack: ['PPG Optical Sensor', 'BLE 5.2', 'Ceramic Titanium', 'AI Recovery Score'],
      features: ['Continuous PPG & Skin Temp Sensors', '7-Day Battery on a Single Charge', '100m Water Resistance Rating', 'Personalized AI Readiness Insights'],
      benefits: ['No bulky screen or daily notifications', 'Accurate REM & deep sleep analysis', 'Comfortable 24/7 finger fit'],
      heroImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'NexusHub Matter & Thread Smart Home Hub',
      tagline: 'Universal bridge connecting Zigbee, Z-Wave, Thread, and Matter smart devices.',
      description: 'Local-first smart home controller orchestrating home automation routines without cloud dependencies, compatible with HomeKit, Home Assistant, and Google Home.',
      category: 'Smart Home',
      url: 'https://worknai.online/emarket/smart-home',
      techStack: ['Matter 1.3', 'Thread', 'Zigbee 3.0', 'Home Assistant', 'Wi-Fi 6'],
      features: ['Native Matter & Thread Border Router', '100% Local Automation Execution', 'Gigabit Ethernet & Dual-Band Wi-Fi', 'Controls up to 256 Smart Nodes'],
      benefits: ['Zero internet outage delays', 'Interoperable across all smart brands', 'Encrypted local key storage'],
      heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'SenseNode Environmental Multi-Sensor Array',
      tagline: 'Monitors TVOC, CO2, PM2.5, humidity, and temperature with high-contrast e-ink.',
      description: 'Precision indoor air quality monitor with laser PM2.5 particle counting, NDIR carbon dioxide sensing, and real-time Zigbee/Wi-Fi home automation triggers.',
      category: 'Smart Home',
      url: 'https://worknai.online/emarket/smart-home',
      techStack: ['NDIR CO2 Sensor', 'Laser PM2.5', 'E-Ink Display', 'Zigbee 3.0'],
      features: ['6-in-1 Sensor Matrix (CO2, PM2.5, VOC, Temp, Humidity, Light)', '2.9-inch Paper-like E-Ink Screen', '2-Year Battery on 2x AA Cells', 'Automatic HVAC & Purifier Automation'],
      benefits: ['Glanceable crisp indoor health metrics', 'Triggers air purifiers automatically', 'Zero backlight glare at night'],
      heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'ESP32-S3 Dual-Core AI IoT Dev Module',
      tagline: 'Wi-Fi 4 + Bluetooth 5 (LE) with vector instructions for neural network processing.',
      description: 'High-performance IoT system-on-chip board featuring dual-core Xtensa 32-bit LX7 CPU, vector acceleration for tinyML models, and 45 programmable GPIO pins.',
      category: 'IoT',
      url: 'https://worknai.online/emarket/iot',
      techStack: ['ESP-IDF', 'MicroPython', 'Arduino C++', 'TinyML', 'FreeRTOS'],
      features: ['240MHz Dual-Core Xtensa LX7', 'Vector Extensions for TinyML Acceleration', 'Integrated 2.4GHz Wi-Fi & BLE 5.0', 'Built-in USB-C Native & JTAG Debug'],
      benefits: ['Fastest path to connected IoT prototypes', 'Run on-device wake-word detection', 'Ultra-low deep sleep current (7µA)'],
      heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'LoRaGateway 8-Channel Long Range Gateway',
      tagline: '15km wireless range, multi-band 868/915MHz, and IP67 outdoor enclosure.',
      description: 'Carrier-grade LoRaWAN base station supporting 8 concurrent channels, GPS timestamping, and Ethernet/4G backhaul for smart agriculture and industrial sensing.',
      category: 'IoT',
      url: 'https://worknai.online/emarket/iot',
      techStack: ['LoRaWAN 1.0.4', 'Semtech SX1302', 'PoE 802.3af', 'MQTT'],
      features: ['8 Demodulation Channels', '-142dBm High Receiver Sensitivity', 'Power-over-Ethernet (PoE) Support', 'Ruggedized IP67 Aluminum Case'],
      benefits: ['Covers entire campus or farm with 1 node', 'Low maintenance pole-mount design', 'Direct forwarder to The Things Network'],
      heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'STM32H7 High-Performance ARM Cortex-M7 Board',
      tagline: '480MHz dual-precision FPU microcontroller for high-speed industrial control.',
      description: 'Developer breakout board powered by STM32H743VI MCU with hardware DSP instructions, 1MB RAM, dual CAN-FD, and high-speed USB for demanding motor control.',
      category: 'Electronics',
      url: 'https://worknai.online/emarket/electronics',
      techStack: ['ARM Cortex-M7', 'STM32Cube', 'C/C++', 'FreeRTOS', 'CAN-FD'],
      features: ['480MHz 32-bit ARM Cortex-M7 Core', '1MB SRAM + 2MB Dual-Bank Flash', 'Hardware Double-Precision FPU & DSP', 'Dual CAN 2.0B / CAN-FD Ports'],
      benefits: ['Unmatched mathematical processing power', 'Microsecond response times for robotics', 'Rich peripheral pin breakout'],
      heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'Raspberry Pi Pico 2 W Maker Starter Kit',
      tagline: 'Dual ARM Cortex-M33 with Wi-Fi, breadboard, sensors, and tutorial guide.',
      description: 'Comprehensive maker engineering kit with the new Raspberry Pi Pico 2 W, 30+ interactive sensor modules, jumper cables, OLED screen, and beginner tutorials.',
      category: 'Development Boards',
      url: 'https://worknai.online/emarket/development-boards',
      techStack: ['MicroPython', 'C/C++', 'Raspberry Pi Foundation', 'RP2350'],
      features: ['Raspberry Pi RP2350 Dual M33 / Hazard3 RISC-V', 'Onboard 2.4GHz 802.11n Wi-Fi', 'Includes 30 Sensor & Actuator Modules', 'Step-by-Step Color Project Handbook'],
      benefits: ['Perfect for university labs and hobbyists', 'Switchable ARM and RISC-V architectures', 'Quick-start plug-and-play wiring'],
      heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'SilentStep High-Precision Stepper Motor Driver',
      tagline: 'Ultra-quiet 256 microstepping driver for 3D printers and CNC motion control.',
      description: 'TMC2209 silent stepper motor driver board with StealthChop2 silence technology, SpreadCycle dynamic torque control, and sensorless homing capabilities.',
      category: 'Electronics',
      url: 'https://worknai.online/emarket/electronics',
      techStack: ['TMC2209', 'StealthChop2', 'StallGuard4', 'UART Config'],
      features: ['256 Microsteps Interpolation', 'Up to 2.8A Peak Motor Current', 'StallGuard4 Sensorless Endstop Homing', 'Low RDSon High-Efficiency MOSFETs'],
      benefits: ['Eliminates high-pitch stepper motor whine', 'Prevents missed steps under load', 'Drop-in replacement for standard drivers'],
      heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      postedBy: adminId,
    },
    {
      title: 'Matrimonial Match - Elite Matrimony',
      tagline: 'AI-driven matchmaking and verified profiles for matrimonial services.',
      description: 'Next-generation matchmaking platform with multi-tier privacy settings, astrologer integrations, and verified background validation.',
      category: 'Matrimonial',
      url: 'https://matrimonial.worknai.online',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'TailwindCSS'],
      features: ['AI Compatibility Scoring', 'Privacy-First Photo Vault', 'Live Verified Video Chat', 'Horoscope Matching'],
      benefits: ['98% verified active profiles', 'High security & confidentiality', 'Intuitive preference matching'],
      logoUrl: '/uploads/logos/logo_matrimonial.png',
      postedBy: adminId,
    },
    {
      title: 'WorknAi Logistics Suite',
      tagline: 'Intelligent multi-modal supply chain and route optimization.',
      description: 'Enterprise logistics management software with dispatch optimization, warehouse routing, and real-time shipment monitoring.',
      category: 'Logistics',
      url: 'https://logistics.worknai.online',
      techStack: ['React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Redis'],
      features: ['Dynamic Route Optimization', 'Fleet Fuel Analytics', 'Proof of Delivery (e-POD)', 'Barcode & RFID Scanner'],
      benefits: ['28% reduction in transit fuel costs', 'Real-time ETA accuracy', 'Automated manifest generation'],
      logoUrl: '/uploads/logos/logo_worknai_suite.png',
      postedBy: adminId,
    },
  ];

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  for (const p of productsData) {
    if (!p.slug) p.slug = slugify(p.title);
    await Product.findOneAndUpdate({ title: p.title }, p, { upsert: true, new: true });
  }

  // 2. SEED COURSES
  console.log('Seeding Courses...');
  const coursesData = [
    {
      title: 'Full Stack MERN & AI Engineering Masterclass',
      description: 'Hands-on training covering React 19, Node.js, Express, MongoDB, TailwindCSS, REST APIs, and OpenAI / LLM integrations.',
      category: 'Web Development',
      duration: '4 Months',
      startDate: '2026-10-01',
      price: 14999,
      level: 'intermediate',
      mode: 'hybrid',
      postedBy: adminId,
    },
    {
      title: 'Generative AI & LLM Application Development',
      description: 'Master LangChain, LlamaIndex, Vector Databases, RAG pipelines, and agentic workflows to build intelligent autonomous apps.',
      category: 'AI & Data Science',
      duration: '3 Months',
      startDate: '2026-10-15',
      price: 19999,
      level: 'advanced',
      mode: 'online',
      postedBy: adminId,
    },
    {
      title: 'Cloud DevOps & Kubernetes Certification Bootcamp',
      description: 'Comprehensive DevOps mastery: Docker containers, Kubernetes orchestration, CI/CD with GitHub Actions, Terraform IaC, and AWS.',
      category: 'Cloud & DevOps',
      duration: '3 Months',
      startDate: '2026-10-10',
      price: 16999,
      level: 'intermediate',
      mode: 'online',
      postedBy: adminId,
    },
    {
      title: 'Enterprise Cyber Security & Ethical Hacking',
      description: 'Defensive and offensive cyber security, vulnerability assessment, penetration testing, network forensics, and cloud compliance.',
      category: 'Cyber Security',
      duration: '4 Months',
      startDate: '2026-11-01',
      price: 18499,
      level: 'beginner',
      mode: 'offline',
      postedBy: adminId,
    },
    {
      title: 'Modern UI/UX Design with Figma & Prototyping',
      description: 'Learn design systems, wireframing, high-fidelity UI components, user research methodologies, and interactive micro-animations.',
      category: 'Design',
      duration: '2 Months',
      startDate: '2026-10-05',
      price: 9999,
      level: 'beginner',
      mode: 'hybrid',
      postedBy: adminId,
    },
    {
      title: 'Autonomous Robotics & Embedded IoT Systems',
      description: 'Practical robotics engineering with ROS2, Raspberry Pi, Arduino, sensor integration, LiDAR mapping, and motor control.',
      category: 'Robotics',
      duration: '5 Months',
      startDate: '2026-10-20',
      price: 24999,
      level: 'intermediate',
      mode: 'offline',
      postedBy: adminId,
    },
  ];

  for (const c of coursesData) {
    if (!c.slug) c.slug = slugify(c.title);
    await Course.findOneAndUpdate({ title: c.title }, c, { upsert: true, new: true });
  }

  // 3. SEED JOBS
  console.log('Seeding Jobs...');
  const jobsData = [
    {
      title: 'Senior Full Stack Engineer (React / Node.js)',
      description: 'Lead the architecture and delivery of high-throughput web applications and real-time enterprise platforms.',
      location: 'Pune / Hybrid',
      type: 'full-time',
      experience: '3-6 years',
      salary: '₹12-18 LPA',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'TailwindCSS'],
      postedBy: adminId,
    },
    {
      title: 'AI / Machine Learning Engineer',
      description: 'Design and deploy production RAG pipelines, fine-tune open-source models, and build intelligent multi-agent systems.',
      location: 'Pune / Remote',
      type: 'full-time',
      experience: '2-5 years',
      salary: '₹14-22 LPA',
      skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector DBs'],
      postedBy: adminId,
    },
    {
      title: 'DevOps & Cloud Infrastructure Specialist',
      description: 'Scale our multi-region Kubernetes clusters, build automated deployment pipelines, and optimize cloud infrastructure costs.',
      location: 'Pune / Hybrid',
      type: 'full-time',
      experience: '3-5 years',
      salary: '₹12-16 LPA',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
      postedBy: adminId,
    },
    {
      title: 'Lead Product Designer (UI/UX)',
      description: 'Craft world-class user interfaces, design systems, and seamless experiences for our suite of enterprise SaaS tools.',
      location: 'Pune',
      type: 'full-time',
      experience: '2-4 years',
      salary: '₹8-14 LPA',
      skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
      postedBy: adminId,
    },
    {
      title: 'Junior React Frontend Developer',
      description: 'Collaborate with senior architects to implement sleek, reactive user interfaces with modern React and TailwindCSS.',
      location: 'Pune',
      type: 'full-time',
      experience: '0-2 years',
      salary: '₹4.5-7 LPA',
      skills: ['JavaScript', 'React', 'HTML/CSS', 'TailwindCSS', 'Git'],
      postedBy: adminId,
    },
  ];

  for (const j of jobsData) {
    if (!j.slug) j.slug = slugify(j.title);
    await Job.findOneAndUpdate({ title: j.title }, j, { upsert: true, new: true });
  }

  // 4. SEED BLOG POSTS
  console.log('Seeding Blog Posts...');
  const blogData = [
    {
      title: 'The Evolution of Next-Gen Logistics with AI in 2026',
      excerpt: 'How real-time routing algorithms and autonomous telematics are reshaping supply chains globally.',
      content: 'Supply chain management has undergone a profound transformation. With the integration of neural dispatch models, transit fleets achieve unprecedented fuel efficiency and precision delivery timelines...',
      category: 'Logistics & AI',
      tags: ['ai', 'logistics', 'automation', 'supplychain'],
      isFeatured: true,
      postedBy: adminId,
    },
    {
      title: 'Building Resilient Cloud Microservices with Kubernetes',
      excerpt: 'Key strategies for designing self-healing distributed systems that handle millions of events per second.',
      content: 'Designing microservices requires balancing decoupling with maintainability. In this deep dive, we explore ingress controllers, circuit breakers, and zero-downtime rolling updates on Kubernetes...',
      category: 'Engineering',
      tags: ['kubernetes', 'cloud', 'devops', 'microservices'],
      isFeatured: true,
      postedBy: adminId,
    },
    {
      title: 'Agentic Workflows: Beyond Simple Chatbots',
      excerpt: 'Why multi-agent systems are the future of enterprise task automation.',
      content: 'Single-turn LLM chatbots are quickly being replaced by autonomous agentic loops where agents plan, execute tool calls, verify outputs, and self-correct...',
      category: 'Artificial Intelligence',
      tags: ['agents', 'ai', 'langchain', 'automation'],
      isFeatured: false,
      postedBy: adminId,
    },
    {
      title: 'Zero Trust Cyber Security for High-Growth Startups',
      excerpt: 'Essential security principles to safeguard user data without slowing down development speed.',
      content: 'A perimeter-based security model is no longer sufficient in a hybrid work environment. Discover how zero trust network access and automated vulnerability scanning protect modern platforms...',
      category: 'Security',
      tags: ['security', 'compliance', 'zerotrust', 'fintech'],
      isFeatured: false,
      postedBy: adminId,
    },
  ];

  for (const b of blogData) {
    if (!b.slug) b.slug = slugify(b.title);
    await Blog.findOneAndUpdate({ title: b.title }, b, { upsert: true, new: true });
  }

  // 5. SEED TUTORIALS
  console.log('Seeding Tutorials...');
  const tutorialData = [
    {
      title: 'Getting Started with the WorknAi REST API',
      description: 'A comprehensive walkthrough on authenticating, querying product catalogs, and automating webhooks.',
      difficulty: 'Beginner',
      tags: ['api', 'setup', 'authentication'],
      steps: [
        { title: 'Obtain API Credentials', description: 'Log in to your Admin portal and generate your API Secret Key.' },
        { title: 'Send Your First Request', description: 'Make an authenticated GET request to `/api/products` using Bearer auth.' },
        { title: 'Set Up Webhook Notifications', description: 'Subscribe to enrollment and inquiry events in your webhook settings.' },
      ],
      postedBy: adminId,
    },
    {
      title: 'Building a High-Performance Real-Time Dashboard',
      description: 'Learn how to integrate WebSockets with React and Chart.js for real-time telemetry streaming.',
      difficulty: 'Intermediate',
      tags: ['react', 'websockets', 'dashboard'],
      steps: [
        { title: 'Setting Up Socket Client', description: 'Establish a resilient auto-reconnecting WebSocket connection.' },
        { title: 'Buffer State Updates', description: 'Debounce rapid data bursts to prevent unnecessary React re-renders.' },
        { title: 'Rendering Smooth Charts', description: 'Render high-FPS canvas charts with Tailwind styling.' },
      ],
      postedBy: adminId,
    },
    {
      title: 'Fine-Tuning LLM Embeddings for Custom Knowledgebases',
      description: 'Step-by-step tutorial on chunking proprietary PDFs, generating vector embeddings, and running semantic search.',
      difficulty: 'Advanced',
      tags: ['ai', 'rag', 'embeddings', 'python'],
      steps: [
        { title: 'Document Ingestion & Chunking', description: 'Split documents into semantic recursive chunks.' },
        { title: 'Vector Database Upsert', description: 'Index embeddings with cosine similarity distance metrics.' },
        { title: 'RAG Retrieval Pipeline', description: 'Query vector store and inject top context into LLM prompt.' },
      ],
      postedBy: adminId,
    },
  ];

  for (const t of tutorialData) {
    if (!t.slug) t.slug = slugify(t.title);
    await Tutorial.findOneAndUpdate({ title: t.title }, t, { upsert: true, new: true });
  }

  // 6. SEED SERVICES
  console.log('Seeding Services...');
  const servicesData = [
    {
      title: 'AI & Machine Learning Solutions',
      slug: 'ai-machine-learning',
      icon: 'Brain',
      tagline: 'Custom generative AI models, predictive analytics, and autonomous agent systems.',
      summary: 'Transform your business with tailored machine learning algorithms, RAG pipelines, and automated intelligence.',
      description: 'We build end-to-end AI applications from dataset curation to model fine-tuning and low-latency cloud deployments.',
      category: 'Artificial Intelligence',
      features: ['Custom LLM Fine-Tuning', 'Retrieval-Augmented Generation (RAG)', 'Computer Vision & OCR', 'Predictive Forecasting'],
      deliverables: ['Production-ready AI APIs', 'Model Monitoring Dashboard', 'Automated Retraining Pipelines', 'Full Source Code'],
      techStack: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Pinecone', 'Docker'],
      processSteps: [
        { step: 1, title: 'Discovery & Data Audit', description: 'Analyze workflows and data readiness.' },
        { step: 2, title: 'Model Prototyping', description: 'Benchmark baseline models and evaluate accuracy.' },
        { step: 3, title: 'Enterprise Integration', description: 'Deploy resilient containerized APIs with SLA guarantees.' },
      ],
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Full-Stack Web & SaaS Engineering',
      slug: 'web-development',
      icon: 'Globe',
      tagline: 'High-performance cloud web applications engineered for scalability and speed.',
      summary: 'Modern full-stack web development with React, Node.js, Next.js, and cloud native architectures.',
      description: 'Our engineering team crafts ultra-responsive, secure, and beautiful web products that scale from MVP to millions of daily users.',
      category: 'Web Engineering',
      features: ['Responsive Next.js / React Apps', 'Microservices Architecture', 'Real-time WebSockets', 'PCI-compliant Payments'],
      deliverables: ['Production Web Application', 'Admin CMS Dashboard', 'CI/CD Deployment Pipelines', 'API Documentation'],
      techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'TailwindCSS'],
      processSteps: [
        { step: 1, title: 'Architecture Blueprint', description: 'Design database schemas and API contracts.' },
        { step: 2, title: 'Agile Sprint Execution', description: 'Two-week sprints with transparent progress updates.' },
        { step: 3, title: 'Production Launch & Support', description: 'Zero-downtime deployment and 24/7 monitoring.' },
      ],
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Mobile Application Development',
      slug: 'mobile-development',
      icon: 'Smartphone',
      tagline: 'Native and cross-platform iOS & Android mobile apps with frictionless UX.',
      summary: 'Build high-speed mobile applications with React Native, Flutter, and native Swift/Kotlin modules.',
      description: 'Delivering feature-rich mobile experiences with offline caching, push notifications, and biometric security.',
      category: 'Mobile Engineering',
      features: ['Cross-Platform React Native', 'Offline First Architecture', 'Push Notification Engines', 'In-App Purchases'],
      deliverables: ['iOS App Store Package', 'Android Play Store Build', 'Mobile API Backend', 'Crashlytics Integration'],
      techStack: ['React Native', 'Flutter', 'Expo', 'Firebase', 'Redux Toolkit'],
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Cloud DevOps & Kubernetes Solutions',
      slug: 'devops-cloud',
      icon: 'Cloud',
      tagline: 'Automated CI/CD, Kubernetes orchestration, and cost-optimized cloud infrastructure.',
      summary: 'Scale seamlessly with automated infrastructure as code (IaC), zero-downtime deployments, and cloud security.',
      description: 'We modernize legacy infrastructure into robust cloud native Kubernetes clusters on AWS, Azure, or GCP.',
      category: 'Cloud Infrastructure',
      features: ['Kubernetes Cluster Setup', 'Automated GitHub Actions CI/CD', 'Terraform IaC', '24/7 Monitoring & Alerting'],
      deliverables: ['Production Kubernetes Clusters', 'Automated Pipelines', 'Infrastructure Monitoring Dashboard', 'SLA Runbooks'],
      techStack: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'Prometheus'],
      isFeatured: false,
      order: 4,
    },
    {
      title: 'Robotics & IoT Automation Labs',
      slug: 'robotics-iot',
      icon: 'Bot',
      tagline: 'Autonomous robotics programming, sensor telemetry, and hardware-software integration.',
      summary: 'Pioneering intelligent automation through ROS2, embedded systems, and computer vision guidance.',
      description: 'From smart factory automation to autonomous mobile robots (AMRs), we bridge software intelligence with physical robotics.',
      category: 'Hardware & IoT',
      features: ['ROS2 Robot Middleware', 'LiDAR & Camera SLAM', 'Real-time Telemetry Telematics', 'Edge AI Acceleration'],
      deliverables: ['Embedded Firmware', 'ROS2 Control Nodes', 'Hardware Simulation Environment', 'Telemetry Cloud Portal'],
      techStack: ['C++', 'Python', 'ROS2', 'Raspberry Pi', 'OpenCV', 'MQTT'],
      isFeatured: true,
      order: 5,
    },
  ];

  for (const s of servicesData) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
  }

  // 7. SEED PARTNERS
  console.log('Seeding Partners...');
  const partnersData = [
    { name: 'Google Cloud Partner', category: 'Cloud Infrastructure', tier: 'Strategic', websiteUrl: 'https://cloud.google.com', order: 1 },
    { name: 'Amazon Web Services (AWS)', category: 'Cloud Provider', tier: 'Premier', websiteUrl: 'https://aws.amazon.com', order: 2 },
    { name: 'Microsoft Azure Network', category: 'Enterprise Cloud', tier: 'Premier', websiteUrl: 'https://azure.microsoft.com', order: 3 },
    { name: 'MongoDB Enterprise', category: 'Database Systems', tier: 'Strategic', websiteUrl: 'https://mongodb.com', order: 4 },
    { name: 'Stripe Verified Partner', category: 'Payment Gateways', tier: 'Premier', websiteUrl: 'https://stripe.com', order: 5 },
    { name: 'NVIDIA Inception', category: 'AI & Hardware Acceleration', tier: 'Strategic', websiteUrl: 'https://nvidia.com', order: 6 },
    { name: 'Docker Certified Partner', category: 'Containerization', tier: 'Standard', websiteUrl: 'https://docker.com', order: 7 },
    { name: 'GitHub Enterprise Suite', category: 'Developer Tools', tier: 'Premier', websiteUrl: 'https://github.com', order: 8 },
  ];

  for (const p of partnersData) {
    await Partner.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
  }

  // 8. SEED COMPANY INFO & SITE SETTINGS
  console.log('Seeding Company & Site Settings...');
  const companyData = {
    companyName: 'WorknAi Logistics & AI Labs',
    heroHeading: 'Empowering Next-Gen AI & Logistics Innovation',
    heroSubheading: 'Building intelligent digital products, enterprise platforms, and workforce solutions for global scale.',
    aboutStory: 'WorknAi is a premier technology incubator and engineering laboratory headquartered in Pune. We build cutting-edge software products across logistics, enterprise CRM, fintech, and artificial intelligence while upskilling the next generation of top tech talent.',
    mission: 'To democratize access to advanced AI and logistics technology, accelerating digital transformation for businesses worldwide.',
    vision: 'To be the global benchmark in intelligent automation, autonomous software systems, and high-impact technology education.',
    email: 'contact@worknai.online',
    phone: '+91 84469 12345',
    address: 'WorknAi Tech Park, Senapati Bapat Road, Pune, Maharashtra, India 411016',
    socials: {
      linkedin: 'https://in.linkedin.com/in/worknai-technology-8830973b6',
      instagram: 'https://www.instagram.com/worknai_institute_center/',
      youtube: 'https://www.youtube.com/@Worknai-w5m',
      facebook: 'https://www.facebook.com/profile.php?id=61595453355907',
    },
    metrics: [
      { label: 'Active Enterprise Clients', value: '150+', description: 'Global businesses powered by our software' },
      { label: 'Platform Uptime SLA', value: '99.98%', description: 'High reliability distributed infrastructure' },
      { label: 'Students Trained & Placed', value: '5,000+', description: 'Career transitions into top tech firms' },
      { label: 'Countries Supported', value: '35+', description: 'Cross-border deployments and integrations' },
    ],
    team: [
      { name: 'Akshay Sharma', role: 'Chief Executive Officer & Founder', bio: 'Tech visionary with 12+ years in enterprise architecture and scaling cloud solutions.' },
      { name: 'Dr. Priya Kulkarni', role: 'Head of Artificial Intelligence', bio: 'PhD in Computer Vision; published author in deep learning and automated robotics.' },
      { name: 'Rahul Deshmukh', role: 'VP of Engineering', bio: 'Former senior lead at tier-1 tech firms specializing in distributed microservices.' },
      { name: 'Neha Varma', role: 'Head of Product & Design', bio: 'Award-winning UX strategist passionate about human-centered design systems.' },
    ],
  };

  let existingCompany = await Company.findOne();
  if (existingCompany) {
    await Company.findByIdAndUpdate(existingCompany._id, companyData);
  } else {
    await Company.create(companyData);
  }

  // 9. SEED TRENDING TOPICS & CASE STUDIES
  console.log('Seeding Trending Topics...');
  const trendingData = [
    {
      title: 'Reducing Fleet Idle Time by 42% for TransGlobal Freight',
      slug: 'reducing-fleet-idle-time',
      type: 'success-story',
      category: 'Logistics Optimization',
      summary: 'How WorknAi Logistics Suite reduced vehicle wait times and saved $1.2M in annual fuel costs for TransGlobal Freight.',
      clientName: 'TransGlobal Freight Corp',
      results: ['42% reduction in gate wait time', '$1.2M saved in first year', '99.4% on-time dispatch rate'],
      metrics: {
        stat1: { label: 'Fuel Savings', value: '28%' },
        stat2: { label: 'Idle Reduction', value: '42%' },
        stat3: { label: 'ROI Payback', value: '4.5 Months' },
      },
      tags: ['logistics', 'casestudy', 'telematics', 'ai'],
      isFeatured: true,
    },
    {
      title: 'Automated Real-Time Defect Detection in High-Speed Manufacturing',
      slug: 'automated-defect-detection',
      type: 'innovation',
      category: 'Computer Vision',
      summary: 'Deploying edge AI cameras to inspect 2,400 parts per minute with 99.99% accuracy on production lines.',
      clientName: 'Precision Dynamics Ltd',
      results: ['99.99% inspection accuracy', 'Zero manual sorting bottlenecks', '10x faster defect flagging'],
      metrics: {
        stat1: { label: 'Accuracy', value: '99.99%' },
        stat2: { label: 'Inspection Speed', value: '2,400 ppm' },
        stat3: { label: 'False Positives', value: '< 0.01%' },
      },
      tags: ['computervision', 'manufacturing', 'edgeai'],
      isFeatured: true,
    },
    {
      title: 'Our Engineering Approach: The Zero-Lag Architecture Principle',
      slug: 'zero-lag-architecture-approach',
      type: 'our-approach',
      category: 'Architecture & Design',
      summary: 'Principles and guidelines for engineering reactive, event-driven web applications that load in under 200ms.',
      tags: ['architecture', 'performance', 'bestpractices'],
      isFeatured: true,
    },
  ];

  for (const tr of trendingData) {
    await Trending.findOneAndUpdate({ slug: tr.slug }, tr, { upsert: true, new: true });
  }

  // 10. SEED TEMPLATES
  console.log('Seeding Developer Templates...');
  const templatesData = [
    {
      title: 'SaaS Admin Dashboard Starter Kit',
      slug: 'saas-admin-dashboard',
      category: 'React & Tailwind',
      description: 'Production-ready dark/light mode SaaS administrative portal with authentication, charts, and table management.',
      features: ['Role-based Access Control', 'Tailwind CSS v4 & Dark Mode', 'Interactive Chart.js Widgets', 'REST API Ready'],
      techStack: ['React', 'Vite', 'TailwindCSS', 'Lucide Icons'],
      isFree: true,
      price: 0,
      downloadsCount: 1420,
      isFeatured: true,
    },
    {
      title: 'Multi-Vendor E-Commerce Platform UI Kit',
      slug: 'ecommerce-marketplace-kit',
      category: 'Full Stack Starter',
      description: 'Comprehensive shopping cart, checkout workflow, product filters, and seller dashboard layout.',
      features: ['Stripe Checkout Ready', 'Product Review Matrix', 'Category Filter Sidebar', 'Responsive Mobile Drawer'],
      techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
      isFree: false,
      price: 1999,
      downloadsCount: 840,
      isFeatured: true,
    },
    {
      title: 'AI Prompt & Agent Workflow Studio',
      slug: 'ai-agent-workflow-studio',
      category: 'AI & Automation',
      description: 'Visual node-based canvas for chaining LLM prompts, tool executions, and external API requests.',
      features: ['Visual Drag & Drop Nodes', 'Streaming Chat Integration', 'Token Usage Cost Counter', 'JSON Export/Import'],
      techStack: ['React', 'React Flow', 'OpenAI SDK', 'TailwindCSS'],
      isFree: true,
      price: 0,
      downloadsCount: 2310,
      isFeatured: true,
    },
  ];

  for (const tm of templatesData) {
    await Template.findOneAndUpdate({ slug: tm.slug }, tm, { upsert: true, new: true });
  }

  console.log('✅ ALL WEBSITE CONTENT SEEDED SUCCESSFULLY!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
