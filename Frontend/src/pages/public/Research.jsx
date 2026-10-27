import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Cpu, Layers, Radio, Sparkles,
  Zap, Play, Activity, CheckCircle2, ShieldCheck, Terminal,
  Compass, Eye, Box, CircuitBoard, Maximize2, Shield, Check,
  Bot, Cog, Award, Users, HardDrive, X, Pause, BookOpen, Send
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── 1. Research Pathways Data with Rich Step Visuals ──────────────────────────
const RESEARCH_PATHWAYS = [
  {
    number: '01',
    stageLabel: 'DESIGN',
    journeyMeaning: 'Create and validate the robot',
    title: 'How to Make a Robot',
    shortLine: 'Design the robot before building it.',
    microKeywords: 'CAD • Motion • Simulation',
    ctaText: 'Explore Design',
    tag: 'Kinematics & Embedded Architecture',
    summary: 'From mathematical joint kinematics to multi-layer FOC motor control and hard real-time sensor fusion.',
    image: '/research/pathway_make_robot.jpg',
    previewVideo: '/research/pathway_make_robot.jpg',
    techStack: ['SolidWorks', 'ROS 2 Humble', 'KiCad PCB', 'CAN-FD', 'FreeRTOS'],
    steps: [
      {
        number: '01',
        phase: 'Kinematics & FEA',
        title: 'CAD Modeling & Stress Analysis',
        desc: 'Design, simulate and validate robotic mechanisms using SolidWorks and FEA.',
        image: '/research/pathway_make_robot.jpg',
        metric: '99.4% Sim Accuracy',
        tag: 'SolidWorks FEA',
      },
      {
        number: '02',
        phase: 'Power & Drive',
        title: 'FOC Motor Controllers & Custom PMU',
        desc: 'Learn motor control, driver design and power management for high performance robots.',
        image: '/research/topic_ai_chip.jpg',
        metric: '48V / 80A Peak',
        tag: 'Field-Oriented Control',
      },
      {
        number: '03',
        phase: 'Embedded Core',
        title: 'RTOS & High-Speed Sensor Fusion',
        desc: 'Implement real-time firmware with multi-sensor fusion for precise control.',
        image: '/research/topic_components.jpg',
        metric: '1000 Hz Real-Time',
        tag: 'STM32H7 Dual-Core',
      },
      {
        number: '04',
        phase: 'Hardware Bringup',
        title: 'Assembly & Sub-Millimeter Zeroing',
        desc: 'Integrate, calibrate and test in real-world environments.',
        image: '/research/topic_assembly.jpg',
        metric: '±0.01 mm Tolerance',
        tag: 'EtherCAT Bus',
      },
    ],
  },
  {
    number: '02',
    stageLabel: 'BUILD',
    journeyMeaning: 'Turn the design into physical hardware',
    title: 'How Robots are Manufactured',
    shortLine: 'Turn the design into physical hardware.',
    microKeywords: 'Manufacturing • Assembly • Testing',
    ctaText: 'Explore Manufacturing',
    tag: 'Precision Fabrication & Cleanroom SMT',
    summary: 'Aerospace aluminum 5-axis milling, automated high-speed SMT placement, and 72-hour burn-in stress testing.',
    image: '/research/pathway_manufacture.jpg',
    previewVideo: '/research/pathway_manufacture.jpg',
    techStack: ['5-Axis CNC', 'Cleanroom SMT', 'Strain-Wave Gearing', 'ISO 9001', 'AOI Inspection'],
    steps: [
      {
        number: '01',
        phase: 'CNC Machining',
        title: '5-Axis Sub-Micron Chassis Milling',
        desc: 'Precision CNC machining of aerospace-grade alloy frames.',
        image: '/research/pathway_manufacture.jpg',
        metric: '±5 µm Tolerance',
        tag: '7075-T6 Alloy',
      },
      {
        number: '02',
        phase: 'SMT Placement',
        title: 'High-Speed Cleanroom SMT Lines',
        desc: 'Automated placement of high-density surface mount components.',
        image: '/research/topic_ai_chip.jpg',
        metric: '45k Components/Hr',
        tag: '3D Optical SPI',
      },
      {
        number: '03',
        phase: 'Actuator Mating',
        title: 'Zero-Backlash Harmonic Assembly',
        desc: 'Mating ultra-low friction strain-wave gear reducers.',
        image: '/research/topic_components.jpg',
        metric: '< 0.1 arcmin Backlash',
        tag: 'Frameless BLDC',
      },
      {
        number: '04',
        phase: 'Quality Testing',
        title: '72-Hour Burn-in & Thermal Stress',
        desc: 'Continuous dynamic stress testing and thermal equilibrium validation.',
        image: '/research/topic_assembly.jpg',
        metric: '100k+ Hrs MTBF',
        tag: 'Full Torque Test',
      },
    ],
  },
  {
    number: '03',
    stageLabel: 'TRAIN',
    journeyMeaning: 'Teach the robot how to operate',
    title: 'How to Train a Robot',
    shortLine: 'Teach robots how to perceive and act.',
    microKeywords: 'AI • Sensors • Simulation',
    ctaText: 'Explore Robot Training',
    tag: 'Reinforcement Learning & Sim-to-Real',
    summary: 'Simulating 16,000+ parallel robots inside GPU physics engines and zero-shot deployment to physical edge silicon.',
    image: '/research/pathway_train_robot.jpg',
    previewVideo: '/research/sim_to_real_sim.jpg',
    techStack: ['NVIDIA Isaac Sim', 'PyTorch RL', 'Domain Randomization', 'CUDA Omni', 'Jetson Orin'],
    steps: [
      {
        number: '01',
        phase: 'Digital Twin',
        title: 'Photorealistic Rigid-Body Simulation',
        desc: 'Physics-accurate simulation of kinematics and environmental forces.',
        image: '/research/topic_sim_test.jpg',
        metric: '99.8% Physics Fidelity',
        tag: 'Omniverse USD',
      },
      {
        number: '02',
        phase: 'GPU RL Training',
        title: 'Massively Parallel Policy Training',
        desc: 'PPO and SAC reinforcement learning at 10,000x real-time.',
        image: '/research/sim_to_real_sim.jpg',
        metric: '10,000x Real-time',
        tag: 'PPO / SAC Algorithms',
      },
      {
        number: '03',
        phase: 'Perturbation',
        title: 'Domain Randomization & Tuning',
        desc: 'Randomized latency, friction and sensory noise for zero-shot resilience.',
        image: '/research/pathway_train_robot.jpg',
        metric: '98.7% Robustness',
        tag: 'Latency Invariance',
      },
      {
        number: '04',
        phase: 'Edge Inference',
        title: 'Zero-Shot TensorRT Model Flash',
        desc: 'Compiled INT8 models running on embedded NVIDIA Jetson AGX.',
        image: '/research/sim_to_real_real.jpg',
        metric: '2.1 ms Latency',
        tag: 'Jetson Orin AGX',
      },
    ],
  },
  {
    number: '04',
    stageLabel: 'DEPLOY',
    journeyMeaning: 'Put the robot to work',
    title: 'Real-World Applications',
    shortLine: 'Put intelligent machines to work.',
    microKeywords: 'Logistics • Inspection • Automation',
    ctaText: 'Explore Applications',
    tag: 'Autonomous Enterprise Fleets',
    summary: 'Scalable autonomous mobile robots, precision collaborative manipulators, and ruggedized inspection platforms.',
    image: '/research/pathway_real_world.jpg',
    previewVideo: '/research/pathway_real_world.jpg',
    techStack: ['3D SLAM', 'VLA Foundation Models', 'Fleet Nav2', 'IP67 Sealed', 'Cloud Telemetry'],
    steps: [
      {
        number: '01',
        phase: 'Warehouse AMRs',
        title: 'Intralogistics & Heavy Pallet AMRs',
        desc: 'LiDAR SLAM navigation for high-load warehouse transport.',
        image: '/research/pathway_real_world.jpg',
        metric: '1,500 kg Payload',
        tag: 'LiDAR SLAM Nav',
      },
      {
        number: '02',
        phase: 'Smart Cobots',
        title: 'Vision-Guided Robotic Manipulators',
        desc: '6-DOF collaborative arms with adaptive force-torque compliance.',
        image: '/research/cta_robotic_arm.jpg',
        metric: '±0.01 mm Repeatability',
        tag: 'Force-Torque Sense',
      },
      {
        number: '03',
        phase: 'Field Patrol',
        title: 'Autonomous Quadruped Inspection',
        desc: 'All-terrain quadruped robots for perimeter and thermal scanning.',
        image: '/research/sim_to_real_real.jpg',
        metric: '4.5 Hrs Range',
        tag: 'Thermal / Ultrasound',
      },
      {
        number: '04',
        phase: 'Fleet Control',
        title: 'Cloud Fleet Telemetry & OTA Sync',
        desc: 'Real-time multi-robot coordination with centralized telemetry.',
        image: '/research/hero_robot_lab.jpg',
        metric: '99.95% Fleet Uptime',
        tag: 'Live Telemetry',
      },
    ],
  },
];

// ─── 2. Real-World Impact (6 Sector Cards) ─────────────────────────────────────
const REAL_WORLD_IMPACT = [
  {
    sector: 'Manufacturing',
    desc: 'Robotic assembly & QA',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
  },
  {
    sector: 'Healthcare',
    desc: 'Assistive & surgical robotics',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
  },
  {
    sector: 'Logistics',
    desc: 'Autonomous warehouses',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
  },
  {
    sector: 'Agriculture',
    desc: 'Precision farming & crop health',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
  },
  {
    sector: 'Inspection',
    desc: 'Infrastructure & asset monitoring',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80',
  },
  {
    sector: 'Defense & Security',
    desc: 'Surveillance & autonomous patrol',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
  },
];

export default function Research() {
  const { isDark } = useTheme();
  const location = useLocation();
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const detailSectionRef = useRef(null);

  const activePathway = selectedPathway 
    ? (RESEARCH_PATHWAYS.find((p) => p.number === selectedPathway) || null) 
    : null;
  const activeStep = activePathway ? (activePathway.steps[selectedStepIndex] || activePathway.steps[0]) : null;

  // Reset step index when pathway changes
  useEffect(() => {
    setSelectedStepIndex(0);
  }, [selectedPathway]);

  // Handle URL hash navigation (#make-robot, #manufacture-robot, #train-robot, #pathways)
  useEffect(() => {
    if (location.hash) {
      if (location.hash === '#make-robot') setSelectedPathway('01');
      else if (location.hash === '#manufacture-robot') setSelectedPathway('02');
      else if (location.hash === '#train-robot') setSelectedPathway('03');
      else if (location.hash === '#deploy-robot') setSelectedPathway('04');

      const targetId = ['#make-robot', '#manufacture-robot', '#train-robot', '#deploy-robot'].includes(location.hash)
        ? '#pathways'
        : location.hash;
      const el = document.querySelector(targetId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
      }
    }
  }, [location.hash]);

  const handleSelectPathway = (number) => {
    setSelectedPathway(number);
    setTimeout(() => {
      if (detailSectionRef.current) {
        detailSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#05030f] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* ─── 1. HERO SECTION: "Real Robotics for Physical Intelligence" ────── */}
      <section className={`relative overflow-hidden w-full min-h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)] py-8 lg:py-0 border-b transition-colors duration-300 flex items-center ${
        isDark ? 'border-violet-500/20 bg-[#05030f]' : 'border-slate-200 bg-white'
      }`}>
        
        {/* Right-Side Full-Strength Robotics Photograph with Narrow Edge Feather */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] xl:w-[58%] h-full z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/research/hero_robot_lab.jpg"
            alt="WorknAI Physical AI & Robotics Laboratory"
            loading="eager"
            fetchpriority="high"
            className="w-full h-full object-cover object-[28%_center] sm:object-[32%_center] lg:object-[36%_center] opacity-100 contrast-[1.04] saturate-[1.02]"
          />
          {/* Organic Blurred Curved Boundary Line blending seamlessly into the photograph */}
          <div className="absolute top-0 bottom-0 left-0 w-28 sm:w-36 lg:w-48 hidden lg:block pointer-events-none z-10 overflow-visible">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="heroCurveBlur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <linearGradient id="heroCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isDark ? '#05030f' : '#ffffff'} stopOpacity="1" />
                  <stop offset="45%" stopColor={isDark ? '#05030f' : '#ffffff'} stopOpacity="0.9" />
                  <stop offset="75%" stopColor={isDark ? '#05030f' : '#ffffff'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isDark ? '#05030f' : '#ffffff'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M -10,-10 L 45,-10 Q 95,50 35,110 L -10,110 Z"
                fill="url(#heroCurveGrad)"
                filter="url(#heroCurveBlur)"
              />
            </svg>
          </div>
          {/* Mobile / Tablet vertical gradient overlay for clean typography on small screens */}
          <div 
            className="absolute inset-0 lg:hidden pointer-events-none z-10"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(5,3,15,0.96) 0%, rgba(5,3,15,0.88) 55%, rgba(5,3,15,0.25) 85%, rgba(5,3,15,0) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,0.25) 85%, rgba(255,255,255,0) 100%)'
            }}
          />
        </div>

        {/* Bottom subtle glowing laser accent line */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent z-[2]" />

        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          
          {/* Left Hero Content Box with professional, high-trust engineering presentation */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-[560px] lg:max-w-[620px] xl:max-w-[650px] space-y-4"
          >
            {/* Verified Badge (matching AI Innovation standard) */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${
              isDark 
                ? 'bg-zinc-900/80 border-emerald-500/40 text-emerald-400' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-700'
            }`}>
              <ShieldCheck size={14} className={isDark ? "text-emerald-400 shrink-0" : "text-emerald-600 shrink-0"} />
              <span>VERIFIED ROBOTICS &amp; PHYSICAL AI R&amp;D</span>
            </div>

            {/* Headline (strictly 2 lines: Line 1 = Real Robotics, Line 2 = for Physical Intelligence.) */}
            <h1 className={`font-display text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.95rem] font-black tracking-tight leading-[1.14] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Real Robotics <br />
              <span className="inline sm:whitespace-nowrap">
                for Physical <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-400">Intelligence.</span>
              </span>
            </h1>

            {/* Subtitle (concrete, authentic R&D scope) */}
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg font-normal ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Explore full-stack robotics engineering — from mathematical kinematics and custom FOC motor control to photorealistic digital twin simulation and real-world autonomous deployments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#pathways"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Research Pathways</span>
                <ArrowRight size={15} />
              </a>
            </div>

            {/* Technical Capability Specification Strip */}
            <div className={`pt-5 mt-6 border-t ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2">
                {/* 1. Sub-Micron / Kinematics QA */}
                <div className="flex items-start gap-2.5 sm:pr-2.5 sm:border-r border-slate-200 dark:border-slate-800/80">
                  <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold font-mono tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      SUB-MICRON
                    </div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Kinematics QA
                    </div>
                  </div>
                </div>

                {/* 2. 1000 Hz / Real-Time FOC */}
                <div className="flex items-start gap-2.5 sm:px-2.5 sm:border-r border-slate-200 dark:border-slate-800/80">
                  <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-500 shrink-0 mt-0.5">
                    <Cpu size={14} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold font-mono tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      1000 Hz
                    </div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Real-Time FOC
                    </div>
                  </div>
                </div>

                {/* 3. Isaac Sim / Digital Twins */}
                <div className="flex items-start gap-2.5 sm:px-2.5 sm:border-r border-slate-200 dark:border-slate-800/80">
                  <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                    <Box size={14} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold font-mono tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ISAAC SIM
                    </div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Digital Twins
                    </div>
                  </div>
                </div>

                {/* 4. ROS 2 / Autonomous Fleets */}
                <div className="flex items-start gap-2.5 sm:pl-2.5">
                  <div className="p-1 rounded-md bg-violet-500/10 text-violet-500 shrink-0 mt-0.5">
                    <Send size={14} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold font-mono tracking-wider uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ROS 2
                    </div>
                    <div className={`text-[10px] font-medium leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Autonomous Fleets
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── 2. SECTION: "From Robot Concept to Real-World Deployment" ── */}
      <section id="pathways" className={`py-16 sm:py-24 border-b relative transition-colors duration-300 ${isDark ? 'border-violet-500/20 bg-[#05030f]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-12 sm:space-y-16">
          
          {/* LEVEL 1: Visual R&D Introduction Banner (Left 45% Text, Right 55% Dominant Image) */}
          <div className={`rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all ${
            isDark 
              ? 'border-violet-500/30 bg-gradient-to-br from-[#0f0a26]/90 via-[#0a071c]/95 to-[#060412]' 
              : 'border-slate-200 bg-white shadow-xl'
          }`}>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: 45% High-Impact Concise Narrative & Highlights */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-3 ${
                    isDark ? 'bg-violet-500/10 border border-violet-400/30 text-violet-300' : 'bg-violet-100 border border-violet-200 text-violet-800'
                  }`}>
                    CORE ROBOTICS R&amp;D
                  </div>
                  <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    From Robot Concept to Real-World Deployment
                  </h2>
                  <p className={`text-xs sm:text-sm mt-3 leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    From mechanical design and precision manufacturing to AI training and autonomous deployment, we develop robotics systems through the complete R&amp;D lifecycle.
                  </p>
                </div>

                {/* 4 Concise Checkmark Highlights (2x2 Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    'Design the robot',
                    'Manufacture the hardware',
                    'Train robot behavior',
                    'Deploy in real environments'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'bg-violet-100 text-violet-700 border border-violet-200'
                      }`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPathway(selectedPathway || '01')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Explore Research</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Right Column: 55% Dominant R&D Robotics Image */}
              <div className="lg:col-span-7">
                <div className={`relative rounded-2xl overflow-hidden border shadow-2xl aspect-[16/10] group ${
                  isDark ? 'border-violet-500/30 bg-slate-950' : 'border-slate-200 bg-slate-100'
                }`}>
                  <img
                    src="/research/research_rd_overview.png"
                    alt="WorknAI Core Robotics R&D Lifecycle"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* LEVEL 2: 4 Image-First Pathway Cards (01 DESIGN → 02 BUILD → 03 TRAIN → 04 DEPLOY) */}
          <div>
            {/* Header + Stepper for 4 Pathways */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className={`text-xs font-mono font-bold tracking-wider uppercase block mb-1 ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
                  FOUR-STAGE LIFECYCLE
                </span>
                <h3 className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Explore Research Pathways
                </h3>
              </div>

              {/* Top Right Connected Stepper (01 DESIGN ───── 02 BUILD ───── 03 TRAIN ───── 04 DEPLOY) */}
              <div 
                role="tablist" 
                aria-label="Research Pathways Stepper" 
                className="flex items-center gap-1 sm:gap-2 text-xs font-mono font-bold"
              >
                {RESEARCH_PATHWAYS.map((pathway, idx) => {
                  const isCurrent = selectedPathway === pathway.number;
                  const activeIdx = selectedPathway ? parseInt(selectedPathway, 10) - 1 : -1;
                  return (
                    <div key={pathway.number} className="flex items-center">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={`Stage ${pathway.number} ${pathway.stageLabel}: ${pathway.title}`}
                        onClick={() => handleSelectPathway(pathway.number)}
                        className={`flex flex-col items-center group cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-xl p-1 ${
                          isCurrent 
                            ? isDark ? 'text-violet-300' : 'text-violet-700' 
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent 
                            ? 'bg-violet-600 text-white ring-4 ring-violet-500/30 shadow-lg shadow-violet-600/40 scale-105' 
                            : isDark 
                              ? 'bg-zinc-900 border border-white/15 text-slate-300 group-hover:border-violet-400/50 group-hover:bg-zinc-800' 
                              : 'bg-white border border-slate-300 text-slate-700 group-hover:border-violet-500 group-hover:bg-violet-50/50 shadow-sm'
                        }`}>
                          {pathway.number}
                        </div>
                        <span className={`text-[10px] mt-1.5 text-center font-mono font-bold tracking-wider uppercase transition-colors ${
                          isCurrent ? (isDark ? 'text-violet-300' : 'text-violet-700') : (isDark ? 'text-slate-400' : 'text-slate-500')
                        }`}>
                          {pathway.stageLabel}
                        </span>
                      </button>
                      {idx < RESEARCH_PATHWAYS.length - 1 && (
                        <div className={`w-4 sm:w-7 lg:w-9 h-[2px] mx-1 sm:mx-1.5 mb-4 transition-colors ${
                          idx < activeIdx 
                            ? 'bg-violet-600' 
                            : isDark ? 'bg-white/15' : 'bg-slate-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          {/* 4 Image-First Pathway Overview Cards (01 DESIGN → 02 BUILD → 03 TRAIN → 04 DEPLOY) */}
          <div 
            role="tablist" 
            aria-label="Research Pathways Cards" 
            className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 ${selectedPathway ? 'mb-10 sm:mb-12' : 'mb-0'}`}
          >
            {RESEARCH_PATHWAYS.map((item) => {
              const isActive = selectedPathway === item.number;
              return (
                <motion.button
                  key={item.number}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPathway(item.number)}
                  className={`group text-left relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    isActive
                      ? isDark 
                        ? 'border-violet-500 bg-[#120d29] shadow-violet-600/30 shadow-2xl ring-2 ring-violet-500/50' 
                        : 'border-violet-600 bg-white ring-2 ring-violet-500 shadow-xl'
                      : isDark 
                        ? 'border-white/10 bg-[#0c091c]/90 hover:border-violet-400/40 hover:bg-[#120d29]' 
                        : 'border-slate-200 bg-white hover:border-violet-400 hover:shadow-lg'
                  }`}
                >
                  {/* ~70% Large Dominant Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Stage Number Tag */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-md backdrop-blur-md ${
                        isActive 
                          ? 'bg-violet-600 text-white border border-violet-400' 
                          : 'bg-black/60 text-slate-200 border border-white/20'
                      }`}>
                        {item.number} · {item.stageLabel}
                      </span>
                    </div>
                  </div>

                  {/* ~30% Compact Content: Title, One Line, Micro Keywords & Arrow */}
                  <div className={`p-4 flex flex-col justify-between gap-3 border-t flex-1 ${isDark ? 'border-white/[0.06]' : 'border-slate-100 bg-white'}`}>
                    <div className="min-w-0">
                      <h3 className={`font-display text-base font-bold transition-colors leading-snug ${
                        isActive ? (isDark ? 'text-white' : 'text-violet-900') : (isDark ? 'text-slate-100 group-hover:text-violet-300' : 'text-slate-900 group-hover:text-violet-600')
                      }`}>
                        {item.title}
                      </h3>
                      
                      <p className={`text-xs mt-1.5 leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.shortLine}
                      </p>
                    </div>

                    {/* Bottom Row: Micro Keywords & Arrow CTA */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/[0.06]">
                      <span className={`text-[11px] font-mono font-medium tracking-wide ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
                        {item.microKeywords}
                      </span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 ${
                        isActive
                          ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-600/40'
                          : isDark ? 'bg-white/[0.04] border-white/10 text-slate-300 group-hover:border-violet-400/40 group-hover:bg-violet-600 group-hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-violet-600 group-hover:text-white'
                      }`}>
                        <ArrowRight size={11} className={isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5 transition-transform'} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

          {/* ─── DEDICATED VISUAL-FIRST ARCHITECTURE SPOTLIGHT (On-Demand Deep Dive) ─── */}
          <AnimatePresence mode="wait">
            {selectedPathway && activePathway && (
              <motion.div
                ref={detailSectionRef}
                key={selectedPathway}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className={`rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors ${
                  isDark 
                    ? 'border-violet-500/30 bg-gradient-to-b from-[#100b28] via-[#0d0920] to-[#070514]' 
                    : 'border-slate-200 bg-white shadow-xl'
                }`}
              >
                {/* Stage Header */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b relative z-10 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="space-y-1">
                    <div className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isDark ? 'text-violet-400' : 'text-violet-600'
                    }`}>
                      <span>STAGE {activePathway.number} OF 04 · {activePathway.stageLabel}</span>
                      <span className="opacity-40">•</span>
                      <span className="opacity-80 font-normal">{activePathway.journeyMeaning}</span>
                    </div>
                    <h3 className={`font-display text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activePathway.title}
                    </h3>
                    <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activePathway.summary}
                    </p>
                  </div>
                  
                  {/* Close / Collapse View Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPathway(null)}
                    className={`self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white' 
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title="Close deep dive"
                  >
                    <X size={14} />
                    <span>Close Deep Dive</span>
                  </button>
                </div>

                {/* Split Screen: Left = Large Cinema Viewport; Right = 4 Interactive Step Cards */}
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 my-8 relative z-10 items-stretch">
                  
                  {/* Left Column: Big Interactive Cinema Viewport */}
                  <div className="lg:col-span-7 flex flex-col justify-center">
                    <div className={`relative rounded-2xl overflow-hidden border aspect-[16/10] shadow-2xl group ${isDark ? 'border-violet-500/40 bg-black' : 'border-slate-300 bg-slate-900'}`}>
                      <AnimatePresence mode="wait">
                        {activeStep && (
                          <motion.img
                            key={activeStep.image + selectedPathway + selectedStepIndex}
                            src={activeStep.image}
                            alt={activeStep.title}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </AnimatePresence>

                      {/* Subtle Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Right Column: 4 Interactive Step Cards with Staggered Entry */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
                    {activePathway.steps.map((step, idx) => {
                      const isCurrent = selectedStepIndex === idx;
                      return (
                        <motion.button
                          key={step.title + selectedPathway}
                          type="button"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.28, delay: idx * 0.05, ease: 'easeOut' }}
                          whileHover={{ x: 3 }}
                          onClick={() => setSelectedStepIndex(idx)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer shadow-md relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                            isCurrent
                              ? isDark 
                                ? 'border-violet-500 bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-transparent shadow-lg shadow-violet-600/20 ring-1 ring-violet-400/50'
                                : 'border-violet-500 bg-violet-50 ring-1 ring-violet-400 shadow-md'
                              : isDark 
                                ? 'border-white/10 bg-white/[0.02] hover:border-violet-400/30 hover:bg-white/[0.05]'
                                : 'border-slate-200 bg-slate-50/70 hover:border-violet-300 hover:bg-slate-100'
                          }`}
                        >
                          {/* Step Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 relative bg-black">
                            <img
                              src={step.image}
                              alt={step.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Step Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className={`font-display text-xs sm:text-sm font-bold truncate mb-0.5 ${
                              isCurrent ? (isDark ? 'text-white' : 'text-violet-950') : (isDark ? 'text-slate-200' : 'text-slate-800')
                            }`}>
                              {step.title}
                            </h5>
                            <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {step.desc}
                            </p>
                          </div>

                          {/* Chevron Indicator */}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isCurrent 
                              ? 'bg-violet-600 border-violet-400 text-white shadow-md' 
                              : isDark ? 'bg-white/[0.03] border-white/10 text-slate-500' : 'bg-white border-slate-300 text-slate-600'
                          }`}>
                            <ArrowRight size={11} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ─── 3. SECTION: "Real-World Impact" (6 Sector Cards) ────────────── */}
      <section id="real-world-impact" className={`py-16 sm:py-20 border-b transition-colors duration-300 ${isDark ? 'border-violet-500/20 bg-[#05030f]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className={`text-xs font-mono font-bold tracking-wider uppercase block mb-1 ${isDark ? 'text-violet-400' : 'text-violet-700'}`}>
                FIELD DEPLOYMENTS
              </span>
              <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Real-World Impact
              </h2>
            </div>
            <Link to="/robotics#industries" className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-700 hover:text-violet-800'}`}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {REAL_WORLD_IMPACT.map((item) => (
              <motion.div
                key={item.sector}
                whileHover={{ y: -6 }}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between shadow-lg ${
                  isDark ? 'border-violet-500/20 bg-[#0c0a1a] hover:border-violet-400/60' : 'border-slate-200 bg-white hover:border-violet-400 hover:shadow-xl'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.sector}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>

                <div className={`p-3.5 border-t flex items-center justify-between gap-2 ${isDark ? 'border-violet-500/10 bg-[#0e0c1f]' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="min-w-0">
                    <h3 className={`font-display text-xs sm:text-sm font-bold transition-colors truncate ${isDark ? 'text-white group-hover:text-violet-300' : 'text-slate-900 group-hover:text-violet-700'}`}>
                      {item.sector}
                    </h3>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    isDark ? 'bg-violet-500/10 border border-violet-500/30 text-violet-400 group-hover:bg-violet-600 group-hover:text-white' : 'bg-violet-100 border border-violet-200 text-violet-700 group-hover:bg-violet-600 group-hover:text-white'
                  }`}>
                    <ArrowRight size={9} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. BOTTOM CTA: "Turn Research Into Real Solutions" ─────────── */}
      <section className={`py-16 sm:py-20 transition-colors duration-300 ${isDark ? 'bg-[#05030f]' : 'bg-slate-100'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className={`relative rounded-3xl overflow-hidden border p-8 sm:p-12 shadow-2xl ${
            isDark ? 'border-violet-500/30 bg-gradient-to-r from-[#0e0a22] via-[#120e2c] to-[#0e0a22]' : 'border-slate-200 bg-white shadow-2xl'
          }`}>
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading & Action Buttons */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Turn Research Into <br />
                  <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                    isDark ? 'from-violet-400 via-indigo-300 to-cyan-400' : 'from-violet-600 via-indigo-600 to-cyan-600'
                  }`}>
                    Real Solutions
                  </span>
                </h2>
                <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Work with WorknAi Robotics on custom AMRs, cobots and autonomous systems.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    to="/robotics#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-700/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Book Live Demo</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/robotics"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm border transition-all ${
                      isDark 
                        ? 'border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-violet-400/50' 
                        : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    <span>Explore Solutions</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Robotic Humanoid & Italic Watermark */}
              <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end justify-center">
                <div className="relative w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl">
                  <img
                    src="/research/cta_robotic_arm.jpg"
                    alt="Intelligent Machines"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-4 text-right">
                    <p className="font-serif italic text-xs text-slate-300 opacity-90">
                      "Intelligent Machines For a Brighter Tomorrow."
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─── Video Preview Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-violet-500/40 bg-black shadow-2xl"
            >
              {/* Top Bar with Title & Close Button */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e0a22]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {activePathway?.title || 'Physical Robotics'} • Video Simulation Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  src="/hero.mp4"
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Ticker */}
              <div className="px-6 py-3 border-t border-white/10 bg-[#0c091e] flex items-center justify-between text-xs font-mono text-slate-300">
                <span>STAGE {activePathway?.number || '01'}: {activePathway?.tag || 'Core Lifecycle'}</span>
                <span className="text-cyan-300">● Live Physics Simulation 60 FPS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
