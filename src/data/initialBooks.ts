import { Book, PromoBanner } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    rating: 5,
    status: 'read',
    review: 'An absolute masterpiece of gothic Barcelona mystery and bibliophilic romance. Finding the Cemetery of Forgotten Books captured my heart from page one. The prose is atmospheric, melancholic, and deeply evocative.',
    date: '2026-02-14',
    genre: 'Gothic Fiction / Mystery',
    pages: 487,
    favoriteQuote: 'Every book has a soul. The soul of the person who wrote it and of those who read it and lived and dreamed with it.'
  },
  {
    id: 'book-2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    rating: 4,
    status: 'read',
    review: 'A tender, philosophical exploration of love, consciousness, and what it truly means to be human through the gentle gaze of an Artificial Friend. Quietly heartbreaking and understated in the most Ishiguro way.',
    date: '2026-01-28',
    genre: 'Literary Sci-Fi',
    pages: 303,
    favoriteQuote: 'Do you believe in the human heart? I do not mean simply the organ, obviously. Do you think there is such a thing? Something that makes each of us special and individual?'
  },
  {
    id: 'book-3',
    title: 'A Gentleman in Moscow',
    author: 'Amor Towles',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop',
    rating: 5,
    status: 'read',
    review: 'Count Alexander Rostov\'s house arrest at the Hotel Metropol is one of the most delightful literary journeys I have ever undertaken. Towles masterfully balances aristocratic wit with profound resilience.',
    date: '2026-01-05',
    genre: 'Historical Fiction',
    pages: 462,
    favoriteQuote: 'If a man does not master his circumstances then he is bound to be mastered by them.'
  },
  {
    id: 'book-4',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?q=80&w=800&auto=format&fit=crop',
    rating: 4,
    status: 'reading',
    review: 'Currently midway through chapter seven. The friendship between Sam and Sadie is so layered, messy, and authentic. Captures the intoxicating rush of collaborative game design and mutual devotion brilliantly.',
    date: '2026-03-01',
    genre: 'Contemporary Fiction',
    pages: 416,
    favoriteQuote: 'To allow yourself to play with another person is no small risk. It means allowing yourself to be open, to be exposed.'
  },
  {
    id: 'book-5',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop',
    rating: 5,
    status: 'read',
    review: 'Hypnotic, labyrinthine, and filled with quiet wonder. The House with its endless marble halls, statues, and crashing ocean tides is unforgettable. Piranesi\'s gentle innocence is a balm for the spirit.',
    date: '2025-12-18',
    genre: 'Fantasy / Philosophical',
    pages: 245,
    favoriteQuote: 'The Beauty of the House is immeasurable; its Kindness infinite.'
  },
  {
    id: 'book-6',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    rating: 5,
    status: 'read',
    review: 'Unbelievably entertaining hard sci-fi. The unlikely bond between Ryland Grace and Rocky had me cheering aloud in my reading chair. Fist my bump! Genuine science puzzle solving at its finest.',
    date: '2025-11-20',
    genre: 'Hard Science Fiction',
    pages: 496,
    favoriteQuote: 'Human beings have a remarkable ability to accept the abnormal and make it normal.'
  },
  {
    id: 'book-7',
    title: 'The Secret History',
    author: 'Donna Tartt',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop',
    rating: 5,
    status: 'reading',
    review: 'Re-reading for the rainy season. The dark academia gold standard. Tartt weaves obsession, ancient Greek aesthetics, and dread with unmatched precision and poetic menace.',
    date: '2026-03-04',
    genre: 'Dark Academia / Literary Noir',
    pages: 559,
    favoriteQuote: 'Beauty is terror. Whatever we call beautiful, we quiver before it.'
  },
  {
    id: 'book-8',
    title: 'Babel: An Arcane History',
    author: 'R.F. Kuang',
    coverUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop',
    rating: 3,
    status: 'want-to-read',
    review: 'Recommended by two close literary friends. Looking forward to diving into the silver-working linguistic magic system and historical exploration of colonial Oxford.',
    date: '2026-03-05',
    genre: 'Historical Fantasy',
    pages: 544,
    favoriteQuote: 'Translation means doing violence upon the original.'
  }
];

export const INITIAL_BANNER: PromoBanner = {
  enabled: true,
  imageUrl: 'https://images.unsplash.com/photo-1507842229451-79b1be886a20?q=80&w=1200&auto=format&fit=crop',
  badgeText: 'Curator’s Note • Seasonal Dispatch',
  title: 'The Blue Archive Literary Society',
  description: 'A quiet corner dedicated to slow reading, thoughtful margin notes, and rediscovering forgotten classics.',
  ctaText: 'Explore Collection',
  ctaLink: '#bookshelf'
};
