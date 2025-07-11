import { Listing, listings } from "@/lib/listings";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    const requestBody: { id: number, title: string, description: string } = await request.json();

    if (!requestBody.id || typeof requestBody.id !== "number" || !requestBody.title || typeof requestBody.title !== "string" || !requestBody.description || typeof requestBody.description !== "string") {
        return NextResponse.json({ status: 400, success: false, message: "Invalid request" });
    }

    const listing: Listing | undefined = listings.find((l) => l.id === requestBody.id);

    console.log(listings);

    if (listing) {
        listings.map((l) => {
            if (l.id === requestBody.id) {
                l.title = requestBody.title;
                l.description = requestBody.description;
            }
        });

        console.log(listings);

        return NextResponse.json({ status: 200, success: true, message: "Listing edited!" })
    } else {
        return NextResponse.json({ status: 404, success: false, message: "Listing not found!" });
    }
}