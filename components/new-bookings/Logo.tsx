import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({theme=true}:{theme?:boolean}) => {
  return (
    <Link href="/" className="text-sage-700 hover:text-sage-900 font-medium">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 relative">
          <Image
            src={"/evolu-logo.png"}
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
        <span className={`text-xl font-semibold ${theme==true?'text-sage-800':'text-sage-50'}`}>Evolu</span>
      </div>
    </Link>
  );
};

export default Logo;
