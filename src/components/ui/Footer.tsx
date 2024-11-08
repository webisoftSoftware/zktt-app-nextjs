"use client";

import Link from "next/link";

interface FooterProps {
  showLinks?: boolean;
}

export default function Footer({ showLinks = true }: FooterProps) {
  return (
    <div className="absolute bottom-4 w-full px-8 flex justify-between items-center">
      {showLinks && (
        <div className="flex items-center gap-4">
          <Link 
            href="https://github.com/webisoftSoftware/" 
            className="hover:text-gray-600 text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </Link>
          <span className="mx-2">|</span>
          <Link 
            href="https://x.com/zktabletop" 
            className="hover:text-gray-600 text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            twitter
          </Link>
        </div>
      )}
      <Link 
        href="mailto:zktt.team@gmail.com" 
        className="hover:text-gray-600 text-lg"
      >
        get in touch
      </Link>
    </div>
  );
}
