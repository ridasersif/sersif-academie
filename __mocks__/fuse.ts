// Mock for fuse.js — used in SmartSearch component
const Fuse = jest.fn().mockImplementation((list: unknown[], _options: unknown) => ({
  search: jest.fn((query: string) => {
    if (!query || query.length < 2) return [];
    return (list as Array<{ title: string; keywords: string[]; id: string; category: string; url: string }>)
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.keywords?.some((k: string) => k.toLowerCase().includes(query.toLowerCase()))
      )
      .map((item) => ({ item, score: 0.1 }));
  }),
}));

export default Fuse;
