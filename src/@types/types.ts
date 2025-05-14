// Категория книги
interface BookCategory {
  id: number;
  name: string;
}

// Жанр книги
interface BookGenre {
  id: number;
  name: string;
}

// Фото книги
interface BookPhoto {
  id: number;
  image: string; // путь к изображению
}

// Объявление книги
export interface BookListing {
  id: number;
  title: string;
  description: string;
  price: string; // можно преобразовать в number, если нужно
  created_at: string;
  location: string | null;
  user: number; // ID пользователя
  category: BookCategory;
  genre: BookGenre;
  photo_detail: BookPhoto;
}

// Пользователь
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

// Общий интерфейс ответа
export interface UserBooksListing {
  user: UserProfile;
  listings: BookListing[];
}
