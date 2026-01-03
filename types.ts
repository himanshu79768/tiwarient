
export type Page = 'Home' | 'About' | 'Experiences' | 'Contact' | 'Gallery';

export interface GalleryImage {
  id: string;
  src: string; // Can be base64 data URL or Firebase Storage URL
  alt: string; // Title
  description: string;
  category: string;
}