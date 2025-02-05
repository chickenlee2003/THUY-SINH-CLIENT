import { Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <img 
          src="/placeholder.svg" 
          alt="Kolathur Fish Market" 
          className="mx-auto h-24 mb-6"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Get in touch with us</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-600 shrink-0" />
              <a 
                href="mailto:support@kolathurfishmarket.com" 
                className="text-gray-600 hover:text-teal-600"
              >
                support@kolathurfishmarket.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-teal-600 shrink-0" />
              <a 
                href="tel:+917338701314" 
                className="text-gray-600 hover:text-teal-600"
              >
                +91 7338701314
              </a>
            </div>
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-1" />
              <address className="text-gray-600 not-italic">
                Kochar Bliss 4th floor, A8 A9 TVK Industrial Estate, Guindy Chennai,
                <br />
                Tamil Nadu - 600032
              </address>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-6">Contact Us Now</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name:</Label>
              <Input 
                id="name"
                placeholder="Your Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email:</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Your Email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number:</Label>
              <Input 
                id="phone"
                type="tel"
                placeholder="Phone Number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message:</Label>
              <Textarea 
                id="message"
                placeholder="Type Your Message Here..."
                className="min-h-[150px]"
                required
              />
            </div>

            <Button 
              type="submit"
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              Send Message on WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

