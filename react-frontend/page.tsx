import OpeningPanel from "@/components/OpeningPanel";
import Navbar from "@/components/Navbar";
import ServicePanel from "@/components/ServicePanel";
import ProductsPanel from "@/components/ProductsPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="snap-y snap-mandatory h-screen overflow-y-auto">
        <div className="snap-start">
          <OpeningPanel />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Home Goods"
            description="Transform your living space with our carefully curated collection of home decor, furniture, kitchenware, and household essentials. From vintage finds to modern pieces, discover items that make your house a home."
            buttonText="Shop Home Goods"
            buttonLink="/home-goods"
            backgroundImages={[
              '/backgrounds/store1.jpeg',
              '/backgrounds/store2.jpeg',
              '/backgrounds/store3.jpeg'
            ]}
            variant="design"
          />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Clothing & Fashion"
            description="Express your unique style with our selection of vintage and contemporary clothing, accessories, and jewelry. Find one-of-a-kind pieces that tell a story and add character to your wardrobe."
            buttonText="Browse Fashion"
            buttonLink="/clothing"
            backgroundImages={[
              '/backgrounds/store4.jpeg',
              '/backgrounds/store5.jpeg',
              '/backgrounds/design1.jpeg'
            ]}
            variant="tech"
          />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Art & Antiques"
            description="Discover treasures from the past and artistic creations that inspire. Our collection features vintage artwork, antique collectibles, and unique decorative pieces that add sophistication to any space."
            buttonText="Explore Collection"
            buttonLink="/art-antiques"
            backgroundImages={[
              '/backgrounds/design2.jpeg',
              '/backgrounds/design3.jpeg',
              '/backgrounds/design4.jpeg'
            ]}
            variant="design"
          />
        </div>
        <div className="snap-start">
          <ProductsPanel />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Contact Us"
            description="Have questions about an item or need help finding something special? We're here to help you discover the perfect pieces for your home and style. Reach out to us anytime!"
            buttonText="Get in Touch"
            buttonLink="/contact"
            backgroundImage="/backgrounds/contact1.jpeg"
            variant="contact"
          />
        </div>
      </main>
    </div>
  );
}
