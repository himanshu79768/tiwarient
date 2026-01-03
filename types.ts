
export type Page = 'Home' | 'About' | 'Experiences' | 'Contact' | 'Gallery';

export interface GalleryImage {
  id: string;
  src: string; 
  alt: string; 
  description: string;
  category: string;
}