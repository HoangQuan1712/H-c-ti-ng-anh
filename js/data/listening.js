// Listening practice database categorized by proficiency level
export const LISTENING_DATA = [
  {
    id: "l_b1",
    level: "beginner",
    levelLabel: "Sơ cấp (A1 - A2)",
    title: "Making Plans for the Weekend",
    topic: "Giao tiếp đời sống hàng ngày",
    duration: "2 min 15 sec",
    audioText: "Hi Alex! Are you doing anything special this weekend? Well, on Saturday morning, I am going to the local farmers market to buy fresh vegetables. In the afternoon, I plan to read a book in the park if the weather stays sunny. On Sunday, my family and I are having a small barbecue in our backyard. How about you? Do you have any exciting plans?",
    transcript: [
      { en: "Hi Alex! Are you doing anything special this weekend?", vi: "Chào Alex! Cuối tuần này bạn có kế hoạch gì đặc biệt không?" },
      { en: "Well, on Saturday morning, I am going to the local farmers market to buy fresh vegetables.", vi: "À, sáng thứ Bảy tôi sẽ đi chợ nông sản địa phương để mua rau củ tươi." },
      { en: "In the afternoon, I plan to read a book in the park if the weather stays sunny.", vi: "Vào buổi chiều, tôi định đọc sách ở công viên nếu trời tiếp tục nắng đẹp." },
      { en: "On Sunday, my family and I are having a small barbecue in our backyard.", vi: "Vào Chủ Nhật, gia đình tôi và tôi sẽ làm một buổi tiệc nướng nhỏ ngoài sân sau." },
      { en: "How about you? Do you have any exciting plans?", vi: "Còn bạn thì sao? Bạn có kế hoạch gì thú vị không?" }
    ],
    quiz: [
      {
        question: "Where is Alex going on Saturday morning?",
        options: ["To a shopping mall", "To a local farmers market", "To the cinema", "To a library"],
        correct: 1,
        explanation: "Alex says: 'on Saturday morning, I am going to the local farmers market'."
      },
      {
        question: "What will Alex do if the weather is sunny on Saturday afternoon?",
        options: ["Go swimming", "Read a book in the park", "Play football", "Stay at home"],
        correct: 1,
        explanation: "Alex plans to 'read a book in the park if the weather stays sunny'."
      },
      {
        question: "What activity is planned for Sunday?",
        options: ["A family barbecue", "A picnic near the river", "Cleaning the house", "Visiting grandparents"],
        correct: 0,
        explanation: "On Sunday, Alex and family are 'having a small barbecue in our backyard'."
      }
    ],
    reflectionPrompt: "Describe what you usually like to do on weekends. Do you prefer relaxing at home or going outside with friends?"
  },
  {
    id: "l_i1",
    level: "intermediate",
    levelLabel: "Trung cấp (B1 - B2)",
    title: "The Benefits of Digital Minimalism",
    topic: "Lối sống & Công nghệ số",
    duration: "3 min 10 sec",
    audioText: "In our hyper-connected world, we receive hundreds of notifications every day. Digital minimalism is a philosophy that helps you question what digital communication tools add the most value to your life. By clearing out unnecessary digital clutter, people often experience significantly lower stress levels, improved concentration, and deeper relationships with those around them. Reducing screen time before sleep also enhances overall sleep quality.",
    transcript: [
      { en: "In our hyper-connected world, we receive hundreds of notifications every day.", vi: "Trong thế giới kết nối dày đặc ngày nay, chúng ta nhận hàng trăm thông báo mỗi ngày." },
      { en: "Digital minimalism is a philosophy that helps you question what digital communication tools add the most value to your life.", vi: "Lối sống tối giản số là một triết lý giúp bạn đặt câu hỏi xem những công cụ công nghệ nào thực sự mang lại giá trị nhất cho cuộc sống của mình." },
      { en: "By clearing out unnecessary digital clutter, people often experience significantly lower stress levels, improved concentration, and deeper relationships with those around them.", vi: "Bằng cách dọn dẹp bớt sự lộn xộn kỹ thuật số không cần thiết, con người thường cảm thấy giảm bớt căng thẳng đáng kể, tăng khả năng tập trung và thắt chặt mối quan hệ với những người xung quanh." },
      { en: "Reducing screen time before sleep also enhances overall sleep quality.", vi: "Giảm thời gian nhìn vào màn hình trước khi ngủ cũng làm tăng chất lượng giấc ngủ tổng thể." }
    ],
    quiz: [
      {
        question: "What is the core idea of 'Digital Minimalism'?",
        options: [
          "Deleting all social media accounts permanently",
          "Evaluating which digital tools bring genuine value to your life",
          "Buying the newest smartphones every year",
          "Working without using any internet connection"
        ],
        correct: 1,
        explanation: "It is a philosophy that helps you question which tools add the most value."
      },
      {
        question: "Which benefit of reducing digital clutter is NOT mentioned?",
        options: ["Lower stress levels", "Improved concentration", "Deeper relationships", "Earning more money"],
        correct: 3,
        explanation: "Earning more money is not listed as a direct health/relational benefit."
      },
      {
        question: "How does reducing screen time before sleep help?",
        options: ["It saves battery", "It enhances overall sleep quality", "It speeds up internet connection", "It prevents dreams"],
        correct: 1,
        explanation: "The passage states: 'Reducing screen time before sleep also enhances overall sleep quality'."
      }
    ],
    reflectionPrompt: "How much time do you spend on your phone daily? What digital habit would you like to reduce or change?"
  },
  {
    id: "l_a1",
    level: "advanced",
    levelLabel: "Nâng cao (C1 - C2)",
    title: "The Psychology of Habits and Behavioral Plasticity",
    topic: "Tâm lý học & Phát triển bản thân",
    duration: "4 min 05 sec",
    audioText: "Neuroscience reveals that our brains rely on automatic loops composed of a cue, a routine, and a reward to conserve energy. This process, known as chunking, allows us to perform complex actions without conscious deliberation. However, altering deeply ingrained habits requires conscious intervention. By identifying the underlying trigger and substituting the routine with a healthier alternative while maintaining the same reward, individuals can effectively rewire their neural pathways over time.",
    transcript: [
      { en: "Neuroscience reveals that our brains rely on automatic loops composed of a cue, a routine, and a reward to conserve energy.", vi: "Khoa học thần kinh tiết lộ rằng bộ não của chúng ta dựa vào các vòng lặp tự động gồm: tín hiệu (cue), thói quen (routine), và phần thưởng (reward) để tiết kiệm năng lượng." },
      { en: "This process, known as chunking, allows us to perform complex actions without conscious deliberation.", vi: "Quá trình này, được gọi là 'chunking', cho phép chúng ta thực hiện các hành động phức tạp mà không cần cân nhắc ý thức." },
      { en: "However, altering deeply ingrained habits requires conscious intervention.", vi: "Tuy nhiên, việc thay đổi các thói quen đã ăn sâu vào tiềm thức đòi hỏi sự can thiệp có ý thức." },
      { en: "By identifying the underlying trigger and substituting the routine with a healthier alternative while maintaining the same reward, individuals can effectively rewire their neural pathways over time.", vi: "Bằng cách xác định tác nhân kích thích gốc và thay thế thói quen bằng lựa chọn lành mạnh hơn trong khi giữ nguyên phần thưởng, cá nhân có thể tái cấu trúc các đường dẫn thần kinh của mình theo thời gian." }
    ],
    quiz: [
      {
        question: "What are the three components of a habit loop?",
        options: [
          "Cue, routine, reward",
          "Thought, action, consequence",
          "Input, processing, output",
          "Desire, discipline, success"
        ],
        correct: 0,
        explanation: "The text states: 'composed of a cue, a routine, and a reward'."
      },
      {
        question: "What does the term 'chunking' allow the brain to do?",
        options: [
          "Memorize thousands of words instantly",
          "Perform complex actions without conscious deliberation",
          "Prevent aging of brain cells",
          "Eliminate all bad habits automatically"
        ],
        correct: 1,
        explanation: "Chunking allows performing complex actions without conscious deliberation."
      },
      {
        question: "How can someone effectively alter a deeply ingrained habit?",
        options: [
          "By completely ignoring the reward",
          "By identifying the trigger and substituting the routine while keeping the reward",
          "By sleeping more hours every night",
          "By punishing oneself whenever a mistake occurs"
        ],
        correct: 1,
        explanation: "Identify trigger + substitute routine with healthier alternative + keep reward."
      }
    ],
    reflectionPrompt: "Think of a habit you successfully formed or broke in the past. What was the key trigger or strategy that helped you succeed?"
  }
];
