import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function UserList() {
    return (
        <div className="flex-col bg-accent w-60 text-gray-100">
            <div className="flex justify-between items-center gap-2 shadow-sm px-4 border-gray-700 border-b h-12">
                <Input
                    className="relative !text-sm"
                    placeholder="Search for users..."
                />
                <Search className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>

            <div className="flex-col items-start p-4">
                <span className="mb-4 text-gray-400 text-sm uppercase tracking-wide">
                    Leader - 1
                </span>
                <div className="flex items-center gap-2">
                    <div className="relative bg-primary-300 rounded-full size-8">
                        <div className="right-0 bottom-0 absolute bg-green-500 border border-accent rounded-full size-3"></div>
                    </div>
                    <div>Topeeez</div>
                </div>
            </div>
        </div>
    );
}
