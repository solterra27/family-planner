var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef;

var LS={
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
function todayKey(){return new Date().toISOString().slice(0,10);}
function uid(){return Date.now()+"_"+Math.random().toString(36).slice(2,7);}
function weekKey(d){var dt=d||new Date();var jan=new Date(dt.getFullYear(),0,1);var wk=Math.ceil(((dt-jan)/86400000+jan.getDay()+1)/7);return dt.getFullYear()+"_W"+wk;}
function monthKey(d){var dt=d||new Date();return dt.getFullYear()+"-"+(dt.getMonth()+1);}

var DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var FULL_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
// JS getDay(): 0=Sun,1=Mon...6=Sat  -> our DAYS index: Mon=0...Sun=6
function jsDayToIdx(jsDay){return jsDay===0?6:jsDay-1;}

var DEFAULT_CATS=[
  {id:"fitness", label:"Fitness",  bg:"#EF476F",fg:"#fff"},
  {id:"learning",label:"Learning", bg:"#00B4D8",fg:"#fff"},
  {id:"goals",   label:"Goals",    bg:"#0F3460",fg:"#fff"},
  {id:"home",    label:"Home",     bg:"#FFD166",fg:"#333"},
  {id:"family",  label:"Family",   bg:"#06D6A0",fg:"#333"},
  {id:"pet",     label:"Dog",      bg:"#A78BFA",fg:"#fff"},
  {id:"health",  label:"Health",   bg:"#90E0EF",fg:"#333"},
  {id:"routine", label:"Routine",  bg:"#ADB5BD",fg:"#fff"}
];
var BG_PRESETS=["#EF476F","#00B4D8","#0F3460","#FFD166","#06D6A0","#A78BFA","#90E0EF","#ADB5BD","#FF9F1C","#2EC4B6","#E71D36","#8338EC"];

// Recurrence helpers
// repeat: "none"|"daily"|"weekdays"|"weekends"|"weekly"|"monthly"
// weeklyDays: array of DAYS indices for weekly repeat
function blockAppliesOnDay(block,dayIdx){
  var r=block.repeat||"none";
  if(r==="none") return true; // base schedule handles this
  if(r==="daily") return true;
  if(r==="weekdays") return dayIdx>=0&&dayIdx<=4;
  if(r==="weekends") return dayIdx===5||dayIdx===6;
  if(r==="weekly"){var wd=block.weeklyDays||[dayIdx];return wd.indexOf(dayIdx)>=0;}
  if(r==="monthly") return true; // handled by date check
  return false;
}

var DEFAULT_SCHEDULE={
  Mon:[
    {id:"m1", time:"05:00",timeEnd:"06:00",task:"Workout / Run",cat:"fitness",repeat:"none"},
    {id:"m2", time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"m3", time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"m4", time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"m5", time:"07:30",timeEnd:"08:00",task:"Help Daughter Get Ready",cat:"family",repeat:"none"},
    {id:"m6", time:"08:00",timeEnd:"08:45",task:"Drop off at In-Laws & Return",cat:"family",repeat:"none"},
    {id:"m7", time:"08:45",timeEnd:"10:00",task:"Learning Block",cat:"learning",repeat:"none"},
    {id:"m8", time:"10:00",timeEnd:"12:00",task:"Goal Work / Focus",cat:"goals",repeat:"none"},
    {id:"m9", time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"m10",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"m11",time:"13:20",timeEnd:"15:00",task:"Learning / Study",cat:"learning",repeat:"none"},
    {id:"m12",time:"15:00",timeEnd:"17:00",task:"Home / Admin",cat:"home",repeat:"none"},
    {id:"m13",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"m14",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"m15",time:"19:00",timeEnd:"20:30",task:"Reading / Learn",cat:"learning",repeat:"none"},
    {id:"m16",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"m17",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Tue:[
    {id:"t1", time:"05:00",timeEnd:"06:00",task:"Workout / Run",cat:"fitness",repeat:"none"},
    {id:"t2", time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"t3", time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"t4", time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"t5", time:"07:30",timeEnd:"08:00",task:"Help Daughter Get Ready",cat:"family",repeat:"none"},
    {id:"t6", time:"08:00",timeEnd:"08:45",task:"Drop off at In-Laws & Return",cat:"family",repeat:"none"},
    {id:"t7", time:"08:45",timeEnd:"10:00",task:"Learning Block",cat:"learning",repeat:"none"},
    {id:"t8", time:"10:00",timeEnd:"12:00",task:"Goal Work / Focus",cat:"goals",repeat:"none"},
    {id:"t9", time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"t10",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"t11",time:"13:20",timeEnd:"15:00",task:"Learning / Study",cat:"learning",repeat:"none"},
    {id:"t12",time:"15:00",timeEnd:"17:00",task:"Strength Training",cat:"fitness",repeat:"none"},
    {id:"t13",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"t14",time:"18:00",timeEnd:"18:30",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"t15",time:"18:30",timeEnd:"20:00",task:"Mow Lawn (weather permitting)",cat:"home",repeat:"none"},
    {id:"t16",time:"20:00",timeEnd:"20:15",task:"Take Trash to Curb",cat:"home",repeat:"none"},
    {id:"t17",time:"20:15",timeEnd:"21:00",task:"Wind Down",cat:"routine",repeat:"none"},
    {id:"t18",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"t19",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Wed:[
    {id:"w1", time:"05:00",timeEnd:"06:00",task:"Stretch / Yoga",cat:"fitness",repeat:"none"},
    {id:"w2", time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"w3", time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"w4", time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"w5", time:"07:30",timeEnd:"08:00",task:"Help Daughter Get Ready",cat:"family",repeat:"none"},
    {id:"w6", time:"08:00",timeEnd:"08:45",task:"Drop off at In-Laws & Return",cat:"family",repeat:"none"},
    {id:"w7", time:"08:45",timeEnd:"09:00",task:"Bring Trash Can Back from Curb",cat:"home",repeat:"none"},
    {id:"w8", time:"09:00",timeEnd:"10:00",task:"Learning Block",cat:"learning",repeat:"none"},
    {id:"w9", time:"10:00",timeEnd:"12:00",task:"Goal Work / Focus",cat:"goals",repeat:"none"},
    {id:"w10",time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"w11",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"w12",time:"13:20",timeEnd:"15:00",task:"Learning / Study",cat:"learning",repeat:"none"},
    {id:"w13",time:"15:00",timeEnd:"17:00",task:"Home / Admin",cat:"home",repeat:"none"},
    {id:"w14",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"w15",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"w16",time:"19:00",timeEnd:"20:30",task:"Reading / Learn",cat:"learning",repeat:"none"},
    {id:"w17",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"w18",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Thu:[
    {id:"th1",time:"05:00",timeEnd:"06:00",task:"Workout / Run",cat:"fitness",repeat:"none"},
    {id:"th2",time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"th3",time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"th4",time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"th5",time:"07:30",timeEnd:"08:00",task:"Family Morning Prep",cat:"family",repeat:"none"},
    {id:"th6",time:"08:00",timeEnd:"10:00",task:"Learning Block",cat:"learning",repeat:"none"},
    {id:"th7",time:"10:00",timeEnd:"12:00",task:"Goal Work / Focus",cat:"goals",repeat:"none"},
    {id:"th8",time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"th9",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"th10",time:"13:20",timeEnd:"15:00",task:"Learning / Study",cat:"learning",repeat:"none"},
    {id:"th11",time:"15:00",timeEnd:"17:00",task:"Strength Training",cat:"fitness",repeat:"none"},
    {id:"th12",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"th13",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"th14",time:"19:00",timeEnd:"20:30",task:"Wind Down",cat:"routine",repeat:"none"},
    {id:"th15",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"th16",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Fri:[
    {id:"f1", time:"05:00",timeEnd:"06:00",task:"Stretch / Yoga",cat:"fitness",repeat:"none"},
    {id:"f2", time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"f3", time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"f4", time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"f5", time:"07:30",timeEnd:"08:00",task:"Family Morning Prep",cat:"family",repeat:"none"},
    {id:"f6", time:"08:00",timeEnd:"10:00",task:"Learning Block",cat:"learning",repeat:"none"},
    {id:"f7", time:"10:00",timeEnd:"12:00",task:"Goal Work / Focus",cat:"goals",repeat:"none"},
    {id:"f8", time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"f9", time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"f10",time:"13:20",timeEnd:"15:00",task:"Errands / Prep",cat:"home",repeat:"none"},
    {id:"f11",time:"15:00",timeEnd:"17:00",task:"Home / Admin",cat:"home",repeat:"none"},
    {id:"f12",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"f13",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"f14",time:"19:00",timeEnd:"20:30",task:"Family Fun Night",cat:"family",repeat:"none"},
    {id:"f15",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"f16",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Sat:[
    {id:"sa1",time:"05:00",timeEnd:"06:00",task:"Long Run / Hike",cat:"fitness",repeat:"none"},
    {id:"sa2",time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"sa3",time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"sa4",time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"sa5",time:"07:30",timeEnd:"08:00",task:"Family Morning Prep",cat:"family",repeat:"none"},
    {id:"sa6",time:"08:00",timeEnd:"09:00",task:"Deep Clean",cat:"home",repeat:"none"},
    {id:"sa7",time:"09:00",timeEnd:"10:00",task:"Home Projects",cat:"home",repeat:"none"},
    {id:"sa8",time:"10:00",timeEnd:"12:00",task:"Goals / Projects",cat:"goals",repeat:"none"},
    {id:"sa9",time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"sa10",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"sa11",time:"13:20",timeEnd:"15:00",task:"Family Time",cat:"family",repeat:"none"},
    {id:"sa12",time:"15:00",timeEnd:"17:00",task:"Free Time",cat:"family",repeat:"none"},
    {id:"sa13",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"sa14",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"sa15",time:"19:00",timeEnd:"20:30",task:"Flexible",cat:"routine",repeat:"none"},
    {id:"sa16",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"sa17",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ],
  Sun:[
    {id:"su1",time:"05:00",timeEnd:"06:00",task:"Rest / Recovery",cat:"fitness",repeat:"none"},
    {id:"su2",time:"06:00",timeEnd:"06:20",task:"Morning Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"su3",time:"06:20",timeEnd:"07:00",task:"Morning Routine",cat:"routine",repeat:"none"},
    {id:"su4",time:"07:00",timeEnd:"07:30",task:"Family Breakfast",cat:"family",repeat:"none"},
    {id:"su5",time:"07:30",timeEnd:"08:00",task:"Family Morning Prep",cat:"family",repeat:"none"},
    {id:"su6",time:"08:00",timeEnd:"09:00",task:"Read / Relax",cat:"learning",repeat:"none"},
    {id:"su7",time:"09:00",timeEnd:"10:00",task:"Outdoor / Garden",cat:"home",repeat:"none"},
    {id:"su8",time:"10:00",timeEnd:"12:00",task:"Family Activity",cat:"family",repeat:"none"},
    {id:"su9",time:"12:00",timeEnd:"13:00",task:"Lunch + Break",cat:"health",repeat:"none"},
    {id:"su10",time:"13:00",timeEnd:"13:20",task:"Afternoon Dog Walk (15-20 min)",cat:"pet",repeat:"none"},
    {id:"su11",time:"13:20",timeEnd:"15:00",task:"Family Time",cat:"family",repeat:"none"},
    {id:"su12",time:"15:00",timeEnd:"17:00",task:"Free Time",cat:"family",repeat:"none"},
    {id:"su13",time:"17:00",timeEnd:"18:00",task:"Meal Prep / Cook",cat:"home",repeat:"none"},
    {id:"su14",time:"18:00",timeEnd:"19:00",task:"Family Dinner",cat:"family",repeat:"none"},
    {id:"su15",time:"19:00",timeEnd:"20:30",task:"Prep Week Ahead",cat:"goals",repeat:"none"},
    {id:"su16",time:"21:15",timeEnd:"21:30",task:"Night Dog Walk (10-15 min)",cat:"pet",repeat:"none"},
    {id:"su17",time:"21:30",timeEnd:"22:00",task:"Night Routine",cat:"routine",repeat:"none"}
  ]
};

var DEFAULT_CHECKLIST=[
  {id:"c1", label:"Drink 8 glasses of water",         cat:"health"},
  {id:"c2", label:"Complete workout / movement",      cat:"fitness"},
  {id:"c3", label:"Full morning routine",             cat:"routine"},
  {id:"c4", label:"Morning dog walk (15-20 min)",     cat:"pet"},
  {id:"c5", label:"Healthy breakfast with family",    cat:"family"},
  {id:"c6", label:"Help daughter get ready",          cat:"family"},
  {id:"c7", label:"30 min learning / study",          cat:"learning"},
  {id:"c8", label:"Work on a goal / project",         cat:"goals"},
  {id:"c9", label:"Complete 1 home task",             cat:"home"},
  {id:"c10",label:"Afternoon dog walk (15-20 min)",   cat:"pet"},
  {id:"c11",label:"Meal prep / cook dinner",          cat:"home"},
  {id:"c12",label:"Quality family time (no screens)", cat:"family"},
  {id:"c13",label:"Hit 8,000 steps",                  cat:"fitness"},
  {id:"c14",label:"Evening reading 20 min",           cat:"learning"},
  {id:"c15",label:"Journal / reflect",                cat:"goals"},
  {id:"c16",label:"Night dog walk (10-15 min)",       cat:"pet"},
  {id:"c17",label:"Lights out by 10 PM",              cat:"health"}
];

var DEFAULT_GOALS=[
  {id:"g1",title:"Run a 5K without stopping",      cat:"fitness", target:"3 months"},
  {id:"g2",title:"Read 12 books this year",         cat:"learning",target:"Year-end"},
  {id:"g3",title:"Complete an online course",       cat:"learning",target:"2 months"},
  {id:"g4",title:"Declutter and organize home",     cat:"home",    target:"6 weeks"},
  {id:"g5",title:"Establish meal prep routine",     cat:"home",    target:"4 weeks"},
  {id:"g6",title:"Screen-free family evenings",     cat:"family",  target:"Ongoing"},
  {id:"g7",title:"Build consistent sleep schedule", cat:"health",  target:"Ongoing"}
];

var REMINDERS=[
  {id:"r1", label:"Morning Workout",         time:"05:00",days:[1,2,3,4,5]},
  {id:"r2", label:"Morning Dog Walk",        time:"06:00",days:[0,1,2,3,4,5,6]},
  {id:"r3", label:"Help Daughter Get Ready", time:"07:30",days:[1,2,3]},
  {id:"r4", label:"Drop Off at In-Laws",     time:"08:00",days:[1,2,3]},
  {id:"r5", label:"Afternoon Dog Walk",      time:"13:00",days:[0,1,2,3,4,5,6]},
  {id:"r6", label:"Meal Prep / Cook",        time:"17:00",days:[0,1,2,3,4,5,6]},
  {id:"r7", label:"Night Dog Walk",          time:"21:15",days:[0,1,2,3,4,5,6]},
  {id:"r8", label:"Take Trash to Curb",      time:"20:00",days:[2]},
  {id:"r9", label:"Bring Trash Can Back",    time:"09:00",days:[3]},
  {id:"r10",label:"Wind Down for Bed",       time:"21:30",days:[0,1,2,3,4,5,6]}
];

// Time helpers
function timeToMins(t){
  if(!t) return 0;
  var m12=t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if(m12){var h=parseInt(m12[1]);var mn=parseInt(m12[2]);var ap=m12[3].toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return h*60+mn;}
  var m24=t.match(/^(\d+):(\d+)$/);
  if(m24) return parseInt(m24[1])*60+parseInt(m24[2]);
  return 0;
}
function normTo24(t){
  if(!t) return "00:00";
  var m12=t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if(m12){var h=parseInt(m12[1]);var mn=m12[2];var ap=m12[3].toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return String(h).padStart(2,"0")+":"+mn;}
  var m24=t.match(/^(\d+):(\d+)$/);
  if(m24) return String(parseInt(m24[1])).padStart(2,"0")+":"+m24[2];
  return "00:00";
}
function fmt12(t){
  var n=normTo24(t);var parts=n.split(":");var h=parseInt(parts[0]);var mn=parts[1];
  var ap=h>=12?"PM":"AM";var h12=h%12||12;return h12+":"+mn+" "+ap;
}
function dispTime(t,use24){if(!t)return "";var n=normTo24(t);return use24?n:fmt12(n);}

function el(type,props){
  var args=[type,props||null];
  for(var i=2;i<arguments.length;i++) args.push(arguments[i]);
  return React.createElement.apply(React,args);
}

// ── Modal ──
function Modal(props){
  return el("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},
    el("div",{style:{background:"#16213E",borderRadius:18,padding:22,width:"100%",maxWidth:420,border:"1px solid rgba(0,180,216,0.4)",maxHeight:"88vh",overflowY:"auto"}},
      props.children
    )
  );
}

// ── Time Picker ──
function TimePicker(props){
  var use24=props.use24!==false;
  var MINS=["00","05","10","15","20","25","30","35","40","45","50","55"];
  var parsed=normTo24(props.value||"08:00").split(":");
  var h24=parseInt(parsed[0]);
  var initH12=String(h24%12||12);
  var hS=useState(use24?parsed[0]:initH12);var selH=hS[0];var setSelH=hS[1];
  var mS=useState(parsed[1]);var selM=mS[0];var setSelM=mS[1];
  var apS=useState(h24>=12?"PM":"AM");var selAP=apS[0];var setSelAP=apS[1];
  var HOURS24=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
  var HOURS12=["12","1","2","3","4","5","6","7","8","9","10","11"];
  var HOURS=use24?HOURS24:HOURS12;
  function getResult(){
    if(use24) return selH+":"+selM;
    var h=parseInt(selH);if(selAP==="PM"&&h!==12)h+=12;if(selAP==="AM"&&h===12)h=0;
    return String(h).padStart(2,"0")+":"+selM;
  }
  var preview=use24?(selH+":"+selM):(selH+":"+selM+" "+selAP);
  var btn={border:"none",borderRadius:8,padding:"10px 6px",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:"bold",width:"100%"};
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#00B4D8",marginBottom:16}},props.label||"Select Time"),
    el("div",{style:{display:"grid",gridTemplateColumns:use24?"1fr 1fr":"1fr 1fr 1fr",gap:8,marginBottom:16}},
      el("div",null,
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:6,textAlign:"center"}},"Hour"),
        el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,overflow:"hidden",maxHeight:220,overflowY:"auto"}},
          HOURS.map(function(h){return el("button",{key:h,onClick:function(){setSelH(h);},style:Object.assign({},btn,{background:selH===h?"#00B4D8":"transparent",color:selH===h?"#1A1A2E":"#F0F4F8",borderRadius:0})},h);})
        )
      ),
      el("div",null,
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:6,textAlign:"center"}},"Min"),
        el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,overflow:"hidden",maxHeight:220,overflowY:"auto"}},
          MINS.map(function(m){return el("button",{key:m,onClick:function(){setSelM(m);},style:Object.assign({},btn,{background:selM===m?"#00B4D8":"transparent",color:selM===m?"#1A1A2E":"#F0F4F8",borderRadius:0})},m);})
        )
      ),
      !use24&&el("div",null,
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:6,textAlign:"center"}},"AM/PM"),
        el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,overflow:"hidden"}},
          ["AM","PM"].map(function(ap){return el("button",{key:ap,onClick:function(){setSelAP(ap);},style:Object.assign({},btn,{background:selAP===ap?"#00B4D8":"transparent",color:selAP===ap?"#1A1A2E":"#F0F4F8",borderRadius:0,padding:"16px 6px"})},ap);})
        )
      )
    ),
    el("div",{style:{textAlign:"center",color:"#FFD166",fontSize:20,fontWeight:"bold",marginBottom:16}},preview),
    el("div",{style:{display:"flex",gap:8}},
      el("button",{onClick:function(){props.onChange(getResult());props.onClose();},style:{flex:2,background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Set Time"),
      el("button",{onClick:props.onClose,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── Schedule Item Editor ──
function ScheduleEditor(props){
  var item=props.item||{};
  var fS=useState({
    task:item.task||"",
    time:normTo24(item.time||"08:00"),
    timeEnd:normTo24(item.timeEnd||"09:00"),
    cat:item.cat||(props.cats[0]&&props.cats[0].id)||"routine",
    repeat:item.repeat||"none",
    weeklyDays:item.weeklyDays||[]
  });
  var form=fS[0];var setForm=fS[1];
  var tpS=useState(null);var showTP=tpS[0];var setShowTP=tpS[1];
  function upd(k,v){setForm(function(p){var n=Object.assign({},p);n[k]=v;return n;});}
  function toggleWDay(idx){setForm(function(p){var n=Object.assign({},p);var wd=p.weeklyDays.slice();var pos=wd.indexOf(idx);if(pos>=0)wd.splice(pos,1);else wd.push(idx);n.weeklyDays=wd;return n;});}
  var inp={background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#F0F4F8",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
  var lbl={fontSize:11,color:"#90E0EF",marginBottom:4,display:"block"};
  if(showTP) return el(TimePicker,{
    label:showTP==="time"?"Start Time":"End Time",
    value:showTP==="time"?form.time:form.timeEnd,
    use24:props.use24,
    onChange:function(v){upd(showTP,v);},
    onClose:function(){setShowTP(null);}
  });
  var REPEAT_OPTS=[
    {v:"none",l:"No Repeat"},
    {v:"daily",l:"Daily"},
    {v:"weekdays",l:"Weekdays (Mon-Fri)"},
    {v:"weekends",l:"Weekends (Sat-Sun)"},
    {v:"weekly",l:"Weekly (pick days)"},
    {v:"monthly",l:"Monthly"}
  ];
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#00B4D8",marginBottom:16}},(item.id?"Edit":"Add")+" Schedule Block"),
    el("div",{style:{marginBottom:12}},
      el("span",{style:lbl},"Task Name"),
      el("input",{value:form.task,onChange:function(e){upd("task",e.target.value);},placeholder:"e.g. Morning Run",style:inp})
    ),
    el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
      el("div",null,
        el("span",{style:lbl},"Start Time"),
        el("button",{onClick:function(){setShowTP("time");},style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#FFD166",fontSize:13,width:"100%",cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontWeight:"bold"}},dispTime(form.time,props.use24)||"Tap to set")
      ),
      el("div",null,
        el("span",{style:lbl},"End Time"),
        el("button",{onClick:function(){setShowTP("timeEnd");},style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#FFD166",fontSize:13,width:"100%",cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontWeight:"bold"}},dispTime(form.timeEnd,props.use24)||"Tap to set")
      )
    ),
    el("div",{style:{marginBottom:12}},
      el("span",{style:lbl},"Category"),
      el("select",{value:form.cat,onChange:function(e){upd("cat",e.target.value);},style:Object.assign({},inp,{background:"#0F3460"})},
        props.cats.map(function(c){return el("option",{key:c.id,value:c.id},c.label);})
      )
    ),
    el("div",{style:{marginBottom:12}},
      el("span",{style:lbl},"Repeat"),
      el("select",{value:form.repeat,onChange:function(e){upd("repeat",e.target.value);},style:Object.assign({},inp,{background:"#0F3460"})},
        REPEAT_OPTS.map(function(o){return el("option",{key:o.v,value:o.v},o.l);})
      )
    ),
    form.repeat==="weekly"&&el("div",{style:{marginBottom:12}},
      el("span",{style:lbl},"Repeat on these days"),
      el("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},
        DAYS.map(function(d,i){
          var on=form.weeklyDays.indexOf(i)>=0;
          return el("button",{key:d,onClick:function(){toggleWDay(i);},style:{padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold",background:on?"#00B4D8":"rgba(255,255,255,0.1)",color:on?"#1A1A2E":"#90E0EF"}},d);
        })
      )
    ),
    el("div",{style:{display:"flex",gap:8,marginTop:4}},
      el("button",{onClick:function(){if(!form.task.trim())return;var out=Object.assign({},item,form);if(!out.id)out.id=uid();props.onSave(out);},style:{flex:2,background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},item.id?"Save Changes":"Add Block"),
      el("button",{onClick:props.onCancel,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── Generic Item Editor (checklist / goal) ──
function ItemEditor(props){
  var item=props.item||{};
  var type=props.type;
  var fields={checklist:[{k:"label",l:"Task Name",ph:"e.g. Drink water"}],goal:[{k:"title",l:"Goal Title",ph:"e.g. Run a 5K"},{k:"target",l:"Target / Deadline",ph:"e.g. 3 months"}]};
  var flds=fields[type]||fields.checklist;
  var init={cat:item.cat||(props.cats[0]&&props.cats[0].id)||"goals"};
  flds.forEach(function(f){init[f.k]=item[f.k]||"";});
  var fS=useState(init);var form=fS[0];var setForm=fS[1];
  function upd(k,v){setForm(function(p){var n=Object.assign({},p);n[k]=v;return n;});}
  var inp={background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#F0F4F8",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
  var lbl={fontSize:11,color:"#90E0EF",marginBottom:4,display:"block"};
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#00B4D8",marginBottom:16}},(item.id?"Edit":"Add")+" "+(type==="goal"?"Goal":"Checklist Item")),
    flds.map(function(f){return el("div",{key:f.k,style:{marginBottom:12}},el("span",{style:lbl},f.l),el("input",{value:form[f.k],onChange:function(e){upd(f.k,e.target.value);},placeholder:f.ph||"",style:inp}));}),
    el("div",{style:{marginBottom:16}},
      el("span",{style:lbl},"Category"),
      el("select",{value:form.cat,onChange:function(e){upd("cat",e.target.value);},style:Object.assign({},inp,{background:"#0F3460"})},
        props.cats.map(function(c){return el("option",{key:c.id,value:c.id},c.label);})
      )
    ),
    el("div",{style:{display:"flex",gap:8}},
      el("button",{onClick:function(){var out=Object.assign({},item,form);if(!out.id)out.id=uid();props.onSave(out);},style:{flex:2,background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},item.id?"Save Changes":"Add"),
      el("button",{onClick:props.onCancel,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── Confirm Delete ──
function ConfirmDelete(props){
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#EF476F",marginBottom:10}},"Delete Item"),
    el("div",{style:{fontSize:13,color:"#90E0EF",marginBottom:20,lineHeight:1.6}},'Delete "'+props.label+'"? This cannot be undone.'),
    el("div",{style:{display:"flex",gap:8}},
      el("button",{onClick:props.onConfirm,style:{flex:1,background:"#EF476F",border:"none",borderRadius:10,padding:"10px",color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Delete"),
      el("button",{onClick:props.onCancel,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── DragList ──
function DragList(props){
  var dragIdx=useRef(null);var overIdx=useRef(null);var itemsRef=useRef(props.items);itemsRef.current=props.items;
  function onDragStart(i){return function(e){dragIdx.current=i;if(e.dataTransfer)e.dataTransfer.effectAllowed="move";};}
  function onDragOver(i){return function(e){e.preventDefault();overIdx.current=i;};}
  function onDrop(){
    if(dragIdx.current===null||overIdx.current===null||dragIdx.current===overIdx.current){dragIdx.current=null;overIdx.current=null;return;}
    var arr=itemsRef.current.slice();var moved=arr.splice(dragIdx.current,1)[0];arr.splice(overIdx.current,0,moved);
    props.onReorder(arr);dragIdx.current=null;overIdx.current=null;
  }
  var touchDragIdx=useRef(null);
  function onTouchStart(i){return function(){touchDragIdx.current=i;};}
  function onTouchEnd(i){return function(){
    if(touchDragIdx.current===null||touchDragIdx.current===i){touchDragIdx.current=null;return;}
    var arr=itemsRef.current.slice();var moved=arr.splice(touchDragIdx.current,1)[0];arr.splice(i,0,moved);
    props.onReorder(arr);touchDragIdx.current=null;
  };}
  return el("div",{style:{display:"flex",flexDirection:"column",gap:props.gap||6}},
    props.items.map(function(item,idx){
      return el("div",{key:item.id||idx,draggable:true,onDragStart:onDragStart(idx),onDragOver:onDragOver(idx),onDrop:onDrop,onTouchStart:onTouchStart(idx),onTouchEnd:onTouchEnd(idx)},
        props.renderItem(item,idx)
      );
    })
  );
}

// ── Settings Page ──
function SettingsPage(props){
  var catsS=useState(props.cats.slice());var cats=catsS[0];var setCats=catsS[1];
  var newLabelS=useState("");var newLabel=newLabelS[0];var setNewLabel=newLabelS[1];
  var newBgS=useState("#00B4D8");var newBg=newBgS[0];var setNewBg=newBgS[1];
  var newFgS=useState("#fff");var newFg=newFgS[0];var setNewFg=newFgS[1];
  var cdS=useState(null);var confirmDel=cdS[0];var setConfirmDel=cdS[1];
  function addCat(){if(!newLabel.trim())return;setCats(function(p){return p.concat([{id:"cat_"+uid(),label:newLabel.trim(),bg:newBg,fg:newFg}]);});setNewLabel("");}
  function removeCat(id){setCats(function(p){return p.filter(function(c){return c.id!==id;});});setConfirmDel(null);}
  var inp={background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"};
  return el("div",{style:{position:"fixed",inset:0,background:"linear-gradient(135deg,#1A1A2E,#16213E)",zIndex:500,overflowY:"auto"}},
    confirmDel&&el(ConfirmDelete,{label:confirmDel.label,onConfirm:function(){removeCat(confirmDel.id);},onCancel:function(){setConfirmDel(null);}}),
    el("div",{style:{maxWidth:500,margin:"0 auto",padding:"20px 16px 60px"}},
      el("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:24}},
        el("button",{onClick:function(){props.onSave(cats);props.onClose();},style:{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"8px 14px",color:"#90E0EF",cursor:"pointer",fontFamily:"inherit",fontSize:13}},"< Back"),
        el("div",{style:{fontSize:18,fontWeight:"bold",color:"#00B4D8"}},"Settings")
      ),
      // Clock format
      el("div",{style:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:"1px solid rgba(0,180,216,0.15)",marginBottom:20}},
        el("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8",marginBottom:4}},"Clock Format"),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12}},"Choose how times are displayed throughout the app."),
        el("div",{style:{display:"flex",gap:8}},
          el("button",{onClick:function(){props.onUse24Change(true);},style:{flex:1,padding:"12px 8px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:"bold",background:props.use24?"#00B4D8":"rgba(255,255,255,0.08)",color:props.use24?"#1A1A2E":"#90E0EF"}},
            "24-Hour",el("div",{style:{fontSize:10,fontWeight:"normal",marginTop:3}},props.use24?"Active":"e.g. 13:45")
          ),
          el("button",{onClick:function(){props.onUse24Change(false);},style:{flex:1,padding:"12px 8px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:"bold",background:!props.use24?"#00B4D8":"rgba(255,255,255,0.08)",color:!props.use24?"#1A1A2E":"#90E0EF"}},
            "12-Hour",el("div",{style:{fontSize:10,fontWeight:"normal",marginTop:3}},!props.use24?"Active":"e.g. 1:45 PM")
          )
        )
      ),
      // Weather city
      el("div",{style:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:"1px solid rgba(0,180,216,0.15)",marginBottom:20}},
        el("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8",marginBottom:4}},"Weather Location"),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:10}},"Enter your city for the weather widget on the Schedule tab."),
        el("input",{value:props.weatherCity||"",onChange:function(e){props.onWeatherCityChange(e.target.value);},placeholder:"e.g. New York, Miami, Chicago",style:Object.assign({},inp,{width:"100%"})})
      ),
      // Categories
      el("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8",marginBottom:12}},"Categories"),
      el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:14,lineHeight:1.6}},"Shared across Schedule, Checklist, and Goals."),
      el("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:20}},
        cats.map(function(cat){
          return el("div",{key:cat.id,style:{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px 14px",border:"1px solid rgba(255,255,255,0.08)"}},
            el("div",{style:{width:28,height:28,borderRadius:8,background:cat.bg,flexShrink:0}}),
            el("div",{style:{flex:1,fontSize:13,color:"#F0F4F8",fontWeight:"bold"}},cat.label),
            el("button",{onClick:function(){setConfirmDel({id:cat.id,label:cat.label});},style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},"x")
          );
        })
      ),
      el("div",{style:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:16,border:"1px solid rgba(0,180,216,0.2)"}},
        el("div",{style:{fontSize:12,fontWeight:"bold",color:"#00B4D8",marginBottom:12}},"Add New Category"),
        el("div",{style:{marginBottom:10}},
          el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:4}},"Category Name"),
          el("input",{value:newLabel,onChange:function(e){setNewLabel(e.target.value);},placeholder:"e.g. Work, Travel...",style:Object.assign({},inp,{width:"100%"})})
        ),
        el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}},
          el("div",null,
            el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:4}},"Background Color"),
            el("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
              BG_PRESETS.map(function(bg){return el("div",{key:bg,onClick:function(){setNewBg(bg);},style:{width:26,height:26,borderRadius:6,background:bg,cursor:"pointer",border:newBg===bg?"2px solid #fff":"2px solid transparent"}});})
            )
          ),
          el("div",null,
            el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:4}},"Text Color"),
            el("div",{style:{display:"flex",gap:8}},
              ["#fff","#333"].map(function(fg){return el("div",{key:fg,onClick:function(){setNewFg(fg);},style:{width:36,height:36,borderRadius:8,background:newBg,cursor:"pointer",border:newFg===fg?"2px solid #00B4D8":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:12,color:fg}},fg==="#fff"?"White":"Dark");})
            )
          )
        ),
        el("div",{style:{background:newBg,color:newFg,borderRadius:8,padding:"6px 12px",display:"inline-block",fontSize:11,fontWeight:"bold",marginBottom:12}},newLabel||"Preview"),
        el("button",{onClick:addCat,style:{display:"block",width:"100%",background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Add Category")
      )
    )
  );
}

// ── Weather Widget ──
function WeatherWidget(props){
  // props: city, use24
  var dataS=useState(null);var data=dataS[0];var setData=dataS[1];
  var loadingS=useState(false);var loading=loadingS[0];var setLoading=loadingS[1];
  var errS=useState(null);var err=errS[0];var setErr=errS[1];
  var lastCityS=useState("");var lastCity=lastCityS[0];var setLastCity=lastCityS[1];

  useEffect(function(){
    if(!props.city||props.city.trim()===lastCity) return;
    var city=props.city.trim();
    setLoading(true);setErr(null);
    fetch("https://wttr.in/"+encodeURIComponent(city)+"?format=j1")
      .then(function(r){if(!r.ok)throw new Error("City not found");return r.json();})
      .then(function(d){
        setData(d);setLastCity(city);setLoading(false);
      })
      .catch(function(e){setErr("Could not load weather for "+city);setLoading(false);});
  },[props.city]);

  if(!props.city) return null;
  var card={background:"rgba(0,180,216,0.08)",border:"1px solid rgba(0,180,216,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:12};
  if(loading) return el("div",{style:card},el("div",{style:{fontSize:11,color:"#90E0EF"}},"Loading weather for "+props.city+"..."));
  if(err) return el("div",{style:card},el("div",{style:{fontSize:11,color:"#EF476F"}},err+" - Check city name in Settings"));
  if(!data) return null;

  var cur=data.current_condition&&data.current_condition[0];
  var weather=data.weather&&data.weather[0];
  if(!cur||!weather) return null;

  var desc=cur.weatherDesc&&cur.weatherDesc[0]&&cur.weatherDesc[0].value||"";
  var tempC=parseInt(cur.temp_C);var tempF=parseInt(cur.temp_F);
  var tempStr=tempC+"C / "+tempF+"F";
  var humidity=cur.humidity+"%";
  var windKmph=cur.windspeedKmph+" km/h";
  var maxC=parseInt(weather.maxtempC);var minC=parseInt(weather.mintempC);
  var maxF=parseInt(weather.maxtempF);var minF=parseInt(weather.mintempF);
  var rangeStr="H:"+maxC+"C/"+maxF+"F  L:"+minC+"C/"+minF+"F";

  // Hourly forecast (next 4 slots)
  var hourly=weather.hourly||[];
  var now=new Date().getHours();
  var upcoming=hourly.filter(function(h){return parseInt(h.time)/100>=now;}).slice(0,4);

  // Outdoor task warning
  var isRainy=desc.toLowerCase().indexOf("rain")>=0||desc.toLowerCase().indexOf("thunder")>=0||desc.toLowerCase().indexOf("snow")>=0;

  return el("div",{style:card},
    el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}},
      el("div",null,
        el("div",{style:{fontSize:13,fontWeight:"bold",color:"#00B4D8"}},props.city),
        el("div",{style:{fontSize:11,color:"#90E0EF"}},desc)
      ),
      el("div",{style:{textAlign:"right"}},
        el("div",{style:{fontSize:20,fontWeight:"bold",color:"#F0F4F8"}},tempStr),
        el("div",{style:{fontSize:10,color:"#90E0EF"}},rangeStr)
      )
    ),
    el("div",{style:{display:"flex",gap:12,fontSize:10,color:"#90E0EF",marginBottom:upcoming.length>0?8:0}},
      el("span",null,"Humidity: "+humidity),
      el("span",null,"Wind: "+windKmph)
    ),
    upcoming.length>0&&el("div",{style:{display:"flex",gap:6,overflowX:"auto"}},
      upcoming.map(function(h,i){
        var hNum=parseInt(h.time)/100;
        var timeLabel=props.use24?String(hNum).padStart(2,"0")+":00":(hNum===0||hNum===12?12:hNum%12)+":"+"00 "+(hNum<12?"AM":"PM");
        var hTempC=parseInt(h.tempC);var hTempF=parseInt(h.tempF);
        var rainChance=h.chanceofrain;
        return el("div",{key:i,style:{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"6px 8px",textAlign:"center",flexShrink:0,minWidth:64}},
          el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:2}},timeLabel),
          el("div",{style:{fontSize:11,fontWeight:"bold",color:"#F0F4F8"}},hTempC+"C"),
          el("div",{style:{fontSize:9,color:parseInt(rainChance)>50?"#EF476F":"#90E0EF"}},rainChance+"% rain")
        );
      })
    ),
    isRainy&&el("div",{style:{marginTop:8,background:"rgba(239,71,111,0.1)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#EF476F"}},"Rain expected - check weather-sensitive tasks (lawn, dog walks)")
  );
}

// ── Calendar / Overview Views ──
function CalendarView(props){
  // props: schedule, checklist, checked (obj by date key), blocks (obj by date key), goals, goalProg, cats, use24, onDaySelect
  var today=new Date();
  var viewS=useState("week");var view=viewS[0];var setView=viewS[1];
  var monthOffS=useState(0);var monthOff=monthOffS[0];var setMonthOff=monthOffS[1];

  // Build a date's block list including recurring
  function getBlocksForDate(date){
    var jsDay=date.getDay(); // 0=Sun
    var dayIdx=jsDayToIdx(jsDay);
    var dayKey=DAYS[dayIdx];
    var baseBlocks=(props.schedule[dayKey]||[]).filter(function(b){
      if(b.repeat==="none") return true;
      return false; // base schedule always shows
    });
    // Add recurring blocks from all days
    var recurring=[];
    DAYS.forEach(function(dk){
      (props.schedule[dk]||[]).forEach(function(b){
        if(b.repeat==="none") return;
        if(b.repeat==="daily") recurring.push(b);
        else if(b.repeat==="weekdays"&&dayIdx>=0&&dayIdx<=4) recurring.push(b);
        else if(b.repeat==="weekends"&&(dayIdx===5||dayIdx===6)) recurring.push(b);
        else if(b.repeat==="weekly"){var wd=b.weeklyDays||[];if(wd.indexOf(dayIdx)>=0)recurring.push(b);}
        else if(b.repeat==="monthly"){
          // same day-of-month
          var origDate=null;
          DAYS.forEach(function(od,oi){(props.schedule[od]||[]).forEach(function(ob){if(ob.id===b.id)origDate=oi;});});
          if(date.getDate()===b.monthDay) recurring.push(b);
        }
      });
    });
    // Deduplicate by id
    var ids={};var all=baseBlocks.concat(recurring);var result=[];
    all.forEach(function(b){if(!ids[b.id]){ids[b.id]=true;result.push(b);}});
    return result.sort(function(a,b2){return timeToMins(a.time)-timeToMins(b2.time);});
  }

  function dateKey(d){return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
  function getCheckedForDate(d){return props.checked[dateKey(d)]||{};}
  function getBlocksCompletedForDate(d){return props.blocks[dateKey(d)]||{};}

  function completionPct(d){
    var cl=props.checklist.length;if(cl===0)return 0;
    var chk=getCheckedForDate(d);
    var done=props.checklist.filter(function(t){return chk[t.id];}).length;
    return Math.round((done/cl)*100);
  }

  function pctColor(p){
    if(p>=80) return "#06D6A0";
    if(p>=50) return "#FFD166";
    if(p>0)   return "#EF476F";
    return "rgba(255,255,255,0.15)";
  }

  // Week view: Mon-Sun of current week
  var weekStart=new Date(today);
  weekStart.setDate(today.getDate()-jsDayToIdx(today.getDay()));

  // Month view
  var viewDate=new Date(today.getFullYear(),today.getMonth()+monthOff,1);
  var daysInMonth=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();
  var firstDayJS=viewDate.getDay(); // 0=Sun
  var firstDayIdx=jsDayToIdx(firstDayJS); // Mon=0

  var MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];

  function DayCell(dprops){
    var d=dprops.date;var isToday=d.toDateString()===today.toDateString();
    var pct=completionPct(d);
    var blocks=getBlocksForDate(d);
    return el("div",{onClick:function(){props.onDaySelect(d,blocks);},style:{background:isToday?"rgba(0,180,216,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(isToday?"rgba(0,180,216,0.5)":"rgba(255,255,255,0.07)"),borderRadius:10,padding:"8px 6px",cursor:"pointer",minHeight:dprops.compact?60:80}},
      el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}},
        el("div",{style:{fontSize:dprops.compact?11:13,fontWeight:"bold",color:isToday?"#00B4D8":"#F0F4F8"}},d.getDate()),
        pct>0&&el("div",{style:{width:8,height:8,borderRadius:"50%",background:pctColor(pct),flexShrink:0}})
      ),
      !dprops.compact&&el("div",{style:{fontSize:9,color:"#90E0EF",marginBottom:3}},blocks.length+" tasks"),
      pct>0&&el("div",{style:{background:"rgba(255,255,255,0.08)",borderRadius:4,height:4,overflow:"hidden"}},
        el("div",{style:{width:pct+"%",height:"100%",background:pctColor(pct)}})
      )
    );
  }

  return el("div",null,
    // View toggle
    el("div",{style:{display:"flex",gap:6,marginBottom:14}},
      el("button",{onClick:function(){setView("week");},style:{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold",background:view==="week"?"#00B4D8":"rgba(255,255,255,0.08)",color:view==="week"?"#1A1A2E":"#90E0EF"}},"Week View"),
      el("button",{onClick:function(){setView("month");},style:{flex:1,padding:"8px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold",background:view==="month"?"#00B4D8":"rgba(255,255,255,0.08)",color:view==="month"?"#1A1A2E":"#90E0EF"}},"Month View")
    ),

    // WEEK VIEW
    view==="week"&&el("div",null,
      el("div",{style:{fontSize:12,color:"#90E0EF",marginBottom:10,textAlign:"center"}},"Current Week"),
      el("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}},
        DAYS.map(function(d,i){
          return el("div",{key:d,style:{textAlign:"center",marginBottom:4}},
            el("div",{style:{fontSize:9,color:"#90E0EF",marginBottom:3}},d)
          );
        })
      ),
      el("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}},
        DAYS.map(function(d,i){
          var date=new Date(weekStart);date.setDate(weekStart.getDate()+i);
          return el(DayCell,{key:d,date:date,compact:true});
        })
      ),
      el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:10,textAlign:"center",lineHeight:1.6}},
        "Dot color: green=80%+  yellow=50%+  red=started  Tap any day for details"
      )
    ),

    // MONTH VIEW
    view==="month"&&el("div",null,
      el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        el("button",{onClick:function(){setMonthOff(function(p){return p-1;});},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 12px",color:"#90E0EF",cursor:"pointer",fontFamily:"inherit",fontSize:16}},"<"),
        el("div",{style:{fontSize:14,fontWeight:"bold",color:"#F0F4F8"}},MONTH_NAMES[viewDate.getMonth()]+" "+viewDate.getFullYear()),
        el("button",{onClick:function(){setMonthOff(function(p){return p+1;});},style:{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 12px",color:"#90E0EF",cursor:"pointer",fontFamily:"inherit",fontSize:16}},">")
      ),
      el("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}},
        DAYS.map(function(d){return el("div",{key:d,style:{textAlign:"center",fontSize:9,color:"#90E0EF",padding:"2px 0"}},d);})
      ),
      el("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}},
        // Empty cells before first day
        Array.from({length:firstDayIdx}).map(function(_,i){return el("div",{key:"e"+i});}),
        // Day cells
        Array.from({length:daysInMonth}).map(function(_,i){
          var date=new Date(viewDate.getFullYear(),viewDate.getMonth(),i+1);
          return el(DayCell,{key:i,date:date,compact:true});
        })
      )
    )
  );
}

// ── Day Detail Popup ──
function DayDetailPopup(props){
  // props: date, blocks, checklist, checked, cats, use24, onGoToDay, onClose
  var d=props.date;
  var MONTH_NAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var FULL_DAY_NAMES=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var title=FULL_DAY_NAMES[d.getDay()]+", "+MONTH_NAMES[d.getMonth()]+" "+d.getDate();
  var dayIdx=jsDayToIdx(d.getDay());
  var chk=props.checked||{};
  var checkedCount=props.checklist.filter(function(t){return chk[t.id];}).length;
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#00B4D8",marginBottom:4}},title),
    el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12}},checkedCount+" / "+props.checklist.length+" checklist items completed"),
    el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:8}},props.blocks.length+" scheduled blocks"),
    el("div",{style:{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:16}},
      props.blocks.slice(0,8).map(function(b,i){
        var c=props.cats.find(function(x){return x.id===b.cat;})||{bg:"#ADB5BD",fg:"#fff"};
        return el("div",{key:i,style:{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px"}},
          el("div",{style:{width:3,height:24,borderRadius:2,background:c.bg,flexShrink:0}}),
          el("div",{style:{flex:1}},
            el("div",{style:{fontSize:11,fontWeight:"bold",color:"#F0F4F8"}},b.task),
            el("div",{style:{fontSize:10,color:"#90E0EF"}},dispTime(b.time,props.use24)+(b.timeEnd?" - "+dispTime(b.timeEnd,props.use24):""))
          )
        );
      }),
      props.blocks.length>8&&el("div",{style:{fontSize:10,color:"#90E0EF",textAlign:"center",padding:"4px"}},"+"+(props.blocks.length-8)+" more")
    ),
    el("div",{style:{display:"flex",gap:8}},
      el("button",{onClick:function(){props.onGoToDay(DAYS[dayIdx]);props.onClose();},style:{flex:2,background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Go to This Day"),
      el("button",{onClick:props.onClose,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Close")
    )
  );
}

// ── Shopping List ──
function ShoppingTab(props){
  var listsS=useState(function(){return LS.get("shopping_lists",[{id:"default",name:"Groceries",items:[]}]);});
  var lists=listsS[0];var setLists=listsS[1];
  var activeLstS=useState("default");var activeList=activeLstS[0];var setActiveList=activeLstS[1];
  var newItemS=useState("");var newItem=newItemS[0];var setNewItem=newItemS[1];
  var newListS=useState("");var newListName=newListS[0];var setNewListName=newListS[1];
  var showNewListS=useState(false);var showNewList=showNewListS[0];var setShowNewList=showNewListS[1];
  var confirmDelS=useState(null);var confirmDel=confirmDelS[0];var setConfirmDel=confirmDelS[1];

  useEffect(function(){LS.set("shopping_lists",lists);},[lists]);

  var curList=lists.find(function(l){return l.id===activeList;})||lists[0];

  function addItem(){
    if(!newItem.trim()||!curList) return;
    setLists(function(p){return p.map(function(l){
      if(l.id!==curList.id) return l;
      return Object.assign({},l,{items:l.items.concat([{id:uid(),text:newItem.trim(),done:false,cat:props.cats[0]&&props.cats[0].id||"home"}])});
    });});
    setNewItem("");
  }
  function toggleItem(itemId){
    setLists(function(p){return p.map(function(l){
      if(l.id!==curList.id) return l;
      return Object.assign({},l,{items:l.items.map(function(it){return it.id===itemId?Object.assign({},it,{done:!it.done}):it;})});
    });});
  }
  function removeItem(itemId){
    setLists(function(p){return p.map(function(l){
      if(l.id!==curList.id) return l;
      return Object.assign({},l,{items:l.items.filter(function(it){return it.id!==itemId;})});
    });});
  }
  function clearDone(){
    setLists(function(p){return p.map(function(l){
      if(l.id!==curList.id) return l;
      return Object.assign({},l,{items:l.items.filter(function(it){return !it.done;})});
    });});
  }
  function addList(){
    if(!newListName.trim()) return;
    var id="list_"+uid();
    setLists(function(p){return p.concat([{id:id,name:newListName.trim(),items:[]}]);});
    setActiveList(id);setNewListName("");setShowNewList(false);
  }
  function removeList(id){
    setLists(function(p){return p.filter(function(l){return l.id!==id;});});
    setActiveList(lists[0]&&lists[0].id!==id?lists[0].id:(lists[1]&&lists[1].id)||"default");
    setConfirmDel(null);
  }

  var doneCount=curList?curList.items.filter(function(i){return i.done;}).length:0;
  var totalCount=curList?curList.items.length:0;

  return el("div",null,
    confirmDel&&el(ConfirmDelete,{label:confirmDel.label,onConfirm:function(){removeList(confirmDel.id);},onCancel:function(){setConfirmDel(null);}}),
    // List tabs
    el("div",{style:{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}},
      lists.map(function(l){
        return el("button",{key:l.id,onClick:function(){setActiveList(l.id);},style:{flex:"0 0 auto",padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:"bold",fontFamily:"inherit",background:activeList===l.id?"#00B4D8":"rgba(255,255,255,0.08)",color:activeList===l.id?"#1A1A2E":"#90E0EF"}},l.name);
      }),
      el("button",{onClick:function(){setShowNewList(function(p){return !p;});},style:{flex:"0 0 auto",padding:"7px 12px",borderRadius:8,border:"1px dashed rgba(0,180,216,0.4)",background:"transparent",cursor:"pointer",fontSize:12,color:"#00B4D8",fontFamily:"inherit"}},showNewList?"x":"+ List")
    ),
    // New list form
    showNewList&&el("div",{style:{display:"flex",gap:8,marginBottom:12}},
      el("input",{value:newListName,onChange:function(e){setNewListName(e.target.value);},placeholder:"List name...",style:{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:13,fontFamily:"inherit"}}),
      el("button",{onClick:addList,style:{background:"#00B4D8",border:"none",borderRadius:8,padding:"8px 14px",color:"#1A1A2E",fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",fontSize:13}},"Add")
    ),
    // Current list header
    curList&&el("div",null,
      el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
        el("div",{style:{fontSize:14,fontWeight:"bold",color:"#F0F4F8"}},curList.name,
          el("span",{style:{fontSize:11,color:"#90E0EF",fontWeight:"normal",marginLeft:8}},doneCount+"/"+totalCount+" done")
        ),
        el("div",{style:{display:"flex",gap:6}},
          doneCount>0&&el("button",{onClick:clearDone,style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:8,padding:"5px 10px",color:"#EF476F",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:"bold"}},"Clear Done"),
          lists.length>1&&el("button",{onClick:function(){setConfirmDel({id:curList.id,label:curList.name});},style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:8,padding:"5px 10px",color:"#EF476F",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:"bold"}},"Del List")
        )
      ),
      // Add item
      el("div",{style:{display:"flex",gap:8,marginBottom:12}},
        el("input",{value:newItem,onChange:function(e){setNewItem(e.target.value);},onKeyDown:function(e){if(e.key==="Enter")addItem();},placeholder:"Add item...",style:{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#F0F4F8",fontSize:13,fontFamily:"inherit"}}),
        el("button",{onClick:addItem,style:{background:"#00B4D8",border:"none",borderRadius:8,padding:"9px 16px",color:"#1A1A2E",fontWeight:"bold",cursor:"pointer",fontFamily:"inherit",fontSize:13}},"Add")
      ),
      // Items
      curList.items.length===0
        ?el("div",{style:{textAlign:"center",color:"#90E0EF",fontSize:12,padding:"24px 0",opacity:0.6}},"List is empty. Add items above.")
        :el("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          curList.items.map(function(item){
            return el("div",{key:item.id,style:{display:"flex",alignItems:"center",gap:10,background:item.done?"rgba(6,214,160,0.08)":"rgba(255,255,255,0.04)",border:"1px solid "+(item.done?"rgba(6,214,160,0.3)":"rgba(255,255,255,0.07)"),borderRadius:10,padding:"10px 12px"}},
              el("div",{onClick:function(){toggleItem(item.id);},style:{width:22,height:22,borderRadius:6,flexShrink:0,background:item.done?"#06D6A0":"rgba(255,255,255,0.1)",border:"2px solid "+(item.done?"#06D6A0":"rgba(255,255,255,0.3)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer"}},item.done?"v":""),
              el("div",{onClick:function(){toggleItem(item.id);},style:{flex:1,fontSize:13,color:item.done?"#06D6A0":"#F0F4F8",textDecoration:item.done?"line-through":"none",cursor:"pointer"}},item.text),
              el("button",{onClick:function(){removeItem(item.id);},style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}},"x")
            );
          })
        )
    )
  );
}

// ── Streaks & Stats ──
function StreaksPanel(props){
  // props: checklist, historyChecked (obj: dateKey -> {id:bool})
  var today=new Date();
  function dateKey(d){return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
  function pctForDate(d){
    var cl=props.checklist.length;if(cl===0)return 0;
    var chk=props.historyChecked[dateKey(d)]||{};
    var done=props.checklist.filter(function(t){return chk[t.id];}).length;
    return Math.round((done/cl)*100);
  }
  function isPerfect(d){return pctForDate(d)>=80;}

  // Calculate current streak
  var streak=0;
  var d=new Date(today);
  // Don't count today if it's not done yet
  for(var i=0;i<365;i++){
    var check=new Date(d);check.setDate(d.getDate()-i);
    if(isPerfect(check)) streak++;
    else if(i>0) break; // allow today to be incomplete
  }

  // Best streak
  var bestStreak=0;var curRun=0;
  for(var j=0;j<90;j++){
    var dd=new Date(today);dd.setDate(today.getDate()-j);
    if(isPerfect(dd)){curRun++;if(curRun>bestStreak)bestStreak=curRun;}
    else curRun=0;
  }

  // Last 30 days heatmap
  var last30=[];
  for(var k=29;k>=0;k--){var hd=new Date(today);hd.setDate(today.getDate()-k);last30.push(hd);}

  function heatColor(pct){
    if(pct>=80) return "#06D6A0";
    if(pct>=50) return "#FFD166";
    if(pct>0)   return "#EF476F";
    return "rgba(255,255,255,0.08)";
  }

  // Category completion this week
  var weekStats={};
  props.checklist.forEach(function(item){
    if(!weekStats[item.cat]) weekStats[item.cat]={total:0,done:0};
    weekStats[item.cat].total++;
  });
  for(var wi=0;wi<7;wi++){
    var wd=new Date(today);wd.setDate(today.getDate()-wi);
    var wchk=props.historyChecked[dateKey(wd)]||{};
    props.checklist.forEach(function(item){
      if(wchk[item.id]) weekStats[item.cat].done++;
    });
  }

  return el("div",null,
    // Streak cards
    el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}},
      el("div",{style:{background:"rgba(255,209,102,0.1)",border:"1px solid rgba(255,209,102,0.3)",borderRadius:14,padding:16,textAlign:"center"}},
        el("div",{style:{fontSize:32,fontWeight:"bold",color:"#FFD166"}},streak),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginTop:4}},"Current Streak"),
        el("div",{style:{fontSize:10,color:"#90E0EF"}},"days (80%+ complete)")
      ),
      el("div",{style:{background:"rgba(6,214,160,0.1)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:14,padding:16,textAlign:"center"}},
        el("div",{style:{fontSize:32,fontWeight:"bold",color:"#06D6A0"}},bestStreak),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginTop:4}},"Best Streak"),
        el("div",{style:{fontSize:10,color:"#90E0EF"}},"last 90 days")
      )
    ),
    // 30-day heatmap
    el("div",{style:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid rgba(255,255,255,0.08)"}},
      el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"30-Day Activity"),
      el("div",{style:{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:4}},
        last30.map(function(hd,i){
          var pct=pctForDate(hd);
          var isToday=hd.toDateString()===today.toDateString();
          return el("div",{key:i,title:hd.toDateString()+": "+pct+"%",style:{aspectRatio:"1",borderRadius:4,background:heatColor(pct),border:isToday?"2px solid #00B4D8":"2px solid transparent"}});
        })
      ),
      el("div",{style:{display:"flex",gap:12,marginTop:8,fontSize:9,color:"#90E0EF"}},
        el("span",null,el("span",{style:{display:"inline-block",width:8,height:8,borderRadius:2,background:"#06D6A0",marginRight:3}}),"80%+"),
        el("span",null,el("span",{style:{display:"inline-block",width:8,height:8,borderRadius:2,background:"#FFD166",marginRight:3}}),"50%+"),
        el("span",null,el("span",{style:{display:"inline-block",width:8,height:8,borderRadius:2,background:"#EF476F",marginRight:3}}),"Started"),
        el("span",null,el("span",{style:{display:"inline-block",width:8,height:8,borderRadius:2,background:"rgba(255,255,255,0.1)",marginRight:3}}),"None")
      )
    ),
    // Category breakdown this week
    el("div",{style:{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,0.08)"}},
      el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"This Week by Category"),
      el("div",{style:{display:"flex",flexDirection:"column",gap:8}},
        Object.keys(weekStats).map(function(catId){
          var s=weekStats[catId];
          var c=props.cats.find(function(x){return x.id===catId;})||{bg:"#ADB5BD",label:catId};
          var pct=s.total>0?Math.round((s.done/s.total)*100):0;
          return el("div",{key:catId},
            el("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:11}},
              el("span",{style:{color:"#F0F4F8",fontWeight:"bold"}},c.label),
              el("span",{style:{color:"#90E0EF"}},s.done+" / "+s.total)
            ),
            el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:6,height:7,overflow:"hidden"}},
              el("div",{style:{width:pct+"%",height:"100%",background:c.bg,borderRadius:6,transition:"width 0.3s"}})
            )
          );
        })
      )
    )
  );
}

// ── Main App ──────────────────────────────────────────────────
function App(){
  var todayIdx=(new Date().getDay()+6)%7;
  var tk=todayKey();

  var tabS=useState("schedule");var activeTab=tabS[0];var setActiveTab=tabS[1];
  var dayS=useState(DAYS[todayIdx]);var activeDay=dayS[0];var setActiveDay=dayS[1];
  var showSettingsS=useState(false);var showSettings=showSettingsS[0];var setShowSettings=showSettingsS[1];

  // Persistent data
  var catsS=useState(function(){return LS.get("cats2",DEFAULT_CATS);});var cats=catsS[0];var setCats=catsS[1];
  var u24S=useState(function(){return LS.get("use24",true);});var use24=u24S[0];var setUse24=u24S[1];
  var weatherCityS=useState(function(){return LS.get("weatherCity","");});var weatherCity=weatherCityS[0];var setWeatherCity=weatherCityS[1];
  var schedS=useState(function(){return LS.get("sched3",DEFAULT_SCHEDULE);});var schedule=schedS[0];var setSchedule=schedS[1];
  var chkS=useState(function(){return LS.get("chklist3",DEFAULT_CHECKLIST);});var checklist=chkS[0];var setChecklist=chkS[1];
  var goalsS=useState(function(){return LS.get("goals3",DEFAULT_GOALS);});var goals=goalsS[0];var setGoals=goalsS[1];
  // Per-date checked/blocks stored by date key
  var checkedAllS=useState(function(){return LS.get("checkedAll",{});});var checkedAll=checkedAllS[0];var setCheckedAll=checkedAllS[1];
  var blocksAllS=useState(function(){return LS.get("blocksAll",{});});var blocksAll=blocksAllS[0];var setBlocksAll=blocksAllS[1];
  var gpS=useState(function(){return LS.get("gp3",{});});var goalProg=gpS[0];var setGoalProg=gpS[1];
  var remEnS=useState(function(){return LS.get("rem",{});});var remEnabled=remEnS[0];var setRemEnabled=remEnS[1];
  var npS=useState(typeof Notification!=="undefined"?Notification.permission:"default");var notifPerm=npS[0];var setNotifPerm=npS[1];

  // Helpers to read/write today's checked and blocks
  function getTodayChecked(){return checkedAll[tk]||{};}
  function setTodayChecked(fn){setCheckedAll(function(p){var n=Object.assign({},p);n[tk]=fn(p[tk]||{});return n;});}
  function getTodayBlocks(){return blocksAll[tk]||{};}
  function setTodayBlocks(fn){setBlocksAll(function(p){var n=Object.assign({},p);n[tk]=fn(p[tk]||{});return n;});}

  useEffect(function(){LS.set("cats2",cats);},[cats]);
  useEffect(function(){LS.set("use24",use24);},[use24]);
  useEffect(function(){LS.set("weatherCity",weatherCity);},[weatherCity]);
  useEffect(function(){LS.set("sched3",schedule);},[schedule]);
  useEffect(function(){LS.set("chklist3",checklist);},[checklist]);
  useEffect(function(){LS.set("goals3",goals);},[goals]);
  useEffect(function(){LS.set("checkedAll",checkedAll);},[checkedAll]);
  useEffect(function(){LS.set("blocksAll",blocksAll);},[blocksAll]);
  useEffect(function(){LS.set("gp3",goalProg);},[goalProg]);
  useEffect(function(){LS.set("rem",remEnabled);},[remEnabled]);

  // Modal state
  var schedEdS=useState(null);var schedEd=schedEdS[0];var setSchedEd=schedEdS[1];
  var itemEdS=useState(null);var itemEd=itemEdS[0];var setItemEd=itemEdS[1];
  var confirmS=useState(null);var confirmDel=confirmS[0];var setConfirmDel=confirmS[1];
  var dayDetailS=useState(null);var dayDetail=dayDetailS[0];var setDayDetail=dayDetailS[1];

  // Voice state
  var vaS=useState(false);var voiceActive=vaS[0];var setVoiceActive=vaS[1];
  var vtS=useState(null);var voiceTarget=vtS[0];var setVoiceTarget=vtS[1];
  var vtxS=useState("");var voiceTxt=vtxS[0];var setVoiceTxt=vtxS[1];
  var vsS=useState("");var voiceSt=vsS[0];var setVoiceSt=vsS[1];
  var vpS=useState(null);var voiceParsed=vpS[0];var setVoiceParsed=vpS[1];
  var svS=useState(false);var showVoice=svS[0];var setShowVoice=svS[1];
  var recogRef=useRef(null);

  var checked=getTodayChecked();
  var blocks=getTodayBlocks();
  var checkedCount=checklist.filter(function(t){return checked[t.id];}).length;
  var pct=Math.round((checkedCount/Math.max(checklist.length,1))*100);

  function getCat(id){return cats.find(function(c){return c.id===id;})||{bg:"#ADB5BD",fg:"#fff",label:"Other"};}
  function catBadge(catId){var c=getCat(catId);return {background:c.bg,color:c.fg,fontSize:9,padding:"2px 7px",borderRadius:5,fontWeight:"bold",textTransform:"uppercase",whiteSpace:"nowrap"};}

  // Schedule CRUD
  function saveSchedItem(day,item){
    setSchedule(function(p){
      var n=Object.assign({},p);var arr=(n[day]||[]).slice();
      var existing=arr.findIndex(function(x){return x.id===item.id;});
      if(existing>=0) arr[existing]=item; else arr.push(item);
      arr.sort(function(a,b){return timeToMins(a.time)-timeToMins(b.time);});
      n[day]=arr;return n;
    });
  }
  function deleteSchedItem(day,id){setSchedule(function(p){var n=Object.assign({},p);n[day]=(n[day]||[]).filter(function(x){return x.id!==id;});return n;});}
  function sortSchedByTime(day){setSchedule(function(p){var n=Object.assign({},p);var arr=(n[day]||[]).slice();arr.sort(function(a,b){return timeToMins(a.time)-timeToMins(b.time);});n[day]=arr;return n;});}
  function reorderSched(day,arr){setSchedule(function(p){var n=Object.assign({},p);n[day]=arr;return n;});}

  // Get schedule for active day including recurring from other days
  function getScheduleForDay(dayKey){
    var dayIdx=DAYS.indexOf(dayKey);
    var base=(schedule[dayKey]||[]).slice();
    var seen={};base.forEach(function(b){seen[b.id]=true;});
    DAYS.forEach(function(dk){
      (schedule[dk]||[]).forEach(function(b){
        if(seen[b.id]||b.repeat==="none") return;
        if(b.repeat==="daily"){seen[b.id]=true;base.push(Object.assign({},b));}
        else if(b.repeat==="weekdays"&&dayIdx>=0&&dayIdx<=4){seen[b.id]=true;base.push(Object.assign({},b));}
        else if(b.repeat==="weekends"&&(dayIdx===5||dayIdx===6)){seen[b.id]=true;base.push(Object.assign({},b));}
        else if(b.repeat==="weekly"){var wd=b.weeklyDays||[];if(wd.indexOf(dayIdx)>=0){seen[b.id]=true;base.push(Object.assign({},b));}}
      });
    });
    return base.sort(function(a,b){return timeToMins(a.time)-timeToMins(b.time);});
  }

  function saveCheckItem(item,isNew){setChecklist(function(p){if(isNew)return p.concat([item]);return p.map(function(x){return x.id===item.id?item:x;});});}
  function deleteCheckItem(id){setChecklist(function(p){return p.filter(function(x){return x.id!==id;});});}
  function saveGoal(item,isNew){setGoals(function(p){if(isNew)return p.concat([item]);return p.map(function(x){return x.id===item.id?item:x;});});}
  function deleteGoal(id){setGoals(function(p){return p.filter(function(x){return x.id!==id;});});}

  function toggleCheck(id){setTodayChecked(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}
  function toggleBlock(id){setTodayBlocks(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}

  // Voice
  function parseChecklist(t){return {id:uid(),label:t.trim(),cat:(cats[0]&&cats[0].id)||"goals"};}
  function parseSchedule(t){
    var lo=t.toLowerCase();var tm=t.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    var dnames=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    var day=activeDay;for(var i=0;i<dnames.length;i++){if(lo.indexOf(dnames[i])>=0){day=DAYS[i];break;}}
    var task=tm?t.replace(tm[0],"").replace(/\b(?:on\s)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,"").trim():t.trim();
    return {day:day,time:tm?normTo24(tm[0].trim()):"08:00",timeEnd:"09:00",task:task||t.trim(),cat:(cats[0]&&cats[0].id)||"routine",repeat:"none",weeklyDays:[]};
  }
  function startVoice(target){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setVoiceSt("Voice not supported. Use Chrome.");setShowVoice(true);setVoiceTarget(target);return;}
    setVoiceTarget(target);setVoiceTxt("");setVoiceSt("Listening...");setVoiceParsed(null);setShowVoice(true);
    var r=new SR();recogRef.current=r;r.lang="en-US";r.interimResults=true;r.maxAlternatives=1;
    r.onstart=function(){setVoiceActive(true);};
    r.onresult=function(e){var tr=Array.from(e.results).map(function(x){return x[0].transcript;}).join("");setVoiceTxt(tr);if(e.results[e.results.length-1].isFinal){setVoiceActive(false);setVoiceSt("Got it! Review below.");if(target==="checklist")setVoiceParsed({type:"checklist",data:parseChecklist(tr)});if(target==="schedule")setVoiceParsed({type:"schedule",data:parseSchedule(tr)});}};
    r.onerror=function(e){setVoiceActive(false);setVoiceSt("Error: "+e.error+". Try again.");};r.onend=function(){setVoiceActive(false);};r.start();
  }
  function stopVoice(){if(recogRef.current)recogRef.current.stop();setVoiceActive(false);}
  function confirmVoice(){
    if(!voiceParsed)return;
    if(voiceParsed.type==="checklist") saveCheckItem(voiceParsed.data,true);
    if(voiceParsed.type==="schedule"){saveSchedItem(voiceParsed.data.day,{id:uid(),time:voiceParsed.data.time,timeEnd:voiceParsed.data.timeEnd,task:voiceParsed.data.task,cat:voiceParsed.data.cat,repeat:"none",weeklyDays:[]});setActiveDay(voiceParsed.data.day);setActiveTab("schedule");}
    setShowVoice(false);setVoiceParsed(null);setVoiceTxt("");
  }

  // Notifications
  function requestNotif(){if(typeof Notification==="undefined")return;Notification.requestPermission().then(function(p){setNotifPerm(p);if(p==="granted")schedReminders();});}
  function schedReminders(){if(typeof Notification==="undefined"||Notification.permission!=="granted")return;var sw=navigator.serviceWorker&&navigator.serviceWorker.controller;if(!sw)return;var now=new Date();REMINDERS.forEach(function(rem){if(!remEnabled[rem.id])return;var parts=rem.time.split(":");var fire=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(parts[0]),parseInt(parts[1]),0);if(fire<=now)return;sw.postMessage({type:"SCHEDULE_NOTIFICATION",delay:fire-now,title:rem.label,body:"Reminder: "+rem.label,tag:rem.id});});}
  useEffect(function(){if(notifPerm==="granted")schedReminders();},[remEnabled,notifPerm]);
  function toggleReminder(id){setRemEnabled(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}

  var S={btn:{border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold"},card:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,0.1)"}};

  function RowActions(rprops){
    return el("div",{style:{display:"flex",gap:5,flexShrink:0}},
      el("button",{onClick:function(e){e.stopPropagation();rprops.onEdit();},style:{background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.3)",color:"#00B4D8",borderRadius:7,width:30,height:30,cursor:"pointer",fontSize:11,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center"}},"Ed"),
      el("button",{onClick:function(e){e.stopPropagation();rprops.onDelete();},style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:30,height:30,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}},"x")
    );
  }

  var tabs=[{id:"schedule",label:"Schedule"},{id:"checklist",label:"Checklist"},{id:"goals",label:"Goals"},{id:"overview",label:"Overview"},{id:"shopping",label:"Shopping"},{id:"streaks",label:"Streaks"},{id:"alerts",label:"Alerts"}];

  if(showSettings) return el(SettingsPage,{cats:cats,use24:use24,onUse24Change:function(v){setUse24(v);},weatherCity:weatherCity,onWeatherCityChange:function(v){setWeatherCity(v);},onSave:function(newCats){setCats(newCats);},onClose:function(){setShowSettings(false);}});

  return el("div",{style:{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",minHeight:"100vh",color:"#F0F4F8"}},

    // Modals
    schedEd&&el(ScheduleEditor,{item:schedEd.item,cats:cats,use24:use24,onSave:function(saved){saveSchedItem(schedEd.day,saved);setSchedEd(null);},onCancel:function(){setSchedEd(null);}}),
    itemEd&&el(ItemEditor,{type:itemEd.type,item:itemEd.item,cats:cats,onSave:function(saved){if(itemEd.type==="checklist")saveCheckItem(saved,!itemEd.item.id);if(itemEd.type==="goal")saveGoal(saved,!itemEd.item.id);setItemEd(null);},onCancel:function(){setItemEd(null);}}),
    confirmDel&&el(ConfirmDelete,{label:confirmDel.label,onConfirm:function(){confirmDel.onConfirm();setConfirmDel(null);},onCancel:function(){setConfirmDel(null);}}),
    dayDetail&&el(DayDetailPopup,{date:dayDetail.date,blocks:dayDetail.blocks,checklist:checklist,checked:checkedAll[dayDetail.date.getFullYear()+"-"+(dayDetail.date.getMonth()+1)+"-"+dayDetail.date.getDate()]||{},cats:cats,use24:use24,onGoToDay:function(d){setActiveDay(d);setActiveTab("schedule");},onClose:function(){setDayDetail(null);}}),

    // Voice modal
    showVoice&&el(Modal,null,
      el("div",{style:{fontWeight:"bold",fontSize:15,color:"#A78BFA",marginBottom:6}},"Voice - "+(voiceTarget==="checklist"?"Checklist":"Schedule")),
      el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:16,lineHeight:1.6}},voiceTarget==="checklist"?"Say any task":"Say a task, time, and day"),
      el("div",{style:{textAlign:"center",marginBottom:16}},
        el("div",{onClick:voiceActive?stopVoice:function(){startVoice(voiceTarget);},style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:70,height:70,borderRadius:"50%",background:voiceActive?"rgba(239,71,111,0.2)":"rgba(167,139,250,0.15)",border:"3px solid "+(voiceActive?"#EF476F":"#A78BFA"),fontSize:14,cursor:"pointer",color:voiceActive?"#EF476F":"#A78BFA",fontWeight:"bold",transition:"all 0.3s",boxShadow:voiceActive?"0 0 0 8px rgba(239,71,111,0.12)":"none"}},voiceActive?"STOP":"MIC"),
        el("div",{style:{fontSize:12,color:voiceActive?"#EF476F":"#90E0EF",marginTop:8}},voiceActive?"Recording - tap to stop":"Tap to start")
      ),
      voiceTxt&&el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#F0F4F8",marginBottom:12,border:"1px solid rgba(167,139,250,0.3)",fontStyle:"italic"}},'"'+voiceTxt+'"'),
      el("div",{style:{fontSize:12,color:"#90E0EF",marginBottom:12,textAlign:"center"}},voiceSt),
      voiceParsed&&el("div",{style:{background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"12px",marginBottom:12}},
        el("div",{style:{fontSize:11,color:"#06D6A0",fontWeight:"bold",marginBottom:8}},"Review before saving:"),
        voiceParsed.type==="checklist"&&el("div",{style:{fontSize:12,color:"#F0F4F8"}},"Add: "+voiceParsed.data.label),
        voiceParsed.type==="schedule"&&["day","time","task"].map(function(k){return el("div",{key:k,style:{fontSize:12,color:"#F0F4F8",marginBottom:3}},el("span",{style:{color:"#90E0EF",textTransform:"capitalize"}},k+": "),voiceParsed.data[k]);})
      ),
      el("div",{style:{display:"flex",gap:8}},
        voiceParsed&&el("button",{onClick:confirmVoice,style:Object.assign({},S.btn,{flex:2,background:"#06D6A0",color:"#1A1A2E"})},"Add to Planner"),
        el("button",{onClick:function(){setShowVoice(false);stopVoice();setVoiceParsed(null);setVoiceTxt("");},style:Object.assign({},S.btn,{flex:1,background:"rgba(255,255,255,0.1)",color:"#90E0EF"})},"Cancel")
      )
    ),

    // Floating MIC
    !schedEd&&!itemEd&&!confirmDel&&!showVoice&&!dayDetail&&el("button",{onClick:function(){startVoice(activeTab==="checklist"?"checklist":"schedule");},style:{position:"fixed",bottom:22,right:18,zIndex:200,width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C3AED)",border:"none",fontSize:13,cursor:"pointer",boxShadow:"0 4px 20px rgba(124,58,237,0.5)",color:"#fff",fontWeight:"bold"}},"MIC"),

    // Header
    el("div",{style:{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(0,180,216,0.3)",padding:"14px 16px 10px",position:"sticky",top:0,zIndex:100}},
      el("div",{style:{maxWidth:800,margin:"0 auto"}},
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
          el("div",null,
            el("div",{style:{fontSize:19,fontWeight:"bold",color:"#00B4D8"}},"Family Planner"),
            el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:1}},"Health · Learning · Home · Family")
          ),
          el("div",{style:{display:"flex",alignItems:"center",gap:10}},
            el("button",{onClick:function(){setShowSettings(true);},style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,padding:"6px 12px",color:"#90E0EF",cursor:"pointer",fontFamily:"inherit",fontSize:12}},"Settings"),
            el("div",{style:{background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.4)",borderRadius:12,padding:"5px 12px",textAlign:"center"}},
              el("div",{style:{fontSize:16,fontWeight:"bold",color:pct===100?"#06D6A0":"#FFD166"}},pct+"%"),
              el("div",{style:{fontSize:10,color:"#90E0EF"}},"Today")
            )
          )
        ),
        el("div",{style:{display:"flex",gap:3,overflowX:"auto"}},
          tabs.map(function(t){return el("button",{key:t.id,onClick:function(){setActiveTab(t.id);},style:{flex:"0 0 auto",padding:"7px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,background:activeTab===t.id?"#00B4D8":"rgba(255,255,255,0.07)",color:activeTab===t.id?"#1A1A2E":"#90E0EF",fontWeight:activeTab===t.id?"bold":"normal",whiteSpace:"nowrap"}},t.label);})
        )
      )
    ),

    // Content
    el("div",{style:{maxWidth:800,margin:"0 auto",padding:"14px 12px 80px"}},

      // SCHEDULE
      activeTab==="schedule"&&el("div",null,
        el(WeatherWidget,{city:weatherCity,use24:use24}),
        el("div",{style:{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4}},
          DAYS.map(function(d,i){return el("button",{key:d,onClick:function(){setActiveDay(d);},style:{flex:"0 0 auto",padding:"7px 11px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,background:activeDay===d?"#00B4D8":"rgba(255,255,255,0.08)",color:activeDay===d?"#1A1A2E":"#90E0EF",fontWeight:activeDay===d?"bold":"normal",borderBottom:i===todayIdx?"2px solid #FFD166":"2px solid transparent"}},d,i===todayIdx&&el("div",{style:{fontSize:7,color:activeDay===d?"#0F3460":"#FFD166",marginTop:1}},"TODAY"));})
        ),
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          el("div",{style:{fontSize:11,color:"#90E0EF",textTransform:"uppercase",letterSpacing:1}},FULL_DAYS[DAYS.indexOf(activeDay)]),
          el("div",{style:{display:"flex",gap:6}},
            el("button",{onClick:function(){startVoice("schedule");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
              "Voice"
            ),
            el("button",{onClick:function(){sortSchedByTime(activeDay);},style:Object.assign({},S.btn,{background:"rgba(255,209,102,0.15)",color:"#FFD166",border:"1px solid rgba(255,209,102,0.3)"})},
              "Sort"
            ),
            el("button",{onClick:function(){setSchedEd({item:{},day:activeDay});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
              "+ Add"
            )
          )
        ),
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:8,lineHeight:1.5}},"Drag to reorder. Recurring items shown with a repeat badge."),
        el(DragList,{
          items:getScheduleForDay(activeDay),gap:6,
          onReorder:function(arr){
            // Only reorder base items for this day, not recurring from other days
            var base=arr.filter(function(b){
              var orig=schedule[activeDay]||[];
              return orig.find(function(x){return x.id===b.id;});
            });
            reorderSched(activeDay,base);
          },
          renderItem:function(block){
            var done=!!blocks[block.id];
            var c=getCat(block.cat);
            var timeStr=block.timeEnd?dispTime(block.time,use24)+" - "+dispTime(block.timeEnd,use24):dispTime(block.time,use24);
            var isRecurring=block.repeat&&block.repeat!=="none";
            var repeatLabels={daily:"Daily",weekdays:"Weekdays",weekends:"Weekends",weekly:"Weekly",monthly:"Monthly"};
            return el("div",{style:{display:"flex",alignItems:"center",gap:8,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:12,padding:"9px 10px"}},
              el("div",{style:{color:"#90E0EF",fontSize:16,cursor:"grab",padding:"0 4px",flexShrink:0,userSelect:"none"}},"="),
              el("div",{onClick:function(){toggleBlock(block.id);},style:{width:3,height:34,borderRadius:2,background:done?"#06D6A0":c.bg,flexShrink:0,cursor:"pointer"}}),
              el("div",{onClick:function(){toggleBlock(block.id);},style:{flex:1,cursor:"pointer",minWidth:0}},
                el("div",{style:{fontSize:12,fontWeight:"bold",color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},block.task),
                el("div",{style:{display:"flex",alignItems:"center",gap:5,marginTop:2}},
                  el("span",{style:{fontSize:10,color:"#90E0EF"}},timeStr),
                  isRecurring&&el("span",{style:{fontSize:8,background:"rgba(255,209,102,0.2)",color:"#FFD166",borderRadius:4,padding:"1px 4px",fontWeight:"bold"}},repeatLabels[block.repeat]||"Repeat")
                )
              ),
              el("div",{style:Object.assign({},catBadge(block.cat),{marginRight:2})},c.label),
              el(RowActions,{
                onEdit:function(){setSchedEd({item:block,day:activeDay});},
                onDelete:function(){setConfirmDel({label:block.task,onConfirm:function(){deleteSchedItem(activeDay,block.id);}});}
              })
            );
          }
        })
      ),

      // CHECKLIST
      activeTab==="checklist"&&el("div",null,
        el("div",{style:Object.assign({},S.card,{marginBottom:14})},
          el("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}},
            el("span",{style:{color:"#90E0EF"}},"Daily Progress"),
            el("span",{style:{color:pct===100?"#06D6A0":"#FFD166",fontWeight:"bold"}},checkedCount+" / "+checklist.length)
          ),
          el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:8,height:10,overflow:"hidden"}},
            el("div",{style:{width:pct+"%",height:"100%",borderRadius:8,background:pct===100?"linear-gradient(90deg,#06D6A0,#00B4D8)":"linear-gradient(90deg,#00B4D8,#FFD166)",transition:"width 0.4s"}})
          ),
          pct===100&&el("div",{style:{textAlign:"center",marginTop:8,color:"#06D6A0",fontSize:12,fontWeight:"bold"}},"Perfect day!")
        ),
        el("div",{style:{display:"flex",justifyContent:"flex-end",gap:6,marginBottom:8}},
          el("button",{onClick:function(){startVoice("checklist");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
            "Voice"
          ),
          el("button",{onClick:function(){setItemEd({type:"checklist",item:{}});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
            "+ Add Item"
          )
        ),
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:8}},"Drag handle to reorder."),
        el(DragList,{items:checklist,gap:7,onReorder:function(arr){setChecklist(arr);},
          renderItem:function(item){
            var done=!!checked[item.id];var c=getCat(item.cat);
            return el("div",{style:{display:"flex",alignItems:"center",gap:10,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"10px 12px"}},
              el("div",{style:{color:"#90E0EF",fontSize:16,cursor:"grab",padding:"0 2px",flexShrink:0,userSelect:"none"}},"="),
              el("div",{onClick:function(){toggleCheck(item.id);},style:{width:22,height:22,borderRadius:6,flexShrink:0,background:done?"#06D6A0":"rgba(255,255,255,0.1)",border:"2px solid "+(done?"#06D6A0":c.bg),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer"}},done?"v":""),
              el("div",{onClick:function(){toggleCheck(item.id);},style:{flex:1,fontSize:12,color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none",fontWeight:done?"normal":"bold",cursor:"pointer"}},item.label),
              el("div",{style:Object.assign({},catBadge(item.cat),{marginRight:2})},c.label),
              el(RowActions,{onEdit:function(){setItemEd({type:"checklist",item:item});},onDelete:function(){setConfirmDel({label:item.label,onConfirm:function(){deleteCheckItem(item.id);}});}})
            );
          }
        })
      ),

      // GOALS
      activeTab==="goals"&&el("div",null,
        el("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:12}},
          el("button",{onClick:function(){setItemEd({type:"goal",item:{}});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
            "+ Add Goal"
          )
        ),
        el("div",{style:{fontSize:10,color:"#90E0EF",marginBottom:10}},"Drag to reorder. Tap +/- to update progress."),
        el(DragList,{items:goals,gap:10,onReorder:function(arr){setGoals(arr);},
          renderItem:function(goal){
            var prog=goalProg[goal.id]||0;var c=getCat(goal.cat);
            return el("div",{style:{background:"rgba(255,255,255,0.04)",border:"1px solid "+(prog===100?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:14,padding:14}},
              el("div",{style:{display:"flex",alignItems:"flex-start",gap:8,marginBottom:10}},
                el("div",{style:{color:"#90E0EF",fontSize:16,cursor:"grab",padding:"2px 4px",flexShrink:0,userSelect:"none",marginTop:2}},"="),
                el("div",{style:{flex:1}},
                  el("div",{style:{fontSize:13,fontWeight:"bold",color:prog===100?"#06D6A0":"#F0F4F8"}},goal.title+(prog===100?" - Complete!":"")),
                  el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},"Target: "+goal.target)
                ),
                el("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  el("div",{style:catBadge(goal.cat)},c.label),
                  el(RowActions,{onEdit:function(){setItemEd({type:"goal",item:goal});},onDelete:function(){setConfirmDel({label:goal.title,onConfirm:function(){deleteGoal(goal.id);}});}})
                )
              ),
              el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:6,height:8,marginBottom:10,overflow:"hidden"}},
                el("div",{style:{width:prog+"%",height:"100%",background:prog===100?"#06D6A0":c.bg,borderRadius:6,transition:"width 0.3s"}})
              ),
              el("div",{style:{display:"flex",alignItems:"center",gap:8}},
                el("button",{onClick:function(){var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=Math.max(0,(p[id]||0)-5);return n;});},style:{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#F0F4F8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}},"-"),
                el("input",{type:"number",min:0,max:100,value:prog,onChange:function(e){var v=Math.min(100,Math.max(0,Number(e.target.value)));var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=v;return n;});},style:{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"7px 0",color:prog===100?"#06D6A0":"#FFD166",fontSize:18,fontWeight:"bold",textAlign:"center",fontFamily:"inherit"}}),
                el("span",{style:{color:"#90E0EF",fontSize:13,flexShrink:0}},"%"),
                el("button",{onClick:function(){var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=Math.min(100,(p[id]||0)+5);return n;});},style:{width:36,height:36,borderRadius:8,background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.3)",color:"#00B4D8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}},"+")
              )
            );
          }
        })
      ),

      // OVERVIEW (Week/Month Calendar)
      activeTab==="overview"&&el("div",null,
        el(CalendarView,{
          schedule:schedule,checklist:checklist,
          checked:checkedAll,blocks:blocksAll,
          goals:goals,goalProg:goalProg,cats:cats,use24:use24,
          onDaySelect:function(date,blocks){setDayDetail({date:date,blocks:blocks});}
        })
      ),

      // SHOPPING
      activeTab==="shopping"&&el(ShoppingTab,{cats:cats}),

      // STREAKS
      activeTab==="streaks"&&el(StreaksPanel,{checklist:checklist,historyChecked:checkedAll,cats:cats}),

      // ALERTS
      activeTab==="alerts"&&el("div",null,
        notifPerm!=="granted"&&el("div",{style:{background:"rgba(255,209,102,0.1)",border:"1px solid rgba(255,209,102,0.4)",borderRadius:14,padding:16,marginBottom:16,textAlign:"center"}},
          el("div",{style:{fontSize:14,color:"#FFD166",fontWeight:"bold",marginBottom:6}},"Enable Notifications"),
          el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12,lineHeight:1.6}},"Get reminders for dog walks, drop-offs, trash day, and more."),
          el("button",{onClick:requestNotif,style:Object.assign({},S.btn,{background:"#FFD166",color:"#1A1A2E",padding:"10px 24px",fontSize:13})},"Allow Notifications")
        ),
        notifPerm==="granted"&&el("div",{style:{background:"rgba(6,214,160,0.1)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#06D6A0",fontWeight:"bold",textAlign:"center"}},"Notifications enabled"),
        notifPerm==="denied"&&el("div",{style:{background:"rgba(239,71,111,0.1)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#EF476F",textAlign:"center"}},"Notifications blocked. Enable in phone settings then refresh."),
        el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"Daily Reminders"),
        el("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          REMINDERS.map(function(rem){
            var on=!!remEnabled[rem.id];var dnames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            return el("div",{key:rem.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid "+(on?"rgba(0,180,216,0.3)":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}},
              el("div",{style:{flex:1}},
                el("div",{style:{fontSize:12,fontWeight:"bold",color:on?"#F0F4F8":"#90E0EF"}},rem.label),
                el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},rem.time+" - "+rem.days.map(function(d){return dnames[d];}).join(", "))
              ),
              el("div",{onClick:function(){toggleReminder(rem.id);},style:{width:44,height:26,borderRadius:13,background:on?"#00B4D8":"rgba(255,255,255,0.15)",position:"relative",cursor:"pointer",transition:"background 0.25s",flexShrink:0}},
                el("div",{style:{position:"absolute",top:3,left:on?20:3,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}})
              )
            );
          })
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
