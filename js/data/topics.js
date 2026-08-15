// Writing topics dataset with Goal & Level Personalization
export const WRITING_TOPICS = [
  // --- Business & Workplace ---
  {
    id: "w_biz_1",
    goal: "business",
    level: "B1",
    category: "Công việc & Kinh doanh (Business & Tech)",
    title: "Lợi ích và thách thức của mô hình làm việc từ xa (Remote Work).",
    prompt: "Remote and hybrid work arrangements have become standard in many tech companies. Discuss the key benefits for employees versus the operational challenges for managers.",
    suggestedVocab: ["flexibility", "collaboration", "burnout", "productivity", "work-life balance"],
    targetWordCount: 160
  },
  {
    id: "w_biz_2",
    goal: "business",
    level: "B2",
    category: "Công nghệ & Đổi mới (Tech & Innovation)",
    title: "Ứng dụng Trí tuệ Nhân tạo (AI) để tối ưu hóa hiệu suất doanh nghiệp.",
    prompt: "How can modern enterprises leverage Generative AI tools to streamline workflows without compromising data privacy or the quality of human customer service?",
    suggestedVocab: ["leverage", "streamline", "automation", "ethical concerns", "competitive edge"],
    targetWordCount: 200
  },
  {
    id: "w_biz_3",
    goal: "business",
    level: "A2",
    category: "Giao tiếp công sở (Workplace Communication)",
    title: "Viết email thông báo dời lịch họp tới các đồng nghiệp.",
    prompt: "Write a professional email to your team explaining why today's project sprint meeting must be postponed to tomorrow morning.",
    suggestedVocab: ["postpone", "reschedule", "apologize for the inconvenience", "agenda", "confirmation"],
    targetWordCount: 100
  },

  // --- IELTS / Academic ---
  {
    id: "w_ielts_1",
    goal: "ielts",
    level: "B2",
    category: "IELTS Task 2: Environment & Sustainable Energy",
    title: "Chính phủ nên đầu tư vào năng lượng tái tạo thay vì nhiên liệu hóa thạch?",
    prompt: "Some people argue that governments should heavily subsidize renewable energy technologies. To what extent do you agree or disagree? Give reasons and examples.",
    suggestedVocab: ["subsidize", "renewable energy", "fossil fuels", "mitigate", "carbon footprint"],
    targetWordCount: 250
  },
  {
    id: "w_ielts_2",
    goal: "ielts",
    level: "C1",
    category: "IELTS Task 2: Society & Urbanization",
    title: "Tác động của đô thị hóa nhanh chóng đối với chất lượng cuộc sống người dân.",
    prompt: "Rapid urbanization has led to overcrowding and increased housing costs in major cities worldwide. Discuss the causes of this trend and propose viable solutions.",
    suggestedVocab: ["urbanization", "infrastructure", "affordable housing", "congestion", "sustainable development"],
    targetWordCount: 260
  },
  {
    id: "w_ielts_3",
    goal: "ielts",
    level: "B1",
    category: "IELTS Task 2: Education & Technology",
    title: "Học trực tuyến có thể thay thế hoàn toàn trường học truyền thống không?",
    prompt: "Online education has grown tremendously. Do you think physical classrooms will become obsolete in the future? Explain your viewpoint.",
    suggestedVocab: ["virtual classroom", "interaction", "obsolete", "discipline", "hands-on experience"],
    targetWordCount: 220
  },

  // --- Daily Communication ---
  {
    id: "w_comm_1",
    goal: "communication",
    level: "A2",
    category: "Đời sống hàng ngày (Daily Life)",
    title: "Mô tả một ngày nghỉ cuối tuần lý tưởng để nạp lại năng lượng của bạn.",
    prompt: "Describe how you prefer to spend a relaxing Sunday. What activities help you feel refreshed and ready for a new week?",
    suggestedVocab: ["unwind", "refreshing", "recharge", "leisure", "hobbies"],
    targetWordCount: 130
  },
  {
    id: "w_comm_2",
    goal: "communication",
    level: "B1",
    category: "Phát triển cá nhân (Personal Growth)",
    title: "Thói quen đọc sách và ảnh hưởng của nó đến tư duy của bạn.",
    prompt: "Do you read books regularly? Discuss how reading books has shaped your perspective or helped you learn new skills.",
    suggestedVocab: ["broaden horizons", "perspective", "habit", "insightful", "critical thinking"],
    targetWordCount: 160
  },

  // --- Study Abroad & Travel ---
  {
    id: "w_abroad_1",
    goal: "study_abroad",
    level: "B1",
    category: "Du học & Đời sống (Study Abroad)",
    title: "Những thách thức khi sống tự lập ở một đất nước xa lạ và cách vượt qua.",
    prompt: "Living in a foreign country requires strong adaptability. What are the biggest challenges international students face regarding culture and loneliness?",
    suggestedVocab: ["adaptability", "culture shock", "homesick", "independent", "resilience"],
    targetWordCount: 170
  },
  {
    id: "w_travel_1",
    goal: "travel",
    level: "A2",
    category: "Du lịch & Trải nghiệm (Travel)",
    title: "Địa điểm du lịch yêu thích nhất bạn từng đến.",
    prompt: "Write about a city or scenic spot you visited in the past. What made the scenery, local food, or people unforgettable to you?",
    suggestedVocab: ["scenic", "breathtaking", "hospitable", "specialty", "memorable"],
    targetWordCount: 140
  }
];

export function getRandomTopic(userGoals, userLevel) {
  let filtered = WRITING_TOPICS;

  if (userGoals) {
    const goalsList = Array.isArray(userGoals) ? userGoals : [userGoals];
    if (goalsList.length > 0) {
      const byGoal = WRITING_TOPICS.filter(t => goalsList.includes(t.goal));
      if (byGoal.length > 0) filtered = byGoal;
    }
  }

  if (userLevel) {
    const byLevel = filtered.filter(t => t.level === userLevel);
    if (byLevel.length > 0) filtered = byLevel;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
