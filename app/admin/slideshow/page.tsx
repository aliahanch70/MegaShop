"client side"
import SlideManager from '@/components/admin/SlideManager';

export default function Slideshow() {
    return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        
        <section className="mb-8">
            <SlideManager />
        </section>

        </div>
    </div>
    )  
}