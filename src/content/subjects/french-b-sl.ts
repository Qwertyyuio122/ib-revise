import { SubjectPack } from '../schemas';

export const frenchBSlPack: SubjectPack = {
  subject: {
    slug: 'fr',
    name: 'French B',
    level: 'SL',
    syllabusFirstAssessment: '2020',
    themeTokens: {
      wash1: 'rgba(186,230,253,0.62)',
      wash2: 'rgba(209,250,229,0.42)',
      wash3: 'rgba(240,249,255,0.6)',
      accent: '#0284C7',
      soft: '#F0F9FF',
      cardGradient: 'linear-gradient(135deg,#0369A1,#38BDF8)',
    },
    iaConfig: {
      iaLabel: 'French B SL',
      iaTitle: 'Individual Oral Stimulus',
      maxMarks: 30,
      wordOrTimeLimit: '12–15 minutes (15 min prep)',
      weightPercent: 25,
      steps: [
        'Pick 1 of 5 IB themes',
        'Build visual stimulus notes',
        'Practice Q&A with Sprout',
      ],
      criteria: [
        {
          code: 'A',
          name: 'Criterion A: Language (12 marks)',
          maxMarks: 12,
          weightPercent: 40,
          summary:
            'Assesses the variety, accuracy, and effectiveness of vocabulary, idiomatic expressions, grammatical structures, and pronunciation/intonation across all three parts of the oral.',
          topBandExpectations: [
            'Vocabulary is varied, appropriate to the task, and includes authentic French idiomatic expressions.',
            'Basic and more complex grammatical structures (subjonctif, conditionnel, pronoms relatifs, si clauses) are used effectively.',
            'Pronunciation and intonation are very clear and actively enhance communication.',
          ],
          commonPitfalls: [
            'Relying solely on present tense and repetitive A2/B1 adjectives (bon, intéressant, important).',
            'Using English calques or faux amis (actuellement for actually, assister vs attendre).',
            'Mispronouncing nasal vowels or silent final consonants in ways that obscure tense (parlé vs parlais).',
          ],
        },
        {
          code: 'B1',
          name: 'Criterion B1: Message — Visual Stimulus (6 marks)',
          maxMarks: 6,
          weightPercent: 20,
          summary:
            'Evaluates the 3–4 minute presentation on the chosen visual stimulus, requiring both explicit description and implicit interpretation explicitly anchored in Francophone culture.',
          topBandExpectations: [
            'Presentation is consistently relevant to the visual stimulus and draws on both explicit and implicit details.',
            'Provides balanced visual descriptions alongside thoughtful personal interpretations and problematization.',
            'Establishes clear, specific links to target Francophone culture(s) (France, Québec, Belgique, Suisse romande, Afrique francophone).',
          ],
          commonPitfalls: [
            'Spending the entire 3–4 minutes cataloguing objects in the photo without interpreting the deeper social issue.',
            'Talking only about one’s own home country without connecting the stimulus to the Francophone world.',
            'Memorizing a generic pre-written speech on the theme that ignores specific visual details of the image.',
          ],
        },
        {
          code: 'B2',
          name: 'Criterion B2: Message — Conversation (6 marks)',
          maxMarks: 6,
          weightPercent: 20,
          summary:
            'Evaluates the scope, depth, relevance, and personal reflection of responses during the follow-up discussion on the visual stimulus theme (Part 2) and the general discussion on a second theme (Part 3).',
          topBandExpectations: [
            'Responses are consistently relevant, appropriate, and well-developed with concrete examples.',
            'Contributions are broad in scope and depth, offering nuanced personal interpretations and cultural comparisons.',
            'Includes natural attempts to engage the interlocutor and expand on ideas independently.',
          ],
          commonPitfalls: [
            'Giving one-sentence or yes/no answers that force the teacher to constantly prompt for elaboration.',
            'Repeating the exact same examples already used during the Part 1 presentation.',
            'Failing to pivot smoothly when the teacher transitions from Part 2 to the new IB theme in Part 3.',
          ],
        },
        {
          code: 'C',
          name: 'Criterion C: Interactive skills — Communication (6 marks)',
          maxMarks: 6,
          weightPercent: 20,
          summary:
            'Assesses comprehension, spontaneity, and the ability to sustain an authentic, autonomous conversation in French throughout Parts 2 and 3.',
          topBandExpectations: [
            'Comprehension and interaction are consistently sustained without hesitation that impedes flow.',
            'Candidate responds accurately to nuanced or unexpected teacher questions in French.',
            'Participation is active and autonomous, using natural conversational fillers and repair strategies in French.',
          ],
          commonPitfalls: [
            'Switching to English when unsure of a word instead of paraphrasing or asking for clarification in French.',
            'Reciting robotic bullet points rather than reacting directly to the teacher’s specific question.',
            'Freezing when asked a hypothetical or opinion question instead of using natural thinking-time phrases.',
          ],
        },
      ],
      exemplarTitle: 'Le télétravail et le droit à la déconnexion en France (Thème : Organisation sociale)',
      exemplarResearchQuestion:
        'Dans quelle mesure la généralisation du télétravail transforme-t-elle l’équilibre entre vie professionnelle et vie privée dans le monde francophone ?',
      exemplarScore: '28 / 30 (Grade 7)',
      exemplarSections: [
        {
          sectionTitle: 'Phase 1 & 2 : Accroche, Description Explicite et Interprétation Implicite',
          excerptMarkdown:
            '« J’ai choisi cette photographie qui s’inscrit directement dans le thème *Organisation sociale*, et plus précisément dans le sous-thème du *monde du travail*. Au premier plan, on distingue une jeune femme assise à la table de sa cuisine, les yeux rivés sur son ordinateur portable alors que son enfant essaie d’attirer son attention à l’arrière-plan. L’éclairage sombre suggère qu’il est tard le soir. Au-delà de ce que l’on voit littéralement, cette scène met le doigt sur un problème contemporain majeur : l’effacement de la frontière entre la sphère professionnelle et la vie familiale. Bien que le télétravail offre une certaine flexibilité, il devient souvent une arme à double tranchant. »',
          examinerCommentary:
            'Immediately anchors the stimulus in the prescribed IB theme and subtopic, contrasts foreground/background details, and transitions naturally from explicit visual evidence to an implicit thematic tension using B2 idioms (*mettre le doigt sur*, *une arme à double tranchant*).',
          criterionRef: 'Criterion A & Criterion B1',
        },
        {
          sectionTitle: 'Phase 3 : Ancrage Culturel Francophone et Ouverture Interactive',
          excerptMarkdown:
            '« Ce phénomène est particulièrement débattu en France, qui a été un pays pionnier en adoptant dès 2017 la *loi El Khomri* instaurant le **droit à la déconnexion**. Cette mesure oblige les entreprises de plus de cinquante salariés à définir des horaires durant lesquels les employés ne sont pas tenus de répondre aux courriels professionnels. De même, au Québec, le gouvernement encadre désormais le télétravail hybride afin qu’il ne nuise pas à la santé mentale des travailleurs. Personnellement, j’estime qu’il est essentiel que les employeurs respectent ce temps de repos. Et vous, pensez-vous que la loi suffise à changer les mentalités ? »',
          examinerCommentary:
            'Secures top band (6/6) in Criterion B1 by citing concrete legal and cultural realities in both France (*le droit à la déconnexion*) and Quebec, while deploying the subjunctive (*afin qu’il ne nuise pas*, *il est essentiel que... respectent*) and engaging the examiner directly.',
          criterionRef: 'Criterion B1, Criterion B2 & Criterion C',
        },
      ],
    },
    spotlight: {
      title: 'French B SL Themes & Text-Type Studio',
      pills: [
        { label: '5 IB Themes (Identités, Expériences...)', href: '/subjects/fr?tab=topics' },
        { label: 'Paper 1 Text Types', href: '/tools/french-studio' },
        { label: 'Paper 2 Reading', href: '/questions?subject=fr&paper=Paper+2' },
        { label: 'Subjonctif & Conditionnel', href: '/tools/french-studio?tab=grammar' },
      ],
    },
    practiceTools: [
      {
        title: 'Questionbank',
        description: 'Paper 1 writing prompts & Paper 2 reading comprehension passages across all 5 IB themes.',
        bgHex: '#E0F2FE',
        colorHex: '#0284C7',
        href: '/questions?subject=fr',
        iconName: 'questionbank',
      },
      {
        title: 'Text-Type & Register Drills',
        description: 'Master Paper 1 conventions, salutations, register (tu/vous), and Criterion C text-type selection.',
        bgHex: '#CCFBF1',
        colorHex: '#0D9488',
        href: '/tools/french-studio',
        iconName: 'text_type',
      },
      {
        title: 'Blurting in French',
        description: '3–5 minute active recall sprints in French on Francophone culture, vocabulary, and grammar.',
        bgHex: '#FEF3C7',
        colorHex: '#D97706',
        href: '/tools/blurting?subject=fr',
        iconName: 'blurting',
      },
      {
        title: 'Teach Sprout (en français)',
        description: 'Coach Sprout through faux amis, subjunctive triggers, register slips, and IO cultural anchors.',
        bgHex: '#DCFCE7',
        colorHex: '#15803D',
        href: '/tools/teach-sprout?subject=fr',
        iconName: 'teach_sprout',
      },
      {
        title: 'Exam Builder',
        description: 'Build timed SL Paper 1 (75 min) and Paper 2 Reading (60 min) mock papers.',
        bgHex: '#F1F5F9',
        colorHex: '#334155',
        href: '/questions?subject=fr&mode=exam',
        iconName: 'exam_builder',
      },
      {
        title: 'Mistakes Log',
        description: 'Track faux amis, gender traps, participle agreements, and Paper 2 citation errors.',
        bgHex: '#FFE4E6',
        colorHex: '#E11D48',
        href: '/questions?subject=fr&mode=mistakes',
        iconName: 'mistakes_log',
      },
    ],
    learnTools: [
      {
        title: 'Grammar & Conjugation Lab',
        description: 'Interactive reference for subjonctif, si clauses, past tenses, relative pronouns, and passive voice.',
        bgHex: '#E0F2FE',
        colorHex: '#0369A1',
        href: '/tools/french-studio?tab=grammar',
        iconName: 'grammar_lab',
      },
      {
        title: 'Thematic Vocab Decks',
        description: 'Spaced-repetition flashcards for the 5 IB themes, idioms, and subjunctive triggers.',
        bgHex: '#FEF3C7',
        colorHex: '#B45309',
        href: '/flashcards?subject=fr',
        iconName: 'flashcards',
      },
      {
        title: 'Connector Cheatsheets',
        description: 'Categorized B1/B2 connecteurs logiques with grammatical governance alerts.',
        bgHex: '#DCFCE7',
        colorHex: '#15803D',
        href: '/cheatsheets?subject=fr',
        iconName: 'cheatsheets',
      },
      {
        title: 'AI French Writing Studio',
        description: 'Draft 250–400 word Paper 1 texts or IO notes with live Criterion A/B/C rubric feedback.',
        bgHex: '#F1F5F9',
        colorHex: '#1E3A5F',
        href: '/essay-studio?subject=fr',
        iconName: 'essay_studio',
      },
    ],
  },
  topics: [
    {
      id: 'fr-T1',
      subjectSlug: 'fr',
      unitCode: 'Thème 1',
      unitTitle: 'Identités',
      code: 'fr-T1',
      title: 'Identités : Styles de vie, santé, laïcité et francophonie',
      levelScope: 'SL/Core',
      recommendedHours: 24,
      guidingQuestions: [
        'Comment les langues que nous parlons façonnent-elles notre identité culturelle et personnelle ?',
        'Dans quelle mesure nos choix quotidiens (alimentation, numérique, loisirs) reflètent-ils nos valeurs ?',
        'Comment concilier la préservation des identités culturelles et la laïcité dans une société multiculturelle ?',
      ],
      understandings: [
        {
          code: 'fr-T1.1',
          text: 'Styles de vie, santé et bien-être : l’équilibre vie professionnelle/vie privée (les 35 heures, le droit à la déconnexion), le Programme National Nutrition Santé (PNNS) et la santé mentale des jeunes face aux écrans.',
          isHL: false,
        },
        {
          code: 'fr-T1.2',
          text: 'Convictions, valeurs et sous-cultures : le principe républicain de la laïcité (loi de 1905 et loi de 2004 dans les écoles publiques), le vivre-ensemble et les sous-cultures urbaines (rap francophone, slam, street art).',
          isHL: false,
        },
        {
          code: 'fr-T1.3',
          text: 'Langue et identité : la diversité de la Francophonie (OIF), la protection du français au Québec (Loi 101 / Loi 96), les langues régionales (breton, occitan, créole) et les registres sociolectaux (verlan, franglais).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Principe directeur du thème *Identités*
Explorer la nature du soi et ce que signifie « être humain » à travers les habitudes de vie, la santé, les croyances et l'appartenance linguistique.

### 2. Ancrages culturels francophones incontournables (Paper 1 & Oral Individuel)
- **Santé et styles de vie en France :** Le **PNNS** (*Programme National Nutrition Santé*) promeut des campagnes telles que *« Manger au moins 5 fruits et légumes par jour »* et le système d'étiquetage **Nutri-Score** (de A à E) pour lutter contre la malbouffe et la sédentarité.
- **La laïcité républicaine :** En France, la loi de 1905 sépare l'Église et l'État. Depuis la loi de mars 2004, le port de signes ou tenues manifestant ostensiblement une appartenance religieuse est interdit dans les écoles, collèges et lycées publics afin de garantir la neutralité et la liberté de conscience.
- **Langue et identité dans la Francophonie :** Au **Québec**, la *Charte de la langue française* (**Loi 101**, renforcée par la **Loi 96**) protège le français face à l'anglais en Amérique du Nord. En France et en Afrique francophone, le français coexiste avec des langues régionales ou nationales (wolof au Sénégal, créole aux Antilles, breton en Bretagne) ainsi qu'avec l'argot des jeunes (*le verlan* : *louche → chelou*, *fête → teuf*).

### 3. Expressions idiomatiques clés à mobiliser
- **être bien dans sa peau** : se sentir à l'aise avec soi-même.
- **avoir une bonne hygiène de vie** : adopter des habitudes saines (sommeil, sport, alimentation équilibrée).
- **aller au-delà des apparences** : dépasser les préjugés et les stéréotypes.`,
      cheatsheetMarkdown: `| Sous-thème | Vocabulaire B2 Clé | Exemple d'ancrage francophone |
| :--- | :--- | :--- |
| **Santé & bien-être** | *l'épanouissement (m), sédentaire, l'alimentation équilibrée (f)* | Le **Nutri-Score** et la campagne du PNNS en France |
| **Valeurs & croyances** | *la laïcité, le vivre-ensemble, le préjugé, tolérant(e)* | La loi de 2004 sur les signes religieux à l'école publique |
| **Langue & identité** | *la diversité linguistique, l'appartenance (f), le bilinguisme* | La **Loi 101** au Québec ; l'Organisation internationale de la Francophonie (OIF) |`,
      blurtChecklist: [
        'Définir « la laïcité » en français et citer un exemple de son application dans les écoles publiques françaises.',
        'Expliquer comment la Loi 101 au Québec illustre le lien entre langue et identité culturelle.',
        'Utiliser 3 expressions idiomatiques du thème Identités (« être bien dans sa peau », « avoir une bonne hygiène de vie », « prendre soin de soi »).',
        'Rédiger une recommandation sur la santé mentale des jeunes en utilisant « il est essentiel que + subjonctif ».',
      ],
    },
    {
      id: 'fr-T2',
      subjectSlug: 'fr',
      unitCode: 'Thème 2',
      unitTitle: 'Expériences',
      code: 'fr-T2',
      title: 'Expériences : Voyages, rites de passage, coutumes et migration',
      levelScope: 'SL/Core',
      recommendedHours: 24,
      guidingQuestions: [
        'Comment les voyages et le dépaysement transforment-ils notre regard sur le monde ?',
        'Pourquoi les coutumes et les rites de passage restent-ils essentiels dans une société moderne ?',
        'Quels défis humains et culturels les migrants rencontrent-ils lorsqu’ils s’adaptent à un nouveau pays ?',
      ],
      understandings: [
        {
          code: 'fr-T2.1',
          text: 'Activités de loisirs, vacances et voyages : l’opposition entre le tourisme de masse (surtourisme) et l’écotourisme / tourisme solidaire, les colonies de vacances et le réseau ferroviaire (TGV).',
          isHL: false,
        },
        {
          code: 'fr-T2.2',
          text: 'Rites de passage, coutumes et traditions : le baccalauréat (« le bac »), la majorité à 18 ans, le bal des finissants au Québec, et les fêtes patrimoniales (Épiphanie, Chandeleur, 14 juillet, Carnaval de Québec).',
          isHL: false,
        },
        {
          code: 'fr-T2.3',
          text: 'Récits de vie et migration : les parcours migratoires dans l’espace francophone, le déracinement, le choc culturel, l’intégration républicaine et l’enrichissement interculturel.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Principe directeur du thème *Expériences*
Explorer et raconter les histoires des événements, des expériences et des voyages qui façonnent notre vie et notre ouverture d'esprit.

### 2. Ancrages culturels francophones incontournables
- **Tourisme responsable vs. surtourisme :** La France est la première destination touristique mondiale, ce qui entraîne un phénomène de **surtourisme** dans des sites comme le Mont-Saint-Michel, les Calanques de Marseille (où un système de réservation obligatoire a été instauré en été) ou Paris. En réponse, l'**écotourisme** et le voyage en train (**TGV**) sont encouragés.
- **Rites de passage et traditions :** En France, l'obtention du **baccalauréat** (*le bac*) et l'accès à la **majorité civique à 18 ans** marquent le passage à l'âge adulte. Au Québec, la fin du secondaire est célébrée par le **bal des finissants**, et le 24 juin correspond à la **Fête nationale du Québec (Saint-Jean-Baptiste)**. En gastronomie, le *repas gastronomique des Français* est inscrit au patrimoine culturel immatériel de l'UNESCO.
- **Migration et intégration :** Les récits de migration mettent en lumière la tension entre le **déracinement** (*avoir le mal du pays*) et l'**intégration** sociale et linguistique dans les pays d'accueil francophones (France, Belgique, Suisse, Canada).

### 3. Temps du récit obligatoires pour ce thème
Pour raconter une expérience passée (journal intime, blog, article témoignage), alternez systématiquement :
- **L'imparfait** pour le décor, l'atmosphère et les habitudes (*Il faisait froid, je me sentais dépaysé...*).
- **Le passé composé** pour les actions ponctuelles et les tournants (*Soudain, j'ai rencontré..., cette expérience m'a ouvert les yeux*).
- **Le plus-que-parfait** pour l'antériorité (*J'avais toujours rêvé de visiter Dakar avant ce séjour*).`,
      cheatsheetMarkdown: `| Sous-thème | Vocabulaire B2 Clé | Expression idiomatique associée |
| :--- | :--- | :--- |
| **Vacances & voyages** | *le dépaysement, l'écotourisme (m), le patrimoine culturel* | *sortir des sentiers battus* / *sortir de sa zone de confort* |
| **Coutumes & rites** | *le rite de passage, transmettre une tradition, la convivialité* | *franchir une étape décisive* / *garder un souvenir impérissable* |
| **Migration & récits** | *le déracinement, le choc culturel, l'intégration (f), l'épreuve (f)* | *avoir le mal du pays* / *tirer des leçons d'une épreuve* |`,
      blurtChecklist: [
        'Comparer le tourisme de masse et l’écotourisme en donnant un exemple concret en France (ex. les Calanques de Marseille).',
        'Décrire un rite de passage francophone (le baccalauréat ou le bal des finissants) et son importance sociale.',
        'Raconter un souvenir marquant en combinant correctement l’imparfait, le passé composé et le plus-que-parfait.',
        'Expliquer la différence entre « le dépaysement » (souvent positif) et « le déracinement » (lié à la migration).',
      ],
    },
    {
      id: 'fr-T3',
      subjectSlug: 'fr',
      unitCode: 'Thème 3',
      unitTitle: 'Ingéniosité humaine',
      code: 'fr-T3',
      title: 'Ingéniosité humaine : Médias, technologie, IA et expressions artistiques',
      levelScope: 'SL/Core',
      recommendedHours: 24,
      guidingQuestions: [
        'L’intelligence artificielle et les réseaux sociaux rapprochent-ils les citoyens ou menacent-ils notre esprit critique ?',
        'Quel rôle l’art et le divertissement jouent-ils pour dénoncer les injustices sociales ?',
        'Comment encourager l’innovation scientifique tout en protégeant la vie privée et l’éthique ?',
      ],
      understandings: [
        {
          code: 'fr-T3.1',
          text: 'Communications et médias : les réseaux sociaux, les bulles de filtres algorithmiques, la lutte contre les infox (fausses informations) et la prévention du cyberharcèlement.',
          isHL: false,
        },
        {
          code: 'fr-T3.2',
          text: 'Technologie et innovation scientifique : l’interdiction du téléphone portable au collège en France, l’intelligence artificielle à l’école, la protection des données personnelles (CNIL / RGPD) et la fracture numérique.',
          isHL: false,
        },
        {
          code: 'fr-T3.3',
          text: 'Divertissements et expressions artistiques : l’exception culturelle française (quotas de chansons francophones à la radio, soutien au cinéma via le CNC), la bande dessinée franco-belge (le 9e art) et le Festival de Cannes.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Principe directeur du thème *Ingéniosité humaine*
Explorer les façons dont la créativité artistique, les médias et l'innovation technologique ou scientifique transforment notre quotidien.

### 2. Ancrages culturels francophones incontournables
- **L'exception culturelle française :** Pour protéger la création artistique face aux géants du streaming, la France et le Québec imposent des **quotas de diffusion** d'œuvres francophones à la radio et à la télévision, et financent le cinéma indépendant (Centre national du cinéma, **Festival de Cannes**, festival **Les Francofolies** à La Rochelle et Montréal). De même, la **bande dessinée franco-belge** (*Astérix, Tintin, Persepolis*, Festival d'Angoulême) est reconnue comme le « neuvième art ».
- **Numérique, école et vie privée :** Depuis 2018, la France interdit l'utilisation du téléphone portable dans les écoles primaires et les collèges (et expérimente la « pause numérique ») pour lutter contre le **cyberharcèlement** (numéro national **3018**) et favoriser la concentration. Par ailleurs, la **CNIL** (*Commission nationale de l'informatique et des libertés*) veille au respect du **RGPD** et de la vie privée des citoyens.
- **Innovation scientifique :** Le centre spatial guyanais à **Kourou** (fusée européenne *Ariane*) et l'**Institut Pasteur** à Paris incarnent l'excellence scientifique francophone.

### 3. Lexique argumentatif de haut niveau
- **une infox** (recommandation officielle pour *fake news*) → *vérifier ses sources*, *faire preuve d'esprit critique*.
- **la fracture numérique** : l'inégalité d'accès aux outils informatiques et à Internet (zones rurales dites « zones blanches », personnes âgées).
- **être à la pointe de la technologie** / **prendre du recul face aux écrans**.`,
      cheatsheetMarkdown: `| Sous-thème | Vocabulaire B2 Clé | Ancrage culturel / Institutionnel |
| :--- | :--- | :--- |
| **Médias & réseaux** | *une infox, l'algorithme (m), le cyberharcèlement, vérifier ses sources* | Le numéro d'aide **3018** contre le cyberharcèlement en France |
| **Technologie & IA** | *l'intelligence artificielle (f), la fracture numérique, les données personnelles* | La **CNIL**, le **RGPD** et l'interdiction du portable au collège |
| **Arts & divertissements** | *le chef-d'œuvre, la mise en scène, le neuvième art (la BD), le patrimoine* | L'**exception culturelle française**, le Festival de Cannes, Angoulême |`,
      blurtChecklist: [
        'Expliquer en quoi consiste « l’exception culturelle française » dans le domaine de la musique et du cinéma.',
        'Présenter deux avantages et deux risques de l’intelligence artificielle pour les lycéens en utilisant « bien que + subjonctif ».',
        'Définir « une infox » et « la fracture numérique » avec un exemple concret.',
        'Utiliser l’expression « être une arme à double tranchant » dans une phrase sur les réseaux sociaux.',
      ],
    },
    {
      id: 'fr-T4',
      subjectSlug: 'fr',
      unitCode: 'Thème 4',
      unitTitle: 'Organisation sociale',
      code: 'fr-T4',
      title: 'Organisation sociale : Éducation, monde du travail, engagement et solidarité',
      levelScope: 'SL/Core',
      recommendedHours: 24,
      guidingQuestions: [
        'Pourquoi la vie associative et le bénévolat sont-ils indispensables à la cohésion d’une communauté ?',
        'Comment le système éducatif et le monde du travail doivent-ils évoluer face aux aspirations des jeunes ?',
        'Où placer la limite entre la sécurité publique et le respect des libertés individuelles ?',
      ],
      understandings: [
        {
          code: 'fr-T4.1',
          text: 'Relations sociales, communauté et engagement social : la vie associative (loi 1901), le bénévolat (Les Restos du Cœur, Emmaüs), le Service Civique des jeunes et les colocations intergénérationnelles.',
          isHL: false,
        },
        {
          code: 'fr-T4.2',
          text: 'Éducation : l’organisation scolaire française (collège, lycée, baccalauréat, plateforme Parcoursup, Grandes Écoles vs universités), le débat sur l’uniforme scolaire et l’éducation inclusive.',
          isHL: false,
        },
        {
          code: 'fr-T4.3',
          text: 'Monde du travail et ordre public : l’insertion professionnelle des jeunes (stages, apprentissage), le télétravail, l’égalité salariale femmes-hommes, le droit de grève et la prévention de la délinquance.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Principe directeur du thème *Organisation sociale*
Explorer la manière dont les individus s'organisent collectivement au sein de la famille, de l'école, des associations, du monde professionnel et des institutions civiques.

### 2. Ancrages culturels francophones incontournables
- **Engagement associatif et solidarité :** En France, plus d'un million d'**associations loi 1901** animent la vie locale. Des organisations emblématiques comme **Les Restos du Cœur** (fondés par Coluche en 1985 pour distribuer des repas gratuits) et **Emmaüs** (fondé par l'abbé Pierre) reposent sur le **bénévolat**. Les jeunes de 16 à 25 ans peuvent également effectuer un **Service Civique** indemnisé de 6 à 12 mois au service de l'intérêt général.
- **Système éducatif :** Attention au faux ami majeur : en France, **le collège** accueille les élèves de 11 à 15 ans (de la 6e à la 3e, diplôme du *Brevet*), suivi du **lycée** (Seconde, Première, Terminale → *le baccalauréat*). Au Québec, entre le secondaire et l'université, les étudiants passent par le **CÉGEP**. En France, l'accès à l'enseignement supérieur passe par la plateforme nationale **Parcoursup**, souvent source de stress pour les lycéens.
- **Solidarité intergénérationnelle :** Face à la crise du logement étudiant et à l'isolement des personnes âgées, les **colocations intergénérationnelles** (un étudiant loge à faible coût chez un senior en échange d'une présence bienveillante) connaissent un fort essor à Paris, Lyon ou Bruxelles.

### 3. Vigilance lexicale (Faux amis du système scolaire et professionnel)
- *un collège* = middle school (≠ *l'université / la fac*).
- *passer un examen* = to sit/take an exam (≠ *réussir un examen* = to pass an exam).
- *un stage* = an internship ; *postuler à un emploi* = to apply for a job.`,
      cheatsheetMarkdown: `| Sous-thème | Vocabulaire B2 Clé | Ancrage culturel / Expression |
| :--- | :--- | :--- |
| **Communauté & engagement** | *la cohésion sociale, le bénévolat, une association caritative* | **Les Restos du Cœur**, le **Service Civique** ; *mettre la main à la pâte* |
| **Éducation** | *la scolarité, l'orientation scolaire (f), l'égalité des chances* | Le **lycée**, **Parcoursup**, le **CÉGEP** (Québec) |
| **Monde du travail** | *le télétravail, le chômage, un stage, la grève, précaire* | *Joindre les deux bouts* ; *faire entendre sa voix* |`,
      blurtChecklist: [
        'Expliquer la différence entre « passer un examen » et « réussir un examen », ainsi qu’entre « le collège » et « l’université ».',
        'Présenter le rôle d’une association caritative française comme Les Restos du Cœur ou le dispositif du Service Civique.',
        'Décrire le principe d’une colocation intergénérationnelle et montrer comment elle « fait d’une pierre deux coups ».',
        'Rédiger une proposition formelle au proviseur en utilisant le conditionnel présent (« Cette mesure permettrait de... »).',
      ],
    },
    {
      id: 'fr-T5',
      subjectSlug: 'fr',
      unitCode: 'Thème 5',
      unitTitle: 'Partage de la planète',
      code: 'fr-T5',
      title: 'Partage de la planète : Environnement, droits humains, égalité et mondialisation',
      levelScope: 'SL/Core',
      recommendedHours: 24,
      guidingQuestions: [
        'Les gestes écologiques individuels suffisent-ils face à l’urgence climatique, ou faut-il des lois contraignantes ?',
        'La mondialisation favorise-t-elle l’ouverture culturelle ou uniformise-t-elle nos modes de vie ?',
        'Comment aménager des villes durables sans abandonner les zones rurales ?',
      ],
      understandings: [
        {
          code: 'fr-T5.1',
          text: 'Environnement et éthique : le réchauffement climatique, la transition énergétique, la loi anti-gaspillage en France (interdiction du plastique à usage unique, don des invendus alimentaires), le tri sélectif et la consommation responsable.',
          isHL: false,
        },
        {
          code: 'fr-T5.2',
          text: 'Droits de l’homme, paix et égalité : l’héritage de la Déclaration des droits de l’homme et du citoyen (1789), l’action humanitaire (Médecins Sans Frontières), la parité femmes-hommes et la lutte contre les discriminations.',
          isHL: false,
        },
        {
          code: 'fr-T5.3',
          text: 'Mondialisation et environnements urbains/ruraux : le commerce équitable face à la fast-fashion, la « ville du quart d’heure » et les mobilités douces (Vélib’, pistes cyclables) face à la désertification rurale (déserts médicaux).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Principe directeur du thème *Partage de la planète*
Explorer les défis planétaires et les opportunités citoyennes qui relient les individus et les communautés dans le monde moderne.

### 2. Ancrages culturels francophones incontournables
- **Politiques écologiques en France :** La **loi AGEC (loi anti-gaspillage pour une économie circulaire)** interdit progressivement les emballages en plastique à usage unique (vaisselle jetable dans les fast-foods, suremballage des fruits et légumes) et oblige les supermarchés à donner leurs invendus alimentaires à des associations (loi Garot). De plus, pour réduire l'**empreinte carbone**, la France a interdit les vols intérieurs courts lorsqu'une alternative en train (**TGV**) de moins de 2h30 existe.
- **Urbanisme durable vs. zones rurales :** À Paris, le concept de **« la ville du quart d'heure »** vise à permettre à chaque habitant d'accéder à ses besoins essentiels (travail, commerces, écoles, espaces verts) à moins de 15 minutes à pied ou à vélo (**Vélib'**, pistes cyclables). À l'inverse, de nombreuses campagnes souffrent de l'isolement et des **déserts médicaux** (manque de médecins généralistes).
- **Action humanitaire et égalité :** Fondée à Paris en 1971, l'ONG **Médecins Sans Frontières (MSF)** (Prix Nobel de la paix) symbolise l'engagement humanitaire francophone.

### 3. Expressions idiomatiques à fort impact (Paper 1 & Oral)
- **tirer la sonnette d'alarme** : alerter l'opinion publique face à un danger imminent.
- **apporter sa pierre à l'édifice** / **faire sa part** : contribuer concrètement à une cause collective.
- **ce n'est que la partie émergée de l'iceberg** : ce n'est qu'un aspect visible d'un problème beaucoup plus vaste.`,
      cheatsheetMarkdown: `| Sous-thème | Vocabulaire B2 Clé | Ancrage culturel / Loi francophone |
| :--- | :--- | :--- |
| **Environnement** | *le développement durable, l'empreinte carbone (f), le gaspillage alimentaire* | La **loi anti-gaspillage (AGEC)**, interdiction des vols courts < 2h30 en train |
| **Villes & campagnes** | *les transports en commun, le covoiturage, l'exode rural, un désert médical* | **La ville du quart d'heure** et le **Vélib'** à Paris |
| **Égalité & mondialisation** | *le commerce équitable, la parité, la surconsommation, les droits de l'homme* | **Médecins Sans Frontières (MSF)** ; *tirer la sonnette d'alarme* |`,
      blurtChecklist: [
        'Citer deux mesures concrètes prises en France pour lutter contre le gaspillage alimentaire ou la pollution plastique.',
        'Expliquer le concept de « la ville du quart d’heure » et le contraster avec le problème des « déserts médicaux » ruraux.',
        'Utiliser « tirer la sonnette d’alarme » et « apporter sa pierre à l’édifice » dans un paragraphe sur le climat.',
        'Construire une phrase hypothétique de type 2 (« Si nous consommions de manière plus responsable, nous réduirions... »).',
      ],
    },
    {
      id: 'fr-P1-TEXTS',
      subjectSlug: 'fr',
      unitCode: 'Épreuve 1',
      unitTitle: 'Production écrite & Types de textes',
      code: 'fr-P1-TEXTS',
      title: 'Conventions des types de textes, registres de langue et Critère C',
      levelScope: 'SL/Core',
      recommendedHours: 15,
      guidingQuestions: [
        'Comment choisir le type de texte optimal parmi les trois options proposées à l’Épreuve 1 pour maximiser le Critère C (6/6) ?',
        'Comment adapter le registre de langue (familier, courant, soutenu) et le pronom d’adresse (tu, vous, on) au destinataire et au contexte ?',
        'Quelles conventions de mise en page et quelles formules d’ouverture et de clôture sont exigées pour chaque genre ?',
      ],
      understandings: [
        {
          code: 'fr-P1.1',
          text: 'Mécanique de l’Épreuve 1 SL (1h15, 250–400 mots, 30 points) : sélectionner 1 sujet parmi 3 (chacun lié à un thème différent) ET choisir le type de texte approprié parmi les 3 choix proposés.',
          isHL: false,
        },
        {
          code: 'fr-P1.2',
          text: 'Textes personnels, professionnels et médiatiques : maîtriser les codes structurels du courriel/lettre formelle, de l’article de journal, du billet de blog, du discours/allocution, de la brochure/dépliant et du rapport/proposition.',
          isHL: false,
        },
        {
          code: 'fr-P1.3',
          text: 'Double fonction communicative : chaque sujet d’Épreuve 1 SL exige deux objectifs distincts (ex. décrire une expérience ET convaincre les jeunes d’agir) qui doivent tous deux être pleinement développés (Critère B).',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Règle d'or du Critère C (*Compréhension conceptuelle* — 6 points)
À l'Épreuve 1 SL, chaque sujet est accompagné de **trois types de textes au choix** :
1. **Un type de texte pleinement approprié** au contexte, au destinataire et à l'objectif → débloque la bande **5–6 points**.
2. **Un type de texte généralement approprié** → plafonne généralement la note de Critère C à **3–4 points**.
3. **Un type de texte inapproprié** (ex. écrire un *journal intime* alors que la consigne demande de sensibiliser tous les élèves du lycée) → plafonne le Critère C à **1–2 points**.

### 2. Récapitulatif des 6 types de textes les plus fréquents à l'Épreuve 1 SL
- **Lettre formelle / Courriel officiel (*Registre soutenu, « vous » strict*) :** Coordonnées expéditeur/destinataire, lieu et date (*Lyon, le 15 mai 2026*), ligne **Objet : ...**, appel formel (*Madame la Proviseure, / Monsieur le Maire,*), paragraphes structurés avec connecteurs, et **formule de politesse obligatoire** (*Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.*).
- **Article de journal ou de magazine (*Registre courant/soutenu*) :** **Titre accrocheur** (souvent nominal ou interrogatif), **chapeau** résumant l'essentiel, signature (*Par Camille Martin*), **intertitres** structurant le corps du texte, citations ou témoignages entre guillemets français (« ... »), ouverture finale. **Attention : jamais de « Cher lecteur » ni de « Salut » !**
- **Billet de blog (*Registre courant ou familier maîtrisé*) :** Nom du blog + date + titre accrocheur, interpellation directe des internautes (*Bienvenue sur mon blog !*), ton personnel et engagé (*je* + *vous/tu*), sous-titres dynamiques, et **appel aux commentaires en clôture** (*Et vous, qu'en pensez-vous ? Laissez votre avis dans l'espace commentaires ci-dessous !*).
- **Discours / Exposé / Allocution (*Registre courant à soutenu, oralisé*) :** **Titre/contexte** facultatif puis **adresse directe au public dès la première ligne** (*Madame la Directrice, chers professeurs, chers camarades,*), questions rhétoriques, anaphores, pronoms inclusifs (*nous, notre*), connecteurs oraux, appel à l'action et **remerciement final** (*Je vous remercie de votre attention / de votre écoute.*).
- **Brochure / Dépliant / Prospectus (*Registre courant persuasif*) :** **Titre principal + slogan**, **intertitres sous forme de questions**, **listes à puces (• / ✓)** mettant en valeur des conseils concrets, impératifs (*Rejoignez-nous ! Adoptez les bons gestes !*), et **encadré d'informations pratiques en bas de page** (*Adresse, site web, téléphone, horaires*).
- **Proposition / Rapport officiel (*Registre soutenu/objectif*) :** En-tête formel (*Destinataire, Auteur, Date, Objet*), **sections numérotées avec sous-titres explicites** (*1. Constat actuel, 2. Objectifs du projet, 3. Mesures proposées, 4. Conclusion*), usage du conditionnel (*Ce projet permettrait de...*).`,
      cheatsheetMarkdown: `| Type de texte | Registre & Pronom | Ouverture obligatoire | Clôture obligatoire |
| :--- | :--- | :--- | :--- |
| **Lettre / Courriel formel** | Soutenu (*vous*) | *Objet : ...* + *Madame, Monsieur,* | *Veuillez agréer, Madame, Monsieur, mes salutations distinguées.* |
| **Article de presse** | Courant / Soutenu | **Titre accrocheur** + **Chapeau** + *Par [Nom]* | Conclusion avec question d'ouverture (sans formule de lettre !) |
| **Billet de blog** | Courant (*vous/tu*) | Nom du blog, date, titre + *Bienvenue à tous !* | *N'hésitez pas à réagir dans les commentaires ci-dessous !* |
| **Discours / Exposé** | Courant / Soutenu | *Mesdames et messieurs, chers camarades,* | Appel à l'action + *Je vous remercie de votre attention.* |
| **Brochure / Dépliant** | Courant persuasif | **Titre + Slogan** (avec sous-titres & puces •) | Encadré **Infos pratiques** (site web, tél., adresse) |`,
      blurtChecklist: [
        'Écrire de mémoire une formule de politesse complète pour une lettre formelle adressée à un maire ou un proviseur.',
        'Lister les 4 éléments visuels et structurels obligatoires d’une brochure / d’un dépliant.',
        'Expliquer la différence entre la clôture d’un article de journal et la clôture d’un billet de blog.',
        'Vérifier pourquoi un texte de moins de 250 mots ou qui oublie le 2e objectif communicatif perd des points au Critère B.',
      ],
    },
    {
      id: 'fr-GRAMMAR',
      subjectSlug: 'fr',
      unitCode: 'Grammaire SL',
      unitTitle: 'Grammaire & Syntaxe B1–B2',
      code: 'fr-GRAMMAR',
      title: 'Structures grammaticales à haut rendement (Critère A : Bande 10–12)',
      levelScope: 'SL/Core',
      recommendedHours: 15,
      guidingQuestions: [
        'Quelles structures complexes permettent d’atteindre la bande supérieure (10–12 points) du Critère A à l’écrit comme à l’oral ?',
        'Comment distinguer les déclencheurs du subjonctif des tournures qui exigent l’indicatif ou l’infinitif ?',
        'Comment maîtriser les trois types d’hypothèses en « si » et les pronoms relatifs (qui, que, dont, où, lequel) ?',
      ],
      understandings: [
        {
          code: 'fr-G.1',
          text: 'Le subjonctif présent : formation (radical de ils au présent + -e, -es, -e, -ions, -iez, -ent), les 10 irréguliers incontournables (être, avoir, aller, faire, pouvoir, savoir, vouloir, falloir, valoir, venir) et les déclencheurs (nécessité, émotion, doute, bien que, pour que, avant que).',
          isHL: false,
        },
        {
          code: 'fr-G.2',
          text: 'Les hypothèses avec « si » et le conditionnel : concordance stricte des temps (Type 1 : Si + présent → futur/impératif ; Type 2 : Si + imparfait → conditionnel présent ; Type 3 : Si + plus-que-parfait → conditionnel passé).',
          isHL: false,
        },
        {
          code: 'fr-G.3',
          text: 'Pronoms relatifs, pronoms compléments (y, en, COD/COI), gérondif et connecteurs logiques : enrichir la syntaxe avec « dont », « ce qui / ce dont », « en + participe présent » et les connecteurs de concession.',
          isHL: false,
        },
      ],
      studyGuideMarkdown: `### 1. Le Subjonctif Présent : Déclencheurs et Pièges
Pour obtenir **10–12 au Critère A**, placez naturellement 3 à 4 subjonctifs variés dans votre production :
- **Nécessité / Volonté :** *Il faut que, il est essentiel que, il est indispensable que, il vaut mieux que, j'aimerais que*.
- **Émotion / Jugement :** *Je regrette que, il est dommage que, je crains que, il est injuste que*.
- **Doute :** *Je doute que, il est peu probable que, je ne pense pas que*.
- **Conjonctions clés (+ subjonctif) :** *bien que, quoique, pour que, afin que, avant que, à moins que, à condition que, sans que*.
- **Attention — Les 4 pièges classiques qui prennent l'INDICATIF ou l'INFINITIF (jamais le subjonctif !) :**
  1. **espérer que** + indicatif (souvent futur) : *J'espère que ce projet **réussira**.*
  2. **il est évident / clair / certain / probable que** + indicatif : *Il est évident que cela **pose** problème.*
  3. **après que** + indicatif (ou évitez-le en utilisant **après + infinitif passé** : *Après avoir terminé mes études...*).
  4. **Même sujet = Infinitif !** Ne dites jamais *« Je veux que je parte »* → dites *« Je veux partir »* ; *« avant de partir »* ; *« pour réussir »*.

### 2. Les 3 structures hypothétiques avec *Si*
> **Règle absolue :** Les « *si* » n'aiment pas les « *-rais* » (ni les « *-rai* ») ! On ne met **jamais** le futur simple ni le conditionnel juste après *si*.

1. **Hypothèse réalisable (Type 1) :** \`Si + Présent\` → \`Futur simple (ou Présent / Impératif)\`
   - *Exemple : Si nous **réduisons** nos déchets, notre ville **sera** plus propre.*
2. **Hypothèse irréelle dans le présent (Type 2) :** \`Si + Imparfait\` → \`Conditionnel présent\`
   - *Exemple : Si j'**étais** maire de ma commune, je **créerais** davantage de pistes cyclables.*
3. **Hypothèse non réalisée dans le passé / Regret (Type 3) :** \`Si + Plus-que-parfait\` → \`Conditionnel passé\`
   - *Exemple : Si les autorités **avaient agi** plus tôt, nous **aurions évité** cette crise.*

### 3. Pronoms relatifs et Gérondif
- **dont** remplace un complément introduit par **de** (*parler de, avoir besoin de, être fier de, venir de*) : *C'est un sujet **dont** on parle beaucoup ; les outils **dont** les élèves ont besoin.*
- **Le gérondif (\`en + participe présent\`)** exprime le moyen ou la simultanéité : *En sensibilisant les jeunes dès le collège, nous changerons durablement les comportements.*`,
      cheatsheetMarkdown: `| Structure B2 | Règle de formation | Exemple prêt à l'emploi (Paper 1 / Oral) |
| :--- | :--- | :--- |
| **Subjonctif (concession)** | \`bien que / quoique + subjonctif\` | *Bien que cette mesure **soit** coûteuse, elle reste indispensable.* |
| **Subjonctif (but)** | \`pour que / afin que + subjonctif\` | *Agissons maintenant afin que les générations futures **puissent** vivre mieux.* |
| **Hypothèse Type 2** | \`Si + imparfait → conditionnel présent\` | *Si chacun **faisait** un effort, la situation **s'améliorerait** rapidement.* |
| **Hypothèse Type 3** | \`Si + plus-que-parfait → cond. passé\` | *Si j'**avais su** cela avant mon voyage, je **me serais mieux préparé(e)**.* |
| **Pronom relatif « dont »** | Remplace \`de + nom\` (*avoir besoin de...*) | *Voici une initiative **dont** notre établissement peut être fier.* |`,
      blurtChecklist: [
        'Conjuguer au subjonctif présent (1re personne du singulier et du pluriel) : être, avoir, aller, faire, pouvoir, savoir.',
        'Écrire un exemple complet pour chacun des 3 types de phrases hypothétiques avec « si ».',
        'Expliquer pourquoi « espérer que » et « il est certain que » sont suivis de l’indicatif et non du subjonctif.',
        'Transformer deux phrases simples en une phrase complexe à l’aide du pronom relatif « dont ».',
      ],
    },
  ],
  questions: [
    {
      id: 'fr-q-p1-01',
      subjectSlug: 'fr',
      topicId: 'fr-T5',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 30,
      commandTerm: 'Rédigez (250–400 mots)',
      stemMarkdown: `**Épreuve 1 — Production écrite (Niveau Moyen : 250 à 400 mots)**

Votre municipalité envisage de limiter la circulation automobile dans le centre-ville et de supprimer la moitié des places de stationnement afin de créer de nouvelles pistes cyclables et des espaces verts. Ce projet divise profondément les habitants et les commerçants locaux. Vous décidez de prendre la parole publiquement pour **expliquer les enjeux écologiques et sanitaires de cette initiative** et **proposer des solutions concrètes pour accompagner les habitants dans cette transition**.

**Choisissez le type de texte le plus approprié parmi les trois options suivantes :**
- **Article de journal local**
- **Lettre formelle au maire**
- **Journal intime**`,
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Critère C (6 pts)',
          requirement:
            'Choix du type de texte approprié : l’Article de journal local est pleinement approprié pour s’adresser publiquement aux habitants et commerçants (la Lettre formelle au maire est généralement appropriée mais ne touche pas directement l’ensemble du public ; le Journal intime est inapproprié car privé). Respect des conventions de l’article : titre accrocheur, chapeau introductif, signature, intertitres et registre courant/soutenu.',
          marks: 6,
          notes: 'Plafond à 3–4/6 pour la lettre formelle si non réorientée ; plafond à 1–2/6 pour le journal intime.',
        },
        {
          pointId: 'Critère B (12 pts)',
          requirement:
            'Message et développement : traitement complet et équilibré des DEUX fonctions communicatives de la consigne : (1) expliquer les enjeux écologiques et sanitaires (qualité de l’air, empreinte carbone, santé publique) et (2) proposer des solutions concrètes (transports en commun gratuits, parkings relais, aides à l’achat de vélos).',
          marks: 12,
          notes: 'Si un seul des deux volets est traité, plafonner le Critère B à 6/12 maximum.',
        },
        {
          pointId: 'Critère A (12 pts)',
          requirement:
            'Langue : richesse du lexique thématique (mobilité douce, empreinte carbone, piétonnisation, riverains) et variété des structures grammaticales complexes (subjonctif après « bien que » / « il faut que », hypothèse en « si + imparfait / conditionnel », pronoms relatifs « dont / où », connecteurs logiques).',
          marks: 12,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Sélectionner le type de texte optimal (Critère C)',
          explanationMarkdown:
            'La consigne précise que vous souhaitez **« prendre la parole publiquement »** face à un débat qui divise **les habitants et les commerçants**. Le *journal intime* est strictement privé (inapproprié). La *lettre au maire* s’adresse à une seule personne. L’**article de journal local** est donc le choix optimal (6/6) pour informer et convaincre la communauté locale.',
        },
        {
          stepNumber: 2,
          title: 'Mettre en place les conventions visuelles de l’article',
          explanationMarkdown:
            'Préparez immédiatement : **1. Un titre percutant** (ex. *« Un centre-ville sans voitures : pari écologique ou casse-tête quotidien ? »*), **2. Un court chapeau** de 2 phrases résumant le débat et signé (*Par Alex Moreau, chroniqueur local*), et **3. Deux intertitres** correspondant aux deux exigences du sujet.',
        },
        {
          stepNumber: 3,
          title: 'Développer les deux objectifs avec des structures B2 (Critères A & B)',
          explanationMarkdown:
            'Dans la 1re partie (*Les enjeux écologiques et sanitaires*), utilisez une concession au subjonctif : *« Bien que la suppression des places de stationnement **puisse** inquiéter les commerçants, il est urgent que notre ville **réduise** son empreinte carbone. »* Dans la 2e partie (*Des solutions concrètes*), utilisez une phrase hypothétique de type 2 : *« Si la mairie **créait** des parkings relais gratuits en périphérie, chacun **pourrait** accéder au centre-ville sans polluer. »*',
        },
      ],
      commonPitfalls: [
        'Commencer un article de journal par « Cher lecteur » ou terminer par « Cordialement » (mélange des codes de la lettre et de l’article).',
        'Oublier le deuxième volet de la consigne (se contenter de critiquer la pollution sans proposer de mesures d’accompagnement concrètes).',
        'Choisir le journal intime alors que la consigne exige une prise de parole publique.',
      ],
      isDailyEligible: false,
    },
    {
      id: 'fr-q-p1-02',
      subjectSlug: 'fr',
      topicId: 'fr-T3',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 30,
      commandTerm: 'Rédigez (250–400 mots)',
      stemMarkdown: `**Épreuve 1 — Production écrite (Niveau Moyen : 250 à 400 mots)**

La direction de votre lycée souhaite interdire totalement l’utilisation des outils d’intelligence artificielle par les élèves, même à la maison, par crainte de la triche. En tant que délégué(e) des élèves, vous souhaitez vous adresser à la cheffe d’établissement pour **expliquer pourquoi une interdiction totale serait contre-productive** et **proposer une charte d’utilisation responsable et pédagogique de l’IA au lycée**.

**Choisissez le type de texte le plus approprié parmi les trois options suivantes :**
- **Courriel formel / Lettre formelle**
- **Billet de blog personnel**
- **Brochure touristique**`,
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Critère C (6 pts)',
          requirement:
            'Choix du type de texte approprié : le Courriel formel / Lettre formelle est pleinement approprié pour s’adresser officiellement à la cheffe d’établissement en tant que délégué(e). Respect strict du vouvoiement, de l’en-tête (Objet : ...), de l’appel (Madame la Proviseure,) et de la formule de politesse finale.',
          marks: 6,
        },
        {
          pointId: 'Critère B (12 pts)',
          requirement:
            'Développement structuré des deux objectifs : (1) montrer les limites et l’inefficacité d’une interdiction totale (fracture numérique, impossibilité de contrôler à domicile, besoin de préparer l’avenir professionnel) et (2) présenter des propositions concrètes pour une charte éthique (ateliers d’esprit critique, vérification des sources, usage encadré pour la révision).',
          marks: 12,
        },
        {
          pointId: 'Critère A (12 pts)',
          requirement:
            'Maîtrise du registre soutenu et des tournures diplomatiques (Je me permets de vous écrire afin de..., Il conviendrait que..., Nous souhaiterions vous soumettre...), emploi précis du conditionnel et du subjonctif.',
          marks: 12,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Identifier le destinataire et le registre (Critère C)',
          explanationMarkdown:
            'Le destinataire est **la cheffe d’établissement (la proviseure)** et votre rôle est celui de **délégué(e) des élèves**. Le **Courriel formel / Lettre formelle** s’impose avec un registre **soutenu** et le **vouvoiement strict** (*vous*).',
        },
        {
          stepNumber: 2,
          title: 'Soigner l’ouverture et la clôture protocolaires',
          explanationMarkdown:
            'Inscrivez un objet précis : *« Objet : Proposition d’une charte pour un usage raisonné de l’intelligence artificielle au lycée »*, suivi de *« Madame la Proviseure, »*. Terminez par : *« En vous remerciant par avance de l’attention que vous porterez à notre démarche, je vous prie d’agréer, Madame la Proviseure, l’expression de mon profond respect. »*',
        },
        {
          stepNumber: 3,
          title: 'Argumenter avec nuance et politesse (Conditionnel & Subjonctif)',
          explanationMarkdown:
            'Évitez tout ton agressif. Utilisez la concession : *« Nous comprenons tout à fait que l’équipe pédagogique **craigne** les dérives liées au plagiat. Néanmoins, interdire complètement cette technologie **risquerait** de pénaliser les élèves au lieu de développer leur esprit critique. »*',
        },
      ],
      commonPitfalls: [
        'Tutoyer la proviseure (« tu ») ou utiliser une formule familière comme « Cordialement » ou « À bientôt » dans une lettre officielle.',
        'Oublier la ligne « Objet : » ou la formule de politesse complète.',
        'Ne proposer aucune mesure concrète pour la charte dans la seconde moitié du devoir.',
      ],
      isDailyEligible: false,
    },
    {
      id: 'fr-q-p1-03',
      subjectSlug: 'fr',
      topicId: 'fr-T4',
      paper: 'Paper 1',
      questionType: 'extended_response',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 30,
      commandTerm: 'Rédigez (250–400 mots)',
      stemMarkdown: `**Épreuve 1 — Production écrite (Niveau Moyen : 250 à 400 mots)**

À l’occasion de la Journée de l’engagement citoyen organisée dans votre lycée francophone, vous avez été invité(e) à prendre la parole devant l’ensemble des élèves de Seconde et de Première. Vous devez **raconter une expérience personnelle marquante de bénévolat** (par exemple au sein d’une association solidaire ou intergénérationnelle) et **convaincre vos camarades de s’engager à leur tour dans la communauté locale**.

**Choisissez le type de texte le plus approprié parmi les trois options suivantes :**
- **Discours / Allocution**
- **Rapport officiel**
- **Courriel à un ami**`,
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Critère C (6 pts)',
          requirement:
            'Choix du Discours / Allocution (6/6) adapté à une prise de parole en direct devant une assemblée d’élèves. Conventions requises : salutation orale au public (« Chers camarades, chers professeurs, »), procédés rhétoriques (questions oratoires, « nous » inclusif, impératif d’exhortation) et remerciement final (« Merci de votre écoute ! »).',
          marks: 6,
        },
        {
          pointId: 'Critère B (12 pts)',
          requirement:
            'Articulation fluide entre (1) le récit vivant et personnel d’une expérience de bénévolat (alternance imparfait / passé composé, émotions, impact concret) et (2) le plaidoyer persuasif invitant les lycéens à rejoindre une association locale.',
          marks: 12,
        },
        {
          pointId: 'Critère A (12 pts)',
          requirement:
            'Maîtrise des temps du passé pour l’anecdote (imparfait, passé composé, plus-que-parfait) et des structures persuasives pour l’appel à l’action (impératif, subjonctif, gérondif, expressions idiomatiques comme « donner un coup de main », « mettre la main à la pâte »).',
          marks: 12,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Capter l’auditoire dès les premières secondes',
          explanationMarkdown:
            'Un discours commence toujours par une **interpellation directe du public** suivie d’une **accroche rhétorique** : *« Madame la Proviseure, chers professeurs et surtout chers camarades, vous êtes-vous déjà demandé ce que deux heures de votre week-end pourraient changer dans la vie d’une personne isolée ? »*',
        },
        {
          stepNumber: 2,
          title: 'Structurer le témoignage aux temps du passé',
          explanationMarkdown:
            'Pour raconter votre expérience (ex. distribution de repas avec *Les Restos du Cœur* ou visites à des personnes âgées), posez le cadre à l’**imparfait** (*Au début, j’hésitais car je pensais manquer de temps...*) et introduisez le déclic au **passé composé** (*Mais dès ma première mission, j’ai compris à quel point...*).',
        },
        {
          stepNumber: 3,
          title: 'Terminer par une exhortation et un remerciement oral',
          explanationMarkdown:
            'Mobilisez l’**impératif** et le **gérondif** dans votre appel final : *« En donnant un simple coup de main chaque semaine, nous renforçons la cohésion sociale de notre quartier. N’attendez plus : engageons-nous dès aujourd’hui ! Je vous remercie de votre attention. »*',
        },
      ],
      commonPitfalls: [
        'Écrire un essai académique abstrait sans aucune marque d’oralité ni adresse directe aux camarades.',
        'Confondre l’emploi du passé composé et de l’imparfait lors du récit de l’expérience personnelle.',
        'Oublier la formule de clôture orale (« Je vous remercie de votre écoute »).',
      ],
      isDailyEligible: false,
    },
    {
      id: 'fr-q-p2-01',
      subjectSlug: 'fr',
      topicId: 'fr-T4',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'foundation',
      marks: 4,
      commandTerm: 'Vrai ou Faux avec justification',
      stemMarkdown: `**Épreuve 2 — Compréhension écrite (Exercice de type Vrai / Faux avec justification)**

À partir du texte ci-dessous, indiquez si chacune des affirmations (1 à 4) est **Vraie** ou **Fausse**, et **justifiez votre réponse en citant exactement les mots du texte**. *(Règle officielle IB : la mention Vrai/Faux ET la citation exacte sont toutes deux indispensables pour obtenir le point ; 0 point si l'une des deux est absente ou erronée.)*

1. Clara a choisi ce logement uniquement pour faire des économies financières. **[1 mark]**
2. Odette impose à Clara de préparer tous les repas de la semaine. **[1 mark]**
3. Cette expérience a permis à Odette de se sentir moins seule après un événement familial difficile. **[1 mark]**
4. L’association *Ensemble2Générations* laisse l’étudiant et le senior organiser leur cohabitation sans aucun suivi. **[1 mark]**`,
      stimulusMarkdown: `### À Lyon, la colocation intergénérationnelle séduit étudiants et seniors

**Par Mehdi Lemaire — *Le Progrès de Lyon***

 **[§1]** Face à la flambée des loyers dans les grandes métropoles françaises, de plus en plus d’étudiants se tournent vers une solution originale : habiter chez une personne âgée. C’est le cas de Clara, 20 ans, étudiante en architecture à Lyon. Certes, sa participation mensuelle de 150 euros pour les charges soulage son budget modeste, mais la jeune femme cherchait avant tout un cadre de vie chaleureux et humain après une première année universitaire vécue dans l’isolement d’un minuscule studio.

**[§2]** Depuis septembre, elle occupe une chambre lumineuse dans l’appartement d’Odette, une ancienne institutrice de 81 ans qui vit seule depuis le décès de son mari il y a deux ans. Le contrat moral établi entre elles est simple : Clara n’est pas une aide-soignante, mais elle assure une présence bienveillante le soir et partage trois dîners par semaine avec son hôtesse, qu’elles cuisinent chacune à leur tour. « Grâce à Clara, la maison a retrouvé de la vie et du rire », confie Odette avec émotion.

**[§3]** Pour éviter tout malentendu, l’association *Ensemble2Générations* réalise un entretien approfondi avec chaque candidat avant la signature d’une charte précise, puis assure un accompagnement régulier par téléphone tout au long de l’année universitaire.`,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Question 1',
          requirement:
            'FAUX — Justification exacte : « la jeune femme cherchait avant tout un cadre de vie chaleureux et humain » (ou « Certes, sa participation mensuelle de 150 euros... soulage son budget modeste, mais la jeune femme cherchait avant tout un cadre de vie chaleureux et humain »).',
          marks: 1,
          notes: 'Exiger FAUX + citation exacte montrant que l’aspect financier n’était pas la seule raison.',
        },
        {
          pointId: 'Question 2',
          requirement:
            'FAUX — Justification exacte : « partage trois dîners par semaine avec son hôtesse, qu’elles cuisinent chacune à leur tour ».',
          marks: 1,
          notes: 'Rejeter si l’élève paraphrase avec ses propres mots.',
        },
        {
          pointId: 'Question 3',
          requirement:
            'VRAI — Justification exacte : « qui vit seule depuis le décès de son mari il y a deux ans » ET/OU « Grâce à Clara, la maison a retrouvé de la vie et du rire ».',
          marks: 1,
        },
        {
          pointId: 'Question 4',
          requirement:
            'FAUX — Justification exacte : « l’association Ensemble2Générations réalise un entretien approfondi... puis assure un accompagnement régulier par téléphone tout au long de l’année universitaire ».',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Repérer les adverbes exclusifs (« uniquement », « tous », « sans aucun »)',
          explanationMarkdown:
            'Dans l’Épreuve 2 de Français B, les affirmations contenant des mots absolus comme *uniquement*, *tous* ou *sans aucun* sont très souvent **Fausses** car le texte apporte une nuance (*avant tout*, *trois dîners... chacune à leur tour*, *accompagnement régulier*).',
        },
        {
          stepNumber: 2,
          title: 'Citer le segment exact du texte sans paraphraser',
          explanationMarkdown:
            'En Paper 2, **ne reformulez jamais la justification avec vos propres mots** ! Recopiez uniquement le groupe de mots exact du texte qui prouve votre choix, sans recopier tout le paragraphe.',
        },
      ],
      commonPitfalls: [
        'Reformuler la justification avec ses propres mots au lieu de citer exactement le texte (0 point selon le barème IB).',
        'Recopier deux phrases entières contenant des éléments hors-sujet (« sur-citation » pénalisée par les correcteurs).',
        'Oublier d’écrire explicitement « Vrai » ou « Faux » avant la citation.',
      ],
      isDailyEligible: true,
    },
    {
      id: 'fr-q-p2-02',
      subjectSlug: 'fr',
      topicId: 'fr-T5',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 5,
      commandTerm: 'Trouvez les synonymes et les référents',
      stemMarkdown: `**Épreuve 2 — Compréhension écrite (Repérage lexical et grammatical)**

Lisez l’extrait ci-dessous et répondez aux questions suivantes en respectant strictement la nature grammaticale demandée :

1. **Trouvez dans le §1 un nom féminin** qui signifie *« diminution »*. **[1 mark]**
2. **Trouvez dans le §1 un verbe à l’infinitif** qui signifie *« obliger »*. **[1 mark]**
3. **Trouvez dans le §2 un adjectif** qui signifie *« faisable / qu’on peut accomplir »*. **[1 mark]**
4. **À qui ou à quoi** renvoie le pronom souligné **« les »** dans *« au lieu de **les** détruire »* (§1) ? **[1 mark]**
5. **À qui ou à quoi** renvoie le pronom souligné **« y »** dans *« ceux qui **y** participent »* (§2) ? **[1 mark]**`,
      stimulusMarkdown: `### La lutte contre le gaspillage alimentaire s’intensifie en France

**[§1]** Chaque année, près de dix millions de tonnes de nourriture consommable sont jetées en France. Pour amorcer une **réduction** durable de ce fléau écologique et social, la législation française a choisi de **contraindre** les grandes surfaces à agir : depuis la loi Garot, il est interdit aux supermarchés de rendre impropres à la consommation leurs invendus alimentaires. Ils doivent désormais signer une convention avec une association caritative afin de donner ces denrées au lieu de **les** détruire.

**[§2]** Parallèlement, des applications mobiles citoyennes permettent aux commerçants de quartier de proposer à prix réduit les produits proches de leur date limite. Cet objectif du « zéro déchet » est tout à fait **réalisable** à l’échelle locale : selon une étude récente sur ce dispositif solidaire, neuf boulangeries sur dix affirment que ceux qui **y** participent réduisent leurs pertes de moitié dès le premier mois.`,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Question 1',
          requirement: 'réduction (accepter « une réduction »). Rejeter tout verbe ou adjectif.',
          marks: 1,
        },
        {
          pointId: 'Question 2',
          requirement: 'contraindre (exiger l’infinitif exact présent dans le §1).',
          marks: 1,
        },
        {
          pointId: 'Question 3',
          requirement: 'réalisable (adjectif du §2).',
          marks: 1,
        },
        {
          pointId: 'Question 4',
          requirement: 'ces denrées / leurs invendus alimentaires (du §1).',
          marks: 1,
          notes: 'Le référent doit être un groupe nominal féminin ou masculin pluriel correspondant aux produits invendus.',
        },
        {
          pointId: 'Question 5',
          requirement: 'ce dispositif solidaire (participer à ce dispositif solidaire).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Vérifier la classe grammaticale exacte pour les synonymes (Q1–Q3)',
          explanationMarkdown:
            'Règle impérative du barème IB : un **nom** doit être remplacé par un **nom** (*diminution → réduction*), un **verbe à l’infinitif** par un **infinitif** (*obliger → contraindre*), et un **adjectif** par un **adjectif** (*faisable → réalisable*). Ne recopiez jamais toute la phrase !',
        },
        {
          stepNumber: 2,
          title: 'Identifier l’antécédent précis des pronoms « les » et « y » (Q4–Q5)',
          explanationMarkdown:
            'Dans *« donner ces denrées au lieu de **les** détruire »*, le pronom COD pluriel **les** reprend **ces denrées** (ou *leurs invendus alimentaires*). Dans *« ceux qui **y** participent »*, le verbe se construit avec **à** (*participer à quelque chose*) : le pronom **y** renvoie donc à **ce dispositif solidaire** mentionné juste avant dans la même phrase.',
        },
      ],
      commonPitfalls: [
        'Donner un verbe conjugué ou un nom quand la question demande un adjectif ou un infinitif.',
        'Citer une phrase entière au lieu d’isoler uniquement le mot ou le groupe nominal demandé.',
        'Répondre par un mot vague (« la nourriture » ou « l’étude ») sans vérifier le genre, le nombre et la préposition du verbe (« participer à » → « y »).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'fr-q-p2-03',
      subjectSlug: 'fr',
      topicId: 'fr-T1',
      paper: 'Paper 2',
      questionType: 'mcq',
      calculatorPolicy: 'non_calculator',
      difficulty: 'standard',
      marks: 1,
      commandTerm: 'Choisissez la bonne réponse',
      stemMarkdown:
        'D’après l’extrait ci-dessous, quelle est l’attitude principale de l’auteure à l’égard de l’usage du « franglais » chez les jeunes francophones ?',
      stimulusMarkdown: `« Certains puristes s’alarment dès qu’un adolescent glisse un mot d’anglais dans une conversation entre amis, comme si la langue de Molière était au bord du gouffre. Pourtant, les linguistes rappellent que le français a toujours emprunté des termes à ses voisins sans jamais perdre son âme. Plutôt que de condamner systématiquement ces expressions à la mode, il vaudrait mieux apprendre aux élèves à maîtriser les différents registres afin qu’ils sachent quand utiliser le mot juste dans un cadre académique ou professionnel. »`,
      options: [
        {
          id: 'A',
          text: 'Elle exige l’interdiction immédiate des anglicismes dans tous les établissements scolaires.',
        },
        {
          id: 'B',
          text: 'Elle adopte une position nuancée et préconise l’apprentissage des registres de langue plutôt que la censure.',
        },
        {
          id: 'C',
          text: 'Elle estime que le français disparaîtra d’ici quelques décennies face à la domination de l’anglais.',
        },
        {
          id: 'D',
          text: 'Elle encourage les élèves à remplacer le français soutenu par le franglais lors de leurs examens.',
        },
      ],
      correctOptionId: 'B',
      markschemePoints: [
        {
          pointId: 'Réponse B',
          requirement:
            'B — L’auteure rejette l’alarmisme des puristes (« Pourtant, les linguistes rappellent... ») et recommande d’enseigner la maîtrise des registres (« apprendre aux élèves à maîtriser les différents registres »).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Repérer le connecteur d’opposition qui introduit la thèse de l’auteure',
          explanationMarkdown:
            'La première phrase expose le point de vue des « puristes » (*Certains puristes s’alarment...*). Le connecteur **« Pourtant »** suivi de **« Plutôt que de condamner..., il vaudrait mieux... »** introduit la véritable opinion de l’auteure.',
        },
        {
          stepNumber: 2,
          title: 'Éliminer les distracteurs extrêmes',
          explanationMarkdown:
            'Les options A, C et D déforment le propos par exagération (*interdiction immédiate*, *disparaîtra*, *lors de leurs examens*). L’option **B** reflète fidèlement sa recommandation pédagogique.',
        },
      ],
      commonPitfalls: [
        'Confondre l’opinion des « puristes » citée dans la première phrase avec la thèse défendue par l’auteure après « Pourtant ».',
        'Interpréter « au bord du gouffre » au premier degré sans voir la nuance hypothétique (« comme si... »).',
      ],
      isDailyEligible: true,
    },
    {
      id: 'fr-q-p2-04',
      subjectSlug: 'fr',
      topicId: 'fr-GRAMMAR',
      paper: 'Paper 2',
      questionType: 'short_answer',
      calculatorPolicy: 'non_calculator',
      difficulty: 'challenging',
      marks: 4,
      commandTerm: 'Répondez brièvement et transformez',
      stemMarkdown: `**Maîtrise de la langue et compréhension fine (Critère A & Épreuve 2)**

Répondez aux quatre questions suivantes en français :

1. **Complétez la phrase au mode et au temps qui conviennent :**
   *« Bien que le gouvernement québécois ____________ (prendre) des mesures l’an dernier, il est indispensable que chaque citoyen ____________ (faire) un effort au quotidien. »* **[1 mark]**
2. **Complétez l’hypothèse irréelle dans le passé (Type 3) :**
   *« Si les organisateurs avaient vérifié leurs sources, ils ____________ (ne pas diffuser) cette infox sur les réseaux sociaux. »* **[1 mark]**
3. **Reliez ces deux phrases à l’aide du pronom relatif qui convient (*qui, que, dont, où*) :**
   *« Le droit à la déconnexion est une avancée sociale majeure. De nombreux salariés français sont très fiers de cette avancée. »* **[1 mark]**
4. **Corrigez les deux faux amis contenus dans la phrase d’élève suivante :**
   *« Actuellement, j’ai assisté à la librairie municipale pour emprunter des romans francophones gratuits. »* **[1 mark]**`,
      stimulusMarkdown: null,
      options: null,
      correctOptionId: null,
      markschemePoints: [
        {
          pointId: 'Question 1',
          requirement:
            'ait pris (subjonctif passé pour l’action passée « l’an dernier », ou prenne accepté au SL) ET fasse (subjonctif présent après « il est indispensable que »).',
          marks: 1,
        },
        {
          pointId: 'Question 2',
          requirement:
            'n’auraient pas diffusé (conditionnel passé dans la proposition principale après « Si + plus-que-parfait »).',
          marks: 1,
        },
        {
          pointId: 'Question 3',
          requirement:
            '« Le droit à la déconnexion est une avancée sociale majeure dont de nombreux salariés français sont très fiers. » (Emploi obligatoire de « dont » car on dit « être fier de quelque chose »).',
          marks: 1,
        },
        {
          pointId: 'Question 4',
          requirement:
            'Remplacer « Actuellement » par « En fait / À vrai dire » (ou « Hier ») ET remplacer « j’ai assisté à la librairie » par « je suis allé(e) à la bibliothèque » (une librairie vend des livres ; une bibliothèque les prête gratuitement).',
          marks: 1,
        },
      ],
      walkthroughSteps: [
        {
          stepNumber: 1,
          title: 'Vérifier les déclencheurs du subjonctif et la concordance avec « si » (Q1–Q2)',
          explanationMarkdown:
            'Dans la Q1, **« bien que »** et **« il est indispensable que »** exigent le subjonctif (*ait pris / prenne* et *fasse*). Dans la Q2, la subordonnée est au **plus-que-parfait** (*Si les organisateurs avaient vérifié*), ce qui impose le **conditionnel passé** dans la principale : *ils n’**auraient pas diffusé*** (*avoir* au conditionnel + participe passé).',
        },
        {
          stepNumber: 2,
          title: 'Repérer la préposition « de » et chasser les faux amis (Q3–Q4)',
          explanationMarkdown:
            'Dans la Q3, la locution verbale est *être fier **de*** → le pronom relatif est **dont**. Dans la Q4, *actuellement* signifie « en ce moment » (*currently*), jamais *actually* (*en fait*) ; *assister à* s’utilise pour un événement/une réunion (pas un lieu), et on emprunte des livres gratuitement dans une **bibliothèque** (*une librairie* est un magasin où l’on achète des livres).',
        },
      ],
      commonPitfalls: [
        'Écrire « faise » au lieu de la forme irrégulière « fasse » au subjonctif présent du verbe faire.',
        'Utiliser « que » au lieu de « dont » avec une locution construite avec la préposition « de » (être fier de, avoir besoin de, parler de).',
        'Confondre « une librairie » (bookshop) et « une bibliothèque » (library).',
      ],
      isDailyEligible: true,
    },
  ],
  referenceItems: [
    {
      id: 'fr-ref-tt-article',
      subjectSlug: 'fr',
      toolType: 'text_type_drill',
      category: 'Mass Media (Médias de masse)',
      title: 'Article de journal ou de magazine',
      codeOrSymbol: 'ARTICLE',
      payload: {
        register: 'Courant à soutenu (vouvoiement ou tournures impersonnelles)',
        targetAudience: 'Lecteurs d’un quotidien, d’un magazine ou du journal du lycée',
        openingFormulas: [
          'Titre accrocheur (nominal ou interrogatif) + Chapeau de 2 lignes résumant le sujet',
          'Signature (Par Camille Martin, envoyé spécial)',
          'Accroche factuelle : « Selon une enquête récente publiée cette semaine... »',
        ],
        closingFormulas: [
          'Conclusion avec ouverture ou question finale : « Reste à savoir si cette mesure suffira à faire évoluer les mentalités. »',
          'INTERDIT : Ne jamais utiliser « Cher lecteur », « Salut » ou « Cordialement » !',
        ],
        structuralConventions: [
          'Titre principal percutant',
          'Chapeau introductif (Qui ? Quoi ? Où ? Pourquoi ?)',
          '2 ou 3 intertitres (sous-titres) découpant le développement',
          'Citations ou témoignages entre guillemets français (« ... », explique un lycéen)',
        ],
      },
    },
    {
      id: 'fr-ref-tt-blog',
      subjectSlug: 'fr',
      toolType: 'text_type_drill',
      category: 'Personal / Mass Media',
      title: 'Billet de blog (Entrée de blog)',
      codeOrSymbol: 'BLOG',
      payload: {
        register: 'Courant (ou familier maîtrisé) — ton personnel (« je » + interpellation « vous / tu »)',
        targetAudience: 'Internautes et abonnés partageant un centre d’intérêt commun',
        openingFormulas: [
          'En-tête : Nom du blog | Date de publication | Titre accrocheur',
          '« Bienvenue sur mon blog ! Aujourd’hui, j’avais envie de partager avec vous un coup de cœur / un sujet qui me tient particulièrement à cœur... »',
        ],
        closingFormulas: [
          'Appel interactif aux commentaires : « Et vous, qu’en pensez-vous ? Avez-vous déjà vécu une expérience similaire ? N’hésitez pas à partager votre avis dans l’espace commentaires ci-dessous ! »',
        ],
        structuralConventions: [
          'En-tête de blog (URL ou nom du blog, date, auteur/pseudo)',
          'Titre engageant et sous-titres dynamiques',
          'Ponctuation expressive (? / !) et implication personnelle de l’auteur',
          'Invitation finale à commenter, aimer ou partager le billet',
        ],
      },
    },
    {
      id: 'fr-ref-tt-brochure',
      subjectSlug: 'fr',
      toolType: 'text_type_drill',
      category: 'Mass Media (Médias de masse)',
      title: 'Brochure / Dépliant / Prospectus',
      codeOrSymbol: 'BROCHURE',
      payload: {
        register: 'Courant persuasif et incitatif (vouvoiement ou tutoiement si destiné aux jeunes)',
        targetAudience: 'Grand public, élèves, touristes ou habitants d’une commune',
        openingFormulas: [
          'Titre percutant + Slogan mémorable (« Agir aujourd’hui pour respirer demain ! »)',
          'Question d’accroche directe : « Vous souhaitez réduire votre empreinte carbone tout en faisant des économies ? Découvrez notre guide pratique ! »',
        ],
        closingFormulas: [
          'Appel à l’action à l’impératif : « Rejoignez-nous dès ce week-end ! »',
          'Encadré obligatoire « Pour plus de renseignements / Infos pratiques : Site web, téléphone, adresse, réseaux sociaux »',
        ],
        structuralConventions: [
          'Titre principal + Slogan',
          'Intertitres clairs (souvent sous forme de questions : « Pourquoi participer ? », « Comment agir ? »)',
          'Listes à puces (• ou ✓) pour présenter des conseils ou des avantages concrets',
          'Emploi de l’impératif (Venez, Découvrez, N’hésitez pas) et encadré final d’informations pratiques',
        ],
      },
    },
    {
      id: 'fr-ref-tt-lettre-formelle',
      subjectSlug: 'fr',
      toolType: 'text_type_drill',
      category: 'Professional (Textes professionnels)',
      title: 'Lettre formelle & Courriel officiel',
      codeOrSymbol: 'FORMEL',
      payload: {
        register: 'Soutenu (vouvoiement strict « vous », aucun mot familier)',
        targetAudience: 'Proviseur(e), maire, directeur/rice d’entreprise, rédacteur/rice en chef',
        openingFormulas: [
          'Lieu et date : Lyon, le 14 mai 2026',
          'Objet : Proposition d’aménagement... / Réclamation concernant...',
          'Appel : Madame la Proviseure, / Monsieur le Maire, / Madame, Monsieur,',
          'Entrée en matière : « Au nom des élèves de terminale, je me permets de vous adresser ce courrier afin d’attirer votre attention sur... »',
        ],
        closingFormulas: [
          '« Dans l’attente d’une réponse favorable, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées (ou : de mon profond respect). »',
          'Signature complète (Prénom Nom, fonction)',
        ],
        structuralConventions: [
          'Coordonnées de l’expéditeur (en haut à gauche) et du destinataire (en haut à droite) pour une lettre ; De / À / Objet pour un courriel formel',
          'Ligne « Objet : » obligatoire',
          'Paragraphes logiques (1. Motif du courrier, 2. Constat et arguments, 3. Proposition ou demande concrète)',
          'Formule de politesse finale reprenant exactement le titre d’appel initial (« Madame, Monsieur, »)',
        ],
      },
    },
    {
      id: 'fr-ref-tt-discours',
      subjectSlug: 'fr',
      toolType: 'text_type_drill',
      category: 'Mass Media / Professional',
      title: 'Discours / Allocution / Exposé oralisé',
      codeOrSymbol: 'DISCOURS',
      payload: {
        register: 'Courant à soutenu (marques d’oralité, « vous » collectif et « nous » inclusif)',
        targetAudience: 'Auditoire en direct (assemblée d’élèves, conseil municipal, conférence)',
        openingFormulas: [
          'Adresse directe dès la 1re ligne : « Madame la Directrice, chers professeurs, chers camarades, »',
          'Accroche oratoire : « Imaginez un instant un monde où... » / « Permettez-moi de vous poser une question simple : ... »',
        ],
        closingFormulas: [
          'Exhortation finale : « Ensemble, faisons entendre notre voix et passons à l’action dès aujourd’hui ! »',
          'Remerciement obligatoire : « Je vous remercie de votre attention / Merci à toutes et à tous de votre écoute. »',
        ],
        structuralConventions: [
          'Salutation initiale au public présent dans la salle',
          'Maintien du contact avec l’auditoire tout au long du texte (questions rhétoriques, interpellations)',
          'Connecteurs clairs pour guider l’écoute (Tout d’abord, En second lieu, Enfin)',
          'Formule finale de remerciement au public',
        ],
      },
    },
    {
      id: 'fr-ref-gram-subjonctif',
      subjectSlug: 'fr',
      toolType: 'grammar_lab',
      category: 'Modes & Temps (Critère A)',
      title: 'Le Subjonctif Présent : Déclencheurs, Irréguliers & Pièges',
      codeOrSymbol: 'SUBJ',
      payload: {
        formationRule:
          'Radical de la 3e personne du pluriel (ils/elles) au présent de l’indicatif + terminaisons -e, -es, -e, -ions, -iez, -ent (les formes nous/vous suivent le radical de l’imparfait pour les verbes réguliers).',
        irregularVerbs: [
          'être → que je sois, que tu sois, qu’il soit, que nous soyons, que vous soyez, qu’ils soient',
          'avoir → que j’aie, que tu aies, qu’il ait, que nous ayons, que vous ayez, qu’ils aient',
          'aller → que j’aille, qu’il aille, que nous allions, qu’ils aillent',
          'faire → que je fasse, que nous fassions | pouvoir → que je puisse, que nous puissions',
          'savoir → que je sache | vouloir → que je veuille, que nous voulions | falloir → qu’il faille',
        ],
        highYieldTriggers: [
          'Nécessité : il faut que, il est essentiel / indispensable / urgent que, il vaut mieux que',
          'Émotion & Jugement : je regrette que, il est dommage / normal / injuste que, craindre que',
          'Doute & Négation : je doute que, il est peu probable que, je ne pense pas que',
          'Conjonctions : bien que, quoique, pour que, afin que, avant que, à condition que, à moins que, sans que',
        ],
        indicativeTraps: [
          'espérer que + INDICATIF (J’espère qu’il viendra)',
          'il est évident / clair / certain / probable que + INDICATIF',
          'après que + INDICATIF (astuce : utilisez plutôt « après + infinitif passé » : Après avoir fini...)',
          'Même sujet = INFINITIF sans « que » (Je veux partir ; avant de partir ; pour réussir)',
        ],
      },
    },
    {
      id: 'fr-ref-gram-si-clauses',
      subjectSlug: 'fr',
      toolType: 'grammar_lab',
      category: 'Syntaxe complexe (Critère A)',
      title: 'Les Phrases Hypothétiques avec « Si » & le Conditionnel',
      codeOrSymbol: 'SI-COND',
      payload: {
        goldenRule:
          'Règle d’or absolue : On ne met JAMAIS le futur simple (-rai) ni le conditionnel (-rais) directement après « si » dans une hypothèse !',
        structures: [
          {
            type: 'Type 1 — Hypothèse réalisable dans le futur',
            formula: 'Si + Présent → Futur simple (ou Présent / Impératif)',
            example: 'Si nous trions nos déchets au quotidien, nous réduirons durablement la pollution.',
          },
          {
            type: 'Type 2 — Hypothèse irréelle ou potentielle dans le présent',
            formula: 'Si + Imparfait → Conditionnel présent',
            example: 'Si les transports en commun étaient gratuits pour les jeunes, moins d’élèves utiliseraient la voiture.',
          },
          {
            type: 'Type 3 — Hypothèse non réalisée dans le passé (regret / reproche)',
            formula: 'Si + Plus-que-parfait → Conditionnel passé',
            example: 'Si la municipalité avait consulté les habitants plus tôt, ce conflit aurait pu être évité.',
          },
        ],
      },
    },
    {
      id: 'fr-ref-gram-pronoms-connecteurs',
      subjectSlug: 'fr',
      toolType: 'grammar_lab',
      category: 'Cohésion & Pronoms (Critères A & B)',
      title: 'Pronoms Relatifs (qui, que, dont, où) & Pronoms y / en',
      codeOrSymbol: 'PRONOMS',
      payload: {
        relativePronouns: [
          'qui : sujet du verbe qui suit (« Les jeunes qui s’engagent dans le bénévolat... »)',
          'que / qu’ : complément d’objet direct (« Les mesures que le gouvernement a adoptées... » — attention à l’accord du participe passé avec avoir !)',
          'dont : remplace un complément introduit par la préposition DE (« C’est un problème dont on parle peu » / « Les outils dont nous avons besoin »)',
          'où : complément de lieu ou de temps (« L’époque où nous vivons » / « Le quartier où j’ai grandi »)',
          'ce qui / ce que / ce dont : sans antécédent précis (« Ce qui m’inquiète le plus, c’est... » / « C’est exactement ce dont notre lycée a besoin »)',
        ],
        adverbialPronouns: [
          'y : remplace un lieu (aller à Lyon → j’y vais) ou un complément introduit par À + chose (penser à son avenir → j’y pense ; participer à ce projet → j’y participe)',
          'en : remplace un nom avec article partitif/indéfini/quantité (boire du café → j’en bois ; avoir trois frères → j’en ai trois) ou un complément introduit par DE + chose (parler de ce film → j’en parle)',
        ],
      },
    },
  ],
  flashcardDecks: [
    {
      id: 'fr-deck-themes-vocab',
      subjectSlug: 'fr',
      topicId: 'fr-T1',
      title: 'Les 5 Thèmes IB — Vocabulaire & Expressions Idiomatiques',
      description:
        'Vocabulaire B2 à haut rendement et expressions idiomatiques authentiques couvrant les 5 thèmes prescrits du programme de Français B SL.',
      cards: [
        {
          id: 'fr-card-101',
          frontMarkdown: '**la laïcité** *(Thème 1 : Identités)*',
          backMarkdown:
            '**Définition :** Principe républicain de séparation de l’État et des religions garantissant la liberté de conscience et la neutralité dans les services publics (et les écoles publiques en France depuis la loi de 2004).\n\n*Exemple :* « En France, **la laïcité** permet à chaque citoyen de pratiquer ou non une religion dans le respect de l’ordre public. »',
          tags: ['Identités', 'Culture francophone', 'Nom féminin'],
        },
        {
          id: 'fr-card-102',
          frontMarkdown: '**être bien dans sa peau** *(Thème 1 : Identités)*',
          backMarkdown:
            '**Sens (to feel comfortable in one’s own skin) :** Se sentir épanoui(e), confiant(e) et en harmonie avec soi-même.\n\n*Exemple :* « Avoir une bonne hygiène de vie et limiter le temps passé sur les écrans aident les adolescents à **être bien dans leur peau**. »',
          tags: ['Identités', 'Expression idiomatique'],
        },
        {
          id: 'fr-card-103',
          frontMarkdown: '**le dépaysement** vs **le déracinement** *(Thème 2 : Expériences)*',
          backMarkdown:
            '- **le dépaysement (m) :** Changement d’habitudes et de cadre lors d’un voyage (connotation souvent positive et enrichissante).\n- **le déracinement (m) :** Sentiment douloureux de rupture avec son pays ou sa culture d’origine lors d’une migration.\n\n*Exemple :* « Ce séjour au Québec m’a offert un merveilleux **dépaysement**, tandis que le roman évoque le **déracinement** des exilés. »',
          tags: ['Expériences', 'Nuance lexicale'],
        },
        {
          id: 'fr-card-104',
          frontMarkdown: '**sortir des sentiers battus** *(Thème 2 : Expériences)*',
          backMarkdown:
            '**Sens (to get off the beaten track) :** Explorer des lieux originaux loin du tourisme de masse ou agir de manière novatrice.\n\n*Exemple :* « L’écotourisme invite les voyageurs à **sortir des sentiers battus** afin de respecter le patrimoine local. »',
          tags: ['Expériences', 'Expression idiomatique'],
        },
        {
          id: 'fr-card-105',
          frontMarkdown: '**une infox** & **la fracture numérique** *(Thème 3 : Ingéniosité humaine)*',
          backMarkdown:
            '- **une infox (f, inv.) :** Terme officiel francophone désignant une fausse information (*fake news*) diffusée pour manipuler l’opinion.\n- **la fracture numérique (f) :** Inégalité d’accès aux technologies numériques et à Internet selon l’âge, le revenu ou la géographie.\n\n*Exemple :* « Il faut éduquer les jeunes aux médias pour qu’ils ne partagent pas **une infox** sans vérifier leurs sources. »',
          tags: ['Ingéniosité humaine', 'Médias & Technologie'],
        },
        {
          id: 'fr-card-106',
          frontMarkdown: '**être une arme à double tranchant** *(Thème 3 : Ingéniosité humaine)*',
          backMarkdown:
            '**Sens (to be a double-edged sword) :** Présenter à la fois des avantages majeurs et des risques sérieux.\n\n*Exemple :* « L’intelligence artificielle **est une arme à double tranchant** : elle facilite la recherche mais peut nuire à l’esprit critique. »',
          tags: ['Ingéniosité humaine', 'Expression idiomatique'],
        },
        {
          id: 'fr-card-107',
          frontMarkdown: '**le bénévolat** & **la cohésion sociale** *(Thème 4 : Organisation sociale)*',
          backMarkdown:
            '- **le bénévolat (m) :** Engagement volontaire et non rémunéré au service d’une association (ex. *Les Restos du Cœur*).\n- **la cohésion sociale (f) :** Force des liens de solidarité qui unissent les membres d’une même société.\n\n*Expression associée :* **mettre la main à la pâte** / **donner un coup de main**.',
          tags: ['Organisation sociale', 'Solidarité'],
        },
        {
          id: 'fr-card-108',
          frontMarkdown: '**tirer la sonnette d’alarme** & **apporter sa pierre à l’édifice** *(Thème 5 : Partage de la planète)*',
          backMarkdown:
            '- **tirer la sonnette d’alarme :** Alerter d’urgence face à un danger grave (ex. réchauffement climatique).\n- **apporter sa pierre à l’édifice :** Contribuer par ses actions personnelles à une œuvre collective.\n\n*Exemple :* « Les scientifiques **tirent la sonnette d’alarme** : chacun doit **apporter sa pierre à l’édifice** pour réduire son empreinte carbone. »',
          tags: ['Partage de la planète', 'Expression idiomatique'],
        },
      ],
    },
    {
      id: 'fr-deck-connectors-subj',
      subjectSlug: 'fr',
      topicId: 'fr-GRAMMAR',
      title: 'Connecteurs Logiques & Déclencheurs du Subjonctif',
      description:
        'Connecteurs argumentatifs B2, déclencheurs du subjonctif, pièges de l’indicatif et faux amis essentiels pour le Critère A.',
      cards: [
        {
          id: 'fr-card-201',
          frontMarkdown: '**bien que** / **quoique** vs **malgré** / **en dépit de**',
          backMarkdown:
            '- **bien que / quoique** + **SUBJONCTIF** (suivis d’un sujet et d’un verbe conjugué) :\n  *« **Bien que** cette loi **soit** récente, elle porte déjà ses fruits. »*\n- **malgré / en dépit de** + **NOM** (jamais *« malgré que »* ni *« malgré il »* !) :\n  *« **Malgré** son coût élevé, ce projet écologique reste indispensable. »*',
          tags: ['Connecteurs', 'Subjonctif', 'Concession'],
        },
        {
          id: 'fr-card-202',
          frontMarkdown: '**pour que** / **afin que** vs **pour** / **afin de**',
          backMarkdown:
            '- **Deux sujets différents** → **pour que / afin que + SUBJONCTIF** :\n  *« La mairie aménage des pistes cyclables **afin que** les habitants **puissent** se déplacer en sécurité. »*\n- **Même sujet** → **pour / afin de + INFINITIF** :\n  *« Je fais du bénévolat **afin d’**aider les personnes isolées de mon quartier. »*',
          tags: ['Connecteurs', 'Subjonctif', 'But'],
        },
        {
          id: 'fr-card-203',
          frontMarkdown: 'Piège classique : **espérer que** & **il est évident / certain / probable que**',
          backMarkdown:
            'Ces expressions expriment la probabilité ou la certitude (à la forme affirmative) et sont suivies de l’**INDICATIF** (jamais du subjonctif !) :\n- *« J’espère que vous **comprendrez** (futur simple) l’urgence de notre demande. »*\n- *« Il est évident que le numérique **occupe** (présent) une place centrale. »*\n*(Mais à la forme négative : « Il n’est pas certain qu’il **vienne** » → subjonctif).*',
          tags: ['Piège grammatical', 'Indicatif vs Subjonctif'],
        },
        {
          id: 'fr-card-204',
          frontMarkdown: 'Piège temporel : **avant que** vs **après que**',
          backMarkdown:
            '- **avant que** + **SUBJONCTIF** : *« Agissons **avant qu’**il ne **soit** trop tard ! »*\n- **après que** + **INDICATIF** (fait accompli).\n- **Astuce B2 (même sujet) :** Utilisez **avant de + infinitif** (*avant de partir*) et **après + infinitif passé** (*Après avoir obtenu mon baccalauréat, je souhaiterais...*) !',
          tags: ['Subjonctif', 'Infinitif passé'],
        },
        {
          id: 'fr-card-205',
          frontMarkdown: 'Concordance des 3 types de phrases avec **Si**',
          backMarkdown:
            '1. **Type 1 (Réel) :** `Si + Présent` → `Futur simple` (*Si nous agissons, tout changera.*)\n2. **Type 2 (Irréel du présent) :** `Si + Imparfait` → `Conditionnel présent` (*Si j’étais maire, j’interdirais les voitures.*)\n3. **Type 3 (Irréel du passé / Regret) :** `Si + Plus-que-parfait` → `Conditionnel passé` (*Si j’avais su, je serais venu(e).*)\n**Piège absolu :** Jamais de futur ni de conditionnel juste après « si » !',
          tags: ['Si clauses', 'Conditionnel'],
        },
        {
          id: 'fr-card-206',
          frontMarkdown: '4 Faux Amis mortels : **actuellement**, **éventuellement**, **sensible**, **passer un examen**',
          backMarkdown:
            '- **actuellement** = *currently / right now* (pour *actually*, dites : **en fait / à vrai dire**)\n- **éventuellement** = *possibly / if need be* (pour *eventually*, dites : **finalement / à terme**)\n- **sensible** = *sensitive* (pour *sensible/reasonable*, dites : **sensé(e) / raisonnable**)\n- **passer un examen** = *to sit/take an exam* (pour *to pass*, dites : **réussir un examen**)',
          tags: ['Faux amis', 'Vigilance lexicale'],
        },
      ],
    },
  ],
};
