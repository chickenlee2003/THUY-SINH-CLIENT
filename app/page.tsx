import { CategorySidebar } from "@/components/category-sidebar";
import { HeroBanner } from "@/components/hero-banner";
import { PromoSections } from "@/components/promo-sections";
import { CategoryBanner } from "@/components/category-banner";
import { FeaturedProducts } from "@/components/featured-products";
import { BestSelling } from "@/components/best-selling";
import { KoiPond } from "@/components/koi-pond";
import { NewProducts } from "@/components/new-products";
import { FooterLinks } from "@/components/footer-links";
import { ToastContainer } from "react-toastify";

const featuredCategories = [
  {
    title: "CÁ KOI",
    image: "/placeholder.svg",
    href: "/category/koi-fishes",
  },
  {
    title: "CÁ RỒNG",
    image: "/placeholder.svg",
    href: "/category/arowana",
  },
  {
    title: "CÁ SĂN MỒI",
    image: "/placeholder.svg",
    href: "/category/monster-fishes",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <CategorySidebar />
        <div className="space-y-8">
          <HeroBanner />
          <PromoSections />
          <FeaturedProducts />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCategories.map((category) => (
              <CategoryBanner key={category.title} {...category} />
            ))}
          </div>
          <BestSelling />
          {/* <NewProducts /> */}
          <KoiPond />
          <FooterLinks />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
