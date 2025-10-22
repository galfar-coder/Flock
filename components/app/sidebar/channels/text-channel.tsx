export function TextChannel() {
    return (
        <div
            key={channel.id}
            className="group flex justify-between items-center hover:bg-background-app mb-0.5 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer transtion-all"
        >
            <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{channel.name}</span>
            </div>
            {channel.unread > 0 && (
                <span className="bg-primary-300 px-1.5 py-0.5 rounded-full min-w-5 text-background text-xs text-center">
                    {channel.unread}
                </span>
            )}
        </div>
    );
}
