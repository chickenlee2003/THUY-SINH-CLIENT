import Link from 'next/link'

interface CategoryBannerProps {
  title: string
  image: string
  href: string
}

export function CategoryBanner({ title, image, href }: CategoryBannerProps) {
  return (
    <Link 
      href={href}
      className="block relative overflow-hidden rounded-lg aspect-[2/1] group"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-3xl font-bold text-white">{title}</h3>
      </div>
    </Link>
  )
}

