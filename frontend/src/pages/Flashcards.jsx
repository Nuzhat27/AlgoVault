import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';

const KEY='algoflow_flashcards_v1';
const defaultCards=[{id:'1',q:'What is the invariant in a sliding-window problem?',a:'The condition that remains true for the current window and guides when the left pointer moves.'},{id:'2',q:'When is BFS preferable to DFS?',a:'When you need the shortest path in an unweighted graph or level-order traversal.'}];
function read(){try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):defaultCards}catch{return defaultCards}}
export default function Flashcards(){
 const {patterns}=useData(); const [cards,setCards]=useState(read); const [index,setIndex]=useState(0); const [show,setShow]=useState(false); const [q,setQ]=useState(''); const [a,setA]=useState('');
 const card=cards[index%Math.max(cards.length,1)];
 const add=()=>{if(!q.trim()||!a.trim())return;const next=[...cards,{id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,q,a}];setCards(next);localStorage.setItem(KEY,JSON.stringify(next));setQ('');setA('')};
 const shuffle=()=>{setIndex(Math.floor(Math.random()*cards.length));setShow(false)};
 const topicCount=useMemo(()=>patterns.length,[patterns]);
 return <section className="view"><div className="page-head"><div><span className="eyebrow">FLASHCARDS</span><h1>Quick recall, zero scrolling</h1><div className="sub">Build Q&A cards for the ideas you want to retrieve under interview pressure.</div></div><span className="muted-chip">{cards.length} cards · {topicCount} patterns</span></div>
 <div className="tool-layout"><div className="tool-card"><div className="flashcard"><span className="section-kicker">CARD {index+1}</span><h2>{card?.q || 'Create your first card'}</h2>{show&&<div className="answer">{card?.a}</div>}<button className="btn btn-secondary" onClick={()=>setShow(!show)}>{show?'Hide answer':'Reveal answer'}</button></div><div className="flash-actions"><button className="btn btn-ghost" onClick={()=>{setIndex((index-1+cards.length)%cards.length);setShow(false)}}>← Previous</button><button className="btn btn-primary" onClick={()=>{setIndex((index+1)%cards.length);setShow(false)}}>Next →</button><button className="btn btn-secondary" onClick={shuffle}>Shuffle</button></div></div>
 <div className="tool-card"><span className="section-kicker">CREATE</span><h3>New flashcard</h3><div className="note-editor"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Question"/><textarea value={a} onChange={e=>setA(e.target.value)} placeholder="Answer" style={{minHeight:160}}/><button className="btn btn-primary" onClick={add}>Add card</button></div></div></div></section>
}
