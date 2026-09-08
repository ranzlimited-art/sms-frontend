export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export const REDIRECT_MAP: Record<string, string> = {
  'school_admin.dashboard': '/school-admin/dashboard',
  'parent.dashboard': '/parent-portal/dashboard',
  dashboard: '/dashboard',
};

export const PRIMARY = '#1a6fba';

// TODO: replace with real photography of the institution / campus.
export const CAROUSEL_IMAGES: { src: string; caption: string }[] = [
  {
    src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1400&auto=format&fit=crop',
    caption: 'Building futures, one classroom at a time.',
  },
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop',
    caption: 'Every child, tracked, supported, and known.',
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop',
    caption: 'From attendance to results, all in one place.',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop',
    caption: 'Keeping parents close to the classroom.',
  },
];

export const CAROUSEL_INTERVAL_MS = 5500;