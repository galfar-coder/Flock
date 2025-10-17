export default function UserList() {
    return (
        <div className="hidden md:flex md:flex-col bg-background-chat border-app rounded-2xl w-60 h-full text-gray-100">
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
