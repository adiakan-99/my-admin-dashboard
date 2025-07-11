export interface Listing {
    id: number,
    title: string,
    description: string,
    status: "pending" | "approved" | "rejected"
};

export const listings: Listing[] = [
    { "id": 1, "title": "Toyota Camry", "description": "Reliable sedan, 2022 model", "status": "pending" },
    { "id": 2, "title": "Honda SUV", "description": "Spacious family SUV", "status": "pending" },
    { "id": 3, "title": "Tesla Model 3", "description": "Electric car with autopilot", "status": "approved" },
    { "id": 4, "title": "Ford Mustang", "description": "Sporty coupe, 2023 model", "status": "approved" },
    { "id": 5, "title": "Chevrolet Tahoe", "description": "Large SUV with towing capacity", "status": "rejected" },
    { "id": 6, "title": "BMW 3 Series", "description": "Luxury sedan with advanced tech", "status": "approved" },
    { "id": 7, "title": "Hyundai Tucson", "description": "Compact SUV, fuel-efficient", "status": "pending" },
    { "id": 8, "title": "Mercedes-Benz C-Class", "description": "Premium sedan, 2021 model", "status": "rejected" },
    { "id": 9, "title": "Jeep Wrangler", "description": "Off-road capable SUV", "status": "pending" },
    { "id": 10, "title": "Nissan Altima", "description": "Comfortable midsize sedan", "status": "approved" },
    { "id": 11, "title": "Kia Sorento", "description": "Versatile crossover with 3rd row", "status": "rejected" },
    { "id": 12, "title": "Audi A4", "description": "Sleek sedan with quattro AWD", "status": "approved" },
    { "id": 13, "title": "Subaru Outback", "description": "Rugged wagon for outdoor adventures", "status": "pending" },
    { "id": 14, "title": "Volkswagen Golf", "description": "Compact hatchback, 2022 model", "status": "rejected" },
    { "id": 15, "title": "Lexus RX", "description": "Luxury crossover with hybrid option", "status": "pending" },
]