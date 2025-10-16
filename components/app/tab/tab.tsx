import { X } from "lucide-react";

export function Tab() {
    return (
        <div className="relative flex justify-left items-center bg-background-chat p-2 border-app rounded-lg w-full max-w-32 text-sm">
            MesosElite
            <X className="right-2 absolute" size={16} />
        </div>
    );
}
