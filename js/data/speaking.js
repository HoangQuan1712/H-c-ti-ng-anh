// Daily 5 Speaking Patterns & Usage Challenge Dataset
export const SPEAKING_PATTERNS = [
  // Set 1
  [
    {
      id: "sp1_1",
      pattern: "To put it another way,...",
      meaning: "Nói cách khác là... (dùng khi muốn giải thích lại ý kiến rõ ràng hơn)",
      phonetic: "/tə pʊt ɪt əˈnʌðər weɪ/",
      example: "We don't have enough budget. To put it another way, we need to cut costs.",
      situations: "Giao tiếp công việc, thảo luận nhóm, giải thích ý tưởng."
    },
    {
      id: "sp1_2",
      pattern: "I'm on the fence about...",
      meaning: "Tôi vẫn còn phân vân / chưa quyết định về...",
      phonetic: "/aɪm ɒn ðə fens əˈbaʊt/",
      example: "I'm on the fence about buying a new laptop this month.",
      situations: "Khi ai đó hỏi ý kiến hoặc đưa ra lựa chọn."
    },
    {
      id: "sp1_3",
      pattern: "It goes without saying that...",
      meaning: "Hiển nhiên là... / Không cần phải nói thì...",
      phonetic: "/ɪt ɡəʊz wɪðˈaʊt ˈseɪɪŋ ðæt/",
      example: "It goes without saying that practice makes perfect.",
      situations: "Nhấn mạnh một sự thật rõ ràng mà ai cũng đồng ý."
    },
    {
      id: "sp1_4",
      pattern: "From my perspective,...",
      meaning: "Theo góc nhìn của tôi / Theo tôi thì...",
      phonetic: "/frəm maɪ pəˈspektɪv/",
      example: "From my perspective, this new policy will benefit everyone.",
      situations: "Trình bày quan điểm cá nhân một cách lịch sự, chuyên nghiệp."
    },
    {
      id: "sp1_5",
      pattern: "Let's call it a day.",
      meaning: "Hôm nay làm đến đây thôi / Nghỉ tay thôi.",
      phonetic: "/lets kɔːl ɪt ə deɪ/",
      example: "We have worked for 8 hours straight. Let's call it a day!",
      situations: "Khi kết thúc cuộc họp, buổi học hoặc ca làm việc."
    }
  ],
  // Set 2
  [
    {
      id: "sp2_1",
      pattern: "As far as I'm concerned,...",
      meaning: "Theo những gì tôi biết / Theo quan điểm của tôi...",
      phonetic: "/əz fɑːr əz aɪm kənˈsɜːnd/",
      example: "As far as I'm concerned, health is more important than wealth.",
      situations: "Phát biểu ý kiến trong các cuộc đối thoại."
    },
    {
      id: "sp2_2",
      pattern: "I couldn't agree more.",
      meaning: "Tôi hoàn toàn đồng ý với bạn (không thể đồng ý hơn được nữa).",
      phonetic: "/aɪ ˈkʊdnt əˈɡriː mɔːr/",
      example: "Your point is totally valid. I couldn't agree more!",
      situations: "Tán thành quan điểm của ai đó."
    },
    {
      id: "sp2_3",
      pattern: "To make a long story short,...",
      meaning: "Tóm lại là... / Nói ngắn gọn là...",
      phonetic: "/tə meɪk ə lɒŋ ˈstɔːri ʃɔːt/",
      example: "To make a long story short, we missed the train and arrived late.",
      situations: "Khi tóm tắt một câu chuyện dài."
    },
    {
      id: "sp2_4",
      pattern: "I'd appreciate it if you could...",
      meaning: "Tôi rất biết ơn nếu bạn có thể...",
      phonetic: "/aɪd əˈpriːʃieɪt ɪt ɪf juː kʊd/",
      example: "I'd appreciate it if you could send me the file by 5 PM.",
      situations: "Yêu cầu sự giúp đỡ một cách rất lịch sự."
    },
    {
      id: "sp2_5",
      pattern: "That sounds like a plan!",
      meaning: "Nghe có vẻ là một kế hoạch hay đấy! / Chốt thế nhé!",
      phonetic: "/ðæt saʊndz laɪk ə plæn/",
      example: "We'll meet at 7 PM for dinner. — That sounds like a plan!",
      situations: "Đồng ý với một đề xuất hoặc hẹn hò."
    }
  ]
];

export function getDailySpeakingSet() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const setIndex = dayOfYear % SPEAKING_PATTERNS.length;
  return SPEAKING_PATTERNS[setIndex];
}
