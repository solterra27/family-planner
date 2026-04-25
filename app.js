var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef,useCallback=React.useCallback;

// Storage helpers
var LS={
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
function todayKey(){return new Date().toISOString().slice(0,10);}

var DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var FULL_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

var SCHEDULE={
  Mon:[
    {time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {time:"8:45-10:00 AM",task:"Learning Block",cat:"learning"},
    {time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Reading / Learn",cat:"learning"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Tue:[
    {time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {time:"8:45-10:00 AM",task:"Learning Block",cat:"learning"},
    {time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {time:"3:00-5:00 PM",task:"Strength Training",cat:"fitness"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-6:30 PM",task:"Family Dinner",cat:"family"},
    {time:"6:30-8:00 PM",task:"Mow Lawn (weather permitting)",cat:"home"},
    {time:"8:00-8:15 PM",task:"Take Trash to Curb",cat:"home"},
    {time:"8:15-9:00 PM",task:"Wind Down",cat:"routine"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Wed:[
    {time:"5:00-6:00 AM",task:"Stretch / Yoga",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {time:"8:45-9:00 AM",task:"Bring Trash Can Back from Curb",cat:"home"},
    {time:"9:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Reading / Learn",cat:"learning"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Thu:[
    {time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {time:"8:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {time:"3:00-5:00 PM",task:"Strength Training",cat:"fitness"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Wind Down",cat:"routine"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Fri:[
    {time:"5:00-6:00 AM",task:"Stretch / Yoga",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {time:"8:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Errands / Prep",cat:"home"},
    {time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Family Fun Night",cat:"family"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Sat:[
    {time:"5:00-6:00 AM",task:"Long Run / Hike",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {time:"8:00-9:00 AM",task:"Deep Clean",cat:"home"},
    {time:"9:00-10:00 AM",task:"Home Projects",cat:"home"},
    {time:"10:00-12:00 PM",task:"Goals / Projects",cat:"goals"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Family Time",cat:"family"},
    {time:"3:00-5:00 PM",task:"Free Time",cat:"family"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Flexible",cat:"routine"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Sun:[
    {time:"5:00-6:00 AM",task:"Rest / Recovery",cat:"fitness"},
    {time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {time:"8:00-9:00 AM",task:"Read / Relax",cat:"learning"},
    {time:"9:00-10:00 AM",task:"Outdoor / Garden",cat:"home"},
    {time:"10:00-12:00 PM",task:"Family Activity",cat:"family"},
    {time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {time:"1:20-3:00 PM",task:"Family Time",cat:"family"},
    {time:"3:00-5:00 PM",task:"Free Time",cat:"family"},
    {time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {time:"7:00-8:30 PM",task:"Prep Week Ahead",cat:"goals"},
    {time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ]
};

var CHECKLIST=[
  {id:"water",    label:"Drink 8 glasses of water",           cat:"health",   icon:"Water"},
  {id:"exercise", label:"Complete workout / movement",        cat:"fitness",  icon:"Workout"},
  {id:"morning",  label:"Full morning routine",               cat:"routine",  icon:"Morning"},
  {id:"dog_am",   label:"Morning dog walk (15-20 min)",       cat:"pet",      icon:"Dog Walk"},
  {id:"breakfast",label:"Healthy breakfast with family",      cat:"family",   icon:"Breakfast"},
  {id:"daughter", label:"Help daughter get ready",            cat:"family",   icon:"Daughter"},
  {id:"learn",    label:"30 min learning / study",            cat:"learning", icon:"Learn"},
  {id:"goal",     label:"Work on a goal / project",           cat:"goals",    icon:"Goal"},
  {id:"home",     label:"Complete 1 home task",               cat:"home",     icon:"Home"},
  {id:"dog_pm",   label:"Afternoon dog walk (15-20 min)",     cat:"pet",      icon:"Dog Walk"},
  {id:"meal_prep",label:"Meal prep / cook dinner",            cat:"home",     icon:"Cook"},
  {id:"family",   label:"Quality family time (no screens)",   cat:"family",   icon:"Family"},
  {id:"steps",    label:"Hit 8,000+ steps",                   cat:"fitness",  icon:"Steps"},
  {id:"read_eve", label:"Evening reading 20 min",             cat:"learning", icon:"Read"},
  {id:"journal",  label:"Journal / reflect",                  cat:"goals",    icon:"Journal"},
  {id:"dog_night",label:"Night dog walk (10-15 min)",         cat:"pet",      icon:"Dog Walk"},
  {id:"sleep",    label:"Lights out by 10 PM",                cat:"health",   icon:"Sleep"}
];

var GOALS=[
  {id:"g1",title:"Run a 5K without stopping",     cat:"fitness",  target:"3 months"},
  {id:"g2",title:"Read 12 books this year",        cat:"learning", target:"Year-end"},
  {id:"g3",title:"Complete an online course",      cat:"learning", target:"2 months"},
  {id:"g4",title:"Declutter and organize home",    cat:"home",     target:"6 weeks"},
  {id:"g5",title:"Establish meal prep routine",    cat:"home",     target:"4 weeks"},
  {id:"g6",title:"Screen-free family evenings",    cat:"family",   target:"Ongoing"},
  {id:"g7",title:"Build consistent sleep schedule",cat:"health",   target:"Ongoing"}
];

var REMINDERS=[
  {id:"r1", label:"Morning Workout",          time:"05:00", days:[1,2,3,4,5]},
  {id:"r2", label:"Morning Dog Walk",         time:"06:00", days:[0,1,2,3,4,5,6]},
  {id:"r3", label:"Help Daughter Get Ready",  time:"07:30", days:[1,2,3]},
  {id:"r4", label:"Drop Off at In-Laws",      time:"08:00", days:[1,2,3]},
  {id:"r5", label:"Afternoon Dog Walk",       time:"13:00", days:[0,1,2,3,4,5,6]},
  {id:"r6", label:"Meal Prep / Cook",         time:"17:00", days:[0,1,2,3,4,5,6]},
  {id:"r7", label:"Night Dog Walk",           time:"21:15", days:[0,1,2,3,4,5,6]},
  {id:"r8", label:"Take Trash to Curb",       time:"20:00", days:[2]},
  {id:"r9", label:"Bring Trash Can Back",     time:"09:00", days:[3]},
  {id:"r10",label:"Wind Down for Bed",        time:"21:30", days:[0,1,2,3,4,5,6]}
];

var CAT={
  fitness: {bg:"#EF476F",fg:"#fff",label:"Fitness"},
  learning:{bg:"#00B4D8",fg:"#fff",label:"Learning"},
  goals:   {bg:"#0F3460",fg:"#fff",label:"Goals"},
  home:    {bg:"#FFD166",fg:"#333",label:"Home"},
  family:  {bg:"#06D6A0",fg:"#333",label:"Family"},
  pet:     {bg:"#A78BFA",fg:"#fff",label:"Dog"},
  health:  {bg:"#90E0EF",fg:"#333",label:"Health"},
  routine: {bg:"#ADB5BD",fg:"#fff",label:"Routine"}
};

function el(type,props){
  var args=[type,props||null];
  for(var i=2;i<arguments.length;i++) args.push(arguments[i]);
  return React.createElement.apply(React,args);
}

function App(){
  var todayIdx=(new Date().getDay()+6)%7;
  var tk=todayKey();

  var tabS=useState("schedule");
  var activeTab=tabS[0]; var setActiveTab=tabS[1];

  var dayS=useState(DAYS[todayIdx]);
  var activeDay=dayS[0]; var setActiveDay=dayS[1];

  var chkS=useState(function(){return LS.get("chk_"+tk,{});});
  var checked=chkS[0]; var setChecked=chkS[1];

  var gpS=useState(function(){return LS.get("gp",{});});
  var goalProgress=gpS[0]; var setGoalProgress=gpS[1];

  var blkS=useState(function(){return LS.get("blk_"+tk,{});});
  var completedBlocks=blkS[0]; var setCompletedBlocks=blkS[1];

  var ccS=useState(function(){return LS.get("cc",[]);});
  var customChecklist=ccS[0]; var setCustomChecklist=ccS[1];

  var csS=useState(function(){return LS.get("cs",[]);});
  var customSchedule=csS[0]; var setCustomSchedule=csS[1];

  var mealsS=useState(function(){return LS.get("meals_"+tk,[]);});
  var meals=mealsS[0]; var setMeals=mealsS[1];

  var tgtS=useState(function(){return LS.get("ntgt",{calories:2400,protein:200,carbs:220,fat:75});});
  var targets=tgtS[0]; var setTargets=tgtS[1];

  var remS=useState(function(){return LS.get("rem",{});});
  var remindersEnabled=remS[0]; var setRemindersEnabled=remS[1];

  var npS=useState(typeof Notification!=="undefined"?Notification.permission:"default");
  var notifPerm=npS[0]; var setNotifPerm=npS[1];

  var mealInputS=useState({name:"",calories:"",protein:"",carbs:"",fat:"",mealTime:"Breakfast"});
  var mealInput=mealInputS[0]; var setMealInput=mealInputS[1];

  var showMealS=useState(false);
  var showMealForm=showMealS[0]; var setShowMealForm=showMealS[1];

  var editTgtS=useState(false);
  var editingTargets=editTgtS[0]; var setEditingTargets=editTgtS[1];

  var tmpTgtS=useState({calories:2400,protein:200,carbs:220,fat:75});
  var tempTargets=tmpTgtS[0]; var setTempTargets=tmpTgtS[1];

  // Voice state
  var voiceActiveS=useState(false);
  var voiceActive=voiceActiveS[0]; var setVoiceActive=voiceActiveS[1];
  var voiceTargetS=useState(null);
  var voiceTarget=voiceTargetS[0]; var setVoiceTarget=voiceTargetS[1];
  var voiceTextS=useState("");
  var voiceText=voiceTextS[0]; var setVoiceText=voiceTextS[1];
  var voiceStatusS=useState("");
  var voiceStatus=voiceStatusS[0]; var setVoiceStatus=voiceStatusS[1];
  var voiceParsedS=useState(null);
  var voiceParsed=voiceParsedS[0]; var setVoiceParsed=voiceParsedS[1];
  var showVoiceS=useState(false);
  var showVoice=showVoiceS[0]; var setShowVoice=showVoiceS[1];
  var recogRef=useRef(null);

  // Persist
  useEffect(function(){LS.set("chk_"+tk,checked);},[checked]);
  useEffect(function(){LS.set("gp",goalProgress);},[goalProgress]);
  useEffect(function(){LS.set("blk_"+tk,completedBlocks);},[completedBlocks]);
  useEffect(function(){LS.set("cc",customChecklist);},[customChecklist]);
  useEffect(function(){LS.set("cs",customSchedule);},[customSchedule]);
  useEffect(function(){LS.set("meals_"+tk,meals);},[meals]);
  useEffect(function(){LS.set("ntgt",targets);},[targets]);
  useEffect(function(){LS.set("rem",remindersEnabled);},[remindersEnabled]);

  // Nutrition totals
  var totals=meals.reduce(function(a,m){
    return {
      calories:a.calories+(Number(m.calories)||0),
      protein: a.protein +(Number(m.protein) ||0),
      carbs:   a.carbs   +(Number(m.carbs)   ||0),
      fat:     a.fat     +(Number(m.fat)      ||0)
    };
  },{calories:0,protein:0,carbs:0,fat:0});

  var allChecklist=CHECKLIST.concat(customChecklist);
  var checkedCount=allChecklist.filter(function(t){return checked[t.id];}).length;
  var pct=Math.round((checkedCount/allChecklist.length)*100);

  function toggleCheck(id){setChecked(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}
  function toggleBlock(day,idx){var k=day+"-"+idx;setCompletedBlocks(function(p){var n=Object.assign({},p);n[k]=!n[k];return n;});}

  function macroColor(v,t){
    var p=v/t;
    if(p>=0.95&&p<=1.1) return "#06D6A0";
    if(p>1.1) return "#EF476F";
    if(p>=0.7) return "#FFD166";
    return "#90E0EF";
  }

  function addMeal(){
    if(!mealInput.name||!mealInput.calories) return;
    setMeals(function(p){return p.concat([Object.assign({id:Date.now()},mealInput)]);});
    setMealInput({name:"",calories:"",protein:"",carbs:"",fat:"",mealTime:"Breakfast"});
    setShowMealForm(false);
  }

  // Voice parsing
  function parseNutrition(t){
    var lo=t.toLowerCase();
    var cal=lo.match(/(\d+)\s*(cal|calorie|calories|kcal)/);
    var pro=lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:protein)/);
    var carb=lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:carb|carbs)/);
    var fat=lo.match(/(\d+)\s*(?:g|gram|grams)?\s*(?:fat)/);
    var mts=["breakfast","morning snack","lunch","afternoon snack","dinner","evening snack"];
    var mt="Lunch";
    for(var i=0;i<mts.length;i++){if(lo.indexOf(mts[i])>=0){mt=mts[i].replace(/\b\w/g,function(c){return c.toUpperCase();});break;}}
    var nm=(t.match(/^([a-zA-Z\s,&'-]+?)(?:\s*[\d]|$)/)||[])[1];
    nm=nm?nm.trim().replace(/,$/,""):"Meal";
    return {name:nm,calories:cal?cal[1]:"",protein:pro?pro[1]:"",carbs:carb?carb[1]:"",fat:fat?fat[1]:"",mealTime:mt};
  }

  function parseChecklist(t){return {id:"vc_"+Date.now(),label:t.trim(),cat:"goals",icon:"Task"};}

  function parseSchedule(t){
    var lo=t.toLowerCase();
    var tm=t.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    var dnames=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    var day=activeDay;
    for(var i=0;i<dnames.length;i++){if(lo.indexOf(dnames[i])>=0){day=DAYS[i];break;}}
    var cats={fitness:["workout","run","gym","yoga"],learning:["study","learn","read"],home:["clean","cook","chores"],family:["family","dinner"]};
    var cat="routine";
    var ckeys=Object.keys(cats);
    for(var ci=0;ci<ckeys.length;ci++){
      var kws=cats[ckeys[ci]];
      for(var ki=0;ki<kws.length;ki++){if(lo.indexOf(kws[ki])>=0){cat=ckeys[ci];break;}}
    }
    var task=tm?t.replace(tm[0],"").replace(/\b(?:on\s)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,"").trim():t.trim();
    return {day:day,time:tm?tm[0].trim():"Flexible",task:task||t.trim(),cat:cat};
  }

  function startVoice(target){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setVoiceStatus("Voice not supported. Please use Chrome.");setShowVoice(true);setVoiceTarget(target);return;}
    setVoiceTarget(target);setVoiceText("");setVoiceStatus("Listening...");setVoiceParsed(null);setShowVoice(true);
    var r=new SR();recogRef.current=r;
    r.lang="en-US";r.interimResults=true;r.maxAlternatives=1;
    r.onstart=function(){setVoiceActive(true);};
    r.onresult=function(e){
      var tr=Array.from(e.results).map(function(x){return x[0].transcript;}).join("");
      setVoiceText(tr);
      if(e.results[e.results.length-1].isFinal){
        setVoiceActive(false);
        setVoiceStatus("Got it! Review below.");
        if(target==="nutrition") setVoiceParsed({type:"nutrition",data:parseNutrition(tr)});
        if(target==="checklist") setVoiceParsed({type:"checklist",data:parseChecklist(tr)});
        if(target==="schedule")  setVoiceParsed({type:"schedule", data:parseSchedule(tr)});
      }
    };
    r.onerror=function(e){setVoiceActive(false);setVoiceStatus("Error: "+e.error+". Try again.");};
    r.onend=function(){setVoiceActive(false);};
    r.start();
  }

  function stopVoice(){if(recogRef.current)recogRef.current.stop();setVoiceActive(false);}

  function confirmVoice(){
    if(!voiceParsed) return;
    if(voiceParsed.type==="nutrition"){setMealInput(voiceParsed.data);setShowMealForm(true);setActiveTab("nutrition");}
    if(voiceParsed.type==="checklist"){setCustomChecklist(function(p){return p.concat([voiceParsed.data]);});}
    if(voiceParsed.type==="schedule"){setCustomSchedule(function(p){return p.concat([Object.assign({id:Date.now()},voiceParsed.data)]);});setActiveDay(voiceParsed.data.day);setActiveTab("schedule");}
    setShowVoice(false);setVoiceParsed(null);setVoiceText("");
  }

  function requestNotif(){
    if(typeof Notification==="undefined") return;
    Notification.requestPermission().then(function(p){
      setNotifPerm(p);
      if(p==="granted") scheduleReminders();
    });
  }

  function scheduleReminders(){
    if(typeof Notification==="undefined"||Notification.permission!=="granted") return;
    var sw=navigator.serviceWorker&&navigator.serviceWorker.controller;
    if(!sw) return;
    var now=new Date();
    REMINDERS.forEach(function(rem){
      if(!remindersEnabled[rem.id]) return;
      var parts=rem.time.split(":");
      var fire=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(parts[0]),parseInt(parts[1]),0);
      if(fire<=now) return;
      sw.postMessage({type:"SCHEDULE_NOTIFICATION",delay:fire-now,title:rem.label,body:"Reminder: "+rem.label,tag:rem.id});
    });
  }

  useEffect(function(){if(notifPerm==="granted") scheduleReminders();},[remindersEnabled,notifPerm]);

  function toggleReminder(id){setRemindersEnabled(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}

  // Styles
  var S={
    page:{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",minHeight:"100vh",color:"#F0F4F8"},
    header:{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(0,180,216,0.3)",padding:"14px 16px 10px",position:"sticky",top:0,zIndex:100},
    content:{maxWidth:800,margin:"0 auto",padding:"14px 12px 80px"},
    card:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,0.1)"},
    btn:{border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold"},
    input:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.25)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:12,width:"100%",boxSizing:"border-box",fontFamily:"inherit"},
    label:{fontSize:10,color:"#90E0EF",marginBottom:3,display:"block"},
    catBadge:function(cat){var c=CAT[cat]||CAT.routine;return {background:c.bg,color:c.fg,fontSize:9,padding:"2px 7px",borderRadius:5,fontWeight:"bold",textTransform:"uppercase"};}
  };

  var tabs=[
    {id:"schedule", label:"Schedule"},
    {id:"checklist",label:"Checklist"},
    {id:"nutrition",label:"Nutrition"},
    {id:"goals",    label:"Goals"},
    {id:"alerts",   label:"Alerts"}
  ];

  return el("div",{style:S.page},

    // Voice Modal
    showVoice&&el("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},
      el("div",{style:{background:"#16213E",borderRadius:20,padding:24,width:"100%",maxWidth:400,border:"1px solid rgba(167,139,250,0.5)"}},
        el("div",{style:{fontWeight:"bold",fontSize:15,color:"#A78BFA",marginBottom:6}},"Voice Input - "+(voiceTarget==="nutrition"?"Meal":voiceTarget==="checklist"?"Checklist":"Schedule")),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:16,lineHeight:1.6}},
          voiceTarget==="nutrition"?"Say: food name, calories, protein, carbs, and meal time":
          voiceTarget==="checklist"?"Say any task to add to your checklist":
          "Say a task, time, and day (e.g. Dentist at 2pm Thursday)"
        ),
        el("div",{style:{textAlign:"center",marginBottom:16}},
          el("div",{
            onClick:voiceActive?stopVoice:function(){startVoice(voiceTarget);},
            style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:70,height:70,borderRadius:"50%",background:voiceActive?"rgba(239,71,111,0.2)":"rgba(167,139,250,0.15)",border:"3px solid "+(voiceActive?"#EF476F":"#A78BFA"),fontSize:28,cursor:"pointer",transition:"all 0.3s",boxShadow:voiceActive?"0 0 0 8px rgba(239,71,111,0.12)":"none"}
          },voiceActive?"[stop]":"[mic]"),
          el("div",{style:{fontSize:12,color:voiceActive?"#EF476F":"#90E0EF",marginTop:8}},voiceActive?"Recording - tap to stop":"Tap to start recording")
        ),
        voiceText&&el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#F0F4F8",marginBottom:12,border:"1px solid rgba(167,139,250,0.3)",fontStyle:"italic"}},'"'+voiceText+'"'),
        el("div",{style:{fontSize:12,color:"#90E0EF",marginBottom:12,textAlign:"center"}},voiceStatus),
        voiceParsed&&el("div",{style:{background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"12px",marginBottom:12}},
          el("div",{style:{fontSize:11,color:"#06D6A0",fontWeight:"bold",marginBottom:8}},"Review before saving:"),
          voiceParsed.type==="nutrition"&&Object.keys(voiceParsed.data).filter(function(k){return voiceParsed.data[k];}).map(function(k){
            return el("div",{key:k,style:{fontSize:12,color:"#F0F4F8",marginBottom:3}},
              el("span",{style:{color:"#90E0EF",textTransform:"capitalize"}},k+": "),voiceParsed.data[k]
            );
          }),
          voiceParsed.type==="checklist"&&el("div",{style:{fontSize:12,color:"#F0F4F8"}},"Add: "+voiceParsed.data.label),
          voiceParsed.type==="schedule"&&["day","time","task","cat"].map(function(k){
            return el("div",{key:k,style:{fontSize:12,color:"#F0F4F8",marginBottom:3}},
              el("span",{style:{color:"#90E0EF",textTransform:"capitalize"}},k+": "),voiceParsed.data[k]
            );
          })
        ),
        el("div",{style:{display:"flex",gap:8}},
          voiceParsed&&el("button",{onClick:confirmVoice,style:Object.assign({},S.btn,{flex:2,background:"#06D6A0",color:"#1A1A2E"})},"Add to Planner"),
          el("button",{onClick:function(){setShowVoice(false);stopVoice();setVoiceParsed(null);setVoiceText("");},style:Object.assign({},S.btn,{flex:1,background:"rgba(255,255,255,0.1)",color:"#90E0EF"})},"Cancel")
        )
      )
    ),

    // Floating mic button
    el("button",{
      onClick:function(){startVoice(activeTab==="nutrition"?"nutrition":activeTab==="checklist"?"checklist":"schedule");},
      style:{position:"fixed",bottom:22,right:18,zIndex:200,width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C3AED)",border:"none",fontSize:20,cursor:"pointer",boxShadow:"0 4px 20px rgba(124,58,237,0.5)",color:"#fff",fontWeight:"bold"}
    },"MIC"),

    // Header
    el("div",{style:S.header},
      el("div",{style:{maxWidth:800,margin:"0 auto"}},
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          el("div",null,
            el("div",{style:{fontSize:19,fontWeight:"bold",color:"#00B4D8"}},"Family Planner"),
            el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:1}},"Health · Learning · Home · Family")
          ),
          el("div",{style:{background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.4)",borderRadius:12,padding:"5px 12px",textAlign:"center"}},
            el("div",{style:{fontSize:16,fontWeight:"bold",color:pct===100?"#06D6A0":"#FFD166"}},pct+"%"),
            el("div",{style:{fontSize:10,color:"#90E0EF"}},"Today")
          )
        ),
        el("div",{style:{display:"flex",gap:4}},
          tabs.map(function(t){
            return el("button",{key:t.id,onClick:function(){setActiveTab(t.id);},style:{flex:1,padding:"7px 2px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,background:activeTab===t.id?"#00B4D8":"rgba(255,255,255,0.07)",color:activeTab===t.id?"#1A1A2E":"#90E0EF",fontWeight:activeTab===t.id?"bold":"normal"}},t.label);
          })
        )
      )
    ),

    // Main content
    el("div",{style:S.content},

      // SCHEDULE TAB
      activeTab==="schedule"&&el("div",null,
        el("div",{style:{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4}},
          DAYS.map(function(d,i){
            return el("button",{key:d,onClick:function(){setActiveDay(d);},style:{flex:"0 0 auto",padding:"7px 11px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,background:activeDay===d?"#00B4D8":"rgba(255,255,255,0.08)",color:activeDay===d?"#1A1A2E":"#90E0EF",fontWeight:activeDay===d?"bold":"normal",borderBottom:i===todayIdx?"2px solid #FFD166":"2px solid transparent"}},
              d,i===todayIdx&&el("div",{style:{fontSize:7,color:activeDay===d?"#0F3460":"#FFD166",marginTop:1}},"TODAY")
            );
          })
        ),
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          el("div",{style:{fontSize:11,color:"#90E0EF",textTransform:"uppercase",letterSpacing:1}},FULL_DAYS[DAYS.indexOf(activeDay)]),
          el("button",{onClick:function(){startVoice("schedule");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
            "Voice Add"
          )
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          SCHEDULE[activeDay].concat(customSchedule.filter(function(s){return s.day===activeDay;})).map(function(block,idx){
            var k=activeDay+"-"+idx;
            var done=!!completedBlocks[k];
            var c=CAT[block.cat]||CAT.routine;
            return el("div",{key:idx,onClick:function(){toggleBlock(activeDay,idx);},style:{display:"flex",alignItems:"center",gap:10,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:12,padding:"10px 12px",cursor:"pointer",opacity:done?0.75:1}},
              el("div",{style:{width:3,height:34,borderRadius:2,background:done?"#06D6A0":c.bg,flexShrink:0}}),
              el("div",{style:{flex:1}},
                el("div",{style:{fontSize:12,fontWeight:"bold",color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none"}},block.task),
                el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},block.time)
              ),
              el("div",{style:S.catBadge(block.cat)},done?"Done":c.label)
            );
          })
        )
      ),

      // CHECKLIST TAB
      activeTab==="checklist"&&el("div",null,
        el("div",{style:Object.assign({},S.card,{marginBottom:14})},
          el("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}},
            el("span",{style:{color:"#90E0EF"}},"Daily Progress"),
            el("span",{style:{color:pct===100?"#06D6A0":"#FFD166",fontWeight:"bold"}},checkedCount+" / "+allChecklist.length)
          ),
          el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:8,height:10,overflow:"hidden"}},
            el("div",{style:{width:pct+"%",height:"100%",borderRadius:8,background:pct===100?"linear-gradient(90deg,#06D6A0,#00B4D8)":"linear-gradient(90deg,#00B4D8,#FFD166)",transition:"width 0.4s"}})
          ),
          pct===100&&el("div",{style:{textAlign:"center",marginTop:8,color:"#06D6A0",fontSize:12,fontWeight:"bold"}},"Perfect day! You crushed it!")
        ),
        el("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:10}},
          el("button",{onClick:function(){startVoice("checklist");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
            "Voice Add"
          )
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:7}},
          allChecklist.map(function(item){
            var done=!!checked[item.id];
            var c=CAT[item.cat]||CAT.goals;
            return el("div",{key:item.id,onClick:function(){toggleCheck(item.id);},style:{display:"flex",alignItems:"center",gap:12,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"11px 13px",cursor:"pointer"}},
              el("div",{style:{width:22,height:22,borderRadius:6,flexShrink:0,background:done?"#06D6A0":"rgba(255,255,255,0.1)",border:"2px solid "+(done?"#06D6A0":c.bg),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}},done?"v":""),
              el("div",{style:{flex:1,fontSize:12,color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none",fontWeight:done?"normal":"bold"}},item.label),
              el("div",{style:S.catBadge(item.cat)},c.label)
            );
          })
        )
      ),

      // NUTRITION TAB
      activeTab==="nutrition"&&el("div",null,
        // Calorie bar
        el("div",{style:Object.assign({},S.card,{marginBottom:12,border:"1px solid "+macroColor(totals.calories,targets.calories)+"44"})},
          el("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            el("span",{style:{color:"#90E0EF",fontWeight:"bold",fontSize:12}},"Calories"),
            el("span",{style:{color:"#90E0EF",fontSize:11}},targets.calories-totals.calories>0?(targets.calories-totals.calories)+" remaining":"At or over target")
          ),
          el("div",{style:{display:"flex",alignItems:"baseline",gap:6,marginBottom:8}},
            el("span",{style:{fontSize:28,fontWeight:"bold",color:macroColor(totals.calories,targets.calories)}},totals.calories),
            el("span",{style:{fontSize:12,color:"#90E0EF"}},"/ "+targets.calories+" kcal")
          ),
          el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:8,height:10,overflow:"hidden"}},
            el("div",{style:{width:Math.min((totals.calories/targets.calories)*100,110)+"%",height:"100%",borderRadius:8,background:"linear-gradient(90deg,#00B4D8,"+macroColor(totals.calories,targets.calories)+")",transition:"width 0.4s"}})
          )
        ),
        // Macro cards
        el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}},
          [{k:"protein",l:"Protein"},{k:"carbs",l:"Carbs"},{k:"fat",l:"Fat"}].map(function(m){
            var v=totals[m.k]; var t=targets[m.k];
            return el("div",{key:m.k,style:{background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px",border:"1px solid "+macroColor(v,t)+"33"}},
              el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:3}},m.l),
              el("div",{style:{fontSize:18,fontWeight:"bold",color:macroColor(v,t)}},v+"g"),
              el("div",{style:{fontSize:9,color:"#90E0EF"}},"/"+t+"g"),
              el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:4,height:5,marginTop:5,overflow:"hidden"}},
                el("div",{style:{width:Math.min((v/t)*100,110)+"%",height:"100%",background:macroColor(v,t)}})
              )
            );
          })
        ),
        // Add meal controls
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          el("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8"}},"Today's Meals"),
          el("div",{style:{display:"flex",gap:7}},
            el("button",{onClick:function(){startVoice("nutrition");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
              "Voice"
            ),
            el("button",{onClick:function(){setShowMealForm(function(p){return !p;});},style:Object.assign({},S.btn,{background:showMealForm?"rgba(255,255,255,0.08)":"#00B4D8",color:showMealForm?"#90E0EF":"#1A1A2E"})},
              showMealForm?"Cancel":"+ Add"
            )
          )
        ),
        // Meal form
        showMealForm&&el("div",{style:{background:"rgba(15,52,96,0.9)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:14,padding:14,marginBottom:12}},
          el("div",{style:{marginBottom:8}},
            el("span",{style:S.label},"Meal Name *"),
            el("input",{placeholder:"e.g. Grilled chicken and rice",value:mealInput.name,onChange:function(e){setMealInput(function(p){return Object.assign({},p,{name:e.target.value});});},style:S.input})
          ),
          el("div",{style:{marginBottom:8}},
            el("select",{value:mealInput.mealTime,onChange:function(e){setMealInput(function(p){return Object.assign({},p,{mealTime:e.target.value});});},style:Object.assign({},S.input,{background:"#0F3460"})},
              ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"].map(function(t){return el("option",{key:t},t);})
            )
          ),
          el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
            [{k:"calories",l:"Calories *"},{k:"protein",l:"Protein (g)"},{k:"carbs",l:"Carbs (g)"},{k:"fat",l:"Fat (g)"}].map(function(f){
              return el("div",{key:f.k},
                el("span",{style:S.label},f.l),
                el("input",{type:"number",placeholder:"0",value:mealInput[f.k],onChange:function(e){var v=e.target.value;setMealInput(function(p){var n=Object.assign({},p);n[f.k]=v;return n;});},style:S.input})
              );
            })
          ),
          el("button",{onClick:addMeal,style:Object.assign({},S.btn,{width:"100%",background:"#06D6A0",color:"#1A1A2E",padding:"10px",fontSize:13})},"Log Meal")
        ),
        // Meal list
        meals.length===0
          ?el("div",{style:{textAlign:"center",color:"#90E0EF",fontSize:12,padding:"20px 0",opacity:0.6}},"No meals logged yet today. Tap + Add or Voice to get started.")
          :el("div",{style:{display:"flex",flexDirection:"column",gap:6}},
            ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"].map(function(slot){
              var sm=meals.filter(function(m){return m.mealTime===slot;});
              if(!sm.length) return null;
              return el("div",{key:slot},
                el("div",{style:{fontSize:10,color:"#FFD166",fontWeight:"bold",textTransform:"uppercase",letterSpacing:1,marginBottom:4}},slot),
                sm.map(function(meal){
                  return el("div",{key:meal.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:10}},
                    el("div",{style:{flex:1}},
                      el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8"}},meal.name),
                      el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},
                        (meal.calories||0)+" kcal"+(meal.protein?" | P:"+meal.protein+"g":"")+(meal.carbs?" | C:"+meal.carbs+"g":"")+(meal.fat?" | F:"+meal.fat+"g":"")
                      )
                    ),
                    el("button",{onClick:function(){var id=meal.id;setMeals(function(p){return p.filter(function(m){return m.id!==id;});});},style:{background:"rgba(239,71,111,0.2)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:26,height:26,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}},"x")
                  );
                })
              );
            })
          )
      ),

      // GOALS TAB
      activeTab==="goals"&&el("div",null,
        el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:14,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 14px",lineHeight:1.7}},
          "Tip: Slide each bar to update your progress. All data saves automatically."
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:10}},
          GOALS.map(function(goal){
            var prog=goalProgress[goal.id]||0;
            var c=CAT[goal.cat]||CAT.goals;
            return el("div",{key:goal.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid "+(prog===100?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:14,padding:14}},
              el("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
                el("div",{style:{flex:1}},
                  el("div",{style:{fontSize:13,fontWeight:"bold",color:prog===100?"#06D6A0":"#F0F4F8"}},goal.title+(prog===100?" - Complete!":"")),
                  el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},"Target: "+goal.target)
                ),
                el("div",{style:S.catBadge(goal.cat)},c.label)
              ),
              el("div",{style:{display:"flex",alignItems:"center",gap:10}},
                el("input",{type:"range",min:0,max:100,value:prog,onChange:function(e){var v=+e.target.value;var id=goal.id;setGoalProgress(function(p){var n=Object.assign({},p);n[id]=v;return n;});},style:{flex:1,accentColor:prog===100?"#06D6A0":c.bg,cursor:"pointer"}}),
                el("div",{style:{width:36,textAlign:"center",fontWeight:"bold",fontSize:12,color:prog===100?"#06D6A0":"#FFD166"}},prog+"%")
              ),
              el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:5,height:5,marginTop:8,overflow:"hidden"}},
                el("div",{style:{width:prog+"%",height:"100%",background:prog===100?"#06D6A0":c.bg,transition:"width 0.3s"}})
              )
            );
          })
        )
      ),

      // ALERTS TAB
      activeTab==="alerts"&&el("div",null,
        notifPerm!=="granted"&&el("div",{style:{background:"rgba(255,209,102,0.1)",border:"1px solid rgba(255,209,102,0.4)",borderRadius:14,padding:16,marginBottom:16,textAlign:"center"}},
          el("div",{style:{fontSize:14,color:"#FFD166",fontWeight:"bold",marginBottom:6}},"Enable Notifications"),
          el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12,lineHeight:1.6}},"Get reminders for dog walks, drop-offs, trash day, meals, and more."),
          el("button",{onClick:requestNotif,style:Object.assign({},S.btn,{background:"#FFD166",color:"#1A1A2E",padding:"10px 24px",fontSize:13})},"Allow Notifications")
        ),
        notifPerm==="granted"&&el("div",{style:{background:"rgba(6,214,160,0.1)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#06D6A0",fontWeight:"bold",textAlign:"center"}},"Notifications enabled - toggle your reminders below"),
        notifPerm==="denied"&&el("div",{style:{background:"rgba(239,71,111,0.1)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#EF476F",textAlign:"center"}},"Notifications blocked. Please enable them in your phone settings then refresh."),
        el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"Daily Reminders"),
        el("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          REMINDERS.map(function(rem){
            var on=!!remindersEnabled[rem.id];
            var dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            return el("div",{key:rem.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid "+(on?"rgba(0,180,216,0.3)":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}},
              el("div",{style:{flex:1}},
                el("div",{style:{fontSize:12,fontWeight:"bold",color:on?"#F0F4F8":"#90E0EF"}},rem.label),
                el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},rem.time+" - "+rem.days.map(function(d){return dayNames[d];}).join(", "))
              ),
              el("div",{
                onClick:function(){toggleReminder(rem.id);},
                style:{width:44,height:26,borderRadius:13,background:on?"#00B4D8":"rgba(255,255,255,0.15)",position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}
              },
                el("div",{style:{position:"absolute",top:3,left:on?20:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}})
              )
            );
          })
        )
      )

    ) // end content
  ); // end page
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
