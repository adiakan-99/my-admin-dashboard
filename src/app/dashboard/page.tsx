import { listings, Listing } from "@/lib/listings";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage({ searchParams }: { searchParams: { page?: string | undefined } }) {
    const search = await searchParams;
    const page = parseInt(search.page || "1", 10) || 1;
    const limit = 5;
    const totalListings: number = listings.length;

    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (startIndex >= totalListings) {
        const newPage = Math.ceil(listings.length / limit);
        startIndex = (newPage - 1) * limit;
        endIndex = newPage * limit;
    }

    const pageListings: Listing[] = listings.slice(startIndex, endIndex);

    return (
        <>
            <DashboardClient listings={pageListings} totalListings={totalListings} currentPage={page} limit={limit}/>
        </>
    );
};