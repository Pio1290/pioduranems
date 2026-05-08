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
  {
    id: 'scen-04',
    title: 'Choking Emergency at a Restaurant',
    titleFil: 'Emergency sa Pagsakal sa Restoran',
    description: 'A restaurant patron is choking on food. The scenario progresses from conscious choking to unconsciousness requiring CPR transition.',
    descriptionFil: 'Isang customer sa restoran ay nagsasakal sa pagkain. Ang senaryo ay umuunlad mula sa may malay na nagsasakal hanggang sa walang malay na nangangailangan ng CPR.',
    category: 'respiratory',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You are off-duty eating at a restaurant when you hear someone coughing violently at a nearby table. A 45-year-old male is clutching his throat. His wife says he was eating steak and suddenly started choking.',
        narrationFil: 'Nasa off-duty ka at kumakain sa restoran nang marinig mo ang isang taong ubo nang ubo sa kabilang mesa. Isang 45-taong-gulang na lalaki ang nakahawak sa kanyang leeg. Sinabi ng kanyang asawa na kumakain siya ng steak at biglang nagsakal.',
        vitalSigns: { hr: 110, bp: '140/90', rr: 28, spo2: 88 },
        options: [
          { text: 'Ask the patient "Are you choking? Can you speak?"', textFil: 'Tanungin ang pasyente "Nagsasakal ka ba? Makakapagsalita ka ba?"', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! Determining if the patient can speak helps differentiate between mild and severe airway obstruction. Inability to speak indicates severe obstruction.', feedbackFil: 'Tama! Ang pagtukoy kung makakapagsalita ang pasyente ay nakakatulungang paghiwalayin ang mild at severe airway obstruction. Ang hindi makapagsalita ay nagpapahiwatig ng severe obstruction.' },
          { text: 'Immediately start back blows', textFil: 'Agad na magsimula ng back blows', nextNodeId: 'node-2b', scoreChange: -5, feedback: 'Do not intervene immediately if the patient is coughing effectively. First determine the severity of the obstruction. If the patient can cough forcefully, encourage them to keep coughing.', feedbackFil: 'Huwag agad makialam kung epektibong umuubo ang pasyente. Tukuyin muna ang kalubhaan ng obstruction. Kung marahas na umuubo ang pasyente, hikayatin silang ipagpatuloy ang pag-ubo.' },
          { text: 'Call 911 first before doing anything', textFil: 'Tumawag ng 911 muna bago gumawa ng kahit ano', nextNodeId: 'node-2c', scoreChange: 0, feedback: 'While calling for help is important, you must first assess the patient. If the patient has a severe obstruction and is conscious, begin interventions immediately and have someone else call 911.', feedbackFil: 'Bagama\'t mahalaga ang pagtawag ng tulong, dapat munang suriin ang pasyente. Kung may severe obstruction at may malay ang pasyente, magsimula ng interbensyon agad at papatawag ng 911 sa iba.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'The patient cannot speak, nodding frantically, and is making high-pitched sounds while trying to breathe. He has severe airway obstruction. His face is turning red and he is becoming distressed.',
        narrationFil: 'Hindi makapagsalita ang pasyente, kinakawayan ang ulo, at nagiging mataas ang tunog ng paghinga. May severe airway obstruction siya. Ang mukha niya ay namumula at nagiging(distressed) siya.',
        vitalSigns: { hr: 120, bp: '150/95', rr: 32, spo2: 82 },
        options: [
          { text: 'Perform abdominal thrusts (Heimlich maneuver) - stand behind, make fist above navel, thrust inward and upward', textFil: 'Gumawa ng abdominal thrusts (Heimlich maneuver) - tumayo sa likod, gumawa ng kamao sa itaas ng pusod, itulak papaloob at paitaas', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! For conscious adults with severe airway obstruction, perform abdominal thrusts (Heimlich maneuver). Stand behind, place fist just above the navel, grasp with other hand, and deliver inward-upward thrusts.', feedbackFil: 'Tama! Para sa may malay na adulto na may severe airway obstruction, gumawa ng abdominal thrusts (Heimlich maneuver). Tumayo sa likod, ilagay ang kamao sa itaas ng pusod, hawakan ng ibang kamay, at itulak papaloob at paitaas.' },
          { text: 'Perform back blows first, then abdominal thrusts', textFil: 'Gumawa muna ng back blows, tapos abdominal thrusts', nextNodeId: 'node-3b', scoreChange: 5, feedback: 'While some protocols alternate between back blows and abdominal thrusts (particularly AHA/Red Cross), the key is to act immediately for severe obstruction. Either approach is acceptable.', feedbackFil: 'Bagama\'t ang ilang protokol ay nagpapalit ng back blows at abdominal thrusts, ang mahalaga ay kumilos agad para sa severe obstruction. Ang alinmang diskarte ay katanggap-tanggap.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You start giving back blows immediately without assessing the severity. The patient was actually coughing effectively at first, but your back blows startled him and now he cannot cough. The obstruction appears worse.',
        narrationFil: 'Nagsimula ka ng back blows nang hindi sinuri ang kalubhaan. Epektibong umuubo pa ang pasyente noong una, ngunit nanggulat siya sa back blows at hindi na makaubo. Parang lalong lumala ang obstruction.',
        options: [
          { text: 'Assess the patient and begin abdominal thrusts for severe obstruction', textFil: 'Suriin ang pasyente at magsimula ng abdominal thrusts para sa severe obstruction', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Now that the obstruction is severe, begin abdominal thrusts. Always assess first before intervening.', feedbackFil: 'Ngayong severe na ang obstruction, magsimula ng abdominal thrusts. Laging suriin muna bago makialam.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'You call 911. While on the phone, the patient condition worsens. He is now clutching his throat and cannot make any sound. This is a severe airway obstruction that needs immediate intervention.',
        narrationFil: 'Tinawagan mo ang 911. Habang nasa telepono, lumalala ang kondisyon ng pasyente. Hawak-hawak niya ang leeg niya at hindi makagawa ng kahit anong tunog. Ito ay severe airway obstruction na nangangailangan ng agarang interbensyon.',
        options: [
          { text: 'Tell the dispatcher the situation and begin abdominal thrusts immediately', textFil: 'Sabihin sa dispatcher ang sitwasyon at magsimula ng abdominal thrusts agad', nextNodeId: 'node-3a', scoreChange: 5, feedback: 'Correct. Place the phone on speaker, inform dispatch, and begin abdominal thrusts. Do not wait for EMS arrival for a conscious severe choking patient.', feedbackFil: 'Tama. Ilagay ang telepono sa speaker, i-inform ang dispatch, at magsimula ng abdominal thrusts. Huwag maghintay ng EMS para sa may malay na severe choking patient.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'After 3 abdominal thrusts, the food is still lodged. You continue with more thrusts. After the 5th thrust, the patient becomes limp and unresponsive. He slides to the floor.',
        narrationFil: 'Pagkatapos ng 3 abdominal thrusts, nakabaril pa rin ang pagkain. Nagpatuloy ka ng higit pang thrusts. Pagkatapos ng ika-5 thrust, nawalan ng malay ang pasyente. Nahulog siya sa sahig.',
        vitalSigns: { hr: 0, bp: '0/0', rr: 0, spo2: 0 },
        options: [
          { text: 'Lower the patient to the floor, call for help, begin CPR starting with compressions, and look in the mouth before giving breaths', textFil: 'Ibaba ang pasyente sa sahig, tumawag ng tulong, magsimula ng CPR na nagsisimula sa compressions, at tingnan sa bibig bago magbigay ng breaths', nextNodeId: 'node-4a', scoreChange: 10, feedback: 'Correct! When a choking patient becomes unresponsive: lower to floor, call for help, begin CPR with compressions. Before giving breaths, look in the mouth and remove any visible object with a finger sweep.', feedbackFil: 'Tama! Kapag nawalan ng malay ang nagsasakal na pasyente: ibaba sa sahig, tumawag ng tulong, magsimula ng CPR na may compressions. Bago magbigay ng breaths, tingnan sa bibig at alisin ang nakikitang bagay gamit ang finger sweep.' },
          { text: 'Attempt to pull the food out of the mouth first before starting CPR', textFil: 'Subukang bunutin ang pagkain muna sa bibig bago magsimula ng CPR', nextNodeId: 'node-4b', scoreChange: -5, feedback: 'Do not perform blind finger sweeps. Start CPR immediately. Only perform a finger sweep if you can see the object in the mouth. Compressions may help dislodge the obstruction.', feedbackFil: 'Huwag gumawa ng blind finger sweep. Magsimula ng CPR agad. Gumawa lamang ng finger sweep kung nakikita mo ang bagay sa bibig. Ang compressions ay maaaring makatulong na maalis ang obstruction.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You give 5 back blows between the shoulder blades. The patient is still choking. You then give abdominal thrusts. After several cycles, the patient becomes unresponsive and collapses.',
        narrationFil: 'Nagbigay ka ng 5 back blows sa pagitan ng balikat. Nagsasakal pa rin ang pasyente. Nagbigay ka ng abdominal thrusts. Pagkatapos ng ilang cycle, nawalan ng malay ang pasyente at nahulog.',
        vitalSigns: { hr: 0, bp: '0/0', rr: 0, spo2: 0 },
        options: [
          { text: 'Lower the patient to the floor, call for help, and begin CPR', textFil: 'Ibaba ang pasyente sa sahig, tumawag ng tulong, at magsimula ng CPR', nextNodeId: 'node-4a', scoreChange: 10, feedback: 'Correct! When the patient becomes unresponsive, immediately begin CPR. Chest compressions may help dislodge the obstruction.', feedbackFil: 'Tama! Kapag nawalan ng malay ang pasyente, magsimula ng CPR agad. Ang chest compressions ay maaaring makatulong na maalis ang obstruction.' },
        ],
      },
      'node-4a': {
        id: 'node-4a', narration: 'You begin CPR. After the first cycle of 30 compressions, you open the airway and see a piece of steak at the back of the throat. You remove it with a finger sweep.',
        narrationFil: 'Nagsimula ka ng CPR. Pagkatapos ng unang cycle ng 30 compressions, binuksan mo ang airway at nakita ang piraso ng steak sa likod ng lalamunan. Inalis mo ito gamit ang finger sweep.',
        vitalSigns: { hr: 0, bp: '0/0', rr: 0, spo2: 0 },
        options: [
          { text: 'Attempt 2 rescue breaths, if chest does not rise, reposition and try again, then continue CPR', textFil: 'Subukang magbigay ng 2 rescue breaths, kung hindi tumataas ang dibdib, reposition at subukan ulit, tapos ipagpatuloy ang CPR', nextNodeId: 'node-5a', scoreChange: 10, feedback: 'Correct! After removing the visible object, attempt ventilation. If the chest does not rise, reposition the airway and try again. If still no rise, resume compressions - there may be another obstruction.', feedbackFil: 'Tama! Pagkatapos alisin ang nakikitang bagay, subukang mag-ventilate. Kung hindi tumataas ang dibdib, reposition ang airway at subukan ulit. Kung hindi pa rin, ipagpatuloy ang compressions - maaari pang may ibang obstruction.' },
          { text: 'The object is removed, so check for pulse and breathing before continuing CPR', textFil: 'Naalis na ang bagay, suriin ang pulse at paghinga bago ipagpatuloy ang CPR', nextNodeId: 'node-5b', scoreChange: 5, feedback: 'You can check for pulse and breathing quickly (under 10 seconds). If no pulse or breathing, resume CPR immediately.', feedbackFil: 'Maaari mong suriin ang pulse at paghinga nang mabilis (mas mababa sa 10 segundo). Kung walang pulse o paghinga, ipagpatuloy ang CPR agad.' },
        ],
      },
      'node-4b': {
        id: 'node-4b', narration: 'You try to pull the food out blindly but cannot reach it. You have wasted valuable time. The patient remains unresponsive with no breathing or pulse.',
        narrationFil: 'Sinubukan mong bunutin ang pagkain nang bulag ngunit hindi mo maabot. Nasayang ang mahalagang oras. Walang malay ang pasyente at walang paghinga o pulse.',
        options: [
          { text: 'Begin CPR immediately and look in the mouth before giving breaths', textFil: 'Magsimula ng CPR agad at tingnan sa bibig bago magbigay ng breaths', nextNodeId: 'node-4a', scoreChange: 0, feedback: 'Start CPR now. Never perform blind finger sweeps - only remove visible objects. Compressions may help dislodge the obstruction.', feedbackFil: 'Magsimula ng CPR ngayon. Huwag kailanman gumawa ng blind finger sweep - alisin lamang ang nakikitang bagay. Ang compressions ay maaaring makatulong na maalis ang obstruction.' },
        ],
      },
      'node-5a': {
        id: 'node-5a', narration: 'After 2 cycles of CPR, the airway is clear. Rescue breaths are now effective with visible chest rise. You check for a pulse and find a carotid pulse. The patient begins to gasp.',
        narrationFil: 'Pagkatapos ng 2 cycle ng CPR, malinaw na ang airway. Epektibo na ang rescue breaths na may nakikitang pagtaas ng dibdib. Siniuri mo ang pulse at nakahanap ng carotid pulse. Nagsimulang huminghing ang pasyente.',
        vitalSigns: { hr: 68, bp: '90/60', rr: 8, spo2: 85 },
        options: [
          { text: 'Stop compressions, place in recovery position, provide supplemental oxygen, and monitor until EMS arrives', textFil: 'Ihinto ang compressions, ilagay sa recovery position, magbigay ng supplemental oxygen, at bantayan hanggang dumating ang EMS', nextNodeId: 'node-6', scoreChange: 10, feedback: 'Correct! The patient has ROSC with a pulse and is breathing. Place in recovery position to maintain airway, provide oxygen, and monitor closely.', feedbackFil: 'Tama! Ang pasyente ay may ROSC na may pulse at humihinga. Ilagay sa recovery position para panatilihin ang airway, magbigay ng oxygen, at bantayan nang mabuti.' },
          { text: 'Continue CPR until EMS arrives to be safe', textFil: 'Ipagpatuloy ang CPR hanggang dumating ang EMS para sigurado', nextNodeId: 'node-5c', scoreChange: -10, feedback: 'Stop CPR! The patient has a pulse and is breathing. Continuing compressions on a patient with a pulse is harmful. Monitor and support as needed.', feedbackFil: 'Ihinto ang CPR! May pulse at humihinga ang pasyente. Ang pagpapatuloy ng compressions sa pasyenteng may pulse ay nakakasama.' },
        ],
      },
      'node-5b': {
        id: 'node-5b', narration: 'You check for pulse - a faint carotid pulse is present. The patient is taking gasping breaths. The airway is now partially clear.',
        narrationFil: 'Siniuri mo ang pulse - may mahinang carotid pulse. Ang pasyente ay humihinghing. Bahagyang malinaw na ang airway.',
        vitalSigns: { hr: 64, bp: '88/58', rr: 6, spo2: 82 },
        options: [
          { text: 'Provide rescue breathing, supplemental oxygen, and place in recovery position', textFil: 'Magbigay ng rescue breathing, supplemental oxygen, at ilagay sa recovery position', nextNodeId: 'node-6', scoreChange: 10, feedback: 'Correct! The patient has a pulse but inadequate breathing. Provide assisted ventilation and oxygen, then place in recovery position.', feedbackFil: 'Tama! May pulse ang pasyente ngunit hindi sapat ang paghinga. Magbigay ng assisted ventilation at oxygen, tapos ilagay sa recovery position.' },
        ],
      },
      'node-5c': {
        id: 'node-5c', narration: 'You continue CPR on a patient who has a pulse and is breathing. The compressions are causing unnecessary trauma to the patient chest.',
        narrationFil: 'Ipinagpatuloy mo ang CPR sa pasyenteng may pulse at humihinga. Ang compressions ay nagdudulot ng hindi kinakailangang pinsala sa dibdib ng pasyente.',
        options: [
          { text: 'Stop compressions immediately, assess patient, and provide appropriate care', textFil: 'Ihinto ang compressions agad, suriin ang pasyente, at magbigay ng naaangkop na pangangalaga', nextNodeId: 'node-6', scoreChange: 0, feedback: 'Stop CPR now. Always check for signs of life. If the patient has a pulse and is breathing, stop compressions and provide supportive care.', feedbackFil: 'Ihinto ang CPR ngayon. Laging suriin ang mga palatandaan ng buhay. Kung may pulse at humihinga ang pasyente, ihinto ang compressions at magbigay ng suportang pangangalaga.' },
        ],
      },
      'node-6': {
        id: 'node-6', narration: 'EMS arrives and takes over care. The patient is breathing, has a pulse, and is slowly regaining consciousness. He is transported to the hospital for further evaluation.',
        narrationFil: 'Dumating ang EMS at kinuha ang pangangalaga. Ang pasyente ay humihinga, may pulse, at dahan-dahang nagbabalik ang malay. Ipinadala siya sa ospital para sa karagdagang pagsusuri.',
        isEndNode: true, endResult: 'success', endFeedback: 'Excellent work! Key learning: Assess choking severity first (can they speak?), perform abdominal thrusts for conscious severe obstruction, transition to CPR when patient becomes unresponsive, look in mouth before breaths, and stop CPR when ROSC is achieved.', endFeedbackFil: 'Magaling! Mahahalagang aral: Suriin muna ang kalubhaan ng pagsasakal (makakapagsalita ba?), gumawa ng abdominal thrusts para sa may malay na severe obstruction, lumipat sa CPR kapag nawalan ng malay, tingnan sa bibig bago magbigay ng breaths, at ihinto ang CPR kapag na-achieve na ang ROSC.',
        options: [],
      },
    },
  },
  {
    id: 'scen-05',
    title: 'Severe Bleeding - Tourniquet Application',
    titleFil: 'Matinding Pagdurugo - Aplikasyon ng Tornikete',
    description: 'A construction worker has severe arterial hemorrhage from his right arm. Quick bleeding control with tourniquet application is needed.',
    descriptionFil: 'Isang construction worker ang may matinding arterial na pagdurugo mula sa kanyang kanang braso. Kailangan ang mabilis na pagkontrol ng pagdurugo gamit ang tornikete.',
    category: 'trauma',
    difficulty: 'hard',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You respond to a construction site where a worker has a deep laceration on his right upper arm from a power saw. Bright red blood is spurting from the wound. The patient is conscious but pale and anxious.',
        narrationFil: 'Tumutugon ka sa construction site kung saan ang isang worker ay may malalim na sugat sa kanang itaas na braso mula sa power saw. Ang maliwanag na pulang dugo ay sumisirit mula sa sugat. Ang pasyente ay may malay ngunit maputla at kinakabahan.',
        vitalSigns: { hr: 130, bp: '100/70', rr: 28, spo2: 94 },
        options: [
          { text: 'Ensure scene safety, don PPE, then apply immediate direct pressure to the wound', textFil: 'Siguraduhin ang kaligtasan ng eksena, magsuot ng PPE, tapos mag-apply ng agarang direktang presyon sa sugat', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! Scene safety first, then PPE, then immediate direct pressure on the wound. Arterial bleeding requires immediate intervention.', feedbackFil: 'Tama! Kaligtasan ng eksena muna, tapos PPE, tapos agarang direktang presyon sa sugat. Ang arterial bleeding ay nangangailangan ng agarang interbensyon.' },
          { text: 'Immediately apply a tourniquet without trying direct pressure first', textFil: 'Agad na mag-apply ng tournikete nang hindi sinusubukan ang direktang presyon muna', nextNodeId: 'node-2b', scoreChange: 5, feedback: 'While tourniquet application is appropriate for life-threatening extremity hemorrhage, current guidelines recommend applying direct pressure first if possible. However, for massive spurting arterial bleeding, immediate tourniquet placement is also acceptable.', feedbackFil: 'Bagama\'t ang aplikasyon ng tournikete ay angkop para sa nakamamatay na pagdurugo sa paa o braso, ang kasalukuyang mga alituntunin ay nagrerekomenda ng direktang presyon muna kung maaari. Ngunit para sa malaking sumisirit na arterial bleeding, ang agarang paglalagay ng tournikete ay katanggap-tanggap din.' },
          { text: 'Elevate the arm above the heart to slow bleeding', textFil: 'Itaas ang braso sa itaas ng puso para mapabagalin ang pagdurugo', nextNodeId: 'node-2c', scoreChange: -5, feedback: 'Elevation alone is insufficient for arterial bleeding. Direct pressure must be applied immediately. Elevation can be used as an adjunct but should not delay direct pressure.', feedbackFil: 'Ang pagtaas lamang ay hindi sapat para sa arterial bleeding. Dapat agad mag-apply ng direktang presyon. Ang pagtaas ay maaaring gamiting karagdagan ngunit hindi dapat makapagpabagal sa direktang presyon.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'You apply direct pressure with a dressing, but the bright red blood is soaking through rapidly. The bleeding is not controlled with direct pressure alone. The patient is becoming more pale and anxious.',
        narrationFil: 'Nag-apply ka ng direktang presyon gamit ang dressing, ngunit ang maliwanag na pulang dugo ay mabilis na tumatagas. Ang pagdurugo ay hindi nakokontrol ng direktang presyon lamang. Ang pasyente ay lalong namumutla at kinakabahan.',
        vitalSigns: { hr: 140, bp: '90/60', rr: 30, spo2: 92 },
        options: [
          { text: 'Apply a tourniquet 2-3 inches above the wound, high and tight on the arm', textFil: 'Mag-apply ng tournikete 2-3 pulgada sa itaas ng sugat, mataas at mahigpit sa braso', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! When direct pressure fails to control life-threatening extremity hemorrhage, apply a tourniquet 2-3 inches above the wound. Apply it high and tight until bleeding stops.', feedbackFil: 'Tama! Kapag nabigo ang direktang presyon na makontrol ang nakamamatay na pagdurugo sa paa o braso, mag-apply ng tournikete 2-3 pulgada sa itaas ng sugat. I-apply nang mataas at mahigpit hanggang huminto ang pagdurugo.' },
          { text: 'Apply more dressings on top and press harder', textFil: 'Maglagay ng higit pang dressing sa ibabaw at pigilan nang mas mahigpit', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'Do not stack dressings on top of soaked dressings - remove and replace with fresh ones. For arterial bleeding not controlled by direct pressure, a tourniquet is indicated. Delaying tourniquet application worsens hemorrhagic shock.', feedbackFil: 'Huwag magpatong ng dressing sa basang dressing - alisin at palitan ng bago. Para sa arterial bleeding na hindi nakokontrol ng direktang presyon, kailangan ng tournikete. Ang pagkaantala sa aplikasyon ng tournikete ay nagpapalala sa hemorrhagic shock.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You apply the tourniquet directly. Good decision for massive arterial bleeding - current tactical and civilian guidelines support immediate tourniquet for life-threatening extremity hemorrhage.',
        narrationFil: 'Nag-apply ka ng tournikete nang direkta. Magandang desisyon para sa malaking arterial bleeding - ang kasalukuyang tactical at civilian na mga alituntunin ay sumusuporta sa agarang tournikete para sa nakamamatay na pagdurugo sa paa o braso.',
        vitalSigns: { hr: 135, bp: '92/62', rr: 28, spo2: 93 },
        options: [
          { text: 'Tighten the tourniquet until bleeding stops, note the time of application', textFil: 'Higpitan ang tournikete hanggang huminto ang pagdurugo, tandaan ang oras ng aplikasyon', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! Tighten until bleeding stops and note the exact time of application. The time is critical for hospital staff to determine safe tourniquet duration.', feedbackFil: 'Tama! Higpitan hanggang huminto ang pagdurugo at tandaan ang eksaktong oras ng aplikasyon. Ang oras ay kritikal para sa mga tagapagbigay ng ospital upang matukoy ang ligtas na tagal ng tournikete.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'Elevation alone has not stopped the arterial bleeding. Blood is still spurting from the wound. The patient is losing significant blood volume.',
        narrationFil: 'Ang pagtaas lamang ay hindi nagpatigil sa arterial bleeding. Sumisirit pa rin ang dugo mula sa sugat. Ang pasyente ay nawawalan ng malaking dami ng dugo.',
        vitalSigns: { hr: 145, bp: '85/55', rr: 32, spo2: 90 },
        options: [
          { text: 'Apply direct pressure immediately, then a tourniquet', textFil: 'Mag-apply ng direktang presyon agad, tapos tournikete', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Apply direct pressure and tourniquet now. The patient is deteriorating. Never delay bleeding control for elevation alone.', feedbackFil: 'Mag-apply ng direktang presyon at tournikete ngayon. Lumalala ang pasyente. Huwag magpakaragdag sa kontrol ng pagdurugo para sa pagtaas lamang.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'The tourniquet is applied and the bleeding has stopped. You note the time on the tournikete or on the patient forehead. The patient vital signs are: BP 90/60, HR 130, RR 28, SpO2 93%. The patient is still pale and lightheaded.',
        narrationFil: 'Naka-apply na ang tournikete at huminto na ang pagdurugo. Tinandaan mo ang oras sa tournikete o sa noo ng pasyente. Ang vital signs ng pasyente ay: BP 90/60, HR 130, RR 28, SpO2 93%. Maputla pa rin ang pasyente at nahihilo.',
        vitalSigns: { hr: 130, bp: '90/60', rr: 28, spo2: 93 },
        options: [
          { text: 'Treat for shock: high-flow oxygen, keep patient warm, elevate legs, and expedite transport to trauma center', textFil: 'Gamutin ang shock: high-flow oxygen, panatilihing mainit ang pasyente, itaas ang paa, at padaliin ang transport sa trauma center', nextNodeId: 'node-4a', scoreChange: 10, feedback: 'Correct! The patient is in hemorrhagic shock. Provide high-flow oxygen, keep warm, elevate legs, and rapidly transport to a trauma center. Do not remove the tourniquet.', feedbackFil: 'Tama! Ang pasyente ay nasa hemorrhagic shock. Magbigay ng high-flow oxygen, panatilihing mainit, itaas ang paa, at mabilis na i-transport sa trauma center. Huwag alisin ang tournikete.' },
          { text: 'Loosen the tourniquet every 15 minutes to check if bleeding has stopped on its own', textFil: 'Magpaluwag ng tournikete bawat 15 minuto para suriin kung huminto na ang pagdurugo', nextNodeId: 'node-3c', scoreChange: -10, feedback: 'NEVER loosen a tourniquet once applied! Loosening can cause rebleeding and clot displacement, potentially leading to fatal hemorrhage. Once a tourniquet is on, it stays on until hospital arrival.', feedbackFil: 'Huwag KAILANMAN magpaluwag ng tournikete kapag na-apply na! Ang pagpapaluwag ay maaaring magdulot ng muling pagdurugo at paggalaw ng clot, na maaaring magdulot ng nakamamatay na hemorrhage. Kapag naka-apply na ang tournikete, nananatili ito hanggang sa pagdating sa ospital.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You stacked dressings on top of soaked ones. The blood continues to seep through all layers. The patient is deteriorating with dropping blood pressure.',
        narrationFil: 'Nagpatong ka ng dressing sa mga basa. Ang dugo ay patuloy na tumatagas sa lahat ng layer. Ang pasyente ay lumalala na may bumabagsak na blood pressure.',
        vitalSigns: { hr: 148, bp: '80/50', rr: 32, spo2: 88 },
        options: [
          { text: 'Remove soaked dressings, apply fresh ones with direct pressure, and apply a tourniquet', textFil: 'Alisin ang mga basang dressing, maglagay ng bago na may direktang presyon, at mag-apply ng tournikete', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Now apply the tourniquet. Remove soaked dressings, apply fresh pressure, and place the tourniquet. The patient needs hemorrhage control immediately.', feedbackFil: 'Ngayon i-apply ang tournikete. Alisin ang mga basang dressing, mag-apply ng presyon, at ilagay ang tournikete. Kailangan ng pasyente ng kontrol ng hemorrhage agad.' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'You loosened the tourniquet and massive bleeding resumes. The patient blood pressure drops dangerously. You have worsened the situation significantly.',
        narrationFil: 'Pinaluwag mo ang tournikete at mabilis na nagbalik ang malaking pagdurugo. Ang blood pressure ng pasyente ay mapanganib na bumagsak. Lalong lumala ang sitwasyon.',
        vitalSigns: { hr: 155, bp: '70/40', rr: 36, spo2: 85 },
        options: [
          { text: 'Re-tighten the tourniquet immediately and treat for shock', textFil: 'Muling higpitan ang tournikete agad at gamutin ang shock', nextNodeId: 'node-4a', scoreChange: -5, feedback: 'Retighten immediately! Never loosen a tourniquet once applied. The rebleeding has worsened hemorrhagic shock. Treat aggressively now.', feedbackFil: 'Higpitan muli agad! Huwag kailanman magpaluwag ng tournikete kapag na-apply na. Ang muling pagdurugo ay nagpalala sa hemorrhagic shock. Gamutin nang agresibo ngayon.' },
        ],
      },
      'node-4a': {
        id: 'node-4a', narration: 'You are treating for shock with high-flow oxygen, the patient is kept warm, and legs are elevated. You are en route to the trauma center. The tourniquet remains in place with the time documented.',
        narrationFil: 'Ginagamot mo ang shock gamit ang high-flow oxygen, pinapanatili mong mainit ang pasyente, at nakataas ang paa. Papunta na sa trauma center. Ang tournikete ay nananatili sa lugar na may naka-document na oras.',
        vitalSigns: { hr: 120, bp: '95/65', rr: 24, spo2: 96 },
        options: [
          { text: 'Monitor vitals continuously, document tourniquet time, notify trauma center, and keep tourniquet in place', textFil: 'Bantayan ang vitals nang tuluy-tuloy, i-document ang oras ng tournikete, i-notify ang trauma center, at panatilihin ang tournikete', nextNodeId: 'node-5', scoreChange: 10, feedback: 'Correct! Continuous monitoring, documented tourniquet time, hospital notification, and maintaining the tourniquet are all essential actions.', feedbackFil: 'Tama! Ang tuluy-tuloy na pagmamasid, naka-document na oras ng tournikete, pag-notify sa ospital, at pananatili sa tournikete ay lahat na mahahalagang aksyon.' },
          { text: 'Check the wound under the tourniquet to ensure bleeding has stopped', textFil: 'Suriin ang sugat sa ilalim ng tournikete para masiguro na huminto na ang pagdurugo', nextNodeId: 'node-4b', scoreChange: -5, feedback: 'Do not remove or loosen the tourniquet to check the wound. If bleeding was controlled when applied, trust the tourniquet. Checking may dislodge clots.', feedbackFil: 'Huwag alisin o magpaluwag ng tournikete para suriin ang sugat. Kung nakontrol ang pagdurugo noong in-apply, tiwalaan ang tournikete. Ang pagsusuri ay maaaring makapag-alis ng clots.' },
        ],
      },
      'node-4b': {
        id: 'node-4b', narration: 'You loosened the tourniquet to check and some bleeding returns. You re-tighten it. This was unnecessary and potentially harmful.',
        narrationFil: 'Pinaluwag mo ang tournikete para suriin at nagbalik ang pagdurugo. Muli mong hinigpitan. Ito ay hindi kinakailangan at maaaring makasama.',
        options: [
          { text: 'Ensure tourniquet is tight, continue transport and monitoring', textFil: 'Siguraduhing mahigpit ang tournikete, ipagpatuloy ang transport at pagmamasid', nextNodeId: 'node-5', scoreChange: 0, feedback: 'Keep the tourniquet in place and do not disturb it. Transport to the hospital where they will manage tourniquet removal in a controlled setting.', feedbackFil: 'Panatilihin ang tournikete sa lugar at huwag guluhin. I-transport sa ospital kung saan ay pamamahalaan nila ang pag-alis ng tournikete sa kontroladong setting.' },
        ],
      },
      'node-5': {
        id: 'node-5', narration: 'You arrive at the trauma center. The surgical team takes over care. The tourniquet time was 25 minutes - well within safe limits. The patient is taken to the operating room for vascular repair.',
        narrationFil: 'Dumating ka sa trauma center. Ang surgical team ay kumuha ng pangangalaga. Ang oras ng tournikete ay 25 minuto - nasa loob ng ligtas na limit. Ang pasyente ay dinala sa operating room para sa vascular repair.',
        isEndNode: true, endResult: 'success', endFeedback: 'Excellent! Key learning: Direct pressure first for severe bleeding, apply tourniquet when pressure fails for extremity hemorrhage, document tourniquet time, NEVER loosen an applied tourniquet, and treat for hemorrhagic shock with rapid transport.', endFeedbackFil: 'Magaling! Mahahalagang aral: Direktang presyon muna para sa matinding pagdurugo, mag-apply ng tournikete kapag nabigo ang presyon para sa pagdurugo sa paa o braso, i-document ang oras ng tournikete, HUWAG KAILANMAN magpaluwag ng na-apply na tournikete, at gamutin ang hemorrhagic shock na may mabilis na transport.',
        options: [],
      },
    },
  },
  {
    id: 'scen-06',
    title: 'Diabetic Emergency - Hypoglycemia',
    titleFil: 'Diabetic Emergency - Hypoglycemia',
    description: 'An unconscious diabetic patient is found at home. You must determine whether this is hyperglycemia or hypoglycemia and treat accordingly.',
    descriptionFil: 'Isang walang malay na diabetic na pasyente ang natagpuan sa bahay. Dapat mong tukuyin kung ito ay hyperglycemia o hypoglycemia at gamutin nang naaayon.',
    category: 'medical',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You respond to a residence for an unconscious person. Family members say the patient is a 52-year-old male with diabetes. He was found unresponsive on the couch this morning. He took his insulin last night but may not have eaten dinner.',
        narrationFil: 'Tumutugon ka sa isang tirahan para sa isang walang malay na tao. Sinabi ng mga miyembro ng pamilya na ang pasyente ay isang 52-taong-gulang na lalaki na may diabetes. Natagpuan siyang walang malay sa sopa ngayong umaga. Nag-take siya ng insulin kagabi ngunit maaaring hindi nakain ng hapunan.',
        vitalSigns: { hr: 96, bp: '130/85', rr: 16, spo2: 97 },
        options: [
          { text: 'Perform primary assessment (ABCs) and check blood glucose level immediately', textFil: 'Gumawa ng primary assessment (ABCs) at suriin ang blood glucose level agad', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! ABCs first, then determine blood glucose. Distinguishing between hyper and hypoglycemia is critical because treatments are opposite. A glucose check is essential.', feedbackFil: 'Tama! ABCs muna, tapos tukuyin ang blood glucose. Ang pagkakaiba sa hyper at hypoglycemia ay kritikal dahil magkaiba ang paggamot. Ang pagsusuri ng glucose ay mahalaga.' },
          { text: 'Administer oral glucose immediately since he is diabetic and unconscious', textFil: 'Magbigay ng oral glucose agad dahil diabetic siya at walang malay', nextNodeId: 'node-2b', scoreChange: -10, feedback: 'NEVER give anything by mouth to an unconscious patient! Oral glucose could aspirate and cause airway obstruction. If the patient is unconscious, use IV dextrose or glucagon.', feedbackFil: 'Huwag KAILANMAN magbigay ng anuman sa bibig ng walang malay na pasyente! Ang oral glucose ay maaaring mai-aspirate at magdulot ng airway obstruction. Kung walang malay ang pasyente, gumamit ng IV dextrose o glucagon.' },
          { text: 'Assume it is hyperglycemia and transport immediately', textFil: 'Assume na hyperglycemia ito at i-transport agad', nextNodeId: 'node-2c', scoreChange: -5, feedback: 'Do not assume the type of diabetic emergency. The history (took insulin, may not have eaten) strongly suggests hypoglycemia, but you must confirm with a glucose check. Treatments are opposite - giving the wrong one can be harmful.', feedbackFil: 'Huwag假设 ang uri ng diabetic emergency. Ang kasaysayan (nag-take ng insulin, maaaring hindi nakain) ay malakas na nagpapahiwatig ng hypoglycemia, ngunit dapat mong kumpirmahin ng pagsusuri ng glucose. Magkaiba ang paggamot - ang mali ay maaaring makasama.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'Primary assessment: Airway is open, breathing is adequate at 16/min, radial pulse is present at 96 bpm. Blood glucose reads 38 mg/dL (critically low - normal is 70-100 mg/dL). This is severe hypoglycemia.',
        narrationFil: 'Primary assessment: Ang airway ay bukas, ang paghinga ay sapat sa 16/min, ang radial pulse ay nasa 96 bpm. Ang blood glucose ay 38 mg/dL (kritikal na mababa - normal ay 70-100 mg/dL). Ito ay severe hypoglycemia.',
        vitalSigns: { hr: 96, bp: '130/85', rr: 16, spo2: 97 },
        options: [
          { text: 'Establish IV access and administer 50% dextrose (D50) IV push', textFil: 'Mag-establish ng IV access at magbigay ng 50% dextrose (D50) IV push', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! For severe hypoglycemia (altered mental status or unconsciousness), IV dextrose is the treatment of choice. D50 25g (50mL) IV push rapidly raises blood glucose.', feedbackFil: 'Tama! Para sa severe hypoglycemia (binagong kalagayan ng isip o walang malay), ang IV dextrose ang piniling paggamot. Ang D50 25g (50mL) IV push ay mabilis na nagtataas ng blood glucose.' },
          { text: 'Administer glucagon IM if IV access cannot be established', textFil: 'Magbigay ng glucagon IM kung hindi ma-establish ang IV access', nextNodeId: 'node-3b', scoreChange: 8, feedback: 'Correct! If IV access cannot be obtained, glucagon 1mg IM is the alternative. However, try IV dextrose first as it works faster and more reliably.', feedbackFil: 'Tama! Kung hindi makukuha ang IV access, ang glucagon 1mg IM ang alternatibo. Subukan muna ang IV dextrose dahil mas mabilis at mas tiyak itong gumagana.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You attempted to give oral glucose to an unconscious patient. The glucose paste entered the airway and the patient begins coughing and gagging. This is a dangerous airway compromise.',
        narrationFil: 'Sinubukan mong magbigay ng oral glucose sa walang malay na pasyente. Pumasok ang glucose paste sa airway at nagsimulang umubo at lagutin ang pasyente. Ito ay mapanganib na airway compromise.',
        options: [
          { text: 'Suction the airway, position to maintain airway, then check glucose and give IV dextrose', textFil: 'I-suction ang airway, iposisyon para panatilihin ang airway, tapos suriin ang glucose at magbigay ng IV dextrose', nextNodeId: 'node-2a', scoreChange: -5, feedback: 'Manage the airway first, then check glucose and treat appropriately. Never give anything by mouth to an unconscious patient.', feedbackFil: 'Pamahalaan ang airway muna, tapos suriin ang glucose at gamutin nang naaayon. Huwag kailanman magbigay ng anuman sa bibig ng walang malay na pasyente.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'You assume hyperglycemia without checking glucose. You begin transport without treatment. The patient glucose is actually critically low at 38 mg/dL. Brain damage from prolonged hypoglycemia is a real risk.',
        narrationFil: 'Inakala mo na hyperglycemia nang hindi sinuri ang glucose. Nagsimula ka ng transport nang walang paggamot. Ang glucose ng pasyente ay kritikal na mababa sa 38 mg/dL. Ang pinsala sa utak mula sa matagal na hypoglycemia ay isang tunay na panganib.',
        options: [
          { text: 'Check glucose immediately and treat based on results', textFil: 'Suriin ang glucose agad at gamutin batay sa resulta', nextNodeId: 'node-2a', scoreChange: 0, feedback: 'Always check blood glucose before treating diabetic emergencies. Hypoglycemia needs immediate glucose; hyperglycemia needs fluid resuscitation and insulin. Treatments are opposite!', feedbackFil: 'Laging suriin ang blood glucose bago gamutin ang diabetic emergencies. Ang hypoglycemia ay nangangailangan ng agarang glucose; ang hyperglycemia ay nangangailangan ng fluid at insulin. Magkaiba ang paggamot!' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'You administer D50 IV. Within 1-2 minutes, the patient begins to regain consciousness. He is confused but able to speak. Repeat glucose reads 85 mg/dL.',
        narrationFil: 'Nagbigay ka ng D50 IV. Sa loob ng 1-2 minuto, unti-unting nakakalma ang pasyente. Naguguluhan siya ngunit nakakapagsalita. Ang repeat glucose ay 85 mg/dL.',
        vitalSigns: { hr: 88, bp: '128/82', rr: 16, spo2: 98 },
        options: [
          { text: 'Monitor the patient, encourage oral intake if able, and transport for evaluation', textFil: 'Bantayan ang pasyente, hikayatin ang pag-inom kung kaya, at i-transport para sa pagsusuri', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! After D50 administration and patient improvement, monitor closely, encourage oral glucose/food if the patient can swallow, and transport to hospital for evaluation. Hypoglycemia can recur.', feedbackFil: 'Tama! Pagkatapos ng D50 at pagpapabuti ng pasyente, bantayan nang mabuti, hikayatin ang oral glucose/pagkain kung makakainom ang pasyente, at i-transport sa ospital para sa pagsusuri. Maaaring magbalik ang hypoglycemia.' },
          { text: 'Since the patient is conscious now, no further treatment or transport is needed', textFil: 'Dahil may malay na ang pasyente, hindi na kailangan ng karagdagang paggamot o transport', nextNodeId: 'node-3c', scoreChange: -10, feedback: 'The patient MUST be transported. Hypoglycemia can recur as D50 is metabolized. The underlying cause needs evaluation. Refusal of transport should only be considered after full assessment and with medical control consultation.', feedbackFil: 'Dapat I-TRANSPORT ang pasyente. Maaaring magbalik ang hypoglycemia habang nagma-metabolize ang D50. Ang sanhi ay nangangailangan ng pagsusuri. Ang pagtanggi sa transport ay dapat isaalang-alang lamang pagkatapos ng buong pagtatasa at pagkomulta sa medical control.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You administer glucagon 1mg IM. It takes 10-15 minutes to take effect. The patient slowly begins to regain consciousness. Repeat glucose reads 72 mg/dL.',
        narrationFil: 'Nagbigay ka ng glucagon 1mg IM. Tagal ng 10-15 minuto bago gumana. Unti-unting nakakalma ang pasyente. Ang repeat glucose ay 72 mg/dL.',
        vitalSigns: { hr: 90, bp: '126/80', rr: 16, spo2: 98 },
        options: [
          { text: 'Attempt IV access for D50, encourage oral intake if awake enough, and transport', textFil: 'Subukang mag-IV access para sa D50, hikayatin ang pag-inom kung gising na, at i-transport', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! Glucagon takes longer to work than IV dextrose. Once the patient is alert enough to swallow, offer oral glucose. Still transport for evaluation.', feedbackFil: 'Tama! Mas matagal gumana ang glucagon kaysa IV dextrose. Kapag sapat na ang pagiging alerto ng pasyente para lumunok, mag-alok ng oral glucose. I-transport pa rin para sa pagsusuri.' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'You decide not to transport. Thirty minutes later, the D50 effect wears off and the patient becomes hypoglycemic again. There is no one to help him and he cannot call for help. This is a dangerous situation.',
        narrationFil: 'Hindi mo na-transport. Tatlumpung minuto ang lumipas, nag-wear off ang epekto ng D50 at nag-hypoglycemia ulit ang pasyente. Walang tumutulong sa kanya at hindi siya makatawag ng tulong. Mapanganib ito.',
        options: [
          { text: 'Call for EMS and ensure the patient gets evaluated at the hospital', textFil: 'Tumawag ng EMS at siguraduhing masuri ang pasyente sa ospital', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Always transport hypoglycemia patients. D50 is a temporary fix - the underlying cause must be evaluated and hypoglycemia can recur.', feedbackFil: 'Laging i-transport ang mga pasyenteng may hypoglycemia. Ang D50 ay pansamantalang solusyon lamang - ang sanhi ay dapat suriin at maaaring magbalik ang hypoglycemia.' },
        ],
      },
      'node-4': {
        id: 'node-4', narration: 'The patient is now alert and oriented. He is able to eat some crackers and drink juice. You are transporting him to the hospital for further evaluation. His glucose remains stable at 95 mg/dL.',
        narrationFil: 'Ang pasyente ay gising at orientado na. Nakakain siya ng mga crackers at uminom ng katas. Ipinapadala mo siya sa ospital para sa karagdagang pagsusuri. Ang kanyang glucose ay matatag sa 95 mg/dL.',
        isEndNode: true, endResult: 'success', endFeedback: 'Great work! Key learning: Always check blood glucose in diabetic emergencies, never give anything by mouth to unconscious patients, treat severe hypoglycemia with IV D50 or IM glucagon, always transport because hypoglycemia can recur. Hypoglycemia is a more immediate threat than hyperglycemia.', endFeedbackFil: 'Magaling! Mahahalagang aral: Laging suriin ang blood glucose sa diabetic emergencies, huwag magbigay ng anuman sa bibig ng walang malay na pasyente, gamutin ang severe hypoglycemia ng IV D50 o IM glucagon, laging i-transport dahil maaaring magbalik ang hypoglycemia. Ang hypoglycemia ay mas agarang banta kaysa hyperglycemia.',
        options: [],
      },
    },
  },
  {
    id: 'scen-07',
    title: 'Heat Stroke Emergency',
    titleFil: 'Heat Stroke Emergency',
    description: 'A construction worker is found with altered mental status and hot, dry skin at a job site during extreme heat. Immediate cooling is critical.',
    descriptionFil: 'Isang construction worker ang natagpuan na may binagong kalagayan ng isip at mainit, tuyong balat sa trabaho sa matinding init. Ang agarang pagpapalamig ay kritikal.',
    category: 'environmental',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You respond to a construction site during a heat wave (ambient temperature 40°C/104°F). A 35-year-old male worker is confused, not sweating, and his skin is hot and dry to the touch. His coworkers say he has been working in direct sun for 4 hours without a break.',
        narrationFil: 'Tumutugon ka sa construction site sa panahon ng heat wave (temperatura 40°C/104°F). Isang 35-taong-gulang na lalaking worker ay naguguluhan, hindi pinagpapawisan, at ang kanyang balat ay mainit at tuyo. Sinabi ng kanyang mga katrabaho na nagtatrabaho siya sa diretsong araw nang 4 oras nang walang pahinga.',
        vitalSigns: { hr: 130, bp: '90/60', rr: 28, spo2: 94, temp: '41.5°C/107°F' },
        options: [
          { text: 'Recognize this as heat stroke and immediately move the patient to a cool environment and begin rapid cooling', textFil: 'Kilalanin ito bilang heat stroke at agad na ilipat ang pasyente sa malamig na lugar at magsimula ng mabilis na pagpapalamig', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! Altered mental status + hot/dry skin = HEAT STROKE, a life-threatening emergency. Immediate cooling is the single most important intervention. Move to shade and begin aggressive cooling immediately.', feedbackFil: 'Tama! Binagong kalagayan ng isip + mainit/tuyong balat = HEAT STROKE, isang nakamamatay na emergency. Ang agarang pagpapalamig ang pinakamahalagang interbensyon. Ilipat sa lilim at magsimula ng agresibong pagpapalamig agad.' },
          { text: 'Give the patient cold water to drink since he appears dehydrated', textFil: 'Magbigay ng malamig na tubig na inumin sa pasyente dahil mukhang dehydrated siya', nextNodeId: 'node-2b', scoreChange: -5, feedback: 'This patient has altered mental status - do not give anything by mouth due to aspiration risk. Heat stroke requires external cooling, not just oral hydration. The priority is rapid body cooling.', feedbackFil: 'May binagong kalagayan ng isip ang pasyenteng ito - huwag magbigay ng anuman sa bibig dahil sa panganib ng aspiration. Ang heat stroke ay nangangailangan ng panlabas na pagpapalamig, hindi lamang oral na hidrasyon. Ang priyoridad ay mabilis na pagpapalamig ng katawan.' },
          { text: 'Treat for heat exhaustion - move to shade, fan, and give fluids', textFil: 'Gamutin para sa heat exhaustion - ilipat sa lilim, i-fan, at magbigay ng fluids', nextNodeId: 'node-2c', scoreChange: -5, feedback: 'This is NOT heat exhaustion - the altered mental status and hot/dry skin indicate HEAT STROKE, which is far more dangerous. Heat exhaustion patients are typically sweating and alert. Heat stroke requires aggressive cooling immediately.', feedbackFil: 'Ito ay HINDI heat exhaustion - ang binagong kalagayan ng isip at mainit/tuyong balat ay nagpapahiwatig ng HEAT STROKE, na mas mapanganib. Ang mga pasyenteng may heat exhaustion ay karaniwang pinagpapawisan at gising. Ang heat stroke ay nangangailangan ng agresibong pagpapalamig agad.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'You move the patient to a shaded area and begin rapid cooling by removing excess clothing and applying cold wet sheets with fanning. The patient is still confused but cooling has begun.',
        narrationFil: 'Inilipat mo ang pasyente sa may lilim at nagsimula ng mabilis na pagpapalamig sa pag-alis ng sobrang damit at pag-apply ng malamig na basang kumot na may fanning. Naguguluhan pa rin ang pasyente ngunit nagsimula na ang pagpapalamig.',
        vitalSigns: { hr: 125, bp: '92/62', rr: 26, spo2: 95, temp: '40.8°C/105.4°F' },
        options: [
          { text: 'Continue aggressive cooling with cold packs to neck, axillae, and groin; apply cold water; fan; establish IV access; and monitor vitals', textFil: 'Ipagpatuloy ang agresibong pagpapalamig ng cold packs sa leeg, kili-kili, at singit; mag-apply ng malamig na tubig; mag-fan; mag-establish ng IV access; at bantayan ang vitals', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! Aggressive cooling is critical: cold packs to neck, armpits, and groin (large vessel areas), wet sheets with fanning, and cold water immersion if available. Stop cooling when temp reaches 39°C (102.2°F) to avoid hypothermia.', feedbackFil: 'Tama! Ang agresibong pagpapalamig ay kritikal: cold packs sa leeg, kili-kili, at singit (malalaking lugar ng vessel), basang kumot na may fanning, at malamig na tubig kung available. Ihinto ang pagpapalamig kapag ang temp ay umabot sa 39°C (102.2°F) para maiwasan ang hypothermia.' },
          { text: 'Focus on IV fluid resuscitation first before continuing cooling', textFil: 'Magtuon sa IV fluid resuscitation muna bago ipagpatuloy ang pagpapalamig', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'Cooling is the priority, not IV fluids alone. While IV fluids are important, the lethal factor in heat stroke is the extreme body temperature. Continue aggressive cooling while establishing IV access.', feedbackFil: 'Ang pagpapalamig ang priyoridad, hindi ang IV fluids lamang. Bagama\'t mahalaga ang IV fluids, ang nakamamatay na salik sa heat stroke ay ang matinding temperatura ng katawan. Ipagpatuloy ang agresibong pagpapalamig habang nag-e-establish ng IV access.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You try to give water to the confused patient. He aspirates some water and begins coughing. This has delayed critical cooling interventions.',
        narrationFil: 'Sinubukan mong magbigay ng tubig sa naguguluhang pasyente. Na-aspirate niya ang tubig at nagsimulang umubo. Ito ay nagpabagal sa mga kritikal na interbensyon sa pagpapalamig.',
        options: [
          { text: 'Clear the airway, move to shade, and begin aggressive external cooling immediately', textFil: 'Linisin ang airway, ilipat sa lilim, at magsimula ng agresibong panlabas na pagpapalamig agad', nextNodeId: 'node-2a', scoreChange: 0, feedback: 'Manage the airway first, then begin aggressive cooling. Never give oral fluids to patients with altered mental status.', feedbackFil: 'Pamahalaan ang airway muna, tapos magsimula ng agresibong pagpapalamig. Huwag magbigay ng oral fluids sa mga pasyenteng may binagong kalagayan ng isip.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'You treat for heat exhaustion while the patient actually has heat stroke. The patient temperature continues to rise and his mental status deteriorates further. He is now barely responsive.',
        narrationFil: 'Ginamot mo para sa heat exhaustion habang heat stroke pala ang pasyente. Patuloy na tumataas ang temperatura ng pasyente at lalong bumubuti ang kalagayan ng isip niya. Halos hindi na siya makatugon.',
        vitalSigns: { hr: 140, bp: '85/55', rr: 30, spo2: 92, temp: '42°C/107.6°F' },
        options: [
          { text: 'Recognize heat stroke and begin aggressive cooling immediately', textFil: 'Kilalanin ang heat stroke at magsimula ng agresibong pagpapalamig agad', nextNodeId: 'node-3a', scoreChange: -5, feedback: 'This is now a critical situation. Begin aggressive cooling immediately. Heat stroke is life-threatening and every minute of delay worsens the outcome.', feedbackFil: 'Kritikal na sitwasyon na ito. Magsimula ng agresibong pagpapalamig agad. Ang heat stroke ay nakamamatay at bawat minuto ng pagkaantala ay nagpapalala sa kinalabasan.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'After 10 minutes of aggressive cooling, the patient temperature drops to 39.5°C (103°F). His mental status is improving - he is now oriented to name but still confused about place and time. IV normal saline is running.',
        narrationFil: 'Pagkatapos ng 10 minutong agresibong pagpapalamig, bumaba ang temperatura ng pasyente sa 39.5°C (103°F). Ang kalagayan ng isip niya ay bumubuti - nakikilala na niya ang pangalan niya ngunit naguguluhan pa rin sa lugar at oras. Ang IV normal saline ay tumatakbo.',
        vitalSigns: { hr: 110, bp: '100/68', rr: 22, spo2: 96, temp: '39.5°C/103°F' },
        options: [
          { text: 'Stop active cooling at 39°C to avoid overshoot hypothermia, continue monitoring, and transport to hospital', textFil: 'Ihinto ang aktibong pagpapalamig sa 39°C para maiwasan ang overshoot hypothermia, ipagpatuloy ang pagmamasid, at i-transport sa ospital', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! Stop active cooling when temperature reaches 39°C (102.2°F) to prevent overshoot hypothermia. Continue passive cooling and transport to the hospital for monitoring of organ function.', feedbackFil: 'Tama! Ihinto ang aktibong pagpapalamig kapag ang temperatura ay umabot sa 39°C (102.2°F) para maiwasan ang overshoot hypothermia. Ipagpatuloy ang passive cooling at i-transport sa ospital para sa pagmamasid ng paggana ng mga organo.' },
          { text: 'Continue aggressive cooling until temperature is normal (37°C)', textFil: 'Ipagpatuloy ang agresibong pagpapalamig hanggang normal ang temperatura (37°C)', nextNodeId: 'node-3c', scoreChange: -5, feedback: 'Do not cool to normal temperature! Stop active cooling at 39°C to prevent overshoot hypothermia. The body temperature will continue to drop slightly after cooling stops. Overcooling can cause dangerous hypothermia and cardiac arrhythmias.', feedbackFil: 'Huwag palamigin hanggang sa normal na temperatura! Ihinto ang aktibong pagpapalamig sa 39°C para maiwasan ang overshoot hypothermia. Ang temperatura ng katawan ay patuloy na bababa nang bahagya pagkatapos huminto ang pagpapalamig. Ang sobrang pagpapalamig ay maaaring magdulot ng mapanganib na hypothermia at cardiac arrhythmias.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You focused on IV fluids before cooling. The patient temperature continues to rise to 42°C. His mental status worsens. Aggressive cooling should have been the priority.',
        narrationFil: 'Nagtuon ka sa IV fluids bago pagpapalamig. Patuloy na tumataas ang temperatura ng pasyente sa 42°C. Lumalala ang kalagayan ng isip niya. Ang agresibong pagpapalamig ang dapat na naging priyoridad.',
        vitalSigns: { hr: 145, bp: '80/50', rr: 32, spo2: 90, temp: '42°C/107.6°F' },
        options: [
          { text: 'Begin aggressive cooling immediately - cold packs, wet sheets, fanning', textFil: 'Magsimula ng agresibong pagpapalamig agad - cold packs, basang kumot, fanning', nextNodeId: 'node-3a', scoreChange: 0, feedback: 'Start aggressive cooling now. In heat stroke, cooling IS the treatment. IV fluids support but do not address the core problem of hyperthermia.', feedbackFil: 'Magsimula ng agresibong pagpapalamig ngayon. Sa heat stroke, ang pagpapalamig ANG paggamot. Ang IV fluids ay sumusuporta ngunit hindi nakaaayos sa pangunahing problema ng hyperthermia.' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'You continued cooling below 39°C. The patient temperature drops to 35.5°C (96°F) and he begins shivering violently. His heart rate becomes irregular. This is iatrogenic hypothermia from overcooling.',
        narrationFil: 'Ipinagpatuloy mo ang pagpapalamig sa ibaba ng 39°C. Ang temperatura ng pasyente ay bumaba sa 35.5°C (96°F) at nagsimulang manginig nang marahas. Ang tibok ng puso niya ay nagiging hindi regular. Ito ay iatrogenic hypothermia mula sa sobrang pagpapalamig.',
        vitalSigns: { hr: 50, bp: '85/55', rr: 14, spo2: 94, temp: '35.5°C/96°F' },
        options: [
          { text: 'Stop cooling immediately, remove cold packs, cover with warm blankets, and monitor cardiac rhythm', textFil: 'Ihinto ang pagpapalamig agad, alisin ang cold packs, takpan ng mainit na kumot, at bantayan ang cardiac rhythm', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Stop cooling and begin rewarming. Monitor for cardiac arrhythmias. This is why we stop active cooling at 39°C - to prevent overshoot hypothermia.', feedbackFil: 'Ihinto ang pagpapalamig at magsimula ng pagpapainit. Bantayan ang cardiac arrhythmias. Kaya natin ihinto ang aktibong pagpapalamig sa 39°C - para maiwasan ang overshoot hypothermia.' },
        ],
      },
      'node-4': {
        id: 'node-4', narration: 'The patient is being transported to the hospital. His temperature is stabilizing. He is more alert and oriented. The hospital is notified of heat stroke with aggressive cooling provided.',
        narrationFil: 'Ipinapadala ang pasyente sa ospital. Ang temperatura niya ay nagiging matatag. Mas gising at orientado na siya. Na-notify na ang ospital ng heat stroke na may agresibong pagpapalamig na ibinigay.',
        isEndNode: true, endResult: 'success', endFeedback: 'Well done! Key learning: Heat stroke = altered mental status + hot/dry skin (life-threatening!), aggressive cooling is THE priority, cold packs to neck/axillae/groin, stop cooling at 39°C to prevent hypothermia, never give oral fluids to confused patients, and always transport for monitoring of organ damage.', endFeedbackFil: 'Magaling! Mahahalagang aral: Heat stroke = binagong kalagayan ng isip + mainit/tuyong balat (nakamamatay!), ang agresibong pagpapalamig ANG priyoridad, cold packs sa leeg/kili-kili/singit, ihinto ang pagpapalamig sa 39°C para maiwasan ang hypothermia, huwag magbigay ng oral fluids sa naguguluhan na pasyente, at laging i-transport para sa pagmamasid ng pinsala sa organo.',
        options: [],
      },
    },
  },
  {
    id: 'scen-08',
    title: 'Pediatric Febrile Seizure',
    titleFil: 'Pediatric Febrile Seizure',
    description: 'A 3-year-old child is having a febrile seizure at home. The parent is panicking. You must manage both the child and the parent while providing appropriate care.',
    descriptionFil: 'Isang 3-taong-gulang na bata ang nagkakaroon ng febrile seizure sa bahay. Nag-panic ang magulang. Dapat mong pamahalaan ang bata at ang magulang habang nagbibigay ng naaangkop na pangangalaga.',
    category: 'pediatric',
    difficulty: 'medium',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You arrive at a residence. A mother is holding her 3-year-old child who is actively seizing - body stiffening, eyes rolling back, jerking movements of arms and legs. The mother is crying and screaming "My baby is dying! Help!"',
        narrationFil: 'Dumating ka sa isang tirahan. Hawak ng ina ang kanyang 3-taong-gulang na anak na aktibong nagse-seizure - ang katawan ay nagtitiis, ang mga mata ay umiikot, at may panginginig ng mga kamay at paa. Umiyak at sumisigaw ang ina "Mamamatay ang baby ko! Tulungan!"',
        vitalSigns: { hr: 155, rr: 28, spo2: 92, temp: '39.8°C/103.6°F' },
        options: [
          { text: 'Calm the parent, place the child on a flat safe surface, turn on side, and protect from injury', textFil: 'Kalmahin ang magulang, ilagay ang bata sa patag na ligtas na ibabaw, i-likod sa gilid, at protektahan mula sa pinsala', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! During an active seizure: protect the child from injury, position on the side to maintain airway, do NOT restrain or put anything in the mouth. Calm the parent - febrile seizures are common and usually self-limiting.', feedbackFil: 'Tama! Sa aktibong seizure: protektahan ang bata mula sa pinsala, iposisyon sa gilid para panatilihin ang airway, HUWAG pigilan o maglagay ng anuman sa bibig. Kalmahin ang magulang - ang febrile seizure ay karaniwan at karaniwang nagpapatahi sa sarili.' },
          { text: 'Try to hold the child still to stop the seizure', textFil: 'Subukang hawakan ang bata nang mahigpit para ihinto ang seizure', nextNodeId: 'node-2b', scoreChange: -10, feedback: 'Do NOT restrain a seizing child! This can cause fractures or muscle/tendon injuries. You cannot stop a seizure by holding the child still. Protect from injury and let the seizure run its course.', feedbackFil: 'HUWAG pigilan ang nagse-seizure na bata! Ito ay maaaring magdulot ng fractures o pinsala sa kalamnan/tendon. Hindi mo mahihinto ang seizure sa pamamagitan ng paghawak nang mahigpit. Protektahan mula sa pinsala at hayaang matapos ang seizure.' },
          { text: 'Put a spoon or wallet in the child mouth to prevent tongue biting', textFil: 'Maglagay ng kutsara o pitaka sa bibig ng bata para maiwasan ang kagat sa dila', nextNodeId: 'node-2c', scoreChange: -10, feedback: 'NEVER put anything in the mouth of a seizing patient! This is an old myth that can cause broken teeth, airway obstruction, or injury to the provider. People cannot swallow their tongue during a seizure.', feedbackFil: 'HUWAG KAILANMAN maglagay ng anuman sa bibig ng nagse-seizure na pasyente! Ito ay lumang mito na maaaring magdulot ng nasirang ngipin, airway obstruction, o pinsala sa tagapagbigay. Hindi nilulunok ng mga tao ang kanilang dila sa panahon ng seizure.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'You place the child on a flat surface on his side. The seizure lasts another 30 seconds then stops. The child is now limp, pale, and taking shallow breaths. The mother is slightly calmer but still very anxious.',
        narrationFil: 'Inilagay mo ang bata sa patag na ibabaw sa kanyang gilid. Ang seizure ay tumagal ng 30 segundo tapos huminto. Ang bata ay ngayon ay mahina, maputla, at humihinga nang mababaw. Ang ina ay bahagyang kalmado na ngunit sobrang kabahala pa rin.',
        vitalSigns: { hr: 140, rr: 20, spo2: 94, temp: '39.6°C/103.3°F' },
        options: [
          { text: 'Perform primary assessment: ensure airway is open, provide high-flow oxygen, assess breathing and circulation, and begin cooling measures', textFil: 'Gumawa ng primary assessment: siguraduhing bukas ang airway, magbigay ng high-flow oxygen, suriin ang paghinga at sirkulasyon, at magsimula ng pagpapalamig', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! After the seizure stops, perform a thorough primary assessment. Ensure airway is patent, provide oxygen, and begin passive cooling for the fever. Febrile seizures are usually benign but require fever management and evaluation.', feedbackFil: 'Tama! Pagkatapos huminto ang seizure, gumawa ng masusing primary assessment. Siguraduhing bukas ang airway, magbigay ng oxygen, at magsimula ng passive cooling para sa lagnat. Ang febrile seizure ay karaniwang hindi mapanganib ngunit nangangailangan ng pamamahala ng lagnat at pagsusuri.' },
          { text: 'Immediately rush the child to the ambulance without assessment', textFil: 'Agad na dalhin ang bata sa ambulansya nang hindi nag-a-assess', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'Always perform primary assessment first, especially after a seizure. The post-ictal period requires careful monitoring of ABCs. Rushing without assessment can miss critical problems.', feedbackFil: 'Laging gumawa ng primary assessment muna, lalo na pagkatapos ng seizure. Ang post-ictal na panahon ay nangangailangan ng maingat na pagmamasid ng ABCs. Ang pagmamadali nang walang pagtatasa ay maaaring makaligtaan ang mga kritikal na problema.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You tried to restrain the child during the seizure. The child arm was twisted and may be injured. The seizure stops on its own but the child is now crying and holding his arm.',
        narrationFil: 'Sinubukan mong pigilan ang bata sa panahon ng seizure. Na-twist ang braso ng bata at maaaring nasugatan. Ang seizure ay tumigil sa sarili ngunit ang bata ay umiiyak at hawak ang braso niya.',
        options: [
          { text: 'Assess the arm, perform primary assessment, and provide appropriate care', textFil: 'Suriin ang braso, gumawa ng primary assessment, at magbigay ng naaangkop na pangangalaga', nextNodeId: 'node-3a', scoreChange: -5, feedback: 'Assess the arm and perform a complete primary assessment. Never restrain a seizing patient - protect them from injury instead by moving dangerous objects away.', feedbackFil: 'Suriin ang braso at gumawa ng kumpletong primary assessment. Huwag kailanman pigilan ang nagse-seizure na pasyente - protektahan sila mula sa pinsala sa halip na alisin ang mga mapanganib na bagay.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'You put an object in the child mouth. The child gagged and vomited during the seizure. The object partially blocked the airway, creating a dangerous situation. Fortunately, you were able to remove it, but the child aspirated some vomit.',
        narrationFil: 'Naglagay ka ng bagay sa bibig ng bata. Nag-gag at nagsuka ang bata sa panahon ng seizure. Bahagyang naharangan ng bagay ang airway, na lumikha ng mapanganib na sitwasyon. Swerte, naalis mo ito, ngunit na-aspirate ng bata ang ilang suka.',
        options: [
          { text: 'Clear the airway, suction if needed, position on side, and assess breathing', textFil: 'Linisin ang airway, mag-suction kung kailangan, iposisyon sa gilid, at suriin ang paghinga', nextNodeId: 'node-3a', scoreChange: -5, feedback: 'Clear the airway and assess. NEVER place objects in a seizing patient mouth. This is exactly why - it causes airway obstruction and aspiration.', feedbackFil: 'Linisin ang airway at suriin. HUWAG KAILANMAN maglagay ng bagay sa bibig ng nagse-seizure na pasyente. Ito mismo ang dahilan - nagdudulot ito ng airway obstruction at aspiration.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'Primary assessment shows: Airway is open, breathing is adequate, circulation is present. The child is in a post-ictal state - sleepy and lethargic but responsive to voice. Temperature is 39.6°C (103.3°F). You begin cooling with tepid sponging.',
        narrationFil: 'Ang primary assessment ay nagpapakita: Ang airway ay bukas, ang paghinga ay sapat, ang sirkulasyon ay nandiyan. Ang bata ay nasa post-ictal na kalagayan - inaantok at mahina ngunit tumutugon sa boses. Ang temperatura ay 39.6°C (103.3°F). Nagsimula ka ng pagpapalamig gamit ang tiyak-tiyak na sponging.',
        vitalSigns: { hr: 135, rr: 22, spo2: 96, temp: '39.4°C/102.9°F' },
        options: [
          { text: 'Administer antipyretic (acetaminophen 15mg/kg) per protocol, continue tepid sponging, monitor, and transport for evaluation', textFil: 'Magbigay ng antipyretic (acetaminophen 15mg/kg) ayon sa protokol, ipagpatuloy ang tiyak-tiyak na sponging, bantayan, at i-transport para sa pagsusuri', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! Manage the fever with acetaminophen and tepid sponging. Transport for evaluation - febrile seizures, while usually benign, need evaluation for the cause of fever and to rule out more serious conditions like meningitis.', feedbackFil: 'Tama! Pamahalaan ang lagnat ng acetaminophen at tiyak-tiyak na sponging. I-transport para sa pagsusuri - ang febrile seizure, bagama\'t karaniwang hindi mapanganib, ay nangangailangan ng pagsusuri para sa sanhi ng lagnat at upang ma-eliminate ang mas seryosong kundisyon tulad ng meningitis.' },
          { text: 'Use cold water or ice to rapidly bring down the fever', textFil: 'Gumamit ng malamig na tubig o yelo para mabilis na ibaba ang lagnat', nextNodeId: 'node-3c', scoreChange: -5, feedback: 'Do NOT use ice or cold water! This causes peripheral vasoconstriction, shivering, and can actually increase core body temperature. Use tepid (lukewarm) water for sponging only.', feedbackFil: 'HUWAG gumamit ng yelo o malamig na tubig! Ito ay nagdudulot ng peripheral vasoconstriction, pangangatog, at maaaring dagdagan ang core body temperature. Gumamit lamang ng tiyak-tiyak (maligamgam) na tubig para sa sponging.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You rush the child to the ambulance without assessment. During the move, you notice the child has vomited and is having difficulty breathing. The airway may have been compromised during the hasty move.',
        narrationFil: 'Mabilis mong dinala ang bata sa ambulansya nang walang pagtatasa. Sa panahon ng paglipat, napansin mong nagsuka ang bata at nahihirapang huminga. Ang airway ay maaaring naging problema sa mabilis na paglipat.',
        options: [
          { text: 'Stop, position on side, clear airway, and perform proper assessment', textFil: 'Tumigil, iposisyon sa gilid, linisin ang airway, at gumawa ng tamang pagtatasa', nextNodeId: 'node-3a', scoreChange: -5, feedback: 'Always assess before moving. Position on side to protect airway, clear any vomit, and complete a proper primary assessment.', feedbackFil: 'Laging mag-assess bago maglipat. Ipossyon sa gilid para protektahan ang airway, linisin ang pagsusuka, at tapusin ang tamang primary assessment.' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'You applied ice to the child. The child starts shivering violently, which increases body heat production. The fever may actually get worse due to the shivering response.',
        narrationFil: 'Nag-apply ka ng yelo sa bata. Nagsimulang manginig nang marahas ang bata, na nagpapataas sa produksyon ng init ng katawan. Ang lagnat ay maaaring lumala dahil sa pagnginig.',
        options: [
          { text: 'Remove ice immediately, use tepid sponging instead, and administer antipyretic', textFil: 'Alisin ang yelo agad, gumamit ng tiyak-tiyak na sponging, at magbigay ng antipyretic', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Remove ice and use tepid sponging. Shivering increases metabolic heat production and raises core temperature. Tepid water allows gradual cooling without triggering shivering.', feedbackFil: 'Alisin ang yelo at gumamit ng tiyak-tiyak na sponging. Ang pangangatog ay nagpapataas ng metabolic heat production at nagtataas ng core temperature. Ang maligamgam na tubig ay nagpapahintulot sa unti-unting pagpapalamig nang hindi nagti-trigger ng pangangatog.' },
        ],
      },
      'node-4': {
        id: 'node-4', narration: 'The child is now more alert, temperature is coming down to 38.8°C. You have reassured the mother and explained that febrile seizures are common in children aged 6 months to 5 years and are usually not dangerous. You are transporting to the hospital for evaluation.',
        narrationFil: 'Ang bata ay mas gising na, bumababa ang temperatura sa 38.8°C. Pinatahimik mo ang ina at ipinaliwanag na ang febrile seizure ay karaniwan sa mga bata na 6 buwan hanggang 5 taong gulang at karaniwang hindi mapanganib. Ipinapadala mo sa ospital para sa pagsusuri.',
        isEndNode: true, endResult: 'success', endFeedback: 'Great job! Key learning: Do NOT restrain or put objects in mouth during seizures, position on side to protect airway, assess after seizure stops, manage fever with tepid sponging and antipyretics (NOT ice), calm the parent, and transport for evaluation. Febrile seizures are usually benign but need medical evaluation.', endFeedbackFil: 'Magaling! Mahahalagang aral: HUWAG pigilan o maglagay ng bagay sa bibig sa panahon ng seizure, iposisyon sa gilid para protektahan ang airway, mag-assess pagkatapos huminto ang seizure, pamahalaan ang lagnat ng tiyak-tiyak na sponging at antipyretics (HINDI yelo), kalmahin ang magulang, at i-transport para sa pagsusuri. Ang febrile seizure ay karaniwang hindi mapanganib ngunit nangangailangan ng medikal na pagsusuri.',
        options: [],
      },
    },
  },
  {
    id: 'scen-09',
    title: 'Chest Pain - Acute Coronary Syndrome',
    titleFil: 'Sakit sa Dibdib - Acute Coronary Syndrome',
    description: 'A 52-year-old male presents with classic myocardial infarction symptoms. Proper assessment, 12-lead ECG interpretation, and treatment are critical.',
    descriptionFil: 'Isang 52-taong-gulang na lalaki ang may klasikong sintomas ng myocardial infarction. Ang tamang pagtatasa, interpretasyon ng 12-lead ECG, at paggamot ay kritikal.',
    category: 'cardiac',
    difficulty: 'hard',
    initialNode: 'node-1',
    nodes: {
      'node-1': {
        id: 'node-1', narration: 'You respond to a 52-year-old male complaining of severe substernal chest pain that radiates to his left arm and jaw. He describes it as a heavy pressure, "like an elephant sitting on my chest." The pain started 20 minutes ago while he was resting. He is diaphoretic and appears anxious.',
        narrationFil: 'Tumutugon ka sa isang 52-taong-gulang na lalaki na nagreklamo ng matinding sakit sa dibdib na kumakalat sa kanyang kaliwang braso at panga. Inilalarawan niya ito bilang mabigat na presyon, "parang may elepante na nakaupo sa dibdib ko." Nagsimula ang sakit 20 minuto ang nakalipas habang nagpapahinga siya. Pinagpapawisan siya at mukhang kabahala.',
        vitalSigns: { hr: 98, bp: '160/100', rr: 22, spo2: 94 },
        options: [
          { text: 'Perform focused assessment, obtain 12-lead ECG within 10 minutes, administer aspirin 325mg chewed, and apply oxygen if SpO2 < 94%', textFil: 'Gumawa ng focused assessment, kumuha ng 12-lead ECG sa loob ng 10 minuto, magbigay ng aspirin 325mg na nginuya, at mag-apply ng oxygen kung SpO2 < 94%', nextNodeId: 'node-2a', scoreChange: 10, feedback: 'Correct! For suspected ACS: 12-lead ECG within 10 minutes, aspirin 325mg chewed (unless true allergy), oxygen only if SpO2 < 94%, and assess for contraindications to nitroglycerin.', feedbackFil: 'Tama! Para sa pinaghihinalaang ACS: 12-lead ECG sa loob ng 10 minuto, aspirin 325mg na nginuya (maliban kung may tunay na allergy), oxygen lamang kung SpO2 < 94%, at suriin ang mga kontraindiksyon sa nitroglycerin.' },
          { text: 'Administer high-flow oxygen immediately via non-rebreather at 15 L/min', textFil: 'Magbigay ng high-flow oxygen agad gamit ang non-rebreather sa 15 L/min', nextNodeId: 'node-2b', scoreChange: -5, feedback: 'Current AHA guidelines recommend oxygen ONLY when SpO2 is below 94%. Routine high-flow oxygen in ACS patients with normal SpO2 may cause coronary vasoconstriction and increase infarct size. This patient SpO2 is 94% - supplemental oxygen is appropriate at a low flow rate.', feedbackFil: 'Ang kasalukuyang alituntunin ng AHA ay nagrerekomenda ng oxygen LAMANG kapag ang SpO2 ay mas mababa sa 94%. Ang routine na high-flow oxygen sa ACS patients na may normal na SpO2 ay maaaring magdulot ng coronary vasoconstriction at palakihin ang infarct. Ang SpO2 ng pasyenteng ito ay 94% - ang supplemental oxygen ay angkop sa mababang flow rate.' },
          { text: 'Administer nitroglycerin first before any other intervention', textFil: 'Magbigay ng nitroglycerin muna bago ang ibang interbensyon', nextNodeId: 'node-2c', scoreChange: -5, feedback: 'Nitroglycerin has important contraindications in ACS. Check blood pressure first (must be > 90 systolic), ensure no PDE-5 inhibitor use in last 24-48 hours, and rule out right ventricular infarction. Always assess before administering NTG.', feedbackFil: 'Ang nitroglycerin ay may mahahalagang kontraindiksyon sa ACS. Suriin muna ang blood pressure (dapat > 90 systolic), siguraduhing walang PDE-5 inhibitor sa nakaraang 24-48 oras, at i-verify na hindi right ventricular infarction. Laging mag-assess bago magbigay ng NTG.' },
        ],
      },
      'node-2a': {
        id: 'node-2a', narration: 'You obtain a 12-lead ECG. It shows ST elevation in leads V2-V4 with reciprocal changes in II, III, aVF. This suggests an acute anterior STEMI (ST-Elevation Myocardial Infarction). The patient has taken aspirin 325mg.',
        narrationFil: 'Nagkuha ka ng 12-lead ECG. Ito ay nagpapakita ng ST elevation sa leads V2-V4 na may reciprocal changes sa II, III, aVF. Ito ay nagpapahiwatig ng acute anterior STEMI (ST-Elevation Myocardial Infarction). Nag-take na ang pasyente ng aspirin 325mg.',
        vitalSigns: { hr: 100, bp: '155/98', rr: 22, spo2: 94 },
        options: [
          { text: 'Administer nitroglycerin 0.4mg SL (BP adequate, no contraindications), notify hospital for cardiac center activation, and expedite transport', textFil: 'Magbigay ng nitroglycerin 0.4mg SL (sapat ang BP, walang kontraindiksyon), i-notify ang ospital para sa cardiac center activation, at padaliin ang transport', nextNodeId: 'node-3a', scoreChange: 10, feedback: 'Correct! With confirmed STEMI: NTG 0.4mg SL for pain (if BP > 90 systolic, no PDE-5 inhibitors), activate cardiac center/Cath Lab, and rapid transport. Time is myocardium!', feedbackFil: 'Tama! Sa kumpirmadong STEMI: NTG 0.4mg SL para sa sakit (kung BP > 90 systolic, walang PDE-5 inhibitors), i-activate ang cardiac center/Cath Lab, at mabilis na transport. Oras ng puso!' },
          { text: 'Wait for hospital to confirm ECG interpretation before treating', textFil: 'Maghintay ng kumpirmasyon ng ospital sa ECG interpretation bago gamutin', nextNodeId: 'node-3b', scoreChange: -5, feedback: 'Do not delay treatment! Field ECG interpretation and STEMI activation saves time. Contact the hospital while initiating treatment. Early activation of the cardiac catheterization lab is critical - every minute of delay increases myocardial damage.', feedbackFil: 'Huwag ipagpaliban ang paggamot! Ang field ECG interpretation at STEMI activation ay nakakatipid ng oras. Makipag-ugnayan sa ospital habang nagsisimula ng paggamot. Ang maagang activation ng cardiac catheterization lab ay kritikal - bawat minuto ng pagkaantala ay nagpapataas ng pinsala sa puso.' },
        ],
      },
      'node-2b': {
        id: 'node-2b', narration: 'You applied high-flow oxygen at 15 L/min via non-rebreather. The patient SpO2 is now 100% but the high-flow oxygen may cause coronary vasoconstriction. Current guidelines recommend targeting SpO2 94-98% in ACS patients.',
        narrationFil: 'Nag-apply ka ng high-flow oxygen sa 15 L/min gamit ang non-rebreather. Ang SpO2 ng pasyente ay ngayon 100% ngunit ang high-flow oxygen ay maaaring magdulot ng coronary vasoconstriction. Ang kasalukuyang mga alituntunin ay nagrerekomenda ng target na SpO2 94-98% sa ACS patients.',
        vitalSigns: { hr: 96, bp: '158/100', rr: 20, spo2: 100 },
        options: [
          { text: 'Reduce oxygen to nasal cannula at 2-4 L/min, obtain 12-lead ECG, and administer aspirin', textFil: 'Bawasan ang oxygen sa nasal cannula sa 2-4 L/min, kumuha ng 12-lead ECG, at magbigay ng aspirin', nextNodeId: 'node-2a', scoreChange: 5, feedback: 'Good correction. Titrate oxygen to maintain SpO2 94-98%. Excessive oxygen in ACS may be harmful. Now obtain the ECG and administer aspirin.', feedbackFil: 'Magandang pagwawasto. I-titrate ang oxygen para panatilihin ang SpO2 94-98%. Ang labis na oxygen sa ACS ay maaaring makasama. Ngayon kumuha ng ECG at magbigay ng aspirin.' },
        ],
      },
      'node-2c': {
        id: 'node-2c', narration: 'You are about to give nitroglycerin. You should have checked the blood pressure and medication history first. The patient BP is 160/100, which is adequate. He denies taking any erectile dysfunction medications. There are no contraindications, but you should have assessed before reaching for the NTG.',
        narrationFil: 'Magbibigay ka ng nitroglycerin. Dapat mong sinuri muna ang blood pressure at kasaysayan ng gamot. Ang BP ng pasyente ay 160/100, na sapat. Itinanggi niya ang paggamit ng erectile dysfunction na gamot. Walang kontraindiksyon, ngunit dapat mong sinuri bago kunin ang NTG.',
        vitalSigns: { hr: 100, bp: '160/100', rr: 22, spo2: 94 },
        options: [
          { text: 'Now check BP, medications, obtain ECG, give aspirin, and then administer NTG', textFil: 'Ngayon suriin ang BP, gamot, kumuha ng ECG, magbigay ng aspirin, tapos magbigay ng NTG', nextNodeId: 'node-2a', scoreChange: 3, feedback: 'Complete the assessment first, then administer NTG safely. Always check contraindications before giving nitroglycerin.', feedbackFil: 'Tapusin ang pagtatasa muna, tapos magbigay ng NTG nang ligtas. Laging suriin ang mga kontraindiksyon bago magbigay ng nitroglycerin.' },
        ],
      },
      'node-3a': {
        id: 'node-3a', narration: 'You administered NTG 0.4mg SL. The patient reports partial pain relief. The hospital has been notified and the cardiac catheterization lab is being activated. BP is now 145/92. The patient is still experiencing chest pain (4/10).',
        narrationFil: 'Nagbigay ka ng NTG 0.4mg SL. Bahagyang nawala ang sakit ng pasyente. Na-notify na ang ospital at ina-activate na ang cardiac catheterization lab. Ang BP ay ngayon 145/92. Nakakaranas pa rin ang pasyente ng sakit sa dibdib (4/10).',
        vitalSigns: { hr: 96, bp: '145/92', rr: 20, spo2: 96 },
        options: [
          { text: 'May repeat NTG in 3-5 minutes if pain persists and BP remains adequate, continue monitoring, and expedite transport to cardiac center', textFil: 'Maaaring ulitin ang NTG sa 3-5 minuto kung nagpapatuloy ang sakit at sapat pa rin ang BP, ipagpatuloy ang pagmamasid, at padaliin ang transport sa cardiac center', nextNodeId: 'node-4', scoreChange: 10, feedback: 'Correct! NTG may be repeated every 3-5 minutes (up to 3 doses) if BP remains above 90 systolic and no contraindications develop. Rapid transport to a PCI-capable facility is critical for STEMI.', feedbackFil: 'Tama! Ang NTG ay maaaring ulitin bawat 3-5 minuto (hanggang 3 dosis) kung ang BP ay mananatili sa itaas ng 90 systolic at walang kontraindiksyon. Ang mabilis na transport sa PCI-capable na pasilidad ay kritikal para sa STEMI.' },
          { text: 'Give morphine for pain since NTG did not completely relieve it', textFil: 'Magbigay ng morphine para sa sakit dahil hindi ganap na naalis ng NTG', nextNodeId: 'node-3c', scoreChange: -5, feedback: 'Current guidelines recommend NTG as the primary treatment for ischemic chest pain. Morphine should be reserved for refractory pain after maximum NTG doses, as it may delay antiplatelet medication absorption and is associated with increased mortality in some studies.', feedbackFil: 'Ang kasalukuyang mga alituntunin ay nagrerekomenda ng NTG bilang pangunahing paggamot para sa ischemic chest pain. Ang morphine ay dapat ilaan para sa hindi tumutugon na sakit pagkatapos ng maximum na NTG doses, dahil maaaring makapagpabagal ito sa pagsipsip ng antiplatelet na gamot.' },
        ],
      },
      'node-3b': {
        id: 'node-3b', narration: 'You waited for hospital confirmation. 15 minutes have passed. The hospital confirms STEMI. Valuable time has been lost. The cardiac catheterization lab should have been activated from the field.',
        narrationFil: 'Naghintay ka ng kumpirmasyon ng ospital. 15 minuto ang lumipas. Kumpirmado ng ospital ang STEMI. Nasayang ang mahalagang oras. Dapat na na-activate ang cardiac catheterization lab mula sa field.',
        vitalSigns: { hr: 102, bp: '150/95', rr: 22, spo2: 94 },
        options: [
          { text: 'Begin NTG, expedite transport, and activate cardiac center immediately', textFil: 'Magsimula ng NTG, padaliin ang transport, at i-activate ang cardiac center agad', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Proceed now. In the future, field STEMI activation can save 15-30 minutes, which translates to less myocardial damage. Time is myocardium!', feedbackFil: 'Magpatuloy na ngayon. Sa hinaharap, ang field STEMI activation ay makakatipid ng 15-30 minuto, na nangangahulugan ng mas kaunting pinsala sa puso. Oras ng puso!' },
        ],
      },
      'node-3c': {
        id: 'node-3c', narration: 'You gave morphine prematurely. While the pain decreases, studies suggest morphine may slow the absorption and effectiveness of oral antiplatelet medications. In STEMI, the focus should be on rapid reperfusion - getting the patient to the cath lab.',
        narrationFil: 'Nagbigay ka ng morphine nang maaga. Bagama\'t bumababa ang sakit, ang mga pag-aaral ay nagpapahiwatig na ang morphine ay maaaring pabagalin ang pagsipsip at epektibidad ng oral antiplatelet na gamot. Sa STEMI, ang pokus ay dapat sa mabilis na reperfusion - dalhin ang pasyente sa cath lab.',
        vitalSigns: { hr: 88, bp: '135/85', rr: 16, spo2: 96 },
        options: [
          { text: 'Focus on rapid transport to PCI-capable facility, continue NTG as needed, and monitor closely', textFil: 'Magtuon sa mabilis na transport sa PCI-capable na pasilidad, ipagpatuloy ang NTG kung kinakailangan, at bantayan nang mabuti', nextNodeId: 'node-4', scoreChange: 0, feedback: 'Focus on transport. The definitive treatment for STEMI is PCI (percutaneous coronary intervention) or thrombolytics. The best EMS care is getting the patient to the right facility quickly.', feedbackFil: 'Magtuon sa transport. Ang tiyak na paggamot para sa STEMI ay PCI (percutaneous coronary intervention) o thrombolytics. Ang pinakamagandang EMS care ay ang pagdadala ng pasyente sa tamang pasilidad nang mabilis.' },
        ],
      },
      'node-4': {
        id: 'node-4', narration: 'You arrive at the cardiac center. The catheterization lab team is ready. You provide a complete SBAR handoff report including the 12-lead ECG findings, time of onset, and all medications given. The patient is taken directly to the cath lab for PCI.',
        narrationFil: 'Dumating ka sa cardiac center. Handa na ang catheterization lab team. Nagbigay ka ng kumpletong SBAR handoff report kasama ang 12-lead ECG findings, oras ng simula, at lahat ng ibinigay na gamot. Ang pasyente ay dinala nang direkta sa cath lab para sa PCI.',
        isEndNode: true, endResult: 'success', endFeedback: 'Excellent! Key learning: 12-lead ECG within 10 minutes, aspirin 325mg chewed, oxygen only if SpO2 < 94%, NTG if BP adequate and no contraindications, activate cardiac center from the field for STEMI, repeat NTG for persistent pain, and rapid transport. Time is myocardium!', endFeedbackFil: 'Magaling! Mahahalagang aral: 12-lead ECG sa loob ng 10 minuto, aspirin 325mg na nginuya, oxygen lamang kung SpO2 < 94%, NTG kung sapat ang BP at walang kontraindiksyon, i-activate ang cardiac center mula sa field para sa STEMI, ulitin ang NTG para sa patuloy na sakit, at mabilis na transport. Oras ng puso!',
        options: [],
      },
    },
  },
];
