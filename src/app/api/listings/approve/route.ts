import { Listing, listings } from "@/lib/listings";
import { NextResponse } from "next/server";


export async function POST(request: Request): Promise<NextResponse> {
    const requestBody: { id: number } = await request.json();

    if (!requestBody.id || typeof requestBody.id !== "number") {
        return NextResponse.json({ status: 400, success: false, message: "Invalid request" });
    }

    const listing: Listing | undefined = listings.find(l => l.id === requestBody.id);

    console.log(listings)
    
    if (listing) {
        listings.map((l) => {
            if (l.id === requestBody.id) {
                l.status = "approved";
            }
        });

        console.log(listings);

        return NextResponse.json({ status: 200, success: true, message: "Listing approved" });
    } else {
        return NextResponse.json({ status: 404, success: false, message: "Listing not found." });
    }
}