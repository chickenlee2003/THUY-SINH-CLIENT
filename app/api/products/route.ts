// import { NextResponse } from "next/server";

// // This would typically come from your database
// const products = [
//   {
//     productId: 1,
//     productName: "Betta Fish Female",
//     productPrice: 100.0,
//     productDescription: "Beautiful female Betta fish",
//     productQuantity: 100,
//     productStatus: "AVAILABLE",
//     categoryId: 2,
//     images: [
//       {
//         imageId: 1,
//         imageUrl: "/placeholder.svg",
//       },
//       {
//         imageId: 2,
//         imageUrl: "/placeholder.svg",
//       },
//     ],
//     reviews: [],
//     createdAt: "2025-01-17T08:32:47.700124",
//   },
//   {
//     productId: 2,
//     productName: "Plakat Betta fish",
//     productPrice: 200.0,
//     productDescription: "Vibrant Plakat Betta fish",
//     productQuantity: 150,
//     productStatus: "AVAILABLE",
//     categoryId: 1,
//     images: [
//       {
//         imageId: 3,
//         imageUrl: "/placeholder.svg",
//       },
//       {
//         imageId: 4,
//         imageUrl: "/placeholder.svg",
//       },
//     ],
//     reviews: [],
//     createdAt: "2025-01-17T08:32:55.926414",
//   },
// ];

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const category = searchParams.get("category");

//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   if (category === "all" || !category) {
//     return NextResponse.json(products);
//   }

//   const filteredProducts = products.filter(
//     (product) => product.categoryId.toString() === category
//   );

//   return NextResponse.json(filteredProducts);
// }
