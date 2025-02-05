import { notFound } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductGrid } from '@/components/product-grid'

// This would typically come from your database
const products = [
  {
    id: '1',
    name: 'Betta Fish Female',
    price: 100.00,
    image: '/placeholder.svg',
    categoryId: 'betta-female'
  },
  {
    id: '2',
    name: 'Plakat Betta fish',
    price: 200.00,
    image: '/placeholder.svg',
    categoryId: 'plakat'
  },
  {
    id: '3',
    name: 'Full moon Betta fish Female',
    price: 200.00,
    image: '/placeholder.svg',
    categoryId: 'fullmoon'
  },
  {
    id: '4',
    name: 'Crown Tail betta fish Male',
    price: 200.00,
    image: '/placeholder.svg',
    categoryId: 'crowntail'
  },
  {
    id: '5',
    name: 'King Cobra Crown Tail betta fish',
    price: 240.00,
    image: '/placeholder.svg',
    categoryId: 'crowntail'
  },
  {
    id: '6',
    name: 'DoubleTail Fullmoon Betta Fish',
    price: 190.00,
    image: '/placeholder.svg',
    categoryId: 'doubletail'
  },
  {
    id: '7',
    name: 'Boxer Plakat Betta fish',
    price: 190.00,
    image: '/placeholder.svg',
    categoryId: 'plakat'
  }
]

const categories = {
  'betta-female': 'Betta Female',
  'plakat': 'Plakat',
  'fullmoon': 'Full Moon',
  'crowntail': 'Crown Tail',
  'doubletail': 'Double Tail'
}

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.id as keyof typeof categories]
  
  if (!category) {
    notFound()
  }

  const filteredProducts = products.filter(
    product => product.categoryId === params.id
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{category}</h1>
        <Select defaultValue="default">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProductGrid products={filteredProducts} />
    </div>
  )
}

