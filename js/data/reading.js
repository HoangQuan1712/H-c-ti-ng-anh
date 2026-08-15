// Reading articles dataset for Daily Reading & AI Discussion
export const READING_ARTICLES = [
  {
    id: "r1",
    title: "Why Continuous Learning is the Superpower of the 21st Century",
    category: "Phát triển bản thân (Self Improvement)",
    readTime: "4 min read",
    content: `In an era defined by rapid technological advancements and changing job markets, the concept of lifelong learning has transitioned from a noble ideal to an absolute necessity. 

The traditional model of education—where one learns a skill in youth and applies it for forty years—is no longer sustainable. Skills now have a shorter shelf-life than ever before. To thrive, individuals must cultivate 'learnability': the desire and capability to continuously absorb new knowledge and adapt to shifting environments.

Psychologists note that adopting a growth mindset is key. When you view challenges as opportunities to expand your abilities rather than threats to your competence, learning becomes an exciting journey of discovery.

Furthermore, continuous learning keeps the human mind agile and resilient. Whether it is mastering a foreign language, picking up coding, or diving into history, active cognitive engagement strengthens neural connections and fosters creativity. In essence, the future belongs to those who never stop asking questions.`,
    vocabulary: [
      { word: "sustainable", pos: "adj", meaning: "có thể duy trì lâu dài, bền vững", phonetic: "/səˈsteɪnəbl/" },
      { word: "cultivate", pos: "v", meaning: "trau dồi, nuôi dưỡng", phonetic: "/ˈkʌltɪveɪt/" },
      { word: "growth mindset", pos: "n", meaning: "tư duy phát triển", phonetic: "/ɡroʊθ ˈmaɪndset/" },
      { word: "agile", pos: "adj", meaning: "nhanh nhạy, linh hoạt", phonetic: "/ˈædʒaɪl/" },
      { word: "resilient", pos: "adj", meaning: "kiên cường, có khả năng phục hồi", phonetic: "/rɪˈzɪliənt/" }
    ],
    discussionStarter: "What is one new skill or topic you have learned recently outside of work or school, and how has it influenced your daily thinking?"
  },
  {
    id: "r2",
    title: "The Art of Slow Living: Reclaiming Calm in a Fast-Paced World",
    category: "Lối sống (Lifestyle)",
    readTime: "3 min read",
    content: `Modern society often equates busyness with success. We wear our packed schedules like badges of honor, constantly rushing from one commitment to another. However, a growing global movement known as 'Slow Living' invites us to step back and re-evaluate our pace.

Slow living does not mean performing everything at a snail's speed. Rather, it emphasizes intentionality—doing things with mindfulness and care rather than mindless speed. It encourages quality over quantity, whether in the meals we eat, the relationships we nurture, or the hobbies we pursue.

By embracing intentional pauses throughout our day, we allow our minds to decompress. Simple acts like savoring a morning coffee without checking email or taking a quiet stroll in nature can significantly reduce chronic stress and restore emotional equilibrium.`,
    vocabulary: [
      { word: "equate", pos: "v", meaning: "đánh đồng, xem như ngang nhau", phonetic: "/ɪˈkweɪt/" },
      { word: "intentionality", pos: "n", meaning: "sự chủ động, có ý định rõ ràng", phonetic: "/ɪnˌtenʃəˈnæləti/" },
      { word: "decompress", pos: "v", meaning: "thả lỏng, giải tỏa căng thẳng", phonetic: "/ˌdiːkəmˈpres/" },
      { word: "equilibrium", pos: "n", meaning: "trạng thái cân bằng", phonetic: "/ˌiːkwɪˈlɪbriəm/" }
    ],
    discussionStarter: "Do you feel that modern life moves too fast? What daily ritual helps you slow down and find peace?"
  },
  {
    id: "r3",
    title: "How Remote Work is Reshaping Urban Communities",
    category: "Kinh tế & Xã hội (Sociology)",
    readTime: "4 min read",
    content: `The widespread adoption of flexible and remote work arrangements has initiated a profound geographic shift. For decades, ambitious professionals flocked to major metropolitan centers to secure high-paying jobs. Today, location-independent work allows employees to trade tiny downtown apartments for spacious suburban homes or tranquil coastal towns.

This decentralization is breathing new life into smaller regional communities. Local businesses, cafes, and co-working spaces in secondary cities are experiencing an economic renaissance.

However, challenges remain. Some smaller towns face rising housing costs as affluent remote workers move in, creating tension with long-time residents. Navigating these socioeconomic transformations will require thoughtful urban planning and community dialogue.`,
    vocabulary: [
      { word: "flock", pos: "v", meaning: "tụ tập, đổ xô về", phonetic: "/flɑːk/" },
      { word: "decentralization", pos: "n", meaning: "sự phi tập trung hóa", phonetic: "/diːˌsentrələˈzeɪʃn/" },
      { word: "renaissance", pos: "n", meaning: "sự phục hưng, hồi sinh", phonetic: "/ˈrenəsɑːns/" },
      { word: "affluent", pos: "adj", meaning: "giàu có, khá giả", phonetic: "/ˈæfluənt/" }
    ],
    discussionStarter: "Would you prefer working remotely from a quiet town or working in a bustling city office? Share your reasoning."
  }
];

export function getRandomReadingArticle() {
  const randomIndex = Math.floor(Math.random() * READING_ARTICLES.length);
  return READING_ARTICLES[randomIndex];
}
