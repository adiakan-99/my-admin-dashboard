"use client";
import { Listing } from "@/lib/listings";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackContext } from "@/context/FeedbackContext";

interface DashboardClientProps {
    listings: Listing[],
    totalListings: number,
    currentPage: number,
    limit: number
}

interface FormData {
    title: string,
    description: string
}

export default function DashboardClient(props: DashboardClientProps) {
    const router = useRouter();
    const { feedback, setFeedback } = useContext(FeedbackContext);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({ title: "", description: "" });
    const [feedbackAnimation, setFeedbackAnimation] = useState<string | null>(null);

    const feedbackClass = `${feedback.type === "success" ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"} p-4 rounded text-center transition-transform duration-300 ${feedbackAnimation === "entering" || feedbackAnimation === "exiting" ? "translate-y-[-100%]" : "translate-y-0"}`;

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

        if (!isAuthenticated) {
            setFeedback({ message: "Please login to access the dashboard", type: "error" });
            router.push(`/login?redirect=/dashboard?page=${props.currentPage}`)
        }
    }, []);

    useEffect(() => {
        let enterTimer: string | number | NodeJS.Timeout | undefined, visibleTimer: string | number | NodeJS.Timeout | undefined, exitTimer: string | number | NodeJS.Timeout | undefined;
        if (feedback.message) {
            setFeedbackAnimation("entering");
            enterTimer = setTimeout(() => {
                setFeedbackAnimation("visible");
                visibleTimer = setTimeout(() => {
                    setFeedbackAnimation("exiting");
                    exitTimer = setTimeout(() => setFeedback({ message: "", type: "" }), 300);
                }, 3000);
            }, 300);
        } else {
            setFeedbackAnimation(null);
        }

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(visibleTimer);
            clearTimeout(exitTimer);
        }

    }, [feedback.message]);

    console.log(feedbackAnimation);

    async function handleApprove(id: number) {
        try {
            const response = await fetch("/api/listings/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                setFeedback({ message: "Listing approved successfully", type: "success" });
                router.refresh();
            } else {
                setFeedback({ message: "Failed to approve listing", type: "error" });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleReject(id: number) {
        try {
            const response = await fetch("/api/listings/reject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            console.log({ id, response: await response.json() })

            if (response.ok) {
                setFeedback({ message: "Listing rejected successfully", type: "success" });
                router.refresh();
            } else {
                setFeedback({ message: "Failed to reject listing", type: "error" });
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleEdit(listing: Listing) {
        setSelectedListing(listing);
        setIsEditFormOpen(true);
        setFormData({ title: listing.title, description: listing.description });
    }

    function handleCancel() {
        setIsEditFormOpen(false);
        setSelectedListing(null);
        setFormData({ title: "", description: "" });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch("/api/listings/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: selectedListing?.id, ...formData })
        });

        if (response.ok) {
            setFeedback({ message: "Listing updated successfully", type: "success" });
            setIsEditFormOpen(false);
            setSelectedListing(null);
            router.refresh();
        } else {
            setFeedback({ message: "Failed to update listing", type: "error" });
        }
    }

    function handleLogout() {
        console.log("Logging out");
        localStorage.removeItem("isAuthenticated");
        router.push("/login");
    }

    return (
        <>
            <div className="fixed top-0 w-full bg-gray-100 p-4 z-50">
                <div className="w-full flex justify-end p-4">
                    <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="flex items-center flex-col min-h-screen bg-gray-100 overflow-x-auto pt-28">
                <div className="h-16 flex items-center justify-center">
                    {feedback.message && <div role="alert" className={feedbackClass}>{feedback.message}</div>}
                </div>
                <div className="text-blue-700 text-2xl text-center mt-4 mb-4 px-4">Car Listings</div>
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden table-auto overflow-x-auto mt-16">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold">ID</th>
                            <th className="py-3 px-4 text-left font-semibold">Title</th>
                            <th className="py-3 px-4 text-left font-semibold">Description</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
                            <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.listings.length > 0 ?
                                props.listings.map((listing) => {
                                    return <tr className="border-b border-gray-200 hover:bg-gray-50" key={listing.id}>
                                        <td className="py-2 px-4 text-gray-700">{listing.id}</td>
                                        <td className="py-2 px-4 text-gray-700">{listing.title}</td>
                                        <td className="py-2 px-4 text-gray-700">{listing.description}</td>
                                        <td className="py-2 px-4 text-gray-700">{listing.status}</td>
                                        <td className={listing.status === "approved" ? "text-green-500" : listing.status === "rejected" ? "text-red-500" : "text-yellow-500"}>
                                            <div className="flex gap-2">
                                                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500" onClick={() => handleApprove(listing.id)} disabled={listing.status === "approved"}>Approve</button>
                                                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500" onClick={() => handleReject(listing.id)} disabled={listing.status === "rejected"}>Reject</button>
                                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => handleEdit(listing)}>Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                })
                                :
                                <tr>
                                    <td colSpan={4}>No Listings found</td>
                                </tr>
                        }
                    </tbody>
                </table>
                <div className="flex gap-2 mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed" onClick={() => router.push(`/dashboard?page=${props.currentPage - 1}`)} disabled={props.currentPage === 1}>Previous</button>
                    <span className="text-gray-700 font-medium py-2">Page {props.currentPage} of {Math.ceil(props.totalListings / props.limit)}</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed" onClick={() => router.push(`/dashboard?page=${props.currentPage + 1}`)} disabled={props.currentPage >= Math.ceil(props.totalListings / props.limit)}>Next</button>
                </div>
                {isEditFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <form aria-modal="true" role="dialog" className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                            <label className="block text-gray-700 mb-2">Title</label>
                            <input className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mr-2">Save</button>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200" onClick={handleCancel} type="button">Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};