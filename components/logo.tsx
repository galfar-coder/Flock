import Image from "next/image";

export default function Logo() {
    return (
        <Image
            src={"/FlockLogo.png"}
            width={80}
            height={80}
            alt="Logo of the app"
        />
    );
}
