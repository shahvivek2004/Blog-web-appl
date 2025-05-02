import { Link } from "react-router-dom";

interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
    isOwner?: boolean;
}

export const BlogCard = ({
    authorName,
    title,
    content,
    publishedDate,
    id,
    isOwner = false
}: BlogCardProps) => {
    return (
        <div className="flex flex-row border-b border-slate-200 w-full hover:bg-slate-50 transition-colors">
            {/* Main content - needs to be a separate link */}
            <Link to={`/blog/${id}`} className="flex-grow p-4 cursor-pointer">
                <div className="flex items-center">
                    <Avatar name={authorName} />
                    <div className="pl-2 text-sm">
                        {authorName}
                    </div>
                    <div className="pl-2">
                        <Dot />
                    </div>
                    <div className="pl-2 text-sm text-slate-500">
                        {timeAgo(publishedDate)}
                    </div>
                </div>
                <div className="text-xl font-semibold pt-2">
                    {title.length > 100 ? `${title.slice(0, 100)}...` : title}
                </div>
                <div className="text-md font-light text-slate-700">
                    {`${content.slice(0, 150)}...`}
                </div>
                <div className="text-slate-500 text-sm pt-2">
                    {`${Math.ceil(content.length / 100)} minute(s) read`}
                </div>
            </Link>

            {/* Edit button - separate from the card link */}
            {isOwner && (
                <div className="flex items-center px-4 flex-shrink-0">
                    <Link
                        to={`/blog/edit/${id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-[120px] text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm p-3 text-center"
                    >
                        Edit Blog
                    </Link>
                </div>
            )}

        </div>
    );
};

export function Avatar({ name, size = "s" }: { name: string, size?: string }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${size === "b" ? "w-10 h-10" : "w-6 h-6"} overflow-hidden bg-purple-800 rounded-full`}>
            <span className={`${size === 's' ? "text-xs" : "text-lg"} font-medium text-white`}>
                {name[0].toUpperCase()}
            </span>
        </div>
    );
}

function Dot() {
    return (
        <div className="h-1 w-1 rounded-full bg-slate-600"></div>
    );
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const amount = Math.floor(seconds / value);
        if (amount >= 1) {
            return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}