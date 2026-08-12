// components/ui/icons.tsx
// Line icons only — no emoji anywhere in this app. Same path data as the
// original vanilla build, just as React components now.
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, className, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[18px] w-[18px] shrink-0 ${className ?? ""}`}
      stroke="currentColor"
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p: IconProps) => <Base {...p}><path d="M3 10.5L12 4l9 6.5" /><path d="M5 9.5V20h5v-6h4v6h5V9.5" /></Base>;
export const IconBook = (p: IconProps) => <Base {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" /><path d="M19 3v16" /></Base>;
export const IconUsers = (p: IconProps) => <Base {...p}><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c2.8.4 5 2.5 5 6" /></Base>;
export const IconGraduationCap = (p: IconProps) => <Base {...p}><path d="M12 4L2 9l10 5 10-5-10-5z" /><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /></Base>;
export const IconTeacher = (p: IconProps) => <Base {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 12l2 2 4-4" /></Base>;
export const IconBookOut = (p: IconProps) => <Base {...p}><path d="M4 4h9a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" /><path d="M15 10h6m0 0l-3-3m3 3l-3 3" /></Base>;
export const IconBookIn = (p: IconProps) => <Base {...p}><path d="M4 4h9a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" /><path d="M21 10h-6m0 0l3-3m-3 3l3 3" /></Base>;
export const IconClockBook = (p: IconProps) => <Base {...p}><path d="M4 4h9a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" /><circle cx="18" cy="15" r="4" /><path d="M18 13v2l1.5 1" /></Base>;
export const IconDollar = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2 3 .6 3 2-1.3 2.5-3 2.5-3-1.1-3-2.5" /></Base>;
export const IconBarChart = (p: IconProps) => <Base {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></Base>;
export const IconSettings = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.2M12 18.8V21M4.5 7l1.9 1.1M17.6 15.9l1.9 1.1M3 12h2.2M18.8 12H21M4.5 17l1.9-1.1M17.6 8.1l1.9-1.1" /></Base>;
export const IconPower = (p: IconProps) => <Base {...p}><path d="M12 3v9" /><path d="M18.4 6.6a8 8 0 1 1-12.8 0" /></Base>;
export const IconMenu = (p: IconProps) => <Base {...p}><path d="M3 6h18M3 12h18M3 18h18" /></Base>;
export const IconSearch = (p: IconProps) => <Base {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.4-4.4" /></Base>;
export const IconBell = (p: IconProps) => <Base {...p}><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 21a2 2 0 0 0 4 0" /></Base>;
export const IconBookPlus = (p: IconProps) => <Base {...p}><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" /><path d="M9 9h4M11 7v4" /></Base>;
export const IconUserPlus = (p: IconProps) => <Base {...p}><circle cx="9" cy="8" r="3" /><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /><path d="M19 8v6M22 11h-6" /></Base>;
export const IconArrowUpCircle = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16V8M8.5 11.5L12 8l3.5 3.5" /></Base>;
export const IconArrowDownCircle = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8.5 12.5L12 16l3.5-3.5" /></Base>;
export const IconTrending = (p: IconProps) => <Base {...p}><path d="M3 17l6-6 4 4 7-8" /><path d="M14 6h6v6" /></Base>;
export const IconCheck = (p: IconProps) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9" /></Base>;
export const IconChat = (p: IconProps) => <Base {...p}><path d="M4 4h16v12H8l-4 4V4z" /></Base>;
export const IconSend = (p: IconProps) => <Base {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Base>;
