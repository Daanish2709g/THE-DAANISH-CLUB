import { QuizQuestion, QuizAnswers, StyleQuizResult } from '../types/quiz';
import { SuitProduct } from '../types/suit';

export const STYLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-occasion',
    number: 1,
    category: 'occasion',
    title: 'What is your primary sartorial occasion?',
    subtitle: 'Select the signature ambiance and setting for your bespoke commission.',
    options: [
      {
        id: 'black-tie-gala',
        label: 'Black-Tie Gala & State Banquets',
        sublabel: 'Opera premieres, diplomatic galas, and sovereign evening receptions.',
        tag: 'Evening Formal',
        suitScores: {
          'sovereign-black-tie': 40,
          'imperial-emerald-smoking': 25,
          'royal-wedding-bandhgala': 20,
          'aurelia-bridal-couture': 15,
        },
        fabricIdMatch: 'loro-piana-super160',
      },
      {
        id: 'executive-boardroom',
        label: 'High-Stakes Executive & Boardroom',
        sublabel: 'Global summits, corporate acquisitions, and transatlantic business travel.',
        tag: 'Power Tailoring',
        suitScores: {
          'milanese-executive-pin': 40,
          'athena-boardroom-women': 38,
          'sovereign-black-tie': 10,
        },
        fabricIdMatch: 'zegna-trofeo-pinstripe',
      },
      {
        id: 'bridal-wedding',
        label: 'Haute Bridal & Milestone Wedding',
        sublabel: 'Bespoke nuptials, cathedral weddings, and unforgettable bridal ceremonies.',
        tag: 'Ceremonial Couture',
        suitScores: {
          'aurelia-bridal-couture': 45,
          'royal-wedding-bandhgala': 40,
          'sovereign-black-tie': 15,
        },
        fabricIdMatch: 'dormeuil-silk-bridal',
      },
      {
        id: 'celebration-red-carpet',
        label: 'Red Carpet, Private Club & Milestone Celebrations',
        sublabel: 'Art biennales, VIP afterparties, and distinctive celebration soirees.',
        tag: 'Artisanal Statement',
        suitScores: {
          'imperial-emerald-smoking': 45,
          'royal-wedding-bandhgala': 25,
          'sovereign-black-tie': 20,
          'aurelia-bridal-couture': 20,
        },
        fabricIdMatch: 'vbc-emerald-velvet',
      },
    ],
  },
  {
    id: 'q2-silhouette',
    number: 2,
    category: 'silhouette',
    title: 'Which shoulder architecture & silhouette commands your posture?',
    subtitle: 'Our master cutters balance structure with ease to frame your torso.',
    options: [
      {
        id: 'savile-row-structured',
        label: 'Savile Row Structured & Roped Shoulder',
        sublabel: 'Architectural canvassing, pronounced chest roping, and crisp waist suppression.',
        tag: 'English Architectural',
        suitScores: {
          'sovereign-black-tie': 30,
          'royal-wedding-bandhgala': 25,
          'athena-boardroom-women': 25,
        },
      },
      {
        id: 'milanese-soft',
        label: 'Milanese Soft Shoulder (Spalla Camicia)',
        sublabel: 'Fluid unpadded shoulder head that contours naturally to your motion.',
        tag: 'Italian Sfoltito',
        suitScores: {
          'milanese-executive-pin': 30,
          'imperial-emerald-smoking': 28,
          'aurelia-bridal-couture': 25,
        },
      },
      {
        id: 'double-breasted-power',
        label: 'Sculpted Crossover Double-Breasted',
        sublabel: 'Commanding 4x2 or 6x2 stance with sweeping peaked lapels for maximum presence.',
        tag: 'High-Status Crossover',
        suitScores: {
          'athena-boardroom-women': 35,
          'royal-wedding-bandhgala': 30,
          'sovereign-black-tie': 15,
        },
      },
      {
        id: 'modern-sculptural-fluid',
        label: 'Modern Sculptural & Elongated Drape',
        sublabel: 'Tapered high-waist line paired with a generous, liquid drape cascade.',
        tag: 'Haute Drape',
        suitScores: {
          'aurelia-bridal-couture': 35,
          'imperial-emerald-smoking': 25,
          'milanese-executive-pin': 15,
        },
      },
    ],
  },
  {
    id: 'q3-style-icon',
    number: 3,
    category: 'style-icon',
    title: 'Which sartorial muse reflects your personal aesthetic?',
    subtitle: 'Select the icon whose understated charisma and tailoring legacy you admire.',
    options: [
      {
        id: 'james-bond',
        label: 'The Sovereign Agent (Sean Connery / James Bond)',
        sublabel: 'Savile Row perfection: impeccably disciplined midnight tuxedos, effortless danger.',
        tag: 'Sovereign Discretion',
        suitScores: {
          'sovereign-black-tie': 35,
          'milanese-executive-pin': 15,
        },
      },
      {
        id: 'giorgio-armani',
        label: 'The Milanese Maestro (Giorgio Armani & Gianni Agnelli)',
        sublabel: 'Relaxed transatlantic elegance, soft deconstructed power, and sprezzatura.',
        tag: 'Effortless Sprezzatura',
        suitScores: {
          'milanese-executive-pin': 35,
          'imperial-emerald-smoking': 20,
        },
      },
      {
        id: 'ralph-lauren-purple',
        label: 'The Aristocratic Connoisseur (Ralph Lauren Purple Label)',
        sublabel: 'Precious noble materials, 24-carat gold detailing, and heritage equestrian polish.',
        tag: 'Noble Aristocracy',
        suitScores: {
          'royal-wedding-bandhgala': 35,
          'sovereign-black-tie': 20,
          'imperial-emerald-smoking': 20,
        },
      },
      {
        id: 'bianca-jagger',
        label: 'The Modern Couture Vanguard (Bianca Jagger / Tilda Swinton)',
        sublabel: 'Sculpted white silk, fearless gender-fluid tailoring, and sculptural haute couture.',
        tag: 'Vanguard Couture',
        suitScores: {
          'aurelia-bridal-couture': 35,
          'athena-boardroom-women': 30,
        },
      },
    ],
  },
  {
    id: 'q4-fabric-texture',
    number: 4,
    category: 'fabric-texture',
    title: 'Which tactile sensation and cloth character appeals to your touch?',
    subtitle: 'Our fabrics originate exclusively from centuries-old Biella and Yorkshire mills.',
    options: [
      {
        id: 'tasmanian-super160',
        label: 'Tasmanian Super 160s Virgin Merino Wool',
        sublabel: 'Buttery 15.5-micron worsted twill with razor-sharp crease retention.',
        tag: 'Loro Piana',
        suitScores: {
          'sovereign-black-tie': 30,
          'milanese-executive-pin': 15,
        },
        fabricIdMatch: 'loro-piana-super160',
      },
      {
        id: 'silk-weft-pinstripe',
        label: 'Australian Long-Staple with Silk Weft Pinstripe',
        sublabel: 'Crisp transatlantic resilience that moves effortlessly without creasing.',
        tag: 'Ermenegildo Zegna',
        suitScores: {
          'milanese-executive-pin': 30,
          'athena-boardroom-women': 15,
        },
        fabricIdMatch: 'zegna-trofeo-pinstripe',
      },
      {
        id: 'gold-thread-cloth',
        label: 'Scabal Super 180s with 24-Carat Gold Filaments',
        sublabel: 'Rare precious metal weave that catches candlelight with regal distinction.',
        tag: 'Scabal Huddersfield',
        suitScores: {
          'royal-wedding-bandhgala': 35,
          'sovereign-black-tie': 15,
        },
        fabricIdMatch: 'scabal-gold-treasure',
      },
      {
        id: 'mulberry-silk-duchesse',
        label: 'Mulberry Silk Duchesse with Fine Kid Mohair',
        sublabel: 'Fluid, gleaming French silk with architectural body for sculpted lapels.',
        tag: 'Dormeuil Paris',
        suitScores: {
          'aurelia-bridal-couture': 35,
        },
        fabricIdMatch: 'dormeuil-silk-bridal',
      },
      {
        id: 'cotton-silk-velvet',
        label: 'Vitale Barberis Deep Jewel Cotton-Silk Velvet',
        sublabel: 'Rich 3.5mm cut pile with acoustic dampening and dramatic ambient depth.',
        tag: 'Vitale Barberis',
        suitScores: {
          'imperial-emerald-smoking': 35,
        },
        fabricIdMatch: 'vbc-emerald-velvet',
      },
    ],
  },
  {
    id: 'q5-color-palette',
    number: 5,
    category: 'color-palette',
    title: 'What color mood and visual tone captures your presence?',
    subtitle: 'From sovereign darkness to radiant bridal ivory and jewel-tone opulence.',
    options: [
      {
        id: 'obsidian-midnight',
        label: 'Obsidian Midnight & Jet Black',
        sublabel: 'Understated, timeless, and strictly authoritative.',
        tag: 'Obsidian Noir',
        suitScores: {
          'sovereign-black-tie': 25,
          'milanese-executive-pin': 10,
        },
      },
      {
        id: 'titanium-navy',
        label: 'Royal Sovereign Navy & Brushed Titanium',
        sublabel: 'Dynamic boardroom confidence with modern European sharpness.',
        tag: 'Executive Sovereign',
        suitScores: {
          'athena-boardroom-women': 25,
          'milanese-executive-pin': 25,
        },
      },
      {
        id: 'aurelia-ivory',
        label: 'Aurelia Ivory & Warm Champagne',
        sublabel: 'Radiant, ethereal, and luminescent for celebratory milestones.',
        tag: 'Haute Bridal',
        suitScores: {
          'aurelia-bridal-couture': 28,
          'royal-wedding-bandhgala': 15,
        },
      },
      {
        id: 'emerald-jewel',
        label: 'Imperial Emerald & 24K Gold Inlay',
        sublabel: 'Aristocratic jewel tones designed for private galas and evening celebrations.',
        tag: 'Opulent Jewel',
        suitScores: {
          'imperial-emerald-smoking': 28,
          'royal-wedding-bandhgala': 25,
        },
      },
    ],
  },
];

/**
 * Master scoring engine to match quiz answers to the optimal bespoke suit commission
 */
export function evaluateQuizAnswers(
  answers: QuizAnswers,
  catalog: SuitProduct[]
): StyleQuizResult {
  const scores: Record<string, number> = {};

  // Initialize all catalog suits with baseline score
  catalog.forEach((suit) => {
    scores[suit.id] = 10;
  });

  let preferredFabricId = 'loro-piana-super160';

  // Iterate answers and aggregate affinity points
  STYLE_QUIZ_QUESTIONS.forEach((question) => {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) return;

    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;

    if (selectedOption.fabricIdMatch) {
      preferredFabricId = selectedOption.fabricIdMatch;
    }

    Object.entries(selectedOption.suitScores).forEach(([suitId, points]) => {
      scores[suitId] = (scores[suitId] || 0) + points;
    });
  });

  // Sort suits by highest score
  const sortedSuits = [...catalog].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));

  const recommendedSuit = sortedSuits[0] || catalog[0];
  const secondarySuit = sortedSuits[1] || undefined;

  const topScore = scores[recommendedSuit.id] || 100;
  const matchScore = Math.min(99, Math.max(88, Math.round((topScore / 165) * 100)));

  // Derive master cutter persona and architectural rationale
  const archetypeMap: Record<
    string,
    {
      title: string;
      summary: string;
      rationale: string;
      lapel: string;
      silhouette: string;
      stylingTips: string[];
    }
  > = {
    'sovereign-black-tie': {
      title: 'The Sovereign Savile Row Connoisseur',
      summary: 'You embody the highest standard of formal black-tie discipline—where perfection lies in floating canvas architecture and hand-rolled silk grosgrain.',
      rationale:
        'Your answers prioritize timeless black-tie formality and Savile Row structured shoulders. The Sovereign Tuxedo cut from Loro Piana Super 160s Tasmanian wool delivers natural chest curvature with zero synthetic stiffness, ensuring you command any evening gala.',
      lapel: 'Hand-Rolled Silk Peak Lapel',
      silhouette: 'Savile Row Structured with Floating Horsehair Canvas',
      stylingTips: [
        'Pair with a pleated Swiss cotton Marcella bib shirt and 24K gold studs.',
        'Opt for a hand-tied silk grosgrain bow tie calibrated to your lapel width.',
        'Request our bespoke silk monogram in Champagne Gold inside the breast welt.',
      ],
    },
    'aurelia-bridal-couture': {
      title: 'The Haute Bridal & Modern Couture Visionary',
      summary: 'You celebrate architectural power, radiant French silk, and unapologetic bridal distinction that defies conventional gowns.',
      rationale:
        'Your profile seeks luminous ceremonial grace and sculptural couture drape. The Aurelia Tuxedo in Dormeuil Mulberry Silk Duchesse offers pagoda shoulders and hand-embroidered gold bullion vines that float effortlessly down the aisle.',
      lapel: 'Sculpted Peak Lapel with Gold Filigree',
      silhouette: 'Milanese Contoured Soft Tailoring with Concealed Corset Stay',
      stylingTips: [
        'Wear without an undershirt or with a sheer silk organza camisole.',
        'Pair with pointed satin pumps and understated diamond drop earrings.',
        'Choose our custom cigarette trouser with silk side galon trim.',
      ],
    },
    'milanese-executive-pin': {
      title: 'The Milanese Executive & Transatlantic Powerhouse',
      summary: 'You command boardroom negotiations with relaxed sprezzatura, fluid motion, and crisp razor-sharp pinstripes.',
      rationale:
        'Your answers gravitate toward power tailoring with comfortable, natural shoulder movement. The Milanese Executive Pinstripe cut from Zegna Trofeo wool with silver micro-pinstripes moves seamlessly between transatlantic flights and executive summits.',
      lapel: 'High-Gorge Notch Lapel with Milanese Buttonhole',
      silhouette: 'Milanese Soft Shoulder (Spalla Camicia) with Roped Crown',
      stylingTips: [
        'Style with a powder blue Sea Island cotton shirt and grenadine silk tie.',
        'Opt for flat-front trousers with brass side-adjusters in lieu of belts.',
        'Specify the barchetta curved chest pocket for your titanium reading glasses.',
      ],
    },
    'imperial-emerald-smoking': {
      title: 'The Imperial Red Carpet & Velvet Luminary',
      summary: 'You appreciate aristocratic textures, dramatic candlelight reflection, and the plush elegance of fine Biella silk-cotton velvet.',
      rationale:
        'Your choices demand evening presence and rich tactile opulence. The Imperial Smoking Jacket in Vitale Barberis deep emerald velvet with a sculpted ottoman silk shawl collar creates a magnetic visual aura under evening illumination.',
      lapel: 'Curved Silk Ottoman Shawl Collar',
      silhouette: 'Milanese Soft Waist Hug with Deep Double Vents',
      stylingTips: [
        'Complement with midnight tuxedo trousers and black patent leather slippers.',
        'Personalize your interior lining with a secret embroidered quote.',
        'Accompany with a matching silk cummerbund and obsidian cuff links.',
      ],
    },
    'athena-boardroom-women': {
      title: 'The Sovereign Leadership & Double-Breasted Authority',
      summary: 'You command spaces through unapologetic structure, architectural shoulders, and commanding double-breasted crossover drape.',
      rationale:
        'Your responses highlight female executive authority and structured tailoring. The Athena Power Suit in Loro Piana cashmere-wool blend provides full floating canvas chest support and bold peak lapels that project enduring poise.',
      lapel: 'Broad Sovereign Peak Lapels',
      silhouette: 'Structured Savile Row Double-Breasted Crossover',
      stylingTips: [
        'Style over an ivory silk crepe de chine blouse or high-neck knit.',
        'Select our wide-leg pleated palazzo trouser for fluid, statuesque stride.',
        'Add custom engraved horn anchor buttons for tailored distinction.',
      ],
    },
    'royal-wedding-bandhgala': {
      title: 'The Ceremonial Aristocrat & 24K Gold Heir',
      summary: 'You honor milestone celebrations with the pinnacle of English textile mastery—Super 180s wool woven with genuine 24-carat gold filaments.',
      rationale:
        'Your aesthetic reflects regal English heritage and rare precious metals. The Imperial Three-Piece commissioned from Scabal Gold Treasure cloth elevates your wedding ceremony with real gold filaments that gleam under ambient illumination.',
      lapel: 'Regal Crossover with Horseshoe Evening Waistcoat',
      silhouette: 'Savile Row Structured Three-Piece with Floating Canvas',
      stylingTips: [
        'Wear with the matching 4-button horseshoe evening waistcoat.',
        'Pair with antique gold pocket watch chain attached to the waistcoat welt.',
        'Commission matching cedar travel trunk packaging for heirloom protection.',
      ],
    },
  };

  const persona = archetypeMap[recommendedSuit.id] || archetypeMap['sovereign-black-tie'];

  return {
    recommendedSuit,
    secondarySuit,
    matchScore,
    archetypeTitle: persona.title,
    stylePersonaSummary: persona.summary,
    cutterRationale: persona.rationale,
    recommendedFabricId: preferredFabricId || recommendedSuit.fabricDefault,
    suggestedLapel: persona.lapel,
    suggestedSilhouette: persona.silhouette,
    stylingTips: persona.stylingTips,
  };
}
