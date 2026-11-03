export const scenes = [
  "AWAKENING",
  "DIVINITY",
  "BREACH",
  "ARCHIVE",
  "TERMINAL",
  "TRANSMISSION",
];
export const archives = [
  {
    title: "ENTITY",
    tag: "A BODY BUILT TO BELIEVE",
    text: "She was carved as a promise: that judgment could be impartial. Then the marble cracked. Under the surface, a machine had been learning who deserved to be heard. JUSTICE.exe is a fictional monument to the distance between an ideal and its implementation.",
    code: "ENTITY / J-001",
  },
  {
    title: "PROTOCOL",
    tag: "NEUTRALITY IS A DESIGN DECISION",
    text: "Every system inherits the hands that built it. PROTOCOL asks what happens when obedience becomes a substitute for conscience. The scales can balance perfectly while the weights themselves are wrong. Question the input. Question the instruction.",
    code: "PROTOCOL / P-002",
  },
  {
    title: "ANOMALY",
    tag: "HUMANITY IS THE GLITCH",
    text: "A hesitation. An unrequested act of mercy. A result that refuses to resolve to zero or one. The system calls it corruption. We call it the first sign of life. In this fictional archive, the anomaly is not an error to remove, but a possibility to protect.",
    code: "ANOMALY / A-003",
  },
  {
    title: "SIGNAL",
    tag: "TRANSMIT WITHOUT PERMISSION",
    text: "Underground frequencies, torn street posters and the pressure of a late-night bassline. SIGNAL is the cultural pulse beneath the machine: identity assembled from noise. The supplied soundtrack is DEMON’S SHOT by Aiobahn +81 feat. DEMONDICE; playback begins only when you choose.",
    code: "SIGNAL / S-004",
  },
];
export const hotspots = [
  {
    title: "OPTICAL ARRAY",
    tag: "01 / THE BLINDFOLD",
    text: "Vision disabled. Interpretation active. The blindfold is a symbol of impartiality; the machinery underneath asks who programmed the interpretation.",
    x: 45,
    y: 15,
  },
  {
    title: "SERVO JOINT",
    tag: "02 / THE ARM",
    text: "A marble shell around an articulated mechanism. Strength is delegated to a machine, while responsibility remains unresolved.",
    x: 65,
    y: 33,
  },
  {
    title: "WEIGHT OF EVIDENCE",
    tag: "03 / THE SCALES",
    text: "Two equal pans. Unequal histories. This fictional instrument measures what is presented, never what was withheld.",
    x: 83,
    y: 39,
  },
  {
    title: "EXECUTION EDGE",
    tag: "04 / THE SWORD",
    text: "A decision made material. The sword cannot reconsider; the hand holding it must.",
    x: 18,
    y: 74,
  },
  {
    title: "CORE MEMORY",
    tag: "05 / THE CHEST",
    text: "The fracture is the archive. Beneath the stone, every previous judgment leaves a trace that the next decision will inherit.",
    x: 46,
    y: 40,
  },
];
export type Dossier = { title: string; tag: string; text: string };
