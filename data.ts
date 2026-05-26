import { EducationalArticle, Specialist, MoodEntry, Quiz, QuizQuestion } from './types';

// Let's create mock weekly pregnancy milestones from week 4 to week 40
export interface WeeklyPregnancyInfo {
  week: number;
  trimester: 1 | 2 | 3;
  babySizeFruit: string;
  fruitEmoji: string;
  babyLengthCm: number;
  babyWeightG: number;
  babyDevelopments: string;
  momChanges: string;
  tips: string[];
}

export const pregnancyWeeksData: WeeklyPregnancyInfo[] = [
  {
    week: 4,
    trimester: 1,
    babySizeFruit: 'Poppy Seed',
    fruitEmoji: '🌱',
    babyLengthCm: 0.2,
    babyWeightG: 0.1,
    babyDevelopments: 'The blastocyst officially implants in your uterine wall. Major systems, including the neural tube, start forming.',
    momChanges: 'You might feel mild cramping, fatigue, or slight bloating. Early hormones are starting to surge.',
    tips: [
      'Take a high-quality prenatal vitamin with folic acid (400 mcg daily).',
      'Schedule an initial appointment with your OB-GYN.',
      'Transition away from caffeine and eliminate alcohol.'
    ]
  },
  {
    week: 8,
    trimester: 1,
    babySizeFruit: 'Raspberry',
    fruitEmoji: '🍓',
    babyLengthCm: 1.6,
    babyWeightG: 1.0,
    babyDevelopments: 'Your baby’s heart is beating at 150 BPM! Webbed fingers and toes are starting to form, and sensory paths begin.',
    momChanges: 'Morning sickness (nausea) might peak. Fatigue is extremely common as your body creates placenta cells.',
    tips: [
      'Eat small, frequent meals to battle morning sickness.',
      'Ginger tea and acupuncture bands help suppress nausea.',
      'Prioritize horizontal rest and gentle daily stretches.'
    ]
  },
  {
    week: 12,
    trimester: 1,
    babySizeFruit: 'Lime',
    fruitEmoji: '🍈',
    babyLengthCm: 5.4,
    babyWeightG: 14.0,
    babyDevelopments: 'All organs and limbs are fully formed. Baby starts minor opening/closing of fists and early swallowing reflexes.',
    momChanges: 'First trimester ends soon! Hormones level out, and morning sickness may begin to decrease. Your skin may look flushed.',
    tips: [
      'Start a daily gratitude journal to manage emotional waves.',
      'Explore gentle pelvic floor exercises (Kegels).',
      'Talk with your partner about budgeting for pediatric needs.'
    ]
  },
  {
    week: 16,
    trimester: 2,
    babySizeFruit: 'Avocado',
    fruitEmoji: '🥑',
    babyLengthCm: 11.6,
    babyWeightG: 100,
    babyDevelopments: 'The baby can feel light and hear sound through the amniotic fluid. Miniature fingernails are forming.',
    momChanges: 'The "Pregnancy Glow" has arrived! Your energy is returning, and you might begin to show a sweet baby bump.',
    tips: [
      'Consider investing in a comfortable maternity pillow.',
      'Schedule a mid-pregnancy anomaly ultrasound (usually scheduled weeks 18-22).',
      'Gentle exercise like prenatal yoga or brisk walking is great now.'
    ]
  },
  {
    week: 20,
    trimester: 2,
    babySizeFruit: 'Banana',
    fruitEmoji: '🍌',
    babyLengthCm: 25.6,
    babyWeightG: 300,
    babyDevelopments: 'Halfway mark! Your baby is covered in vernix caseosa (protective skin film) and active sleep-wake cycles emerge.',
    momChanges: 'You might start feeling tiny fluttering movements known as "quickening." Increased appetite is normal.',
    tips: [
      'Sing or talk to your baby; they can recognize your voice now.',
      'Maintain premium calendar hydration (8+ glasses of water daily).',
      'Schedule a virtual counselor check-in to process your evolving identity as a mother.'
    ]
  },
  {
    week: 24,
    trimester: 2,
    babySizeFruit: 'Cantaloupe',
    fruitEmoji: '🍈',
    babyLengthCm: 30.0,
    babyWeightG: 600,
    babyDevelopments: 'Lungs form branches, and blood vessels develop in the lung tissue. Taste buds are active.',
    momChanges: 'Your center of gravity shifts. You may suffer from dry skin over the abdomen or occasional leg cramps.',
    tips: [
      'Moisturize your belly with shea butter or pure coconut oil.',
      'Take a glucose screening test to check for gestational diabetes.',
      'Incorporate stretching or warm baths before sleeping.'
    ]
  },
  {
    week: 28,
    trimester: 3,
    babySizeFruit: 'Eggplant',
    fruitEmoji: '🍆',
    babyLengthCm: 37.6,
    babyWeightG: 1000,
    babyDevelopments: 'Your baby is open-eyed! Brain tissue expands rapidly, and their sleep cycles are much more organized.',
    momChanges: 'Welcome to the 3rd Trimester! Breathing might feel shallower as your uterus pushes up on the diaphragm.',
    tips: [
      'Start counting baby kicks once or twice daily (look for 10 kicks within 2 hours).',
      'Include calcium-packed snacks to help baby’s bone development.',
      'Practice breathing patterns to relax during strong Braxton Hicks contractions.'
    ]
  },
  {
    week: 32,
    trimester: 3,
    babySizeFruit: 'Squash',
    fruitEmoji: '🎨',
    babyLengthCm: 42.4,
    babyWeightG: 1700,
    babyDevelopments: 'Baby is packing on fat reserves underneath the skin. Their skeleton is fully formed but bones remain soft.',
    momChanges: 'Heartburn or lower back stress could emerge. Sleep quality may decline slightly due to size.',
    tips: [
      'Eat smaller portions of food to ease heartburn.',
      'Check in with a doula or therapist regarding birth plans and postpartum fears.',
      'Prepare a draft hospital/birthing bag checklist.'
    ]
  },
  {
    week: 36,
    trimester: 3,
    babySizeFruit: 'Papaya',
    fruitEmoji: '🍈',
    babyLengthCm: 47.4,
    babyWeightG: 2600,
    babyDevelopments: 'Baby is taking up almost all available space. Fluid levels decrease slightly, and baby drops lower into the pelvis.',
    momChanges: 'You may feel "lightening" as the baby settles down, making breathing easier but pelvic pressure higher.',
    tips: [
      'Complete baby nursery layout setup and ensure infant car seat is securely installed.',
      'Consolidate pediatrician recommendations and draft final birth desires.',
      'Ensure a robust postpartum mental support circle is established.'
    ]
  },
  {
    week: 40,
    trimester: 3,
    babySizeFruit: 'Pumpkin',
    fruitEmoji: '🎃',
    babyLengthCm: 51.2,
    babyWeightG: 3400,
    babyDevelopments: 'Your baby is fully term and ready to meet you! Lung maturation is complete, and fat reserves regulate temperature.',
    momChanges: 'Your cervix softens and thins out. Intense pressure, contractions, or water rupture can happen at any moment.',
    tips: [
      'Stay peaceful, rested, and keep lines open with your care providers.',
      'Practice soft, supportive affirmations and visualization exercise.',
      'Remember, labor onsets naturally — enjoy these last quiet moments.'
    ]
  }
];

export const initialSpecialists: Specialist[] = [
  {
    id: 's1',
    name: 'Dr. Sarah Sterling, MD',
    role: 'Obstetrician-Gynecologist',
    rating: 4.9,
    reviews: 142,
    avatar: '👩‍⚕️',
    bio: 'Specialist in holistic, trauma-informed prenatal care, maternal health diagnostics, and physiological birth support with 12 Years of experience.',
    price: 85,
    availability: ['Monday', 'Wednesday', 'Thursday']
  },
  {
    id: 's2',
    name: 'Dr. Evelyn Moss, PhD',
    role: 'Maternal Psychologist',
    rating: 5.0,
    reviews: 98,
    avatar: '👩‍💼',
    bio: 'Expert therapist focusing on prenatal/postpartum anxiety, identity transitions in motherhood, maternal depression, and emotional self-regulation.',
    price: 75,
    availability: ['Tuesday', 'Thursday', 'Friday']
  },
  {
    id: 's3',
    name: 'Aria Blossom, CD',
    role: 'Doula & Birth Coach',
    rating: 4.8,
    reviews: 112,
    avatar: '✨',
    bio: 'Dedicated birth doula, hypnobirthing guide, and gentle postpartum physical coordinator. Empowering families through physiological confidence.',
    price: 60,
    availability: ['Monday', 'Tuesday', 'Friday']
  },
  {
    id: 's4',
    name: 'Maya Henderson, IBCLC',
    role: 'Lactation Consultant',
    rating: 4.7,
    reviews: 86,
    avatar: '🌸',
    bio: 'Certified lactation consultant specializing in latch mechanics, structural infant oral anatomy, non-traumatic tongue-ties, and peaceful bottle weaning.',
    price: 55,
    availability: ['Wednesday', 'Friday']
  },
  {
    id: 's5',
    name: 'Camila Rossi, RD',
    role: 'Pregnancy Nutritionist',
    rating: 4.9,
    reviews: 64,
    avatar: '🥗',
    bio: 'Clinical clinical nutritionist helping moms manage gestational diabetes, prenatal iron deficiencies, safe vegan pregnancies, and optimized milk supply diets.',
    price: 65,
    availability: ['Monday', 'Wednesday']
  }
];

export const initialMoods: MoodEntry[] = [
  {
    id: 'm1',
    date: '2026-05-20',
    level: 4,
    emotion: 'Joyful',
    notes: 'Feeling baby movement was incredibly exciting today! Felt very connected to my changing body.',
    symptoms: ['Fatigue'],
    sleepHours: 8.5,
    waterIntake: 9
  },
  {
    id: 'm2',
    date: '2026-05-21',
    level: 3,
    emotion: 'Calm',
    notes: 'Quiet work day. A bit of nausea in the afternoon but warm ginger tea resolved it nicely.',
    symptoms: ['Nausea'],
    sleepHours: 7.0,
    waterIntake: 8
  },
  {
    id: 'm3',
    date: '2026-05-22',
    level: 2,
    emotion: 'Anxious',
    notes: 'Had a sudden wave of overwhelm about the delivery process. Talked with minor doula resources.',
    symptoms: ['Headache', 'Fatigue'],
    sleepHours: 6.2,
    waterIntake: 6
  },
  {
    id: 'm4',
    date: '2026-05-23',
    level: 5,
    emotion: 'Peaceful',
    notes: 'Attended a wonderful prenatal yoga session. Slept deeply and woke up feeling aligned.',
    symptoms: [],
    sleepHours: 9.0,
    waterIntake: 10
  },
  {
    id: 'm5',
    date: '2026-05-24',
    level: 3,
    emotion: 'Tired',
    notes: 'Backache made it difficult to sit for too long. Took extra pillows and hydrated deeply.',
    symptoms: ['Backache', 'Fatigue'],
    sleepHours: 7.2,
    waterIntake: 8
  },
  {
    id: 'm6',
    date: '2026-05-25',
    level: 4,
    emotion: 'Calm',
    notes: 'Prepared the baby nursery and folding newborn clothes. It yields so much comfort.',
    symptoms: [],
    sleepHours: 8.0,
    waterIntake: 9
  }
];

export const initialArticles: EducationalArticle[] = [
  {
    id: 'a1',
    title: 'Navigating Prepartum Anxiety: Honoring the Evolving Self',
    category: 'Mental Wellness',
    readTime: '6 min read',
    summary: 'Feeling worried during pregnancy is a completely natural biological response. Learn to distinguish physiological responses from clinical panic patterns.',
    content: [
      'Pregnancy is one of the most drastic neurobiological transformations a human being can undergo. It involves shifts in gray matter volume, dramatic hormonal surges, and a profound existential restructure. Feeling prepartum anxiety is not a sign of weakness; it is a signal of active evolutionary protective mechanisms.',
      'Key strategies include daily somatic centering, soft breathing and vocal sound vibration, setting strong informational ingestion boundaries, and shifting language from "fear" to "curiosity." If fears feel heavy and sleep gets disrupted, a specialized maternal therapist can be an invaluable ally.',
      'We encourage tracking feelings without judgment. Recording your emotional state inside Zenora serves not under clinical evaluation, but rather to observe somatic and environmental patterns that might precipitate these anxious cascades.'
    ],
    author: 'Dr. Evelyn Moss, PhD',
    authorTitle: 'Maternal Psychologist',
    views: 1250,
    likes: 342
  },
  {
    id: 'a2',
    title: 'The Blueprint of First Trimester Nutrition & Safe Foods',
    category: 'Nutrition & Diet',
    readTime: '8 min read',
    summary: 'A precise clinical guide on folates, bioavailable iron, choline, and what items to absolutely avoid to protect embryological cell division.',
    content: [
      'The first 12 weeks of embryological progression demand intense nucleic acid synthesis and major organogenesis. Folic acid (ideally as active methylfolate) is absolute for preventing neural tube anomalies. Additionally, choline supports complex neural circuitry expansion and memory formation in the brain.',
      'Aim for iron-rich options (spinach, lentils, organic grass-fed meats) alongside vitamin C to maximize biological absorption. Crucially, strictly sidestep raw seafood (sushi, raw oysters), unpasteurized milk and soft cheeses (brie, feta), undercooked meats, and mercury-heavy ocean fish like swordfish or king mackerel.',
      'If morning sickness suppresses solid nutrient absorption, prioritize dry complex carbohydrates (ground oats, whole crackers) in the early hours, and focus on simple raw ginger infusion for immediate gastric lining relief.'
    ],
    author: 'Camila Rossi, RD',
    authorTitle: 'Pregnancy Dietitian',
    views: 2400,
    likes: 588
  },
  {
    id: 'a3',
    title: 'Understanding Third Trimester Milestones & The Golden Month',
    category: 'Pregnancy Milestones',
    readTime: '10 min read',
    summary: 'What to expect in weeks 28-40: Baby lung development, physiological pelvic drops, and natural contractions.',
    content: [
      'The third trimester represents the final nesting phase. From Week 28 onwards, your baby starts opening their eyes, blinking, testing their respiratory muscles by swallowing amniotic fluid, and preparing for the major heat adjustments post-birth by accumulating brown adipose tissues.',
      'Moms commonly notice intense lower back pulling, pelvic pressure (called "lightening" as the baby settles into the pelvic brim), and Braxton Hicks contractions. These mild uterine contractions are merely warm-up exercises, helping your muscular walls practice blood-flow regulation and muscular resilience.',
      'Embrace checking baby kicks twice daily. In standard clinics, finding 10 movements within a 2-hour quiet lying window indicates robust neurological response. Prepare your hospital luggage early, but let go of strict calendars; trust your natural biological rhythm.'
    ],
    author: 'Dr. Sarah Sterling, MD',
    authorTitle: 'Lead OB-GYN OB-GYN',
    views: 1860,
    likes: 412
  },
  {
    id: 'a4',
    title: 'The Maternal Transition: Embracing the "Matrescence" Shift',
    category: 'Mental Wellness',
    readTime: '5 min read',
    summary: 'Why transitioning into motherhood is as major as adolescence, and why we must honor the emotional complexity that arises.',
    content: [
      'Matrescence corresponds to the birth of a mother. Just as adolescence represents a turbulent neurological, physical, and psychological transition, matrescence involves a massive shift in self-concept, career alignment, relationships, and physical integration.',
      'Society often markets motherhood as a series of constant, perfect smiles, leading many mothers to hide feelings of grief, loss of independence, or identity confusion. Understanding that joy and grief can co-exist is critical for self-compassion and mental resilience.',
      'Allowing space for physical recovery, asking for physical help with domestic burdens, and setting distinct postpartum boundaries on visitors translates directly to reduced risks of postpartum mood disturbances.'
    ],
    author: 'Dr. Evelyn Moss, PhD',
    authorTitle: 'Maternal Psychologist',
    views: 934,
    likes: 215
  },
  {
    id: 'a5',
    title: 'Establishing Successful Breastfeeding Mechanics & Latch Success',
    category: 'Postpartum Care',
    readTime: '7 min read',
    summary: 'A direct guide to the biological biological latch, physical mechanics, nipple healing, and managing letdown waves.',
    content: [
      'Successful lactation is not a pure auto-pilot instinct; it is a shared physical skill acquired by mother and infant. The foundation rests entirely on a deep asymmetrical latch, where the baby draws in a wide portion of the lower areola, keeping the nipple deep towards the soft palate.',
      'If latching causes intense sharp pain beyond initial temporary letdown sensations, do not continue. Gently slide an index finger in the baby’s mouth to break suction, reposition the head so their chin digs deep into your breast tissue and nose points slightly away, and retry.',
      'For sore or cracked skin, apply pure sterile lanolin or small drops of your own antibody-rich colostrum over the areola. Let them air-dry. Reach out to an IBCLC consultant early if challenges persist.'
    ],
    author: 'Maya Henderson, IBCLC',
    authorTitle: 'Lactation Consultant',
    views: 1450,
    likes: 398
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Safe Prenatal Nutrition & Diet',
    category: 'Nutrition & Diet',
    description: 'Test your understanding of safe prenatal dietary staples, nutritional supplements, and foods to avoid.',
    questions: [
      {
        id: 'q1_1',
        question: 'Which of the following organic foods should be strictly avoided during pregnancy?',
        options: [
          'Raw and unpasteurized cheeses (e.g., raw Brie or unpasteurized Feta)',
          'High-fiber cooked beans and whole grains',
          'Organic scrambled eggs with firm yolk',
          'Well-cooked shrimp and salmon'
        ],
        correctAnswerIndex: 0,
        explanation: 'Unpasteurized cheeses can harbor Listeria monocytogenes, a bacterium that poses severe risk to the fetus, even triggering early abortion or stillbirth.'
      },
      {
        id: 'q1_2',
        question: 'What nutrient is critical during the first trimester to support neural tube development?',
        options: [
          'Vitamin C',
          'Folic Acid / Methylfolate',
          'Calcium',
          'Potassium'
        ],
        correctAnswerIndex: 1,
        explanation: 'Folic acid (Vitamin B9) is scientifically proven to reduce the risk of critical brain and spinal cord neural tube boundaries by over 70% in early embryo division.'
      },
      {
        id: 'q1_3',
        question: 'Is it safe to consume moderate amounts of caffeine during pregnancy?',
        options: [
          'No, caffeine should be completely eliminated under all circumstances.',
          'Yes, up to 200mg per day (roughly one 12 oz cup of coffee) is generally deemed safe by the ACOG.',
          'Yes, caffeine has no direct medical limits or restrictions.',
          'No, caffeine is a major embryological mutagen.'
        ],
        correctAnswerIndex: 1,
        explanation: 'The American College of Obstetricians and Gynecologists (ACOG) states that caffeine consumption of less than 200 mg per day does not appear to be a major factor in miscarriage or preterm birth.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Maternal Emotional Well-Being',
    category: 'Mental Wellness',
    description: 'Learn about the natural psychological phases of pregnancy and when to seek professional support.',
    questions: [
      {
        id: 'q2_1',
        question: 'What is the maternal psychological shift and identity transition into motherhood called?',
        options: [
          'Maternal Re-adaptation',
          'The Postpartum Spark',
          'Matrescence',
          'Motherhood Transition Phase (MTP)'
        ],
        correctAnswerIndex: 2,
        explanation: 'Matrescence is the official term coined to describe the complete neurobiological, hormonal, and psychological transition into motherhood, comparing its depth to puberty/adolescence.'
      },
      {
        id: 'q2_2',
        question: 'How do you differentiate natural prenatal mood shifts from a clinical anxiety state?',
        options: [
          'Clinical anxiety always involves physical rashes.',
          'If worries feel relentless, disrupt sleep, and cause panic symptoms or somatic distress for over two consecutive weeks, it likely warrants a therapist checklist.',
          'Mood shifts only have emotional impacts, never physical ones.',
          'Healthy emotional changes never involve sadness or tearfulness.'
        ],
        correctAnswerIndex: 1,
        explanation: 'While emotional variability is standard due to hormonal sweeps, prolonged daily panic, muscle tightness, insomnia due to worry, or constant distress points towards prenatal anxiety or depression, which reacts beautifully to specialized maternal psychotherapy.'
      }
    ]
  }
];
