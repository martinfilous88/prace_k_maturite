export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  price: number;
  image_url?: string;
  imageUrl: string;
  shortDescription: string;
  ageRating: number;
  type?: string;
}

export interface UserProgress {
  level: number;
  progress: number;
}

export interface CartItem {
  game: Game;
  quantity: number;
}