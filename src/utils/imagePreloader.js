import heroRectangle94 from '../assets/hero/Rectangle 94.png';
import heroRectangle95 from '../assets/hero/Rectangle 95.png';
import heroRectangle96 from '../assets/hero/Rectangle 96.png';
import heroRectangle97 from '../assets/hero/Rectangle 97.png';
import heroRectangle98 from '../assets/hero/Rectangle 98.png';
import heroRectangle99 from '../assets/hero/Rectangle 99.png';
import logoImage from '../assets/hero/DIGIMAAX_LOGO-01 1.png';
import ourStoryImage from '../assets/hero/our-story.png';
import customMugImage from '../assets/products/shop/Customized Mug.jpg';
import customClockImage from '../assets/products/shop/Customized Wall Clock.jpg';
import shirtImage from '../assets/products/shop/shirt.jpg';
import tshirtImage from '../assets/products/shop/tshit.jpg';
import interiorDesignImage from '../assets/products/services/Desi.jpg';
import cctvImage from '../assets/products/services/CCTVInstallation.jpg';
import printingImage from '../assets/products/services/PrintedModels.jpg';
import serverStorageImage from '../assets/products/services/Server Storage.jpg';

const allImages = [
  heroRectangle94,
  heroRectangle95,
  heroRectangle96,
  heroRectangle97,
  heroRectangle98,
  heroRectangle99,
  logoImage,
  ourStoryImage,
  customMugImage,
  customClockImage,
  shirtImage,
  tshirtImage,
  interiorDesignImage,
  cctvImage,
  printingImage,
  serverStorageImage,
];

export const preloadAllImages = () => {
  return new Promise((resolve, reject) => {
    const imagePromises = allImages.map((src) => {
      return new Promise((imgResolve, imgReject) => {
        if (!src) {
          imgResolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          imgResolve();
        };
        img.onerror = () => {
          imgResolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        resolve();
      });
  });
};

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
          loaded++;
          if (onProgress) onProgress(loaded, total);
          imgResolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        resolve();
      });
  });
};

export default { preloadAllImages, preloadAllImagesWithProgress };

