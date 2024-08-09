import { MemeText } from './meme-text';

export interface Meme {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: MemeText[];
  createdAt: string;
}
