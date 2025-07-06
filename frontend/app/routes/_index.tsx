import {fetchCategories, fetchMedia, type GroupedMedia, type MediaCategory} from "~/lib/api";
import {useLoaderData} from "@remix-run/react";
import {DocumentUploadCard} from "~/components/DocumentUploadCard";
import React, {useMemo} from "react";

export async function loader() {
    const [grouped, categories] = await Promise.all([
        fetchMedia(),
        fetchCategories(),
    ]);
    return {grouped, categories};
}

export default function Index() {
    const {grouped, categories} = useLoaderData<{
        grouped: GroupedMedia,
        categories: MediaCategory[]
    }>();

    const categoryIcons: Record<string, React.ReactNode> = {
        passport: (
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 17C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>),
        photo: (
            <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>),
        visa: (
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M13 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V9L13 3Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 3V9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>),
    };

    const totalUploaded = useMemo(
        () => categories.reduce((acc, cat) => acc + (grouped[cat.key]?.length || 0), 0),
        [grouped, categories]
    );
    const totalAllowed = useMemo(
        () => categories.reduce((acc, cat) => acc + (cat.max_files ?? 1), 0),
        [categories]
    );
    const uploadProgress = useMemo(
        () => Math.round((totalUploaded / totalAllowed) * 100),
        [totalUploaded, totalAllowed]
    );



    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <div className="pt-16 pb-12">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Document Upload
                        </h1>
                        <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Upload your essential documents for visa application review
                        </p>

                        {/* Progress indicator */}
                        <div className="mt-10 max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-sm font-medium text-gray-700">Upload Documents Needed Process</span>
                                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out"
                                    style={{width: `${uploadProgress}%`}}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                                {totalUploaded}/{totalAllowed} documents uploaded
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.key}
                            style={{animationDelay: `${index * 120}ms`}}
                        >
                            <div
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                <div className="p-6">
                                    <DocumentUploadCard
                                        category={cat.key}
                                        label={cat.label}
                                        description={cat.description}
                                        files={grouped[cat.key] || []}
                                        icon={categoryIcons[cat.key]}
                                        maxFiles={cat.max_files || 1}
                                    />

                                    {/* Status indicator */}
                                    <div className="mt-5 flex items-center text-sm">
                                        {(grouped[cat.key]?.length > 0) ? (
                                            <span className="flex items-center text-green-600">
                                                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                </svg>
                                                Uploaded
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-amber-600">
                                                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                  <path
                                                      d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            Pending
                                          </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
