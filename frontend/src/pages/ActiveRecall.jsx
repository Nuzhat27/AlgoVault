import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';

export default function ActiveRecall(){
 const {problems}=useData();
 const cards=useMemo(()=>problems.filter(p=>p.title).map(p=>({id:p._id,q:p.title,a:p.approach||p.description||'No explanation saved yet.'})),[problems]);
 const [index,setIndex]=useState(0); const [show,setShow]=useState(false); const [score,setScore]=useState({correct:0,total:0});
 const current=cards[index%Math.max(cards.length,1)];
 const grade=(good)=>{setScore(s=>({correct:s.correct+(good?1:0),total:s.total+1}));setShow(false);setIndex(i=>(i+1)%Math.max(cards.length,1))};
 return <section className="view"><div className="page-head"><div><span className="eyebrow">ACTIVE RECALL</span><h1>Test what you actually remember</h1><div className="sub">See a problem title, explain the solution from memory, then reveal your saved approach.</div></div><span className="muted-chip">Score {score.correct}/{score.total}</span></div>
 <div className="tool-card" style={{maxWidth:950,margin:'0 auto'}}><div className="recall-prompt">{current?.q||'Log some problems first to start an active recall session.'}</div>{show?<div className="recall-answer">{current?.a}</div>:<button className="btn btn-primary" onClick={()=>setShow(true)} style={{display:'block',margin:'20px auto'}}>Reveal approach</button>}{show&&<div className="recall-score"><span>Did you remember it?</span><div style={{display:'flex',gap:8}}><button className="btn btn-secondary" onClick={()=>grade(false)}>Needs work</button><button className="btn btn-primary" onClick={()=>grade(true)}>Got it ✓</button></div></div>}</div>
 </section>
}
