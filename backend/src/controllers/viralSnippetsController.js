export const getViralSnippets = async (req, res) => {
  // bisa pakai req.body/req.query untuk filter: platform, product, audience, dll
  const now = new Date().toISOString();

  // mock data dulu 
  const items = [
    {
      id: "1",
      source: "tiktok",
      authorHandle: "@autovibe_id",
      title: 'POV: You just switched to EV and realized how much you sa...',
      thumbUrl: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
      likes: 12400,
      comments: 842,
      shares: 3100,
    },
    {
      id: "2",
      source: "instagram",
      authorHandle: "@daily_driver",
      title: "The interior lighting in the new Haka model is literally out of th...",
      thumbUrl: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
      likes: 8900,
      comments: 320,
      shares: 1200,
    },
    {
      id: "3",
      source: "news",
      authorHandle: "Tech Today",
      title: "Haka Auto announces new infrastructure expansion for E...",
      thumbUrl: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
      likes: 2100,
      comments: 342,
      shares: 512,
    },
    {
      id: "4",
      source: "youtube",
      authorHandle: "CarExpert",
      title: "0 to 100 in 3 seconds? Haka's new flagship model is insane....",
      thumbUrl: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
      likes: 45000,
      comments: 9100,
      shares: 18000,
    },
  ];

  res.json({ updatedAt: now, items });
};
