var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef;

var LS={
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
};
function todayKey(){return new Date().toISOString().slice(0,10);}
function uid(){return Date.now()+"_"+Math.random().toString(36).slice(2,7);}

var DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
var FULL_DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
var CAT_KEYS=["fitness","learning","goals","home","family","pet","health","routine"];
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

var DEFAULT_SCHEDULE={
  Mon:[
    {id:"m1",time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {id:"m2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"m3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"m4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"m5",time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {id:"m6",time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {id:"m7",time:"8:45-10:00 AM",task:"Learning Block",cat:"learning"},
    {id:"m8",time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {id:"m9",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"m10",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"m11",time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {id:"m12",time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {id:"m13",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"m14",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"m15",time:"7:00-8:30 PM",task:"Reading / Learn",cat:"learning"},
    {id:"m16",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"m17",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Tue:[
    {id:"t1",time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {id:"t2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"t3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"t4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"t5",time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {id:"t6",time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {id:"t7",time:"8:45-10:00 AM",task:"Learning Block",cat:"learning"},
    {id:"t8",time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {id:"t9",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"t10",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"t11",time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {id:"t12",time:"3:00-5:00 PM",task:"Strength Training",cat:"fitness"},
    {id:"t13",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"t14",time:"6:00-6:30 PM",task:"Family Dinner",cat:"family"},
    {id:"t15",time:"6:30-8:00 PM",task:"Mow Lawn (weather permitting)",cat:"home"},
    {id:"t16",time:"8:00-8:15 PM",task:"Take Trash to Curb",cat:"home"},
    {id:"t17",time:"8:15-9:00 PM",task:"Wind Down",cat:"routine"},
    {id:"t18",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"t19",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Wed:[
    {id:"w1",time:"5:00-6:00 AM",task:"Stretch / Yoga",cat:"fitness"},
    {id:"w2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"w3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"w4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"w5",time:"7:30-8:00 AM",task:"Help Daughter Get Ready",cat:"family"},
    {id:"w6",time:"8:00-8:45 AM",task:"Drop off at In-Laws & Return",cat:"family"},
    {id:"w7",time:"8:45-9:00 AM",task:"Bring Trash Can Back from Curb",cat:"home"},
    {id:"w8",time:"9:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {id:"w9",time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {id:"w10",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"w11",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"w12",time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {id:"w13",time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {id:"w14",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"w15",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"w16",time:"7:00-8:30 PM",task:"Reading / Learn",cat:"learning"},
    {id:"w17",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"w18",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Thu:[
    {id:"th1",time:"5:00-6:00 AM",task:"Workout / Run",cat:"fitness"},
    {id:"th2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"th3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"th4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"th5",time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {id:"th6",time:"8:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {id:"th7",time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {id:"th8",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"th9",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"th10",time:"1:20-3:00 PM",task:"Learning / Study",cat:"learning"},
    {id:"th11",time:"3:00-5:00 PM",task:"Strength Training",cat:"fitness"},
    {id:"th12",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"th13",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"th14",time:"7:00-8:30 PM",task:"Wind Down",cat:"routine"},
    {id:"th15",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"th16",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Fri:[
    {id:"f1",time:"5:00-6:00 AM",task:"Stretch / Yoga",cat:"fitness"},
    {id:"f2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"f3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"f4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"f5",time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {id:"f6",time:"8:00-10:00 AM",task:"Learning Block",cat:"learning"},
    {id:"f7",time:"10:00-12:00 PM",task:"Goal Work / Focus",cat:"goals"},
    {id:"f8",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"f9",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"f10",time:"1:20-3:00 PM",task:"Errands / Prep",cat:"home"},
    {id:"f11",time:"3:00-5:00 PM",task:"Home / Admin",cat:"home"},
    {id:"f12",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"f13",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"f14",time:"7:00-8:30 PM",task:"Family Fun Night",cat:"family"},
    {id:"f15",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"f16",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Sat:[
    {id:"sa1",time:"5:00-6:00 AM",task:"Long Run / Hike",cat:"fitness"},
    {id:"sa2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"sa3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"sa4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"sa5",time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {id:"sa6",time:"8:00-9:00 AM",task:"Deep Clean",cat:"home"},
    {id:"sa7",time:"9:00-10:00 AM",task:"Home Projects",cat:"home"},
    {id:"sa8",time:"10:00-12:00 PM",task:"Goals / Projects",cat:"goals"},
    {id:"sa9",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"sa10",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"sa11",time:"1:20-3:00 PM",task:"Family Time",cat:"family"},
    {id:"sa12",time:"3:00-5:00 PM",task:"Free Time",cat:"family"},
    {id:"sa13",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"sa14",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"sa15",time:"7:00-8:30 PM",task:"Flexible",cat:"routine"},
    {id:"sa16",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"sa17",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ],
  Sun:[
    {id:"su1",time:"5:00-6:00 AM",task:"Rest / Recovery",cat:"fitness"},
    {id:"su2",time:"6:00-6:20 AM",task:"Morning Dog Walk (15-20 min)",cat:"pet"},
    {id:"su3",time:"6:20-7:00 AM",task:"Morning Routine",cat:"routine"},
    {id:"su4",time:"7:00-7:30 AM",task:"Family Breakfast",cat:"family"},
    {id:"su5",time:"7:30-8:00 AM",task:"Family Morning Prep",cat:"family"},
    {id:"su6",time:"8:00-9:00 AM",task:"Read / Relax",cat:"learning"},
    {id:"su7",time:"9:00-10:00 AM",task:"Outdoor / Garden",cat:"home"},
    {id:"su8",time:"10:00-12:00 PM",task:"Family Activity",cat:"family"},
    {id:"su9",time:"12:00-1:00 PM",task:"Lunch + Break",cat:"health"},
    {id:"su10",time:"1:00-1:20 PM",task:"Afternoon Dog Walk (15-20 min)",cat:"pet"},
    {id:"su11",time:"1:20-3:00 PM",task:"Family Time",cat:"family"},
    {id:"su12",time:"3:00-5:00 PM",task:"Free Time",cat:"family"},
    {id:"su13",time:"5:00-6:00 PM",task:"Meal Prep / Cook",cat:"home"},
    {id:"su14",time:"6:00-7:00 PM",task:"Family Dinner",cat:"family"},
    {id:"su15",time:"7:00-8:30 PM",task:"Prep Week Ahead",cat:"goals"},
    {id:"su16",time:"9:15-9:30 PM",task:"Night Dog Walk (10-15 min)",cat:"pet"},
    {id:"su17",time:"9:30-10:00 PM",task:"Night Routine",cat:"routine"}
  ]
};

var DEFAULT_CHECKLIST=[
  {id:"water",    label:"Drink 8 glasses of water",         cat:"health"},
  {id:"exercise", label:"Complete workout / movement",      cat:"fitness"},
  {id:"morning",  label:"Full morning routine",             cat:"routine"},
  {id:"dog_am",   label:"Morning dog walk (15-20 min)",     cat:"pet"},
  {id:"breakfast",label:"Healthy breakfast with family",    cat:"family"},
  {id:"daughter", label:"Help daughter get ready",          cat:"family"},
  {id:"learn",    label:"30 min learning / study",          cat:"learning"},
  {id:"goal",     label:"Work on a goal / project",         cat:"goals"},
  {id:"home_t",   label:"Complete 1 home task",             cat:"home"},
  {id:"dog_pm",   label:"Afternoon dog walk (15-20 min)",   cat:"pet"},
  {id:"meal_prep",label:"Meal prep / cook dinner",          cat:"home"},
  {id:"family_t", label:"Quality family time (no screens)", cat:"family"},
  {id:"steps",    label:"Hit 8,000+ steps",                 cat:"fitness"},
  {id:"read_eve", label:"Evening reading 20 min",           cat:"learning"},
  {id:"journal",  label:"Journal / reflect",                cat:"goals"},
  {id:"dog_night",label:"Night dog walk (10-15 min)",       cat:"pet"},
  {id:"sleep",    label:"Lights out by 10 PM",              cat:"health"}
];

var DEFAULT_GOALS=[
  {id:"g1",title:"Run a 5K without stopping",      cat:"fitness",  target:"3 months"},
  {id:"g2",title:"Read 12 books this year",         cat:"learning", target:"Year-end"},
  {id:"g3",title:"Complete an online course",       cat:"learning", target:"2 months"},
  {id:"g4",title:"Declutter and organize home",     cat:"home",     target:"6 weeks"},
  {id:"g5",title:"Establish meal prep routine",     cat:"home",     target:"4 weeks"},
  {id:"g6",title:"Screen-free family evenings",     cat:"family",   target:"Ongoing"},
  {id:"g7",title:"Build consistent sleep schedule", cat:"health",   target:"Ongoing"}
];

var REMINDERS=[
  {id:"r1", label:"Morning Workout",         time:"05:00", days:[1,2,3,4,5]},
  {id:"r2", label:"Morning Dog Walk",        time:"06:00", days:[0,1,2,3,4,5,6]},
  {id:"r3", label:"Help Daughter Get Ready", time:"07:30", days:[1,2,3]},
  {id:"r4", label:"Drop Off at In-Laws",     time:"08:00", days:[1,2,3]},
  {id:"r5", label:"Afternoon Dog Walk",      time:"13:00", days:[0,1,2,3,4,5,6]},
  {id:"r6", label:"Meal Prep / Cook",        time:"17:00", days:[0,1,2,3,4,5,6]},
  {id:"r7", label:"Night Dog Walk",          time:"21:15", days:[0,1,2,3,4,5,6]},
  {id:"r8", label:"Take Trash to Curb",      time:"20:00", days:[2]},
  {id:"r9", label:"Bring Trash Can Back",    time:"09:00", days:[3]},
  {id:"r10",label:"Wind Down for Bed",       time:"21:30", days:[0,1,2,3,4,5,6]}
];

function el(type,props){
  var args=[type,props||null];
  for(var i=2;i<arguments.length;i++) args.push(arguments[i]);
  return React.createElement.apply(React,args);
}

// ── Reusable Modal ────────────────────────────────────────────
function Modal(props){
  return el("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}},
    el("div",{style:{background:"#16213E",borderRadius:18,padding:22,width:"100%",maxWidth:420,border:"1px solid rgba(0,180,216,0.4)",maxHeight:"85vh",overflowY:"auto"}},
      props.children
    )
  );
}

// ── Item Editor Modal ─────────────────────────────────────────
function ItemEditor(props){
  // props: type ("schedule"|"checklist"|"goal"|"nutrition_target"|"reminder")
  // item: existing item or null for new
  // onSave(item), onCancel()
  var item=props.item||{};
  var type=props.type;

  var fields={
    schedule: [{k:"time",l:"Time (e.g. 7:00-8:00 AM)",ph:"7:00-8:00 AM"},{k:"task",l:"Task Name",ph:"e.g. Morning Run"},{k:"cat",l:"Category",type:"select"}],
    checklist:[{k:"label",l:"Task Name",ph:"e.g. Drink water"},{k:"cat",l:"Category",type:"select"}],
    goal:     [{k:"title",l:"Goal Title",ph:"e.g. Run a 5K"},{k:"target",l:"Target / Deadline",ph:"e.g. 3 months"},{k:"cat",l:"Category",type:"select"}],
    reminder: [{k:"label",l:"Reminder Name",ph:"e.g. Take vitamins"},{k:"time",l:"Time (24hr, e.g. 07:30)",ph:"07:30"}]
  };

  var flds=fields[type]||fields.checklist;
  var initForm={};
  flds.forEach(function(f){initForm[f.k]=item[f.k]||"";});
  if(type==="schedule"&&!item.cat) initForm.cat="routine";
  if(type==="checklist"&&!item.cat) initForm.cat="goals";
  if(type==="goal"&&!item.cat) initForm.cat="goals";

  var formS=useState(initForm);
  var form=formS[0]; var setForm=formS[1];

  function update(k,v){setForm(function(p){var n=Object.assign({},p);n[k]=v;return n;});}

  function handleSave(){
    var out=Object.assign({},item,form);
    if(!out.id) out.id=uid();
    props.onSave(out);
  }

  var S={
    label:{fontSize:11,color:"#90E0EF",marginBottom:4,display:"block"},
    input:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"9px 11px",color:"#F0F4F8",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"},
    field:{marginBottom:12}
  };

  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#00B4D8",marginBottom:16}},
      (item.id?"Edit":"Add")+" "+(type==="schedule"?"Schedule Block":type==="checklist"?"Checklist Item":type==="goal"?"Goal":"Reminder")
    ),
    flds.map(function(f){
      return el("div",{key:f.k,style:S.field},
        el("span",{style:S.label},f.l),
        f.type==="select"
          ? el("select",{value:form[f.k],onChange:function(e){update(f.k,e.target.value);},style:Object.assign({},S.input,{background:"#0F3460"})},
              CAT_KEYS.map(function(ck){return el("option",{key:ck,value:ck},CAT[ck].label);})
            )
          : el("input",{value:form[f.k],onChange:function(e){update(f.k,e.target.value);},placeholder:f.ph||"",style:S.input})
      );
    }),
    el("div",{style:{display:"flex",gap:8,marginTop:4}},
      el("button",{onClick:handleSave,style:{flex:2,background:"#00B4D8",border:"none",borderRadius:10,padding:"10px",color:"#1A1A2E",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},item.id?"Save Changes":"Add"),
      el("button",{onClick:props.onCancel,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── Confirm Delete Modal ──────────────────────────────────────
function ConfirmDelete(props){
  return el(Modal,null,
    el("div",{style:{fontWeight:"bold",fontSize:15,color:"#EF476F",marginBottom:10}},"Delete Item"),
    el("div",{style:{fontSize:13,color:"#90E0EF",marginBottom:20,lineHeight:1.6}},
      'Are you sure you want to delete "'+props.label+'"? This cannot be undone.'
    ),
    el("div",{style:{display:"flex",gap:8}},
      el("button",{onClick:props.onConfirm,style:{flex:1,background:"#EF476F",border:"none",borderRadius:10,padding:"10px",color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Delete"),
      el("button",{onClick:props.onCancel,style:{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:10,padding:"10px",color:"#90E0EF",fontSize:13,cursor:"pointer",fontFamily:"inherit"}},"Cancel")
    )
  );
}

// ── Main App ──────────────────────────────────────────────────
function App(){
  var todayIdx=(new Date().getDay()+6)%7;
  var tk=todayKey();

  // Core state
  var tabS=useState("schedule"); var activeTab=tabS[0]; var setActiveTab=tabS[1];
  var dayS=useState(DAYS[todayIdx]); var activeDay=dayS[0]; var setActiveDay=dayS[1];

  // Persistent data
  var schedS=useState(function(){return LS.get("sched2",DEFAULT_SCHEDULE);}); var schedule=schedS[0]; var setSchedule=schedS[1];
  var chkListS=useState(function(){return LS.get("chklist2",DEFAULT_CHECKLIST);}); var checklist=chkListS[0]; var setChecklist=chkListS[1];
  var goalsS=useState(function(){return LS.get("goals2",DEFAULT_GOALS);}); var goals=goalsS[0]; var setGoals=goalsS[1];
  var mealsS=useState(function(){return LS.get("meals_"+tk,[]);}); var meals=mealsS[0]; var setMeals=mealsS[1];
  var checkedS=useState(function(){return LS.get("chk_"+tk,{});}); var checked=checkedS[0]; var setChecked=checkedS[1];
  var blocksS=useState(function(){return LS.get("blk_"+tk,{});}); var blocks=blocksS[0]; var setBlocks=blocksS[1];
  var gpS=useState(function(){return LS.get("gp2",{});}); var goalProg=gpS[0]; var setGoalProg=gpS[1];
  var tgtS=useState(function(){return LS.get("ntgt",{calories:2400,protein:200,carbs:220,fat:75});}); var targets=tgtS[0]; var setTargets=tgtS[1];
  var remEnS=useState(function(){return LS.get("rem",{});}); var remEnabled=remEnS[0]; var setRemEnabled=remEnS[1];
  var npS=useState(typeof Notification!=="undefined"?Notification.permission:"default"); var notifPerm=npS[0]; var setNotifPerm=npS[1];

  // Persist
  useEffect(function(){LS.set("sched2",schedule);},[schedule]);
  useEffect(function(){LS.set("chklist2",checklist);},[checklist]);
  useEffect(function(){LS.set("goals2",goals);},[goals]);
  useEffect(function(){LS.set("meals_"+tk,meals);},[meals]);
  useEffect(function(){LS.set("chk_"+tk,checked);},[checked]);
  useEffect(function(){LS.set("blk_"+tk,blocks);},[blocks]);
  useEffect(function(){LS.set("gp2",goalProg);},[goalProg]);
  useEffect(function(){LS.set("ntgt",targets);},[targets]);
  useEffect(function(){LS.set("rem",remEnabled);},[remEnabled]);

  // Edit/delete modal state
  var editorS=useState(null); var editor=editorS[0]; var setEditor=editorS[1];
  // editor: {type, item, context} where context e.g. {day:"Mon"} for schedule

  var confirmS=useState(null); var confirm=confirmS[0]; var setConfirm=confirmS[1];
  // confirm: {label, onConfirm}

  // Meal form state
  var mealInputS=useState({name:"",calories:"",protein:"",carbs:"",fat:"",mealTime:"Breakfast"});
  var mealInput=mealInputS[0]; var setMealInput=mealInputS[1];
  var showMealS=useState(false); var showMealForm=showMealS[0]; var setShowMealForm=showMealS[1];
  var editMealS=useState(null); var editMeal=editMealS[0]; var setEditMeal=editMealS[1];

  // Nutrition targets edit
  var editTgtS=useState(false); var editingTgt=editTgtS[0]; var setEditingTgt=editTgtS[1];
  var tmpTgtS=useState(targets); var tmpTgt=tmpTgtS[0]; var setTmpTgt=tmpTgtS[1];

  // Voice state
  var vaS=useState(false); var voiceActive=vaS[0]; var setVoiceActive=vaS[1];
  var vtS=useState(null); var voiceTarget=vtS[0]; var setVoiceTarget=vtS[1];
  var vtxS=useState(""); var voiceTxt=vtxS[0]; var setVoiceTxt=vtxS[1];
  var vsS=useState(""); var voiceSt=vsS[0]; var setVoiceSt=vsS[1];
  var vpS=useState(null); var voiceParsed=vpS[0]; var setVoiceParsed=vpS[1];
  var svS=useState(false); var showVoice=svS[0]; var setShowVoice=svS[1];
  var recogRef=useRef(null);

  // Nutrition totals
  var totals=meals.reduce(function(a,m){return {calories:a.calories+(Number(m.calories)||0),protein:a.protein+(Number(m.protein)||0),carbs:a.carbs+(Number(m.carbs)||0),fat:a.fat+(Number(m.fat)||0)};},{calories:0,protein:0,carbs:0,fat:0});

  var checkedCount=checklist.filter(function(t){return checked[t.id];}).length;
  var pct=Math.round((checkedCount/Math.max(checklist.length,1))*100);

  function toggleCheck(id){setChecked(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}
  function toggleBlock(id){setBlocks(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}
  function macroColor(v,t){var p=v/t;if(p>=0.95&&p<=1.1)return "#06D6A0";if(p>1.1)return "#EF476F";if(p>=0.7)return "#FFD166";return "#90E0EF";}

  // ── Schedule CRUD ──
  function saveScheduleItem(day,item,isNew){
    setSchedule(function(p){
      var n=Object.assign({},p);
      var arr=n[day].slice();
      if(isNew){arr.push(item);}
      else{arr=arr.map(function(x){return x.id===item.id?item:x;});}
      n[day]=arr;
      return n;
    });
  }
  function deleteScheduleItem(day,id){
    setSchedule(function(p){
      var n=Object.assign({},p);
      n[day]=n[day].filter(function(x){return x.id!==id;});
      return n;
    });
  }

  // ── Checklist CRUD ──
  function saveChecklistItem(item,isNew){
    setChecklist(function(p){
      if(isNew) return p.concat([item]);
      return p.map(function(x){return x.id===item.id?item:x;});
    });
  }
  function deleteChecklistItem(id){
    setChecklist(function(p){return p.filter(function(x){return x.id!==id;});});
  }

  // ── Goals CRUD ──
  function saveGoal(item,isNew){
    setGoals(function(p){
      if(isNew) return p.concat([item]);
      return p.map(function(x){return x.id===item.id?item:x;});
    });
  }
  function deleteGoal(id){
    setGoals(function(p){return p.filter(function(x){return x.id!==id;});});
  }

  // ── Meals CRUD ──
  function addOrUpdateMeal(){
    if(!mealInput.name||!mealInput.calories) return;
    if(editMeal){
      setMeals(function(p){return p.map(function(m){return m.id===editMeal?Object.assign({id:editMeal},mealInput):m;});});
      setEditMeal(null);
    } else {
      setMeals(function(p){return p.concat([Object.assign({id:uid()},mealInput)]);});
    }
    setMealInput({name:"",calories:"",protein:"",carbs:"",fat:"",mealTime:"Breakfast"});
    setShowMealForm(false);
  }
  function startEditMeal(meal){
    setMealInput({name:meal.name,calories:meal.calories,protein:meal.protein,carbs:meal.carbs,fat:meal.fat,mealTime:meal.mealTime});
    setEditMeal(meal.id);
    setShowMealForm(true);
  }
  function deleteMeal(id){setMeals(function(p){return p.filter(function(m){return m.id!==id;});});}

  // ── Voice ──
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
  function parseChecklist(t){return {id:uid(),label:t.trim(),cat:"goals"};}
  function parseSchedule(t){
    var lo=t.toLowerCase();
    var tm=t.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    var dnames=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    var day=activeDay;
    for(var i=0;i<dnames.length;i++){if(lo.indexOf(dnames[i])>=0){day=DAYS[i];break;}}
    var cats={fitness:["workout","run","gym","yoga"],learning:["study","learn","read"],home:["clean","cook","chores"],family:["family","dinner"]};
    var cat="routine";
    var cks=Object.keys(cats);
    for(var ci=0;ci<cks.length;ci++){for(var ki=0;ki<cats[cks[ci]].length;ki++){if(lo.indexOf(cats[cks[ci]][ki])>=0){cat=cks[ci];break;}}}
    var task=tm?t.replace(tm[0],"").replace(/\b(?:on\s)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,"").trim():t.trim();
    return {day:day,time:tm?tm[0].trim():"Flexible",task:task||t.trim(),cat:cat};
  }
  function startVoice(target){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setVoiceSt("Voice not supported. Please use Chrome.");setShowVoice(true);setVoiceTarget(target);return;}
    setVoiceTarget(target);setVoiceTxt("");setVoiceSt("Listening...");setVoiceParsed(null);setShowVoice(true);
    var r=new SR();recogRef.current=r;r.lang="en-US";r.interimResults=true;r.maxAlternatives=1;
    r.onstart=function(){setVoiceActive(true);};
    r.onresult=function(e){
      var tr=Array.from(e.results).map(function(x){return x[0].transcript;}).join("");
      setVoiceTxt(tr);
      if(e.results[e.results.length-1].isFinal){
        setVoiceActive(false);setVoiceSt("Got it! Review below.");
        if(target==="nutrition") setVoiceParsed({type:"nutrition",data:parseNutrition(tr)});
        if(target==="checklist") setVoiceParsed({type:"checklist",data:parseChecklist(tr)});
        if(target==="schedule")  setVoiceParsed({type:"schedule", data:parseSchedule(tr)});
      }
    };
    r.onerror=function(e){setVoiceActive(false);setVoiceSt("Error: "+e.error+". Try again.");};
    r.onend=function(){setVoiceActive(false);};
    r.start();
  }
  function stopVoice(){if(recogRef.current)recogRef.current.stop();setVoiceActive(false);}
  function confirmVoice(){
    if(!voiceParsed) return;
    if(voiceParsed.type==="nutrition"){setMealInput(voiceParsed.data);setShowMealForm(true);setActiveTab("nutrition");}
    if(voiceParsed.type==="checklist"){saveChecklistItem(voiceParsed.data,true);}
    if(voiceParsed.type==="schedule"){
      var d=voiceParsed.data;
      saveScheduleItem(d.day,{id:uid(),time:d.time,task:d.task,cat:d.cat},true);
      setActiveDay(d.day);setActiveTab("schedule");
    }
    setShowVoice(false);setVoiceParsed(null);setVoiceTxt("");
  }

  // ── Notifications ──
  function requestNotif(){
    if(typeof Notification==="undefined") return;
    Notification.requestPermission().then(function(p){setNotifPerm(p);if(p==="granted")schedReminders();});
  }
  function schedReminders(){
    if(typeof Notification==="undefined"||Notification.permission!=="granted") return;
    var sw=navigator.serviceWorker&&navigator.serviceWorker.controller;
    if(!sw) return;
    var now=new Date();
    REMINDERS.forEach(function(rem){
      if(!remEnabled[rem.id]) return;
      var parts=rem.time.split(":");
      var fire=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(parts[0]),parseInt(parts[1]),0);
      if(fire<=now) return;
      sw.postMessage({type:"SCHEDULE_NOTIFICATION",delay:fire-now,title:rem.label,body:"Reminder: "+rem.label,tag:rem.id});
    });
  }
  useEffect(function(){if(notifPerm==="granted")schedReminders();},[remEnabled,notifPerm]);
  function toggleReminder(id){setRemEnabled(function(p){var n=Object.assign({},p);n[id]=!n[id];return n;});}

  // ── Shared styles ──
  var S={
    card:{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,0.1)"},
    btn:{border:"none",borderRadius:10,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:"bold"},
    input:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.25)",borderRadius:8,padding:"8px 10px",color:"#F0F4F8",fontSize:12,width:"100%",boxSizing:"border-box",fontFamily:"inherit"},
    catBadge:function(cat){var c=CAT[cat]||CAT.routine;return {background:c.bg,color:c.fg,fontSize:9,padding:"2px 7px",borderRadius:5,fontWeight:"bold",textTransform:"uppercase",whiteSpace:"nowrap"};}
  };

  // ── Action buttons (edit/delete) for each row ──
  function RowActions(props){
    return el("div",{style:{display:"flex",gap:5,flexShrink:0}},
      el("button",{
        onClick:function(e){e.stopPropagation();props.onEdit();},
        style:{background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.3)",color:"#00B4D8",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold"}
      },"Ed"),
      el("button",{
        onClick:function(e){e.stopPropagation();props.onDelete();},
        style:{background:"rgba(239,71,111,0.15)",border:"1px solid rgba(239,71,111,0.3)",color:"#EF476F",borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}
      },"x")
    );
  }

  var tabs=[{id:"schedule",label:"Schedule"},{id:"checklist",label:"Checklist"},{id:"nutrition",label:"Nutrition"},{id:"goals",label:"Goals"},{id:"alerts",label:"Alerts"}];

  return el("div",{style:{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",minHeight:"100vh",color:"#F0F4F8"}},

    // ── Modals ──
    editor&&el(ItemEditor,{
      type:editor.type,
      item:editor.item,
      onSave:function(saved){
        var isNew=!editor.item||!editor.item.id;
        if(editor.type==="schedule") saveScheduleItem(editor.context.day,saved,isNew);
        if(editor.type==="checklist") saveChecklistItem(saved,isNew);
        if(editor.type==="goal") saveGoal(saved,isNew);
        setEditor(null);
      },
      onCancel:function(){setEditor(null);}
    }),

    confirm&&el(ConfirmDelete,{
      label:confirm.label,
      onConfirm:function(){confirm.onConfirm();setConfirm(null);},
      onCancel:function(){setConfirm(null);}
    }),

    // Voice modal
    showVoice&&el(Modal,null,
      el("div",{style:{fontWeight:"bold",fontSize:15,color:"#A78BFA",marginBottom:6}},"Voice Input - "+(voiceTarget==="nutrition"?"Meal":voiceTarget==="checklist"?"Checklist":"Schedule")),
      el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:16,lineHeight:1.6}},
        voiceTarget==="nutrition"?"Say: food name, calories, protein, carbs, meal time":
        voiceTarget==="checklist"?"Say any task to add":
        "Say task, time, and day (e.g. Dentist at 2pm Thursday)"
      ),
      el("div",{style:{textAlign:"center",marginBottom:16}},
        el("div",{onClick:voiceActive?stopVoice:function(){startVoice(voiceTarget);},style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:70,height:70,borderRadius:"50%",background:voiceActive?"rgba(239,71,111,0.2)":"rgba(167,139,250,0.15)",border:"3px solid "+(voiceActive?"#EF476F":"#A78BFA"),fontSize:14,cursor:"pointer",color:voiceActive?"#EF476F":"#A78BFA",fontWeight:"bold",transition:"all 0.3s",boxShadow:voiceActive?"0 0 0 8px rgba(239,71,111,0.12)":"none"}},
          voiceActive?"STOP":"MIC"
        ),
        el("div",{style:{fontSize:12,color:voiceActive?"#EF476F":"#90E0EF",marginTop:8}},voiceActive?"Recording - tap to stop":"Tap to start")
      ),
      voiceTxt&&el("div",{style:{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px",fontSize:13,color:"#F0F4F8",marginBottom:12,border:"1px solid rgba(167,139,250,0.3)",fontStyle:"italic"}},'"'+voiceTxt+'"'),
      el("div",{style:{fontSize:12,color:"#90E0EF",marginBottom:12,textAlign:"center"}},voiceSt),
      voiceParsed&&el("div",{style:{background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"12px",marginBottom:12}},
        el("div",{style:{fontSize:11,color:"#06D6A0",fontWeight:"bold",marginBottom:8}},"Review before saving:"),
        voiceParsed.type==="nutrition"&&Object.keys(voiceParsed.data).filter(function(k){return voiceParsed.data[k];}).map(function(k){
          return el("div",{key:k,style:{fontSize:12,color:"#F0F4F8",marginBottom:3}},el("span",{style:{color:"#90E0EF",textTransform:"capitalize"}},k+": "),voiceParsed.data[k]);
        }),
        voiceParsed.type==="checklist"&&el("div",{style:{fontSize:12,color:"#F0F4F8"}},"Add: "+voiceParsed.data.label),
        voiceParsed.type==="schedule"&&["day","time","task","cat"].map(function(k){return el("div",{key:k,style:{fontSize:12,color:"#F0F4F8",marginBottom:3}},el("span",{style:{color:"#90E0EF",textTransform:"capitalize"}},k+": "),voiceParsed.data[k]);})
      ),
      el("div",{style:{display:"flex",gap:8}},
        voiceParsed&&el("button",{onClick:confirmVoice,style:Object.assign({},S.btn,{flex:2,background:"#06D6A0",color:"#1A1A2E"})},"Add to Planner"),
        el("button",{onClick:function(){setShowVoice(false);stopVoice();setVoiceParsed(null);setVoiceTxt("");},style:Object.assign({},S.btn,{flex:1,background:"rgba(255,255,255,0.1)",color:"#90E0EF"})},"Cancel")
      )
    ),

    // Floating mic
    el("button",{onClick:function(){startVoice(activeTab==="nutrition"?"nutrition":activeTab==="checklist"?"checklist":"schedule");},style:{position:"fixed",bottom:22,right:18,zIndex:200,width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C3AED)",border:"none",fontSize:13,cursor:"pointer",boxShadow:"0 4px 20px rgba(124,58,237,0.5)",color:"#fff",fontWeight:"bold"}},"MIC"),

    // Header
    el("div",{style:{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(0,180,216,0.3)",padding:"14px 16px 10px",position:"sticky",top:0,zIndex:100}},
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
          tabs.map(function(t){return el("button",{key:t.id,onClick:function(){setActiveTab(t.id);},style:{flex:1,padding:"7px 2px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,background:activeTab===t.id?"#00B4D8":"rgba(255,255,255,0.07)",color:activeTab===t.id?"#1A1A2E":"#90E0EF",fontWeight:activeTab===t.id?"bold":"normal"}},t.label);})
        )
      )
    ),

    // Content
    el("div",{style:{maxWidth:800,margin:"0 auto",padding:"14px 12px 80px"}},

      // ── SCHEDULE ──
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
          el("div",{style:{display:"flex",gap:6}},
            el("button",{onClick:function(){startVoice("schedule");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
              "Voice"
            ),
            el("button",{onClick:function(){setEditor({type:"schedule",item:{},context:{day:activeDay}});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
              "+ Add Block"
            )
          )
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          (schedule[activeDay]||[]).map(function(block){
            var done=!!blocks[block.id];
            var c=CAT[block.cat]||CAT.routine;
            return el("div",{key:block.id,style:{display:"flex",alignItems:"center",gap:10,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:12,padding:"10px 12px"}},
              el("div",{onClick:function(){toggleBlock(block.id);},style:{width:3,height:34,borderRadius:2,background:done?"#06D6A0":c.bg,flexShrink:0,cursor:"pointer"}}),
              el("div",{onClick:function(){toggleBlock(block.id);},style:{flex:1,cursor:"pointer"}},
                el("div",{style:{fontSize:12,fontWeight:"bold",color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none"}},block.task),
                el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},block.time)
              ),
              el("div",{style:Object.assign({},S.catBadge(block.cat),{marginRight:4})},c.label),
              el(RowActions,{
                onEdit:function(){setEditor({type:"schedule",item:block,context:{day:activeDay}});},
                onDelete:function(){setConfirm({label:block.task,onConfirm:function(){deleteScheduleItem(activeDay,block.id);}});}
              })
            );
          })
        )
      ),

      // ── CHECKLIST ──
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
        el("div",{style:{display:"flex",justifyContent:"flex-end",gap:6,marginBottom:10}},
          el("button",{onClick:function(){startVoice("checklist");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
            "Voice"
          ),
          el("button",{onClick:function(){setEditor({type:"checklist",item:{},context:{}});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
            "+ Add Item"
          )
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:7}},
          checklist.map(function(item){
            var done=!!checked[item.id];
            var c=CAT[item.cat]||CAT.goals;
            return el("div",{key:item.id,style:{display:"flex",alignItems:"center",gap:10,background:done?"rgba(6,214,160,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(done?"#06D6A0":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"10px 12px"}},
              el("div",{onClick:function(){toggleCheck(item.id);},style:{width:22,height:22,borderRadius:6,flexShrink:0,background:done?"#06D6A0":"rgba(255,255,255,0.1)",border:"2px solid "+(done?"#06D6A0":c.bg),display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer"}},done?"v":""),
              el("div",{onClick:function(){toggleCheck(item.id);},style:{flex:1,fontSize:12,color:done?"#06D6A0":"#F0F4F8",textDecoration:done?"line-through":"none",fontWeight:done?"normal":"bold",cursor:"pointer"}},item.label),
              el("div",{style:Object.assign({},S.catBadge(item.cat),{marginRight:4})},c.label),
              el(RowActions,{
                onEdit:function(){setEditor({type:"checklist",item:item,context:{}});},
                onDelete:function(){setConfirm({label:item.label,onConfirm:function(){deleteChecklistItem(item.id);}});}
              })
            );
          })
        )
      ),

      // ── NUTRITION ──
      activeTab==="nutrition"&&el("div",null,
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
        el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}},
          [{k:"protein",l:"Protein"},{k:"carbs",l:"Carbs"},{k:"fat",l:"Fat"}].map(function(m){
            var v=totals[m.k];var t=targets[m.k];
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
        // Edit targets
        el("div",{style:{marginBottom:12}},
          editingTgt
            ? el("div",{style:{background:"rgba(15,52,96,0.9)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:14,padding:14}},
                el("div",{style:{fontWeight:"bold",color:"#00B4D8",fontSize:13,marginBottom:10}},"Edit Daily Targets"),
                el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
                  [{k:"calories",l:"Calories (kcal)"},{k:"protein",l:"Protein (g)"},{k:"carbs",l:"Carbs (g)"},{k:"fat",l:"Fat (g)"}].map(function(f){
                    return el("div",{key:f.k},
                      el("span",{style:{fontSize:10,color:"#90E0EF",marginBottom:3,display:"block"}},f.l),
                      el("input",{type:"number",value:tmpTgt[f.k],onChange:function(e){var v=e.target.value;setTmpTgt(function(p){var n=Object.assign({},p);n[f.k]=Number(v);return n;});},style:S.input})
                    );
                  })
                ),
                el("div",{style:{display:"flex",gap:8}},
                  el("button",{onClick:function(){setTargets(tmpTgt);setEditingTgt(false);},style:Object.assign({},S.btn,{flex:2,background:"#00B4D8",color:"#1A1A2E"})},"Save"),
                  el("button",{onClick:function(){setEditingTgt(false);},style:Object.assign({},S.btn,{flex:1,background:"rgba(255,255,255,0.08)",color:"#90E0EF"})},"Cancel")
                )
              )
            : el("button",{onClick:function(){setTmpTgt(targets);setEditingTgt(true);},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.1)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)",width:"100%",textAlign:"center"})},
                "Edit Daily Targets"
              )
        ),
        el("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
          el("div",{style:{fontSize:13,fontWeight:"bold",color:"#F0F4F8"}},"Today's Meals"),
          el("div",{style:{display:"flex",gap:7}},
            el("button",{onClick:function(){startVoice("nutrition");},style:Object.assign({},S.btn,{background:"rgba(167,139,250,0.15)",color:"#A78BFA",border:"1px solid rgba(167,139,250,0.4)"})},
              "Voice"
            ),
            el("button",{onClick:function(){setMealInput({name:"",calories:"",protein:"",carbs:"",fat:"",mealTime:"Breakfast"});setEditMeal(null);setShowMealForm(function(p){return !p;});},style:Object.assign({},S.btn,{background:showMealForm?"rgba(255,255,255,0.08)":"#00B4D8",color:showMealForm?"#90E0EF":"#1A1A2E"})},
              showMealForm?"Cancel":"+ Add Meal"
            )
          )
        ),
        showMealForm&&el("div",{style:{background:"rgba(15,52,96,0.9)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:14,padding:14,marginBottom:12}},
          el("div",{style:{fontWeight:"bold",color:"#00B4D8",fontSize:12,marginBottom:10}},editMeal?"Edit Meal":"Add Meal"),
          el("div",{style:{marginBottom:8}},
            el("span",{style:{fontSize:10,color:"#90E0EF",marginBottom:3,display:"block"}},"Meal Name *"),
            el("input",{placeholder:"e.g. Grilled chicken and rice",value:mealInput.name,onChange:function(e){var v=e.target.value;setMealInput(function(p){return Object.assign({},p,{name:v});});},style:S.input})
          ),
          el("div",{style:{marginBottom:8}},
            el("select",{value:mealInput.mealTime,onChange:function(e){var v=e.target.value;setMealInput(function(p){return Object.assign({},p,{mealTime:v});});},style:Object.assign({},S.input,{background:"#0F3460"})},
              ["Breakfast","Morning Snack","Lunch","Afternoon Snack","Dinner","Evening Snack"].map(function(t){return el("option",{key:t},t);})
            )
          ),
          el("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}},
            [{k:"calories",l:"Calories *"},{k:"protein",l:"Protein (g)"},{k:"carbs",l:"Carbs (g)"},{k:"fat",l:"Fat (g)"}].map(function(f){
              return el("div",{key:f.k},
                el("span",{style:{fontSize:9,color:"#90E0EF",marginBottom:2,display:"block"}},f.l),
                el("input",{type:"number",placeholder:"0",value:mealInput[f.k],onChange:function(e){var v=e.target.value;setMealInput(function(p){var n=Object.assign({},p);n[f.k]=v;return n;});},style:S.input})
              );
            })
          ),
          el("button",{onClick:addOrUpdateMeal,style:Object.assign({},S.btn,{width:"100%",background:"#06D6A0",color:"#1A1A2E",padding:"10px",fontSize:13})},editMeal?"Save Changes":"Log Meal")
        ),
        meals.length===0
          ?el("div",{style:{textAlign:"center",color:"#90E0EF",fontSize:12,padding:"20px 0",opacity:0.6}},"No meals logged yet. Tap + Add Meal or Voice.")
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
                    el(RowActions,{
                      onEdit:function(){startEditMeal(meal);},
                      onDelete:function(){setConfirm({label:meal.name,onConfirm:function(){deleteMeal(meal.id);}});}
                    })
                  );
                })
              );
            })
          )
      ),

      // ── GOALS ──
      activeTab==="goals"&&el("div",null,
        el("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:12}},
          el("button",{onClick:function(){setEditor({type:"goal",item:{},context:{}});},style:Object.assign({},S.btn,{background:"rgba(0,180,216,0.15)",color:"#00B4D8",border:"1px solid rgba(0,180,216,0.3)"})},
            "+ Add Goal"
          )
        ),
        el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:14,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 14px",lineHeight:1.6}},
          "Tip: Tap the number to type your progress directly, or use the +/- buttons. Avoids accidental scroll changes."
        ),
        el("div",{style:{display:"flex",flexDirection:"column",gap:10}},
          goals.map(function(goal){
            var prog=goalProg[goal.id]||0;
            var c=CAT[goal.cat]||CAT.goals;
            return el("div",{key:goal.id,style:{background:"rgba(255,255,255,0.04)",border:"1px solid "+(prog===100?"#06D6A0":"rgba(255,255,255,0.08)"),borderRadius:14,padding:14}},
              el("div",{style:{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}},
                el("div",{style:{flex:1}},
                  el("div",{style:{fontSize:13,fontWeight:"bold",color:prog===100?"#06D6A0":"#F0F4F8"}},goal.title+(prog===100?" - Complete!":"")),
                  el("div",{style:{fontSize:10,color:"#90E0EF",marginTop:2}},"Target: "+goal.target)
                ),
                el("div",{style:{display:"flex",alignItems:"center",gap:5}},
                  el("div",{style:Object.assign({},S.catBadge(goal.cat))},c.label),
                  el(RowActions,{
                    onEdit:function(){setEditor({type:"goal",item:goal,context:{}});},
                    onDelete:function(){setConfirm({label:goal.title,onConfirm:function(){deleteGoal(goal.id);}});}
                  })
                )
              ),
              // Progress bar (visual only)
              el("div",{style:{background:"rgba(255,255,255,0.1)",borderRadius:6,height:8,marginBottom:10,overflow:"hidden"}},
                el("div",{style:{width:prog+"%",height:"100%",background:prog===100?"#06D6A0":c.bg,borderRadius:6,transition:"width 0.3s"}})
              ),
              // Tap-to-edit stepper — NO range input to avoid scroll conflicts
              el("div",{style:{display:"flex",alignItems:"center",gap:8}},
                el("button",{
                  onClick:function(){var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=Math.max(0,(p[id]||0)-5);return n;});},
                  style:{width:36,height:36,borderRadius:8,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#F0F4F8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}
                },"-"),
                el("input",{
                  type:"number",min:0,max:100,value:prog,
                  onChange:function(e){var v=Math.min(100,Math.max(0,Number(e.target.value)));var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=v;return n;});},
                  style:{flex:1,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(0,180,216,0.3)",borderRadius:8,padding:"7px 0",color:prog===100?"#06D6A0":"#FFD166",fontSize:18,fontWeight:"bold",textAlign:"center",fontFamily:"inherit"}
                }),
                el("span",{style:{color:"#90E0EF",fontSize:13,flexShrink:0}},"%"),
                el("button",{
                  onClick:function(){var id=goal.id;setGoalProg(function(p){var n=Object.assign({},p);n[id]=Math.min(100,(p[id]||0)+5);return n;});},
                  style:{width:36,height:36,borderRadius:8,background:"rgba(0,180,216,0.15)",border:"1px solid rgba(0,180,216,0.3)",color:"#00B4D8",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}
                },"+")
              )
            );
          })
        )
      ),

      // ── ALERTS ──
      activeTab==="alerts"&&el("div",null,
        notifPerm!=="granted"&&el("div",{style:{background:"rgba(255,209,102,0.1)",border:"1px solid rgba(255,209,102,0.4)",borderRadius:14,padding:16,marginBottom:16,textAlign:"center"}},
          el("div",{style:{fontSize:14,color:"#FFD166",fontWeight:"bold",marginBottom:6}},"Enable Notifications"),
          el("div",{style:{fontSize:11,color:"#90E0EF",marginBottom:12,lineHeight:1.6}},"Get reminders for dog walks, drop-offs, trash day, meals, and more."),
          el("button",{onClick:requestNotif,style:Object.assign({},S.btn,{background:"#FFD166",color:"#1A1A2E",padding:"10px 24px",fontSize:13})},"Allow Notifications")
        ),
        notifPerm==="granted"&&el("div",{style:{background:"rgba(6,214,160,0.1)",border:"1px solid rgba(6,214,160,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#06D6A0",fontWeight:"bold",textAlign:"center"}},"Notifications enabled"),
        notifPerm==="denied"&&el("div",{style:{background:"rgba(239,71,111,0.1)",border:"1px solid rgba(239,71,111,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:11,color:"#EF476F",textAlign:"center"}},"Notifications blocked. Enable in phone settings then refresh."),
        el("div",{style:{fontSize:12,fontWeight:"bold",color:"#F0F4F8",marginBottom:10}},"Daily Reminders"),
        el("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          REMINDERS.map(function(rem){
            var on=!!remEnabled[rem.id];
            var dnames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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
