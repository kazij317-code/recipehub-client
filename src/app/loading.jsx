export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0b0f17] transition-colors duration-300">
            <div className="flex flex-col items-center gap-4">

                {/* Spinner */}
                <div className="h-12 w-12 border-4 border-gray-200 dark:border-slate-800 border-t-blue-600 dark:border-t-purple-500 rounded-full animate-spin transition-colors"></div>

                {/* Loading text */}
                <p className="text-gray-600 dark:text-slate-400 text-sm font-medium tracking-wide transition-colors">
                    Loading, please wait...
                </p>

            </div>
        </div>
    );
}