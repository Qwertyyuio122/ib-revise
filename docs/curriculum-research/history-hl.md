# IB Diploma History HL — Exhaustive Curriculum Research & App Engineering Specification

> **Target Application:** Simple Revision  
> **Primary Syllabus Scope:** IB Diploma Programme History HL — **First Examinations 2017 / Amended First Examinations 2020** (active assessment syllabus through **May & November 2027**)  
> **Dual-Version Transition Scope:** IB Diploma Programme History HL — **First Teaching August/September 2026 / First Assessment May 2028** (published February 2026; active for DP1 cohorts entering in 2026–2027)  
> **Research Date:** November 2026  

---

## Executive Summary & Active Syllabus Versioning Alert

Because the current academic calendar sits in **late 2026**, **Simple Revision** serves two live IB History HL cohorts simultaneously:

1. **Cohort A — Exam Sessions through November 2027 (Current DP2 Students):** Assessed on the **2017 Guide (with 2020 Amendments)**. Features 6 Key Concepts, 5 Paper 1 Prescribed Subjects (4 questions including 4-mark OPCVL, 24 marks, 1h), 12 Paper 2 World History Topics (2 essays, 30 marks, 1h 30m), 4 Paper 3 HL Regional Options with 18 sections each (3 essays, 45 marks, 2h 30m), and a 25-mark Historical Investigation IA (Criteria A/B/C including a 4-mark Reflection).
2. **Cohort B — Exam Sessions from May 2028 Onward (Current DP1 Students who began Aug/Sept 2026):** Assessed on the **First Assessment 2028 Guide** (published February 2026). Features 4 Specified Historical Concepts, 5 Paper 1 Focused Studies (3 static questions removing OPCVL, 24 marks, 1h 15m), 4 Paper 2 Thematic Studies with Section A concept question + Section B short/essay question (25 marks, 1h 45m), 4 Paper 3 Regional Studies with 12 studies each (2 essays instead of 3, 30 marks, 2h), and a redesigned 24-mark IA (maximum 7 sources, Reflection criterion removed).

**Engineering Mandate:** Every curriculum selector, question tag, grading rubric, and study-asset generator in Simple Revision should require or default-select a `curriculumVersion: '2020' | '2028'` field (defaulting to `'2020'` for 2027 exam candidates and allowing `'2028'` for 2028+ exam candidates). Sections 1–5 below specify the **active 2017/2020 syllabus exhaustively**, while **Section 2.5** and dedicated 2028 subsections capture the full **2028 syllabus specification**.

---

## 1. Course Overview & HL Assessment Blueprint

### 1.1 Teaching Hours & SL vs HL Distinction (2017/2020 Active Guide)

| Syllabus Component | SL Hours | HL Hours | Structural Requirements |
| :--- | :---: | :---: | :--- |
| **Prescribed Subjects** (Paper 1) | 40 | 40 | Study **1** of 5 Prescribed Subjects; **both** specified case studies (from different world regions) are mandatory. |
| **World History Topics** (Paper 2) | 90 | 90 | Study **2** of 12 World History Topics; examples for each topic must come from **more than one** of the 4 IB world regions. |
| **HL Options: Depth Studies** (Paper 3) | — | 90 | HL only: select **1** of 4 Regional Options and study **3** of its **18** sections. |
| **Internal Assessment** (Historical Investigation) | 20 | 20 | Individual historical inquiry on any topic (>10 years old), max **2,200 words**. |
| **Total Recommended Teaching Hours** | **150** | **240** | Aligns with IB DP General Regulations. |

### 1.2 Assessment Objectives (2017/2020 Active Guide)

* **AO1 — Knowledge and understanding:** Demonstrate detailed, relevant, and accurate historical knowledge; demonstrate understanding of historical concepts and context; demonstrate understanding of historical sources (IA and Paper 1).
* **AO2 — Application and analysis:** Formulate clear and coherent arguments; use relevant historical knowledge to effectively support analysis; analyse and interpret a variety of sources (IA and Paper 1).
* **AO3 — Synthesis and evaluation:** Integrate evidence and analysis to produce a coherent response; evaluate different perspectives on historical issues and events, and integrate this evaluation effectively; evaluate sources as historical evidence recognizing value and limitations (IA and Paper 1); synthesize information from a selection of relevant sources (IA and Paper 1).
* **AO4 — Use and application of appropriate skills:** Structure and develop focused essays responding effectively to question demands; reflect on the methods used by, and challenges facing, the historian (IA); formulate an appropriate, focused question (IA); demonstrate research skills, organization, referencing, and selection of appropriate sources (IA).

### 1.3 External & Internal Assessment Breakdown — HL vs SL (2017/2020 Active Guide)

| Component | Level | Duration | Format & Question Selection | Raw Marks | SL Weight | HL Weight |
| :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| **Paper 1** | SL & HL | **1 hour** | Source-based exam on 1 chosen Prescribed Subject (exam tests **1** of the 2 case studies using **4 sources** — primary or mixed primary/secondary; written, pictorial, or diagrammatic). **4 compulsory structured questions.** | **24** | 30% | **20%** |
| **Paper 2** | SL & HL | **1 hour 30 mins** | World History Topics essay paper. 24 questions total (2 per topic × 12 topics). Answer **2 essay questions from 2 different topics** (15 marks each). | **30** | 45% | **25%** |
| **Paper 3** | **HL only** | **2 hours 30 mins** | Separate paper per Regional Option. 36 questions total (2 per section × 18 sections). Answer **any 3 essay questions** (15 marks each). Named people/events in questions are restricted to those explicitly named in the guide. | **45** | — | **35%** |
| **Internal Assessment** | SL & HL | 20 hrs (coursework) | Historical Investigation (max **2,200 words**; bibliography & references excluded). 3 sections assessed by 3 criteria (A: 6m, B: 15m, C: 4m). Internally marked, externally moderated. | **25** | 25% | **20%** |
| **Totals** | | **SL: 2h 30m exam / HL: 5h exam** | | **SL: 79 / HL: 124 raw** (scaled to 100%) | **100%** | **100%** |

#### Paper 1 Exact Mark Allocation (24 Marks Total)

| Question | Focus & Skill Tested | Marks | Marking Method |
| :--- | :--- | :---: | :--- |
| **Q1 Part A** | Comprehension / understanding of **one** specified source (usually textual). | **3** | Paper-specific markscheme (point-marked: 3 valid points) |
| **Q1 Part B** | Comprehension / understanding of **one** specified source (frequently visual/political cartoon or concise text). | **2** | Paper-specific markscheme (point-marked: 2 valid points) |
| **Q2** | Analyse the **value and limitations** of **one** specified source for a historian studying the topic, with reference to **origin, purpose, and content** (OPCVL). | **4** | Paper-specific markscheme (max **2 marks** if only value OR only limitations are addressed) |
| **Q3** | **Compare and contrast** what **two** specified sources reveal to a historian studying a specified aspect of the case study. | **6** | Paper-specific markscheme (running comparison of similarities and differences in content only) |
| **Q4** | Evaluative mini-essay synthesizing evidence from **the sources** and **own knowledge**. | **9** | Generic 9-mark markbands (0, 1–3, 4–6, 7–9) + paper-specific markscheme |

### 1.4 Recent HL Grade Boundaries (2017/2020 Syllabus Reference)

For Simple Revision's score predictor (percentage-scaled total out of 100% across P1 20% + P2 25% + P3 35% + IA 20%):

| Final IB Grade | May 2024 | Nov 2024 | May 2025 | Nov 2025 | Typical P1 Raw (/24) | Typical P2 Raw (/30) | Typical P3 Raw (/45) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **7** | 73%–74% | 74% | 73%–74% | 74% | 19–24 | 24–30 | ~31–45 |
| **6** | 60%–62% | 61%–62% | 60%–61% | 61%–62% | 16–18 | 20–23 | ~26–30 |
| **5** | 48%–51% | 51% | 48%–49% | 50% | 13–15 | 15–19 | ~22–25 |
| **4** | 36%–39% | 38%–39% | 35%–37% | 38% | 10–12 | 11–14 | ~16–21 |
| **3** | 25%–29% | 28%–29% | 24%–26% | 28% | — | — | — |
| **2** | 11%–15% | 14%–15% | 11%–12% | 14% | — | — | — |

*(Ranges across TZ1/TZ2/TZ3 timezones. Raw Paper 3 component boundaries fluctuate slightly by region and session; ~70%+ is the standard Grade 7 benchmark.)*

### 1.5 Side-by-Side Comparison: Active 2017/2020 Syllabus vs New 2026/2028 Syllabus (HL)

| Dimension | Active 2017/2020 Guide (Exams through Nov 2027) | Redesigned 2028 Guide (First Teaching Aug 2026 / Exams May 2028+) |
| :--- | :--- | :--- |
| **Core Concepts** | **6 concepts:** Change, Continuity, Causation, Consequence, Significance, Perspectives | **4 specified concepts:** Cause and consequence, Continuity and change, Perspectives, Significance |
| **Paper 1 Component** | **Prescribed Subjects** (5 choices × 2 case studies), 40h | **Focused Studies** (5 choices × 2 paired examples × 3 inquiry questions), 50h |
| **Paper 1 Format** | **1h**, 24 marks, **20% HL** (30% SL); 4 sources; 4 questions (Q1a 3m, Q1b 2m, Q2 OPCVL 4m, Q3 Compare/Contrast 6m, Q4 Synthesis 9m) | **1h 15m**, 24 marks, **20% HL** (30% SL); 3 sources (A, B, C) under 1 overarching inquiry question; **3 static questions** (Q1 content of A+B [6m], Q2 context of C [6m], Q3 perspectives of A+B+C [12m]); **OPCVL removed** |
| **Paper 2 Component** | **World History Topics** (choose 2 of 12), 90h | **Thematic Studies** (choose 1 of 4: Conflict, Innovation & transformation, Authoritarian rule, Popular movements), 80h |
| **Paper 2 Format** | **1h 30m**, 30 marks, **25% HL** (45% SL); 2 essays from 2 different topics (15m each) | **1h 45m**, 25 marks, **25% HL** (40% SL); **Sec A:** 1 concept analysis question [6m] + **Sec B:** 1 two-part thematic question (part a short answer [4m] + part b multi-regional essay [15m]) |
| **Paper 3 Component** | **HL Options** (1 of 4 regions; 3 of **18** sections), 90h | **Regional Studies** (1 of 4 regions; 2 of **12** studies), 90h |
| **Paper 3 Format** | **2h 30m**, 45 marks, **35% HL**; 36 questions; answer **3 essays** (15m each) | **2h**, 30 marks, **35% HL**; 24 questions; answer **2 essays** from different regional studies (15m each); focuses on evaluating historical arguments |
| **Internal Assessment** | **25 marks**, **20% HL** (25% SL), 2,200w; Sec 1 OPCVL of 2 sources (6m), Sec 2 Investigation (15m), Sec 3 Reflection (4m); >10 years old rule | **24 marks**, **20% HL** (30% SL), 2,200w; Sec 1 Historical inquiry question (6m), Sec 2 Sources & perspectives (max **7 sources**, 6m), Sec 3 Synthesis & evaluation (12m); **Reflection removed**; 20-year "contemporary" analytical rule |

---

## 2. Complete Curriculum Breakdown (Active Assessment Syllabus: 2017 Guide + 2020 Amendments)

### 2.1 The 6 Key IB History Concepts

The 2017/2020 DP History course integrates **three inextricable elements** — **Content**, **Concepts**, and **Skills** — structured around **six key concepts** (derived from Seixas & Morton 2013):

1. **Change:** Investigating the extent to which people and events transformed societies, looking for change where continuity is claimed or challenging orthodox assumptions about supposed turning points through explicit before-and-after comparisons.
2. **Continuity:** Recognizing that change can be slow and that substantial continuity frequently persists amid dramatic upheaval (e.g., asking whether a regime change genuinely altered foreign policy or mirrored predecessors).
3. **Causation:** Recognizing that historical events emerge from an interplay of diverse, multiple causes (short-, medium-, and long-term; structural conditions vs human agency), requiring evidence-based prioritization of relative causal weight.
4. **Consequence:** Understanding how past forces shaped subsequent societies across both short-term and long-lasting horizons, evaluating the durability and reach of those effects across time.
5. **Significance:** Recognizing that history is not an unfiltered record of everything that happened, but a constructed narrative shaped by surviving evidence and conscious inclusion/exclusion; assessing why specific actors, groups, or events mattered and who has been omitted.
6. **Perspectives:** Challenging grand narratives or narrow national mythologies by corroborating and contrasting multiple primary-source viewpoints and historiographical interpretations, including experiences of marginalized groups and women.

---

### 2.2 Paper 1 — All 5 Prescribed Subjects (Exhaustive Content & Case Studies)

Both case studies for the chosen prescribed subject **must** be studied (drawn from two different world regions). Each exam tests **one** of the two case studies using four sources.

#### Prescribed Subject 1: Military leaders
*Focus: Two medieval military commanders from different world regions, their rise, campaigns, military methods, and multi-dimensional impact.*

* **Case Study 1: Genghis Khan (c1200–1227)**
  * **Leadership:**
    * Rise to power; uniting of rival tribes
    * Motives and objectives; success in achieving those objectives
    * Reputation: military prowess; naming as Genghis Khan (1206)
    * Importance of Genghis Khan’s leadership to Mongol success
  * **Campaigns:**
    * Mongol invasion of China: attacks on the Jin dynasty; capture of Beijing (1215)
    * Mongol invasion of Central Asia and Iran; Mongol invasion of Khwarezmia (1219–1221)
    * Mongol military technology, organization, strategy and tactics
  * **Impact:**
    * Political impact: administration; overthrowing of existing ruling systems; establishment of Mongol law/Yassa; move towards meritocracy
    * Economic impact: establishment, enhancement and protection of trade routes
    * Social, cultural and religious impact: population displacement; terror, looting and murdering; raiding and destruction of settlements; religious, cultural and technological exchange; religious freedom under the Mongols

* **Case Study 2: Richard I of England (1173–1199)**
  * **Leadership:**
    * Rise to power: revolt of Richard I and his brothers against Henry II (1173–1174)
    * Reputation: military prowess; chivalry; “Richard the Lionheart”
    * Motives and objectives: defence and recovery of the French lands; defence of the crusader states and recovery of lost territory; success in achieving those objectives
  * **Campaigns:**
    * Occupation of Sicily (1190–1191); conquest of Cyprus (1191)
    * Involvement in the Third Crusade (1191–1192)
    * The course, outcome and effects of Richard I’s campaigns in France, the Mediterranean and the Middle East
  * **Impact:**
    * Political impact in England: absence of the king; political instability; revolt of John and Philip in Richard’s absence
    * Political impact in France: growth in prestige and strength of the Capetian monarchy; expansion of royal control
    * Economic impact: raising money for campaigns; taxation of clergy; raising of the ransom after his capture and imprisonment by Leopold V, Duke of Austria and Henry VI, Holy Roman Emperor (1193)
    * Social, cultural and religious impact: anti-Jewish violence; treatment of Muslim prisoners during the Third Crusade

#### Prescribed Subject 2: Conquest and its impact
*Focus: Spanish conquest across Iberia and the Americas, including 2020 official amendments.*

* **Case Study 1: The final stages of Muslim rule in Spain**
  * **Context and motives:**
    * Political context in Iberia and Al-Andalus in the late 15th century; internal conflicts and alliances in Granada in the late 15th century
    * Social and economic context in Iberia and Al-Andalus in the late 15th century; coexistence of population; intercultural exchange; economic decline; heavy taxation
    * Motives: political motives; religious motives and the role of the church
  * **Key events and actors:**
    * The Granada War and the conquest of Granada (1482–1492)
    * Treaty of Granada (1491); Alhambra decree (1492)
    * Key actors: Fernando de Aragón and Isabel de Castilla; Abu Abdallah (Boabdil), last king of Granada; **Tomás de Torquemada** *(added by 2020 Amendment)*
  * **Impact:**
    * Social and demographic changes; persecution, enslavement and emigration; new institutions: *encomienda*, *fueros*
    * Forced conversions and expulsions; Marranos, Mudéjars
    * The Spanish Inquisition

* **Case Study 2: The conquest of Mexico and Peru (1519–1551)**
  * **Context and motives:**
    * Political and economic motives for exploration and conquest
    * Religious arguments for the conquest
  * **Key events and actors:**
    * Hernán Cortés and the campaign against the Aztec Empire; alliances with indigenous populations
    * Francisco Pizarro and the campaign against the Incas; alliances with indigenous populations
    * Key actors: Diego de Almagro, Malinche, Atahualpa, Moctezuma II; **Bartolomé de las Casas and Juan Ginés de Sepúlveda** *(explicitly named in 2020 Amendment; "Las Casas against Sepúlveda" in 2015 print)*
  * **Impact:**
    * Social and economic impact on indigenous populations; the *encomienda* and *Mita* systems *(clarified scope in 2020 Amendment)*
    * Causes and effects of demographic change; spread of disease
    * Cultural interaction and exchange

#### Prescribed Subject 3: The move to global war
*Focus: Military expansion (1931–1941), its domestic/ideological/economic causes, and international responses. (Most popular Paper 1 option globally.)*

* **Case Study 1: Japanese expansion in East Asia (1931–1941)**
  * **Causes of expansion:**
    * The impact of Japanese nationalism and militarism on foreign policy
    * Japanese domestic issues: political and economic issues, and their impact on foreign relations (e.g., Shidehara diplomacy collapse, Great Depression, Zaibatsu/rural distress, military factions Kōdōha/Tōseiha, *gekokujō*)
    * Political instability in China (Warlord Era, GMD–CCP conflict, Northern Expedition)
  * **Events:**
    * Japanese invasion of Manchuria and northern China (1931) (Mukden Incident, Manchukuo, Tanggu Truce)
    * Sino-Japanese War (1937–1941) (Marco Polo Bridge Incident, Nanjing, escalation)
    * The Three Power/Tripartite Pact (1940); the outbreak of war; Pearl Harbor (1941)
  * **Responses:**
    * League of Nations and the Lytton report (1932)
    * Political developments within China—the Second United Front (Xi'an Incident 1936)
    * International response, including US initiatives and increasing tensions between the US and Japan (Stimson Doctrine, Moral Embargo, Export Control Act, July 1941 asset freeze & oil embargo, Hull Note)

* **Case Study 2: German and Italian expansion (1933–1940)**
  * **Causes of expansion:**
    * Impact of fascism and Nazism on the foreign policies of Italy and Germany (*spazio vitale*, *mare nostrum*, *Lebensraum*, racial hierarchy, revision of Versailles)
    * Impact of domestic economic issues on the foreign policies of Italy and Germany (Great Depression, autarky, Four-Year Plan / Mefo bills, *Battle for Grain* / corporatism limits)
    * Changing diplomatic alignments in Europe; the end of collective security; appeasement
  * **Events:**
    * German challenges to the post-war settlements (1933–1938) (withdrawal from Geneva Disarmament Conference & League, Saar plebiscite, conscription, Anglo-German Naval Agreement, Rhineland 1936, Hossbach Memorandum, Anschluss 1938, Sudetenland/Munich 1938)
    * Italian expansion: Abyssinia (1935–1936) (Walwal, Hoare-Laval Pact); Albania (1939); entry into the Second World War (June 1940)
    * German expansion (1938–1939); Pact of Steel (May 1939), Nazi–Soviet Pact (Aug 1939) and the outbreak of war (Sept 1939)
  * **Responses:**
    * International response to German aggression (1933–1938) (Stresa Front, appeasement, Munich Agreement)
    * International response to Italian aggression (1935–1936) (League sanctions excluding oil/Suez, Hoare-Laval backlash)
    * International response to German and Italian aggression (1940) (Phoney War collapse, Fall of France, British resistance, US Cash-and-Carry / Destroyers-for-Bases)

#### Prescribed Subject 4: Rights and protest
*Focus: Mid-20th-century struggles for civil rights and political freedom.*

* **Case Study 1: Civil rights movement in the United States (1954–1965)**
  * **Nature and characteristics of discrimination:**
    * Racism and violence against African Americans; the Ku Klux Klan; disenfranchisement (poll taxes, literacy tests, intimidation)
    * Segregation and education; *Brown versus Board of Education* decision (1954); Little Rock (1957) (Little Rock Nine, Orval Faubus, Eisenhower's 101st Airborne)
    * Economic and social discrimination; legacy of the Jim Crow laws; impact on individuals
  * **Protests and action:**
    * Non-violent protests; Montgomery bus boycott (1955–1956); Freedom Rides (1961); Freedom Summer (1964) (plus Birmingham 1963, March on Washington 1963, Selma 1965)
    * Legislative changes: Civil Rights Act (1964); Voting Rights Act (1965)
  * **The role and significance of key actors/groups:**
    * Key actors: Martin Luther King Jr; Malcolm X; Lyndon B Johnson
    * Key groups: National Association for the Advancement of Colored People (NAACP); Southern Christian Leadership Conference (SCLC) and Student Non-violent Coordinating Committee (SNCC); the Nation of Islam (Black Muslims)

* **Case Study 2: Apartheid South Africa (1948–1964)**
  * **Nature and characteristics of discrimination:**
    * “Petty Apartheid” and “Grand Apartheid” legislation (Prohibition of Mixed Marriages Act 1949, Population Registration Act 1950, Group Areas Act 1950, Reservation of Separate Amenities Act 1953, Bantu Education Act 1953)
    * Division and “classification”; segregation of populations and amenities; creation of townships/forced removals (Sophiatown, District Six context); segregation of education; Bantustan system (Promotion of Bantu Self-Government Act 1959); impact on individuals
  * **Protests and action:**
    * Non-violent protests: bus boycotts (Alexandra 1957); defiance campaign (1952), Freedom Charter (1955)
    * Increasing violence: the Sharpeville massacre (1960) and the decision to adopt the armed struggle (banning of ANC/PAC, formation of MK & Poqo)
    * Official response: the Rivonia trial (1963–1964) and the imprisonment of the ANC leadership
  * **The role and significance of key actors/groups:**
    * Key individuals: Nelson Mandela; Albert Luthuli
    * Key groups: the African National Congress (ANC); the South African Communist Party (SACP) and the MK (*Umkhonto we Sizwe*—“Spear of the Nation”)

#### Prescribed Subject 5: Conflict and intervention
*Focus: Post-Cold War ethnic conflict, genocide, crimes against humanity, and international intervention.*

* **Case Study 1: Rwanda (1990–1998)**
  * **Causes of the conflict:**
    * Ethnic tensions in Rwanda; the creation of the Hutu power movement and the *Interahamwe*; role of the media (*Kangura*, RTLM)
    * Other causes: economic situation (coffee price collapse, structural adjustment); colonial legacy (Belgian Hamitic hypothesis, 1933 ethnic ID cards, 1959 social revolution)
    * Rwandan Civil War (1990–1993) (Arusha Accords); assassination of Habyarimana and Ntaryamira (6 April 1994)
  * **Course and interventions:**
    * Actions of the Rwandan Patriotic Front (RPF) and Rwandan government; role of the media
    * Nature of the genocide and other crimes against humanity; war rape
    * Response of the international community; the United Nations Assistance Mission for Rwanda (UNAMIR — Roméo Dallaire); reasons for inaction (Somalia syndrome / PDD-25); role of France (*Opération Turquoise*), Belgium (paratrooper withdrawal after 10 killed), and the US
  * **Impact:**
    * Social impact; refugee crisis (Goma camps); justice and reconciliation (*Gacaca* origins context)
    * International impact; establishment of the International Criminal Tribunal for Rwanda (1994) (note: guide text also notes ICC statute adopted 1998 in intro)
    * Political and economic impact; RPF-led governments; continued warfare in the Democratic Republic of Congo (Zaire)

* **Case Study 2: Kosovo (1989–2002)**
  * **Causes of the conflict:**
    * Ethnic tensions between Serbs and Kosovar Albanians; rising Albanian nationalism
    * Political causes: constitutional reforms (1989–1994) (revocation of Kosovo autonomy); repression of the Albanian independence campaign
    * Role and significance of Slobodan Milosevic and Ibrahim Rugova
  * **Course and interventions:**
    * Actions of Kosovo Liberation Army (KLA), Serbian government police and military
    * Ethnic cleansing and crimes against humanity; significance of the Račak massacre (Jan 1999)
    * Response of the international community; response of the UN; NATO bombing campaign (Operation Allied Force, March–June 1999); Kosovo Force (KFOR)
  * **Impact:**
    * Social and economic consequences; refugee crisis; damage to infrastructure
    * Political impact in Kosovo; election of Ibrahim Rugova as president (2002)
    * International reaction and impact; International Criminal Tribunal for the Former Yugoslavia (ICTY); indictment of Milosevic

---

### 2.3 Paper 2 — All 12 World History Topics (Exhaustive Specification)

> **Critical Exam Rules Across ALL 12 Topics (2020 Amended Wording):**
> 1. **Four Official IB Regions:** *Africa and the Middle East*, *The Americas*, *Asia and Oceania*, *Europe*.
> 2. **Two-Region Rule:** *"Examination questions may require students to make reference to examples from two different regions of the world."* Examples in the guide are **suggestions only** (not prescriptive), except where the prompt mandates two different regions.
> 3. **Cross-Regional War Non-Duplication Rule (Topics 2, 6, 11):** A cross-regional conflict (e.g., the Crusades, WWI, WWII) may be used in one regional context (e.g., WWII in the Pacific = Asia and Oceania), but the **same war may NOT be reused** for the second region in the same essay (e.g., WWII in Europe).

#### World History Topic 1: Society and economy (750–1400)
* **Society and economy:** Changes in social structures and systems; Impact of population change, famines and disease; Role of women in society: economic and non-economic roles *(scope clarified 2020)*; Nature and development of trade; changes in economic systems; taxation *(scope clarified 2020)*; Changes in travel and transportation.
* **Cultural and intellectual developments:** Role and significance of key individuals; Factors affecting the transmission of ideas and cultures; Significance and impact of artistic and cultural developments; developments in architecture; Developments in science and technology.
* **Religion and society:** Religious institutions and the economy; influence of religious institutions on society *(simplified 2020)*; Role of religious leaders in government and administration; disputes between rulers and religious leaders; Treatment of religious minorities; religious persecution; Spread of religion.
* **Suggested Examples:** *Africa/ME:* spread of Islam in Africa, al-Ghazali, Maimonides, peasant taxation in Egypt, Ghana Empire trans-Saharan trade, Black Death in Mamluk Egypt. *Americas:* Mayan decline, Purépecha architecture, Athabaskan speakers into Pueblo territories, Woodland/Mississippian cultures. *Asia/Oceania:* spread of Buddhism, Song dynasty (960–1279), Angkor Wat, Silk Road, rise of Samurai. *Europe:* Dante Alighieri, Black Death, manorialism, Venice/Genoa city states, Romanesque to Gothic architecture.

#### World History Topic 2: Causes and effects of wars (750–1500)
*(Title amended for 2020 from "Causes and effects of medieval wars (750–1500)".)*
* **Types and causes of conflicts:** Dynastic, territorial and religious disputes; Economic causes, competition for resources; Political causes *(simplified 2020)*; Religious causes; Long-term, short-term and immediate causes.
* **Course, practices and outcomes** *(title amended 2020)*: Role and significance of leaders; Mobilization of human and economic resources *(replaced knighthood/mercenaries wording in 2020)*; Logistics, tactics and organization of warfare; Role and significance of women *(replaced "Women and war" in 2020)*.
* **Effects:** Conquest, boundary and dynastic changes; Treaties and truces *(clarified 2020)*; Political repercussions *(clarified 2020)*; Economic, social, religious and cultural changes; Demographic changes and population movements.
* **Suggested Examples:** *Wars:* Norman conquest (1066), England vs France (1154–1204), Hundred Years' War (1337–1453), Wars of the Roses (1455–1487), Crusades (1095–1291), Toluid Civil War (1260–1264), Great 'Abbasid Civil War (809–813), Byzantine–Seljuq Wars (1048–1308), Byzantine–Bulgarian Wars under Khan Krum (807–814), Tepanec War with the Aztecs (1428–1430). *Leaders:* Nur al-Din, Saladin, Richard I, Edward III, Louis VII, Charles V, Genghis Khan, Kublai Khan, Tamerlane.

#### World History Topic 3: Dynasties and rulers (750–1500)
* **Dynasties and rulers:** Individual rulers: nature of power and rule, aims and achievements; Methods used to legitimize, consolidate and maintain rule; Expansion of dynasties/kingdoms: reasons, methods, invasion and settlement.
* **Law, governing institutions and administration:** Methods of government and administration *(2020 removed "Models and")*; Effects of religious and secular law *(2020 amended from "Sources of...")*; Administration and interpretation of law; Role and duties of officials; role of nobility and the elite.
* **Challenges:** Successes and failures of dynasties and rulers; Methods used to address internal and external challenges to power *(simplified 2020)*; Rebellion and/or political opposition; rivalries and issues of succession.
* **Suggested Examples:** *Dynasties:* 'Abbasid, Fatimid, Zagwe, Carolingian, Song, Jin, Mongol, Almohad, Second Bulgarian, Kievan Rus, Kingdom of Cusco, Trần (Vietnam), Tulunid, Ayyubid, Comnenian. *Rulers:* Charlemagne, Tamerlane, Matilda, Louis VI, Harun al-Rashid, 'Abd al-Rahman III, Frederick I Barbarossa, Empress Theodora, Itzcoatl, Hongwu, Basil II, Baibars.

#### World History Topic 4: Societies in transition (1400–1700)
* **Social and economic change:** Changing social structures and systems; role of women in society; Population expansion and movements; Treatment of minority or indigenous peoples *(amended 2020)*; Economic change: development of and changing patterns of trade; role and impact of merchants and travellers.
* **Cultural and intellectual change:** Artistic, cultural and intellectual movements; Cross-cultural exchange; Scientific and technological developments and their social/cultural impact; Role and significance of key intellectual/scientific figures.
* **Religious change:** Religion and the state: interactions, support or challenge to the state; Religious expansion and conversion; Religious division, conflict, discrimination and persecution.
* **Suggested Examples:** *Africa/ME:* salt/gold trade, Christian art/architecture in Ethiopia, Bantu migration, slavery impact in Africa, spread of Islam in West Africa/Swahili Coast. *Asia/Oceania:* Indian Ocean trade, Ming collapse, Azuchi-Momoyama period in Japan (1568–1600). *Americas:* indigenous treatment, transatlantic trade, slavery impact. *Europe:* Renaissance, Enlightenment, Gutenberg printing press (1450), decline of feudalism, Spanish Inquisition, Reformation & Catholic Reformation, navigational instruments, Copernicus/Kepler/Newton/Galileo.

#### World History Topic 5: Early Modern states (1450–1789)
* **Nature of power and rule:** Established and new states (ascendancy and decline); Methods and models of government; political structures/organization; domestic policies; treatment of subjects; Individual rulers: ideology, nature of rule, ambition/achievements, legitimacy, successes and failures.
* **Expansion:** *(bullet points combined/simplified in 2020)* Expansion of established states & colonial empires: political and economic reasons for expansion and territory acquisition; Political organization and structures of government in established states and colonial states; relationship between religion and the state.
* **Conflicts and challenges:** Methods of maintaining power; treatment of opposition; Support and opposition; challenges to power and success in overcoming them; Challenges to colonial rule: resistance, rebellions, colonial race competition/conflict; Rivalries and tensions; issues of succession.
* **Suggested Examples:** *Africa/ME:* Ottoman expansion into ME & North Africa, Safavid Persia, Songhai Empire, Benin Empire, Ajuran Sultanate. *Americas:* New Spain, British North America, British–French colonial conflicts, Iroquois confederation, Spanish conquest of Inca, Pueblo Revolt (1680). *Asia/Oceania:* Tokugawa Shogunate, early Qing dynasty, Mughal India, Ayutthaya Kingdom. *Europe:* Ottoman expansion into Europe, Russia under Peter the Great, Kingdom of Granada from 1492, France under Louis XIV.

#### World History Topic 6: Causes and effects of Early Modern wars (1500–1750)
* **Causes of conflicts:** Ideological and political causes; Economic causes and competition for resources; Religious causes; Short- and long-term causes.
* **Practices and impact on outcome:** Role and significance of leaders; Mobilization of human and economic resources *(replaced raising armies/mercenaries in 2020)*; Organization of warfare & land/sea strategies *(clarified 2020)*; Significance of technological developments; Influence and/or involvement of foreign powers *(clarified 2020)*.
* **Effects:** Successes and/or failures of peacemaking *(adjusted 2020)*; Economic, political and territorial impact; Social and religious impact; Demographic changes and population movements.
* **Suggested Examples:** *Africa/ME:* Ethiopian–Adal War (1529–1543), Ottoman–Mamluk War (1516–1517), Moroccan invasion of Songhai (1591). *Americas:* Acadian Civil War (1640–1645), Beaver Wars, Spanish conquest of Aztecs/Incas, Pueblo Revolt (1680). *Asia/Oceania:* Mughal conquests, Burmese–Siamese War (1547–1549), Japanese invasions of Korea (1592–1598), Qing conquest of Ming. *Europe:* Dutch War of Independence (1568–1648), Thirty Years' War (1618–1648), Russo-Swedish War (1554–1557), Great Northern War (1700–1721), English Civil War (1642–1651).

#### World History Topic 7: Origins, development and impact of industrialization (1750–2005)
* **The origins of industrialization:** Causes and enablers; availability of human and natural resources; political stability; infrastructure; Role and significance of technological developments; Role and significance of individuals.
* **The impact and significance of key developments:** Developments in transportation; Developments in energy and power; Industrial infrastructure (iron and steel) & mass production *(reworded 2020 for example flexibility)*; Developments in communications.
* **The social and political impact of industrialization:** Urbanization and growth of cities/factories; Labour conditions and organization of labour; Political representation and opposition to industrialization; Impact on standards of living: disease and life expectancy; leisure *(2020 removed "literacy and media")*.
* **Suggested Examples:** *Countries:* Egypt, South Africa; Argentina, US, Canada; Japan, India, Australia; Great Britain, Germany, Russia/USSR. *Tech:* combustion engine, steam engine, gas lighting, electricity, iron/cotton spinning, sulphuric acid, Bessemer steel, nuclear power, IT. *Individuals:* Edison, Wright brothers, Babbage, Carnegie, Vanderbilt, Bell, Ford, Arkwright, Faraday, Watt, Lenoir, Berners-Lee.

#### World History Topic 8: Independence movements (1800–2000)
*Focus: Movements seeking independence from a foreign power (Solidarity in Poland excluded); minimum 3 recommended.*
* **Origins and rise of independence movements, up to the point of independence:** Role and relative importance of nationalism and political ideology; Role and relative importance of religion, race, social and economic factors; Wars as a cause and/or catalyst; Other internal and external factors fostering growth.
* **Methods used and reasons for success:** Methods of achieving independence (violent and non-violent); Role and importance of leaders; Relative importance of other factors in success.
* **Challenges faced in the first 10 years, and responses to the challenges:** Political problems; ethnic, racial and separatist movements; Social, cultural and economic challenges; Responses to challenges and their effectiveness.
* **Suggested Examples:** *Africa/ME:* Ben Bella (Algeria), Nkrumah (Ghana), Kenyatta (Kenya), Mugabe (Rhodesia/Zimbabwe). *Americas:* José Martí (Cuba), San Martín (River Plate), Bolívar (Gran Colombia), Dessalines (Haiti). *Asia/Oceania:* Nehru/Gandhi (India), Jinnah (Pakistan), Somare (Papua New Guinea), Ho Chi Minh (Vietnam). *Europe:* Kolokotronis (Greece), Kossuth/Dual Monarchy Hungary (1867), Collins/de Valera (Ireland).

#### World History Topic 9: Emergence and development of democratic states (1848–2000)
*(Title amended for 2020 from "Evolution and development..."; minimum 3 recommended.)*
* **Emergence of democratic states:** Conditions encouraging demand for democratic reform: aftermath of war/political upheaval; political, social, economic factors; external influences; Role and significance of leaders; Development of political parties, constitutions and electoral systems — significance/impact **in the emergence of democracy** *(amended 2020)*.
* **The development of democratic states:** Factors influencing evolution: immigration, ideology, economic forces, foreign influences; Responses to and impact of domestic crises; Struggle for equality: suffrage movements, civil protests.
* **Aims and results of policies** *(title amended 2020 from "Impact of democracy on society")*: Social and economic policies and reforms: education, social welfare, policies towards women and minorities, distribution of wealth; Extent to which citizens benefit from those policies; Cultural impact; freedom of expression in the arts and media.
* **Suggested Examples:** *Africa/ME:* South Africa, Israel, Lebanon, Ghana. *Americas:* Argentina, Mexico, Venezuela, Chile. *Asia/Oceania:* India, Japan, Malaysia, Australia. *Europe:* Spain, Italy, Germany, Czech Republic, Poland.

---

#### World History Topic 10: Authoritarian states (20th century) *(High-Yield Core)*
*(Minimum 3 states recommended; comparative questions often demand states from 2 different regions.)*

| Sub-Topic | Prescribed Syllabus Bullet Points |
| :--- | :--- |
| **Emergence of authoritarian states** | • Conditions in which authoritarian states emerged: economic factors; social division; impact of war; weakness of political system<br>• Methods used to establish authoritarian states: persuasion and coercion; the role of leaders; ideology; the use of force; propaganda |
| **Consolidation and maintenance of power** | • Use of legal methods; use of force; charismatic leadership; dissemination of propaganda<br>• Nature, extent and treatment of opposition<br>• The impact of the success and/or failure of foreign policy on the maintenance of power |
| **Aims and results of policies** | • Aims and impact of domestic economic, political, cultural and social policies<br>• The impact of policies on women and minorities<br>• Authoritarian control and the extent to which it was achieved |

* **Suggested Official Examples:**
  * *Africa/ME:* Tanzania—Nyerere; Egypt—Nasser; Iraq—Saddam Hussein; Kenya—Kenyatta; Uganda—Amin.
  * *Americas:* Argentina—Perón; Cuba—Castro; Chile—Pinochet; Haiti—Duvalier; Nicaragua—Somoza.
  * *Asia/Oceania:* China—Mao; Indonesia—Sukarno; Pakistan—Zia ul Haq; Cambodia—Pol Pot.
  * *Europe:* Germany—Hitler; USSR—**Lenin and Stalin** *(2020 Amendment)*; Italy—Mussolini; Spain—Franco; Poland—Pilsudski.

##### High-Yield Case Study Dossier (Topic 10)
* **Germany — Adolf Hitler (Europe):** *Emergence:* WWI defeat/Versailles, Weimar structural flaws (PR, Art 48), 1923 hyperinflation, 1929 Great Depression (6M unemployed), SA violence + Goebbels propaganda + backroom elite deal (von Papen/Hindenburg, Jan 1933). *Consolidation:* Reichstag Fire Decree (Feb 1933), Enabling Act (Mar 1933), *Gleichschaltung*, Concordat, Night of the Long Knives (June 1934), Führerprinzip, Gestapo/SS, Nuremberg Laws (1935), foreign policy wins (Saar, Rhineland, Anschluss, Munich) boosting legitimacy until WWII losses. *Policies:* Schacht New Plan & Göring Four-Year Plan, DAF/KdF, *Kinder, Küche, Kirche* (contradicted by WWII labor mobilization), racial persecution culminating in Kristallnacht (1938) & Holocaust.
* **USSR — Lenin & Stalin (Europe):** *Lenin:* Oct 1917 seizure, Sovnarkom, Cheka, Dissolution of Constituent Assembly, Civil War/War Communism, Kronstadt & NEP (1921), ban on factions. *Stalin Emergence:* General Secretary patronage ("Lenin Enrolment"), ideological maneuvering vs Trotsky ("Socialism in One Country" vs "Permanent Revolution"), Zinoviev/Kamenev then Bukharin. *Consolidation:* Collectivization/Dekulakization, Five-Year Plans (1928–41), Kirov murder (1934), Great Terror & Show Trials (1936–38), NKVD/Gulag, Cult of Personality. *Policies:* Rapid heavy industrialization, literacy/education expansion, *Zhenotdel* abolition & 1936 Family Code (pro-natalist conservative turn), national deportations.
* **China — Mao Zedong (Asia & Oceania):** *Emergence:* Warlordism, GMD corruption/inflation, Japanese invasion (Second United Front), peasant land reform & Yan'an Rectification (1942–44), PLA victory in Chinese Civil War (1949). *Consolidation:* Three-Anti/Five-Anti campaigns, Agrarian Reform Law (mass landlord executions), Hundred Flowers Campaign & Anti-Rightist backlash (1956–57), Cultural Revolution & Red Guards (1966–76) purging rivals (Liu Shaoqi, Deng Xiaoping). *Policies:* First Five-Year Plan, Great Leap Forward (1958–62, People's Communes, backyard furnaces -> Great Famine 30–45M deaths), 1950 Marriage Law (abolishing foot-binding/concubinage vs persistent patriarchy), ethnic minority assimilation in Tibet/Xinjiang.
* **Cuba — Fidel Castro (The Americas):** *Emergence:* Batista dictatorship corruption, US economic dominance (Platt legacy, sugar monoculture), Moncada attack (1953), Sierra Maestra guerrilla war (M-26-7) + urban *Llano* resistance, Jan 1959 triumph. *Consolidation:* Revolutionary tribunals, UMAP labor camps, CDR neighborhood surveillance, Bay of Pigs (1961) & Cuban Missile Crisis (1962) rallying nationalist legitimacy, Mariel boatlift (1980) safety valve. *Policies:* INRA agrarian reform, nationalization of US enterprises, 1961 Literacy Campaign, healthcare expansion, 1975 Family Code (FMC—Vilma Espín), economic dependency shifting from US to USSR subsidies ("Year of the 10 Million" 1970 failure).
* **Italy — Benito Mussolini (Europe) / Argentina — Juan Perón (Americas):** *Mussolini:* *Vittoria mutilata*, *biennio rosso*, March on Rome (1922), Acerbo Law (1923), Matteotti Crisis (1924), *Leggi Fascistissime* (1925–26), Lateran Accords (1929), Battle for Grain/Lira, Corporatism, imperfect totalitarianism checked by Monarchy/Church/Army. *Perón:* GOU 1943 coup, Secretary of Labor union base (*descamisados*), Oct 17, 1945 mobilization, 1946 election, IAPI & first 5-Year Plan (ISI), Eva Perón (FEP, women's suffrage 1947), *Justicialismo*, economic downturn & Catholic Church clash leading to 1955 *Revolución Libertadora* coup.

---

#### World History Topic 11: Causes and effects of 20th-century wars *(High-Yield Core)*

| Sub-Topic | Prescribed Syllabus Bullet Points |
| :--- | :--- |
| **Causes of war** | • Economic, ideological, political, territorial and other causes<br>• Short- and long-term causes |
| **Practices of war and their impact on the outcome** | • Types of war: civil wars; wars between states; guerrilla wars<br>• Technological developments; theatres of war—air, land and sea *(clarified 2020)*<br>• The extent of the mobilization of human and economic resources<br>• The influence and/or involvement of foreign powers |
| **Effects of war** | • The successes and failures of peacemaking<br>• Territorial changes<br>• Political repercussions *(clarified 2020)*<br>• Economic, social and demographic impact; changes in the role and status of women |

* **Suggested Official Examples:**
  * *Africa/ME:* Algerian War (1954–1962), Nigerian Civil War (1967–1970), Iran–Iraq War (1980–1988), North Yemen Civil War (1962–1970), First Gulf War (1990–1991).
  * *Americas:* Chaco War (1932–1935), Falklands/Malvinas War (1982), Mexican Revolution (1910–1920), Contra War (1981–1990).
  * *Asia/Oceania:* Chinese Civil War (1927–1937 and/or 1946–1949), Vietnam (1946–1954 and/or 1964–1975), Indo-Pakistan Wars (1947–1949, 1965, 1971).
  * *Europe:* Spanish Civil War (1936–1939), Balkan Wars (1990s), Russian Civil War (1917–1922), Irish War of Independence (1919–1921).
  * *Cross-regional wars (cannot be double-counted across two regions in one essay):* First World War (1914–1918), Second World War (1939–1945), Russo-Japanese War (1904–1905).

##### High-Yield Case Study Pairing Matrix (Topic 11)
* **Interstate / Total Wars:** **WWI (1914–1918, Europe/Cross-regional)** vs **WWII in the Pacific (1937/41–1945, Asia)** — contrasting trench attrition, naval blockade, home-front mobilization, collapse of 4 empires, and Paris Peace Settlement vs Pacific island-hopping, radar/carriers/atomic weapons, unconditional surrender, and decolonization catalyst.
* **Civil Wars with Foreign Intervention:** **Spanish Civil War (1936–1939, Europe)** vs **Chinese Civil War (1927–1937 / 1946–1949, Asia)** — comparing German/Italian/Soviet intervention & Non-Intervention Committee vs US Marshall Mission/aid & Soviet Manchuria handoff; Nationalist unity under Franco vs GMD corruption/hyperinflation & CCP peasant mobilization.
* **Guerrilla / Decolonization / Asymmetric Wars:** **Vietnam War (1964–1975, Asia)** vs **Algerian War (1954–1962, Africa/ME)** — comparing FLN urban terror & diplomatic internationalization vs Viet Cong/PAVN People's War, Tet Offensive political victory, domestic anti-war pressure in France (Fourth Republic collapse) and the US (Credibility Gap, War Powers Act).

---

#### World History Topic 12: The Cold War: Superpower tensions and rivalries (20th century) *(High-Yield Core)*

| Sub-Topic | Prescribed Syllabus Bullet Points |
| :--- | :--- |
| **Rivalry, mistrust and accord** | • The breakdown of the grand alliance and the emergence of superpower rivalry in Europe and Asia (1943–1949): role of ideology; fear and aggression; economic interests; a comparison of the roles of the US and the USSR<br>• The US, USSR and China—superpower relations (1947–1979): containment; peaceful co-existence; Sino-Soviet and Sino-US relations; detente<br>• Confrontation and reconciliation; reasons for the end of the Cold War (1980–1991): ideological challenges and dissent; economic problems; arms race |
| **Leaders and nations** | • The impact of two leaders, each chosen from a different region, on the course and development of the Cold War<br>• **The economic, social and cultural impact of the Cold War on two countries (to be chosen from different regions)** *(2020 Amendment: previously excluded USSR and US; exclusion removed in 2020!)* |
| **Cold War crises** | • Cold War crises case studies: detailed study of any two Cold War crises from different regions: examination and comparison of the causes, impact and significance of the two crises |

* **Suggested Official Leaders:** Truman, Stalin, Khrushchev, Nixon, Mao, Castro, Brezhnev, Reagan, Gorbachev, Nasser, Brandt.
* **Suggested Official Crises:**
  * *Africa/ME:* Suez Crisis (1956), Congo (1960–1961), outbreak of Angolan Civil War (1975).
  * *Americas:* Cuban Missile Crisis (1962), US intervention in Chile (1973), Contra War (1981–1990).
  * *Asia/Oceania:* Chinese Offshore Island Crises (1954/1958), North Korean invasion of South Korea (1950), Soviet invasion of Afghanistan (1979).
  * *Europe:* Berlin blockade (1948–1949), Berlin Wall (1958–1961), Hungary (1956), the Prague Spring (1968), the USSR and eastern Europe (1981–1989).

---

### 2.4 Paper 3 — All 4 HL Regional Options (All 72 Sections + Deep Dossiers for Modern Sections)

> **Paper 3 Syllabus Rule:** Teachers choose **1** of 4 regions and study **3** of its **18** sections. *"Only people and events named in the guide will be named in examination questions."* Below are **all 72 section titles** (1–18 per region, incorporating 2020 title/content amendments) plus complete syllabus bullets and high-yield detail for the most widely taught modern sections.

---

#### HL Option 1: History of Africa and the Middle East (Sections 1–18)

* **Section 1: The ‘Abbasid dynasty (750–1258)** — Umayyad fall, Baghdad shift, Golden Age, al-Mansur/Harun al-Rashid/al-Ma'mun, Mongol sack (1258).
* **Section 2: The Fatimids (909–1171)** — Ismaili Shiism, Cairo (969), Dar al-'Ilm, Mediterranean/Red Sea trade, al-Mu'izz/al-Hakim/al-Mustansir.
* **Section 3: The Crusades (1095–1291)** — Origins, Crusades 1–4, Crusader states, Saladin/Nur al-Din/Richard I/Baibars, military orders, impact.
* **Section 4: The Ottomans (1281–1566)** — Anatolia/Balkans, Constantinople (1453), Safavid rivalry, Mamluk defeat, Mehmet II/Selim I/Suleiman.
* **Section 5: Trade and the rise and decline of African states and empires (800–1600)** — Trans-Saharan gold/salt & Indian Ocean trade, Ghana, Mali, Kongo, Swahili city-states.
* **Section 6: Pre-colonial African states (1800–1900)** — Zulu/Shaka & Mfecane, Sotho/Moshoeshoe, Sokoto Caliphate, Niger Delta (Nana/Jaja), Ethiopia (Tewodros II–Menelik II), Mahdist Sudan, + 2 case studies.
* **Section 7: The slave trade in Africa and the Middle East (1500–1900)** — Atlantic & East African slave trades, abolitionist causes, 1807/1833/1885 Acts.
* **Section 8: European imperialism and the partition of Africa (1850–1900)** — Economic/strategic/nationalist causes, Berlin West Africa Conference, Leopold II & De Brazza.
* **Section 9: Response to European imperialism (1870–1920)** — Resistance vs collaboration: Ethiopia (Menelik II), Mandinka, Herero/Nama, Zulu, Asante, Lewanika/Khama, Buganda.
* **Section 10: Africa under colonialism (1890–1980)** — British/French/German/Portuguese rule in Kenya, Tanganyika, Nyasaland/Rhodesias, Angola/Mozambique, Nigeria, Gold Coast, Senegal.

##### Detailed Modern Sections — Africa & the Middle East (Sections 11–18)

* **Section 11: 20th-century nationalist and independence movements in Africa**
  * *Official Bullets:* Angola (liberation war, MPLA & UNITA to 1975); South-West Africa (SWAPO to Namibian independence 1990); Kenya (trade unions, Mau Mau, Kenyatta & KANU to 1963); Gold Coast to Ghana (Nkrumah & CPP to 1957); French West Africa (Senegal to 1960); Tanganyika (TANU, Julius Nyerere to 1961).
  * *High-Yield Focus:* Peaceful constitutional negotiation (Ghana, Senegal, Tanganyika) vs protracted guerrilla liberation war (Kenya Mau Mau / Angola against Salazar's Estado Novo / Namibia against South Africa); comparative role of WWII returning veterans, Pan-Africanism, and Cold War superpower proxies.
* **Section 12: The Ottoman Empire (c1800–1923)**
  * *Official Bullets:* Early 19th-c challenges (Greek War of Independence, Muhammad Ali in Egypt); The Eastern Question (Crimean War, 19th-c Balkan crises); Decline in ME & North Africa (Egypt, Libya, Algeria, Lebanon); Internal reform & modernization (Tanzimat 1839–1876; Abdul Hamid II—reaction and reform); CUP to 1908–1909, Young Turks reforms, Balkan Wars (1912–1913); WWI entry, impact, rise of Mustafa Kemal Atatürk & empire collapse.
* **Section 13: War and change in the Middle East and North Africa 1914–1945**
  * *Official Bullets:* Allied diplomacy (McMahon–Hussein correspondence, Sykes–Picot 1916, Arab Revolt, Balfour Declaration 1917); Paris peace treaties & mandate system (British/French rule in Iraq, Transjordan, Syria, Lebanon); Post-WWI Egypt (nationalism, Wafd Party, 1922 Declaration, British influence); Palestine mandate (Jewish immigration/settlement, Arab Revolt 1936–39, Peel Commission, 1939 White Paper); Atatürk and the Turkish Republic (Six Arrows, secularization, successes/failures); Case study of Iran (Reza Shah), Saudi Arabia (Ibn Saud), or North African state.
* **Section 14: Africa, international organizations and the international community (20th century)**
  * *Official Bullets:* League of Nations (Abyssinian Crisis 1934–1936); Organization of African Unity (OAU) objectives, structure, successes/failures *(2020 Amendment removed "African Union (AU)" as post-2000)*; Regional organizations (EAC 1967–77, ECOWAS, SADCC/SADC); Africa and the UN (Congo ONUC, Mozambique ONUMOZ, Somalia UNOSOM, Rwanda UNAMIR); Case study of 2 UN specialized agencies; Cold War impact on 2 African countries.
* **Section 15: Developments in South Africa 1880–1994**
  * *Official Bullets:* Discovery of diamonds (1867) & gold (1886); South African War (1899–1902), Treaty of Vereeniging, Act of Union (1909); Policies of Smuts and Hertzog (1910–1948) (1913 Natives Land Act, segregation); 1948 National Party victory, Malan & Verwoerd Grand Apartheid / Bantustans; Resistance (ANC, Sharpeville 1960 & armed struggle, Steve Biko & Black Consciousness, Soweto 1976, 1980s township unrest); International opposition & economic boycott; End of apartheid (de Klerk unbanning ANC, Mandela release, CODESA, 1994 elections).
* **Section 16: Social and cultural developments in Africa in the 19th and 20th centuries**
  * *Official Bullets:* Spread of Islam & Christianity; African Independent Churches movement; *(last 5/6 bullets via 2-country case study)* Changing social & cultural values; Changing role of women; Social & cultural impact of technology; Impact of immigration/emigration; *(2020 Amendment removed "Developments in the arts")*; Developments in education.
* **Section 17: Post-war developments in the Middle East (1945–2000)**
  * *Official Bullets:* Origins of Israel (post-war mandate tensions, 1948–1949 War); Arab–Israeli conflicts (Suez 1956, Six Day War 1967, 1973 Yom Kippur War, occupied territories, First/Second Intifadas, PLO, peacemaking up to Camp David 2000 including 1978 Camp David & 1993 Oslo Accords); Post-war Egypt (Nasser, Sadat, Mubarak; Pan-Arabism & UAR 1958–61); Post-war Iran (Mohammad Reza Shah, White Revolution, 1979 Islamic Revolution under Khomeini, Iran–Iraq War 1980–88); Lebanon (civil wars 1975–90, Confessional system, PLO/Syrian/Israeli intervention, reconstruction).
* **Section 18: Post-independence politics in Africa to 2005**
  * *Official Bullets (all 6 via 2 African countries):* Causes of ethnic conflict, civil war & military intervention; Impact of ethnic conflict, civil war & military rule; Social & economic challenges (disease, illiteracy, poverty, famine, neo-colonialism); Establishment of single-party states; Return to multi-party democracy in 1980s–1990s; Economic growth & development to 2005.

---

#### HL Option 2: History of the Americas (Sections 1–18)

* **Section 1: Indigenous societies and cultures in the Americas (c750–1500)** — Political organization, warfare, tribute/economic structures, religion, language/science/arts (2 case studies).
* **Section 2: European explorations and conquests in the Americas (c1492–c1600)** — North/Latin America exploration, Cortés/Pizarro, Columbian Exchange, Laws of Burgos (1512) & New Laws (1542), *Bartolomé de las Casas* *(added 2020)*, Treaty of Tordesillas (1494).
* **Section 3: Colonial government in the New World (1500–1800)** — Viceroyalties/captaincies/British-French charters, *encomienda*/*mita*, Bourbon & Pombaline reforms, Anglo-French rivalry to 1763.
* **Section 4: Religion in the New World (1500–1800)** — Catholic church social/political/cultural impact *(clarified 2020)*, Jesuits/Franciscans/Dominicans, syncretism, British colonial tolerance/intolerance, Great Awakening, New France.
* **Section 5: Slavery and the New World (1500–1800)** — Origins, *asiento* system, Middle Passage, plantation life (West Indies, Brazil, British America), resistance & specific rebellions *(clarified 2020)*, Quakers/abolitionists.
* **Section 6: Independence movements (1763–1830)** — Causes/Enlightenment, Washington/Bolívar/San Martín, US Declaration/campaigns, 2 Latin American countries, Monroe Doctrine, impact on 2 economies/societies *(clarified 2020)*.
* **Section 7: Nation-building and challenges (c1780–c1870)** — US Articles & 1787 Constitution, Latin American *caudillo* rule, War of 1812, Mexican–American War (1846–48), Canada 1837 rebellions / Durham Report / BNA Act (1867).
* **Section 8: United States’ Civil War: Causes, course and effects (1840–1877)** — Cotton/slavery/abolitionists, Nullification/Compromise 1850/1850s crises/1860 election, Union vs Confederate strengths/Lincoln/battles, Emancipation Proclamation, Reconstruction. *(Bullet 7 on Jim Crow moved to Sec 9 in 2020 Amendment.)*
* **Section 9: The development of modern nations (1865–1929)** — Railroads/industrialization, migration, progressivism/Manifest Destiny/positivism/social Darwinism/indigenismo/nativism, T. Roosevelt/Laurier/1 Latin American leader, African Americans (Plessy, Great Migration, Harlem Renaissance, Washington/Du Bois/Garvey + Jim Crow/black codes incorporated from Sec 8 in 2020).
* **Section 10: Emergence of the Americas in global affairs (1880–1929)** — US expansionism, Spanish–American War (1898), Big Stick/Dollar/Moral diplomacy, US & WWI (Wilson, Versailles fight), Canada or 1 Latin American country in WWI *(clarified 2020)*, WWI impact on 2 countries.
* **Section 11: The Mexican Revolution (1884–1940)** — Porfirio Díaz, causes, Madero/Villa/Zapata/Carranza & 1917 Constitution, Obregón/Calles/Maximato, Lázaro Cárdenas (1934–40), foreign powers (US), social/cultural impact.

##### Detailed Modern Sections — The Americas (Sections 12–18)

* **Section 12: The Great Depression and the Americas (mid 1920s–1939)**
  * *Official Bullets:* Political & economic causes in the Americas; US solutions (Hoover; FDR & the New Deal—First & Second New Deals); Critics of the New Deal (Huey Long, Father Coughlin, Supreme Court, Liberty League) & systemic impact; Canadian solutions (Mackenzie King & R.B. Bennett's "New Deal"); Impact on Latin America (political instability, coups, economic collapse); Latin American responses (Import Substitution Industrialization / ISI, Vargas in Brazil / Cárdenas in Mexico, popular mobilization & repression); *(1-country case study for final 3 bullets)* Impact on women, minorities, arts & culture.
* **Section 13: The Second World War and the Americas (1933–1945)**
  * *Official Bullets:* Hemispheric diplomacy, neutrality & FDR's Good Neighbour policy; Involvement/participation of any 2 countries (e.g., US, Canada, Brazil, Mexico); Social impact (women "Rosie the Riveter", minorities, Bracero Program, Canadian conscription crisis); Treatment of Japanese Americans (Exec Order 9066), Japanese Latin Americans, and Japanese Canadians; Reasons for & significance of US atomic weapons against Japan (Hiroshima/Nagasaki historiography: orthodox vs Alperovitz atomic diplomacy); Economic & diplomatic effects on 2 countries.
* **Section 14: Political developments in Latin America (1945–1980)**
  * *Official Bullets:* Cuban Revolution causes; Rule of Fidel Castro (nationalism, domestic policies, opposition, regional impact); Populist leaders in 2 countries—rise, ideology, policies, **successes and failures** *(2020 Amendment)* (e.g., Perón in Argentina, Vargas in Brazil, Velasco Ibarra); Democracy in crisis: **political, social and economic** reasons for failure of elected leaders *(2020 Amendment)* (e.g., Allende in Chile 1973, Goulart in Brazil 1964); Rise of military dictatorship in 1 country (e.g., Pinochet, Videla/Process); Guerrilla movements in 1 country (e.g., FARC, Tupamaros, Shining Path); Liberation theology (origins, Medellín 1968, impact).
* **Section 15: Political developments in the United States (1945–1980) and Canada (1945–1982)**
  * *Official Bullets:* Truman & Fair Deal, Eisenhower domestic policies *(2020 removed requirement on Democratic division/congressional opposition)*; Kennedy (New Frontier) & Johnson (Great Society, Medicare/Medicaid, War on Poverty); Nixon domestic policies, Watergate & impeachment crisis, Ford (pardon), Carter domestic policies, **internal conflicts and changes in main US political parties 1945–1980** *(2020 removed "changing composition")*; Canadian PMs (St Laurent, Diefenbaker, Pearson, Pierre Trudeau—Official Languages Act, Charter/1982 Constitution Act); Quiet Revolution, Quebec nationalism, FLQ & October Crisis (1970).
* **Section 16: The Cold War and the Americas (1945–1981)**
  * *Official Bullets:* Truman containment, rise of McCarthyism, **social and cultural impact of the Cold War** *(2020 clarified scope across the Americas)*; Korean War (US & Americas participation, MacArthur vs Truman, outcomes); Eisenhower & Dulles New Look, **short-term and long-term regional impact** *(2020 clarified)* (Guatemala 1954, Massive Retaliation); US in Vietnam (stages, domestic effects, Canadian non-support, Latin American protest); Kennedy to Carter foreign policies & **successes/failures (1961–1981)** *(2020 Amendment)* (Alliance for Progress, Nixon covert ops in Chile, Carter human rights & Panama Canal Treaty 1977); Cold War policy implications in **either Canada or any 1 non-US country in the Americas** *(2020 clarified)*.
* **Section 17: Civil rights and social movements in the Americas post-1945**
  * *Official Bullets:* Indigenous peoples & civil rights (AIM, Wounded Knee, Canada White Paper 1969 / Calder case); African Americans (origins, legal challenges, *Brown*, SCLC/SNCC/CORE, 1955–1980); Role of MLK Jr vs radical activism 1965–1968 (Black Panthers, Black Power, Malcolm X) & government roles; Feminist movements (Betty Friedan, NOW, ERA battle, *Roe v. Wade*, Royal Commission in Canada); Hispanic American movement (Cesar Chavez, UFW, Chicano movement, immigration reform); Youth culture & 1960s–70s counter-culture (SDS, anti-war, Woodstock/Berkeley).
* **Section 18: The Americas (1980–2005)**
  * *Official Bullets:* US domestic policies of Reagan, GHW Bush & Clinton *(2020 split bullet & removed "challenges" wording)* + US foreign policy continuities/changes (from bipolar to unilateral power: Grenada, Panama, Gulf War, NAFTA, Kosovo); Canadian domestic policies (Mulroney, PC Party collapse 1993, Chrétien, 1995 Quebec referendum); Transition to democracy in 2 Latin American countries; Post-transition challenges in 2 Latin American countries (debt crisis, truth & reconciliation); Violent & non-violent movements in 2 countries; Economic/political cooperation (NAFTA, Mercosur, OAS); Terrorism in the Americas 1980–2005 *(2020 broadened)* & 9/11 domestic impact.

---

#### HL Option 3: History of Asia and Oceania (Sections 1–18)

* **Section 1: Trade and exchange: The Silk Road in the medieval world (750–1500)** — Tang Silk Road, Ibn Battuta & Marco Polo, Mongol trade surge & Samarkand/Tamerlane, cultural/religious exchange, 15th-c decline.
* **Section 2: Japan in the Age of the Samurai (1180–1333)** — Gempei War *(causes/consequences added 2020)*, Kamakura Shogunate, Minamoto, clan struggles, *Bushido*/Zen/women, Mongol invasions (1274, 1281).
* **Section 3: Exploration, trade and interaction in East Asia and South-East Asia (1405–1700)** — Zheng He voyages, Japan-Portugal (1543), Da Gama/Malacca/Magellan, European settlements, Ming isolationism (1525), Japanese *sakoku* & four gateways.
* **Section 4: The rise and fall of the Mughal Empire (1526–1712)** — Babur & Humayun, Akbar/Shah Jahan/Aurangzeb, religious policy, opposition (Marathas/Sikhs), decline.
* **Section 5: Colonialism and the development of nationalism in South-East Asia (c1750–1914)** — Dutch Indonesia (Culture System, Ethical Policy 1901), French Indo-China (1887), Spanish Philippines & Philippine Revolution *(causes/results added 2020)* (Rizal/Bonifacio/Aguinaldo), US colonial rule, Siamese independence (Rama IV & V).
* **Section 6: India, Afghanistan and Burma (1750–1919)** — EIC expansion (Plassey 1757, Mysore/Maratha wars), Dalhousie/Bentinck, 1857 Great Revolt, Govt of India Act 1858 / Bengal Partition 1905 / Morley-Minto 1909, INC (1885) & Muslim League (1906), "Great Game" & Anglo-Afghan Wars, Mindon/Thibaw & Anglo-Burmese Wars.
* **Section 7: Challenges to traditional East Asian societies (1700–1868)** — Qing/Qianlong, White Lotus, tribute system, First & Second Opium Wars & unequal treaties, Taiping Heavenly Kingdom *(rise & fall clarified 2020)*, Tokugawa society/economy & discontent *(clarified 2020)*, Perry & Bakumatsu crisis (1853–1868).
* **Section 8: British colonialism and emerging national identities in Oceania (1788–1919)** — Treaty of Waitangi (1840), settler/indigenous conflict, gold rushes & labour movement, Australian (1901) & NZ (1907) federation/dominion status, WWI & ANZAC/Gallipoli, Pacific Islands.
* **Section 9: Early modernization and imperial decline in East Asia (1860–1912)** — Tongzhi Restoration & Self-Strengthening (Cixi & **Prince Gong** *added 2020*), Sino-Japanese War (1894–95), Guangxu Hundred Days' Reform (1898), Boxer Rebellion (1900–01), Sun Yixian & 1911 Xinhai Revolution, Meiji Restoration (1868) & 1889 Constitution, **rise of Japanese military power** *(regional impact added 2020)*, Korea (Queen Min, 1876 opening, Tonghak 1894, annexation 1910).

##### Detailed Modern Sections — Asia & Oceania (Sections 10–16; plus 17–18 titles)

* **Section 10: Nationalism and independence in India (1919–1964)**
  * *Official Bullets:* *(2020 removed separate WWI Home Rule bullet and folded "aftermath of WWI" into bullet 1)* Significance of key political developments including **aftermath of WWI**, Amritsar massacre (1919), Government of India Act 1919, Simon Commission (1928), Round Table Conferences (1930–32), Government of India Act 1935; Role/importance of INC, Muslim League, Gandhi, Nehru, Jinnah; Non-cooperation (1920–22), civil disobedience, Salt March (1930), Quit India (1942); Muslim separatism, Two-Nation theory, Lahore Resolution (1940); WWII impact (Subhas Chandra Bose/INA, Cripps Mission 1942, Mountbatten, 1947 Partition); Post-independence India (princely states, Kashmir, Nehru's domestic successes/failures).
* **Section 11: Japan (1912–1990)**
  * *Official Bullets:* Impact of WWI & **Paris Peace Conference (1919) and Washington Naval Conference (1921–1922)** *(2020 clarified)*; Taisho democracy (liberal values, two-party system, Universal Male Suffrage 1925 vs Peace Preservation Law); Rise of militarism & extreme nationalism (army in politics, Manchurian/May 15/Feb 26 coups & assassinations); Invasions of Manchuria (1931) & China (1937), Tripartite Pact (1940), US embargo (1940–41); Pacific War (1941–1945) (Pearl Harbor, initial expansion, reasons for defeat); US occupation (1945–1952) (SCAP/MacArthur democratization, Article 9, 1950 Reverse Course); Economic miracle & globalization impact.
* **Section 12: China and Korea (1910–1950)**
  * *Official Bullets:* Rise of Chinese national identity (Yuan Shikai, Sun Yixian, 21 Demands 1915, New Culture Movement, Versailles 1919, May Fourth Movement, warlordism); Nationalist rule (GMD ideology, Jiang Jieshi, Nanjing Decade 1927–1937 successes/failures); **Political, economic and social reasons for the rise of communism in China** *(2020 reworded)* (CCP ideology, First United Front, Shanghai Massacre 1927, Jiangxi Soviet, Long March 1934–35, Yan'an, Mao); Japanese invasion (Manchuria 1931, Second United Front, Sino-Japanese War 1937–45, Chinese Civil War 1946–49 & reasons for CCP victory); Impact of Japanese rule on Korea (1910 annexation, Sino-Japanese War forced labour, conscription, comfort women, 38th parallel division 1945 — *(2020 removed Syngman Rhee & Kim Il-Sung from Sec 12)*); Taiwan & ROC (**establishment of Jiang Jieshi's rule** *(2020 clarified)*, martial law 1949, White Terror 1950, Taiwanese independence origins).
* **Section 13: Impact of the Second World War on South-East Asia** *(2020 Amendment: retitled from "world wars", WWI bullet deleted!)*
  * *Official Bullets:* Reasons for & effects of initial Japanese victories (1940–1942) (Singapore fall, Philippines, Dutch East Indies, Burma); Nature & impact of Japanese occupation (*Greater East Asia Co-Prosperity Sphere*, forced labor, economic extraction); Growth of nationalism & independence movements during WWII in Indonesia (PETA), Vietnam (Viet Minh), Malaya (MPAJA): resistance vs collaboration; Leaders (Sukarno, Ho Chi Minh, Tunku Abdul Rahman); Reasons for Indonesian independence (1949); 1-country case study on WWII political, social, and economic effects.
* **Section 14: The People’s Republic of China (1949–2005)**
  * *Official Bullets:* Consolidation under Mao (1949–1961) (land reform, Thought Reform, Three/Five-Anti, Hundred Flowers 1956, Anti-Rightist); Transition to socialism & economic developments (1949–1961) (FFYP, Great Leap Forward, Second FYP); Social developments (women's rights, health, education); Great Proletarian Cultural Revolution (causes, Red Guards, Gang of Four, political/social/cultural impact); Foreign policy 1949–1976 (Sino-Soviet alliance & split, Korean/Vietnam involvement, Nixon 1972 rapprochement, UN seat); Post-Mao power struggle (Hua Guofeng, Gang of Four defeat, Deng Xiaoping's return); China under Deng (1976–1997) & Jiang Zemin (Four Modernizations, SEZs, Tiananmen Square 1989 causes/effects).
* **Section 15: Cold War conflicts in Asia**
  * *Official Bullets:* Malaya Emergency (1948–1960) (MCP, Briggs Plan, Templer, legacy); Korea: Korean War (1950–1953) (causes, **nature of the conflict** *(added 2020)*, international responses, outcome & 10-year impact); Vietnam (Viet Minh, Ho Chi Minh, French Indo-China War 1946–54, Vietnam War 1956–75—causes, nature, foreign involvement, outcome & 10-year impact); Cambodia (Sihanouk failures, Khmer Rouge & Pol Pot, Vietnam War spillover, regime impact, 1978 Vietnamese invasion, international response, 1993 UNTAC elections); Afghanistan (1979 Soviet invasion, mujahideen/foreign backing, 1989 Soviet withdrawal, 1989–1992 civil war).
* **Section 16: Developments and challenges in South Asia after 1947**
  * *Official Bullets:* India under Nehru (foreign policy/NAM, economic plans, Indo-Pakistani Wars 1947/1965/1971, independence of Bangladesh 1971); India under Indira Gandhi, Rajiv Gandhi & P.V. Narasimha Rao (Emergency, Green Revolution, Operation Blue Star, 1991 liberalization); Pakistan 1947–1991 (East–West friction, 1991 referendum, Jinnah, Ayub Khan, Z.A. Bhutto, Zia-ul-Haq, Benazir Bhutto); Bangladesh nation-building (Mujib, military coups, poverty/climate); Ceylon/Sri Lanka (Sinhalese–Tamil conflict, 1971 JVP uprising, civil war/LTTE, Sirimavo Bandaranaike).
* **Section 17: Developments in Oceania after the Second World War (1945–2005)** — Australian & NZ post-war politics (Curtin to Hawke/Keating; Fraser to Bolger), indigenous policies, multiculturalism, ANZUS/Asia pivot, Pacific Island independence.
* **Section 18: Social, cultural and economic developments in Asia (excluding China, Japan and India) (1980–2005)** — 2-country case study: globalization/tiger economies, migration, gender/environment/education, religion, cultural change, terrorism.

---

#### HL Option 4: History of Europe (Sections 1–18)

* **Section 1: Monarchies in England and France (1066–1223)** — Norman invasion social impact *(clarified 2020)*, William I & Henry I, Henry II/Angevin Empire *(in Europe — amended 2020)*, John/Richard I/Philip II, Capetian expansion (Louis VI–Philip II), comparison.
* **Section 2: Muslims and Jews in medieval Europe (1095–1492)** — Crusades/hostility to Muslims, Christian opposition & conflict in Spain, Jewish finance/scholarship, causes & consequences of persecution/expulsions *(bullets 6–7 combined 2020)*.
* **Section 3: Late medieval political crises (1300–1487)** — Edward II & Richard II, Hundred Years' War phases (1337–89, 1415–53), ducal Burgundy (**Philip the Bold, Philip the Good, Charles the Bold** *named 2020*), Wars of the Roses & War of the Public Weal, Henry VI/Edward IV/Louis XI.
* **Section 4: The Renaissance (c1400–1600)** — Origins in Florence, Milan/Florence/Venice governments, patronage (Lorenzo de' Medici, Ludovico Sforza, papal), art/literature/architecture/political writings *(clarified 2020)*, Northern Renaissance + 1 case study.
* **Section 5: The Age of Exploration and its impact (1400–1550)** — Motives, enablers (Henry the Navigator, caravels/cartography), Portuguese West Africa, New World & Indian Ocean *(consequences for European states clarified 2020)*, Treaty of Tordesillas (1494), Columbian Exchange impact on Europe to 1550.
* **Section 6: Aspects of the Reformation (c1500–1563)** *(2020 Amendment: retitled and refocused on Protestantism in Germany and Catholic/papal reactions up to the Council of Trent's close in 1563 — Catholic Church condition c1500, Luther/Calvin/Zwingli, spread in Germany, Schmalkaldic War & Peace of Augsburg 1555, Catholic Reformation/Jesuits/Council of Trent 1545–1563).*
* **Section 7: Absolutism and Enlightenment (1650–1800)** — Enlightenment & Scientific Revolution, 2-state impact case study, 2 absolutist monarchs, 2 enlightened despots, social/economic change, Baroque patronage *(2020 clarified Louis XIV, Joseph II, and Mozart's music are NOT prescribed exam targets)*.
* **Section 8: The French Revolution and Napoleon I (1774–1815)** — Crisis of Ancien Régime (Louis XVI), 1791 Constitution, Terror & Robespierre, Thermidor, Directory (1795–99), Napoleon's domestic/foreign rule (1799–1815), Napoleonic Wars & Hundred Days.
* **Section 9: France (1815–1914)** — Bourbon Restoration & Vienna, Louis XVIII & Charles X, 1830 Revolution & July Monarchy, 1848 Revolution / Second Republic / **establishment of the Second Empire** *(clarified 2020)*, Napoleon III, Third Republic (1871–1914: Boulangisme, Dreyfus Affair).
* **Section 10: Society, politics and economy in Britain and Ireland (1815–1914)** — Peterloo, Chartism, Corn Laws, Irish Famine, Reform Acts (1832, 1867, 1884–85), Victorian social reform, Disraeli/Gladstone/Salisbury & Irish Question, Labour Party & Lloyd George People's Budget/Parliament Act, **1901–1914** unrest (women's suffrage, **Irish Home Rule crisis** *clarified 2020*, trade unions).

##### Detailed Modern Sections — Europe (Sections 11–18)

* **Section 11: Italy (1815–1871) and Germany (1815–1890)**
  * *Official Bullets:* Italy (1815–1849): Congress of Vienna, Metternich/Austria, Carbonari/1820–44 uprisings, Mazzini & Gioberti, papacy, 1848–49 Revolutions; Germany (1815–1849): Congress of Vienna, *Vormärz* nationalism/liberalism, economic/social change, 1848–49 Frankfurt Parliament defeat; Unification of Italy (1849–1871): Cavour, Garibaldi, Napoleon III/Prussia foreign role; Rise of Prussia & decline of Austria (1815–1866), *Zollverein*; Bismarck, Prussia & unification (1864 Danish, 1866 Austro-Prussian, 1870–71 Franco-Prussian Wars, 1871 Constitution); Germany (1871–1890): *Kulturkampf*, Anti-Socialist Laws, state consolidation.
* **Section 12: Imperial Russia, revolution and the establishment of the Soviet Union (1855–1924)**
  * *Official Bullets:* Alexander II (1855–1881): Emancipation of Serfs (1861), Zemstva, judicial/military reforms vs autocracy limits; Alexander III (1881–1894) & Nicholas II (1894–1917): Witte industrialization, Stolypin/repression, Populists/SRs/SDs/Kadets; 1905 Revolution (Bloody Sunday, Russo-Japanese War, October Manifesto, Dumas, Stolypin); WWI impact & February/March 1917 autocracy collapse; 1917 Revolutions (Provisional Government & Petrograd Soviet Dual Power, April Theses, Kornilov Affair, October/November Bolshevik Revolution, Lenin & Trotsky); Lenin's Russia/USSR (Constituent Assembly dissolution, Brest-Litovsk, Russian Civil War 1918–21, War Communism, Kronstadt, NEP 1921, Cheka/Red Terror, Comintern/foreign relations).
* **Section 13: Europe and the First World War (1871–1918)**
  * *Official Bullets:* European diplomacy & balance of power post-1871 (Congress of Berlin 1878, Bismarck's Alliance system vs Triple Entente); Colonial expansion in Africa/Asia & diplomatic impact (Moroccan Crises 1905/1911); Foreign policy of Kaiser Wilhelm II (*Weltpolitik*, *Flottenpolitik*, Tirpitz, domestic *Sammlungspolitik* pressures); Causes of WWI (short/long-term, relative importance: alliance system, Ottoman decline, German policy, Austria-Hungary/Russia/Balkan nationalism, arms race, July Crisis 1914); Impact of WWI on civilian populations of **2 European countries** (1914–1918) *(simplified 2020)* (rationing, *Turnip Winter*, women's labor, propaganda/DORA); Factors in Central Powers defeat & Entente victory (Somme/Verdun attrition, naval blockade, Brusilov/Ludendorff Offensives, 1917 US entry, 1918 German Revolution & Austria-Hungary collapse).
* **Section 14: Inter-war domestic developments in European states (1918–1939)** *(2020 Amendment: retitled from "European states in the inter-war years")*
  * *Mandatory Countries:* Germany, Italy, Spain, plus **any 1 other European country** (commonly France, Britain, or USSR/Poland).
  * *Official Bullets:* Weimar Germany (1918–1933) (constitution, Kapp/Munich Putsches, 1923 Ruhr/hyperinflation, Stresemann Golden Era 1924–29, Great Depression & Brüning–Papen–Schleicher crisis); Hitler's Germany (1933–1939) (consolidation, economic/social/political policies, polycratic vs totalitarian nature of Nazi state, extent of resistance—Edelweiss Pirates, Church, SPD/KPD); Italy (1918–1939) (Mussolini rise, March on Rome, Matteotti, *Leggi Fascistissime*, Corporatism, Lateran Accords, nature of fascist state); Spain (1918–1939) (Primo de Rivera 1923–30, Second Republic polarization, Azaña & Gil Robles, Spanish Civil War causes, foreign intervention, Nationalist victory under Franco); Case study of 1 other European country (e.g., Third Republic France—Poincaré, Stavisky Affair, Léon Blum's Popular Front 1936, Matignon Accords).
* **Section 15: Diplomacy in Europe (1919–1945)** *(2020 Amendment: retitled from "Versailles to Berlin: Diplomacy in Europe")*
  * *Official Bullets:* **Paris peace treaties (1919–1923)** *(clarified 2020)*: Versailles, Neuilly, Trianon, St Germain, Sèvres/Lausanne—aims, issues, responses; League of Nations & Europe (successes/failures, collective security, Rapallo/Locarno/Kellogg-Briand, Central/Eastern European successor states); Italian & German foreign policies (1919–1941) (Stresemann revisionism vs Hitler/Mussolini expansion); Collective security & appeasement (1919–1941): British, French, Soviet foreign policies, Chamberlain & Munich Crisis (1938), Nazi–Soviet Pact (1939); Causes of WWII & European conflict (1939–1941), wartime Grand Alliance (1941–1945), reasons for Axis defeat & Allied victory; Impact of WWII on civilian populations in **any 2 countries** (1939–1945).
* **Section 16: The Soviet Union and post-Soviet Russia (1924–2000)**
  * *Official Bullets:* Soviet Union (1924–1941): Stalin's power struggle & defeat of Trotsky (1924–29), collectivization & Five-Year Plans, propaganda, Purges & Great Terror; Great Patriotic War (1941–1945) & **events in the Soviet Union (1945–1953)** *(2020 Amendment: allows focus on High Stalinism—Fourth FYP, Zhdanovshchina, Leningrad Affair, Doctors' Plot, Cold War origins)*; Khrushchev & Brezhnev (De-Stalinization, Secret Speech 1956, Virgin Lands, Kosygin reforms, Brezhnev Stagnation, *detente* & Afghanistan); Transformation of the USSR (1985–1991): Gorbachev (*glasnost*, *perestroika*, *demokratizatsiya*, Sinatra Doctrine, 1991 coup); Collapse of USSR & post-Soviet Russia to 2000 (Yeltsin shock therapy, 1993 constitutional crisis, Chechnya, oligarchs, rise of Putin 1999–2000).
* **Section 17: Post-war western and northern Europe (1945–2000)**
  * *Official Bullets:* Breakdown of wartime alliance, Cold War emergence & division of Germany (1945–1949); Post-war reconstruction in France & West Germany (1945–1963) (Marshall Plan, Adenauer & *Wirtschaftswunder*, de Gaulle & *Les Trente Glorieuses*, **European integration moves—ECSC/Treaty of Rome** *clarified 2020*); West Germany (1963–1990) (Erhard, Brandt *Ostpolitik*, Baader-Meinhof/RAF, Kohl & 1990 reunification, social/cultural change); Spain (Franco late regime, Juan Carlos democratic transition to 1982, Suárez/Tejero coup 1981, González/Aznar 1982–2000); 1-country case study (e.g., UK, Italy, Sweden) 1945–2000.
* **Section 18: Post-war central and eastern Europe (1945–2000)**
  * *Official Bullets:* Soviet domination (1945–1955) (salami tactics, COMECON, Warsaw Pact, Tito's Yugoslavia defiance); Support, repression & protest (1945–1968): East Germany (1953), Poland (1956), Hungary (1956), Czechoslovakia (Prague Spring 1968); Acceptance & opposition (1968–1989): **all 5 named areas mandatory** *(clarified 2020)* — East Germany, Poland (Solidarity, Wałęsa), Hungary, Czechoslovakia (Charter 77, Havel), Romania (Ceaușescu) & Bulgaria; Collapse of Soviet control (1989 revolutions—causes, events, consequences); Balkan conflicts in 1990s (Yugoslavia breakup, Bosnia, Kosovo, Milosevic); Case study of post-communist challenges (1989–2000) in 1 central/eastern European country (**former Soviet republics other than Russia eligible** *clarified 2020*).

---

### 2.5 Redesigned Syllabus Specification (First Teaching Aug 2026 / First Assessment May 2028)

For **Simple Revision** users graduating in **May/November 2028 or later**, IB completely rebuilt DP History around **4 inquiry contexts**, **4 historical skills** (using sources, making connections, evaluating arguments, asking questions), and **4 specified historical concepts**:

#### A. Four Specified Historical Concepts (2028 Guide)
1. **Cause and consequence** (paired: interplay of historical actors and conditions; short/long-term; contingency/non-inevitability)
2. **Continuity and change** (paired: interwoven, rapid vs slow trends, experienced differently)
3. **Perspectives** (contemporary & retrospective; evaluated via evidence, not equally valid)
4. **Significance** (constructed value judgments; power/impact vs revealing marginalized histories)

#### B. Paper 1 — Focused Studies (50h SL/HL, 1h 15m, 24 marks, 20% HL / 30% SL)
Students study **1** Focused Study (covering **both** paired historical examples across **3 inquiry questions** and **3 grounding content bullets per example**):

| Focused Study | Example 1 | Example 2 | 3 Framing Inquiry Questions |
| :--- | :--- | :--- | :--- |
| **1. Climate and innovation** | Norse exploration (c982–1020) | The Aztec Empire (c1428–1469) | 1. What factors prompted innovation? 2. How did climate conditions shape innovation? 3. What innovations took place? |
| **2. Independence and identity** | The Haitian Revolution (c1780–1825) | Kenyan independence (1945–1978) | 1. What prompted the emergence of the independence movement? 2. How was independence achieved? 3. How, and with what challenges, was a new identity formed? |
| **3. Political and economic transitions** | The Meiji Restoration (1853–1894) | The Russian Federation (1985–1999) | 1. What caused the transition to take place? 2. How was the transition achieved? 3. What challenges did society face after the transition? |
| **4. Conflict and displacement** | Post-war displacement in Europe (1945–1960) | Indochina refugee crisis (1975–1990) | 1. What were the conditions that led to mass displacement? 2. What was the national and international response to displacement? 3. How was displacement experienced by different groups? |
| **5. Protest and change** | Feminism in the USA (1960–1979) | Revolution in Tunisia (1989–2015) | 1. What led to the emergence of protest movements? 2. How did the protest movement challenge authority? 3. What changes did the protest movement achieve, and with what limitations? |

* **2028 Paper 1 Format (3 Static Questions, 3 Sources A/B/C):**
  * **Q1 (6m):** *Explain how the content of both source A and source B can be used to answer the inquiry question.* (Max 3m if only 1 source referenced.)
  * **Q2 (6m):** *Analyse how the context of source C influences how it can be used to answer the inquiry question.* (**Replaces OPCVL!**)
  * **Q3 (12m):** *Examine how the perspectives in all the sources can be used to answer the inquiry question.* (Max 6m if 1 source, max 9m if 2 sources.)

#### C. Paper 2 — Thematic Studies (80h SL/HL, 1h 45m, 25 marks, 25% HL / 40% SL)
Students study **1** Thematic Study across **4 inquiry questions × 4 lines of inquiry** (no fixed examples; minimum **2 examples from different regions** per line of inquiry; "contemporary" = past ~2 decades e.g., post-2008 for 2028 exams):

1. **Thematic study 1: Conflict (from 750 CE onwards)** — *Why did conflict emerge?* (Economic, Political, Social, Environmental factors) | *What determined the outcome?* (Leadership, Strategies & tactics, Mobilization of resources, Technology) | *How did conflict affect people's lives?* (Economic, Social, Women, Marginalized groups) | *How was peace established?* (Military outcome, Political decision-making, Social factors, Post-conflict peace-building).
2. **Thematic study 2: Innovation and transformation (from 750 CE onwards)** — *Why did new innovations emerge?* (Social, Economic, Political, Environmental) | *How did innovations transform societies?* (Economic, Political, Environmental, Cultural change) | *How were innovations resisted?* (Established authorities, Popular resistance, Resilience of traditional ideas, Competing innovations) | *How did innovations affect peoples' lives?* (Innovators, Social elites, Women, Marginalized groups).
3. **Thematic study 3: Authoritarian rule (from 1750 CE onwards)** — *Why did authoritarian rule emerge?* (Ideas, Social, Conflict, Economic) | *How was authoritarian rule maintained?* (Legal methods, Force, Propaganda, Popular support) | *How did authoritarian rule affect people's lives?* (Economic, Social, Women, Marginalized groups) | *How was authoritarian rule challenged?* (Internal opposition, Popular resistance, Impact of policies, External threats).
4. **Thematic study 4: Popular movements (from 1750 CE onwards)** — *Why did popular movements emerge?* (Political, Economic, Ideas, Social) | *How did popular movements create change?* (Political participation, Non-violent, Cultural influence, Violent) | *How were popular movements challenged?* (Political opposition, Internal divisions, Violent opposition, Resilience of traditional ideas) | *What was the impact?* (Political change, Social change, Women, Marginalized groups).

* **2028 Paper 2 Format (25 Marks):** **Section A (6m):** Choose 1 of 2 questions on the 4 specified concepts illustrated with 1 thematic example. **Section B (19m):** Choose 1 of 2 questions for your Thematic Study: **Part (a) [4m]** short-answer explaining 1 example + **Part (b) [15m]** analytical essay synthesizing examples from **at least 2 regions**.

#### D. Paper 3 — Regional Studies (HL only, 90h, 2h, 30 marks, 35% HL)
Select **1** region and study **2** of its **12** regional studies (6 inquiry topics × 4 specified content bullets each). Answer **2 essay questions** (15 marks each) from different studies. Historiography citations are helpful but **explicitly not required** for 13–15 if historical arguments/perspectives are thoroughly evaluated.

| # | Africa and the Middle East (12 Studies) | The Americas (12 Studies) | Asia and Oceania (12 Studies) | Europe (12 Studies) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Transformation in North Africa & ME (750–1291) | Indigenous societies in the Americas (c750–1500) | Asian kingdoms & empires (750–1500 CE) | Medieval kingdoms & empires (c750–1400) |
| **2** | Pre-colonial sub-Saharan African states (c800–1945) | Colonialism & system of slavery (c1492–1830) | Mughal Empire & British EIC (1526–1858) | Renaissance & Reformation (c1350–1700) |
| **3** | The African slave trade (1500–1900) | Independence movements in the Americas (1763–1860) | Challenges to imperial rule in China (1736–1911) | Enlightenment & Absolutism (1600–1800) |
| **4** | Ottoman Empire & creation of Türkiye (c1790–1938) | The US Civil War (1840–1877) | Indigenous societies & identity in Australia/NZ (c1770–2020) | The French Revolution (1774–1815) |
| **5** | European imperialism & partition of Africa (c1840–1920) | Formation of modern nations (1860–1929) | Korea (1840–1945) | Unification of Germany & Italy (1815–1871) |
| **6** | Developments in South Africa (1867–2020) | The Mexican Revolution (1884–1940) | Independence of India (1857–1964) | Europe & the First World War (1871–1923) |
| **7** | Colonialism & crisis in Rwanda & Congo (c1875–2003) | The Great Depression in the Americas (c1920–1939) | Emergence of independent states in SE Asia (1900–1990) | The Russian Revolution (1855–1924) |
| **8** | Colonialism in Côte d'Ivoire, Kenya, Mozambique, Nigeria, Senegal & Uganda (1890–1980) | Emergence of the Americas in global affairs (1880–1945) | Emergence of Modern China (1910–1949) | European totalitarianism (1918–1941) |
| **9** | Conflict & instability in the Middle East (1896–2020) | The Americas during the Cold War (1945–1991) | Politics & economy in Japan (1912–2020) | Europe & the Second World War (1918–1949) |
| **10** | Independence movements in Algeria, Angola, Ghana, Guinea, Namibia & Tanganyika (c1900–2000) | Political developments in Latin America (1934–2020) | Emergence of Central Asian republics (1917–2020) | Democracy, authoritarianism & conflict in Spain (c1920–2020) |
| **11** | Revolution, reform & foreign relations in ME (c1945–2020) | Social movements in the Americas (1945–2020) | The Cold War in Asia (1949–2002) | The USSR & post-Soviet Russia (1945–2020) |
| **12** | Modern developments in Ethiopia, Niger, Somalia, Tunisia, Zambia & Zimbabwe (c1945–2020) | Political developments in USA & Canada (1960–2020) | The People's Republic of China (1949–2020) | Europe during & after the Cold War (1945–2020) |

---

## 3. App Tools & Structured Reference Data (for Simple Revision)

### 3.1 Paper 1 OPCVL Source Trainer (2017/2020 Active Syllabus)

Paper 1 is a **60-minute, 24-mark** exercise in speed, precision, and explicit source mechanics. Recommended time budget (including 5 minutes reading time): **Q1a+Q1b: 10 mins | Q2: 10 mins | Q3: 15 mins | Q4: 25 mins**.

#### A. Question-by-Question Training Engine

| Question | Marks | Target Skill | Strict Examiner / Markscheme Rules | Recommended Output Structure |
| :--- | :---: | :--- | :--- | :--- |
| **Q1a** | **3** | Explicit Comprehension (Source X) | • Uses **source content ONLY** (zero outside knowledge).<br>• Point-marked: 3 distinct, accurate points directly supported by the text/visual.<br>• Paraphrase rather than dumping block quotes. | 3 crisp, separated analytical points ("First, Source A indicates... Second... Third..."). |
| **Q1b** | **2** | Explicit Comprehension (Source Y — often visual/cartoon) | • Uses **source content ONLY**.<br>• Point-marked: 2 distinct observations.<br>• For political cartoons/diagrams: decode explicit visual symbols, labels, captions, and implied message without inventing context. | 2 distinct message/observation points tied directly to visual/textual evidence. |
| **Q2** | **4** | **OPCVL** Source Evaluation (Value & Limitations) | • Prompt: *"With reference to its origin, purpose and content, analyse the value and limitations of Source [X] for a historian studying [topic]."*<br>• **Strict Cap Rule:** *"If only value or limitations are discussed, award a maximum of [2]."*<br>• **Mandatory Triad:** Must explicitly reference **Origin**, **Purpose**, AND **Content** across the analysis (dropping Content caps marks).<br>• **"OPCVL" is NOT printed on the exam** — Origin, Purpose, and Content are **evidence tools**; Value and Limitations are the **analytical conclusions**. | **Two cohesive paragraphs** (Paragraph 1: **Value** via Origin, Purpose, Content; Paragraph 2: **Limitations** via Origin, Purpose, Content). Every claim ends with *"...for a historian studying [exact prompt focus]."* |
| **Q3** | **6** | Cross-Source Compare & Contrast | • Prompt: *"Compare and contrast what Sources [X] and [Y] reveal to a historian studying [topic]."*<br>• **Running Comparison Mandate:** Must weave Source X and Source Y together point-by-point. **Block / "end-on" accounts** (all of X, then all of Y) are heavily penalized.<br>• **Zero Provenance Rule:** Do **NOT** analyse Origin or Purpose here (zero marks awarded; wastes time). Content revelations only.<br>• Must include **both** similarities (comparisons) and differences (contrasts); 6 points total (e.g., 3 similarities + 3 differences, or 4+2 / 2+4). | **Paragraph 1 (Comparisons):** Integrated thematic similarities (*"Both Sources C and D highlight..."*).<br>**Paragraph 2 (Contrasts):** Integrated divergences & omissions (*"While Source C emphasizes..., Source D contrasts by..."* / *"Whereas Source C notes..., Source D omits this and instead focuses on..."*). |
| **Q4** | **9** | Evaluative Synthesis (Sources + Own Knowledge) | • Marked holistically using **generic 9-mark markbands** + paper-specific content checklist.<br>• **Mandatory Synthesis:** Must integrate **all 4 sources** (or at minimum clearly engage the relevant source set) **AND** accurate, specific **own contextual knowledge**.<br>• Treating sources one-by-one or dumping outside history without citing sources caps the answer at 4–6 (or 1–3). | Thematic analytical mini-essay: **1-sentence thesis** → **2–3 thematic paragraphs** weaving *"Source A corroborates..."* + *"Own knowledge confirms..."* + counter-evidence from *"Source D"* → **2-sentence judgment**. |

#### B. Q2 OPCVL Anti-Cliché Blacklist & Rewrite Matrix (App Auto-Feedback Rules)

Simple Revision's OPCVL trainer should flag these banned generic phrases using regex/LLM rubric checks and prompt the student with the targeted rewrite pattern:

| Cliché / Failure Pattern (Flagged Red) | Why IB Examiners Reject It | Markscheme-Ready Rewrite Pattern |
| :--- | :--- | :--- |
| *"It is biased because the author is American/Japanese/German."* | Every source reflects a perspective; calling it "biased" without specifying distortion earns **0 credit**. | *"Because the author is a US State Department official writing in 1941 (**Origin**), the source exaggerates Japanese expansionist unity while omitting internal Tokyo cabinet divisions (**Content**), **limiting** its usefulness for assessing Japanese domestic decision-making—though it remains **valuable** for understanding Washington's threat perception."* |
| *"It is a secondary source, so the author wasn't there and it might be inaccurate."* | Secondary academic works benefit from hindsight, archival access, and synthesis; being secondary is **not** an automatic limitation. | *"As a 2012 scholarly monograph (**Origin**), the historian has retrospective access to declassified Soviet and German archives (**Value** for multi-causal synthesis), yet its focus on high diplomacy (**Purpose/Content**) **limits** insight into grassroots public sentiment in 1938."* |
| *"It is a primary source, so it is eyewitness and therefore completely reliable."* | Eyewitness sources have narrow spatial/temporal vision and immediate rhetorical agendas. | *"Delivered as a speech at the March on Washington in August 1963 (**Origin**), its **purpose** to rally federal legislative support gives it high **value** as evidence of SCLC rhetorical framing, yet its conciliatory public **content** **limits** insight into SNCC's sharper internal criticisms of JFK."* |
| *"The author might be lying"* or *"Only one person's view."* | Speculative, unsubstantiated, and applicable to literally any document in human history. | Pinpoint **what specific agenda or institutional constraint** shapes selection/omission (e.g., censorship, audience diplomacy, post-hoc memoir self-justification). |
| Evaluating Origin + Purpose only (omitting Content) | Violates explicit prompt instruction (*"Origin, purpose and content"*). | Require at least one verbatim short quote, figure, or named event extracted from the **Content** in both Value and Limitation arguments. |

#### C. Official Paper 1 Q4 Markbands (9 Marks — 2017/2020 Guide)

| Marks | Official IB Level Descriptor |
| :---: | :--- |
| **0** | The response does not reach a standard described by the descriptors below. |
| **1–3** | The response lacks focus on the question. References to the sources are made, but at this level these references are likely to consist of descriptions of the content of the sources rather than the sources being used as evidence to support the analysis. No own knowledge is demonstrated or, where it is demonstrated, it is inaccurate or irrelevant. |
| **4–6** | The response is generally focused on the question. References are made to the sources, and these references are used as evidence to support the analysis. Where own knowledge is demonstrated, this lacks relevance or accuracy. There is little or no attempt to synthesize own knowledge and source material. |
| **7–9** | The response is focused on the question. Clear references are made to the sources, and these references are used effectively as evidence to support the analysis. Accurate and relevant own knowledge is demonstrated. There is effective synthesis of own knowledge and source material. |

#### D. 2028 Curriculum Paper 1 Mode Adapter (Static 3-Question Format)
When `curriculumVersion === '2028'`, Simple Revision switches the Paper 1 Trainer from the 4-question OPCVL workflow to the **3-static-question (1h 15m, 3 sources A/B/C, 24 marks)** format:
* **Q1 (6m):** *Explain how the content of both source A and source B can be used to answer the inquiry question.* (1–2m minimal/descriptive; 3–4m partial/max 3m if only 1 source; 5–6m specific developed range across both sources.)
* **Q2 (6m):** *Analyse how the context of source C influences how it can be used to answer the inquiry question.* (Replaces OPCVL: focuses on creation/preservation context — author, time, place, purpose, audience — and how that shapes utility; 1–2m descriptive, 3–4m partial, 5–6m sustained analysis.)
* **Q3 (12m):** *Examine how the perspectives in all the sources can be used to answer the inquiry question.* (1–3m minimal/1 source without inquiry link; 4–6m partial/max 6m if 1 source; 7–9m at least 2 sources/max 9m if 2 sources; 10–12m insightful synthesis of similarities & differences across **all 3 sources** tied to the inquiry question.)

---

### 3.2 Essay Outline Builder & Markbands (Paper 2 & Paper 3)

#### A. Official 15-Mark Generic Markbands (2017 Guide + 2020 Amendments)

> **Critical 2020 Amendment Precision:** In June 2018 (effective May 2020), IB revised the knowledge threshold descriptors in **7–9** (from *"mostly"* to **"partly"** accurate and relevant) and Paper 3 **10–12** (from unqualified *"accurate and relevant"* to **"mostly"** accurate and relevant) to establish cleaner progression into the 13–15 band.

| Band | Paper 2 (SL & HL) — World History Topics (2020 Amended) | Paper 3 (HL Only) — Regional Options (2020 Amended) |
| :---: | :--- | :--- |
| **0** | Answers do not reach a standard described by the descriptors below. | Response does not reach a standard described by the descriptors below. |
| **1–3** | Little understanding of question demands; poorly structured or minimal focus. Little knowledge; examples factually incorrect, irrelevant, or vague. Little or no critical analysis; mostly generalizations and poorly substantiated assertions. | Little understanding of question demands; poorly structured or minimal focus. Little knowledge; examples factually incorrect, irrelevant, or vague. Little or no critical analysis; mostly generalizations and poorly substantiated assertions. |
| **4–6** | Some understanding of question demands; attempt at structure lacks clarity/coherence. Knowledge lacks accuracy and relevance; superficial context; examples vague or lack relevance. Limited analysis; **primarily narrative/descriptive**. | Some understanding of question demands; attempt at structure lacks clarity/coherence. Knowledge lacks accuracy and relevance; superficial context; examples vague or lack relevance. Limited analysis; **primarily narrative/descriptive**. |
| **7–9** | Understanding of question demands, but only **partially addressed**; attempt at structured approach. Knowledge of the world history topic is **partly accurate and relevant** *(2020 amendment)*. Events generally placed in context; examples appropriate and relevant; makes links/comparisons. Moves beyond description to some analysis/critical commentary, **but not sustained**. | Understanding of question demands, but only **partially addressed**; attempt at structured approach. Knowledge is **partly accurate and relevant** *(2020 amendment)*. Events generally placed in context; examples appropriate and relevant. Moves beyond description to some analysis/critical commentary, **but not sustained**. |
| **10–12** | Demands understood and addressed; generally well structured/organized (some repetition or lack of clarity in places). Knowledge mostly accurate and relevant; events contextualized; some understanding of historical concepts. Examples appropriate/relevant and support analysis/evaluation; effective links/comparisons. Critical analysis mainly clear and coherent; some awareness and evaluation of different perspectives; most main points substantiated; argues to a consistent conclusion. | Demands understood and addressed; generally well structured/organized (some repetition or lack of clarity). Knowledge is **mostly accurate and relevant** *(2020 amendment)*; events contextualized; clear understanding of historical concepts. Examples appropriate/relevant and support analysis/evaluation. Arguments mainly clear/coherent; some awareness and evaluation of different perspectives. Contains critical analysis; most main points substantiated; argues to a consistent conclusion. |
| **13–15** | Clearly focused, high awareness of demands and implications; well structured and effectively organized. Knowledge **accurate and relevant**; clear understanding of historical concepts. Examples appropriate/relevant and used **effectively** to support analysis/evaluation; **effective links and/or comparisons**. **Clear and coherent critical analysis**; **evaluation of different perspectives integrated effectively**; all or nearly all main points substantiated; argues to a **consistent conclusion**. | Clearly focused, high awareness of demands and implications; well structured, **balanced**, and effectively organized. Knowledge is **detailed, accurate and relevant**; clear understanding of historical concepts. Examples appropriate/relevant and used **effectively**. Arguments clear and coherent; **evaluation of different perspectives integrated effectively**. **Well-developed critical analysis**; all or nearly all main points substantiated; argues to a **reasoned conclusion**. |

*(Note for **2028 Guide** Paper 2 Sec B(b) [15m] and Paper 3 [15m]: 2028 Paper 2 Sec B(b) shifts explicitly to **"consistently analytical"** + **"well-developed connections between examples"**, while 2028 Paper 3 shifts explicitly to **"in-depth understanding of the argument in the question"** + **"thorough and well-balanced evaluation of a range of perspectives on the argument"**.)*

#### B. Thesis Archetypes & Command-Term Structural Blueprints

1. **Thesis Archetypes (Required in Intro to Unlock 10–15 Bands):**
   * **Weighted Causal Hierarchy (for *"To what extent"*, *"Evaluate"*, *"Account for"*):** *"While [Named Factor X] acted as the immediate catalyst / indispensable enabler, [Underlying Factor Y] was fundamentally more decisive because [causal mechanism]; nonetheless, [Counter-factor Z] significantly shaped the trajectory in [Region B]."*
   * **Nuanced Conditional Evaluation (for *"How successful"*, *"Assess the impact"*):** *"Policies under [Leader/State] achieved substantial success in [Dimension 1, e.g., economic mobilization / political consolidation], yet remained structurally constrained in [Dimension 2, e.g., total social control / ideological consensus], producing an uneven balance of outcomes."*
   * **Comparative Typology (for *"Compare and contrast"*):** *"Across both [Region A] and [Region B], [Phenomenon] converged sharply in [Shared Driver/Method 1 & 2], yet diverged fundamentally in [Differentiator 1 & 2] due to contrasting [structural preconditions / foreign alignments]."*
   * **Change vs Continuity Dialectic (for *"To what extent did X transform..."*):** *"Although [Event/Leader] instituted radical discontinuity in [political institutions / diplomatic alignment], deep structural continuities persisted in [socioeconomic hierarchies / coercion apparatus]."*

2. **Paper 2 Comparative Architecture (Two-Region Guardrails):**
   * **Point-by-Point Thematic Synthesis (Recommended for 13–15):** Organize by 3–4 analytical themes (e.g., *Theme 1: Economic Triggers*, *Theme 2: Coercive Apparatus*, *Theme 3: Propaganda & Mass Mobilization*), explicitly juxtaposing Region A and Region B inside **each** paragraph using explicit comparative links (*"Similarly, whereas..."*, *"In sharp contrast..."*). Prevents the essay from splitting into two disconnected mini-essays.
   * **Parallel Case-Study Balance Rule:** If a question requires two regions (e.g., Europe + Asia, or Americas + Africa/ME), both must receive substantive analytical treatment (~50/50 or ~55/45 split). Treating the second state as a 3-sentence afterthought caps the response at 7–9.
   * **Cross-Regional Guardrail Check:** Verify in UI before outline submission that chosen examples belong to **different** IB regions (e.g., Hitler + Stalin = **INVALID** for two-region prompt, both Europe; Hitler + Mao or Castro + Stalin = **VALID**) and that a cross-regional war (WWI/WWII/Crusades) is **not** used twice for different theaters.

3. **Paragraph Micro-Architecture (`TEAC-HL` Frame):**
   * **T — Topic Claim:** Analytical factor tied directly to question terms (never a chronological date marker).
   * **E — Evidence:** Precise dates, treaties, policies, figures, and statistics (e.g., 6M Weimar unemployed in 1932; 1936 Four-Year Plan; 30–45M Great Famine mortality estimates).
   * **A — Analysis:** Causal mechanism ("why/how this shifted power or caused conflict").
   * **C — Counter-Perspective / Comparative Link:** Either contrast with Region B (Paper 2) or introduce limiting caveat / rival interpretation.
   * **H — Historiography Integration:** Embed historian/school explicitly *as analytical proof/critique*, never as unintegrated name-dropping (*"While intentionalists like Bracher emphasize..., structuralists like Mommsen demonstrate..."*).
   * **L — Link:** Explicit judgment tying back to the thesis.

---

### 3.3 Historiography Schools & Historian Bank (Paper 2 & Paper 3 High-Yield Debates)

> **Usage Rule:** Historiography should illuminate competing interpretations, not serve as memorized ornament. In the 2028 guide, IB explicitly clarifies that Paper 3 does *not* require named historiography to hit 13–15 if perspectives/arguments are thoroughly evaluated—though in both 2017/2020 and 2028 guides, deploying accurate historiographical schools remains one of the fastest ways to signal AO3 synthesis.

| Topic / Debate | School / Position | Key Historian(s) & Anchor Work | Core Argument | Best Exam Prompts to Deploy |
| :--- | :--- | :--- | :--- | :--- |
| **1. Origins of WWI (1914)** | **Intentionalist / German War Guilt** | **Fritz Fischer** — *Germany's Aims in the First World War* (1961); *War of Illusions* (1969) | Germany deliberately sought continental hegemony (*Mitteleuropa*, *Septemberprogramm*) and used the July Crisis to launch a pre-planned war to resolve domestic crises (*Primat der Innenpolitik*). | P3 Europe Sec 13; P2 Topic 11 (*Causes of WWI*) |
| | **Centenary Revisionist / Shared Responsibility** | **Christopher Clark** — *The Sleepwalkers* (2012) | Rejects sole German guilt; European leaders were "sleepwalkers" caught in mutual paranoia, rigid alliance expectations, and Balkan agency (Serbia 1903, Russia, France). | P3 Europe Sec 13; P2 Topic 11 |
| | **Critique of Sleepwalkers / Neo-Fischerite Synthesis** | **Annika Mombauer** — *The Origins of the First World War* (2002); *The Fischer Controversy...* (2013) | Defends documentary evidence showing deliberate risk-taking and war-gambling in Berlin and Vienna; warns Clark's "sleepwalker" framing dangerously relativizes decision-maker agency. | Counter-critique against Clark in P3 Europe Sec 13 |
| | **Multicausal / Structural Constraints** | **James Joll** — *The Origins of the First World War* (1984); **John Keegan** — *The First World War* (1998) | Systemic pressures (alliances, mobilization timetables, unspoken assumptions) constrained leaders' room for maneuver in July 1914. | P3 Europe Sec 13; P2 Topic 11 |
| **2. Nazi Germany (Nature & Policies)** | **Intentionalist** | **Karl Dietrich Bracher** — *The German Dictatorship* (1969); **Klaus Hildebrand** | Emphasizes Hitler's personal ideological blueprint (*Mein Kampf*), central control, and linear top-down execution of totalitarian state aims. | P2 Topic 10; P3 Europe Sec 14 |
| | **Structuralist / Functionalist** | **Martin Broszat** (*The Hitler State*, 1981); **Hans Mommsen** | Argues the Nazi regime was a chaotic **polycracy** of rival agencies (SS, Gauleiters, ministries) causing "cumulative radicalization" without a single day-one master plan. | P2 Topic 10; P3 Europe Sec 14 |
| | **Synthesis ("Working towards the Führer")** | **Ian Kershaw** — *Hitler: Hubris/Nemesis* (1998–2000); *The Nazi Dictatorship* | Bridges Intentionalism and Structuralism: Hitler set overarching ideological radical goals, and subordinates competed to anticipate and radicalize policies ("working towards the Führer"). | P2 Topic 10; P3 Europe Sec 14 |
| | **Economic Primacy Crisis** | **Timothy Mason** | Late-1930s structural overheating, shortages, and labor pressures forced Hitler into aggressive war earlier than anticipated ("flight into war"). | P1 PS3 CS2; P3 Europe Sec 14–15 |
| **3. Fascist Italy (Mussolini)** | **Revisionist / Consensus Thesis** | **Renzo De Felice** — Multi-volume *Mussolini* biography | Distinguishes *fascism-as-movement* (modernizing/revolutionary) from *fascism-as-regime* (compromising with elites); claims Mussolini achieved genuine mass consensus (1929–36). | P2 Topic 10; P3 Europe Sec 14 |
| | **Anti-Fascist / Critical Opportunism** | **Denis Mack Smith** — *Mussolini* (1981) | Portrays Mussolini as a theatrical, incoherent opportunist driven by propaganda wins rather than systematic ideology; totalitarianism was largely an empty facade. | P2 Topic 10; P3 Europe Sec 14 |
| | **Political Religion / Cultural Totalitarianism** | **Emilio Gentile** | Emphasizes fascist sacralization of politics, rituals, and youth organizations as a genuine totalitarian cultural project despite structural compromises. | P3 Europe Sec 14 |
| **4. Stalin's USSR (Power & Terror)** | **Totalitarian / Intentionalist** | **Robert Conquest** — *The Great Terror* (1968) | Stalin deliberately engineered totalitarian control and the Purges out of paranoia and power hunger; emphasizes massive mortality and central direction. | P2 Topic 10; P3 Europe Sec 16 |
| | **Revisionist / Alternative Paths** | **Stephen Cohen** — *Bukharin and the Bolshevik Revolution* (1973) | Rejects deterministic Lenin-to-Stalin continuity; Bukharin's moderate NEP path was a viable alternative defeated politically by Stalin. | P3 Europe Sec 12 & 16; P2 Topic 10 |
| | **Revisionist / Social & Bureaucratic** | **Sheila Fitzpatrick** (*Everyday Stalinism*); **J. Arch Getty** (*Origins of the Great Purges*, 1985) | Fitzpatrick highlights upward social mobility of *vydvizhentsy* cadres and bottom-up participation; Getty frames the purges as chaotic center-periphery bureaucratic dysfunction rather than flawless orchestration. | P2 Topic 10; P3 Europe Sec 16 |
| **5. Mao's China (Rise & PRC Rule)** | **Early Western Sympathetic** | **Edgar Snow** — *Red Star Over China* (1937) | Framed the Yan'an CCP as disciplined egalitarian agrarian reformers and patriotic anti-Japanese underdogs compared to a corrupt GMD. | P2 Topic 10; P3 Asia Sec 12 |
| | **Extreme Critical / Revisionist** | **Jung Chang & Jon Halliday** — *Mao: The Unknown Story* (2005); **Frank Dikötter** — *Mao's Great Famine* (2010) | Chang/Halliday cast Mao as a sadistic power-obsessed tyrant; Dikötter uses provincial archives to show the Great Leap Forward famine (30–45M deaths) as coerced state terror and systematic lying. | P2 Topic 10; P3 Asia Sec 14 |
| | **Balanced Social / Institutional** | **Maurice Meisner** (*Mao's China and After*); **1981 Official CCP Resolution** | Meisner credits socio-economic gains (literacy, life expectancy, anti-imperial sovereignty) while condemning authoritarian catastrophes; CCP formula deems Mao "70% right, 30% wrong." | P3 Asia Sec 14 |
| **6. Spanish Civil War** | **Socioeconomic & Nationalist Terror Critique** | **Paul Preston** — *The Spanish Civil War*; *Franco* | Traces war to deep structural inequalities (latifundia, Church, military); exposes Franco's deliberate terror/extermination alongside Republican factional breakdown. | P2 Topic 11; P3 Europe Sec 14 |
| | **Liberal-Balanced / Internationalized** | **Hugh Thomas** — *The Spanish Civil War* (1961) | Classic narrative balancing internal Spanish polarization with decisive foreign intervention (German/Italian vs Soviet aid & Non-Intervention). | P2 Topic 11; P3 Europe Sec 14 |
| | **Conservative Revisionist (Left culpability)** | **Stanley Payne** — *The Collapse of the Spanish Republic* | Places greater emphasis on left-wing revolutionary radicalization (PSOE/CNT/POUM) in Destabilizing the Second Republic before July 1936. | P3 Europe Sec 14 |
| **7. Cuban Revolution & Castro** | **Structuralist / Nationalist Autonomy** | **Hugh Thomas** (*Cuba: The Pursuit of Freedom*); **Sebastian Balfour** (*Castro*) | Views 1959 revolution as rooted in decades of US economic dominance, sugar dependency, and failed republican governance; Castro as pragmatic nationalist who pivoted to Marxism-Leninism partly under US pressure. | P2 Topic 10; P3 Americas Sec 14 & 16 |
| | **Urban Underground & Institutional** | **Julia Sweig** — *Inside the Cuban Revolution* (2002); **Marifeli Pérez-Stable** | Sweig overturns the *foquismo* myth, showing the urban *Llano* underground was vital alongside Sierra Maestra guerrillas; Pérez-Stable tracks how radical nationalism consolidated into institutional authoritarianism. | P2 Topic 10; P3 Americas Sec 14 |
| **8. Cold War (Origins, Global, End)** | **Orthodox / Traditionalist (1940s–50s)** | **Herbert Feis** (*From Trust to Terror*); **Thomas A. Bailey** | Blames Soviet expansionism, broken Yalta/Potsdam pledges in Eastern Europe, and Stalin's Marxist-Leninist ideology; US containment was defensive. | P2 Topic 12; P3 Europe Sec 17–18 / Americas Sec 16 |
| | **Revisionist (1960s–70s)** | **William Appleman Williams** (*The Tragedy of American Diplomacy*, 1959); **Gabriel Kolko** | Blames US "Open Door" economic imperialism; argues Washington sought global capitalist markets and provoked a defensive USSR via atomic/economic pressure. | P2 Topic 12; P3 Americas Sec 16 |
| | **Post-Revisionist (1970s–90s)** | **John Lewis Gaddis** (*The US and the Origins of the Cold War*, 1972; *We Now Know*, 1997); **Melvyn Leffler** (*A Preponderance of Power*, 1992) | Blames mutual security dilemmas and post-WWII power vacuums (Gaddis 1972) or expansive US national security fears (Leffler); after Soviet archives opened, Gaddis (1997) shifted back toward blaming Stalin's personality/ideology. | P2 Topic 12 |
| | **New Cold War History / Global South** | **Vladislav Zubok** (*A Failed Empire*, 2007); **Odd Arne Westad** (*The Global Cold War*, 2005) | Uses Soviet/Chinese archives: Zubok argues Soviet leaders mixed "revolutionary-imperial paradigm" illusions with security fears; Westad centers decolonization and superpower interventions across Asia, Africa, and Latin America. | P2 Topic 12; P3 Americas/Asia/AME |
| **9. US Civil Rights Movement** | **Top-Down / Charismatic Leadership** | **Taylor Branch** — *Parting the Waters* (1988); **David Garrow** (*Bearing the Cross*, 1986) | Centers MLK Jr, SCLC, moral suasion, and federal executive/legislative breakthroughs (1964 CRA, 1965 VRA). | P1 PS4 CS1; P3 Americas Sec 17 |
| | **Bottom-Up / Grassroots Organizing** | **Charles Payne** — *I've Got the Light of Freedom* (1995); **John Dittmer** (*Local People*, 1994) | Demonstrates that everyday rural Black organizers (Ella Baker, Fannie Lou Hamer, Amzie Moore) and SNCC/local women sustained the movement long before and beyond national media moments. | P1 PS4 CS1; P3 Americas Sec 17 |
| | **Long Civil Rights & Black Power** | **Jacquelyn Dowd Hall**; **Peniel Joseph** | Rejects artificial 1954–65 boundaries and the "good MLK vs bad Black Power" binary, framing Black Power (Malcolm X, SNCC/Black Panthers) as a coherent struggle against Northern systemic poverty and structural racism. | P1 PS4 CS1; P3 Americas Sec 17 |
| **10. Japanese Militarism & Apartheid SA** | **Japan (Imperial Responsibility vs Structural Drift)** | **Saburō Ienaga** (*The Pacific War*); **Akira Iriye**; **Herbert Bix** (*Hirohito and the Making of Modern Japan*, 2000) | Ienaga highlights military suppression & continuity from 1931–45 ("Fifteen-Year War"); Bix counters claims of Hirohito as passive figurehead, proving active imperial involvement; Iriye emphasizes international economic/diplomatic breakdown. | P1 PS3 CS1; P3 Asia Sec 11 |
| | **South Africa (Afrikaner Nationalism vs Racial Capitalism)** | **Hermann Giliomee** (*The Afrikaners*); **Saul Dubow**; **Nigel Worden** | Debates whether Apartheid was primarily an ideological Afrikaner survivalist project (Giliomee) or an economic system engineered to supply cheap, controlled Black migrant labor for gold/mining capital (revisionist/Worden). | P1 PS4 CS2; P3 AME Sec 15 |

---

### 3.4 Timeline Builder Data (High-Yield Chronological Spine: 1871–2005)

For Simple Revision's interactive **Timeline Builder**, dates are structured with cross-paper tags (`P1`, `P2`, `P3`) so students can filter by paper, region, or theme.

| Year / Date | Event / Treaty / Crisis | Region | Syllabus Tags | High-Yield Analytical Significance |
| :--- | :--- | :--- | :--- | :--- |
| **1871** | Unification of Germany; Treaty of Frankfurt | Europe | P3-EU-11, P3-EU-13 | Reshapes European balance of power; Alsace-Lorraine antagonism fuels Franco-German rivalry. |
| **1884–1885** | Berlin West Africa Conference | Africa/ME | P3-AME-8, P3-AME-7 | Formalizes "effective occupation" for Scramble for Africa; 1885 Berlin Act includes anti-slavery clauses. |
| **1889** | Meiji Constitution promulgated in Japan | Asia/Oceania | P3-AO-9, 2028-FS3 | Consolidates oligarchic imperial sovereignty (*kokutai*) and military autonomy under Emperor. |
| **1894–1895** | First Sino-Japanese War & Treaty of Shimonoseki | Asia/Oceania | P3-AO-9 | Proves success of Meiji modernization vs failure of Qing Self-Strengthening; Japan takes Taiwan. |
| **1896** | Battle of Adwa (Ethiopia defeats Italy) | Africa/ME | P3-AME-9 | Premier case of successful armed African resistance under Menelik II. |
| **1898** | Spanish–American War | Americas | P3-AM-10, P3-AO-5 | Signals US emergence as overseas imperial power (Philippines, Guam, Puerto Rico, Cuban Platt Amendment). |
| **1899–1902** | South African War (Second Boer War) & Treaty of Vereeniging | Africa/ME | P3-AME-15 | Paves way for 1909 Act of Union consolidating white minority governance in South Africa. |
| **1904–1905** | Russo–Japanese War & 1905 Russian Revolution | Cross-regional | P2-T11, P3-AO-9, P3-EU-12 | First modern defeat of a European power by an Asian state; catalyzes Nicholas II's October Manifesto. |
| **1910–1917** | Mexican Revolution & 1917 Constitution | Americas | P2-T11, P3-AM-11 | Overthrows Porfirio Díaz; pioneers progressive labor/agrarian constitution (Articles 27 & 123). |
| **1911** | Xinhai Revolution in China | Asia/Oceania | P3-AO-9, P3-AO-12 | Ends Qing dynasty; ushers in fragile Republic and Warlord Era instability. |
| **1914 (Jun–Aug)** | Assassination at Sarajevo & July Crisis → WWI | Europe | P2-T11, P3-EU-13 | Alliance cascade triggers total global war across Europe, Middle East, Africa, and seas. |
| **1916–1917** | Sykes–Picot (1916) & Balfour Declaration (1917) | Africa/ME | P3-AME-13 | Conflicting Allied wartime pledges lay structural roots for Arab–Israeli and mandate disputes. |
| **1917 (Feb/Oct)** | Russian Revolutions (February & Bolshevik October) | Europe | P2-T10, P3-EU-12 | Collapses Tsarism and Dual Power; establishes world's first Bolshevik socialist state under Lenin. |
| **1919** | Treaty of Versailles; May Fourth Movement (China); Amritsar Massacre (India) | Global | P1-PS3, P3-EU-15, P3-AO-10/12 | Resentment over Versailles fuels German revisionism, Chinese communism/nationalism, and Indian mass nationalism. |
| **1921–1922** | Washington Naval Conference; NEP in USSR | Global | P1-PS3, P3-AO-11, P3-EU-12 | Caps Japanese naval ratio (5:5:3); Lenin pivots from War Communism to New Economic Policy. |
| **1922 (Oct)** | Mussolini's March on Rome | Europe | P1-PS3, P2-T10, P3-EU-14 | King Victor Emmanuel III appoints Mussolini PM, initiating gradual fascist dictatorship. |
| **1923** | Ruhr Crisis, German Hyperinflation, Munich Putsch | Europe | P2-T10, P3-EU-14 | Tests Weimar survival; shifts Hitler from violent coup strategy to pseudo-legal electoral path. |
| **1927 (Apr)** | Shanghai Massacre & start of Chinese Civil War | Asia/Oceania | P2-T11, P3-AO-12 | Jiang Jieshi purges CCP, ending First United Front and driving CCP into rural guerrilla soviets. |
| **1928–1929** | Stalin launches 1st Five-Year Plan; Wall Street Crash (Oct 1929) | Global | P2-T10, P3-AM-12, P3-EU-14/16 | Collectivization/industrialization transform USSR while Great Depression shatters global democracies. |
| **1931 (Sep)** | Mukden Incident & Japanese invasion of Manchuria | Asia/Oceania | P1-PS3-CS1, P3-AO-11/12 | First major blow to League collective security; sets up Manchukuo puppet state (1932). |
| **1933 (Jan–Mar)** | Hitler appointed Chancellor; Reichstag Fire & Enabling Act; FDR New Deal | Global | P1-PS3, P2-T10, P3-EU-14, P3-AM-12 | Legal consolidation of Nazi dictatorship parallels FDR's democratic New Deal response to Depression. |
| **1934–1936** | Long March (1934–35); Nuremberg Laws (1935); Abyssinian Crisis (1935–36) | Global | P1-PS3, P2-T10, P3-AME-14, P3-AO-12 | Mao rises at Zunyi Conference; Mussolini destroys League credibility; Hitler remilitarizes Rhineland (1936). |
| **1936–1939** | Spanish Civil War; Stalin's Great Terror (1936–38) | Europe | P2-T10/11, P3-EU-14/16 | Foreign intervention deepens Axis–Soviet divide while Stalin purges Old Bolsheviks and Red Army. |
| **1937 (Jul)** | Marco Polo Bridge Incident → Second Sino-Japanese War | Asia/Oceania | P1-PS3-CS1, P2-T11, P3-AO-11/12 | Full-scale war in Asia; Rape of Nanjing (Dec 1937); Second United Front forged after Xi'an (1936). |
| **1938 (Mar–Sep)** | Anschluss (Mar) & Munich Agreement (Sep) | Europe | P1-PS3-CS2, P3-EU-15 | Peak of Anglo-French appeasement; dismantles Czechoslovakia and alienates Stalin. |
| **1939 (Aug–Sep)** | Nazi–Soviet Pact (Aug 23) & Invasion of Poland (Sep 1) | Europe | P1-PS3-CS2, P2-T11, P3-EU-15 | Diplomatic shock enables WWII in Europe; Pact of Steel (May 1939) binds Berlin and Rome. |
| **1940–1941** | Tripartite Pact (Sep 1940); US Oil Embargo (Jul 1941); Pearl Harbor (Dec 7, 1941) | Global | P1-PS3-CS1, P2-T11, P3-AO-11, P3-AM-13 | Escalating economic warfare draws US, Japan, Germany, and USSR (Barbarossa, Jun 1941) into truly global war. |
| **1945 (Feb–Aug)** | Yalta & Potsdam Conferences; Hiroshima/Nagasaki; Korea divided at 38th parallel | Global | P2-T12, P3-AM-13/16, P3-EU-17 | End of WWII exposes Grand Alliance fractures over Poland, Germany, atomic diplomacy, and East Asia. |
| **1947** | Truman Doctrine & Marshall Plan; Partition of India & Pakistan | Global | P2-T12, P3-AO-10/16, P3-EU-17 | Institutionalizes US containment in Europe while British decolonization triggers massive South Asian partition. |
| **1948–1949** | National Party Apartheid victory (1948); Berlin Blockade (1948–49); NATO & PRC founded (1949) | Global | P1-PS4, P2-T10/12, P3-AME-15, P3-AO-14 | Formalizes Cold War blocs (FRG/GDR, NATO, PRC) and codifies institutional white supremacy in South Africa. |
| **1950–1953** | Korean War | Asia/Oceania | P2-T11/12, P3-AO-15, P3-AM-16 | Hot war of containment globalizes Cold War militarization (NSC-68) and entrenches Korean division. |
| **1954** | *Brown v. Board of Education* (US); Dien Bien Phu & Geneva Accords (Vietnam) | Americas / Asia | P1-PS4-CS1, P2-T11/12, P3-AO-15 | Legal blow to US school segregation; French defeat in Indochina sets stage for US intervention in Vietnam. |
| **1955–1956** | Montgomery Bus Boycott; Freedom Charter (SA); Secret Speech, Hungary & Suez Crises (1956) | Global | P1-PS4, P2-T12, P3-AME-15/17, P3-EU-16/18 | Grassroots civil rights surge; Suez ends Anglo-French hegemony while Hungary exposes limits of De-Stalinization. |
| **1957–1960** | Ghana independence (1957); Great Leap Forward (1958); Cuban Revolution (1959); Sharpeville (1960) | Global | P2-T8/10, P3-AME-11/15, P3-AM-14, P3-AO-14 | Wave of African decolonization; Sino-Soviet split deepens; Sharpeville forces ANC/PAC into armed struggle. |
| **1961–1962** | Berlin Wall (Aug 1961); Bay of Pigs (1961); Cuban Missile Crisis (Oct 1962) | Americas / Europe | P2-T12, P3-AM-14/16, P3-EU-18 | Peak brinkmanship yields Hotline, Test Ban Treaty (1963), and mutual recognition of spheres in Europe/Caribbean. |
| **1963–1965** | Rivonia Trial (1963–64); Civil Rights Act (1964) & Voting Rights Act (1965); Gulf of Tonkin (1964) | Global | P1-PS4, P2-T11, P3-AME-15, P3-AM-16/17 | US legislative triumphs contrast with ANC decapitation on Robben Island and US escalation in Vietnam. |
| **1966–1968** | Cultural Revolution launched (1966); Six-Day War (1967); Tet Offensive & Prague Spring (1968) | Global | P2-T10/12, P3-AME-17, P3-AO-14/15, P3-EU-18 | Radicalization in China, Arab–Israeli territorial shift, US Vietnam turning point, and Brezhnev Doctrine in Prague. |
| **1972–1975** | Nixon visits China & SALT I (1972); Chilean coup (1973); Yom Kippur War (1973); Saigon falls (1975) | Global | P2-T12, P3-AM-14/16, P3-AME-17, P3-AO-14/15 | Peak of *detente* and triangular diplomacy alongside US covert overthrow of Allende and defeat in Indochina. |
| **1978–1979** | Deng's Four Modernizations (1978); Iranian Revolution & Soviet invasion of Afghanistan (1979) | Global | P2-T12, P3-AO-14/15, P3-AME-17 | China pivots to market socialism while Iran and Afghanistan shatter *detente* and ignite the Second Cold War. |
| **1980–1985** | Solidarity in Poland (1980); Reagan SDI; Gorbachev General Secretary (1985) | Europe / Americas | P2-T12, P3-EU-16/18, P3-AM-18 | Structural economic stagnation meets Reagan arms pressure and Gorbachev's *glasnost*/*perestroika*. |
| **1989–1991** | Tiananmen Square (Jun 1989); Fall of Berlin Wall (Nov 1989); Collapse of USSR (Dec 1991) | Global | P2-T12, P3-AO-14, P3-EU-16/18 | CCP survives via coercion/economic reform while Communist Eastern Europe and the USSR dissolve peacefully. |
| **1994** | Rwandan Genocide (Apr–Jul); First multiracial South African election (Apr); ICTR established | Africa/ME | P1-PS5-CS1, P3-AME-14/15 | Stark contrast between UN paralysis in Rwanda and CODESA negotiated transition to Mandela's presidency. |
| **1998–2002** | Račak Massacre & NATO Kosovo bombing (1999); KFOR; Milosevic ICTY indictment; Rugova elected (2002) | Europe | P1-PS5-CS2, P3-EU-18 | Post-Rwanda "humanitarian intervention" without UNSC authorization shapes international law & Balkan settlement. |

---

## 4. Question Bank & Markscheme Engineering Spec

### 4.1 Question Taxonomy Schema (TypeScript / JSON Spec)

Every item in Simple Revision's History HL question bank should carry deterministic metadata to enforce syllabus constraints (e.g., two-region validation, cross-regional war lock, named-entity compliance, and 2020 vs 2028 version filtering):

```typescript
export type CurriculumVersion = '2020' | '2028';
export type IBRegion =
  | 'africa_middle_east'
  | 'americas'
  | 'asia_oceania'
  | 'europe';

export type KeyConcept2020 =
  | 'change'
  | 'continuity'
  | 'causation'
  | 'consequence'
  | 'significance'
  | 'perspectives';

export type SpecifiedConcept2028 =
  | 'cause_and_consequence'
  | 'continuity_and_change'
  | 'perspectives'
  | 'significance';

export type CommandTerm =
  | 'analyse'
  | 'compare'
  | 'compare_and_contrast'
  | 'contrast'
  | 'discuss'
  | 'evaluate'
  | 'examine'
  | 'explain' // 2028 Paper 1 Q1 / Paper 2 Sec B(a)
  | 'to_what_extent';

export interface HistoryQuestionItem {
  id: string;
  curriculumVersion: CurriculumVersion;
  paper: 1 | 2 | 3;
  // Paper 1 metadata
  prescribedSubject?: 1 | 2 | 3 | 4 | 5; // 2020
  focusedStudy?: 1 | 2 | 3 | 4 | 5;      // 2028
  caseStudy?: 1 | 2;
  paper1SubQuestion?: '1a' | '1b' | '2' | '3' | '4' | 'q1_2028' | 'q2_2028' | 'q3_2028';
  // Paper 2 metadata
  worldTopic?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; // 2020
  thematicStudy?: 1 | 2 | 3 | 4;                                  // 2028
  paper2Section2028?: 'A' | 'B_a' | 'B_b';
  // Paper 3 metadata
  hlRegion?: IBRegion;
  hlSection?: number; // 1..18 (2020) or 1..12 (2028)
  // Conceptual & grading metadata
  concept: KeyConcept2020 | SpecifiedConcept2028;
  commandTerm: CommandTerm;
  marks: 2 | 3 | 4 | 6 | 9 | 12 | 15;
  markbandType:
    | 'point_marked'
    | 'p1_q2_opcvl_4m'
    | 'p1_q3_compare_6m'
    | 'p1_q4_9m'
    | 'essay_15m'
    | 'p1_2028_6m'
    | 'p1_2028_12m'
    | 'p2_2028_secA_6m'
    | 'p2_2028_secBa_4m';
  // Validation rules
  requiresTwoRegions: boolean;
  crossRegionalWarLock: boolean; // True for Topics 2, 6, 11 (2020) & Thematic 1 (2028)
  namedActorsInPrompt: string[]; // Must be subset of officially named actors in Guide for P3
  recommendedHistoriographyIds: string[];
  commonMistakeTags: string[];
}
```

### 4.2 Official Glossary of Command Terms & Essay Structure Mapping

| Command Term | Guide Version & AO | Exact Official IB Definition | Structural Execution Blueprint |
| :--- | :--- | :--- | :--- |
| **Analyse** | 2020 (AO2) & 2028 | *"Break down in order to bring out the essential elements or structure."* | Decompose into distinct structural components (political, economic, social, ideological) and explain how each component functions or interacts. |
| **Compare** | 2020 (AO3) | *"Give an account of the similarities between two (or more) items or situations, referring to both (all) of them throughout."* | Point-by-point running thematic similarities; never analyze Item A then Item B in separate halves. |
| **Compare and contrast** | 2020 (AO3) | *"Give an account of similarities and differences between two (or more) items or situations, referring to both (all) of them throughout."* | Both similarities AND differences interwoven thematically across every paragraph (P1 Q3 & P2 essays). |
| **Contrast** | 2020 (AO3) | *"Give an account of the differences between two (or more) items or situations, referring to both (all) of them throughout."* | Point-by-point running thematic differences only; refer to both items continuously. |
| **Discuss** | 2020 (AO3) & 2028 | *"Offer a considered and balanced review that includes a range of arguments, factors or hypotheses. Opinions or conclusions should be presented clearly and supported by appropriate evidence."* | Weigh multiple competing factors or hypotheses (e.g., internal vs external factors; coercion vs consent) leading to a clear judgment. |
| **Evaluate** | 2020 (AO3) | *"Make an appraisal by weighing up the strengths and limitations."* | Explicitly weigh **successes vs failures** or **value vs limitations** (P1 Q2) or **validity vs limits** of a historical claim; avoid one-sided advocacy. |
| **Examine** | 2020 (AO3) & 2028 | *"Consider an argument or concept in a way that uncovers the assumptions and interrelationships of the issue."* | Probe underlying mechanisms, hidden premises, and causal linkages between variables (e.g., how propaganda interacted with economic crisis). |
| **Explain** | 2028 | *"Give a detailed account including reasons or causes."* | Used in 2028 Paper 1 Q1 (6m) and Paper 2 Sec B(a) (4m): clear, specific causal/functional explanation grounded in examples/sources. |
| **To what extent** | 2020 (AO3) & 2028 | *"Consider the merits or otherwise of an argument or concept. Opinions and conclusions should be presented clearly and supported with appropriate evidence and sound argument."* | Explicit **calibrated judgment**: argue *to a large/moderate/limited extent*, proving why the named factor mattered **and** demonstrating where rival factors/conditions constrained or outweighed it. |

### 4.3 Examiner-Report Mistakes Log Taxonomy

Simple Revision's **Mistakes Log** should automatically tag, diagnose, and track these recurring examiner-flagged errors:

| Error Code | Component | Student Failure Pattern | Mark Ceiling Impact | Automated App Remediation |
| :--- | :--- | :--- | :--- | :--- |
| `ERR_NARRATIVE_DRIFT` | P2 / P3 / IA Sec B | Chronological storytelling (*"First X happened, then Y, then Z"*) instead of thematic causal argument. | Capped in **4–6** markband (*"primarily narrative/descriptive"*). | Force outline builder to reject date-ordered body headings (`1933–35`, `1936–39`); require analytical factor headers (`Economic levers`, `Coercive terror`). |
| `ERR_OPCVL_GENERIC` | P1 Q2 / IA Sec A | Clichés: *"primary = reliable"*, *"secondary = unreliable"*, *"biased because author is X"*, *"author might lie"*. | Earns **0–1/4** for that point. | Real-time linter flags `"biased"`, `"primary source"`, `"secondary source"`, `"wasn't there"`, `"might be lying"` and displays targeted rewrite prompt. |
| `ERR_OPCVL_ONE_SIDED` | P1 Q2 | Discusses only Value (or only Limitations), or omits **Content** while analysing Origin & Purpose. | Strictly capped at **2/4** by IB markscheme rule. | Split UI into 2 mandatory boxes (`Value [O/P/C]` & `Limitations [O/P/C]`) with content-quote presence check. |
| `ERR_Q3_END_ON_BLOCK` | P1 Q3 | Writes Paragraph 1 entirely on Source A and Paragraph 2 entirely on Source B without side-by-side linkage; or leaks Origin/Purpose into Q3. | Drops from 5–6 down to **2–3/6**. | Require comparative connector starters (`"Both A and B..."`, `"Unlike A, B..."`); warn if provenance keywords (`origin`, `purpose`, `written in`) appear in Q3 draft. |
| `ERR_Q4_UNBALANCED` | P1 Q4 | Summarizes all 4 sources without own knowledge, OR writes a mini-essay purely from memory ignoring 2–3 sources. | Capped in **4–6/9** (*"little or no attempt to synthesize own knowledge and source material"*). | Source-citation tracker badge (`Sources Cited: 4/4` + `Own Knowledge Check`) inside Q4 editor. |
| `ERR_SAME_REGION_P2` | P2 | Chooses two states from the **same** IB region (e.g., Hitler + Stalin; China + Japan; US + Cuba) on a two-region prompt. | Self-penalizing; essays typically capped at **7–9** (or lower if second region absent). | Region-pair validator immediately blocks same-region selections when `requiresTwoRegions === true`. |
| `ERR_WAR_DOUBLE_COUNT` | P2 (T2/T6/T11) | Uses WWII in Europe AND WWII in the Pacific as "two wars from two different regions". | Violates explicit IB Guide prohibition; counts as only 1 conflict. | Conflict selector prevents picking the same cross-regional war twice across region slots. |
| `ERR_NO_COUNTER_PERSP` | P2 / P3 / IA | One-sided thesis with zero counter-arguments, alternative causal weights, or historiographical evaluation. | Cannot reach **13–15** (*"evaluation of different perspectives integrated effectively"*). | Outline builder requires a `Counter-Argument / Historiography` slot inside every body paragraph before marking outline "Exam-Ready". |
| `ERR_OFF_PROMPT_PREP` | P2 / P3 | Dumping a pre-memorized essay (e.g., full "Rise of Hitler") when prompt asks specifically about *impact of economic policies on women and minorities*. | Stuck in **1–3** or **4–6** (*"minimal focus on the task"*). | Highlight exact question scope (dates, actor, policy domain) and run keyword alignment check against topic sentences. |

---

## 5. Historical Investigation (IA) Sections A, B, C Criteria

### 5.1 Active 2017/2020 IA Specification (25 Marks, 2,200 Words Max)

* **General Rules:**
  * Weighting: **20% HL** / 25% SL (20 recommended teaching hours).
  * **Word Limit:** Strict maximum **2,200 words** (bibliography, in-text/footnote references, and section titles/headings excluded from count; examiners stop reading at word 2,200).
  * **Topic Scope:** Free choice (need not match syllabus; local/national history encouraged); **cannot** be on an event from the **last 10 years**; individual work only; **cannot** duplicate the History Extended Essay.
  * **Draft Policy:** Teacher reads and gives oral/written feedback on **one draft** (must not edit it); next submission is final.

#### Suggested Word & Mark Allocation (2017/2020 Guide)

| Section | Title | Suggested Words | Associated Criterion | Max Marks |
| :---: | :--- | :---: | :--- | :---: |
| **Section 1** | Identification and evaluation of sources | ~500 | **Criterion A** | **6** |
| **Section 2** | Investigation | ~1,300 | **Criterion B** | **15** |
| **Section 3** | Reflection | ~400 | **Criterion C** | **4** |
| **Bibliography** | Bibliography & referencing | Not counted | Mandatory academic integrity (not separately marked) | — |
| **Total** | | **2,200 max** | | **25** |

#### Official IA Criterion Descriptors (2017/2020 Guide)

##### Criterion A: Identification and evaluation of sources (6 Marks)
*Must clearly state the research question (phrased as a question), explain the nature & relevance of **two** selected sources (primary or secondary), and evaluate their value and limitations with explicit reference to **origin, purpose, and content**.*

| Marks | Official IB Level Descriptor |
| :---: | :--- |
| **0** | The work does not reach a standard described by the descriptors below. |
| **1–2** | The question for investigation has been stated. The student has identified and selected appropriate sources, but there is little or no explanation of the relevance of the sources to the investigation. The response describes, but does not analyse or evaluate, two of the sources. |
| **3–4** | An appropriate question for investigation has been stated. The student has identified and selected appropriate sources, and there is some explanation of the relevance of the sources to the investigation. There is some analysis and evaluation of two sources, but reference to their value and limitations is limited. |
| **5–6** | An appropriate question for investigation has been clearly stated. The student has identified and selected appropriate and relevant sources, and there is a clear explanation of the relevance of the sources to the investigation. There is a detailed analysis and evaluation of two sources with explicit discussion of the value and limitations of two of the sources for the investigation, with reference to the origins, purpose and content of the two sources. |

##### Criterion B: Investigation (15 Marks)
*Can be archive/text-based, fieldwork (museum, archaeological site, battlefield, historic building), or local history; must use a range of primary/secondary evidence, analyze multiple perspectives, and argue to a consistent conclusion.*

| Marks | Official IB Level Descriptor |
| :---: | :--- |
| **0** | The work does not reach a standard described by the descriptors below. |
| **1–3** | The investigation lacks clarity and coherence, and is poorly organized. Where there is a recognizable structure there is minimal focus on the task. The response contains little or no critical analysis. It may consist mostly of generalizations and poorly substantiated assertions. Reference is made to evidence from sources, but there is no analysis of that evidence. |
| **4–6** | There is an attempt to organize the investigation but this is only partially successful, and the investigation lacks clarity and coherence. The investigation contains some limited critical analysis but the response is primarily narrative/descriptive in nature, rather than analytical. Evidence from sources is included, but is not integrated into the analysis/argument. |
| **7–9** | The investigation is generally clear and well organized, but there is some repetition or lack of clarity in places. The response moves beyond description to include some analysis or critical commentary, but this is not sustained. There is an attempt to integrate evidence from sources with the analysis/argument. There may be awareness of different perspectives, but these perspectives are not evaluated. |
| **10–12** | The investigation is generally clear and well organized, although there may be some repetition or lack of clarity in places. The investigation contains critical analysis, although this analysis may lack development or clarity. Evidence from a range of sources is used to support the argument. There is awareness and some evaluation of different perspectives. The investigation argues to a reasoned conclusion. |
| **13–15** | The investigation is clear, coherent and effectively organized. The investigation contains well-developed critical analysis that is focused clearly on the stated question. Evidence from a range of sources is used effectively to support the argument. There is evaluation of different perspectives. The investigation argues to a reasoned conclusion that is consistent with the evidence and arguments provided. |

##### Criterion C: Reflection (4 Marks)
*Reflects on what undertaking the investigation highlighted about the **methods used by, and challenges facing, the historian** (direct TOK link). Must be explicitly tied to the student's actual investigation rather than generic textbook philosophy.*

| Marks | Official IB Level Descriptor |
| :---: | :--- |
| **0** | The work does not reach a standard described by the descriptors below. |
| **1–2** | The reflection contains some discussion of what the investigation highlighted to the student about the methods used by the historian. The reflection demonstrates little awareness of the challenges facing the historian and/or the limitations of the methods used by the historian. The connection between the reflection and the rest of the investigation is implied, but is not explicit. |
| **3–4** | The reflection is clearly focused on what the investigation highlighted to the student about the methods used by the historian. The reflection demonstrates clear awareness of challenges facing the historian and/or limitations of the methods used by the historian. There is a clear and explicit connection between the reflection and the rest of the investigation. |

* **Official IB Reflection Prompts (Guide p. 87) to Embed in App IA Coach:**
  1. What methods used by historians did you use in your investigation, and what were their limitations?
  2. How do the challenges facing the historian differ from those facing a scientist or mathematician?
  3. What specific challenges does archive-based history present (missing records, translation, state censorship, access)?
  4. What is the difference between bias and selection?
  5. Should value judgments/moral terms (e.g., "atrocity") be used or avoided?
  6. Who decides what is historically significant, and if proof is difficult, are all versions equally acceptable?

### 5.2 Redesigned 2028 IA Specification (24 Marks, 2,200 Words Max)

When `curriculumVersion === '2028'`, Simple Revision switches the IA Workspace to the **2028 structure**:
* **Major Structural Changes:** **Reflection section eliminated**; **maximum 7 sources** allowed in the bibliography & investigation (more than 7 is self-penalizing); **no 10-year ban** — "contemporary" events (~past 20 years, e.g., post-2008 for 2028) are permitted if analyzed historically (e.g., causes rather than long-term consequences); ancient history (pre-750 CE) also explicitly permitted.

| Section (2028) | Suggested Words | Criterion & Focus | Max Marks | Key 5–6 / 10–12 Top Band Requirements |
| :--- | :---: | :--- | :---: | :--- |
| **1. Historical inquiry question** | ~400 | **Criterion A:** Historical inquiry question | **6** | Clearly states question; full explanation of appropriateness for historical inquiry; **precise and detailed reference to an appropriate historical concept** (specified or student-selected) explaining how it informs the inquiry. |
| **2. Sources and perspectives** | ~400 | **Criterion B:** Sources and perspectives | **6** | Up to **7 sources** (aligned with Section 3); **do not list source-by-source** — organize around perspectives; well-developed explanation of how sources provide **diverse historical perspectives** and help answer the inquiry question. |
| **3. Synthesis and evaluation** | ~1,400 | **Criterion C:** Synthesis and evaluation | **12** | Sustained analysis clearly focused on the inquiry question; evidence synthesized from Sec 2 sources; **targeted evaluation of sources integrated into the work** (no separate OPCVL section); reasoned, consistent judgment. |
| **Total** | **2,200 max** | | **24** | 20% HL / 30% SL; references, headings, and bibliography excluded. |

---

## 6. High-Yield Study Assets Blueprint

### 6.1 Flashcard Taxonomy & Spaced-Repetition Schema

Simple Revision should segment History HL flashcards into **six specialized card decks** rather than generic term/definition pairs:

| Deck Type | Front Prompt Pattern | Back Answer Pattern | Target Exams | High-Yield Example Cards |
| :--- | :--- | :--- | :--- | :--- |
| **1. Dates & Turning Points** | `[Event/Crisis]` → Exact Year/Month + Catalyst | Date + What changed immediately + Causal significance | P1, P2, P3 | *Mukden Incident* → Sept 18, 1931; staged by Kwantung Army officers (Itagaki/Ishiwara), triggers Manchuria occupation & Lytton Commission. |
| **2. Treaties, Laws & Decrees** | `[Treaty/Act/Decree + Year]` | Signatories/Enactors + 3 core provisions + Long-term failure/impact | P1, P2, P3 | *Enabling Act (Mar 23, 1933)* → Passed 444–94 after SA/SS intimidation & KPD ban; allows Hitler's cabinet to decree laws without Reichstag for 4 years. |
| **3. Quantitative Statistics** | `[Policy/Crisis Metric]` | Verified figure + Analytical implication (limits/success) | P2, P3 | *German Unemployment (1929→1932)* → ~1.3M to ~6.0M (~33% workforce); fuels KPD/NSDAP polarization & collapse of Müller's Grand Coalition. |
| **4. Historians & Historiography** | `[Debate] + [Historian / School]` | Anchor text/year + Core thesis + Built-in counter-historian | P2, P3 | *Fischer (1961) vs Clark (2012) vs Mombauer (2013)* → German deliberate war plan vs shared European "sleepwalking" vs critique of relativized agency. |
| **5. Policies & Mechanisms** | `[State/Leader] + [Policy Name]` | Aim + Execution mechanism + Unintended outcome/limits | P2 T10, P3 | *Mao's Great Leap Forward (1958–62)* → Rapid collectivization into People's Communes & backyard steel → inflated grain quotas → 30–45M famine deaths & temporary Mao retreat. |
| **6. OPCVL / Source Profiles** | `[Frequent Source Type: e.g., Private Diplomatic Memo vs Public Speech vs Post-war Memoir]` | Typical Value (O/P) + Typical Limitation (O/P) + Reminder to verify Content | P1 Q2 (2020) / Q2 (2028) | *Khrushchev's Memoirs (1970)* → Value: insider Politburo perspective during retirement; Limitation: retrospective self-justification written without archival records. |

### 6.2 Cheatsheet Architecture (High-Density Comparison Matrices)

Simple Revision's Cheatsheet suite should prioritize **ready-made comparative grids** matching exact Paper 2 and Paper 3 essay pairings:

1. **Authoritarian States Comparison Grid (Paper 2 Topic 10):** Columns: *Hitler (Europe)* | *Stalin (Europe)* | *Mao (Asia)* | *Castro (Americas)* | *Mussolini (Europe)* | *Perón (Americas)*. Rows: *Pre-conditions (war/economy/political weakness)*, *Path to Power (legal vs violent)*, *Elimination of Opposition*, *Propaganda & Cult*, *Economic Policies*, *Women & Minorities*, *Foreign Policy Feedback*, *Limits of Totalitarian Control*, *Historiographical Debate*.
2. **20th-Century Wars Comparison Grid (Paper 2 Topic 11):** Columns: *WWI (Europe)* | *WWII Pacific (Asia)* | *Spanish Civil War (Europe)* | *Chinese Civil War (Asia)* | *Vietnam War (Asia)* | *Algerian War (Africa/ME)*. Rows: *Long/Short Causes*, *War Type*, *Technology & Tactics*, *Home-Front & Women Mobilization*, *Foreign Intervention*, *Peacemaking & Geopolitical Aftermath*.
3. **Cold War Crises & Leaders Grid (Paper 2 Topic 12):** Paired matrix of **2 leaders from different regions** (e.g., *Truman vs Mao*, *Gorbachev vs Reagan*, *Khrushchev vs Castro*) + **2 crises from different regions** (*Berlin Blockade 1948–49* vs *Cuban Missile Crisis 1962*; *Korean War 1950–53* vs *Suez Crisis 1956*; *Prague Spring 1968* vs *Afghanistan 1979*).
4. **Paper 1 Speed Formula Sheet:** Dual-mode 1-pager (`2020 OPCVL Mode` vs `2028 Static 3-Question Mode`) showing minute-by-minute pacing, banned phrases, running-comparison stems, and Q4 synthesis checklist.
5. **Regional Option High-Yield Quick-Sheets (Paper 3):** One-page chronological & thematic capsules for the top-selected modern sections per region (Europe 11–18, Americas 12–18, Asia & Oceania 10–16, Africa & Middle East 11–18).

### 6.3 Socratic & "Teach-Sprout" Debate Prompts

Designed for Simple Revision's active recall / AI sparring mode: the AI adopts an opposing historiographical stance or introduces a counterfactual/second-region test and challenges the student to defend their thesis with named evidence.

1. **Topic 10 / Paper 3 Europe (Nazi Germany — Structuralism vs Intentionalism):**
   * *Prompt:* *"Your thesis claims Hitler had a coherent master plan from 1924 to achieve total totalitarian control. If the Nazi regime was truly monolithic and centrally planned, how do you explain competing overlapping ministries (Four-Year Plan vs Economics Ministry), chaotic Gauleiter rivalries, and Timothy Mason's argument about the 1938–39 economic crisis?"*
2. **Topic 10 / Multi-Region Authoritarianism (Coercion vs Popular Support):**
   * *Prompt:* *"Compare Stalin's USSR and Castro's Cuba: to what extent did authoritarian leaders rely more on coercive terror than genuine popular consent and social reform to maintain power? Defend your weighting using both states."*
3. **Topic 11 / Paper 3 Europe (Origins of WWI — Fischer vs Clark):**
   * *Prompt:* *"Christopher Clark argues Europe's leaders were 'sleepwalkers' in 1914 rather than calculating aggressors. Using Fritz Fischer's evidence and Annika Mombauer's critique, either defend or dismantle the claim that Berlin bears primary responsibility for the July Crisis."*
4. **Topic 12 (Cold War — Origins & Global South):**
   * *Prompt:* *"Suppose an examiner asks whether the Cold War was caused primarily by mutual fear or ideological conflict between 1945 and 1949. How would Herbert Feis, William Appleman Williams, and John Lewis Gaddis answer differently—and how does Odd Arne Westad change the lens if you include Asia or Latin America?"*
5. **Paper 1 PS3 (The Move to Global War — Economic vs Ideological Drivers):**
   * *Prompt:* *"Without the 1929 Great Depression, would Japanese expansion in Manchuria (1931) and Italian/German aggression (1935–39) still have occurred? Separate immediate economic triggers from longer-term ultranationalist/fascist ideological goals."*
6. **Paper 1 PS4 (Rights & Protest — Leadership vs Grassroots):**
   * *Prompt:* *"In both the US Civil Rights Movement (1954–65) and Anti-Apartheid struggle (1948–64), what mattered more for forcing state response: iconic national leaders (MLK, Mandela) or grassroots mass mobilization and economic disruption (bus boycotts, SNCC Freedom Rides, Defiance Campaign, Sharpeville aftermath)?"*
7. **Topic 11 (Cross-Regional War Trap Check):**
   * *Prompt:* *"You've chosen WWII in Europe and WWII in the Pacific to evaluate 'the role of technology in determining the outcome of two 20th-century wars from different regions.' Wait—why will an IB examiner penalize that pairing, and which replacement war from Asia or Africa/ME fixes your essay immediately?"*

---

## 7. Sources & Citations

All structural rules, syllabus bullets, assessment outlines, markbands, and syllabus transition specifications in this document were verified directly against the following official IB publications and reputable secondary curriculum/assessment references:

1. **International Baccalaureate Organization (2015).** *Diploma Programme: History guide — First examinations 2017.* Geneva: IBO. Public mirror accessed via Peda.net (Kuopio Lyseon Lukio): https://peda.net/kuopio/lukiot/lyseonlukio/ib/syllabukset/g3ias/nhgf2:file/download/51af1bc7702354d43e5b75e2c61401f04c227f98/OCC_d_3_histx_gui_1501_1_e.pdf
2. **International Baccalaureate Organization (2018).** *Amendments to the History guide (first examinations 2020).* Geneva: IBO. Public mirror accessed via Colegio CEU Sanchinarro: https://www.colegioceusanchinarro.es/wp-content/uploads/Amendments-history-guide.pdf
3. **International Baccalaureate Organization (February 2026).** *Diploma Programme: History guide — First assessment 2028.* Geneva: IBO. Public mirror accessed via Colegio CEU Sanchinarro: https://www.colegioceusanchinarro.es/wp-content/uploads/history-sanchinarro.pdf
4. **International Baccalaureate Organization.** *History in the DP* & *Subject Briefs / Curriculum Updates (First assessment 2028)*:
   - https://www.ibo.org/programmes/diploma-programme/curriculum/individuals-and-societies/history/
   - https://www.ibo.org/university-admission/latest-curriculum-updates/history-updates/
   - https://www.ibo.org/globalassets/new-structure/programmes/dp/pdfs/dp-history-sb-en.pdf (indexed via web search summaries; direct HTTP retrieval returned 403)
5. **Pearson International Schools (April 2026).** *IB DP History Exam Changes: A Comprehensive Guide to Paper 1, 2, 3 & IA (First assessment 2028)*: https://www.pearson.com/international-schools/international-schools-blog/2026/04/ib-dp-history-exam-changes--a-comprehensive-guide-to-paper-1--2-.html
6. **IBLieve & MyRevisionAgent.** *Syllabus Updates: IB History HL & SL (First Assessment 2028)* & *IB History Curriculum Guides*:
   - https://iblieve.org/syllabus-updates-ib-history-hl-sl-first-assessment-2028/
   - https://myrevisionagent.com/guides/ib-history
7. **Historical Grade Boundaries Reference (May 2024 – November 2025):** https://www.pietromeloni.com/ib-grade-boundaries/history-hl
8. **Historiographical Verification Sources (WWI Fischer–Clark–Mombauer Debate):**
   - Open University Research Online (Annika Mombauer, *The Fischer Controversy, Documents, and the 'Truth' about the Origins of the First World War*): https://oro.open.ac.uk/30620/
   - OpenLearn (The Open University — Origins of WWI Historiography): https://www.open.edu/openlearn/mod/oucontent/view.php?id=142569&section=7
