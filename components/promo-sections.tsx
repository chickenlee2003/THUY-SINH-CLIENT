import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PromoSections() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative overflow-hidden rounded-lg bg-[url('/placeholder.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            TANK MAINTENANCE
          </h2>
          <Button asChild variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
            <Link href="/services/maintenance">
              BOOK NOW
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-[url('/placeholder.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            AQUA SCAPING
          </h2>
          <Button asChild variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
            <Link href="/services/aquascaping">
              BOOK NOW
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

