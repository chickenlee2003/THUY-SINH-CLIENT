import { CategoryShowcase } from "@/components/category-showcase";
import { CategoryCarousel } from "@/components/category-carousel";
import { CategoryGrid } from "@/components/category-grid";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh mục sản phẩm</h1>
      
      {/* Category Carousel */}
      {/* <div className="mb-12">
        <CategoryCarousel />
      </div> */}
      
      {/* Category Showcase */}
      <div className="mb-12">
        <CategoryShowcase />
      </div>
      
      {/* Category Grid */}
      {/* <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Tất cả danh mục</h2>
        <CategoryGrid />
      </div> */}
    </div>
  );
} 