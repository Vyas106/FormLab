import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" passHref>
      <span className="font-bold text-3xl bg-gradient-to-b from-white to-gray-300 text-transparent bg-clip-text cursor-pointer">
        FormLab
      </span>
    </Link>
  );
};

export default Logo;
