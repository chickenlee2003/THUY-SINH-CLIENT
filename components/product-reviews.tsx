'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Review {
  id: string
  rating: number
  comment: string
  author: string
  date: string
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  description?: string
}

export function ProductReviews({ productId, reviews, description }: ProductReviewsProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const averageRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0

  return (
    <div className="mt-12">
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-8">
          <div className="rounded-lg bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-500">out of 5.0</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating ? 'fill-primary text-primary' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">({reviews.length} reviews)</div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Rate this Product</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-primary text-primary'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Write your review here..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button className="w-full">Submit Review</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">There have been no reviews for this product yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2 border-b pb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? 'fill-primary text-primary' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    By {review.author} on {review.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="description">
          {description ? (
            <div className="prose max-w-none">
              <p>{description}</p>
            </div>
          ) : (
            <p className="text-center text-gray-500">No description available for this product.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

