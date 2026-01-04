

export type Page = 'Home' | 'About' | 'Experiences' | 'Contact' | 'Gallery';

export interface GalleryImage {
  id: string;
  src: string; 
  alt: string; 
  description: string;
  category: string;
}

export interface ViewershipRecord {
    id: string;
    firstVisit: string;
    lastVisit: string;
    sessionCount: number;
    deviceInfo: string;
    isDeveloper: boolean;
}
