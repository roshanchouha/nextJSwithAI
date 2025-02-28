"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import message from "@/message.json"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="">
          Dive into the world of Anonymous conversations
        </h1>
        <p className="">Explore Mystery Message  - Where your identity remain a secret.</p>
        <Carousel
          plugins={[Autoplay({ delay: 1000 })]}
          className="w-full max-w-xs">
          <CarouselContent>
            {message.map((message, index) => {
              return (
                <>
                  <CarouselItem key={index + 0}>
                    <div className="p-1">
                      <Card>
                        <CardHeader>
                          {message.title}
                        </CardHeader>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-lg font-semibold">{message.content}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                </>
              )

            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </section>
    </main>
  )
}
