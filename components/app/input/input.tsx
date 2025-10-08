import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";

export function InputField() {
    return (
        <div className="flex items-center bg-accent mb-0 ml-4 rounded-t-xl overflow-hidden">
            <div className="flex items-center pl-4">
                <button className="hover:bg-primary-300 p-3 rounded-full transition-colors">
                    <Plus size={20} />
                </button>
            </div>
            <Input
                className="relative flex-1 !m-2 !mb-0 focus:!border-primary-300 !ring-0 h-12 !text-lg transition-colors ease-fluid"
                placeholder="Send message..."
            ></Input>
            <div className="flex justify-between items-center p-4">
                <div className="hover:bg-primary-300 p-4 rounded-full transition-colors">
                    <Send className="" size={20} />
                </div>
            </div>
        </div>
    );
}
