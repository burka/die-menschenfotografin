import { useState, useEffect, useRef } from "react";

// Mock data
const CATEGORIES = [
  {
    id: "portraits",
    title: "Portraits",
    layers: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
    ],
    images: Array.from({ length: 24 }, (_, i) => ({
      id: `portrait-${i}`,
      src: `https://images.unsplash.com/photo-${1494790108377 + i * 100}?w=400&h=600&fit=crop&q=80`,
      width: 400,
      height: 600,
    })),
  },
  {
    id: "couples",
    title: "Paare",
    layers: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?w=800&q=80",
    ],
    images: Array.from({ length: 24 }, (_, i) => ({
      id: `couple-${i}`,
      src: `https://images.unsplash.com/photo-${1516589178581 + i * 100}?w=400&h=600&fit=crop&q=80`,
      width: 400,
      height: 600,
    })),
  },
  {
    id: "families",
    title: "Familien",
    layers: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    ],
    images: Array.from({ length: 24 }, (_, i) => ({
      id: `family-${i}`,
      src: `https://images.unsplash.com/photo-${1511895426328 + i * 100}?w=400&h=600&fit=crop&q=80`,
      width: 400,
      height: 600,
    })),
  },
  {
    id: "children",
    title: "Kinder",
    layers: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e8?w=800&q=80",
    ],
    images: Array.from({ length: 24 }, (_, i) => ({
      id: `child-${i}`,
      src: `https://images.unsplash.com/photo-${1503454537195 + i * 100}?w=400&h=600&fit=crop&q=80`,
      width: 400,
      height: 600,
    })),
  },
];

// Lightbox Component
function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "ArrowLeft":
          onPrev();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const currentImage = images[currentIndex];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(20px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <button
        style={{
          position: "fixed",
          top: "2rem",
          right: "2rem",
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "2.5rem",
          cursor: "pointer",
          zIndex: 1001,
          opacity: 0.7,
        }}
        onClick={onClose}
      >
        ✕
      </button>

      <div
        style={{
          position: "fixed",
          top: "2rem",
          left: "2rem",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "1rem",
          letterSpacing: "0.1em",
          zIndex: 1001,
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <img
          key={currentImage.id}
          src={currentImage.src}
          alt={`Image ${currentIndex + 1}`}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            animation: "zoomInImage 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      <button
        style={{
          position: "fixed",
          top: "50%",
          left: "2rem",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.1)",
          border: "none",
          color: "#fff",
          fontSize: "3rem",
          cursor: "pointer",
          padding: "2rem 1.5rem",
          opacity: 0.5,
          backdropFilter: "blur(10px)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
      >
        ‹
      </button>

      <button
        style={{
          position: "fixed",
          top: "50%",
          right: "2rem",
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.1)",
          border: "none",
          color: "#fff",
          fontSize: "3rem",
          cursor: "pointer",
          padding: "2rem 1.5rem",
          opacity: 0.5,
          backdropFilter: "blur(10px)",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      >
        ›
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomInImage {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// Masonry Gallery Component
function MasonryGallery({ category, onBack, onImageClick }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  useEffect(() => {
    setTimeout(() => setIsAnimating(false), 100);
  }, []);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => new Set([...prev, id]));
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(onBack, 600);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        animation: isAnimating
          ? "zoomIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "zoomOut 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
        }}
      >
        <button
          style={{
            background: "none",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
            borderRadius: "2px",
          }}
          onClick={handleBack}
        >
          ← Zurück
        </button>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 300,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.9,
            margin: 0,
          }}
        >
          {category.title}
        </h1>
      </header>

      <div
        style={{
          padding: "8rem 2rem 4rem",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            columnCount:
              window.innerWidth > 1400
                ? 4
                : window.innerWidth > 1024
                  ? 3
                  : window.innerWidth > 640
                    ? 2
                    : 1,
            columnGap: "1.5rem",
          }}
        >
          {category.images.map((image, index) => (
            <div
              key={image.id}
              style={{
                breakInside: "avoid",
                marginBottom: "1.5rem",
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "4px",
                opacity: 0,
                transform: "translateZ(100px) scale(0.8)",
                animation: `flyIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards ${index * 30}ms`,
              }}
              onClick={() => onImageClick(index)}
            >
              <img
                src={image.src}
                alt={`${category.title} ${index + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes zoomOut {
          from { transform: scale(3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(3); opacity: 0; }
        }
        @keyframes flyIn {
          to { opacity: 1; transform: translateZ(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// Parallax Hero Component
function ParallaxHero({ categories, onSelectCategory }) {
  const [scrollY, setScrollY] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setScrollY(scrollTop);
        const viewportHeight = window.innerHeight;
        const categoryIndex = Math.round(scrollTop / viewportHeight);
        setCurrentCategory(Math.min(categoryIndex, categories.length - 1));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [categories.length]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.9rem",
          letterSpacing: "0.1em",
          animation: "bounce 2s infinite",
          pointerEvents: "none",
        }}
      >
        Scroll ↓
      </div>

      {categories.map((category, index) => {
        const offset = index * window.innerHeight;
        const relativeScroll = scrollY - offset;
        const isActive = currentCategory === index;

        return (
          <div
            key={category.id}
            style={{
              width: "100%",
              height: "100vh",
              position: "relative",
              scrollSnapAlign: "start",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => onSelectCategory(category)}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {/* Background layer */}
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  left: 0,
                  width: "100%",
                  height: "120%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${category.layers[0]})`,
                  filter: "blur(3px) brightness(0.4)",
                  transform: `translateY(${relativeScroll * 0.3}px)`,
                  willChange: "transform",
                }}
              />

              {/* Mid layer */}
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  left: 0,
                  width: "100%",
                  height: "120%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${category.layers[1]})`,
                  filter: "blur(1px) brightness(0.6)",
                  opacity: 0.8,
                  transform: `translateY(${relativeScroll * 0.6}px)`,
                  willChange: "transform",
                }}
              />

              {/* Front layer */}
              <div
                style={{
                  position: "absolute",
                  top: "-10%",
                  left: 0,
                  width: "100%",
                  height: "120%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${category.layers[2]})`,
                  filter: "brightness(0.7)",
                  opacity: 0.7,
                  transform: `translateY(${relativeScroll * 0.9}px)`,
                  willChange: "transform",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                background: "rgba(0, 0, 0, 0.2)",
                transition: "background 0.3s ease",
              }}
            >
              <h2
                style={{
                  fontSize: "4rem",
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  opacity: isActive ? 1 : 0.9,
                  textShadow: "2px 2px 20px rgba(0, 0, 0, 0.8)",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                {category.title}
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                  padding: "0.75rem 2rem",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  borderRadius: "2px",
                }}
                className="cta"
              >
                Galerie ansehen
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        .parallax-hero > div:hover .cta {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}

// Main App
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setLightboxIndex(null);
  };

  const handleImageClick = (index) => {
    setLightboxIndex(index);
  };

  const handleLightboxClose = () => {
    setLightboxIndex(null);
  };

  const handleLightboxNav = (direction) => {
    if (!selectedCategory) return;
    const total = selectedCategory.images.length;
    setLightboxIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % total;
      }
      return (prev - 1 + total) % total;
    });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
      }}
    >
      {!selectedCategory ? (
        <ParallaxHero
          categories={CATEGORIES}
          onSelectCategory={handleCategorySelect}
        />
      ) : (
        <MasonryGallery
          category={selectedCategory}
          onBack={handleBack}
          onImageClick={handleImageClick}
        />
      )}

      {lightboxIndex !== null && selectedCategory && (
        <Lightbox
          images={selectedCategory.images}
          currentIndex={lightboxIndex}
          onClose={handleLightboxClose}
          onNext={() => handleLightboxNav("next")}
          onPrev={() => handleLightboxNav("prev")}
        />
      )}
    </div>
  );
}
