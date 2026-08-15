// Multi-Track Examination Engine & Comprehensive Question Bank (100% English)
// Supports Diagnostic Placement, Weekly Mandatory, Monthly Benchmark, and Standardized (IELTS, TOEIC, VSTEP)

export const EXAM_TRACKS = {
  // =========================================================================
  // TRACK 1: CEFR Diagnostic Placement Test (Initial Level Assessment)
  // =========================================================================
  diagnostic: {
    id: "diagnostic",
    name: "CEFR Diagnostic Placement Test",
    badge: "Level Assessment",
    badgeClass: "glow-cyan",
    durationMinutes: 15,
    durationSeconds: 15 * 60,
    isMandatory: false,
    subtitle: "Standardized 4-skill evaluation to determine your CEFR proficiency level (A1 - C2).",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "Section 1: Listening Comprehension",
        desc: "Listen to the audio recording carefully and select the best answer.",
        questions: [
          {
            id: "l_diag_1",
            difficulty: "A2",
            audioText: "I usually take the train to work because the subway is far too crowded during peak morning hours.",
            question: "Why does the speaker prefer taking the train over the subway?",
            options: [
              { id: "A", text: "The train tickets are more affordable", isCorrect: false },
              { id: "B", text: "The subway is excessively crowded during rush hours", isCorrect: true },
              { id: "C", text: "The train station is located closer to their home", isCorrect: false },
              { id: "D", text: "The train offers complimentary refreshments", isCorrect: false }
            ]
          },
          {
            id: "l_diag_2",
            difficulty: "B1",
            audioText: "Although the initial capital expenditure for solar energy systems is substantial, long-term operational savings will ultimately offset the upfront expenses.",
            question: "What will happen to the initial costs of solar energy over time?",
            options: [
              { id: "A", text: "They will be entirely wasted due to maintenance costs", isCorrect: false },
              { id: "B", text: "They will double as total energy consumption increases", isCorrect: false },
              { id: "C", text: "They will be fully recovered through long-term energy savings", isCorrect: true },
              { id: "D", text: "They will be reimbursed directly by utility companies", isCorrect: false }
            ]
          },
          {
            id: "l_diag_3",
            difficulty: "B2",
            audioText: "The unprecedented surge in remote collaboration has profoundly altered workplace dynamics, rendering rigid corporate hierarchies largely obsolete.",
            question: "What is the primary consequence of remote collaboration described by the speaker?",
            options: [
              { id: "A", text: "It significantly reduces overall employee productivity", isCorrect: false },
              { id: "B", text: "It makes traditional, rigid office hierarchies outdated", isCorrect: true },
              { id: "C", text: "It forces companies to establish multiple regional offices", isCorrect: false },
              { id: "D", text: "It leads to substantial increases in office rental expenses", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "Section 2: Reading & Contextual Analysis",
        desc: "Read the passage attentively and choose the correct answer to the question below.",
        questions: [
          {
            id: "r_diag_1",
            difficulty: "A2",
            passage: "Regular physical exercise not only enhances cardiovascular health but also triggers the release of endorphins—neurochemicals in the brain that act as natural pain relievers and elevate mood.",
            question: "According to the passage, what key role do endorphins play in the human body?",
            options: [
              { id: "A", text: "They induce chronic fatigue and sleepiness", isCorrect: false },
              { id: "B", text: "They alleviate pain naturally and boost mood", isCorrect: true },
              { id: "C", text: "They suppress heart rate to critically low levels", isCorrect: false },
              { id: "D", text: "They replace the necessity of a balanced nutritional diet", isCorrect: false }
            ]
          },
          {
            id: "r_diag_2",
            difficulty: "B1",
            passage: "Artificial intelligence models in healthcare can now interpret radiological imaging with remarkable precision. Nonetheless, clinical specialists emphasize that AI should serve as an auxiliary diagnostic instrument rather than a complete replacement for human medical intuition.",
            question: "Which of the following is closest in meaning to the word 'auxiliary' as used in the passage?",
            options: [
              { id: "A", text: "Mandatory and compulsory", isCorrect: false },
              { id: "B", text: "Supportive and complementary", isCorrect: true },
              { id: "C", text: "Dangerous and unpredictable", isCorrect: false },
              { id: "D", text: "Experimental and unproven", isCorrect: false }
            ]
          },
          {
            id: "r_diag_3",
            difficulty: "B2",
            passage: "Cognitive psychology indicates that active retrieval practice and spaced repetition are vastly superior to passive re-reading for long-term memory retention. Actively retrieving information strengthens neural pathways and prevents knowledge decay over time.",
            question: "Why is active retrieval practice considered superior to passive re-reading?",
            options: [
              { id: "A", text: "It requires substantially less cognitive effort and concentration", isCorrect: false },
              { id: "B", text: "It reinforces neural connections and mitigates knowledge loss", isCorrect: true },
              { id: "C", text: "It enables learners to memorize entire textbooks overnight", isCorrect: false },
              { id: "D", text: "It eliminates the need for future review sessions", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "Section 3: Writing & Grammatical Precision",
        desc: "Choose the option that demonstrates the most accurate and sophisticated grammatical structure.",
        questions: [
          {
            id: "w_diag_1",
            difficulty: "A2",
            question: "Select the sentence that correctly expresses an ongoing action that began three years ago and continues today:",
            options: [
              { id: "A", text: "I am learning English since three years ago.", isCorrect: false },
              { id: "B", text: "I have been learning English for three years.", isCorrect: true },
              { id: "C", text: "I learn English for three years already.", isCorrect: false },
              { id: "D", text: "I had been learning English since three years.", isCorrect: false }
            ]
          },
          {
            id: "w_diag_2",
            difficulty: "B1",
            question: "Choose the most appropriate transition word: 'The weather conditions were extremely severe; ________, the expedition team successfully reached the mountain summit.'",
            options: [
              { id: "A", text: "nevertheless (however / nonetheless)", isCorrect: true },
              { id: "B", text: "furthermore (moreover / in addition)", isCorrect: false },
              { id: "C", text: "consequently (as a result / therefore)", isCorrect: false },
              { id: "D", text: "in addition (additionally)", isCorrect: false }
            ]
          },
          {
            id: "w_diag_3",
            difficulty: "B2",
            question: "Which of the following formal inversion structures is grammatically correct and most natural?",
            options: [
              { id: "A", text: "Only after the research findings were published, the team recognized their breakthrough.", isCorrect: false },
              { id: "B", text: "Only after the research findings were published did the team recognize their breakthrough.", isCorrect: true },
              { id: "C", text: "Only after did the research findings publish, the team recognized their breakthrough.", isCorrect: false },
              { id: "D", text: "Only after were the research findings published, the team had recognized their breakthrough.", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "Section 4: Speaking & Pronunciation",
        desc: "Click the Microphone button and read the sentence aloud clearly to evaluate your pronunciation accuracy.",
        questions: [
          {
            id: "s_diag_1",
            difficulty: "A2/B1",
            targetSentence: "Consistent daily practice is the cornerstone of achieving fluency in any foreign language.",
            phoneticHint: "/kənˈsɪs.tənt ˈdeɪ.li ˈpræk.tɪs ɪz ðə ˈkɔː.nə.stəʊn əv əˈtʃiː.vɪŋ ˈfluː.ən.si/"
          },
          {
            id: "s_diag_2",
            difficulty: "B1/B2",
            targetSentence: "Modern technological innovations have fundamentally reshaped how we collaborate and acquire knowledge worldwide.",
            phoneticHint: "/ˈmɒd.ən ˌtek.nəˈlɒdʒ.ɪ.kəl ˌɪn.əˈveɪ.ʃənz hæv ˌfʌn.dəˈmen.təl.i ˌriːˈʃeɪpt haʊ wiː kəˈlæb.ə.reɪt/"
          }
        ]
      }
    }
  },

  // =========================================================================
  // TRACK 2: Weekly Mandatory Progress Exam (Weekly Curriculum Mastery)
  // =========================================================================
  weekly: {
    id: "weekly",
    name: "Weekly Mandatory Progress Exam",
    badge: "Weekly Mandatory",
    badgeClass: "glow-amber",
    durationMinutes: 12,
    durationSeconds: 12 * 60,
    isMandatory: true,
    subtitle: "Required weekly assessment testing target vocabulary, grammar patterns, and comprehension from this week's lessons.",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "Section 1: Weekly Listening & Dialogue Review",
        desc: "Listen to the weekly workplace and conversation audio recordings and answer the questions.",
        questions: [
          {
            id: "l_week_1",
            difficulty: "B1",
            audioText: "Our sprint team managed to eliminate the deployment bottleneck by automating our code review pipeline yesterday.",
            question: "How did the team resolve their deployment bottleneck?",
            options: [
              { id: "A", text: "By hiring three additional junior developers", isCorrect: false },
              { id: "B", text: "By automating their code review pipeline", isCorrect: true },
              { id: "C", text: "By cancelling future product releases", isCorrect: false },
              { id: "D", text: "By outsourcing maintenance to another agency", isCorrect: false }
            ]
          },
          {
            id: "l_week_2",
            difficulty: "B2",
            audioText: "To ensure project feasibility, we must consult key stakeholders before finalizing our budget allocation for next quarter.",
            question: "What step is essential before completing the budget allocation?",
            options: [
              { id: "A", text: "Consulting with key stakeholders", isCorrect: true },
              { id: "B", text: "Immediately signing the supplier contracts", isCorrect: false },
              { id: "C", text: "Dismissing client suggestions", isCorrect: false },
              { id: "D", text: "Postponing all project milestones indefinitely", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "Section 2: Weekly Vocabulary & Reading Context",
        desc: "Read the short article featuring this week's target vocabulary and answer the questions.",
        questions: [
          {
            id: "r_week_1",
            difficulty: "B1",
            passage: "Companies that actively streamline their internal communication channels report a 25% increase in operational efficiency. Furthermore, fostering transparency empowers employees to make data-driven decisions autonomously without awaiting hierarchical approval.",
            question: "What is the direct benefit of streamlining internal communication mentioned in the text?",
            options: [
              { id: "A", text: "It causes employees to lose interest in their projects", isCorrect: false },
              { id: "B", text: "It boosts operational efficiency by 25%", isCorrect: true },
              { id: "C", text: "It increases office supplies expenditure", isCorrect: false },
              { id: "D", text: "It mandates longer working hours each day", isCorrect: false }
            ]
          },
          {
            id: "r_week_2",
            difficulty: "B2",
            passage: "Adopting sustainable business models allows tech enterprises to mitigate regulatory risks and significantly decrease their overall carbon footprint while strengthening consumer trust.",
            question: "Which of the following best defines the word 'mitigate' in this context?",
            options: [
              { id: "A", text: "To aggravate or worsen", isCorrect: false },
              { id: "B", text: "To lessen, reduce, or alleviate", isCorrect: true },
              { id: "C", text: "To completely ignore", isCorrect: false },
              { id: "D", text: "To publicly announce", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "Section 3: Weekly Grammar & Collocations",
        desc: "Choose the grammatically accurate sentence applying this week's collocations.",
        questions: [
          {
            id: "w_week_1",
            difficulty: "B1",
            question: "Choose the correct sentence applying the target phrase 'leverage technology':",
            options: [
              { id: "A", text: "We should leverage modern AI technology to streamline our workflows.", isCorrect: true },
              { id: "B", text: "We should leverage on modern AI technology for streamline our workflows.", isCorrect: false },
              { id: "C", text: "We should to leverage modern AI technology to streamlining.", isCorrect: false },
              { id: "D", text: "We leverage of modern AI technology with workflow streamline.", isCorrect: false }
            ]
          },
          {
            id: "w_week_2",
            difficulty: "B2",
            question: "Identify the correct conditional sentence discussing project feasibility:",
            options: [
              { id: "A", text: "If the project is feasible, we would have launched it next week.", isCorrect: false },
              { id: "B", text: "Had the proposal been feasible, management would have approved the funding.", isCorrect: true },
              { id: "C", text: "If the proposal was feasible, management will approve yesterday.", isCorrect: false },
              { id: "D", text: "Had the proposal been feasible, management will have approve.", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "Section 4: Weekly Pronunciation & Fluency Check",
        desc: "Read this week's target phrase aloud clearly to test speech fluency.",
        questions: [
          {
            id: "s_week_1",
            difficulty: "B1/B2",
            targetSentence: "We need to streamline our workflow to eliminate bottlenecks and ensure sustainable team productivity.",
            phoneticHint: "/wiː niːd tuː ˈstriːm.laɪn ˈaʊər ˈwɜːk.fləʊ tuː ɪˈlɪm.ɪ.neɪt ˈbɒt.əl.neks/"
          }
        ]
      }
    }
  },

  // =========================================================================
  // TRACK 3: Monthly Mandatory Benchmark Exam (Cumulative Milestone)
  // =========================================================================
  monthly: {
    id: "monthly",
    name: "Monthly Mandatory Benchmark Exam",
    badge: "Monthly Milestone",
    badgeClass: "glow-purple",
    durationMinutes: 20,
    durationSeconds: 20 * 60,
    isMandatory: true,
    subtitle: "Comprehensive month-end examination evaluating 4-week cumulative growth across all practical skills.",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "Section 1: Monthly Comprehensive Listening",
        desc: "Listen to lectures and discussions covering diverse academic and business topics.",
        questions: [
          {
            id: "l_month_1",
            difficulty: "B2",
            audioText: "The shift towards renewable energy requires not only massive investments in infrastructure but also a fundamental restructuring of international regulatory frameworks.",
            question: "What two requirements for the renewable energy transition are emphasized?",
            options: [
              { id: "A", text: "Infrastructure investment and regulatory restructuring", isCorrect: true },
              { id: "B", text: "Decreased consumer demand and lower fossil fuel prices", isCorrect: false },
              { id: "C", text: "Immediate shutdown of all existing power grids", isCorrect: false },
              { id: "D", text: "Exclusive reliance on voluntary corporate donations", isCorrect: false }
            ]
          },
          {
            id: "l_month_2",
            difficulty: "C1",
            audioText: "Cognitive flexibility and emotional intelligence are increasingly recognized by executive recruiters as far more predictive of leadership success than technical prowess alone.",
            question: "Why do recruiters place high value on cognitive flexibility and emotional intelligence?",
            options: [
              { id: "A", text: "They guarantee that candidates require zero training", isCorrect: false },
              { id: "B", text: "They are stronger indicators of long-term leadership effectiveness", isCorrect: true },
              { id: "C", text: "They eliminate the necessity of technical knowledge", isCorrect: false },
              { id: "D", text: "They reduce overall corporate salary expectations", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "Section 2: Monthly Advanced Reading Analysis",
        desc: "Analyze the in-depth text and answer complex contextual questions.",
        questions: [
          {
            id: "r_month_1",
            difficulty: "B2",
            passage: "Neuroplasticity—the brain's intrinsic capacity to reorganize synaptic connections in response to experiential learning—demonstrates that adult language acquisition remains remarkably potent throughout life, debunking long-held myths regarding a strict biological cutoff for language fluency.",
            question: "What major misconception about language learning does neuroplasticity refute?",
            options: [
              { id: "A", text: "That children learn slower than adults in natural environments", isCorrect: false },
              { id: "B", text: "That adults cannot achieve high language fluency due to age limits", isCorrect: true },
              { id: "C", text: "That vocabulary retention requires active neural destruction", isCorrect: false },
              { id: "D", text: "That listening comprehension is unrelated to brain activity", isCorrect: false }
            ]
          },
          {
            id: "r_month_2",
            difficulty: "C1",
            passage: "The rapid integration of algorithmic automation into contemporary financial markets has yielded unprecedented transaction velocities. Nonetheless, it introduces systemic vulnerabilities that traditional regulatory oversight struggles to mitigate effectively.",
            question: "What is the primary drawback of algorithmic automation highlighted in the passage?",
            options: [
              { id: "A", text: "It drastically reduces market trading speed", isCorrect: false },
              { id: "B", text: "It introduces systemic vulnerabilities that challenge traditional regulation", isCorrect: true },
              { id: "C", text: "It prevents international investors from participating in exchanges", isCorrect: false },
              { id: "D", text: "It doubles physical banking operational costs", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "Section 3: Monthly Academic & Syntactical Mastery",
        desc: "Select the sentence with superior syntactical precision and academic register.",
        questions: [
          {
            id: "w_month_1",
            difficulty: "B2/C1",
            question: "Choose the sentence that correctly employs a participle clause for concise academic style:",
            options: [
              { id: "A", text: "Having analyzed the experimental data, several intriguing correlations emerged to the researchers.", isCorrect: false },
              { id: "B", text: "Having analyzed the experimental data, the researchers identified several intriguing correlations.", isCorrect: true },
              { id: "C", text: "Having analyzing the experimental data, researchers found correlations.", isCorrect: false },
              { id: "D", text: "Analyzed the experimental data, the researchers identified correlations.", isCorrect: false }
            ]
          },
          {
            id: "w_month_2",
            difficulty: "C1",
            question: "Select the most sophisticated subjunctive structure for formal policy recommendations:",
            options: [
              { id: "A", text: "It is imperative that the advisory board reviews all safety protocols annually.", isCorrect: false },
              { id: "B", text: "It is imperative that the advisory board review all safety protocols annually.", isCorrect: true },
              { id: "C", text: "It is imperative that the advisory board will review safety protocols annually.", isCorrect: false },
              { id: "D", text: "It is imperative that the advisory board would review safety protocols annually.", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "Section 4: Monthly Advanced Pronunciation & Intonation",
        desc: "Deliver this complex sentence with natural rhythm, stress, and clarity.",
        questions: [
          {
            id: "s_month_1",
            difficulty: "B2/C1",
            targetSentence: "Technological advancement must be balanced with ethical responsibility to ensure equitable societal progress.",
            phoneticHint: "/ˌtek.nəˈlɒdʒ.ɪ.kəl ədˈvɑːns.mənt mʌst biː ˈbæl.ənst wɪð ˈeθ.ɪ.kəl rɪˌspɒn.sɪˈbɪl.ə.ti/"
          }
        ]
      }
    }
  },

  // =========================================================================
  // TRACK 4: Standardized Exam Simulations (IELTS, TOEIC, VSTEP)
  // =========================================================================
  ielts: {
    id: "ielts",
    name: "IELTS Academic Mock Simulation",
    badge: "IELTS Academic",
    badgeClass: "glow-rose",
    durationMinutes: 18,
    durationSeconds: 18 * 60,
    isMandatory: false,
    subtitle: "Authentic simulation of IELTS Academic sections: Section 3 Dialogue, Academic Reading, Task 2 Essay Analysis & Cue Card Speaking.",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "IELTS Listening: Academic Dialogue (Section 3)",
        desc: "Listen to a university tutorial conversation between two students discussing their research dissertation.",
        questions: [
          {
            id: "l_ielts_1",
            difficulty: "IELTS 6.5 - 7.5",
            audioText: "Tutor: What surprised you most about the survey respondents' feedback on urban green spaces? Student: Well, despite initial assumptions that proximity was key, participants overwhelmingly prioritized biodiversity and maintenance over physical distance.",
            question: "What quality of urban green spaces did survey participants value most?",
            options: [
              { id: "A", text: "Proximity and short walking distance from their residence", isCorrect: false },
              { id: "B", text: "Rich biodiversity and attentive upkeep of the park grounds", isCorrect: true },
              { id: "C", text: "Availability of complimentary recreational sports equipment", isCorrect: false },
              { id: "D", text: "Commercial cafes and shopping facilities within the park", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "IELTS Reading: Academic Research Passage",
        desc: "Read the academic excerpt on marine ecosystems and answer the multiple-choice question.",
        questions: [
          {
            id: "r_ielts_1",
            difficulty: "IELTS 6.5 - 7.5",
            passage: "Coral reef bleaching is fundamentally driven by elevated ocean thermal anomalies. When sustained sea surface temperatures exceed local seasonal maxima by merely 1°C, the symbiotic zooxanthellae algae are expelled from coral tissues, depriving the host organism of vital photosynthetic nutrients.",
            question: "What threshold of sea temperature increase triggers the expulsion of zooxanthellae algae?",
            options: [
              { id: "A", text: "A sustained increase of merely 1°C above seasonal maxima", isCorrect: true },
              { id: "B", text: "A sharp drop of 5°C during winter months", isCorrect: false },
              { id: "C", text: "A temporary fluctuation of 10°C over a 24-hour cycle", isCorrect: false },
              { id: "D", text: "Any slight change in coastal water salinity", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "IELTS Writing: Task 2 Argumentative Precision",
        desc: "Select the sentence with the highest band score coherence and lexical resource for an IELTS Task 2 essay.",
        questions: [
          {
            id: "w_ielts_1",
            difficulty: "IELTS Band 7.5+",
            question: "Which of the following topic sentences best demonstrates academic cohesion and high-band vocabulary for an essay on public transport funding?",
            options: [
              { id: "A", text: "Investing heavily in public transport is a very good idea that helps people a lot.", isCorrect: false },
              { id: "B", text: "Substantial governmental allocation towards mass transit infrastructure serves as a potent catalyst for reducing vehicular emissions and urban congestion.", isCorrect: true },
              { id: "C", text: "Because public transport is nice, the government must spend big money on it.", isCorrect: false },
              { id: "D", text: "Government money should go into buses and trains so cars will not be everywhere.", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "IELTS Speaking: Part 2 Cue Card Fluency",
        desc: "Read aloud this Part 2 introductory response with authentic intonation and sentence stress.",
        questions: [
          {
            id: "s_ielts_1",
            difficulty: "IELTS Band 7.0+",
            targetSentence: "I would like to describe a transformative educational experience that profoundly influenced my perspective on sustainable technology.",
            phoneticHint: "/aɪ wʊd laɪk tuː dɪˈskraɪb ə trænsˈfɔː.mə.tɪv ˌedʒ.ʊˈkeɪ.ʃən.əl ɪkˈspɪə.ri.əns/"
          }
        ]
      }
    }
  },

  toeic: {
    id: "toeic",
    name: "TOEIC Business English Mock",
    badge: "TOEIC 750 - 990",
    badgeClass: "glow-cyan",
    durationMinutes: 15,
    durationSeconds: 15 * 60,
    isMandatory: false,
    subtitle: "Realistic simulation of TOEIC listening photos, Q&A, incomplete sentences (Part 5), and business memos (Part 7).",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "TOEIC Listening: Part 1 & Part 2 Business Audio",
        desc: "Listen to the business conversation and select the best professional response.",
        questions: [
          {
            id: "l_toeic_1",
            difficulty: "TOEIC 750+",
            audioText: "Question: Could you let me know when the revised financial audit will be ready for the executive board review? Option A: Yes, the printer is on the second floor. Option B: It is scheduled to be finalized by Thursday afternoon. Option C: We enjoyed the company retreat last week.",
            question: "Which option provides the most appropriate response to the question?",
            options: [
              { id: "A", text: "Option A (Printer location)", isCorrect: false },
              { id: "B", text: "Option B (Finalized by Thursday afternoon)", isCorrect: true },
              { id: "C", text: "Option C (Company retreat)", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "TOEIC Reading: Part 7 Business Memorandum",
        desc: "Read the corporate memo and answer the question.",
        questions: [
          {
            id: "r_toeic_1",
            difficulty: "TOEIC 800+",
            passage: "MEMORANDUM: To all regional branch managers. Please be advised that all quarterly expense reimbursement claims must be submitted electronically through the new ERP portal no later than Friday, October 24th at 5:00 PM. Incomplete submissions without attached digital receipts will be rejected automatically.",
            question: "What requirement must be met for reimbursement claims to be processed successfully?",
            options: [
              { id: "A", text: "They must be submitted in paper format to HR", isCorrect: false },
              { id: "B", text: "They must include attached digital receipts via the ERP portal before Friday 5:00 PM", isCorrect: true },
              { id: "C", text: "They must be signed in person by the CEO", isCorrect: false },
              { id: "D", text: "They must not exceed 50 dollars per employee", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "TOEIC Reading: Part 5 Incomplete Sentences",
        desc: "Select the word that best completes the business sentence grammatically.",
        questions: [
          {
            id: "w_toeic_1",
            difficulty: "TOEIC 750+",
            question: "The director requested that all department heads ________ their quarterly performance projections by the end of the business day.",
            options: [
              { id: "A", text: "submit", isCorrect: true },
              { id: "B", text: "submitting", isCorrect: false },
              { id: "C", text: "submits", isCorrect: false },
              { id: "D", text: "submitted", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "TOEIC Speaking: Read a Text Aloud",
        desc: "Read this customer service announcement aloud clearly with correct pauses and intonation.",
        questions: [
          {
            id: "s_toeic_1",
            difficulty: "TOEIC Speaking Level 7+",
            targetSentence: "Thank you for calling Apex Logistics. Please hold while we connect you to the next available representative.",
            phoneticHint: "/θæŋk juː fɔː ˈkɔː.lɪŋ ˈeɪ.peks ləˈdʒɪs.tɪks. pliːz həʊld waɪl wiː kəˈnekt juː/"
          }
        ]
      }
    }
  },

  vstep: {
    id: "vstep",
    name: "VSTEP (B1 - B2 - C1) Mock",
    badge: "VSTEP 6 Bậc VN",
    badgeClass: "glow-emerald",
    durationMinutes: 15,
    durationSeconds: 15 * 60,
    isMandatory: false,
    subtitle: "Aligned with Vietnam's 6-level Foreign Language Framework (B1 - B2 - C1) across all four language competencies.",
    stages: ["listening", "reading", "writing", "speaking"],
    data: {
      listening: {
        title: "VSTEP Listening: Social & Academic Context",
        desc: "Listen to the announcement and choose the correct answer.",
        questions: [
          {
            id: "l_vstep_1",
            difficulty: "VSTEP B2",
            audioText: "Attention all conference attendees: The afternoon keynote lecture on Climate Resilience has been relocated to Hall B due to audio-visual equipment upgrades in the main auditorium.",
            question: "Why was the keynote lecture moved to Hall B?",
            options: [
              { id: "A", text: "Due to audio-visual equipment upgrades in the main auditorium", isCorrect: true },
              { id: "B", text: "Because the speaker arrived two hours late", isCorrect: false },
              { id: "C", text: "To accommodate a larger banquet buffet", isCorrect: false },
              { id: "D", text: "Because Hall B has more expensive seating", isCorrect: false }
            ]
          }
        ]
      },
      reading: {
        title: "VSTEP Reading: General & Academic Comprehension",
        desc: "Read the passage on traditional cultural preservation and answer the question.",
        questions: [
          {
            id: "r_vstep_1",
            difficulty: "VSTEP B2",
            passage: "Preserving intangible cultural heritage, such as traditional folk singing and craft weaving, necessitates integrating these ancient practices into modern educational curricula and community tourism initiatives.",
            question: "How can intangible cultural heritage be effectively preserved according to the author?",
            options: [
              { id: "A", text: "By restricting access exclusively to academic researchers", isCorrect: false },
              { id: "B", text: "By integrating them into modern school curricula and community tourism", isCorrect: true },
              { id: "C", text: "By replacing them entirely with digital entertainment", isCorrect: false },
              { id: "D", text: "By locking historical artifacts in remote warehouses", isCorrect: false }
            ]
          }
        ]
      },
      writing: {
        title: "VSTEP Writing: Formal Letter & Essay Grammar",
        desc: "Choose the most appropriate phrase for a formal letter to a university dean.",
        questions: [
          {
            id: "w_vstep_1",
            difficulty: "VSTEP B2",
            question: "Which of the following sentences is most appropriate to conclude a formal scholarship application letter?",
            options: [
              { id: "A", text: "I look forward to hearing from you at your earliest convenience.", isCorrect: true },
              { id: "B", text: "Talk to you soon, cheers!", isCorrect: false },
              { id: "C", text: "Give me an email when you have some free time.", isCorrect: false },
              { id: "D", text: "I hope you like my letter and give me the money.", isCorrect: false }
            ]
          }
        ]
      },
      speaking: {
        title: "VSTEP Speaking: Topic Development",
        desc: "Read aloud the opinion statement clearly.",
        questions: [
          {
            id: "s_vstep_1",
            difficulty: "VSTEP B2",
            targetSentence: "In my opinion, community-based tourism provides sustainable economic benefits for local artisans while preserving cultural heritage.",
            phoneticHint: "/ɪn maɪ əˈpɪn.jən, kəˈmjuː.nə.ti beɪst ˈtʊə.rɪ.zəm prəˈvaɪdz səˈsteɪ.nə.bəl ˌiː.kəˈnɒm.ɪk ˈben.ɪ.fɪts/"
          }
        ]
      }
    }
  }
};

// Backward-compatible alias for standard placement test
export const PLACEMENT_TEST_DATA = EXAM_TRACKS.diagnostic.data;

// Calculate CEFR Level based on skill score percentages
export function calculateCefrLevel(correctCount, totalCount) {
  if (totalCount === 0) return "B1";
  const percentage = (correctCount / totalCount) * 100;
  if (percentage >= 90) return "C1";
  if (percentage >= 70) return "B2";
  if (percentage >= 50) return "B1";
  if (percentage >= 30) return "A2";
  return "A1";
}

// Calendar & Deadline Management Utilities
export function getExamCalendarData(currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const todayDate = currentDate.getDate();

  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Calculate this week's mandatory Sunday deadline
  const currentDayOfWeek = currentDate.getDay(); // 0 is Sunday
  const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
  const weeklyDeadlineDate = todayDate + daysUntilSunday;

  // Monthly mandatory deadline is the last day of the month
  const monthlyDeadlineDate = totalDays;

  return {
    year,
    month,
    monthName: currentDate.toLocaleString('default', { month: 'long' }),
    todayDate,
    firstDayIndex,
    totalDays,
    weeklyDeadlineDate: weeklyDeadlineDate <= totalDays ? weeklyDeadlineDate : totalDays,
    monthlyDeadlineDate
  };
}
