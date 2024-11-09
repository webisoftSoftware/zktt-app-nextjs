"use client";

import { Link } from 'react-router-dom';

interface FooterProps {
  showLinks?: boolean;
}
export default function Footer({ showLinks = true }: FooterProps) {
  return (
    // Footer container with absolute positioning
    <div className="absolute bottom-4 flex w-full items-center justify-between px-8">
      {/* Conditional rendering of social links */}
      {showLinks && (
        <div className="flex items-center gap-4">
          {/* GitHub link */}
          <Link 
            to="https://github.com/webisoftSoftware/" 
            className="text-lg hover:text-gray-600"
            target="_blank"           // Open in new tab
            rel="noopener noreferrer" // OP for external links
          >
            github
          </Link>
          
          {/* Separator */}
          <span className="mx-2">|</span>
          
          {/* x fka twitter */}
          <Link 
            to="https://x.com/zktabletop" 
            className="text-lg hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            twitter
          </Link>
        </div>
      )}
      
      {/* email link */}
      <Link 
        to="mailto:zktt.team@gmail.com" 
        className="text-lg hover:text-gray-600"
      >
        get in touch
      </Link>
    </div>
  );
}
