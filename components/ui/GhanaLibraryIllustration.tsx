// components/ui/GhanaLibraryIllustration.tsx
// A hand-built flat illustration (not a stock photo) of two students
// studying in the library, with a Kente-strip border and Ghana flag
// colors (red/gold/green + black star) woven through the palette.
export function GhanaLibraryIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 460" preserveAspectRatio="xMidYMid slice" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of students studying in the library">
      <defs>
        <linearGradient id="glBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1550" />
          <stop offset="100%" stopColor="#1b2170" />
        </linearGradient>
        <linearGradient id="glDesk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a4b" />
          <stop offset="100%" stopColor="#a86b34" />
        </linearGradient>
      </defs>

      {/* Kente-inspired top border */}
      <g>
        <rect x="0" y="0" width="640" height="14" fill="#CE1126" />
        <rect x="0" y="14" width="640" height="7" fill="#FCD116" />
        <rect x="0" y="21" width="640" height="7" fill="#006B3F" />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={i * 40} y="0" width="20" height="28" fill="#000" opacity={i % 2 === 0 ? 0.08 : 0} />
        ))}
      </g>

      {/* Room background */}
      <rect x="0" y="28" width="640" height="432" fill="url(#glBg)" />

      {/* Arched window with a subtle gold star, echoing the flag */}
      <g opacity="0.9">
        <path d="M250 60 a70 70 0 0 1 140 0 v150 h-140 z" fill="#232a7a" stroke="#3a4199" strokeWidth="4" />
        <rect x="248" y="150" width="144" height="8" fill="#3a4199" />
        <path d="M320 90 l8 18 20 2 -15 14 4 20 -17 -10 -17 10 4 -20 -15 -14 20 -2 z" fill="#FCD116" opacity="0.9" />
      </g>

      {/* Bookshelves either side */}
      {[40, 520].map((x, si) => (
        <g key={si}>
          <rect x={x} y="70" width="80" height="200" rx="4" fill="#151a5e" stroke="#2a3080" strokeWidth="3" />
          {[0, 1, 2, 3].map(row => (
            <g key={row}>
              <rect x={x + 6} y={82 + row * 46} width="68" height="34" fill="#0f1550" />
              {[0, 1, 2, 3, 4].map(b => (
                <rect
                  key={b}
                  x={x + 9 + b * 13}
                  y={86 + row * 46}
                  width="10"
                  height="26"
                  fill={["#CE1126", "#FCD116", "#006B3F", "#e2b04a", "#8f2233"][(row + b) % 5]}
                  rx="1"
                />
              ))}
            </g>
          ))}
        </g>
      ))}

      {/* Floor */}
      <rect x="0" y="330" width="640" height="130" fill="#e8e4da" />
      <rect x="0" y="330" width="640" height="6" fill="#c8c2b0" />

      {/* Study desk */}
      <rect x="150" y="300" width="340" height="18" rx="4" fill="url(#glDesk)" />
      <rect x="165" y="318" width="14" height="60" fill="#8a5a2b" />
      <rect x="461" y="318" width="14" height="60" fill="#8a5a2b" />

      {/* Books + laptop on the desk */}
      <g>
        <rect x="205" y="278" width="54" height="10" rx="2" fill="#CE1126" />
        <rect x="205" y="268" width="46" height="10" rx="2" fill="#FCD116" />
        <rect x="205" y="258" width="38" height="10" rx="2" fill="#006B3F" />
        <rect x="300" y="270" width="70" height="30" rx="3" fill="#22284f" />
        <rect x="305" y="274" width="60" height="20" rx="2" fill="#4a58c9" />
        <rect x="392" y="282" width="34" height="18" rx="2" fill="#e9e3d6" />
      </g>

      {/* Student 1 - seated, natural hair, kente-accented top */}
      <g>
        <ellipse cx="230" cy="300" rx="26" ry="8" fill="#000" opacity="0.15" />
        <rect x="212" y="240" width="36" height="60" rx="14" fill="#CE1126" />
        <rect x="212" y="240" width="36" height="14" rx="7" fill="#FCD116" />
        <circle cx="230" cy="214" r="22" fill="#8a5a37" />
        <path d="M208 210 a22 22 0 0 1 44 0 q0 -22 -22 -26 q-22 4 -22 26 z" fill="#1b1410" />
        <rect x="218" y="298" width="12" height="26" fill="#2c2f6e" />
        <rect x="234" y="298" width="12" height="26" fill="#2c2f6e" />
      </g>

      {/* Student 2 - seated, laptop, green top */}
      <g>
        <ellipse cx="410" cy="300" rx="26" ry="8" fill="#000" opacity="0.15" />
        <rect x="392" y="242" width="36" height="58" rx="14" fill="#006B3F" />
        <rect x="392" y="242" width="36" height="12" rx="6" fill="#FCD116" />
        <circle cx="410" cy="216" r="22" fill="#6b4226" />
        <path d="M388 214 q-4 -30 22 -32 q26 2 22 32 q-4 -10 -22 -10 q-18 0 -22 10 z" fill="#160f0a" />
        <rect x="398" y="298" width="12" height="26" fill="#22284f" />
        <rect x="414" y="298" width="12" height="26" fill="#22284f" />
      </g>

      {/* Potted plant for warmth */}
      <g>
        <path d="M540 300 q-14 -10 0 -30 q14 20 0 30 z" fill="#2f8f52" />
        <path d="M540 300 q14 -6 8 -26 q-16 10 -8 26 z" fill="#3aa862" />
        <path d="M540 300 q-10 4 -2 -20 q10 16 2 20 z" fill="#256f3e" />
        <rect x="526" y="300" width="28" height="24" rx="3" fill="#a86b34" />
      </g>

      {/* Kente-inspired bottom border */}
      <g>
        <rect x="0" y="452" width="640" height="8" fill="#006B3F" />
        <rect x="0" y="446" width="640" height="6" fill="#FCD116" />
        <rect x="0" y="438" width="640" height="8" fill="#CE1126" />
      </g>
    </svg>
  );
}
