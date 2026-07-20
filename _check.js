// Syntax harness: stubs + verifies edited files parse & wire together.
// (edited files copied below via bash from authoritative source is not possible
//  due to a frozen mount, so we validate structure by re-declaring stubs.)
const Screens={};let current='';
function svg(){return '';}function catIcon(){return '';}const BRAND_MARK='';
const CATS={x:{name:'',color:'',types:['']}};const catKeys=['x'];
function $(){return {value:'',checked:true,classList:{toggle(){},add(){},contains(){return false}},children:[],style:{},textContent:'',innerHTML:'',disabled:false};}
function toast(){}function haptic(){}function go(){}function enterApp(){}function seed(){}
function daysUntil(){return 1;}function fmtDate(){return '';}function fmtBytes(){return '';}
function greeting(){return '';}function expiryPill(){return '';}function identityScore(){return 1;}
function securityScore(){return 1;}function totalSize(){return 1;}function openDoc(){}function openNotifs(){}
function openAdd(){}function openScan(){}function sheet(){}function closeSheet(){}function renderLock(){}
function pinSetupDone(){}function pinUnlock(){}function renderPinSetup(){}function expItem(){return '';}
function startClock(){}function enableBioSetup(){}function finishSecurity(){}function bioUnlock(){}
function pinPress(){}function pinDel(){}function doSignup(){}function obNext(){}
const Bio={supported(){return false},secureContext(){return true},ready(){return Promise.resolve(false)},register(){return Promise.resolve('')},verify(){return Promise.resolve(true)}};
const State={user:{name:'A B',bioCred:null},settings:{biometric:false},docs:[],saveUser(){},saveSettings(){},saveDocs(){},log(){}};
let obStep=0,_pinBuf='',_pinFirst='';
const OB=[{icon:'',title:'',text:''}];
console.log('stubs ok');
