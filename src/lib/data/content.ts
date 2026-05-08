export interface EMSQuote {
  id: string;
  text: string;
  author: string;
}

export const quotes: EMSQuote[] = [
  { id: 'q1', text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
  { id: 'q2', text: 'Not all heroes wear capes. Some wear uniforms and respond to 911 calls.', author: 'Unknown' },
  { id: 'q3', text: 'Every second counts in emergency medicine. Your knowledge can save a life.', author: 'Unknown' },
  { id: 'q4', text: 'The art of medicine consists of amusing the patient while nature cures the disease.', author: 'Voltaire' },
  { id: 'q5', text: 'In EMS, we do not get to choose our emergencies. But we get to choose how we respond.', author: 'Unknown' },
  { id: 'q6', text: 'Wherever the art of medicine is loved, there is also a love of humanity.', author: 'Hippocrates' },
  { id: 'q7', text: 'Saving one life is like saving the entire world.', author: 'The Talmud' },
  { id: 'q8', text: 'It is not how much we give, but how much love we put into giving.', author: 'Mother Teresa' },
  { id: 'q9', text: 'The purpose of human life is to serve, and to show compassion and the will to help others.', author: 'Albert Schweitzer' },
  { id: 'q10', text: 'Preparation is the key to success. Study hard, train hard, save lives.', author: 'Unknown' },
  { id: 'q11', text: 'First, do no harm. Then, do everything you can.', author: 'Medical Principle' },
  { id: 'q12', text: 'In the middle of difficulty lies opportunity. Every emergency is an opportunity to save a life.', author: 'Albert Einstein (adapted)' },
  { id: 'q13', text: 'The EMS provider who keeps learning is the one who keeps saving lives.', author: 'Unknown' },
  { id: 'q14', text: 'Calm is contagious. Be the calm in the storm.', author: 'EMS Proverb' },
  { id: 'q15', text: 'Your hands are trained to save. Your mind is trained to decide. Your heart is trained to care.', author: 'Unknown' },
  { id: 'q16', text: 'The difference between ordinary and extraordinary is that little extra effort.', author: 'Jimmy Johnson' },
  { id: 'q17', text: 'When you save a life, you save a family. When you save a family, you save a community.', author: 'Unknown' },
  { id: 'q18', text: 'Knowledge is the best tool in your medical bag. Fill it every day.', author: 'Unknown' },
  { id: 'q19', text: 'Under pressure, you do not rise to the occasion. You fall to the level of your training.', author: 'Archilochus' },
  { id: 'q20', text: 'The Star of Life shines brightest in the hands of those who are prepared.', author: 'Unknown' },
  { id: 'q21', text: 'Sa bawat buhay na naliligtas, isang pamilya ang nagagalak.', author: 'EMS Pilipinas' },
  { id: 'q22', text: 'Ang kaalaman sa EMS ay hindi lamang propesyon - ito ay misyon.', author: 'Unknown' },
  { id: 'q23', text: 'Train hard, save lives. That is the EMS way.', author: 'Unknown' },
  { id: 'q24', text: 'Every patient is someone\'s loved one. Treat them as you would want your family treated.', author: 'Unknown' },
  { id: 'q25', text: 'Emergency medicine is not just a job; it is a calling to serve humanity in its most vulnerable moments.', author: 'Unknown' },
  { id: 'q26', text: 'The only limits in EMS are the ones you place on your own learning.', author: 'Unknown' },
  { id: 'q27', text: 'Matutong magligtas ng buhay - ito ang pinakamagandang kasanayan.', author: 'EMS Pilipinas' },
  { id: 'q28', text: 'A well-prepared EMT is a life-saver. A well-prepared student is a future EMT.', author: 'Unknown' },
  { id: 'q29', text: 'In EMS, complacency kills. Stay sharp, stay current, stay ready.', author: 'Unknown' },
  { id: 'q30', text: 'The call comes at any time. Your training must be ready at all times.', author: 'Unknown' },
];

export interface AssessmentScript {
  id: string;
  title: string;
  titleFil?: string;
  category: string;
  description: string;
  descriptionFil?: string;
  lines: { speaker: string; line: string; lineFil?: string; note?: string; noteFil?: string }[];
  tips: string[];
  tipsFil?: string[];
}

export const assessmentScripts: AssessmentScript[] = [
  {
    id: 'as-01', title: 'Self Introduction', titleFil: 'Pagpapakilala', category: 'introduction',
    description: 'How to properly introduce yourself during TESDA assessment.', descriptionFil: 'Paano tamang magpakilala sa TESDA assessment.',
    lines: [
      { speaker: 'Candidate', line: 'Good morning/afternoon, Sir/Ma\'am. I am [Name], applying for Emergency Medical Services NC II certification.', lineFil: 'Magandang umaga/hapon, Sir/Ma\'am. Ako si [Pangalan], nag-a-apply para sa Emergency Medical Services NC II certification.', note: 'Stand straight, maintain eye contact, and speak clearly.', noteFil: 'Tumayo nang tuwid, panatilihin ang eye contact, at magsalita nang malinaw.' },
      { speaker: 'Candidate', line: 'I have completed the required training hours and I am ready to demonstrate my competencies as an EMS provider.', lineFil: 'Nakumpleto ko ang mga kinakailangang oras ng pagsasanay at handa akong ipakita ang aking mga kakayahan bilang EMS provider.' },
      { speaker: 'Candidate', line: 'I am prepared to answer your questions and perform the required practical demonstrations.', lineFil: 'Handa akong sagutin ang inyong mga tanong at gawin ang mga kinakailangang practical na demonstrasyon.' },
    ],
    tips: ['Dress in clean, professional attire', 'Arrive at least 30 minutes early', 'Bring all required documents', 'Maintain confidence and composure'], tipsFil: ['Magdamit ng malinis at propesyonal', 'Pumunta nang hindi bababa sa 30 minuto bago ang schedule', 'Magdala ng lahat ng kinakailangang dokumento', 'Panatilihin ang kumpiyansa at pagkakalma'],
  },
  {
    id: 'as-02', title: 'Scene Safety Verbalization', titleFil: 'Pagbibigay-Boses sa Kaligtasan ng Eksena', category: 'assessment',
    description: 'Standard verbalization for ensuring scene safety during practical assessment.', descriptionFil: 'Standard na pagbibigay-boses para sa pagtiyak sa kaligtasan ng eksena sa practical assessment.',
    lines: [
      { speaker: 'Provider', line: 'I am now approaching the scene. I will assess for scene safety.', lineFil: 'Nalalapit na ako sa eksena. Susuriin ko ang kaligtasan ng eksena.', note: 'Pause and look around before entering.', noteFil: 'Tigil at tingnan ang paligid bago pumasok.' },
      { speaker: 'Provider', line: 'Scene appears safe. No visible hazards. I am donning my PPE - gloves and eye protection.', lineFil: 'Mukhang ligtas ang eksena. Walang nakikitang panganib. Sinusuot ko ang aking PPE - guwantes at proteksyon sa mata.' },
      { speaker: 'Provider', line: 'I am identifying myself to the patient. "Sir/Ma\'am, I am an EMS provider. I am here to help you."', lineFil: 'Kilalala ko ang aking sarili sa pasyente. "Sir/Ma\'am, ako ay isang EMS provider. Nandito ako para tulungan kayo."' },
    ],
    tips: ['Always verbalize your actions during assessment', 'Mention every safety check', 'Don PPE before patient contact', 'Identify yourself to the patient'], tipsFil: ['Laging i-verbalize ang iyong mga aksyon sa assessment', 'Banggitin ang bawat safety check', 'Magsuot ng PPE bago makipag-ugnayan sa pasyente', 'Kilalala ang sarili sa pasyente'],
  },
  {
    id: 'as-03', title: 'Patient Approach and Primary Assessment', titleFil: 'Paglapit sa Pasyente at Primary Assessment', category: 'assessment',
    description: 'Verbalization for patient approach and primary survey.', descriptionFil: 'Pagbibigay-boses sa paglapit sa pasyente at primary survey.',
    lines: [
      { speaker: 'Provider', line: 'I am approaching the patient. I note the patient is conscious and sitting upright. The scene is safe.', lineFil: 'Nalalapit ako sa pasyente. Napapansin ko ang pasyente ay may malay at nakatayo. Ligtas ang eksena.' },
      { speaker: 'Provider', line: 'I am introducing myself. "Hello, I am [Name], an EMS provider. Can you tell me what happened?"', lineFil: 'Nagpapakilala ako. "Kamusta, ako si [Pangalan], isang EMS provider. Maaari mo bang sabihin sa akin ang nangyari?"' },
      { speaker: 'Provider', line: 'Patient responds verbally - AVPU: Alert and oriented. I am now performing the primary assessment.', lineFil: 'Ang pasyente ay tumutugon nang berbal - AVPU: Gising at oryentado. Ginagawa ko na ang primary assessment.' },
      { speaker: 'Provider', line: 'Airway is open and clear. Breathing is adequate at 18 breaths per minute. Circulation is present with strong radial pulse at 88 beats per minute. No life-threatening conditions identified in the primary survey.', lineFil: 'Ang airway ay bukas at malinaw. Ang paghinga ay sapat sa 18 paghinga kada minuto. Ang sirkulasyon ay may malakas na radial pulse sa 88 tibok kada minuto. Walang nakitang nakamamatay na kundisyon sa primary survey.' },
    ],
    tips: ['Introduce yourself before touching the patient', 'Assess AVPU first', 'Systematically check ABCs', 'Verbalize all findings clearly'], tipsFil: ['Magpakilala bago hawakan ang pasyente', 'Suriin muna ang AVPU', 'Sistemang suriin ang ABCs', 'I-verbalize ang lahat ng natuklasan nang malinaw'],
  },
  {
    id: 'as-04', title: 'Radio Communication Report', titleFil: 'Report sa Radio Komunikasyon', category: 'communication',
    description: 'Standard radio report to receiving hospital using SBAR format.', descriptionFil: 'Standard na radio report sa receiving hospital gamit ang SBAR format.',
    lines: [
      { speaker: 'Provider', line: 'Med Base, this is Ambulance 1 with a radio report. Over.', lineFil: 'Med Base, ito ay Ambulance 1 na may radio report. Over.' },
      { speaker: 'Provider', line: 'Situation: We have a 55-year-old male with chest pain that started 20 minutes ago. Over.', lineFil: 'Sitwasyon: May 55-taong-gulang na lalaki na may sakit sa dibdib na nagsimula 20 minuto ang nakalipas. Over.' },
      { speaker: 'Provider', line: 'Background: Patient has a history of hypertension and diabetes. He took one nitroglycerin with no relief. Over.', lineFil: 'Background: Ang pasyente ay may kasaysayan ng hypertension at diabetes. Nag-take siya ng isang nitroglycerin ngunit walang ginhawa. Over.' },
      { speaker: 'Provider', line: 'Assessment: Vital signs are BP 160/100, HR 96, RR 20, SpO2 94%. 12-lead ECG shows ST elevation in leads II, III, aVF. Over.', lineFil: 'Pagtatasa: Ang vital signs ay BP 160/100, HR 96, RR 20, SpO2 94%. Ang 12-lead ECG ay nagpapakita ng ST elevation sa leads II, III, aVF. Over.' },
      { speaker: 'Provider', line: 'Recommendation: Requesting cardiac center activation for possible STEMI. ETA 10 minutes. Over.', lineFil: 'Rekomendasyon: Humihingi ng cardiac center activation para sa posibleng STEMI. ETA 10 minuto. Over.' },
    ],
    tips: ['Use SBAR format for all hospital reports', 'Wait for acknowledgment after each transmission', 'Keep reports concise and focused', 'Use proper radio terminology'], tipsFil: ['Gumamit ng SBAR format para sa lahat ng hospital reports', 'Maghintay ng acknowledgement pagkatapos ng bawat transmission', 'Panatilihin ang mga report na maikli at nakatuon', 'Gumamit ng tamang radio terminolohiya'],
  },
  {
    id: 'as-05', title: 'Patient Handoff Report (SBAR)', titleFil: 'Patient Handoff Report (SBAR)', category: 'communication',
    description: 'SBAR handoff report when transferring patient care at the hospital.', descriptionFil: 'SBAR handoff report sa paglilipat ng pangangalaga sa pasyente sa ospital.',
    lines: [
      { speaker: 'Provider', line: 'SBAR Report: Situation - This is a 55-year-old male, John Doe, with acute coronary syndrome.', lineFil: 'SBAR Report: Sitwasyon - Ito ay isang 55-taong-gulang na lalaki, John Doe, na may acute coronary syndrome.' },
      { speaker: 'Provider', line: 'Background - History of HTN, DM type 2. Onset of chest pain was 45 minutes ago while at rest. Took 1 NTG without relief.', lineFil: 'Background - Kasaysayan ng HTN, DM type 2. Nagsimula ang sakit sa dibdib 45 minuto ang nakalipas habang nagpapahinga. Nag-take ng 1 NTG nang walang ginhawa.' },
      { speaker: 'Provider', line: 'Assessment - Vital signs: BP 150/96, HR 92, RR 18, SpO2 96% on 4L NC. 12-lead shows ST elevation inferior leads. Given ASA 325mg chewed, O2 started.', lineFil: 'Pagtatasa - Vital signs: BP 150/96, HR 92, RR 18, SpO2 96% sa 4L NC. Ang 12-lead ay nagpapakita ng ST elevation sa inferior leads. Binigyan ng ASA 325mg na nginuya, nagsimula ang O2.' },
      { speaker: 'Provider', line: 'Recommendation - Cardiac center activation for STEMI. Patient needs cath lab evaluation. All medications and times documented on PCR.', lineFil: 'Rekomendasyon - Cardiac center activation para sa STEMI. Kailangan ng pasyente ng cath lab evaluation. Lahat ng gamot at oras ay naka-document sa PCR.' },
    ],
    tips: ['Deliver SBAR concisely in under 60 seconds', 'Make eye contact with receiving provider', 'Ensure understanding before leaving', 'Complete all documentation'], tipsFil: ['Ihayag ang SBAR nang maikli sa loob ng 60 segundo', 'Panatilihin ang eye contact sa receiving provider', 'Siguraduhing naiintindihan bago umalis', 'Kumpletuhin ang lahat ng dokumentasyon'],
  },
];

export interface Simulation {
  id: string;
  title: string;
  titleFil?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: { id: string; instruction: string; instructionFil?: string; description: string; descriptionFil?: string; correctAction: string; commonMistakes: string[]; criticalStep: boolean }[];
  equipment: string[];
  equipmentFil?: string[];
  precautions: string[];
  precautionsFil?: string[];
}

export const simulations: Simulation[] = [
  {
    id: 'sim-01', title: 'Adult CPR Procedure', titleFil: 'Prosedura ng Adult CPR', category: 'cpr', difficulty: 'easy',
    steps: [
      { id: 'cpr-s1', instruction: 'Verify scene safety', instructionFil: 'Beripikahin ang kaligtasan ng eksena', description: 'Ensure the scene is safe for you and the patient before approaching.', correctAction: 'Look around for hazards, ensure no danger', commonMistakes: ['Rushing to the patient without checking safety'], criticalStep: true },
      { id: 'cpr-s2', instruction: 'Check responsiveness', instructionFil: 'Suriin ang pagtugon', description: 'Tap the patient shoulders and shout "Are you okay?"', correctAction: 'Tap shoulders firmly, shout loudly near both ears', commonMistakes: ['Gently tapping', 'Not shouting loud enough'], criticalStep: true },
      { id: 'cpr-s3', instruction: 'Call for help and get AED', instructionFil: 'Tumawag ng tulong at kumuha ng AED', description: 'If alone, call for help and get an AED if available. If someone is nearby, direct them to call emergency services and get the AED.', correctAction: 'Direct specific person: "You, call 911 and get the AED!"', commonMistakes: ['Not calling for help', 'Leaving patient without directing others'], criticalStep: true },
      { id: 'cpr-s4', instruction: 'Check breathing and pulse (max 10 seconds)', instructionFil: 'Suriin ang paghinga at pulse (max 10 segundo)', description: 'Look for chest rise and feel for carotid pulse simultaneously for no more than 10 seconds.', correctAction: 'Look at chest, feel carotid pulse for up to 10 seconds only', commonMistakes: ['Checking longer than 10 seconds', 'Checking breathing and pulse separately'], criticalStep: true },
      { id: 'cpr-s5', instruction: 'Begin chest compressions', instructionFil: 'Magsimula ng chest compressions', description: 'Place the heel of one hand on the center of the chest (lower half of sternum), place the other hand on top, interlock fingers. Compress at rate of 100-120/min, depth at least 2 inches.', correctAction: 'Hand placement on lower sternum, 100-120/min, at least 2 inches deep, full chest recoil', commonMistakes: ['Compressions too shallow', 'Rate too slow or too fast', 'Not allowing full chest recoil', 'Hands placed too high or too low'], criticalStep: true },
      { id: 'cpr-s6', instruction: 'Give 2 rescue breaths', instructionFil: 'Magbigay ng 2 rescue breaths', description: 'After 30 compressions, open airway using head-tilt/chin-lift, give 2 breaths at 1 second each, watching for chest rise.', correctAction: 'Head-tilt/chin-lift, 2 breaths at 1 second each, visible chest rise', commonMistakes: ['Breaths too forceful', 'Not watching for chest rise', 'Breaths too long'], criticalStep: false },
      { id: 'cpr-s7', instruction: 'Apply AED when available', instructionFil: 'I-apply ang AED kapag available', description: 'Turn on AED, apply pads as shown in diagrams, follow voice prompts.', correctAction: 'Turn on AED, apply pads to bare chest, follow prompts', commonMistakes: ['Not turning on AED first', 'Placing pads over medication patches', 'Not ensuring dry chest'], criticalStep: true },
      { id: 'cpr-s8', instruction: 'Clear patient and deliver shock if advised', instructionFil: 'I-clear ang pasyente at magbigay ng shock kung advised', description: 'Ensure nobody is touching the patient, then press the shock button when advised by the AED.', correctAction: 'Visually confirm no one touching patient, announce "Clear!", deliver shock', commonMistakes: ['Delivering shock while someone is touching patient', 'Not announcing "Clear!"'], criticalStep: true },
    ],
    equipment: ['CPR manikin', 'AED trainer', 'BVM or pocket mask', 'Protective barrier'], equipmentFil: ['CPR manikin', 'AED trainer', 'BVM o pocket mask', 'Protektibong harang'],
    precautions: ['Ensure safe environment', 'Use proper body mechanics', 'Allow full chest recoil', 'Minimize interruptions'], precautionsFil: ['Siguraduhing ligtas ang kapaligiran', 'Gumamit ng tamang body mechanics', 'Payagan ang full chest recoil', 'Bawasan ang mga pagkakatigil'],
  },
  {
    id: 'sim-02', title: 'AED Operation Procedure', titleFil: 'Prosedura ng Paggamit ng AED', category: 'a', difficulty: 'easy',
    steps: [
      { id: 'aed-s1', instruction: 'Turn on the AED', instructionFil: 'Buksan ang AED', description: 'Press the power button or open the AED case to activate the device. The AED will begin giving voice prompts.', correctAction: 'Press power button/open case immediately', commonMistakes: ['Waiting to turn on the AED', 'Not following voice prompts'], criticalStep: true },
      { id: 'aed-s2', instruction: 'Expose the patient chest', instructionFil: 'Ihayag ang dibdib ng pasyente', description: 'Remove or cut clothing from the patient chest. Wipe the chest dry if wet. Remove medication patches.', correctAction: 'Remove all clothing, dry chest, remove patches', commonMistakes: ['Leaving clothing on the chest', 'Not removing medication patches', 'Not drying a wet chest'], criticalStep: true },
      { id: 'aed-s3', instruction: 'Apply AED pads', instructionFil: 'I-apply ang AED pads', description: 'Apply pads to bare chest: one on upper right chest below collarbone, one on lower left side below armpit. Follow diagrams on the pads.', correctAction: 'Follow pad diagrams, proper placement', commonMistakes: ['Reversing pad placement', 'Placing pads too close together', 'Not following diagrams'], criticalStep: true },
      { id: 'aed-s4', instruction: 'Clear the patient for analysis', instructionFil: 'I-clear ang pasyente para sa analysis', description: 'Stop CPR and ensure no one is touching the patient while the AED analyzes the heart rhythm.', correctAction: 'Announce "Clear!", visually verify no contact', commonMistakes: ['Continuing CPR during analysis', 'Someone touching patient during analysis'], criticalStep: true },
      { id: 'aed-s5', instruction: 'Deliver shock if advised', instructionFil: 'Magbigay ng shock kung advised', description: 'If AED advises a shock, ensure nobody is touching the patient, then press the shock button.', correctAction: 'Verify clear, press shock button', commonMistakes: ['Pressing shock when no shock advised', 'Not ensuring patient is clear'], criticalStep: true },
      { id: 'aed-s6', instruction: 'Resume CPR immediately after shock', instructionFil: 'Ipagpatuloy ang CPR agad pagkatapos ng shock', description: 'After shock delivery, immediately resume chest compressions. Do not check for pulse.', correctAction: 'Resume compressions immediately, 30:2 ratio', commonMistakes: ['Checking pulse after shock', 'Delaying compressions', 'Removing AED pads'], criticalStep: true },
    ],
    equipment: ['AED trainer', 'CPR manikin', 'Training AED pads'], equipmentFil: ['AED trainer', 'CPR manikin', 'Training AED pads'],
    precautions: ['Do not touch patient during analysis or shock', 'Do not use in water', 'Remove metal jewelry near pad sites', 'Do not place pads over medication patches'], precautionsFil: ['Huwag hawakan ang pasyente sa analysis o shock', 'Huwag gamitin sa tubig', 'Alisin ang metal na alahas malapit sa pad sites', 'Huwag ilagay ang pads sa medication patches'],
  },
  {
    id: 'sim-03', title: 'Oxygen Administration Setup', titleFil: 'Setup ng Pagbibigay ng Oksiheno', category: 'oxygen', difficulty: 'medium',
    steps: [
      { id: 'o2-s1', instruction: 'Check oxygen cylinder pressure', instructionFil: 'Suriin ang presyon ng oxygen cylinder', description: 'Verify the cylinder has adequate pressure (full tank = ~2000 psi). Turn the valve briefly to check flow.', correctAction: 'Check pressure gauge, verify adequate supply', commonMistakes: ['Not checking cylinder pressure', 'Using empty cylinder'], criticalStep: true },
      { id: 'o2-s2', instruction: 'Attach regulator to cylinder', instructionFil: 'Ikabit ang regulator sa cylinder', description: 'Securely attach the regulator/flowmeter to the cylinder. Ensure tight connections.', correctAction: 'Attach regulator firmly, check O-ring', commonMistakes: ['Loose connections', 'Missing O-ring'], criticalStep: true },
      { id: 'o2-s3', instruction: 'Select appropriate delivery device', instructionFil: 'Pumili ng naaangkop na kagamitan', description: 'Choose delivery device based on patient needs: nasal cannula (low flow), simple mask (moderate), non-rebreather (high concentration).', correctAction: 'Select device appropriate for patient condition', commonMistakes: ['Using wrong device for patient needs', 'Non-rebreather at too low flow rate'], criticalStep: true },
      { id: 'o2-s4', instruction: 'Set flow rate', instructionFil: 'I-set ang bilis ng daloy', description: 'Nasal cannula: 1-6 L/min, Simple mask: 6-10 L/min, Non-rebreather: 10-15 L/min.', correctAction: 'Set correct flow rate for selected device', commonMistakes: ['Incorrect flow rate', 'Not checking flow before applying to patient'], criticalStep: true },
      { id: 'o2-s5', instruction: 'Apply device to patient', instructionFil: 'I-apply ang kagamitan sa pasyente', description: 'Place the device on the patient, ensure proper fit and comfort. Check that oxygen is flowing before application.', correctAction: 'Verify flow, apply device, check fit', commonMistakes: ['Applying before checking flow', 'Poor fit causing oxygen leak'], criticalStep: false },
      { id: 'o2-s6', instruction: 'Monitor patient response', instructionFil: 'Bantayan ang tugon ng pasyente', description: 'Continuously monitor SpO2, breathing quality, and patient comfort. Adjust as needed.', correctAction: 'Monitor SpO2, reassess vital signs', commonMistakes: ['Not monitoring after application', 'Not adjusting flow based on patient response'], criticalStep: false },
    ],
    equipment: ['Oxygen cylinder with regulator', 'Nasal cannula', 'Simple face mask', 'Non-rebreather mask', 'Pulse oximeter'], equipmentFil: ['Oxygen cylinder may regulator', 'Nasal cannula', 'Simple face mask', 'Non-rebreather mask', 'Pulse oximeter'],
    precautions: ['Store cylinders upright and secured', 'Keep away from heat and flammable materials', 'Check cylinder before each use', 'Never use grease or oil on oxygen equipment'], precautionsFil: ['I-secure ang cylinders nang patayo', 'Ilayo sa init at nasusunog na materyales', 'Suriin ang cylinder bawat gamitin', 'Huwag kailanman gumamit ng grease o oil sa oxygen equipment'],
  },
];

export interface VisualizationItem {
  id: string;
  title: string;
  titleFil?: string;
  category: string;
  description: string;
  descriptionFil?: string;
  labels: { name: string; nameFil?: string; description: string }[];
}

export const visualizations: VisualizationItem[] = [
  { id: 'viz-01', title: 'Star of Life Symbol', titleFil: 'Simbolo ng Star of Life', category: 'general', description: 'The universal emblem of EMS with six points representing the six stages of emergency care.', descriptionFil: 'Ang unibersal na simbolo ng EMS na may anim na puntos na kumakatawan sa anim na yugto ng emergency care.', labels: [
    { name: 'Detection', nameFil: 'Pagkatuklas', description: 'First responders discover the emergency' },
    { name: 'Reporting', nameFil: 'Pag-uulat', description: 'The emergency is reported and help is summoned' },
    { name: 'Response', nameFil: 'Tugon', description: 'EMS units are dispatched and respond to the scene' },
    { name: 'On-Scene Care', nameFil: 'Pangangalaga sa Eksena', description: 'Patient assessment and treatment at the scene' },
    { name: 'Care in Transit', nameFil: 'Pangangalaga sa Transport', description: 'Continued care during ambulance transport' },
    { name: 'Transfer to Definitive Care', nameFil: 'Lipat sa Definitive Care', description: 'Patient handed off to hospital for advanced care' },
  ]},
  { id: 'viz-02', title: 'Human Heart Anatomy', titleFil: 'Anatomiya ng Puso ng Tao', category: 'anatomy', description: 'The four-chambered heart showing blood flow pathway and major structures.', descriptionFil: 'Ang puso na may apat na silid na nagpapakita ng daan ng daloy ng dugo at mga pangunahing istruktura.', labels: [
    { name: 'Right Atrium', nameFil: 'Kanang Atrium', description: 'Receives deoxygenated blood from the body' },
    { name: 'Right Ventricle', nameFil: 'Kanang Ventricle', description: 'Pumps blood to the lungs for oxygenation' },
    { name: 'Left Atrium', nameFil: 'Kaliwang Atrium', description: 'Receives oxygenated blood from the lungs' },
    { name: 'Left Ventricle', nameFil: 'Kaliwang Ventricle', description: 'Pumps oxygenated blood to the body' },
    { name: 'Aorta', nameFil: 'Aorta', description: 'Largest artery, carries blood from left ventricle' },
    { name: 'Pulmonary Artery', nameFil: 'Pulmonary Artery', description: 'Carries deoxygenated blood to lungs' },
  ]},
  { id: 'viz-03', title: 'CPR Hand Placement', titleFil: 'Paglalagay ng Kamay sa CPR', category: 'procedures', description: 'Correct hand placement for adult chest compressions on the lower half of the sternum.', descriptionFil: 'Tamang paglalagay ng kamay para sa adult chest compressions sa ibabang kalahati ng sternum.', labels: [
    { name: 'Heel of Hand', nameFil: 'Takong ng Kamay', description: 'Place the heel of one hand on the lower half of the sternum' },
    { name: 'Interlocked Fingers', nameFil: 'Nakatali na Daliri', description: 'Interlock fingers of both hands, keeping fingers off the chest' },
    { name: 'Sternum', nameFil: 'Sternum', description: 'Compression point is on the lower half of the breastbone' },
    { name: 'Xiphoid Process', nameFil: 'Xiphoid Process', description: 'Do NOT compress on the xiphoid - it can cause liver injury' },
  ]},
  { id: 'viz-04', title: 'AED Pad Placement', titleFil: 'Paglalagay ng AED Pad', category: 'procedures', description: 'Standard AED electrode pad placement for adult patients.', descriptionFil: 'Standard na paglalagay ng AED electrode pad para sa mga adultong pasyente.', labels: [
    { name: 'Upper Right Pad', nameFil: 'Patas na Kanan na Pad', description: 'Place below the right collarbone on the upper right chest' },
    { name: 'Lower Left Pad', nameFil: 'Babang Kaliwa na Pad', description: 'Place on the lower left side, below the armpit' },
    { name: 'Heart Center', nameFil: 'Gitna ng Puso', description: 'Current passes through the heart between the two pads' },
  ]},
  { id: 'viz-05', title: 'Pulse Points', titleFil: 'Mga Pulse Point', category: 'anatomy', description: 'Major pulse points used for assessment in emergency care.', descriptionFil: 'Mga pangunahing pulse point na ginagamit sa pagtatasa sa emergency care.', labels: [
    { name: 'Carotid Pulse', nameFil: 'Carotid Pulse', description: 'Neck - used in CPR pulse check, most reliable in emergency' },
    { name: 'Radial Pulse', nameFil: 'Radial Pulse', description: 'Wrist - used for routine vital signs monitoring' },
    { name: 'Brachial Pulse', nameFil: 'Brachial Pulse', description: 'Upper arm - used for infant CPR' },
    { name: 'Femoral Pulse', nameFil: 'Femoral Pulse', description: 'Groin - used when radial pulse is not palpable' },
    { name: 'Posterior Tibial', nameFil: 'Posterior Tibial', description: 'Ankle - used for lower extremity circulation check' },
    { name: 'Dorsalis Pedis', nameFil: 'Dorsalis Pedis', description: 'Top of foot - used for lower extremity circulation check' },
  ]},
  { id: 'viz-06', title: 'Respiratory System', titleFil: 'Sistema ng Paghinga', category: 'anatomy', description: 'The respiratory system showing the pathway of air from nose to lungs.', descriptionFil: 'Ang sistema ng paghinga na nagpapakita ng daanan ng hangin mula ilong hanggang baga.', labels: [
    { name: 'Nasal Cavity', nameFil: 'Nasal Cavity', description: 'Air enters through the nose, filtered and warmed' },
    { name: 'Pharynx', nameFil: 'Pharynx', description: 'Throat - shared pathway for air and food' },
    { name: 'Larynx', nameFil: 'Larynx', description: 'Voice box - contains vocal cords, protects airway' },
    { name: 'Trachea', nameFil: 'Trachea', description: 'Windpipe - carries air to the bronchi' },
    { name: 'Bronchi', nameFil: 'Bronchi', description: 'Two branches leading to each lung' },
    { name: 'Lungs', nameFil: 'Baga', description: 'Gas exchange occurs in the alveoli' },
    { name: 'Diaphragm', nameFil: 'Diaphragm', description: 'Primary muscle of respiration' },
  ]},
  { id: 'viz-07', title: 'Ambulance Interior Layout', titleFil: 'Layout ng Loob ng Ambulansya', category: 'equipment', description: 'Typical ambulance patient compartment layout with essential equipment.', descriptionFil: 'Karaniwang layout ng patient compartment ng ambulansya na may mahahalagang kagamitan.', labels: [
    { name: 'Main Stretcher', nameFil: 'Pangunahing Stretcher', description: 'Primary patient transport device, locked in mount' },
    { name: 'Oxygen System', nameFil: 'Sistema ng Oksiheno', description: 'Wall-mounted O2 with flowmeter and delivery devices' },
    { name: 'Cardiac Monitor/AED', nameFil: 'Cardiac Monitor/AED', description: 'Mounted for easy access during transport' },
    { name: 'Suction Unit', nameFil: 'Suction Unit', description: 'Portable or mounted for airway clearance' },
    { name: 'Medication Kit', nameFil: 'Medication Kit', description: 'Secured medication storage per protocol' },
    { name: 'BVM and Airway Kit', nameFil: 'BVM at Airway Kit', description: 'Ventilation and airway management supplies' },
  ]},
  { id: 'viz-08', title: 'START Triage Categories', titleFil: 'Kategorya ng START Triage', category: 'procedures', description: 'Color-coded triage categories used in the START system for mass casualty incidents.', descriptionFil: 'Mga kategorya ng triage na may kulay na ginagamit sa START system para sa mass casualty incidents.', labels: [
    { name: 'RED - Immediate', nameFil: 'PULA - Agaran', description: 'Life-threatening, requires immediate treatment' },
    { name: 'YELLOW - Delayed', nameFil: 'DILAW - Naantala', description: 'Serious but can wait for treatment' },
    { name: 'GREEN - Minor', nameFil: 'BERDE - Minor', description: 'Walking wounded, non-urgent' },
    { name: 'BLACK - Expectant/Deceased', nameFil: 'ITIM - Inaasahan/Patay', description: 'Not breathing after airway opening, or injuries incompatible with life' },
  ]},
  { id: 'viz-09', title: 'Bandaging Techniques', titleFil: 'Teknik ng Bandaging', category: 'procedures', description: 'Common bandaging techniques used in EMS for wound management and stabilization.', descriptionFil: 'Karaniwang teknik ng bandaging na ginagamit sa EMS para sa pamamahala ng sugat at stabilisasyon.', labels: [
    { name: 'Pressure Dressing', nameFil: 'Pressure Dressing', description: 'Firm dressing for bleeding control with direct pressure' },
    { name: 'Occlusive Dressing', nameFil: 'Occlusive Dressing', description: 'Seals open chest wound - 3 sides taped for flutter valve' },
    { name: 'Triangular Bandage/Sling', nameFil: 'Triangular Bandage/Sling', description: 'Support for upper extremity injuries' },
    { name: 'Cravat/Swash', nameFil: 'Cravat/Swash', description: 'Secures splints and dressings in place' },
  ]},
  { id: 'viz-10', title: 'Recovery Position', titleFil: 'Recovery Position', category: 'procedures', description: 'The lateral recovery position for unconscious breathing patients.', descriptionFil: 'Ang lateral recovery position para sa mga pasyenteng walang malay ngunit humihinga.', labels: [
    { name: 'Lateral Position', nameFil: 'Lateral na Posisyon', description: 'Patient on their side to maintain airway' },
    { name: 'Hand Support', nameFil: 'Suporta ng Kamay', description: 'Place hand under cheek for support' },
    { name: 'Knee Bend', nameFil: 'Yuko ng Tuhod', description: 'Bend upper knee for stability' },
    { name: 'Head Tilt', nameFil: 'Yuko ng Ulo', description: 'Tilt head back to maintain airway' },
  ]},
];

export const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    'basic-competencies': 'Basic Competencies',
    'common-competencies': 'Common Competencies',
    'core-competencies': 'Core Competencies',
    assessment: 'Assessment Mode',
    'practice-exam': 'Practice Exam',
    scenarios: 'Pre-Hospital Scenarios',
    simulations: 'Procedure Simulations',
    acronyms: 'EMS Acronyms',
    definitions: 'Definition of Terms',
    visualization: 'Visualization Center',
    'assessment-scripts': 'Assessment Day Scripts',
    'study-review': 'Study Review',
    infographic: 'Infographic',
    'audio-reviewer': 'Audio Reviewer',
    bookmarks: 'Bookmarks',
    settings: 'Settings',
    welcome: 'Welcome, EMS Provider!',
    continueStudying: 'Continue Studying',
    quickAccess: 'Quick Access',
    recentActivity: 'Recent Activity',
    offlineReady: 'Offline Ready',
    startAssessment: 'Start Assessment',
    practiceExam: 'Practice Exam',
    selectArea: 'Select Area',
    selectDifficulty: 'Select Difficulty',
    numberOfQuestions: 'Number of Questions',
    timeLimit: 'Time Limit',
    start: 'Start',
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    correct: 'Correct',
    incorrect: 'Incorrect',
    score: 'Score',
    time: 'Time',
    explanation: 'Explanation',
    question: 'Question',
    of: 'of',
    search: 'Search...',
    filter: 'Filter',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    flashcards: 'Flashcards',
    lessons: 'Lessons',
    quiz: 'Quiz',
    keyPoints: 'Key Points',
    darkMode: 'Dark Mode',
    language: 'Language',
    english: 'English',
    filipino: 'Filipino',
    pass: 'PASS',
    fail: 'FAIL',
    yourScore: 'Your Score',
    competencyBreakdown: 'Competency Breakdown',
    retryIncorrect: 'Retry Incorrect',
    reviewAnswers: 'Review Answers',
    takeNewExam: 'Take New Exam',
    startScenario: 'Start Scenario',
    startSimulation: 'Start Simulation',
    category: 'Category',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    all: 'All',
    vitalSigns: 'Vital Signs',
    decisions: 'Decisions',
    step: 'Step',
    equipment: 'Equipment',
    precautions: 'Precautions',
    commonMistakes: 'Common Mistakes',
    searchAcronyms: 'Search acronyms...',
    searchTerms: 'Search terms...',
    noResults: 'No results found',
    viewAll: 'View All',
    progress: 'Progress',
    completed: 'Completed',
    remaining: 'Remaining',
    motivationQuote: 'Daily Motivation',
  },
  fil: {
    home: 'Home',
    'basic-competencies': 'Pangunahing Kakayahan',
    'common-competencies': 'Karaniwang Kakayahan',
    'core-competencies': 'Pangunahing Kompetensya',
    assessment: 'Mode ng Pagsusulit',
    'practice-exam': 'Pagsasanay na Pagsusulit',
    scenarios: 'Mga Senaryo bago Ospital',
    simulations: 'Mga Simulasyon ng Prosedura',
    acronyms: 'Mga Akronim sa EMS',
    definitions: 'Kahulugan ng mga Termino',
    visualization: 'Sentro ng Visualisasyon',
    'assessment-scripts': 'Script sa Araw ng Pagsusulit',
    'study-review': 'Pag-aaral at Pagsusuri',
    infographic: 'Infographic',
    'audio-reviewer': 'Audio Reviewer',
    bookmarks: 'Mga Bookmark',
    settings: 'Mga Setting',
    welcome: 'Maligayang Pagdating, EMS Provider!',
    continueStudying: 'Magpatuloy sa Pag-aaral',
    quickAccess: 'Mabilis na Akses',
    recentActivity: 'Kamakailang Aktibidad',
    offlineReady: 'Handa Offline',
    startAssessment: 'Magsimula ng Pagsusulit',
    practiceExam: 'Pagsasanay na Pagsusulit',
    selectArea: 'Pumili ng Lugar',
    selectDifficulty: 'Pumili ng Hirap',
    numberOfQuestions: 'Bilang ng Tanong',
    timeLimit: 'Limitasyon ng Oras',
    start: 'Magsimula',
    submit: 'Isumite',
    next: 'Susunod',
    previous: 'Nakaraan',
    finish: 'Tapusin',
    correct: 'Tama',
    incorrect: 'Mali',
    score: 'Iskor',
    time: 'Oras',
    explanation: 'Paliwanag',
    question: 'Tanong',
    of: 'ng',
    search: 'Maghanap...',
    filter: 'I-filter',
    bookmark: 'I-bookmark',
    bookmarked: 'Naka-bookmark',
    flashcards: 'Mga Flashcard',
    lessons: 'Mga Aralin',
    quiz: 'Quiz',
    keyPoints: 'Mga Mahalagang Punto',
    darkMode: 'Dark Mode',
    language: 'Wika',
    english: 'English',
    filipino: 'Filipino',
    pass: 'PASADO',
    fail: 'BIGO',
    yourScore: 'Iyong Iskor',
    competencyBreakdown: 'Paghahati-hati ng Kompetensya',
    retryIncorrect: 'Ulitin ang Mali',
    reviewAnswers: 'Suriin ang Sagot',
    takeNewExam: 'Kumuha ng Bagong Pagsusulit',
    startScenario: 'Magsimula ng Senaryo',
    startSimulation: 'Magsimula ng Simulasyon',
    category: 'Kategorya',
    difficulty: 'Hirap',
    easy: 'Madali',
    medium: 'Katamtaman',
    hard: 'Mahirap',
    all: 'Lahat',
    vitalSigns: 'Mga Vital Signs',
    decisions: 'Mga Desisyon',
    step: 'Hakbang',
    equipment: 'Kagamitan',
    precautions: 'Mga Pag-iingat',
    commonMistakes: 'Mga Karaniwang Pagkakamali',
    searchAcronyms: 'Maghanap ng mga akronim...',
    searchTerms: 'Maghanap ng mga termino...',
    noResults: 'Walang nahanap na resulta',
    viewAll: 'Tingnan Lahat',
    progress: 'Progreso',
    completed: 'Nakumpleto',
    remaining: 'Natitira',
    motivationQuote: 'Arawang Motibasyon',
  },
};
