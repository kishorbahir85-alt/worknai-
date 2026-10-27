import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Cpu, Zap, Sparkles, ArrowRight, ArrowUpRight, CheckCircle2,
  Layers, Eye, Radio, Shield, Wrench, Activity,
  ChevronDown, ChevronUp, Play, Flame, Gauge, Atom, Terminal, Laptop,
  Calendar, Clock, Building, Send, PhoneCall, Check, FlaskConical
} from 'lucide-react';
import Robot3DCanvas from '../../components/ui/Robot3DCanvas';
import { useTheme } from '../../context/ThemeContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Typewriter component matching the Overview tab aesthetic & animation
function Typewriter({ words = ['Robotics & Autonomy.', 'Autonomous AMRs.', 'Industrial Cobots.', 'Edge AI Vision.'], className }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const currentWord = Array.isArray(words) ? words[wordIndex % words.length] : words;

  useEffect(() => {
    setCount(0);
    setDeleting(false);
  }, [wordIndex, words]);

  useEffect(() => {
    let t;
    if (!deleting && count < currentWord.length) {
      t = setTimeout(() => setCount((c) => c + 1), 90);
    } else if (!deleting && count === currentWord.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && count > 0) {
      t = setTimeout(() => setCount((c) => c - 1), 45);
    } else {
      setDeleting(false);
      if (Array.isArray(words)) {
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(t);
  }, [count, deleting, currentWord, words]);

  return (
    <span className={className} aria-label={currentWord}>
      <span aria-hidden="true">{currentWord.slice(0, count)}</span>
      <span className="typewriter-caret" aria-hidden="true" />
    </span>
  );
}

const capabilities = [
  {
    icon: Bot,
    title: 'Autonomous Mobile Robots (AMRs)',
    desc: 'LiDAR-driven SLAM navigation, real-time dynamic obstacle avoidance, and fleet choreography for smart factories and autonomous logistics.',
    badge: 'Navigation & Fleet',
    highlights: ['2D/3D LiDAR Mapping', 'Dynamic Path Re-planning', 'Multi-Robot Fleet Swarm'],
  },
  {
    icon: Cpu,
    title: 'Robotic Arms & Industrial Cobots',
    desc: 'High-precision 6-DOF robotic manipulators, kinematic trajectory generation, and safe collaborative human-robot assembly workflows.',
    badge: 'Precision Kinematics',
    highlights: ['Sub-millimeter Accuracy', 'MoveIt 2 Motion Planning', 'Force-Torque Compliance'],
  },
  {
    icon: Eye,
    title: 'Edge AI & Computer Vision',
    desc: 'Real-time multi-spectral object detection, depth estimation, and automated visual defect inspection running on NVIDIA Jetson embedded GPUs.',
    badge: 'Real-time AI Vision',
    highlights: ['YOLOv8 & TensorRT Acceleration', 'Stereo Depth Sensing', 'Micro-defect Detection'],
  },
  {
    icon: Atom,
    title: 'ROS 2 & Digital Twin Simulation',
    desc: 'Physics-accurate simulation in Gazebo and NVIDIA Isaac Sim with URDF robot modeling, reducing field testing cycles and hardware risks.',
    badge: 'Virtual Simulation',
    highlights: ['Gazebo & Isaac Sim', 'DDS Real-time Comms', 'Hardware-in-the-Loop (HIL)'],
  },
  {
    icon: Radio,
    title: 'Embedded IoT & Telemetry',
    desc: 'Micro-ROS firmware on STM32/ESP32 microcontrollers, CAN bus sensor architectures, and low-latency cloud telemetry dashboards.',
    badge: 'Firmware & Comms',
    highlights: ['Micro-ROS on Bare Metal', 'CAN/RS485 Bus Control', 'Sub-10ms Sensor Fusion'],
  },
  {
    icon: Shield,
    title: 'Industrial Safety & Fail-Safe',
    desc: 'ISO 13849 & ISO 10218 safety compliance with hardware emergency e-stops, safe torque off (STO), and redundant sensory fail-safes.',
    badge: 'Enterprise Safety',
    highlights: ['SIL-3 / Cat 4 Certified Logic', 'Safe Speed Monitoring', 'Redundant Sensor Watchdogs'],
  },
];

const roboticsPillars = [
  {
    id: 'industrial',
    label: 'Industrial Automation',
    title: 'Intelligent Manufacturing & Pick-and-Place',
    desc: 'Transform assembly lines into adaptive smart cells with vision-guided cobots that adapt to variable part orientations without re-tooling.',
    stats: [
      { label: 'Throughput Boost', val: '+340%' },
      { label: 'Downtime Reduction', val: '99.4%' },
      { label: 'Cycle Time', val: '0.8s' },
    ],
    features: [
      'Vision-guided pick and place with suction & pneumatic grippers',
      'Automated optical inspection (AOI) with AI confidence thresholds',
      'Direct PLC & OPC-UA integration with SCADA enterprise backends',
      'Live predictive maintenance telemetry monitoring motor thermals and vibrations',
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'logistics',
    label: 'Autonomous Logistics',
    title: 'Warehouse AMRs & Material Transport',
    desc: 'Eliminate manual transit with autonomous tuggers and pallet movers that dynamically plan routes across busy distribution centers.',
    stats: [
      { label: 'Payload Capacity', val: '1,200 kg' },
      { label: 'Localization Error', val: '< 5 mm' },
      { label: 'Battery Runtime', val: '14 hrs' },
    ],
    features: [
      'Natural feature SLAM mapping without floor magnetic tapes or QR tags',
      'Dynamic elevator calling and automated door opening protocols',
      'Automatic self-docking contact charging stations with zero human intervention',
      'Central fleet manager with live bottleneck heatmaps and traffic prioritization',
    ],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  },
  {
    id: 'automotive',
    label: 'Automotive & Heavy Industry',
    title: 'Heavy Payload & Welding Robot Cells',
    desc: 'Continuous arc welding, seam tracking, and multi-robot synchronized spot welding cells with millisecond precision.',
    stats: [
      { label: 'Payload Range', val: '50-500 kg' },
      { label: 'Repeatability', val: '±0.02 mm' },
      { label: 'Uptime Score', val: '99.9%' },
    ],
    features: [
      'Adaptive laser seam tracking adjusting to thermal joint expansions',
      'Synchronized dual-arm collaborative welding with coordinated kinematics',
      'Real-time weld pool monitoring with optical thermal cameras',
      'Automated collision-free multi-arm path synchronization',
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  },
  {
    id: 'electronics',
    label: 'Electronics & Micro-Assembly',
    title: 'High-Speed Precision PCB & Micro Insertion',
    desc: 'Ultra-fast delta robots and SCARA manipulators executing surface-mount components, pin insertion, and micro-soldering.',
    stats: [
      { label: 'Pick Rate', val: '180 / min' },
      { label: 'Position Accuracy', val: '15 µm' },
      { label: 'Yield Rate', val: '99.94%' },
    ],
    features: [
      'High-speed vacuum pick-and-place with optical alignment correction',
      'Micro-force feedback sensing preventing delicate SMD component cracking',
      'Cleanroom ISO Class 4 certified robotic mechanics',
      'Real-time automated defect sorting with sub-pixel vision inspection',
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  },
];

const aiVisionHighlights = [
  {
    title: '3D Spatial Mapping & Point Clouds',
    desc: 'Stereo RGB-D cameras coupled with LiDAR point cloud segmentation generate 360° voxel grids for collision avoidance and volumetric sizing.',
    metric: '60 FPS',
    label: 'Real-time Depth Streaming',
  },
  {
    title: 'TensorRT & Jetson Orin Acceleration',
    desc: 'Custom FP16 and INT8 quantized neural network inference pipelines deployed directly on embedded NVIDIA Jetson edge computers.',
    metric: '4.2 ms',
    label: 'Inference Latency',
  },
  {
    title: 'Automated Optical Inspection (AOI)',
    desc: 'Ultra-high-resolution vision models detecting micro-scratches, misalignments, solder bridges, and component discrepancies.',
    metric: '99.85%',
    label: 'Defect Detection Accuracy',
  },
  {
    title: 'Dynamic Visual Servoing & Tracking',
    desc: 'Real-time visual feedback loops directing robotic end-effectors toward dynamic moving targets with sub-millimeter precision.',
    metric: '< 8 ms',
    label: 'Visual Servo Loop',
  },
];

const trainingKits = [
  {
    title: 'ROS 2 Autonomous Mobile Rover (AMR) Kit',
    desc: '4WD differential chassis, 360° 2D/3D LiDAR sensor, depth camera, Raspberry Pi 5 / Jetson compute module, and pre-configured ROS 2 navigation stack.',
    badge: 'Hardware Kit Included',
    specs: ['LiDAR SLAM Mapping', 'Nav2 Path Planning', 'Python & C++ API'],
  },
  {
    title: '6-DOF Precision Robotic Arm Lab',
    desc: 'Desktop collaborative robotic arm equipped with digital servos, gripper actuators, camera bracket, and MoveIt 2 kinematics control software.',
    badge: 'Hands-on Kinematics',
    specs: ['Inverse Kinematics', 'MoveIt 2 Trajectories', 'Vision Pick & Place'],
  },
  {
    title: 'Industry Capstone & 6-Month Internship',
    desc: 'Work on live industrial robotics and edge AI automation projects evaluated by senior robotics engineers from WorknAi Pune R&D studio.',
    badge: 'Career Certification',
    specs: ['Live Industry Projects', 'Engineering Mentorship', 'Placement Assistance'],
  },
];

const faqs = [
  {
    q: 'What robotics solutions and stacks does WorknAi develop?',
    a: 'We build end-to-end robotics software and hardware integration based on ROS 2 (Robot Operating System 2), NVIDIA Jetson edge AI compute, Micro-ROS for embedded microcontrollers (STM32/ESP32), MoveIt 2 kinematics planning, and Gazebo/Isaac Sim digital twin environments.',
  },
  {
    q: 'Can WorknAi integrate robotics into our existing factory machinery or warehouse?',
    a: 'Yes. We provide custom retrofitting and integration services. Our software interfaces with existing PLCs, SCADA networks, OPC-UA protocols, and ERP/WMS backends to modernize legacy lines with autonomous navigation and smart pick-and-place capabilities.',
  },
  {
    q: 'Do you offer hands-on robotics training courses and student internships?',
    a: 'Yes! WorknAi offers comprehensive hands-on training courses and industry internships in Pune & online. Students and professionals work with real AMR rovers, 6-DOF robotic arms, LiDAR sensors, and ROS 2 simulation suites under direct mentorship.',
  },
  {
    q: 'How safe are your autonomous robots in human-occupied workspaces?',
    a: 'All our industrial and logistics robotic deployments comply with ISO 13849 safety standards. They feature 360° LiDAR safety zones, dual-channel emergency e-stops, tactile bumper switches, and ultra-fast dynamic collision detection that immediately halts or safely maneuvers around personnel.',
  },
  {
    q: 'What hardware is included with the Robotics Training kits?',
    a: 'Students receive a complete hardware kit including a 4WD differential chassis, 360° LiDAR mapping sensor, RGB-D depth camera, Raspberry Pi 5 / NVIDIA Jetson compute module, micro-controller board, battery pack, and complete ROS 2 codebase.',
  },
  {
    q: 'How do we request a custom robotics development consultation or lab demo?',
    a: 'You can contact our engineering team via the Contact form above or schedule a consultation. We analyze your technical specifications, provide feasibility reports with simulated digital twins, and offer turnkey hardware-software execution.',
  },
];

function FAQItem({ q, a, isDark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md ${isDark
      ? 'bg-[#0e0c1f]/90 border-violet-500/25 hover:border-violet-400/50'
      : 'bg-white border-slate-200/90 hover:border-violet-400/50'
      }`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none transition-colors"
      >
        <span className={`font-semibold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {q}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
          }`}>
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-6 pb-6 text-sm sm:text-base leading-relaxed border-t pt-4 ${isDark ? 'text-slate-300 border-violet-500/15' : 'text-slate-600 border-slate-100'
              }`}>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Robotics() {
  const [activeTab, setActiveTab] = useState('industrial');
  const currentPillar = roboticsPillars.find((p) => p.id === activeTab) || roboticsPillars[0];
  const { isDark } = useTheme();
  const location = useLocation();

  // Demo form state
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    company: '',
    solution: 'Autonomous Mobile Robots (AMRs)',
    date: '',
    message: '',
  });
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Smooth scroll to anchor on hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const elem = document.getElementById(id);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, [location.hash]);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoForm({
        name: '',
        email: '',
        company: '',
        solution: 'Autonomous Mobile Robots (AMRs)',
        date: '',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className={`robotics-page min-h-screen scroll-smooth ${isDark ? 'bg-[#06030f] text-white' : 'bg-white text-slate-900'}`}>
      {/* ===== HERO SECTION ===== */}
      <section className={`relative overflow-hidden min-h-[calc(100vh-65px)] flex items-center pt-10 pb-8 md:pt-14 md:pb-10 border-b ${isDark ? 'border-violet-500/20' : 'border-slate-200'}`}>
        {/* Glow ambient background elements in Dark Mode */}
        {isDark && (
          <>
            <div className="glow-orb w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-violet-700 top-20 -left-20 md:-left-40 animate-pulse-slow" />
            <div className="glow-orb w-[150px] h-[150px] md:w-[400px] md:h-[400px] bg-sky-600/40 top-1/3 -right-20 animate-pulse-slow" />
          </>
        )}

        <div className="container-x relative px-4 sm:px-6 md:px-10 max-w-[1360px] mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full min-h-[calc(100vh-140px)]">
            {/* Left Hero Content - Strict 3-Line Heading with High Contrast Visibility */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="lg:col-span-7 flex flex-col items-start -mt-3 lg:-mt-6 w-full"
            >
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border ${isDark
                  ? 'border-violet-400/30 bg-violet-500/10 text-violet-200'
                  : 'border-violet-200 bg-violet-50 text-violet-700'
                  }`}>
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Next-Gen Robotics & Autonomous Intelligence
                </span>
              </motion.div>

              {/* Exact 3-line heading layout matching Overview Tab */}
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="display-h text-[clamp(2.1rem,4.1vw,3.75rem)] mt-5 leading-[1.04]"
              >
                <span className={`block ${isDark ? 'text-gradient' : 'text-slate-900'}`}>
                  Engineering the
                </span>
                <span className={`block ${isDark ? 'text-gradient' : 'text-slate-900'}`}>
                  Future of
                </span>
                <Typewriter
                  words={['Robotics & Autonomy.', 'Autonomous AMRs.', 'Industrial Cobots.', 'Edge AI Vision.']}
                  className={`block whitespace-nowrap ${isDark ? 'text-violet-300' : 'text-violet-600'}`}
                />
              </motion.h1>

              {/* Clean 3-line subtitle paragraph */}
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-slate-300' : 'text-slate-600'} mt-5 max-w-xl md:max-w-2xl leading-relaxed font-normal`}
              >
                From autonomous mobile rovers (AMRs) and ROS 2 kinematics to edge AI vision and industrial cobots — we engineer intelligent robotics systems that perceive, plan, and execute with precision.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="flex flex-wrap items-center gap-4 mt-7 w-full sm:w-auto"
              >
                <a href="#contact" className="btn-primary text-base font-semibold !px-6 !py-3 w-full sm:w-auto justify-center">
                  Book a Live Demo <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
                <a
                  href="#training"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all text-base border ${isDark
                    ? 'text-white border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20'
                    : 'text-slate-900 border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50/50'
                    }`}
                >
                  <Laptop className="w-4 h-4 mr-1 text-violet-500" />
                  Explore Robotics Training
                </a>
              </motion.div>

              {/* Quick Spec Strip */}
              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-3 gap-6 pt-5 mt-5 border-t w-full max-w-lg ${isDark ? 'border-violet-500/20' : 'border-slate-200'
                  }`}
              >
                <div>
                  <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>ROS 2</p>
                  <p className={`text-xs uppercase tracking-wider mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time Core</p>
                </div>
                <div>
                  <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>&lt; 5ms</p>
                  <p className={`text-xs uppercase tracking-wider mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Control Loop</p>
                </div>
                <div>
                  <p className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>99.8%</p>
                  <p className={`text-xs uppercase tracking-wider mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SLAM Precision</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Interactive 3D Robot Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-5 relative w-full h-full min-h-[520px] lg:min-h-[620px] lg:h-[calc(100vh-140px)] flex items-center justify-center"
            >
              <Robot3DCanvas height="100%" frameless={true} showHud={false} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 1: SOLUTIONS & SYSTEM CAPABILITIES ===== */}
      <section id="solutions" className={`section py-20 border-b scroll-mt-20 ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-slate-50/60 border-slate-200'
        }`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
              }`}>
              Core Solutions
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Full-Stack Robotics Solutions
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              We bridge high-level artificial intelligence algorithms with low-level embedded hardware and real-world industrial actuation.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  variants={fadeUp}
                  className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 shadow-lg ${isDark
                    ? 'bg-[#0e0c1f]/80 border-violet-500/20 hover:border-violet-400/50'
                    : 'bg-white border-slate-200/90 hover:border-violet-300 shadow-md'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all ${isDark
                        ? 'bg-violet-500/15 border-violet-400/30 text-violet-400'
                        : 'bg-violet-50 border-violet-200 text-violet-600'
                        }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${isDark
                        ? 'bg-violet-500/10 border-violet-400/20 text-violet-300'
                        : 'bg-violet-50 border-violet-200 text-violet-700'
                        }`}>
                        {cap.badge}
                      </span>
                    </div>

                    <h3 className={`font-display text-xl sm:text-2xl font-bold mb-3 transition-colors ${isDark
                      ? 'text-white group-hover:text-violet-300'
                      : 'text-slate-900 group-hover:text-violet-600'
                      }`}>
                      {cap.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                      {cap.desc}
                    </p>
                  </div>

                  <ul className={`space-y-2 pt-4 border-t text-xs sm:text-sm ${isDark ? 'border-violet-500/15 text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}>
                    {cap.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 2: INDUSTRIES & DEPLOYMENT VERTICALS ===== */}
      <section id="industries" className={`section py-20 relative border-b scroll-mt-20 ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-white border-slate-200'
        }`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
              }`}>
              Industries & Deployments
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Real-World Industry Applications
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Explore specialized robotic deployments across manufacturing assembly, warehouse logistics, automotive, and micro-electronics.
            </p>
          </motion.div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {roboticsPillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${activeTab === p.id
                  ? 'bg-violet-600 text-white border-violet-400 shadow-lg shadow-violet-600/30'
                  : isDark
                    ? 'bg-[#0e0c1f] text-slate-300 border-violet-500/20 hover:border-violet-400/40 hover:text-white'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:text-slate-900 shadow-sm'
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Tab Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-3xl p-6 sm:p-10 border grid lg:grid-cols-12 gap-8 items-center shadow-xl ${isDark ? 'bg-[#0e0c1f]/90 border-violet-500/25' : 'bg-slate-50/70 border-slate-200/90'
                }`}
            >
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <span className={`text-xs font-mono uppercase tracking-widest font-semibold mb-2 block ${isDark ? 'text-violet-400' : 'text-violet-600'
                    }`}>
                    Vertical Focus: {currentPillar.label}
                  </span>
                  <h3 className={`font-display text-2xl sm:text-3xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                    {currentPillar.title}
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                    {currentPillar.desc}
                  </p>

                  <div className={`grid grid-cols-3 gap-4 p-4 rounded-2xl border mb-8 ${isDark ? 'bg-[#080614] border-violet-500/20' : 'bg-white border-slate-200'
                    }`}>
                    {currentPillar.stats.map((st) => (
                      <div key={st.label} className="text-center">
                        <p className={`text-xl sm:text-2xl font-extrabold ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>{st.val}</p>
                        <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{st.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-8">
                    {currentPillar.features.map((feat) => (
                      <div key={feat} className={`flex items-start gap-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                        <span className="mt-2 w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a href="#contact" className="btn-primary text-sm font-semibold !px-5 !py-2.5">
                    Deploy Solution <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                  <a
                    href="#ai-vision"
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${isDark
                      ? 'text-white border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20'
                      : 'text-slate-900 border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50/50'
                      }`}
                  >
                    Explore Vision Tech <ArrowUpRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className={`rounded-2xl overflow-hidden border shadow-xl aspect-[4/3] ${isDark ? 'border-violet-500/20' : 'border-slate-200'
                  }`}>
                  <img
                    src={currentPillar.image}
                    alt={currentPillar.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===== SECTION 3: AI VISION & EDGE INTELLIGENCE ===== */}
      <section id="ai-vision" className={`section py-20 border-b scroll-mt-20 ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-slate-50/60 border-slate-200'
        }`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
              }`}>
              Edge Spatial Intelligence
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              AI Vision & Edge Intelligence
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Equip robotic systems with human-like spatial cognition, automated micro-defect sorting, and sub-millisecond TensorRT neural inference.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-center mb-12">
            <div className="lg:col-span-5">
              <div className={`rounded-3xl overflow-hidden border shadow-2xl aspect-[4/3] relative group ${isDark ? 'border-violet-500/20' : 'border-slate-200'
                }`}>
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80"
                  alt="AI Vision"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="chip mb-2">Embedded TensorRT</span>
                    <p className="text-white font-bold text-lg">Sub-5ms Edge Vision Pipeline</p>
                    <p className="text-white/80 text-xs mt-1">Multi-spectral spatial tracking on NVIDIA Jetson</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {aiVisionHighlights.map((item) => (
                <div key={item.title} className={`rounded-2xl p-6 border transition-all group ${isDark
                  ? 'bg-[#0e0c1f]/80 border-violet-500/20 hover:border-violet-400/40 text-white'
                  : 'bg-white border-slate-200 hover:border-violet-300 text-slate-900 shadow-sm'
                  }`}>
                  <div className="flex items-center justify-between mb-4">
                    <Eye className={`w-6 h-6 group-hover:scale-110 transition-transform ${isDark ? 'text-violet-400' : 'text-violet-600'
                      }`} />
                    <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-50 text-violet-700'
                      }`}>
                      {item.metric}
                    </span>
                  </div>
                  <h4 className={`font-display text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: ROBOTICS TRAINING & LABS ===== */}
      <section id="training" className={`section py-20 relative border-b scroll-mt-20 ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-white border-slate-200'
        }`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
              }`}>
              Hands-on R&D Labs
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Robotics Training & Internship Kits
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Master ROS 2, robotic kinematics, LiDAR SLAM, and embedded micro-controllers with hardware development kits and mentor guidance in Pune.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {trainingKits.map((kit) => (
              <div key={kit.title} className={`rounded-2xl p-7 border transition-all flex flex-col justify-between group hover:-translate-y-1.5 shadow-lg ${isDark
                ? 'bg-[#0e0c1f]/80 border-violet-500/20 hover:border-violet-400/50 text-white'
                : 'bg-slate-50/70 border-slate-200 hover:border-violet-300 text-slate-900 shadow-sm'
                }`}>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <Laptop className={`w-8 h-8 group-hover:scale-110 transition-transform ${isDark ? 'text-violet-400' : 'text-violet-600'
                      }`} />
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDark ? 'bg-violet-500/15 text-violet-300 border border-violet-400/20' : 'bg-violet-50 text-violet-700 border border-violet-200'
                      }`}>
                      {kit.badge}
                    </span>
                  </div>
                  <h3 className={`font-display text-xl font-bold mb-3 transition-colors ${isDark ? 'text-white group-hover:text-violet-300' : 'text-slate-900 group-hover:text-violet-600'
                    }`}>
                    {kit.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {kit.desc}
                  </p>
                </div>

                <div className={`pt-4 border-t space-y-2 ${isDark ? 'border-violet-500/15' : 'border-slate-200'}`}>
                  {kit.specs.map((s) => (
                    <div key={s} className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                  <Link
                    to="/courses"
                    className={`w-full justify-center text-xs font-semibold mt-4 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border transition-all ${isDark
                      ? 'text-white border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20'
                      : 'text-slate-900 border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50/50'
                      }`}
                  >
                    View Course Syllabus <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CONTACT + BOOK DEMO ===== */}
      <section id="contact" className={`section py-20 border-b scroll-mt-20 ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-slate-50/60 border-slate-200'
        }`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
                }`}>
                Live Demonstration
              </span>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                }`}>
                Book a Live Robotics Demo
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Experience our autonomous AMRs, collaborative robotic arms, and edge AI vision inspection live at our Pune R&D studio or via interactive video stream.
              </p>

              <div className="space-y-4 mb-8">
                <div className={`flex items-start gap-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Interactive simulation & hardware rover demonstration</span>
                </div>
                <div className={`flex items-start gap-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Technical feasibility & return-on-investment (ROI) analysis</span>
                </div>
                <div className={`flex items-start gap-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct consultation with lead robotics system architects</span>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#0e0c1f] border-violet-500/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}>
                <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Direct Engineering Hotline</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <PhoneCall className={`w-4 h-4 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
                  +91 (020) WorknAi-ROBOT
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className={`rounded-3xl p-8 sm:p-10 border shadow-2xl relative ${isDark ? 'bg-[#0e0c1f]/95 border-violet-500/30 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
                }`}>
                {demoSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">Demo Request Received!</h3>
                    <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Thank you! A WorknAi robotics architect will reach out within 24 hours to confirm your scheduled demonstration slot.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit} className="space-y-4">
                    <h3 className="font-display text-2xl font-bold mb-1">Schedule Your Session</h3>
                    <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Fill in the details below and our team will prepare a custom demonstration scope.</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={demoForm.name}
                          onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                            ? 'bg-[#16122e] border-violet-500/30 text-white placeholder-slate-400 focus:border-violet-400 focus:bg-[#1c173b]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Work Email</label>
                        <input
                          type="email"
                          required
                          value={demoForm.email}
                          onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                          placeholder="john@company.com"
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                            ? 'bg-[#16122e] border-violet-500/30 text-white placeholder-slate-400 focus:border-violet-400 focus:bg-[#1c173b]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Company / Institute</label>
                        <input
                          type="text"
                          required
                          value={demoForm.company}
                          onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                          placeholder="Company or College"
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                            ? 'bg-[#16122e] border-violet-500/30 text-white placeholder-slate-400 focus:border-violet-400 focus:bg-[#1c173b]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Solution of Interest</label>
                        <select
                          value={demoForm.solution}
                          onChange={(e) => setDemoForm({ ...demoForm, solution: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
                            ? 'bg-[#16122e] border-violet-500/30 text-white focus:border-violet-400 focus:bg-[#1c173b]'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white'
                            }`}
                        >
                          <option value="Autonomous Mobile Robots (AMRs)">Autonomous Mobile Robots (AMRs)</option>
                          <option value="Robotic Arms & Cobots">Robotic Arms & Cobots</option>
                          <option value="Edge AI & Computer Vision">Edge AI & Computer Vision</option>
                          <option value="Robotics Training & Labs">Robotics Training & Labs</option>
                          <option value="Custom Enterprise R&D">Custom Enterprise R&D</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Details or Requirements</label>
                      <textarea
                        rows="3"
                        value={demoForm.message}
                        onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                        placeholder="Tell us about your automation timeline, deployment requirements, or training goals..."
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none ${isDark
                          ? 'bg-[#16122e] border-violet-500/30 text-white placeholder-slate-400 focus:border-violet-400 focus:bg-[#1c173b]'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                          }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full justify-center font-semibold text-base py-3 mt-4 shadow-lg shadow-violet-600/30"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Demo & Consultation Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH STACK STRIP ===== */}
      <section className={`py-16 border-b ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-slate-50 border-slate-200'}`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10 text-center">
          <p className={`text-xs uppercase tracking-widest font-semibold mb-8 ${isDark ? 'text-violet-400' : 'text-violet-600'
            }`}>
            Powering Autonomous Systems With Industry-Standard Tech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              'ROS 2 (Humble / Iron)',
              'NVIDIA Isaac Sim',
              'NVIDIA Jetson Orin',
              'Gazebo Sim',
              'MoveIt 2',
              'OpenCV & TensorRT',
              'Micro-ROS',
              'Python & Modern C++20',
              'STM32 / ARM Cortex',
              'LiDAR SLAM',
            ].map((tech) => (
              <span
                key={tech}
                className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-mono transition-colors shadow-sm ${isDark
                  ? 'bg-violet-500/10 border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-400/40'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-violet-600 hover:border-violet-300'
                  }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQS ===== */}
      <section className={`section py-20 border-b ${isDark ? 'bg-[#06030f] border-violet-500/20' : 'bg-slate-50/60 border-slate-200'}`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 border ${isDark ? 'border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border-violet-200 bg-violet-50 text-violet-700'
              }`}>
              Frequently Asked Questions
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Robotics Engineering & FAQs
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-violet-300 rounded-full mx-auto mb-5" />
            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Got questions about ROS 2 kinematics, custom hardware integration, or hands-on training? Find direct technical answers below.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {faqs.slice(0, 3).map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} isDark={isDark} />
              ))}
            </div>
            <div className="space-y-4">
              {faqs.slice(3, 6).map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className={`section pb-24 pt-12 ${isDark ? 'bg-[#06030f]' : 'bg-white'}`}>
        <div className="container-x max-w-[1360px] mx-auto px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden border shadow-2xl ${isDark
              ? 'bg-[#0e0c1f]/90 border-violet-500/30 text-white'
              : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xl'
              }`}
          >
            {isDark && (
              <div className="glow-orb w-96 h-96 bg-violet-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
            <div className="relative max-w-2xl mx-auto">
              <Bot className={`w-14 h-14 mx-auto mb-6 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                }`}>
                Ready to Build or Learn <span className={isDark ? 'text-violet-300' : 'text-violet-600'}>Intelligent Robotics?</span>
              </h2>
              <p className={`text-base sm:text-lg md:text-xl mb-8 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                Whether you want to automate industrial workflows with autonomous AMRs or enroll in practical ROS 2 robotics training, our engineers are here to help.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="#contact" className="btn-primary font-semibold !px-6 !py-3">
                  Schedule Demo & Consultation <ArrowRight className="w-4 h-4 ml-1" />
                </a>
                <Link
                  to="/courses"
                  className={`inline-flex items-center gap-1.5 px-6 py-3 rounded-full font-semibold transition-all border ${isDark
                    ? 'text-white border-violet-400/30 bg-violet-500/10 hover:bg-violet-500/20'
                    : 'text-slate-900 border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50/50'
                    }`}
                >
                  Explore Training Programs <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
