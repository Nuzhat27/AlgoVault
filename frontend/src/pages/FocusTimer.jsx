import { useEffect, useMemo, useState } from 'react';
const KEY='algoflow_focus_sessions';
export default function FocusTimer(){
 const [mode,setMode]=useState('focus'); const [seconds,setSeconds]=useState(25*60); const [running,setRunning]=useState(false); const [sessions,setSessions]=useState(()=>Number(localStorage.getItem(KEY)||0));
 const duration=mode==='focus'?25*60:5*60;
 useEffect(()=>{if(!running)return;const id=setInterval(()=>setSeconds(s=>{if(s<=1){setRunning(false);if(mode==='focus'){setSessions(x=>{const n=x+1;localStorage.setItem(KEY,String(n));return n})}return duration}return s-1}),1000);return()=>clearInterval(id)},[running,duration,mode]);
 const time=useMemo(()=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`,[seconds]);
 const switchMode=m=>{setMode(m);setSeconds(m==='focus'?25*60:5*60);setRunning(false)};
 return <section className="view"><div className="page-head"><div><span className="eyebrow">FOCUS TIMER</span><h1>Protect your practice time</h1><div className="sub">A simple Pomodoro loop for deep DSA work.</div></div><span className="muted-chip">{sessions} focus sessions completed</span></div><div className="tool-card" style={{maxWidth:760,margin:'0 auto',textAlign:'center'}}><div className="timer-mode"><button className={`btn btn-secondary ${mode==='focus'?'active':''}`} onClick={()=>switchMode('focus')}>Focus · 25m</button><button className={`btn btn-secondary ${mode==='break'?'active':''}`} onClick={()=>switchMode('break')}>Break · 5m</button></div><div className="timer-face">{time}</div><div className="timer-actions"><button className="btn btn-primary" onClick={()=>setRunning(!running)}>{running?'Pause':'Start session'}</button><button className="btn btn-secondary" onClick={()=>{setRunning(false);setSeconds(duration)}}>Reset</button></div><p style={{marginTop:24,color:'#7f93b0'}}>Finish a focus block and AlgoFlow increments your session counter.</p></div></section>
}
