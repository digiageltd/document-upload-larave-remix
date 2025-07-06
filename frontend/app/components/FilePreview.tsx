import type { MediaFile } from "~/lib/api";
import { format } from "date-fns";

function getFileIcon(type: string) {
    if (type.includes("pdf")) return (
        <div className="w-10 h-10 rounded-lg bg-[#F9E4E3] flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-[#E53935]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );

    if (type.includes("png") || type.includes("jpg") || type.includes("jpeg")) return (
        <div className="w-10 h-10 rounded-lg bg-[#E3EEFC] flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-[#1E88E5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );

    return (
        <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-[#757575]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
}

export function FilePreview({ file, files, onDelete }: { file?: MediaFile, files?: MediaFile[], onDelete?: (id: number) => void }) {
    const fileList = file ? [file] : (files || []);

    if (!fileList.length) return null;

    return (
        <ul className="mt-3 space-y-2">
            {fileList.map((file) => (
                <li
                    key={file.id}
                    className="flex items-center py-3 px-1 rounded-xl bg-white/95 shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200 group"
                >
                    {getFileIcon(file.type)}

                    <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-gray-800 text-sm mb-1" title={file.original_name}>
                            {file.original_name}
                        </div>
                        <div className="text-gray-400 text-xs flex items-center">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.05 11C3.27151 8.6 4.51191 6.39027 6.45 4.8483C8.38809 3.30633 10.8606 2.54053 13.3086 2.70719C15.7566 2.87384 18.0947 3.95931 19.7489 5.7612C21.403 7.56309 22.2466 9.91922 22.1046 12.3231C21.9626 14.727 20.8462 17.0222 19.0133 18.7301C17.1804 20.438 14.7556 21.4321 12.1983 21.4957C9.64095 21.5593 7.17 20.6878 5.25634 19.0517C3.34268 17.4156 2.14343 15.1487 1.88 12.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {format(new Date(file.created_at), 'MMM d, yyyy')}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                            aria-label={`Download ${file.original_name}`}
                            title="Download"
                        >
                            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Download
                        </a>

                        {onDelete && (
                            <button
                                type="button"
                                className="inline-flex items-center p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                                onClick={() => onDelete(file.id)}
                                aria-label={`Delete ${file.original_name}`}
                                title="Delete"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}