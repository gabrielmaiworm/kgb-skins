import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const safeImages = images || [];
  const currentImage = safeImages[currentImageIndex] || "/img/placeholder.png";

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="glass-card">
          <div className="glass-bg" />
          <div className="glass-blur" />
          <div className="glass-border" />

          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            <div
              className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10 cursor-pointer hover:border-kgb-gold/50 transition-all"
              onClick={() => setIsExpanded(true)}
            >
              <Image src={currentImage} alt={title} fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {safeImages.length > 1 && (
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1">
            {safeImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "relative flex-1 min-w-[80px] sm:min-w-0 aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all shrink-0",
                  currentImageIndex === index
                    ? "border-kgb-gold scale-105"
                    : "border-glass-border hover:border-white/30"
                )}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <Image src={image} alt={`Imagem ${index + 1}`} fill className="object-contain p-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <button
              className="absolute top-4 right-4 z-[101] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={currentImage} alt={title} fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
