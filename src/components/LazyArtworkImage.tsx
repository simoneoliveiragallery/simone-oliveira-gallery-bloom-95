import { useState, useRef, useEffect } from 'react';
import { useArtworkImage } from '../hooks/useArtworks';

interface LazyArtworkImageProps {
  artworkId: string;
  title: string;
  className?: string;
}

const LazyArtworkImage = ({ artworkId, title, className = "" }: LazyArtworkImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  const { data: imageUrl, isLoading } = useArtworkImage(isInView ? artworkId : '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isInView || isLoading ? (
        <div className="w-full h-full bg-gentle-green/10 animate-pulse flex items-center justify-center">
          <div className="text-deep-black/50 font-helvetica text-sm">
            Carregando...
          </div>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-auto object-contain transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <div className="w-full h-full bg-gentle-green/10 flex items-center justify-center">
          <div className="text-deep-black/50 font-helvetica text-sm">
            Erro ao carregar
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyArtworkImage;