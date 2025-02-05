import Link from 'next/link'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src="/placeholder.svg" alt="Kolathur Fish Market" className="h-12" />
            <p className="text-sm">
              Professional Aquatics Online Store. Here you can find Saltwater fishes, Freshwater fishes, Fish tanks, Fish
              foods, Tank filters, Decor & Plants, etc..
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">USEFUL LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:text-white">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/seller-policy" className="text-sm hover:text-white">
                  Seller Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">CONTACTS</h3>
            <div className="space-y-2 text-sm">
              <p>Address</p>
              <p>
                KOCHAR BLISS 4TH FLOOR, NO.A8 and A9, TVK INDUSTRIAL ESTATE, GUINDY, CHENNAI
                <br />
                TAMILNADU - 600032
              </p>
              <p>Phone</p>
              <p>7338701314</p>
              <p>Email</p>
              <p>sales@kolathurfishmarket.com</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-semibold">NEWSLETTER</h3>
            <p className="text-sm">Subscribe to our newsletter for regular updates about Offers, Coupons & more</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 px-3 py-2 bg-gray-800 rounded text-white"
              />
              <Button>Subscribe</Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">FOLLOW US</h3>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-semibold">MOBILE APPS</h3>
              <div className="flex gap-4">
                <Link href="#">
                  <img src="/placeholder.svg" alt="Get it on Google Play" className="h-10" />
                </Link>
                <Link href="#">
                  <img src="/placeholder.svg" alt="Download on the App Store" className="h-10" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-center">© 2024 Kolathur Fish Market</p>
        </div>
      </div>
    </footer>
  )
}

