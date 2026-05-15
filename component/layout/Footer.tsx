import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full border-t border-gray-300 bg-secondary text-text-primary px-6 md:px-12 py-10 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Kolom 1 */}
        <div className="text-center md:text-left">
          <h2 className="font-black text-primary text-lg mb-4 uppercase">
            Sakura Learn
          </h2>
          <p className="text-sm leading-relaxed">
            Kuasai Hiragama dan Katakana melalui pendekatan visual yang
            menenagkan dan interaktif. Mulai dari dasar dengan Sakura Learn
          </p>
        </div>

        {/* Kolom 2 */}
        <div className="mx-auto text-center md:text-left">
          <h2 className="font-bold uppercase text-base mb-4">Menu</h2>
          <div className="hidden md:flex flex-col items-center lg:items-start text-sm gap-2 font-normal">
            <Link href="/">Home</Link>
            <Link href="/dictionary">Dictionary</Link>
            <Link href="/practice">Practice</Link>
          </div>
        </div>

        {/* Kolom 3
        <div className="text-center md:text-left">
          <h2 className="font-semibold text-lg mb-4">Ikuti Kami</h2>
          <div className="flex flex-col gap-2 items-center md:items-start text-md text-center md:text-left">
            <a
              href="https://www.instagram.com/kirs_sman10bgr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaInstagram className="w-6 h-6" />
              <span>kirs_sman10bgr</span>
            </a>
            <div className="flex items-center gap-2">
              <FaYoutube className="w-6 h-6" />
              <span>Youtube</span>
            </div>
          </div>
        </div> */}

        {/* Kolom 4 */}
        <div className="mx-auto text-center md:text-left">
          <h2 className="font-bold uppercase text-base mb-4">Kontak</h2>
          <div className="flex flex-col gap-2 items-center md:items-start text-sm text-center md:text-left">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <p className="text-md">adminkirsepuluh@gmail.com</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <p className="text-md">+62837147128</p>
            </div>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="border-t border-gray-200 mt-10 pt-4 text-center text-sm">
        © Copyright Sakura Learn. All Rights Reserved
      </div>
    </div>
  );
}
