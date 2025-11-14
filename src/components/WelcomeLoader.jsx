import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo/mini-logo-trp.png";
import { DoodleIcon } from "./DoodleIcon";
import { SketchyFilter } from "./SketchyFilter";
import { SketchyProgressBar } from "./SketchyProgressBar";
import {
  FileIcon,
  FolderIcon,
  DocumentIcon,
  WebIcon,
  ImageIcon,
  CodeIcon,
  ZipIcon,
} from "./DoodleIcons";

// --- Configuration Constants ---
const LOADER_VISIBLE_DURATION_MS = 6000;
const FADE_OUT_DURATION_MS = 500;

// --- Crayon Color Palette ---
const DOODLE_BG_COLOR = "#fdfbf5";
const DOODLE_STROKE_COLOR = "#4a2c2a";
const DOODLE_RED = "#e63946";
const DOODLE_BLUE = "#1d3557";
const DOODLE_GREEN = "#52b788";
const DOODLE_PURPLE = "#6a4c93";
const DOODLE_ORANGE = "#f77f00";

const CRAYON_BOX = [
  DOODLE_RED,
  DOODLE_BLUE,
  DOODLE_GREEN,
  DOODLE_PURPLE,
  DOODLE_ORANGE,
];

// Helper to get random array item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number in a range
const randomRange = (min, max) => Math.random() * (max - min) + min;

// ===================================================================
//  NEW COMPONENT 1: LoadingText
//  This component displays the "Loading..." text in Montserrat Thin
//  with a simple pulsing animation.
// ===================================================================
const LoadingText = ({ color }) => {
  return (
    <motion.h1
      className="font-montserrat-thin text-3xl sm:text-4xl" // Using the new font class
      style={{
        color: color,
        // The sketchy filter is NOT applied here for a clean look
      }}
      // Add a simple pulse animation
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      Loading...
    </motion.h1>
  );
};

// ===================================================================
//  COMPONENT 2: FloatingDoodleIcon (Unchanged)
//  This component adds continuous floating to the background icons.
// ===================================================================
const FloatingDoodleIcon = ({
  children,
  top,
  left,
  x,
  y,
  rotate,
  delay,
  opacity,
  color,
  size,
}) => {
  // Random values for the continuous floating animation
  const floatY = randomRange(-15, 15);
  const floatX = randomRange(-10, 10);
  const floatRotate = randomRange(-8, 8);
  const floatDuration = randomRange(2.5, 4.5);

  return (
    <motion.div
      // This is the continuous floating animation
      animate={{
        y: [0, floatY, 0],
        x: [0, floatX, 0],
        rotate: [0, floatRotate, 0],
      }}
      transition={{
        duration: floatDuration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
      style={{
        position: "absolute",
        top: top,
        left: left,
        zIndex: 10,
        opacity: opacity,
        color: color,
        width: size,
        height: size,
      }}
    >
      {/* This is the original fly-in animation from DoodleIcon.jsx */}
      <DoodleIcon x={x} y={y} rotate={rotate} delay={delay}>
        {children}
      </DoodleIcon>
    </motion.div>
  );
};

// ===================================================================
//  MAIN COMPONENT: WelcomeLoader
// ===================================================================
const WelcomeLoader = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Timer logic - remains the same
  useEffect(() => {
    const fadeOutTimer = setTimeout(
      () => setIsVisible(false),
      LOADER_VISIBLE_DURATION_MS
    );
    const completionTimer = setTimeout(
      onAnimationComplete,
      LOADER_VISIBLE_DURATION_MS + FADE_OUT_DURATION_MS
    );
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completionTimer);
    };
  }, [onAnimationComplete]);

  // --- Create a list of 20 random icons for the background (Unchanged) ---
  const backgroundIcons = Array.from({ length: 20 }).map((_, i) => {
    const iconType = getRandom([
      FileIcon,
      FolderIcon,
      DocumentIcon,
      WebIcon,
      ImageIcon,
      CodeIcon,
      ZipIcon,
    ]);
    return {
      id: i,
      Icon: iconType,
      top: `${randomRange(5, 95)}%`,
      left: `${randomRange(5, 95)}%`,
      x: randomRange(-200, 200),
      y: randomRange(-200, 200),
      rotate: randomRange(-90, 90),
      delay: randomRange(0, 2),
      opacity: randomRange(0.1, 0.4),
      color: getRandom(CRAYON_BOX),
      size: `${randomRange(50, 120)}px`,
    };
  });

  return (
    <>
      {/* --- MODIFIED: Import Montserrat Thin instead of Gochi Hand --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap');
          .font-montserrat-thin {
            font-family: 'Montserrat', sans-serif;
            font-weight: 200;
          }
        `}
      </style>

      {/* Renders the hidden SVG filter (Unchanged) */}
      <SketchyFilter />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="doodle-loader-complex"
            className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[2500] overflow-hidden"
            style={{
              backgroundColor: DOODLE_BG_COLOR,
              color: DOODLE_STROKE_COLOR,
            }}
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: FADE_OUT_DURATION_MS / 1000,
                ease: "easeOut",
              },
            }}
          >
            {/* --- Render all 20 background icons (Unchanged) --- */}
            {backgroundIcons.map((icon) => (
              <FloatingDoodleIcon
                key={icon.id}
                top={icon.top}
                left={icon.left}
                x={icon.x}
                y={icon.y}
                rotate={icon.rotate}
                delay={icon.delay}
                opacity={icon.opacity}
                color={icon.color}
                size={icon.size}
              >
                <icon.Icon />
              </FloatingDoodleIcon>
            ))}

            {/* --- MODIFIED: Centered Logo and New Text --- */}
            <motion.div
              className="relative z-20 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
            >
              {/* 1. The Logo */}
              <motion.img
                src={logo}
                alt="Loading Logo"
                className="w-72 h-auto mb-6"
              />

              {/* 2. The New Loading Text */}
              <LoadingText color={DOODLE_STROKE_COLOR} />
              
            </motion.div>
            
            {/* --- Sketchy Progress Bar (Unchanged) --- */}
            <SketchyProgressBar
              duration={LOADER_VISIBLE_DURATION_MS}
              color={DOODLE_STROKE_COLOR}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WelcomeLoader;