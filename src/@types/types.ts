interface BookCategory {
  id: number;
  name: string;
}

interface BookGenre {
  id: number;
  name: string;
}

interface BookPhoto {
  id: number;
  image: string;
}

export interface BookListing {
  id: number;
  title: string;
  description: string;
  price: string;
  created_at: string;
  location: string | null;
  user: number;
  category: BookCategory;
  genre: BookGenre;
  photo_detail: BookPhoto;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  birth_date: string | null;
  city: string | null;
  region: string | null;
}

export interface UserBooksListing {
  user: UserProfile;
  listings: BookListing[];
}
