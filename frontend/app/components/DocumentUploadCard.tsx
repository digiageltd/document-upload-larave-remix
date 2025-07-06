import {useNavigation, useActionData} from "@remix-run/react";
import {FilePreview} from "./FilePreview";
import type {MediaFile} from "~/lib/api";
import React, {useState} from "react";
import {deleteMedia, endpoints} from "~/lib/api";

export function DocumentUploadCard({category, label, description, files = [], icon, maxFiles = 1,}: {
    category: string;
    label: string;
    description: string;
    help?: string;
    files?: MediaFile[];
    icon?: React.ReactNode
    maxFiles: number,
}) {
    useNavigation();
    useActionData();
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setToast(null);
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        try {
            const res = await fetch(endpoints.media(), {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                let msg = "Upload failed";
                try {
                    const json = await res.json();
                    msg = json.message || msg;
                } catch { /* empty */
                }
                setToast({type: 'error', message: msg});
            } else {
                setToast({type: 'success', message: "File uploaded successfully!"});
                if (typeof window !== "undefined") {
                    setTimeout(() => window.location.reload(), 1200);
                }
            }
        } catch (err: unknown) {
            let message = "Unknown error";
            if (err instanceof Error) {
                message = err.message;
            }
            setToast({type: "error", message});
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        setToast(null);
        try {
            await deleteMedia(id);
            setToast({type: 'success', message: "File deleted."});
            if (typeof window !== "undefined") {
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err: unknown) {
            let message = "Delete failed";
            if (err instanceof Error) {
                message = err.message;
            }
            setToast({type: 'error', message});
        }
    }

    return (
        <div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm transition-all duration-300 flex flex-col min-h-[420px] h-full relative group">
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 transform ${
                        toast.type === 'success'
                            ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
                            : 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {toast.type === 'success'
                            ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        }
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="flex items-center mb-2">
                        {icon && (
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-3">
                                {icon}
                            </div>
                        )}
                        <h2 className="font-semibold text-xl text-gray-800">{label}</h2>
                    </div>
                    <div className="text-gray-500 text-sm leading-relaxed">{description}</div>
                </div>

                {/* File Counter */}
                <div
                    className="flex items-center px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium"
                    title={`Files uploaded: ${files.length}${maxFiles > 1 ? ` of ${maxFiles}` : ""}`}
                >
                    <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                    {files.length}/{maxFiles}
                </div>
            </div>

            {/* File Upload Section */}
            <div className="flex-1 flex flex-col">
                {files.length > 0 ? (
                    <div className="space-y-3 mb-4">
                        {files.map((file) => (
                            <div key={file.id}
                                 className="relative group overflow-hidden rounded-xl border border-gray-100 transition-all duration-200 hover:border-gray-200 bg-gray-50/50">
                                <FilePreview file={file}/>
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    title="Delete file"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7 16.5V7.5C7 6.67157 7.67157 6 8.5 6H15.5C16.3284 6 17 6.67157 17 7.5V16.5C17 17.3284 16.3284 18 15.5 18H8.5C7.67157 18 7 17.3284 7 16.5Z"
                                    stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M9.5 10.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M9.5 13.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <p>No files uploaded yet</p>
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                {files.length < maxFiles && (
                    <div className="mt-auto pt-4">
                        <label
                            className={`relative w-full flex items-center justify-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                uploading
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center">
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-medium text-sm">Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 16H16" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="font-medium text-sm">Upload {category} file</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}