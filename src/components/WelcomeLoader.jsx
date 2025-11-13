import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Import all our doodle dependencies ---
import { DoodleIcon } from "./DoodleIcon"; // We will wrap this
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

// --- NEW "Funky" Crayon Color Palette ---
const DOODLE_BG_COLOR = "#fdfbf5"; // A warmer "sketchbook" paper
const DOODLE_STROKE_COLOR = "#4a2c2a"; // A dark "sepia" brown, like old ink

// Crayon Colors for Icons
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
//  NEW COMPONENT 1: AnimatedDoodleText
//  This component handles the "funky" text animation.
// ===================================================================
const AnimatedDoodleText = ({ text, color }) => {
  const letters = text.split("");

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // This makes each letter appear one after the other
        staggerChildren: 0.08, // Time between each letter
        delayChildren: 1.5, // Wait 1.5s after loader starts
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.2,
      y: 50,
      rotate: -45,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring", // Gives it a bouncy, "funky" feel
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.h1
      className="font-doodle text-5xl sm:text-7xl relative z-10 select-none"
      style={{
        filter: "url(#sketchy)", // Apply the pencil filter
        color: color,
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          variants={letterVariants}
          className="inline-block"
        >
          {/* Use non-breaking space for actual spaces */}
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// ===================================================================
//  NEW COMPONENT 2: FloatingDoodleIcon
//  This wraps the original DoodleIcon to add continuous floating.
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
        opacity: opacity, // Use the passed-in opacity
        color: color, // Use the passed-in color
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
//  Now using the new components and a lot more icons.
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

  // --- Create a list of 20 random icons for the background ---
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
      opacity: randomRange(0.1, 0.4), // Different opacities for depth
      color: getRandom(CRAYON_BOX), // Different colors
      size: `${randomRange(50, 120)}px`, // Different sizes
    };
  });

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap');
          .font-doodle {
            font-family: 'Gochi Hand', cursive;
          }
        `}
      </style>

      {/* Renders the hidden SVG filter */}
      <SketchyFilter />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="doodle-loader-complex"
            className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[2500] overflow-hidden"
            style={{
              backgroundColor: DOODLE_BG_COLOR,
              color: DOODLE_STROKE_COLOR, // Default "pencil" color
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
            {/* --- Render all 20 background icons --- */}
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

            {/* --- Centered Loading Text --- */}
            {/* Use the new AnimatedDoodleText component */}
            <AnimatedDoodleText text="Loading Toolkit..." color={DOODLE_STROKE_COLOR} />

            {/* --- Sketchy Progress Bar --- */}
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