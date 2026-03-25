import Link from "next/link";
import Image from "next/image";

const SidebarLogo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group transition-all duration-200 active:scale-95"
    >
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
        <Image
          src="/logo.png"
          alt="Acadex Logo"
          width={36}
          height={36}
          className="rounded-lg"
        />
      </div>

      <span className="text-xl font-black tracking-tighter text-foreground hidden sm:block transition-colors duration-300 group-hover:text-orange-500">
        Aca
        <span className="text-orange-500 transition-colors duration-300 group-hover:text-foreground">
          dex
        </span>
      </span>
    </Link>
  );
};

export default SidebarLogo;