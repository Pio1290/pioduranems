export interface ScenarioNode {
  id: string;
  narration: string;
  narrationFil?: string;
  vitalSigns?: { hr?: number; bp?: string; rr?: number; spo2?: number; temp?: string };
  options: { text: string; textFil?: string; nextNodeId: string; scoreChange: number; feedback: string; feedbackFil?: string }[];
  isEndNode?: boolean;
  endResult?: 'success' | 'partial' | 'failure';
  endFeedback?: string;
  endFeedbackFil?: string;
}

export interface Scenario {
  id: string;
  title: string;
  titleFil?: string;
  description: string;
  descriptionFil?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialNode: string;
  nodes: Record<string, ScenarioNode>;
}

export const scenarios: Scenario[] = [
  {
    id: 'scen-01',
    title: 'Cardiac Arrest at a Mall',
    titleFil: 'Cardiac Arrest sa Mall',
    description: 'You respond to a 55-year-old male who collapsed at a shopping mall. Bystanders are performing CPR when you arrive.',
    descriptionFil: 'Tumutugon ka sa isang 55-taong-gulang na lalaki na nawalan ng malay sa isang mall. Ang mga tagapagsilbi ay gumagawa ng CPR pagdating mo.',
    category: 'cardiac',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You arrive at the mall and find a 55-year-old male unresponsive on the floor. A bystander is doing chest compressions. The patient is not breathing normally.',
        narrationFil: 'Dumating ka sa mall at nakita ang isang 55-taong-gulang na lalaking walang malay sa sahig. Isang bystander ang gumagawa ng chest compressions. Ang pasyente ay hindi normal ang paghinga.',
        vitalSigns: { hr: 0, bp: '0/0', rr: 0, spo2: 0 },
        options: [
          { text: 'Take over CPR immediately and apply AED', textFil: 'Agad na kumuha ng CPR at mag-apply ng AED', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! Immediate high-quality CPR and early defibrillation are the most important interventions for cardiac arrest.', feedbackFil: 'Tama! Ang agarang mataas na kalidad na CPR at maagang defibrillation ang pinakamahalagang interbensyon para sa cardiac arrest.' },
          { text: 'Check for pulse first for 10 seconds', textFil: 'Tingnan muna ang pulse ng 10 segundo', nextNodeId: 'node-2b', scoreChange: -5, feedback: 'Pulse check should not exceed 10 seconds. If the patient is unresponsive and not breathing normally, begin CPR immediately.', feedbackFil: 'Ang pagsuri sa pulse ay hindi dapat lumampas ng 10 segundo. Kung ang pasyente ay walang malay at hindi normal ang paghinga, magsimula ng CPR agad.' },
          { text: 'Ask the bystander to continue while you get equipment', textFil: 'Hilingin sa bystander na magpatuloy habang kumukuha ka ng kagamitan', nextNodeId: 'node-2c', scoreChange: 0, feedback: 'While getting equipment ready, ensure CPR continues. But you should take over and apply the AED as soon as possible.', feedbackFil: 'Habang inihahanda ang kagamitan, siguraduhing nagpapatuloy ang CPR. Ngunit dapat mong kunin at i-apply ang AED sa lalong madaling panahon.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'You take over CPR and apply the AED pads. The AED analyzes and advises "SHOCK ADVISED."',
        options: [
          { text: 'Ensure nobody is touching the patient, then deliver the shock', textFil: 'Siguraduhing walang humahawak sa pasyente, tapos ibigay ang shock', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! Always ensure nobody is touching the patient before delivering a shock. Clear the patient and deliver the shock.', feedbackFil: 'Tama! Laging siguraduhing walang humahawak sa pasyente bago magbigay ng shock.' },
          { text: 'Deliver the shock immediately', textFil: 'Ibigay ang shock agad', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'You must ensure nobody is touching the patient before delivering a shock. Someone could be injured by the electrical current.', feedbackFil: 'Dapat mong siguraduhing walang humahawak sa pasyente bago magbigay ng shock. Maaaring masaktan ang iba sa kuryente.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You spend 10 seconds checking for a pulse. No pulse is found. CPR was interrupted during this time.',
        options: [
          { text: 'Begin CPR immediately and apply AED', textFil: 'Magsimula ng CPR agad at i-apply ang AED', nextNodeId: 'node-2a', scoreChange: 5, feedback: 'Good, resume CPR immediately. Time without compressions reduces survival chances significantly.', feedbackFil: 'Mabuti, ipagpatuloy ang CPR agad. Ang oras nang walang compressions ay nakababawas ng malaki sa tsansa ng kaligtasan.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'The bystander continues CPR while you prepare the AED and BVM. You are now ready to take over.',
        options: [
          { text: 'Take over CPR and apply AED', textFil: 'Kunin ang CPR at i-apply ang AED', nextNodeId: 'node-2a', scoreChange: 5, feedback: 'Good. Taking over with proper equipment is the right approach. Apply the AED now.', feedbackFil: 'Mabuti. Ang pagkuha ng CPR gamit ang tamang kagamitan ay tamang diskarte. I-apply ang AED ngayon.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'You deliver the shock. The AED indicates "Shock delivered." After the shock, you should:',
        options: [
          { text: 'Resume CPR immediately starting with compressions', textFil: 'Ipagpatuloy ang CPR agad na nagsisimula sa compressions', nextNodeId: 'node-4a', scoreChange: 10, feedback: 'Correct! After a shock, resume CPR immediately starting with compressions. Do not check for a pulse unless the patient shows signs of life.', feedbackFil: 'Tama! Pagkatapos ng shock, ipagpatuloy ang CPR agad na nagsisimula sa compressions.' },
          { text: 'Check for pulse and breathing', textFil: 'Suriin ang pulse at paghinga', nextNodeId: 'node-4b', scoreChange: -5, feedback: 'Do not check for pulse immediately after a shock. Resume CPR right away and let the AED re-analyze after 2 minutes of CPR.', feedbackFil: 'Huwag suriin ang pulse agad pagkatapos ng shock. Ipagpatuloy ang CPR kaagad at hayaang mag-re-analyze ang AED pagkatapos ng 2 minutong CPR.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You delivered the shock but a bystander was touching the patient. They received a minor shock but are okay. The AED has delivered the shock.',
        options: [
          { text: 'Resume CPR and ensure nobody touches the patient during next analysis', textFil: 'Ipagpatuloy ang CPR at siguraduhing walang humahawak sa pasyente sa susunod na analysis', nextNodeId: 'node-4a', scoreChange: 0, feedback: 'Resume CPR. Always ensure you clear the patient before any shock delivery in the future.', feedbackFil: 'Ipagpatuloy ang CPR. Laging siguraduhing walang humahawak sa pasyente bago magbigay ng shock.' },
        ],
      },
      'node-4a': {
        id: 'node-4a', narration: 'After 2 minutes of CPR, the AED re-analyzes. "No shock advised." The patient is still unresponsive. You should:',
        options: [
          { text: 'Resume CPR immediately', textFil: 'Ipagpatuloy ang CPR agad', nextNodeId: 'node-5a', scoreChange: 10, feedback: 'Correct! When the AED says no shock advised, resume CPR immediately. Continue for another 2 minutes before re-analyzing.', feedbackFil: 'Tama! Kapag sinabi ng AED na no shock advised, ipagpatuloy ang CPR agad.' },
          { text: 'Check for pulse', textFil: 'Suriin ang pulse', nextNodeId: 'node-5b', scoreChange: 5, feedback: 'You can quickly check for pulse (under 10 seconds), but if no pulse is found, resume CPR immediately.', feedbackFil: 'Maaari mong mabilis suriin ang pulse (mas mababa sa 10 segundo), ngunit kung walang pulse, ipagpatuloy ang CPR agad.' },
        ],
      },
      'node-4b': {
        id: 'node-4b', narration: 'You check for a pulse - none found. You have lost valuable CPR time. The AED re-analyzes and says "No shock advised."',
        options: [
          { text: 'Resume CPR immediately', textFil: 'Ipagpatuloy ang CPR agad', nextNodeId: 'node-5a', scoreChange: 5, feedback: 'Resume CPR now. Minimize interruptions to chest compressions at all times.', feedbackFil: 'Ipagpatuloy ang CPR ngayon. Bawasan ang mga pagkakatigil sa chest compressions.' },
        ],
      },
      'node-5a': {
        id: 'node-5a', narration: 'After another 2 minutes of CPR, you notice the patient is starting to breathe and has a carotid pulse. The AED indicates "No shock advised."',
        options: [
          { text: 'Stop CPR, assess breathing, place in recovery position if breathing adequately, and transport', textFil: 'Ihinto ang CPR, suriin ang paghinga, ilagay sa recovery position kung sapat ang paghinga, at i-transport', nextNodeId: 'node-6', scoreChange: 10, feedback: 'Excellent! The patient has ROSC (Return of Spontaneous Circulation). Monitor closely and transport to the nearest appropriate facility.', feedbackFil: 'Magaling! Ang pasyente ay may ROSC. Bantayan nang mabuti at i-transport sa pinakamalapit na angkop na pasilidad.' },
          { text: 'Continue CPR until arrival at hospital', textFil: 'Ipagpatuloy ang CPR hanggang sa ospital', nextNodeId: 'node-5c', scoreChange: -10, feedback: 'The patient has a pulse and is breathing - stop CPR! Continuing compressions on a beating heart is harmful. Assess and support as needed.', feedbackFil: 'Ang pasyente ay may pulse at humihinga - ihinto ang CPR! Ang pagpapatuloy ng compressions sa tumitibok na puso ay nakakasama.' },
        ],
      },
      'node-5b': {
        id: 'node-5b', narration: 'You find no pulse. You resume CPR. After another 2 minutes, the patient shows signs of life - breathing and pulse present.',
        options: [
          { text: 'Stop CPR, assess and monitor, prepare for transport', textFil: 'Ihinto ang CPR, suriin at bantayan, maghanda sa transport', nextNodeId: 'node-6', scoreChange: 10, feedback: 'Correct! Patient has ROSC. Stop compressions, monitor vitals, and transport.', feedbackFil: 'Tama! Ang pasyente ay may ROSC. Ihinto ang compressions, bantayan ang vitals, at i-transport.' },
        ],
      },
      'node-5c': {
        id: 'node-5c', narration: 'Continuing CPR on a patient with a pulse is harmful. The patient has a return of spontaneous circulation but you are causing unnecessary trauma with compressions.',
        options: [
          { text: 'Stop compressions, assess the patient, and transport', textFil: 'Ihinto ang compressions, suriin ang pasyente, at i-transport', nextNodeId: 'node-6', scoreChange: 0, feedback: 'Finally stopped. Always check for signs of life and stop CPR when ROSC is achieved.', feedbackFil: 'Nahinto rin. Laging suriin ang mga palatandaan ng buhay at ihinto ang CPR kapag na-achieve na ang ROSC.' },
        ],
      },
      'node-6': {
        id: 'node-6', narration: 'The patient is now breathing with a pulse. You have achieved ROSC. You prepare for transport while continuously monitoring the patient.',
        isEndNode: true, endResult: 'success', endFeedback: 'Excellent work! You successfully managed a cardiac arrest scenario with ROSC achieved. Key points: early CPR, early defibrillation, minimize interruptions, and recognize ROSC.', endFeedbackFil: 'Magaling! Matagumpay mong pinamahalaan ang cardiac arrest scenario na may na-achieve na ROSC. Mahahalagang punto: maagang CPR, maagang defibrillation, bawasan ang pagkakatigil, at kilalanin ang ROSC.',
        options: [],
      },
    },
  },
  {
    id: 'scen-02',
    title: 'Vehicular Accident - Multiple Injuries',
    titleFil: 'Aksidente sa Sasakyan - Maraming Pinsala',
    description: 'You respond to a two-vehicle collision. One patient is trapped in a vehicle with visible leg deformity.',
    descriptionFil: 'Tumutugon ka sa banggaan ng dalawang sasakyan. Isang pasyente ang nakatrap sa sasakyan na may kitang deformity sa paa.',
    category: 'trauma',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You arrive at a two-vehicle collision. One car has significant front-end damage. A patient is in the driver seat, conscious but in pain, with a deformed right lower leg. There is a strong smell of gasoline.',
        vitalSigns: { hr: 110, bp: '130/85', rr: 22, spo2: 96 },
        options: [
          { text: 'Ensure scene safety first - check for fire hazard, traffic, and stabilize the vehicle', textFil: 'Siguraduhin ang kaligtasan ng eksena - suriin ang panganib ng sunog, trapiko, at istabilisin ang sasakyan', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! Scene safety is always the first priority. Gasoline smell indicates fire hazard. Ensure the vehicle is stable and no ignition sources nearby.', feedbackFil: 'Tama! Ang kaligtasan ng eksena ay laging unang priyoridad. Ang amoy ng gasolina ay nagpapahiwatig ng panganib ng sunog.' },
          { text: 'Immediately approach the patient and begin assessment', textFil: 'Agad na lumapit sa pasyente at magsimula ng pagtatasa', nextNodeId: 'node-2b', scoreChange: -10, feedback: 'Never approach a patient before ensuring scene safety! The gasoline smell indicates potential fire hazard. Always assess and secure the scene first.', feedbackFil: 'Huwag kailanman lumapit sa pasyente bago masiguro ang kaligtasan ng eksena! Ang amoy ng gasolina ay nagpapahiwatig ng potensyal na panganib ng sunog.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'Scene is secured. Fire department is on standby. Vehicle is stable. You approach the patient who is conscious, complaining of severe right leg pain, and has a deformed right lower leg with an open wound.',
        vitalSigns: { hr: 115, bp: '125/80', rr: 24, spo2: 95 },
        options: [
          { text: 'Perform primary assessment (ABCs) first', textFil: 'Gumawa muna ng primary assessment (ABCs)', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! Always perform the primary assessment first to identify and treat life-threatening conditions before focusing on obvious injuries.', feedbackFil: 'Tama! Laging gumawa muna ng primary assessment para matukoy at magamot ang mga nakamamatay na kundisyon bago tumuon sa mga malalaking pinsala.' },
          { text: 'Focus on the deformed leg and control bleeding', textFil: 'Magtuon sa deformed na paa at kontrolin ang pagdurugo', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'While the leg injury needs attention, you must complete the primary assessment (ABCs) first to rule out life-threatening conditions.', feedbackFil: 'Bagama\'t ang pinsala sa paa ay nangangailangan ng pansin, dapat mong tapusin muna ang primary assessment upang masuri ang mga nakamamatay na kundisyon.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You approach the patient without checking scene safety. Suddenly, a small fire starts under the hood. Fire department quickly extinguishes it, but you were at risk.',
        options: [
          { text: 'Move to a safe distance, let fire department secure the scene, then approach again', textFil: 'Lumayo sa ligtas na distansya, hayaang siguraduhin ng fire department ang eksena, tapos lumapit ulit', nextNodeId: 'node-2a', scoreChange: 5, feedback: 'Good decision to retreat. Always ensure scene safety before patient contact.', feedbackFil: 'Magandang desisyon na umatras. Laging siguraduhin ang kaligtasan ng eksena bago makipag-ugnayan sa pasyente.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'Primary assessment: Airway is open, breathing is rapid but adequate, circulation is present with strong radial pulse. You note the open leg fracture with moderate bleeding.',
        vitalSigns: { hr: 118, bp: '120/78', rr: 24, spo2: 95 },
        options: [
          { text: 'Apply direct pressure to the bleeding, immobilize the fracture, apply cervical collar due to MOI, and prepare for extrication', textFil: 'Mag-apply ng direktang presyon sa pagdurugo, imobilisa ang fracture, mag-apply ng cervical collar dahil sa MOI, at maghanda sa extrication', nextNodeId: 'node-4a', scoreChange: 10, feedback: 'Correct! Control bleeding, immobilize the fracture, and apply cervical collar due to the mechanism of injury. Then prepare for safe extrication.', feedbackFil: 'Tama! Kontrolin ang pagdurugo, imobilisa ang fracture, at mag-apply ng cervical collar dahil sa mekanismo ng pinsala. Tapos maghanda para sa ligtas na extrication.' },
          { text: 'Splint the leg and immediately pull the patient from the vehicle', textFil: 'I-splint ang paa at agad hilahin ang pasyente mula sa sasakyan', nextNodeId: 'node-4b', scoreChange: -10, feedback: 'Never rapidly pull a trauma patient from a vehicle unless there is immediate danger. This could worsen spinal injuries. Apply cervical collar first and perform controlled extrication.', feedbackFil: 'Huwag kailanman hilahin ang trauma patient mula sa sasakyan maliban kung may agarang panganib. Maaari itong palalain ang spinal injuries.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You focused on the leg first. While treating it, you notice the patient is becoming increasingly short of breath. You should have done a primary assessment first.',
        options: [
          { text: 'Perform primary assessment immediately', textFil: 'Gumawa ng primary assessment agad', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Yes, complete the primary assessment. The increasing shortness of breath could indicate a more serious condition.', feedbackFil: 'Oo, tapusin ang primary assessment. Ang pagtaas ng hirap sa paghinga ay maaaring magpahiwatig ng mas seryosong kundisyon.' },
        ],
      },
      'node-4a': {
        id: 'node-4a', narration: 'You have controlled the bleeding, applied a cervical collar, and splinted the leg. The fire department is performing extrication. The patient vital signs are being monitored during the process.',
        vitalSigns: { hr: 108, bp: '122/80', rr: 20, spo2: 96 },
        options: [
          { text: 'Monitor vitals continuously, maintain spinal precautions during extrication, and prepare for transport to a trauma center', textFil: 'Bantayan ang vitals nang patuloy, panatilihin ang spinal precautions sa extrication, at maghanda sa transport sa trauma center', nextNodeId: 'node-5', scoreChange: 10, feedback: 'Excellent! Continuous monitoring, spinal precautions, and transport to appropriate facility are all correct actions for this multi-trauma patient.', feedbackFil: 'Magaling! Ang tuloy-tuloy na pagmamasid, spinal precautions, at transport sa angkop na pasilidad ay lahat tamang aksyon para sa multi-trauma patient.' },
          { text: 'Wait for complete extrication before doing any further assessment', textFil: 'Maghintay ng kumpletong extrication bago gumawa ng karagdagang pagtatasa', nextNodeId: 'node-4c', scoreChange: -5, feedback: 'Do not wait to continue assessment and care. Monitor the patient continuously during the extrication process.', feedbackFil: 'Huwag maghintay upang ipagpatuloy ang pagtatasa at pangangalaga. Bantayan ang pasyente nang tuluy-tuloy sa proseso ng extrication.' },
        ],
      },
      'node-4b': {
        id: 'node-4b', narration: 'You pulled the patient out rapidly without cervical collar. The patient complains of neck pain. You may have worsened a potential spinal injury.',
        options: [
          { text: 'Apply cervical collar immediately, maintain manual in-line stabilization, and assess the patient', textFil: 'Mag-apply ng cervical collar agad, panatilihin ang manual in-line stabilization, at suriin ang pasyente', nextNodeId: 'node-5', scoreChange: 0, feedback: 'This should have been done before moving the patient. Apply cervical collar now and provide appropriate care.', feedbackFil: 'Ito ay dapat ginawa bago galawin ang pasyente. I-apply ang cervical collar ngayon at magbigay ng naaangkop na pangangalaga.' },
        ],
      },
      'node-4c': {
        id: 'node-4c', narration: 'While waiting, the patient blood pressure drops to 100/70. You should have been monitoring continuously.',
        options: [
          { text: 'Begin immediate assessment and treat for shock, elevate legs, high-flow oxygen', textFil: 'Magsimula ng agarang pagtatasa at gamutin ang shock, itaas ang paa, high-flow oxygen', nextNodeId: 'node-5', scoreChange: 0, feedback: 'The dropping BP may indicate internal bleeding. Treat for shock and expedite transport to a trauma center.', feedbackFil: 'Ang bumabagsak na BP ay maaaring magpahiwatig ng panloob na pagdurugo. Gamutin ang shock at padaliin ang transport sa trauma center.' },
        ],
      },
      'node-5': {
        id: 'node-5', narration: 'The patient is extricated safely and loaded onto the ambulance. You are en route to the trauma center with ongoing monitoring and care.',
        isEndNode: true, endResult: 'success', endFeedback: 'Well done! Key learning: Scene safety first, primary assessment before focusing on obvious injuries, cervical collar for significant MOI, and continuous monitoring during extrication and transport.', endFeedbackFil: 'Magaling! Mahahalagang aral: Kaligtasan ng eksena muna, primary assessment bago tumuon sa mga malalaking pinsala, cervical collar para sa mahalagang MOI, at tuluy-tuloy na pagbabantay sa extrication at transport.',
        options: [],
      },
    },
  },
  {
    id: 'scen-03',
    title: 'Stroke Emergency',
    titleFil: 'Stroke Emergency',
    description: 'A 68-year-old female is found by family with sudden facial drooping and inability to speak clearly.',
    descriptionFil: 'Isang 68-taong-gulang na babae ay natagpuan ng pamilya na may biglaang pagca-caught ng mukha at hindi makapagsalita nang malinaw.',
    category: 'medical',
    difficulty: 'easy',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You arrive at a residence. A 68-year-old female is sitting in a chair. Family reports she was fine 30 minutes ago but suddenly developed facial drooping on the left side and cannot speak clearly. She appears confused.',
        vitalSigns: { hr: 88, bp: '178/100', rr: 18, spo2: 97 },
        options: [
          { text: 'Perform a rapid assessment using the FAST mnemonic', textFil: 'Gumawa ng mabilis na pagtatasa gamit ang FAST mnemonic', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! FAST assessment is crucial for stroke: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.', feedbackFil: 'Tama! Ang FAST assessment ay mahalaga para sa stroke: Pagca-caught ng mukha, Mahinang kamay, Hirap sa pagsasalita, Oras na tumawag ng emergency.' },
          { text: 'Take a full medical history first', textFil: 'Kunin muna ang buong medikal na kasaysayan', nextNodeId: 'node-2b', scoreChange: -5, feedback: 'Time is brain! While history is important, rapid stroke assessment takes priority. You can obtain history concurrently or during transport.', feedbackFil: 'Oras ang utak! Bagama\'t mahalaga ang kasaysayan, ang mabilis na stroke assessment ay mas priyoridad.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'FAST assessment confirms: Left facial drooping, left arm drift (weakness), slurred speech. The time of symptom onset was approximately 30 minutes ago. You suspect an ischemic stroke.',
        vitalSigns: { hr: 90, bp: '180/102', rr: 18, spo2: 97 },
        options: [
          { text: 'Note the time of onset, expedite transport to a stroke center, and notify the hospital', textFil: 'Tandaan ang oras ng simula, padaliin ang transport sa stroke center, at i-notify ang ospital', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! Time of onset is critical for thrombolytic therapy eligibility. Rapid transport to a stroke-capable facility is essential.', feedbackFil: 'Tama! Ang oras ng simula ay kritikal para sa thrombolytic therapy. Mabilis na transport sa stroke-capable na pasilidad ay mahalaga.' },
          { text: 'Administer aspirin immediately', textFil: 'Magbigay ng aspirin agad', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'Do NOT give aspirin before ruling out hemorrhagic stroke. A CT scan is needed to differentiate ischemic from hemorrhagic stroke first.', feedbackFil: 'Huwag magbigay ng aspirin bang ma-suri kung hemorrhagic stroke. Kailangan muna ng CT scan para ma-differentiate.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You take a detailed medical history while the stroke window is ticking. 15 minutes have passed. You should have done a rapid FAST assessment first.',
        options: [
          { text: 'Perform FAST assessment now and expedite transport', textFil: 'Gumawa ng FAST assessment ngayon at padaliin ang transport', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Better late than never, but time is critical in stroke. Always perform rapid assessment first.', feedbackFil: 'Huli man at masama, ang oras ay kritikal sa stroke. Laging gumawa muna ng mabilis na pagtatasa.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'You note the onset time (30 minutes ago), begin transport to the nearest stroke center, and notify the hospital. During transport, the patient vital signs are being monitored.',
        vitalSigns: { hr: 88, bp: '176/98', rr: 18, spo2: 97 },
        options: [
          { text: 'Monitor vitals, keep patient comfortable, maintain airway, and continue to stroke center', textFil: 'Bantayan ang vitals, panatilihin ang komportable ang pasyente, panatilihin ang airway, at ipagpatuloy sa stroke center', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! During stroke transport: monitor vitals, support ABCs, keep the patient calm, and ensure rapid transport to a stroke-capable facility.', feedbackFil: 'Tama! Sa stroke transport: bantayan ang vitals, suportahan ang ABCs, panatilihin ang kalmado ang pasyente, at siguraduhin ang mabilis na transport.' },
          { text: 'Try to lower the blood pressure with medications', textFil: 'Subukan na ibaba ang blood pressure gamit ang gamot', nextNodeId: 'node-3c', scoreChange: -10, feedback: 'Do NOT lower blood pressure in acute stroke unless directed by medical control. The elevated BP may be a compensatory mechanism to maintain brain perfusion.', feedbackFil: 'Huwag ibaba ang blood pressure sa acute stroke maliban kung iniutos ng medical control. Ang mataas na BP ay maaaring compensatory mechanism.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'If this were a hemorrhagic stroke, aspirin could worsen the bleeding. A CT scan is needed first to determine stroke type. You should transport without giving aspirin.',
        options: [
          { text: 'Transport to stroke center without giving aspirin, notify hospital for CT scan', textFil: 'I-transport sa stroke center nang hindi nagbibigay ng aspirin, i-notify ang ospital para sa CT scan', nextNodeId: 'node-4', scoreChange: 5, feedback: 'Correct decision. Let the hospital determine stroke type with a CT scan before administering any anticoagulants.', feedbackFil: 'Tamang desisyon. Hayaan ang ospital na matukoy ang uri ng stroke gamit ang CT scan bago magbigay ng anticoagulants.' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'Lowering the blood pressure in acute stroke can reduce brain perfusion and worsen the stroke. The elevated BP may be the body attempt to maintain blood flow to the ischemic brain tissue.',
        options: [
          { text: 'Stop BP medication, continue transport and monitoring', textFil: 'Ihinto ang gamot sa BP, ipagpatuloy ang transport at pagmamasid', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Good. Do not lower BP in acute stroke unless directed by medical control and the BP is extremely high.', feedbackFil: 'Mabuti. Huwag ibaba ang BP sa acute stroke maliban kung iniutos ng medical control at sobrang taas ng BP.' },
        ],
      },
      'node-4': {
        id: 'node-4', narration: 'You arrive at the stroke center. The patient is taken for immediate CT scan. You have provided a complete report including the critical time of onset.',
        isEndNode: true, endResult: 'success', endFeedback: 'Great job! Key learning: FAST assessment, document time of onset, rapid transport to stroke center, do not give aspirin before CT, and do not lower BP unless directed. Time is brain!', endFeedbackFil: 'Magaling! Mahahalagang aral: FAST assessment, i-document ang oras ng simula, mabilis na transport sa stroke center, huwag magbigay ng aspirin bago ang CT, at huwag ibaba ang BP maliban kung iniutos. Oras ang utak!',
        options: [],
      },
    },
  },
];
