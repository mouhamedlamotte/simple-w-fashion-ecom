import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-6xl">ANDERSON</h1>
                <h2 className="text-3xl font-light tracking-wide">Fashion Show</h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  Découvrez notre collection exclusive de vêtements élégants. Design simple, style intemporel.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="px-8">
                    Découvrir
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="px-8 bg-transparent">
                    S'inscrire
                  </Button>
                </Link>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">2800€</span>
                <span className="text-lg text-muted-foreground line-through">3400€</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aWS2AyBhGUeUGKj6GtVuCgFrucgRlv.png"
                  alt="Fashion Model"
                  width={400}
                  height={600}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Collection Exclusive</h2>
            <p className="mt-2 text-muted-foreground">Des pièces soigneusement sélectionnées pour vous</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg bg-neutral-100 p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold">Vêtements</h3>
              <p className="mt-2 text-sm text-muted-foreground">Robes, costumes et ensembles élégants</p>
              <Link href="/products?category=vetements">
                <Button variant="link" className="mt-4 p-0">
                  Explorer →
                </Button>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-neutral-100 p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold">Accessoires</h3>
              <p className="mt-2 text-sm text-muted-foreground">Complétez votre look avec style</p>
              <Link href="/products?category=accessoires">
                <Button variant="link" className="mt-4 p-0">
                  Explorer →
                </Button>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-neutral-100 p-8 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold">Chaussures</h3>
              <p className="mt-2 text-sm text-muted-foreground">La touche finale parfaite</p>
              <Link href="/products?category=chaussures">
                <Button variant="link" className="mt-4 p-0">
                  Explorer →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Nous créons des vêtements pour les femmes qui dirigent et changent le monde
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300 text-pretty">
            Rejoignez notre communauté de femmes qui font la différence. Chaque pièce est conçue pour vous donner
            confiance et style.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="mt-8">
              Voir la collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
