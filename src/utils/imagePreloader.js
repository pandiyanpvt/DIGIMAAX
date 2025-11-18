
// Hero section images (legacy - used in ServicesSection)
import heroRectangle94 from '../assets/hero/Rectangle 94.png';
import heroRectangle95 from '../assets/hero/Rectangle 95.png';
import heroRectangle96 from '../assets/hero/Rectangle 96.png';
import heroRectangle97 from '../assets/hero/Rectangle 97.png';
import heroRectangle98 from '../assets/hero/Rectangle 98.png';
import heroRectangle99 from '../assets/hero/Rectangle 99.png';

// Logo
import logoImage from '../assets/hero/DIGIMAAX_LOGO-01 1.png';

// About section
import ourStoryImage from '../assets/hero/our-story.png';

// Shop products
import customMugImage from '../assets/products/shop/Customized Mug.jpg';
import customClockImage from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImage from '../assets/products/shop/shirt.jpg';
import tshirtImage from '../assets/products/shop/tshit.jpg';

// Services
import interiorDesignImage from '../assets/products/services/Desi.jpg';
import cctvImage from '../assets/products/services/CCTVInstallation.jpg';
import printingImage from '../assets/products/services/PrintedModels.jpg';
import serverStorageImage from '../assets/products/services/Server Storage.jpg';

// Collect all images in an array
const allImages = [
  // Hero section images (ServicesSection)
  heroRectangle94,
  heroRectangle95,
  heroRectangle96,
  heroRectangle97,
  heroRectangle98,
  heroRectangle99,
  // Logo
  logoImage,
  // About section
  ourStoryImage,
  // Shop products
  customMugImage,
  customClockImage,
  shirtImage,
  tshirtImage,
  // Services
  interiorDesignImage,
  cctvImage,
  printingImage,
  serverStorageImage,
];

/**
 * Preloads all images by creating Image objects and setting their src
 * This ensures images are cached in the browser before they're needed
 * @returns {Promise} Resolves when all images are loaded
 */
export const preloadAllImages = () => {
  return new Promise((resolve, reject) => {
    const imagePromises = allImages.map((src) => {
      return new Promise((imgResolve, imgReject) => {
        // Skip if src is null or undefined
        if (!src) {
          imgResolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          imgResolve();
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          imgResolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        console.log(`✅ Preloaded ${allImages.length} images`);
        resolve();
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        resolve();
      });
  });
};

/**
 * Preloads images with a loading indicator callback
 * @param {Function} onProgress - Callback function called with (loaded, total) as images load
 * @returns {Promise} Resolves when all images are loaded
 */
export const preloadAllImagesWithProgress = (onProgress) => {
  return new Promise((resolve, reject) => {
    let loaded = 0;
    const total = allImages.length;

    const imagePromises = allImages.map((src, index) => {
      return new Promise((imgResolve, imgReject) => {
        if (!src) {
          loaded++;
          if (onProgress) onProgress(loaded, total);
          imgResolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          loaded++;
          if (onProgress) onProgress(loaded, total);
          imgResolve();
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          loaded++;
          if (onProgress) onProgress(loaded, total);
          imgResolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        console.log(`✅ Preloaded ${total} images`);
        resolve();
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        resolve();
      });
  });
};

export default { preloadAllImages, preloadAllImagesWithProgress };

