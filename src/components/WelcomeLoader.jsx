// src/components/WelcomeLoader.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useTime, useTransform } from "framer-motion";

// --- Configuration Constants ---
const LOADER_VISIBLE_DURATION_MS = 7000; // 7 seconds visible time
const FADE_OUT_DURATION_MS = 600;        // Fade out time

// --- Matrix Theming Colors ---
const MATRIX_GREEN_DARK = "#003b00";
const MATRIX_GREEN = "#22c55e"; // Tailwind green-500
const MATRIX_GREEN_LIGHT = "#a3e635"; // Tailwind lime-400
const MATRIX_GREEN_BRIGHT = "#ccffdd";
const MATRIX_BLACK = "#000000";

// Character sets for rain & text animation
const KATAKANA_CHARS = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/?!@#$%^&*()-+=~[]{}|;:,.";
const BINARY_CHARS = "01";
const CRYPTIC_CHARS = "ΣΔΠΓΞΨΩαβγδεζηθικλμνξπρστυφχψω"; // Greek letters

const GRID_SIZE = 60; // grid cell size for pulsing grid
const RAIN_FONT_SIZE = 16;
const BASE_RAIN_SPEED = 80;

// Get random character helper
const getRandomChar = (charSet) => charSet[Math.floor(Math.random() * charSet.length)];

// --- PulsingGrid Component ---
const PulsingGrid = () => {
  const time = useTime();
  const rotateZ = useTransform(time, [0, 30000], [0, 360], { clamp: false });
  const lineOpacity = useTransform(time, t => 0.08 + 0.06 * Math.sin(t / 2000));

  return (
    <motion.div
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '300%', height: '300%',
          translateX: '-50%', translateY: '-50%',
          rotateX: '75deg',
          rotateZ: rotateZ,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage: useTransform(lineOpacity, o =>
            `linear-gradient(to right, rgba(34, 197, 94, ${o}) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(34, 197, 94, ${o}) 1px, transparent 1px)`
          ),
          maskImage: 'radial-gradient(ellipse at center, white 5%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white 5%, transparent 50%)',
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.1, ease: 'easeOut' }}
      />
    </motion.div>
  );
};

// --- MatrixRainLayer Component ---
const MatrixRainLayer = ({
  charSet = KATAKANA_CHARS,
  fontSize = RAIN_FONT_SIZE,
  opacity = 0.5,
  speed = BASE_RAIN_SPEED,
  highlightChance = 0.08,
  zIndex = 1,
  blur = 0,
}) => {
  const [columns, setColumns] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const numCols = Math.floor(width / (fontSize * 0.8));
      setColumns(Array.from({ length: numCols }).map((_, i) => ({
        id: i,
        initialDelay: Math.random() * 8000,
        yPosition: Math.random() * -window.innerHeight * 2,
        speedVariance: Math.random() * 0.5 + 0.75,
      })));
    };
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateColumns, 200);
    };
    calculateColumns();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [fontSize]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: `${fontSize}px`,
        opacity,
        zIndex,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
    >
      {columns.map(col => (
        <MatrixColumn
          key={col.id}
          columnIndex={col.id}
          charSet={charSet}
          fontSize={fontSize}
          initialDelay={col.initialDelay}
          initialY={col.yPosition}
          speed={speed * col.speedVariance}
          highlightChance={highlightChance}
        />
      ))}
    </div>
  );
};

// --- MatrixColumn Component ---
const MatrixColumn = ({
  columnIndex,
  charSet,
  fontSize,
  initialDelay,
  initialY,
  speed,
  highlightChance
}) => {
  const [chars, setChars] = useState([]);
  const intervalRef = useRef(null);
  const yPosition = useRef(initialY);
  const leftPosition = useMemo(() => `${columnIndex * (fontSize * 0.7)}px`, [columnIndex, fontSize]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const newChar = getRandomChar(charSet);
        const isHighlight = Math.random() < highlightChance;
        setChars(prevChars => {
          const newCharData = {
            char: newChar,
            y: yPosition.current,
            highlight: isHighlight,
            id: performance.now() + Math.random(),
            opacity: 1,
          };
          const updatedChars = prevChars
            .map(c => ({ ...c, opacity: Math.max(0, 1 - (yPosition.current - c.y) / (window.innerHeight * 0.6)) }))
            .filter(c => c.opacity > 0.05);
          return [newCharData, ...updatedChars];
        });
        yPosition.current += fontSize;
        if (yPosition.current > window.innerHeight * 1.3) {
          yPosition.current = Math.random() * -window.innerHeight * 0.5;
        }
      }, speed);
    }, initialDelay);
    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialDelay, speed, charSet, fontSize, highlightChance]);

  return (
    <div
      className="absolute top-0 h-full"
      style={{ left: leftPosition, width: `${fontSize}px` }}
    >
      {chars.map(c => (
        <span
          key={c.id}
          style={{
            position: 'absolute',
            top: `${c.y}px`,
            left: 0,
            color: c.highlight ? MATRIX_GREEN_BRIGHT : MATRIX_GREEN,
            textShadow: c.highlight ? `0 0 10px ${MATRIX_GREEN_LIGHT}` : 'none',
            opacity: c.opacity,
            transition: 'opacity 0.5s linear',
            userSelect: 'none'
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
};

// --- CodeRevealText Component ---
const CodeRevealText = ({
  text,
  delay,
  className = "",
  charSet = ASCII_CHARS + BINARY_CHARS,
  fontSize = "inherit",
  cryptic = false,
}) => {
  const characters = text.split("");
  const baseDelay = delay;
  const animationDuration = cryptic ? 0.08 : 0.05;

  const variants = {
    hidden: { opacity: 0 },
    visible: i => ({
      opacity: 1,
      transition: { delay: baseDelay + i * animationDuration },
    }),
  };

  return (
    <motion.div
      className={`flex justify-center flex-wrap tracking-wider ${className}`}
      style={{ fontFamily: "'Doto', 'Courier New', monospace", fontSize: fontSize }}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {characters.map((char, index) => (
        <CharacterAnimator
          key={`${char}-${index}`}
          targetChar={char === " " ? "\u00A0" : char}
          custom={index}
          variants={variants}
          charSet={charSet}
          cycleDuration={baseDelay + index * animationDuration + (cryptic ? 1.0 : 0.6)}
          cryptic={cryptic}
        />
      ))}
    </motion.div>
  );
};

// --- CharacterAnimator helper ---
const CharacterAnimator = ({
  targetChar,
  custom,
  variants,
  charSet,
  cycleDuration,
  cryptic,
}) => {
  const [currentChar, setCurrentChar] = useState(getRandomChar(charSet));
  const time = useTime();
  const shouldSettle = useTransform(time, t => t / 1000 > cycleDuration);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (shouldSettle.get()) {
        setCurrentChar(targetChar);
        clearInterval(intervalRef.current);
      } else {
        setCurrentChar(getRandomChar(charSet));
      }
    }, cryptic ? 80 : 50);

    return () => clearInterval(intervalRef.current);
  }, [targetChar, charSet, shouldSettle, cryptic]);

  return (
    <motion.span
      custom={custom}
      variants={variants}
      className="inline-block"
      style={{
        color: cryptic
          ? `hsl(${120 + (Math.random() - 0.5) * 30}, 60%, ${40 + Math.random() * 15}%)`
          : `hsl(${120 + (Math.random() - 0.5) * 15}, 80%, ${70 + Math.random() * 15}%)`,
        textShadow: `0 0 ${cryptic ? 2 : 4}px ${MATRIX_GREEN}`,
        userSelect: "none",
      }}
    >
      {currentChar}
    </motion.span>
  );
};

// --- ScanLineOverlay Component ---
const ScanLineOverlay = () => (
  <div
    className="absolute inset-0 w-full h-full pointer-events-none opacity-10 z-30"
    style={{
      background: `linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 50%)`,
      backgroundSize: `100% 4px`,
      userSelect: "none",
    }}
  />
);

// --- WelcomeLoader Component ---
const WelcomeLoader = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setIsVisible(false), LOADER_VISIBLE_DURATION_MS);
    const completionTimer = setTimeout(onAnimationComplete, LOADER_VISIBLE_DURATION_MS + FADE_OUT_DURATION_MS);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completionTimer);
    };
  }, [onAnimationComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="matrix-loader-final"
          className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[2500] overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: FADE_OUT_DURATION_MS / 1000, ease: "easeOut" } }}
        >
          {/* Background Layers */}
          <PulsingGrid />
          <MatrixRainLayer charSet={BINARY_CHARS} fontSize={12} opacity={0.15} speed={BASE_RAIN_SPEED * 1.5} zIndex={1} blur={1.5} />
          <MatrixRainLayer charSet={KATAKANA_CHARS} fontSize={RAIN_FONT_SIZE} opacity={0.3} speed={BASE_RAIN_SPEED} zIndex={2} highlightChance={0.1} />
          <MatrixRainLayer charSet={ASCII_CHARS} fontSize={14} opacity={0.2} speed={BASE_RAIN_SPEED * 0.8} zIndex={3} highlightChance={0.05} />
          <ScanLineOverlay />

          {/* Foreground Content - Centered */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 select-none">
            {/* Cryptic Subtext 1 */}
            <div className="mb-4 text-xs sm:text-sm text-green-700 opacity-60 w-full max-w-sm mx-auto">
              <CodeRevealText
                text="Est. Connection :: PDF_OPERATIONS"
                delay={0.8}
                charSet={CRYPTIC_CHARS + BINARY_CHARS}
                cryptic={true}
              />
            </div>

            {/* Main Text */}
            <div
              className="text-3xl sm:text-5xl lg:text-6xl text-green-400 font-black"
              style={{ textShadow: `0 0 15px ${MATRIX_GREEN}` }}
            >
              <CodeRevealText text="Initializing PDF Toolkit" delay={2.0} fontSize="inherit" />
            </div>

            {/* Cryptic Subtext 2 */}
            <div className="mt-4 text-xs sm:text-sm text-green-700 opacity-60 w-full max-w-sm mx-auto">
              <CodeRevealText
                text="Executing:: /bin/pdf_toolkit_core"
                delay={3.5}
                charSet={CRYPTIC_CHARS + ASCII_CHARS}
                cryptic={true}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden z-20">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-green-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: LOADER_VISIBLE_DURATION_MS / 1000, ease: 'linear', delay: 0.1 }}
              style={{ boxShadow: `0 0 12px 1px ${MATRIX_GREEN}` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeLoader;
