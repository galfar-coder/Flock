import Image from "next/image";

export const Logo = () => (
    <div className="flex items-center gap-2">
        <Image alt="Flock Logo" width={50} height={50} src="/FlockLogo.png" />
        <span className="font-bold text-2xl">Flock</span>
    </div>
);
