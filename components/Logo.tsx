// components/Logo.tsx
// interface LogoProps {
//   className?: string;
//   width?: number;
//   height?: number;
// }

// export function Logo({ className = "", width = 150, height = 150 }: LogoProps) {
export function Logo() {
  return (
    // <svg
    //   width={width}
    //   height={height}
    //   viewBox="0 0 500 500"
    //   xmlns="http://www.w3.org/2000/svg"
    //   className={className}
    // >
    //   <defs>
    //     <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
    //       <stop offset="0%" style={{ stopColor: "#2e7d32", stopOpacity: 1 }} />
    //       <stop offset="50%" style={{ stopColor: "#1b5e20", stopOpacity: 1 }} />
    //       <stop offset="100%" style={{ stopColor: "#1a237e", stopOpacity: 1 }} />
    //     </linearGradient>
    //   </defs>

    //   <path d="M255,180 Q275,200 255,230 Q235,200 255,180" fill="#e65100" />
    //   <path d="M255,190 Q265,205 255,225 Q245,205 255,190" fill="#ffb74d" />

    //   <path d="M175,185 L240,235 Q270,260 250,300 Q230,340 260,350" stroke="url(#grad1)" strokeWidth="8" fill="none" strokeLinecap="round"/>

    //   <path d="M180,190 Q210,180 240,230 L185,245 Z" fill="#4caf50" opacity="0.8"/>

    //   <path d="M160,205 Q190,230 250,235" stroke="#2e7d32" strokeWidth="4" fill="none" strokeLinecap="round"/>
    //   <path d="M155,220 Q185,245 245,250" stroke="#388e3c" strokeWidth="3" fill="none" strokeLinecap="round"/>

    //   <path d="M205,260 Q235,255 240,285 Q240,310 205,310 L210,260 M210,285 L235,285" stroke="#1a237e" strokeWidth="5" fill="none" />
    // </svg>
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#4caf50", stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: "#1b5e20", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1a237e", stopOpacity: 1 }} />
       
        </linearGradient>
      </defs>
      <path d="M255,180 Q275,200 255,230 Q235,200 255,180" fill="#f57c00" />{" "}
      <path d="M255,190 Q265,205 255,225 Q245,205 255,190" fill="#ffe082" />{" "}
      <path
        d="M175,185 L240,235 Q270,260 250,300 Q230,340 260,350"
        stroke="url(#grad1)"
        stroke-width="8"
        fill="none"
        stroke-linecap="round"
      />
      <path
        d="M180,190 Q210,180 240,230 L185,245 Z"
        fill="#66bb6a"
        opacity="0.9"
      />{" "}
      <path
        d="M160,205 Q190,230 250,235"
        stroke="#43a047"
        stroke-width="4"
        fill="none"
        stroke-linecap="round"
      />{" "}
      <path
        d="M155,220 Q185,245 245,250"
        stroke="#4caf50"
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />{" "}
      <path
        d="M205,260 Q235,255 240,285 Q240,310 205,310 L210,260 M210,285 L235,285"
        stroke="#283593"
        stroke-width="5"
        fill="none"
        stroke-linecap="round"
      />{" "}
    </svg>
  );
}
