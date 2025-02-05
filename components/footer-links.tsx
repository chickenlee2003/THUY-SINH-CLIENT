import Link from 'next/link'

export function FooterLinks() {
  return (
    <section className="border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <Link href="/terms" className="text-gray-600 hover:text-teal-600">
            Terms & conditions
          </Link>
          <Link href="/return-policy" className="text-gray-600 hover:text-teal-600">
            Return policy
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-teal-600">
            Support Policy
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-teal-600">
            Privacy policy
          </Link>
        </div>
      </div>
    </section>
  )
}

