const trackList = [
  {
    id: "battle-cry",
    name: "Battle Cry",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/battle-cry-epic-cinematic-action-music-336328.mp3",
  },
  {
    id: "caves-of-dawn",
    name: "Caves of Dawn",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/caves-of-dawn-10376.mp3",
  },
  {
    id: "dark-music",
    name: "Dark Music",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/dark-music-249503.mp3",
  },
  {
    id: "dream-market",
    name: "Dream Market",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/dream-market-338477.mp3",
  },
  {
    id: "epic-anxious",
    name: "Epic Anxious Dramatic",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/epic-anxious-dark-dramatic-tragic-mystical-238468.mp3",
  },
  {
    id: "ghost-flowers",
    name: "Ghost Flowers",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/ghost-flowers-153303.mp3",
  },
  {
    id: "hopeless",
    name: "Hopeless",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/hopeless-119866.mp3",
  },
  {
    id: "late-hours",
    name: "Late Hours",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/late-hours-108446.mp3",
  },
  {
    id: "musik-taverne",
    name: "Musik Taverne",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/musik-taverne-142726.mp3",
  },
  {
    id: "never-again",
    name: "Never Again",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/never-again-108445.mp3",
  },
  {
    id: "sacred-garden",
    name: "Sacred Garden",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/sacred-garden-10377.mp3",
  },
  {
    id: "stealth-battle",
    name: "Stealth Battle",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/stealth-battle-205902.mp3",
  },
  {
    id: "terror-heights",
    name: "Terror Heights",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/terror-heights-dark-ambience-230667.mp3",
  },
  {
    id: "white-lion",
    name: "The White Lion",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/the-white-lion-10379.mp3",
  },
  {
    id: "transient",
    name: "Transient",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/transient-204416.mp3",
  },
  {
    id: "war-battle",
    name: "War Battle Military Drums",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/war-battle-military-drums-318680.mp3",
  },
  {
    id: "test",
    name: "Test",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/toy-story-short-happy-audio-logo-short-cartoony-intro-outro-music-125627.mp3",
  },
  {
    id: "medieval-ambient-236809",
    name: "Medieval Ambient",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/medieval-ambient-236809.mp3",
  },
  {
    id: "phantom-resonance-325412",
    name: "Phantom Resonance",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/phantom-resonance-325412.mp3",
  },
  {
    id: "desert-cloud-158702",
    name: "Desert Cloud",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/desert-cloud-158702.mp3",
  },
  {
    id: "subterranean-serenade-serenata-subterranea-288134",
    name: "Subterranean Serenade",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/subterranean-serenade-serenata-subterranea-288134.mp3",
  },
  {
    id: "battle-of-the-dragons-8037",
    name: "Battle of the Dragons",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/battle-of-the-dragons-8037.mp3",
  },
  {
    id: "pirate-tavern-117281",
    name: "Pirate Tavern",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/pirate-tavern-117281.mp3",
  },
  {
    id: "informa-irish-tavern-162997",
    name: "Informa Irish Tavern",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/informa-irish-tavern-162997.mp3",
  },
  {
    id: "pirate-bay-357746",
    name: "Pirate Bay",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/pirate-bay-357746.mp3",
  },
  {
    id: "fantasy-medieval-ambient-237371",
    name: "Fantasy Medieval Ambient",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/fantasy-medieval-ambient-237371.mp3",
  },
  {
    id: "medieval-citytavern-ambient-235876",
    name: "Medieval City Tavern",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/medieval-citytavern-ambient-235876.mp3",
  },
  {
    id: "midnight-forest-184304",
    name: "Midnight Forest",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/midnight-forest-184304.mp3",
  },
  {
    id: "tense-suspense-background-music-320439",
    name: "Tense Suspense Background Music",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/tense-suspense-background-music-320439.mp3",
  },
  {
    id: "scary-horror-dark-music-372674",
    name: "Scary Horror Dark Music",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/scary-horror-dark-music-372674.mp3",
  },
  {
    id: "scary-horror-creepy-music-371663",
    name: "Scary Horror Creepy Music",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/scary-horror-creepy-music-371663.mp3",
  },
  {
    id: "island-of-the-lost-dark-fantasy-background-music-110368",
    name: "Island of the Lost (Dark Fantasy)",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/island-of-the-lost-dark-fantasy-background-music-110368.mp3",
  },
  {
    id: "forgotten-land-epic-dark-fantasy-195835",
    name: "Forgotten Land (Epic Dark Fantasy)",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/forgotten-land-epic-dark-fantasy-195835.mp3",
  },
  {
    id: "forgotten-crypts-gothic-dark-fantasy-haunting-316858",
    name: "Forgotten Crypts (Gothic Haunting)",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/forgotten-crypts-gothic-dark-fantasy-haunting-316858.mp3",
  },
  {
    id: "wizard-rider-enchanted-fantasy-orchestral-369658",
    name: "Wizard Rider (Fantasy Orchestral)",
    url: "https://raw.githubusercontent.com/BrandonTrundle/arcana-music-assets/main/wizard-rider-enchanted-fantasy-orchestral-369658.mp3",
  },
];
export default trackList;
