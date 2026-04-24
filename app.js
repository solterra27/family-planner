// ─────────────────────────────────────────────────────────────
// Family Planner PWA  •  app.js
// Self-contained React app (UMD build, no bundler needed)
// ─────────────────────────────────────────────────────────────
const { useState, useEffect, useRef, useCallback } = React;

// ── Storage helpers ──────────────────────────────────────────
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v)   => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const TODAY_KEY = () => new Date().toISOString().slice(0, 10); // "2025-04-23"

// ── Data ─────────────────────────────────────────────────────
const DAYS      = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const FULL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const SCHEDULE = {
  Mon: [
    { time:"5:00–6:00 AM",  task:"Workout / Run",                      cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"👧 Help Daughter Get Ready",          cat:"family"  },
    { time:"8:00–8:45 AM",  task:"🚗 Drop off at In-Laws & Return",     cat:"family"  },
    { time:"8:45–10:00 AM", task:"Learning Block",                      cat:"learning"},
    { time:"10:00–12:00 PM",task:"Goal Work / Focus",                   cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Learning / Study",                    cat:"learning"},
    { time:"3:00–5:00 PM",  task:"Home / Admin",                        cat:"home"    },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Reading / Learn",                     cat:"learning"},
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Tue: [
    { time:"5:00–6:00 AM",  task:"Workout / Run",                      cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"👧 Help Daughter Get Ready",          cat:"family"  },
    { time:"8:00–8:45 AM",  task:"🚗 Drop off at In-Laws & Return",     cat:"family"  },
    { time:"8:45–10:00 AM", task:"Learning Block",                      cat:"learning"},
    { time:"10:00–12:00 PM",task:"Goal Work / Focus",                   cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Learning / Study",                    cat:"learning"},
    { time:"3:00–5:00 PM",  task:"Strength Training",                   cat:"fitness" },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–6:30 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"6:30–8:00 PM",  task:"🌿 Mow Lawn (weather permitting)",    cat:"home"    },
    { time:"8:00–8:15 PM",  task:"🗑 Take Trash to Curb",               cat:"home"    },
    { time:"8:15–9:00 PM",  task:"Wind Down",                           cat:"routine" },
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Wed: [
    { time:"5:00–6:00 AM",  task:"Stretch / Yoga",                     cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"👧 Help Daughter Get Ready",          cat:"family"  },
    { time:"8:00–8:45 AM",  task:"🚗 Drop off at In-Laws & Return",     cat:"family"  },
    { time:"8:45–9:00 AM",  task:"🗑 Bring Trash Can Back from Curb",   cat:"home"    },
    { time:"9:00–10:00 AM", task:"Learning Block",                      cat:"learning"},
    { time:"10:00–12:00 PM",task:"Goal Work / Focus",                   cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Learning / Study",                    cat:"learning"},
    { time:"3:00–5:00 PM",  task:"Home / Admin",                        cat:"home"    },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Reading / Learn",                     cat:"learning"},
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Thu: [
    { time:"5:00–6:00 AM",  task:"Workout / Run",                      cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"Family / Morning Prep",               cat:"family"  },
    { time:"8:00–10:00 AM", task:"Learning Block",                      cat:"learning"},
    { time:"10:00–12:00 PM",task:"Goal Work / Focus",                   cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Learning / Study",                    cat:"learning"},
    { time:"3:00–5:00 PM",  task:"Strength Training",                   cat:"fitness" },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Wind Down",                           cat:"routine" },
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Fri: [
    { time:"5:00–6:00 AM",  task:"Stretch / Yoga",                     cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"Family / Morning Prep",               cat:"family"  },
    { time:"8:00–10:00 AM", task:"Learning Block",                      cat:"learning"},
    { time:"10:00–12:00 PM",task:"Goal Work / Focus",                   cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Errands / Prep",                      cat:"home"    },
    { time:"3:00–5:00 PM",  task:"Home / Admin",                        cat:"home"    },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Family Fun Night 🎉",                 cat:"family"  },
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Sat: [
    { time:"5:00–6:00 AM",  task:"Long Run / Hike",                    cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"Family / Morning Prep",               cat:"family"  },
    { time:"8:00–9:00 AM",  task:"Deep Clean",                          cat:"home"    },
    { time:"9:00–10:00 AM", task:"Home Projects",                       cat:"home"    },
    { time:"10:00–12:00 PM",task:"Goals / Projects",                    cat:"goals"   },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Family Time 👨‍👩‍👧",                     cat:"family"  },
    { time:"3:00–5:00 PM",  task:"Free Time 🎉",                        cat:"family"  },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Flexible",                            cat:"routine" },
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
  Sun: [
    { time:"5:00–6:00 AM",  task:"Rest / Recovery",                    cat:"fitness" },
    { time:"6:00–6:20 AM",  task:"🐕 Morning Dog Walk (~15–20 min)",    cat:"pet"     },
    { time:"6:20–7:00 AM",  task:"Morning Routine",                     cat:"routine" },
    { time:"7:00–7:30 AM",  task:"Family Breakfast",                    cat:"family"  },
    { time:"7:30–8:00 AM",  task:"Family / Morning Prep",               cat:"family"  },
    { time:"8:00–9:00 AM",  task:"Read / Relax 📖",                     cat:"learning"},
    { time:"9:00–10:00 AM", task:"Outdoor / Garden",                    cat:"home"    },
    { time:"10:00–12:00 PM",task:"Family Activity",                     cat:"family"  },
    { time:"12:00–1:00 PM", task:"Lunch + Break",                       cat:"health"  },
    { time:"1:00–1:20 PM",  task:"🐕 Afternoon Dog Walk (~15–20 min)",  cat:"pet"     },
    { time:"1:20–3:00 PM",  task:"Family Time",                         cat:"family"  },
    { time:"3:00–5:00 PM",  task:"Free Time",                           cat:"family"  },
    { time:"5:00–6:00 PM",  task:"Meal Prep / Cook",                    cat:"home"    },
    { time:"6:00–7:00 PM",  task:"Family Dinner",                       cat:"family"  },
    { time:"7:00–8:30 PM",  task:"Prep Week Ahead 📋",                  cat:"goals"   },
    { time:"9:15–9:30 PM",  task:"🐕 Night Dog Walk (~10–15 min)",      cat:"pet"     },
    { time:"9:30–10:00 PM", task:"Night Routine",                       cat:"routine" },
  ],
};

const DAILY_CHECKLIST = [
  { id:"water",     label:"Drink 8 glasses of water",            cat:"health",   icon:"💧" },
  { id:"exercise",  label:"Complete workout / movement",         cat:"fitness",  icon:"🏋️" },
  { id:"morning",   label:"Full morning routine",                cat:"routine",  icon:"🌅" },
  { id:"dog_am",    label:"🐕 Morning dog walk (~15–20 min)",    cat:"pet",      icon:"🐾" },
  { id:"breakfast", label:"Healthy breakfast with family",       cat:"family",   icon:"🍳" },
  { id:"daughter",  label:"👧 Help daughter get ready",          cat:"family",   icon:"👧" },
  { id:"learn",     label:"30 min learning / study",             cat:"learning", icon:"📚" },
  { id:"goal",      label:"Work on a goal / project",            cat:"goals",    icon:"🎯" },
  { id:"home",      label:"Complete 1 home task",                cat:"home",     icon:"🏠" },
  { id:"dog_pm",    label:"🐕 Afternoon dog walk (~15–20 min)",  cat:"pet",      icon:"🐾" },
  { id:"meal_prep", label:"Meal prep / cook dinner",             cat:"home",     icon:"🥗" },
  { id:"family",    label:"Quality family time (no screens)",    cat:"family",   icon:"👨‍👩‍👧" },
  { id:"steps",     label:"Hit 8,000+ steps",                    cat:"fitness",  icon:"👟" },
  { id:"read_eve",  label:"Evening reading 20 min",              cat:"learning", icon:"📖" },
  { id:"journal",   label:"Journal / reflect",                   cat:"goals",    icon:"✍️" },
  { id:"dog_night", label:"🐕 Night dog walk (~10–15 min)",      cat:"pet",      icon:"🐾" },
  { id:"sleep",     label:"Lights out by 10 PM",                 cat:"health",   icon:"🌙" },
];

const GOALS = [
  { id:"g1", title:"Run a 5K without stopping",      cat:"fitness",  target:"3 months", icon:"🏃" },
  { id:"g2", title:"Read 12 books this year",         cat:"learning", target:"Year-end", icon:"📚" },
  { id:"g3", title:"Complete an online course",       cat:"learning", target:"2 months", icon:"🎓" },
  { id:"g4", title:"Declutter & organize home",       cat:"home",     target:"6 weeks",  icon:"🏠" },
  { id:"g5", title:"Establish meal prep routine",     cat:"home",     target:"4 weeks",  icon:"🥗" },
  { id:"g6", title:"Screen-free family evenings",     cat:"family",   target:"Ongoing",  icon:"📵" },
  { id:"g7", title:"Build consistent sleep schedule", cat:"health",   target:"Ongoing",  icon:"💤" },
];

const CAT_STYLES = {
  fitness:  { bg:"#EF476F", label:"Fitness",  dark:false },
  learning: { bg:"#00B4D8", label:"Learning", dark:false },
  goals:    { bg:"#0F3460", label:"Goals",    dark:false },
  home:     { bg:"#FFD166", label:"Home",     dark:true  },
  family:   { bg:"#06D6A0", label:"Family",   dark:true  },
  pet:      { bg:"#A78BFA", label:"Dog",      dark:false },
  health:   { bg:"#90E0EF", label:"Health",   dark:true  },
  routine:  { bg:"#ADB5BD", label:"Routine",  dark:false },
};

// ── Notification reminders schedule ──────────────────────────
const REMINDERS = [
  { id:"r1",  label:"Morning Workout",        time:"05:00", days:[1,2,3,4,5],     icon:"🏋️" },
  { id:"r2",  label:"Morning Dog Walk",       time:"06:00", days:[0,1,2,3,4,5,6], icon:"🐕" },
  { id:"r3",  label:"Help Daughter Get Ready",time:"07:30", days:[1,2,3],         icon:"👧" },
  { id:"r4",  label:"Drop Off at In-Laws",    time:"08:00", days:[1,2,3],         icon:"🚗" },
  { id:"r5",  label:"Afternoon Dog Walk",     time:"13:00", days:[0,1,2,3,4,5,6], icon:"🐕" },
  { id:"r6",  label:"Meal Prep / Cook",       time:"17:00", days:[0,1,2,3,4,5,6], icon:"🍳" },
  { id:"r7",  label:"Night Dog Walk",         time:"21:15", days:[0,1,2,3,4,5,6], icon:"🐕" },
  { id:"r8",  label:"Take Trash to Curb 🗑",  time:"20:00", days:[2],             icon:"🗑" },
  { id:"r9",  label:"Bring Trash Can Back 🗑",time:"09:00", days:[3],             icon:"🗑" },
  { id:"r10", label:"Wind Down for Bed",      time:"21:30", days:[0,1,2,3,4,5,6], icon:"🌙" },
];

// ─────────────────────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────────────────────
function App() {
  const todayIdx = (new Date().getDay() + 6) % 7;

  // ── Persistent state (localStorage) ──
  const [activeTab,       setActiveTab]       = useState("schedule");
  const [activeDay,       setActiveDay]       = useState(DAYS[todayIdx]);
  const [checked,         setChecked]         = useState(() => LS.get(`checked_${TODAY_KEY()}`, {}));
  const [goalProgress,    setGoalProgress]    = useState(() => LS.get("goalProgress", {}));
  const [completedBlocks, setCompletedBlocks] = useState(() => LS.get(`blocks_${TODAY_KEY()}`, {}));
  const [customChecklist, setCustomChecklist] = useState(() => LS.get("customChecklist", []));
  const [customSchedule,  setCustomSchedule]  = useState(() => LS.get("customSchedule", []));
  const [meals,           setMeals]           = useState(() => LS.get(`meals_${TODAY_KEY()}`, []));
  const [targets,         setTargets]         = useState(() => LS.get("nutritionTargets", { calories:2400, protein:200, carbs:220, fat:75 }));
  const [remindersEnabled,setRemindersEnabled]= useState(() => LS.get("remindersEnabled", {}));
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');

  // ── Persist on change ──
  useEffect(() => { LS.set(`checked_${TODAY_KEY()}`,  checked);         }, [checked]);
  useEffect(() => { LS.set("goalProgress",            goalProgress);    }, [goalProgress]);
  useEffect(() => { LS.set(`blocks_${TODAY_KEY()}`,   completedBlocks); }, [completedBlocks]);
  useEffect(() => { LS.set("customChecklist",         customChecklist); }, [customChecklist]);
  useEffect(() => { LS.set("customSchedule",          customSchedule);  }, [customSchedule]);
  useEffect(() => { LS.set(`meals_${TODAY_KEY()}`,    meals);           }, [meals]);
  useEffect(() => { LS.set("nutritionTargets",        targets);         }, [targets]);
  useEffect(() => { LS.set("remindersEnabled",        remindersEnabled);}, [remindersEnabled]);

  // ── Nutrition ──
  const [mealInput,       setMealInput]       = useState({ name:"", calories:"", protein:"", carbs:"", fat:"", mealTime:"Breakfast" });
  const [showMealForm,    setShowMealForm]    = useState(false);
  const [editingTargets,  setEditingTargets]  = useState(false);
  const [tempTargets,     setTempTargets]     = useState({...targets});

  const totals = meals.reduce((a,m) => ({
    calories: a.calories + (Number(m.calories)||0),
    protein:  a.protein  + (Number(m.protein) ||0),
    carbs:    a.carbs    + (Number(m.carbs)   ||0),
    fat:      a.fat      + (Number(m.fat)     ||0),
  }), {calories:0,protein:0,carbs:0,fat:0});

  const addMeal = () => {
    if (!mealInput.name || !mealInput.calories) return;
    setMeals(p => [...p, {...mealInput, id:Date.now()}]);
    setMealInput({ name:"", calories:"", protein:"", carbs:"", fat:"", mealTime:"Breakfast" });
    setShowMealForm(false);
  };
  const macroColor = (v,t) => { const p=v/t; if(p>=0.95&&p<=1.1) return "#06D6A0"; if(p>1.1) return "#EF476F"; if(p>=0.7) return "#FFD166"; return "#90E0EF"; };

  // ── Checklist ──
  const checkedCount = [...DAILY_CHECKLIST, ...customChecklist].filter(t => checked[t.id]).length;
  const totalItems   = DAILY_CHECKLIST.length + customChecklist.length;
  const pct          = Math.round((checkedCount / totalItems) * 100);

  const toggleCheck = id => setChecked(p => ({...p, [id]: !p[id]}));
  const toggleBlock = (day, idx) => { const k=`${day}-${idx}`; setCompletedBlocks(p => ({...p, [k]: !p[k]})); };

  // ── Voice ──
  const [voiceActive,    setVoiceActive]    = useState(false);
  const [voiceTarget,    setVoiceTarget]    = useState(null);
  const [voiceTranscript,setVoiceTranscript]= useState("");
  const [voiceStatus,    setVoiceStatus]    = useState("");
  const [voiceParsed,    setVoiceParsed]    = useState(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const recogRef = useRef(null);

  const parseNutrition = t => {
    const lo=t.toLowerCase();
    const cal  = lo.match(/(\d+)\s*(cal|calorie|calories|kcal)/);
    const prot = lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:protein|of protein)/);
    const carb = lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:carb|carbs|carbohydrate)/);
    const fat  = lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:fat|fats)/);
    const mealTimes=["breakfast","morning snack","lunch","afternoon snack","dinner","evening snack"];
    let mealTime="Lunch";
    for(const mt of mealTimes){ if(lo.includes(mt)){ mealTime=mt.split(" ").map(w=>w[0].toUpperCase()+w.slice(1)).join(" "); break; } }
    const name=(t.match(/^([a-zA-Z\s,&'-]+?)(?:\s*[\d,]|$)/)||[])[1]?.trim().replace(/,$/,"")||t.split(/\d/)[0].trim()||"Meal";
    return { name, calories:cal?cal[1]:"", protein:prot?prot[1]:"", carbs:carb?carb[1]:"", fat:fat?fat[1]:"", mealTime };
  };
  const parseChecklist = t => ({ id:`voice_${Date.now()}`, label:t.trim(), cat:"goals", icon:"🎤" });
  const parseSchedule  = t => {
    const lo=t.toLowerCase();
    const timeMatch=t.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?(?:\s*(?:to|–|-)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?)/i);
    const dNames=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    let day=activeDay;
    dNames.forEach((d,i)=>{ if(lo.includes(d)) day=DAYS[i]; });
    const cats={fitness:["workout","run","gym","yoga","stretch"],learning:["study","learn","read","course"],home:["clean","cook","chores","errand"],family:["family","daughter","dinner"]};
    let cat="routine";
    for(const [c,kws] of Object.entries(cats)){ if(kws.some(k=>lo.includes(k))){ cat=c; break; } }
    const task=timeMatch?t.replace(timeMatch[0],"").replace(/\b(?:on\s)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,"").trim():t.trim();
    return { day, time:timeMatch?timeMatch[0].trim():"Flexible", task:task||t.trim(), cat };
  };

  const startVoice = target => {
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ setVoiceStatus("⚠️ Voice not supported. Use Chrome."); setShowVoiceModal(true); setVoiceTarget(target); return; }
    setVoiceTarget(target); setVoiceTranscript(""); setVoiceStatus("🎤 Listening..."); setVoiceParsed(null); setShowVoiceModal(true);
    const r=new SR(); recogRef.current=r;
    r.lang="en-US"; r.interimResults=true; r.maxAlternatives=1;
    r.onstart=()=>setVoiceActive(true);
    r.onresult=e=>{ const tr=Array.from(e.results).map(x=>x[0].transcript).join(""); setVoiceTranscript(tr); if(e.results[e.results.length-1].isFinal){ setVoiceActive(false); setVoiceStatus("✅ Got it! Review below."); if(target==="nutrition") setVoiceParsed({type:"nutrition",data:parseNutrition(tr)}); if(target==="checklist") setVoiceParsed({type:"checklist",data:parseChecklist(tr)}); if(target==="schedule") setVoiceParsed({type:"schedule",data:parseSchedule(tr)}); } };
    r.onerror=e=>{ setVoiceActive(false); setVoiceStatus(`⚠️ ${e.error}. Try again.`); };
    r.onend=()=>setVoiceActive(false);
    r.start();
  };
  const stopVoice=()=>{ recogRef.current?.stop(); setVoiceActive(false); };
  const confirmVoice=()=>{
    if(!voiceParsed) return;
    if(voiceParsed.type==="nutrition"){ setMealInput(voiceParsed.data); setShowMealForm(true); setActiveTab("nutrition"); }
    if(voiceParsed.type==="checklist"){ setCustomChecklist(p=>[...p,voiceParsed.data]); }
    if(voiceParsed.type==="schedule"){ setCustomSchedule(p=>[...p,{...voiceParsed.data,id:Date.now()}]); setActiveDay(voiceParsed.data.day); setActiveTab("schedule"); }
    setShowVoiceModal(false); setVoiceParsed(null); setVoiceTranscript("");
  };

  // ── Notifications ──
  const requestNotifPermission = async () => {
    if(typeof Notification==="undefined") return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if(perm==="granted") scheduleReminders();
  };

  const scheduleReminders = useCallback(() => {
    if(typeof Notification==="undefined" || Notification.permission!=="granted") return;
    const sw = navigator.serviceWorker?.controller;
    if(!sw) return;
    const now = new Date();
    REMINDERS.forEach(rem => {
      if(!remindersEnabled[rem.id]) return;
      const [h,m] = rem.time.split(":").map(Number);
      const fireTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
      if(fireTime <= now) return; // already passed today
      const delay = fireTime - now;
      sw.postMessage({ type:"SCHEDULE_NOTIFICATION", delay, title:`${rem.icon} ${rem.label}`, body:"Time for: "+rem.label, tag:rem.id });
    });
  }, [remindersEnabled]);

  useEffect(() => {
    if(notifPermission==="granted") scheduleReminders();
  }, [remindersEnabled, notifPermission, scheduleReminders]);

  const toggleReminder = id => setRemindersEnabled(p => ({...p, [id]: !p[id]}));

  // ── Tab config ──
  const tabs = [
    { id:"schedule",  label:"Schedule",  icon:"🗓" },
    { id:"checklist", label:"Checklist", icon:"✅" },
    { id:"nutrition", label:"Nutrition", icon:"🥗" },
    { id:"goals",     label:"Goals",     icon:"🎯" },
    { id:"alerts",    label:"Alerts",    icon:"🔔" },
  ];

  const MicBtn = ({ target, label }) => (
    React.createElement("button", {
      onClick: () => startVoice(target),
      style: { display:"flex",alignItems:"center",gap:6,background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.4)",borderRadius:10,padding:"7px 13px",color:"#A78BFA",fontSize:12,cursor:"pointer",fontWeight:"bold" }
    }, "🎤 ", label)
  );

  // ── Render ──
  return React.createElement("div", { style:{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",minHeight:"100vh",color:"#F0F4F8"} },

    // Voice Modal
    showVoiceModal && React.createElement("div", { style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20} },
      React.createElement("div", { style:{background:"#16213E",borderRadius:20,padding:24,width:"100%",maxWidth:420,border:"1px solid rgba(167,139,250,0.4)"} },
        React.createElement("div", { style:{fontWeight:"bold",fontSize:16,color:"#A78BFA",marginBottom:6} }, "🎤 Voice — ", voiceTarget==="nutrition"?"Meal":voiceTarget==="checklist"?"Checklist":"Schedule"),
        React.createElement("div", { style:{fontSize:11,color:"#90E0EF",marginBottom:16,lineHeight:1.6} },
          voiceTarget==="nutrition" ? 'Say: "Grilled chicken 450 calories 40 grams protein dinner"' :
          voiceTarget==="checklist" ? 'Say: "Pick up dry cleaning" or any task' :
          'Say: "Dentist at 2pm Thursday" or "Gym 6am Monday"'
        ),
        React.createElement("div", { style:{textAlign:"center",marginBottom:16} },
          React.createElement("div", {
            onClick: voiceActive ? stopVoice : () => startVoice(voiceTarget),
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:"50%",background:voiceActive?"rgba(239,71,111,0.2)":"rgba(167,139,250,0.15)",border:`3px solid ${voiceActive?"#EF476F":"#A78BFA"}`,fontSize:30,cursor:"pointer",boxShadow:voiceActive?"0 0 0 8px rgba(239,71,111,0.15)":"none",transition:"all 0.3s"}
          }, voiceActive ? "⏹" : "🎤"),
          React.createElement("div", { style:{fontSize:12,color:voiceActive?"#EF476F":"#90E0EF",marginTop:8} }, voiceActive?"Recording… tap to stop":"Tap to record")
        ),
        voiceTranscript && React.createElement("div", { style:{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#F0F4F8",marginBottom:14,border:"1px solid rgba(167,139,250,0.3)",fontStyle:"italic"} }, `"${voiceTranscript}"`),
        React.createElement("div", { style:{fontSize:12,color:"#90E0EF",marginBottom:14,textAlign:"center"} }, voiceStatus),
        voiceParsed && React.createElement("div", { style:{background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"12px 14px",marginBottom:14} },
          React.createElement("div", { style:{fontSize:11,color:"#06D6A0",fontWeight:"bold",marginBottom:8} }, "📋 Review before saving:"),
          voiceParsed.type==="nutrition" && Object.entries(voiceParsed.data).filter(([,v])=>v).map(([k,v]) =>
            React.createElement("div", { key:k, style:{fontSize:12,color:"#F0F4F8",marginBottom:3} },
              React.createElement("span", { style:{color:"#90E0EF",textTransform:"capitalize"} }, k, ": "), v
            )
          ),
          voiceParsed.type==="checklist" && React.createElement("div", { style:{fontSize:12,color:"#F0F4F8"} }, `➕ "${voiceParsed.data.label}"`),
          voiceParsed.type==="schedule"  && ["day","time","task","cat"].map(k =>
            React.createElement("div", { key:k, style:{fontSize:12,color:"#F0F4F8",marginBottom:3} },
              React.createElement("span", { style:{color:"#90E0EF",textTransform:"capitalize"} }, k, ": "), voiceParsed.data[k]
            )
          )
        ),
        React.createElement("div", { style:{display:"flex",gap:8} },
          voiceParsed && React.createElement("button", { onClick:confirmVoice, style:{flex:2,background:"#06D6A0",border:"none",borderRadius:10,padding:10,color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer"} }, "✅ Add it"),
          React.createElement("button", { onClick:()=>{ setShowVoiceModal(false); stopVoice(); setVoiceParsed(null); setVoiceTranscript(""); }, style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:10,color:"#90E0EF",fontSize:13,cursor:"pointer"} }, "Cancel")
        )
      )
    ),

    // Floating mic button
    React.createElement("button", {
      onClick: () => startVoice(activeTab==="nutrition"?"nutrition":activeTab==="checklist"?"checklist":"schedule"),
      style:{position:"fixed",bottom:24,right:20,zIndex:200,width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C3AED)",border:"none",fontSize:22,cursor:"pointer",boxShadow:"0 4px 20px rgba(124,58,237,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}
    }, "🎤"),

    // Header
    React.createElement("div", { style:{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(0,180,216,0.3)",padding:"16px 20px 10px",position:"sticky",top:0,zIndex:100} },
      React.createElement("div", { style:{maxWidth:800,margin:"0 auto"} },
        React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12} },
          React.createElement("div", null,
            React.createElement("div", { style:{fontSize:20,fontWeight:"bold",color:"#00B4D8"} }, "🗓 Family Planner"),
            React.createElement("div", { style:{fontSize:10,color:"#90E0EF",marginTop:1} }, "Health · Learning · Home · Family")
          ),
          React.createElement("div", { style:{background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.4)",borderRadius:12,padding:"5px 12px",fontSize:11,color:"#90E0EF",textAlign:"center"} },
            React.createElement("div", { style:{fontSize:16,fontWeight:"bold",color:pct===100?"#06D6A0":"#FFD166"} }, pct+"%"),
            React.createElement("div", null, "Today")
          )
        ),
        React.createElement("div", { style:{display:"flex",gap:4} },
          tabs.map(t => React.createElement("button", {
            key:t.id, onClick:()=>setActiveTab(t.id),
            style:{flex:1,padding:"7px 2px",borderRadius:10,border:"none",cursor:"pointer",fontSize:11,background:activeTab===t.id?"#00B4D8":"rgba(255,255,255,0.07)",color:activeTab===t.id?"#1A1A2E":"#90E0EF",fontWeight:activeTab===t.id?"bold":"normal",transition:"all 0.2s"}
          }, t.icon, " ", t.label))
        )
      )
    ),

    // Content
    React.createElement("div", { style:{maxWidth:800,margin:"0 auto",padding:"16px 14px 80px"} },

      // ── SCHEDULE ──
      activeTab==="schedule" && React.createElement("div", null,
        React.createElement("div", { style:{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4} },
          DAYS.map((d,i) => React.createElement("button", {
            key:d, onClick:()=>setActiveDay(d),
            style:{flex:"0 0 auto",padding:"7px 12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,background:activeDay===d?"#00B4D8":"rgba(255,255,255,0.08)",color:activeDay===d?"#1A1A2E":"#90E0EF",fontWeight:activeDay===d?"bold":"normal",borderBottom:i===todayIdx?"2px solid #FFD166":"2px solid transparent"}
          }, d, i===todayIdx&&React.createElement("div",{style:{fontSize:7,color:activeDay===d?"#0F3460":"#FFD166",marginTop:1}},"TODAY"))
        ),
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          React.createElement("div",{style:{fontSize:11,color:"#90E0EF",letterSpacing:1,textTransform:"uppercase"}},FULL_DAYS[DAYS.indexOf(activeDay)]),
          React.createElement(MicBtn,{target:"schedule",label:"Add via Voice"})
        ),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          [...SCHEDULE[activeDay],...customSchedule.filter(s=>s.day===activeDay)].map((block,idx)=>{
            const key=`${activeDay}-${idx}`;
            const done=completedBlocks[key];
            const s=CAT_STYLES[block.cat]||CAT_STYLES.routine;
            return React.createElement("div",{key:idx,onClick:()=>toggleBlock(activeDay,idx),style:{display:"flex",alignItems:"center",gap:10,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:`1px solid ${done?"#06D6A0":"rgba(255,255,255,0.08)"}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",opacity:done?0.7:1,transition:"all 0.2s"}},
              React.createElement("div",{style:{width:3,height:36,borderRadius:2,background:done?"#06D6A0":s.bg,flexShrink:0}}),
              React.createElement("div",{style:{flex:1}},
                React.createElement("div",{style:{fontSize:12,fontWeight:"bold",color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none"}},block.task),
                React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginTop:1}},block.time)
              ),
              React.createElement("div",{style:{background:done?"#06D6A0":s.bg,color:done?"#1A1A2E":s.dark?"#333":"#fff",fontSize:8,padding:"2px 6px",borderRadius:5,fontWeight:"bold",textTransform:"uppercase"}},done?"✓":s.label)
            );
          })
        )
      ),

      // ── CHECKLIST ──
      activeTab==="checklist" && React.createElement("div",null,
        React.createElement("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"14px 16px",marginBottom:14,border:"1px solid rgba(0,180,216,0.2)"}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}},
            React.createElement("span",{style:{color:"#90E0EF"}},"Daily Progress"),
            React.createElement("span",{style:{color:pct===100?"#06D6A0":"#FFD166",fontWeight:"bold"}},checkedCount," / ",totalItems)
          ),
          React.createElement("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:8,height:10,overflow:"hidden"}},
            React.createElement("div",{style:{width:`${pct}%`,height:"100%",borderRadius:8,background:pct===100?"linear-gradient(90deg,#06D6A0,#00B4D8)":"linear-gradient(90deg,#00B4D8,#FFD166)",transition:"width 0.4s"}})
          ),
          pct===100&&React.createElement("div",{style:{textAlign:"center",marginTop:8,color:"#06D6A0",fontSize:12,fontWeight:"bold"}},"🎉 Perfect day!")
        ),
        React.createElement("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:10}},
          React.createElement(MicBtn,{target:"checklist",label:"Add via Voice"})
        ),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:7}},
          [...DAILY_CHECKLIST,...customChecklist].map(item=>{
            const done=checked[item.id];
            const s=CAT_STYLES[item.cat]||CAT_STYLES.goals;
            return React.createElement("div",{key:item.id,onClick:()=>toggleCheck(item.id),style:{display:"flex",alignItems:"center",gap:12,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:`1px solid ${done?"#06D6A0":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:"11px 13px",cursor:"pointer",transition:"all 0.2s"}},
              React.createElement("div",{style:{width:22,height:22,borderRadius:7,flexShrink:0,background:done?"#06D6A0":"rgba(255,255,255,0.1)",border:`2px solid ${done?"#06D6A0":s.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,transition:"all 0.2s"}},done?"✓":""),
              React.createElement("div",{style:{fontSize:16}}),
              React.createElement("div",{style:{flex:1,fontSize:12,color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none",fontWeight:done?"normal":"bold"}},item.icon," ",item.label),
              React.createElement("div",{style:{background:s.bg,color:s.dark?"#333":"#fff",fontSize:8,padding:"2px 6px",borderRadius:5,textTransform:"uppercase",fontWeight:"bold"}},s.label)
            );
          })
        )
      ),

      // ── NUTRITION ──
      activeTab==="nutrition" && React.createElement("div",null,
        // Calorie summary
        React.createElement("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${macroColor(totals.calories,targets.calories)}33`}},
          React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            React.createElement("span",{style:{color:"#90E0EF",fontWeight:"bold",fontSize:12}},"🔥 Calories"),
            React.createElement("span",{style:{color:"#90E0EF",fontSize:11}},(targets.calories-totals.calories)>0?`${targets.calories-totals.calories} remaining`:"At/over target")
          ),
          React.createElement("div",{style:{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}},
            React.createElement("span",{style:{fontSize:28,fontWeight:"bold",color:macroColor(totals.calories,targets.calories)}},totals.calories),
            React.createElement("span",{style:{fontSize:12,color:"#90E0EF"}},"/ ",targets.calories," kcal")
          ),
          React.createElement("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:8,height:10,overflow:"hidden"}},
            React.createElement("div",{style:{width:`${Math.min((totals.calories/targets.calories)*100,110)}%`,height:"100%",borderRadius:8,background:`linear-gradient(90deg,#00B4D8,${macroColor(totals.calories,targets.calories)})`,transition:"width 0.4s"}})
          )
        ),
        // Macro cards
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}},
          [{label:"💪 Protein",val:totals.protein,target:targets.protein},{label:"⚡ Carbs",val:totals.carbs,target:targets.carbs},{label:"🥑 Fat",val:totals.fat,target:targets.fat}].map(m=>
            React.createElement("div",{key:m.label,style:{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px 10px",border:`1px solid ${macroColor(m.val,m.target)}33`}},
              React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:3}},m.label),
              React.createElement("div",{style:{fontSize:18,fontWeight:"bold",color:macroColor(m.val,m.target)}},m.val,"g"),
              React.createElement("div",{style:{fontSize:9,color:"#90E0EF"}},"/",m.target,"g"),
              React.createElement("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:4,height:5,marginTop:5,overflow:"hidden"}},
                React.createElement("div",{style:{width:`${Math.min((m.val/m.target)*100,110)}%`,height:"100%",background:macroColor(m.val,m.target),transition:"width 0.4s"}})
              )
            )
          )
        ),
        // Meal log header
        React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          React.createElement("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8"}},"📋 Today's Meals"),
          React.createElement("div",{style:{display:"flex",gap:6}},
            React.createElement(MicBtn,{target:"nutrition",label:"Voice"}),
            React.createElement("button",{onClick:()=>setShowMealForm(p=>!p),style:{background:showMealForm?"rgba(255,255,255,0.08)":"#00B4D8",border:"none",borderRadius:10,padding:"7px 12px",color:showMealForm?"#90E0EF":"#1A1A2E",fontWeight:"bold",fontSize:12,cursor:"pointer"}},showMealForm?"✕":"+ Add")
          )
        ),
        // Meal form
        showMealForm && React.createElement("div",{style:{background:"rgba(15,52,96,0.9)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:14,padding:14,marginBottom:12}},
          React.createElement("div",{style:{marginBottom:8}},
            React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:3}},"Meal Name *"),
            React.createElement("input",{placeholder:"e.g. Grilled chicken & rice",value:mealInput.name,onChange:e=>setMealInput(p=>({...p,name:e.target.value})),style:{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.25)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:12,boxSizing:"border-box"}})
          ),
          React.createElement("div",{style:{marginBottom:8}},
            React.createElement("select",{value:mealInput.mealTime,onChange:e=>setMealInput(p=>({...p,mealTime:e.target.value})),style:{width:"100%",background:"#0F3460",border:"1px solid rgba(0,180,216,0.25)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:12}},
              ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"].map(t=>React.createElement("option",{key:t},t))
            )
          ),
          React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
            [["calories","🔥 Cal*"],["protein","💪 Pro(g)"],["carbs","⚡ Carbs(g)"],["fat","🥑 Fat(g)"]].map(([k,l])=>
              React.createElement("div",{key:k},
                React.createElement("div",{style:{fontSize:9,color:"#90E0EF",marginBottom:2}},l),
                React.createElement("input",{type:"number",placeholder:"0",value:mealInput[k],onChange:e=>setMealInput(p=>({...p,[k]:e.target.value})),style:{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.25)",borderRadius:8,padding:"7px 8px",color:"#F0F4F8",fontSize:12,boxSizing:"border-box"}})
              )
            )
          ),
          React.createElement("button",{onClick:addMeal,style:{width:"100%",background:"#06D6A0",border:"none",borderRadius:10,padding:10,color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer"}},"✅ Log Meal")
        ),
        // Meal list
        meals.length===0
          ? React.createElement("div",{style:{textAlign:"center",color:"#90E0EF",fontSize:12,padding:"20px 0",opacity:0.6}},"No meals logged yet today.")
          : React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},
              ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"].map(slot=>{
                const sm=meals.filter(m=>m.mealTime===slot); if(!sm.length) return null;
                return React.createElement("div",{key:slot},
                  React.createElement("div",{style:{fontSize:10,color:"#FFD166",fontWeight:"bold",textTransform:"uppercase",letterSpacing:1,marginBottom:4}},slot),
                  sm.map(meal=>React.createElement("div",{key:meal.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:10}},
                    React.createElement("div",{style:{flex:1}},
                      React.createElement("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8"}},meal.name),
                      React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},"🔥 ",meal.calories||0," kcal",meal.protein?` · 💪 ${meal.protein}g`:"",meal.carbs?` · ⚡ ${meal.carbs}g`:"",meal.fat?` · 🥑 ${meal.fat}g`:"")
                    ),
                    React.createElement("button",{onClick:()=>setMeals(p=>p.filter(m=>m.id!==meal.id)),style:{background:"rgba(239,71,111,0.2)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}},"×")
                  ))
                );
              })
            )
      ),

      // ── GOALS ──
      activeTab==="goals" && React.createElement("div",null,
        React.createElement("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:14,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 14px",lineHeight:1.7}},
          "💡 ",React.createElement("strong",{style:{color:"#FFD166"}},"Tip:")," Slide each bar to update progress. Your progress saves automatically."
        ),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:10}},
          GOALS.map(goal=>{
            const prog=goalProgress[goal.id]??0;
            const s=CAT_STYLES[goal.cat];
            return React.createElement("div",{key:goal.id,style:{background:"rgba(255,255,255,0.04)",border:`1px solid ${prog===100?"#06D6A0":"rgba(255,255,255,0.08)"}`,borderRadius:14,padding:14}},
              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
                React.createElement("div",{style:{fontSize:20}}),
                React.createElement("div",{style:{flex:1}},
                  React.createElement("div",{style:{fontSize:13,fontWeight:"bold",color:prog===100?"#06D6A0":"#F0F4F8"}},goal.icon," ",goal.title,prog===100?" 🎉":""),
                  React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},"Target: ",goal.target)
                ),
                React.createElement("div",{style:{background:s.bg,color:s.dark?"#333":"#fff",fontSize:8,padding:"2px 7px",borderRadius:5,fontWeight:"bold",textTransform:"uppercase"}},s.label)
              ),
              React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},
                React.createElement("input",{type:"range",min:0,max:100,value:prog,onChange:e=>setGoalProgress(p=>({...p,[goal.id]:+e.target.value})),style:{flex:1,accentColor:prog===100?"#06D6A0":s.bg,cursor:"pointer"}}),
                React.createElement("div",{style:{width:38,textAlign:"center",fontWeight:"bold",fontSize:12,color:prog===100?"#06D6A0":"#FFD166"}},prog,"%")
              ),
              React.createElement("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:5,height:5,marginTop:8,overflow:"hidden"}},
                React.createElement("div",{style:{width:`${prog}%`,height:"100%",background:prog===100?"#06D6A0":s.bg,transition:"width 0.3s"}})
              )
            );
          })
        )
      ),

      // ── ALERTS / REMINDERS ──
      activeTab==="alerts" && React.createElement("div",null,
        // Permission banner
        notifPermission!=="granted" && React.createElement("div",{style:{background:"rgba(255,209,102,0.1)",border:"1px solid rgba(255,209,102,0.4)",borderRadius:14,padding:16,marginBottom:16,textAlign:"center"}},
          React.createElement("div",{style:{fontSize:14,color:"#FFD166",fontWeight:"bold",marginBottom:6}},"🔔 Enable Notifications"),
          React.createElement("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12,lineHeight:1.6}},"Allow notifications to receive reminders for dog walks, drop-offs, trash day, and more."),
          React.createElement("button",{onClick:requestNotifPermission,style:{background:"#FFD166",border:"none",borderRadius:10,padding:"10px 24px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer"}},"Allow Notifications")
        ),
        notifPermission==="granted" && React.createElement("div",{style:{background:"rgba(6,214,160,0.1)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#06D6A0",fontWeight:"bold",textAlign:"center"}},"✅ Notifications enabled — toggle reminders below"),
        notifPermission==="denied" && React.createElement("div",{style:{background:"rgba(239,71,111,0.1)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#EF476F",textAlign:"center"}},"⚠️ Notifications blocked. Please enable them in your browser/phone settings."),

        React.createElement("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"⏰ Daily Reminders"),
        React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          REMINDERS.map(rem=>{
            const on=!!remindersEnabled[rem.id];
            const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            return React.createElement("div",{key:rem.id,style:{background:"rgba(255,255,255,0.04)",border:`1px solid ${on?"rgba(0,180,216,0.3)":"rgba(255,255,255,0.07)"}`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}},
              React.createElement("div",{style:{fontSize:20}}),
              React.createElement("div",{style:{flex:1}},
                React.createElement("div",{style:{fontSize:12,fontWeight:"bold",color:on?"#F0F4F8":"#90E0EF"}}),
                React.createElement("div",{style:{fontSize:12,fontWeight:"bold",color:on?"#F0F4F8":"#90E0EF"}},rem.icon," ",rem.label),
                React.createElement("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},rem.time," · ",rem.days.map(d=>dayNames[d]).join(", "))
              ),
              React.createElement("div",{
                onClick:()=>toggleReminder(rem.id),
                style:{width:44,height:26,borderRadius:13,background:on?"#00B4D8":"rgba(255,255,255,0.15)",position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}
              },
                React.createElement("div",{style:{position:"absolute",top:3,left:on?20:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}})
              )
            );
          })
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
