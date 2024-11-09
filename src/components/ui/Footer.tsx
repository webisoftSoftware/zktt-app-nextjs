"use client";

import Link from "next/link";

interface FooterProps {
  showLinks?: boolean;
}
export default function Footer({ showLinks = true }: FooterProps) {
  return (
    // Footer container with absolute positioning
    <div className="absolute bottom-4 w-full px-8 flex justify-between items-center">
      {/* Conditional rendering of social links */}
      {showLinks && (
        <div className="flex items-center gap-4">
          {/* GitHub link */}
          <Link 
            href="https://github.com/webisoftSoftware/" 
            className="hover:text-gray-600 text-lg"
            target="_blank"           // Open in new tab
            rel="noopener noreferrer" // OP for external links
          >
            github
          </Link>
          
          {/* Separator */}
          <span className="mx-2">|</span>
          
          {/* x fka twitter */}
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
      
      {/* email link */}
      <Link 
        href="mailto:zktt.team@gmail.com" 
        className="hover:text-gray-600 text-lg"
      >
        get in touch
      </Link>
    </div>
  );
}
