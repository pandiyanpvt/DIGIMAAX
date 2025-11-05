
import rectangle94 from '../assets/hero/header-slider/Rectangle 94.png';
import rectangle95 from '../assets/hero/header-slider/Rectangle 95.png';
import rectangle96 from '../assets/hero/header-slider/Rectangle 96.png';
import rectangle97 from '../assets/hero/header-slider/Rectangle 97.png';
import rectangle98 from '../assets/hero/header-slider/Rectangle 98.png';
import rectangle99 from '../assets/hero/header-slider/Rectangle 99.png';

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

// Gallery images
import gallery1 from '../assets/products/Gellary/2bae113f6e9839dd87fee0c9c3d2326f7aaf74c7.jpg';
import gallery2 from '../assets/products/Gellary/7ad6bc835097a5e543f9b4d8e92f2c86dd0fc1dc.jpg';
import gallery3 from '../assets/products/Gellary/b8e63afc60119e2b7f569522e7f62dfde200e4a6.jpg';
import gallery4 from '../assets/products/Gellary/Rectangle 10.png';
import gallery5 from '../assets/products/Gellary/Rectangle 11.png';
import gallery6 from '../assets/products/Gellary/Rectangle 12.png';
import gallery7 from '../assets/products/Gellary/Rectangle 13.png';
import gallery8 from '../assets/products/Gellary/Rectangle 14.png';
import gallery9 from '../assets/products/Gellary/Rectangle 15.png';
import gallery10 from '../assets/products/Gellary/Rectangle 16.png';
import gallery11 from '../assets/products/Gellary/Rectangle 17.png';
import gallery12 from '../assets/products/Gellary/Rectangle 18.png';
import gallery13 from '../assets/products/Gellary/Rectangle 19.png';
import gallery14 from '../assets/products/Gellary/Rectangle 20.png';

// Collect all images in an array
const allImages = [
  // Header slider images
  rectangle94,
  rectangle95,
  rectangle96,
  rectangle97,
  rectangle98,
  rectangle99,
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
  // Gallery
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
  gallery11,
  gallery12,
  gallery13,
  gallery14,
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

