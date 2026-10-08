import React, { useEffect, useState } from 'react';
import { ArrowRight, Bike, Check, ChevronDown, Heart, Leaf, MapPin, Minus, Plus, Search, ShoppingBag, Sparkles, Star, X, Zap } from 'lucide-react';
import droneDeliveryGif from '../assets/drone-delivery.gif';

const meals = [
  { id: 1, name: 'The classic smash', restaurant: 'Bun & Beyond', category: 'Burgers', description: 'Double smashed beef, cheddar & our secret sauce.', price: 12.50, rating: '4.9', time: '12–18', image: 'photo-1568901346375-23c9450c58cd', badge: 'Crowd favorite' },
  { id: 2, name: 'A little slice of Italy', restaurant: 'Dough Society', category: 'Pizza', description: 'Wood-fired margherita, fresh basil & mozzarella.', price: 14.00, rating: '4.8', time: '15–20', image: 'photo-1574071318508-1cdbab80d002', badge: 'Fresh from the oven' },
  { id: 3, name: 'The feel-good bowl', restaurant: 'Greenhouse Kitchen', category: 'Bowls', description: 'A colorful mix of grains, greens & seasonal goodness.', price: 11.50, rating: '4.9', time: '10–15', image: 'photo-1512621776951-a57141f2eefd', badge: 'Plant powered', vegetarian: true },
  { id: 4, name: 'Roll with it', restaurant: 'Maki Club', category: 'Sushi', description: 'Salmon, avocado & a little crunch. Eight perfect bites.', price: 16.00, rating: '4.8', time: '12–18', image: 'photo-1579871494447-9811cf80d66c' },
  { id: 5, name: 'The crispy chicken', restaurant: 'Bun & Beyond', category: 'Burgers', description: 'Golden crispy chicken, slaw & smoky chipotle mayo.', price: 13.50, rating: '4.7', time: '12–18', image: 'photo-1606755962773-d324e0a13086' },
  { id: 6, name: 'A sweet landing', restaurant: 'The Cookie Corner', category: 'Desserts', description: 'Warm chocolate chip cookies. A very happy ending.', price: 6.00, rating: '4.9', time: '10–15', image: 'photo-1499636136210-6f4ee915583e', badge: 'Treat yourself' },
];
const categories = [{name:'All meals', symbol:'✦'}, {name:'Burgers',symbol:'🍔'}, {name:'Pizza',symbol:'🍕'}, {name:'Bowls',symbol:'🥗'}, {name:'Sushi',symbol:'🍣'}, {name:'Desserts',symbol:'🍪'}];
const money = n => new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP'}).format(n);

function Drone({ className = '', ...props }) {
  return <svg className={className} viewBox="0 0 120 80" fill="none" aria-hidden="true" {...props}><path d="M39 35 22 18M81 35l17-17M40 43 21 59M80 43l19 16" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><ellipse cx="20" cy="15" rx="17" ry="5" stroke="currentColor" strokeWidth="3"/><ellipse cx="100" cy="15" rx="17" ry="5" stroke="currentColor" strokeWidth="3"/><ellipse cx="20" cy="62" rx="17" ry="5" stroke="currentColor" strokeWidth="3"/><ellipse cx="100" cy="62" rx="17" ry="5" stroke="currentColor" strokeWidth="3"/><rect x="35" y="28" width="50" height="21" rx="10" fill="currentColor"/><path d="M45 51v9h30v-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="60" cy="39" r="4" fill="#d4ebbf"/></svg>;
}

function HeroArt() {
  return <div className="hero-art" aria-hidden="true">
    <svg viewBox="0 0 460 350" className="hero-scene"><defs><linearGradient id="box" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d5a675"/><stop offset="1" stopColor="#bb8657"/></linearGradient><linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#dce8de"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="9" stdDeviation="6" floodColor="#294d30" floodOpacity=".15"/></filter></defs>
      <circle cx="255" cy="173" r="136" fill="#d8e6c7"/><circle cx="255" cy="173" r="112" fill="none" stroke="#c5d7b2" strokeDasharray="4 7"/>
      <path d="M55 283c60 28 64-76 116-57s47 72 102 48 51-70 116-45" stroke="#8ba675" strokeWidth="2" strokeDasharray="5 7" fill="none"/>
      <g fill="#fff" opacity=".75"><path d="M53 108c-16 0-18-21-4-25 2-19 30-22 37-6 16-6 29 6 24 18 14 2 14 13 4 13Z"/><path d="M351 256c-13 0-16-16-4-20 1-15 24-18 30-5 13-5 24 5 20 14 11 2 11 11 3 11Z"/></g>
      <ellipse cx="256" cy="297" rx="62" ry="8" fill="#496c36" opacity=".1"/>
      <g transform="rotate(-9 250 160)" filter="url(#shadow)">
        <path d="m215 158 3 31m68-31-4 31" stroke="#677968" strokeWidth="3"/><path d="m206 186 55-12 41 19-54 15Z" fill="#e8bd8e"/><path d="m206 186 42 22v61l-42-24Z" fill="#c59361"/><path d="m248 208 54-15v58l-54 18Z" fill="url(#box)"/><path d="m228 181 43 21v16l12-3v-16l-42-21Z" fill="#efe3c6"/><path d="m263 228 23-6v19l-23 6Z" fill="#f8f4e5"/><path d="m268 233 13-3m-12 8 10-3" stroke="#48724f" strokeWidth="2"/>
        <path d="m227 126-67-34m111 34 66-34m-102 47-72 27m111-25 65 26" stroke="#71867a" strokeWidth="11" strokeLinecap="round"/>
        <path d="m227 126-67-34m111 34 66-34m-102 47-72 27m111-25 65 26" stroke="#edf2e9" strokeWidth="6" strokeLinecap="round"/>
        <g stroke="#527264" strokeWidth="3" fill="#e7eee0"><ellipse cx="153" cy="91" rx="48" ry="10"/><ellipse cx="343" cy="91" rx="48" ry="10"/><ellipse cx="158" cy="169" rx="48" ry="10"/><ellipse cx="346" cy="169" rx="48" ry="10"/></g>
        <g fill="#214e3f"><ellipse cx="153" cy="91" rx="5" ry="5"/><ellipse cx="343" cy="91" rx="5" ry="5"/><ellipse cx="158" cy="169" rx="5" ry="5"/><ellipse cx="346" cy="169" rx="5" ry="5"/></g>
        <path d="M219 115q29-15 62 0l11 27q-36 22-80 0Z" fill="url(#body)" stroke="#b4c7b4"/><path d="M232 114q20-5 37 0l4 9h-44Z" fill="#205b48"/><circle cx="254" cy="142" r="6" fill="#275141"/><circle cx="254" cy="142" r="2" fill="#b4d79d"/>
      </g>
      <path d="m383 85 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#6b8d59"/><path d="m110 212 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#6b8d59"/>
    </svg>
    <div className="floating-label"><span className="live-dot"/> Fresh food. Clear skies.</div>
  </div>;
}

export default function App() {
  const [category, setCategory] = useState('All meals');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState({});
  const [delivery, setDelivery] = useState('drone');
  const [favorites, setFavorites] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [panel, setPanel] = useState(null);
  const [address, setAddress] = useState('24, Maple Street');
  const [addressDraft, setAddressDraft] = useState(address);
  const [order, setOrder] = useState(null);
  const [orderStep, setOrderStep] = useState(0);
  const [toast, setToast] = useState('');
  const cartItems = meals.filter(m => cart[m.id]).map(m => ({...m, quantity:cart[m.id]}));
  const count = cartItems.reduce((n,m) => n+m.quantity,0);
  const subtotal = cartItems.reduce((n,m) => n+m.price*m.quantity,0);
  const deliveryFee = delivery === 'drone' ? 3.99 : 1.99;
  const filteredMeals = meals.filter(m => (category === 'All meals' || m.category === category) && (!favoritesOnly || favorites.includes(m.id)) && `${m.name} ${m.restaurant} ${m.category} ${m.description}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2400); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (!panel) return;
    const previous = document.activeElement;
    const handleKey = e => {
      if(e.key==='Escape') setPanel(null);
      if(e.key==='Tab') {
        const focusables = [...document.querySelectorAll('.modal button, .modal input, .modal a')].filter(el=>!el.disabled);
        const first=focusables[0], last=focusables.at(-1);
        if(e.shiftKey && document.activeElement===first) {e.preventDefault();last?.focus();}
        else if(!e.shiftKey && document.activeElement===last) {e.preventDefault();first?.focus();}
      }
    };
    document.body.style.overflow='hidden';
    document.querySelector('.modal input, .modal button')?.focus();
    document.addEventListener('keydown',handleKey);
    return () => {document.body.style.overflow='';document.removeEventListener('keydown',handleKey);previous?.focus();};
  },[panel]);
  useEffect(() => { if(!order || orderStep >= 3) return; const timer=setTimeout(()=>setOrderStep(s=>s+1),8000);return()=>clearTimeout(timer);},[order,orderStep]);

  function updateCart(id, change) {
    setCart(c => {const next={...c,[id]:Math.max(0,(c[id]||0)+change)};if(!next[id])delete next[id];return next;});
  }
  function addMeal(meal) { updateCart(meal.id,1);setToast(`${meal.name} added to your bag`); }
  function placeOrder() {
    if (!count) return;
    setOrder({items:cartItems,total:subtotal+deliveryFee,delivery,address,number:`AB-${Date.now().toString().slice(-5)}`});
    setOrderStep(0);setCart({});setPanel('order');
  }
  function showMenu() {setFavoritesOnly(false);setCategory('All meals');setQuery('');document.getElementById('menu').scrollIntoView({behavior:'smooth'});}

  return <>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#" aria-label="Airbite home"><span className="brand-icon"><Drone/></span>airbite<span className="brand-dot">.</span></a>
      <nav aria-label="Main navigation"><button className={!favoritesOnly?'nav-link active':'nav-link'} onClick={showMenu}>Explore</button><button className="nav-link" onClick={()=>setPanel('how')}>How it works</button><button className="nav-link" onClick={()=>setPanel('order')}>My orders{order && <span className="nav-dot"/>}</button></nav>
      <div className="header-actions"><button className="address-button" onClick={()=>{setAddressDraft(address);setPanel('address');}}><MapPin size={17}/><span><small>Deliver to</small><strong>{address}</strong></span><ChevronDown size={14}/></button><span className="header-divider"/><button className="bag-button" onClick={()=>setPanel('cart')}><ShoppingBag size={18}/><span>My bag</span><span className="bag-count">{count}</span></button></div>
    </div></header>

    <main className="page-shell">
      <div className="topline"><span><span className="live-dot"/> A little local. A little out of this world.</span><span className="weather"><span>☀</span> Clear skies. Great food.</span></div>
      <section className="hero-grid" aria-label="Express food delivery">
        <div className="hero-main"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> YOUR NEXT FAVORITE MEAL AWAITS</span><h1>Good food.<br/>Better altitude<span>.</span></h1><p>Your local favorites, delivered with a little lift.<br className="desktop-break"/> Less waiting. More enjoying.</p><button className="primary-button" onClick={showMenu}>Find your next bite <ArrowRight size={17}/></button><div className="hero-proof"><span className="avatar-stack"><img src="https://i.pravatar.cc/64?img=47" alt=""/><img src="https://i.pravatar.cc/64?img=12" alt=""/><img src="https://i.pravatar.cc/64?img=49" alt=""/></span><span><span className="proof-stars">★★★★★</span><small>Loved by 2,000+ hungry humans</small></span></div></div><HeroArt/></div>
        <div className="express-card"><div className="express-card-top"><span className="express-pill"><Zap size={12} fill="currentColor"/> THE FAST LANE</span><Drone className="express-drone"/></div><h2>Skip the traffic.<br/>Meet drone delivery.</h2><p>A faster way to your first bite.<br/>Fresh food, flown straight to you.</p><div className="express-stats"><div><strong>10–20 <small>min</small></strong><span>At your doorstep</span></div><span className="stat-divider"/><div><strong>100<small>%</small></strong><span>Electric flight</span></div></div><div className="express-bottom"><span className="live-dot"/><span>Express delivery available in your area</span><ArrowRight size={15}/></div></div>
      </section>

      <section id="menu" className="menu-section"><div className="section-heading"><div><div className="section-kicker">LOCAL KITCHENS. BIG FLAVORS.</div><h2>What are you craving?</h2></div><div className="menu-tools"><label className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search meals or restaurants" aria-label="Search meals or restaurants"/>{query && <button onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label><button className={`favorites-filter ${favoritesOnly?'selected':''}`} onClick={()=>setFavoritesOnly(v=>!v)} aria-label="Show favorite meals" aria-pressed={favoritesOnly}><Heart size={19} fill={favoritesOnly?'currentColor':'none'}/></button></div></div>
        <div className="menu-controls"><div className="categories" aria-label="Meal categories">{categories.map(c=><button key={c.name} className={`category-pill ${category===c.name?'selected':''}`} onClick={()=>setCategory(c.name)} aria-pressed={category===c.name}><span>{c.symbol}</span>{c.name}</button>)}</div><span className="delivery-note"><Drone/> Drone-ready favorites</span></div>
        <div className="meal-grid">{filteredMeals.map(meal=><article className="meal-card" key={meal.id}><div className="meal-image"><img src={`https://images.unsplash.com/${meal.image}?auto=format&fit=crop&w=800&q=85`} alt={meal.name} loading="lazy"/>{meal.badge && <span className="meal-badge">{meal.vegetarian && <Leaf size={12}/>} {meal.badge}</span>}<button className={`heart-button ${favorites.includes(meal.id)?'saved':''}`} onClick={()=>setFavorites(f=>f.includes(meal.id)?f.filter(id=>id!==meal.id):[...f,meal.id])} aria-label={`${favorites.includes(meal.id)?'Unsave':'Save'} ${meal.name}`} aria-pressed={favorites.includes(meal.id)}><Heart size={17} fill={favorites.includes(meal.id)?'currentColor':'none'}/></button></div><div className="meal-info"><div className="restaurant-row"><span>{meal.restaurant}</span><span className="rating"><Star size={12} fill="currentColor"/>{meal.rating}</span></div><h3>{meal.name}</h3><p>{meal.description}</p><div className="meal-bottom"><strong>{money(meal.price)}</strong><span className="meal-time"><Zap size={12}/>{meal.time} min</span>{cart[meal.id]?<div className="quantity-control"><button onClick={()=>updateCart(meal.id,-1)} aria-label={`Remove one ${meal.name}`}><Minus size={13}/></button><span>{cart[meal.id]}</span><button onClick={()=>updateCart(meal.id,1)} aria-label={`Add one ${meal.name}`}><Plus size={13}/></button></div>:<button className="add-button" onClick={()=>addMeal(meal)} aria-label={`Add ${meal.name} to bag`}><Plus size={19}/></button>}</div></div></article>)}</div>
        {!filteredMeals.length && <div className="empty-results"><Search size={30}/><h3>{favoritesOnly?'No favorites here yet':'No bites found'}</h3><p>{favoritesOnly?'Tap the heart on a meal to save it for later.':'Try another search or explore a different category.'}</p><button className="primary-button" onClick={()=>{setQuery('');setCategory('All meals');setFavoritesOnly(false);}}>Explore all meals <ArrowRight size={16}/></button></div>}
      </section>
      <div className="bottom-banner"><span className="banner-icon"><Leaf size={24}/></span><div><strong>A lighter footprint. A happier lunch.</strong><p>Our electric drones bring good food closer, with a little less impact.</p></div><span className="banner-tag">GOOD FOOD. GOOD ENERGY. <ArrowRight size={16}/></span></div>
      <footer><a className="footer-brand" href="#">airbite.</a><span>Made for hungry humans. Delivered with a little magic.</span><span>Hackathon demo · 2026</span></footer>
    </main>

    {toast && <div className="toast" role="status"><Check size={17}/>{toast}<button onClick={()=>setPanel('cart')}>View bag <ArrowRight size={14}/></button></div>}
    {panel && <div className={`modal-backdrop ${panel==='cart'?'drawer-backdrop':''}`} onClick={()=>setPanel(null)}><section className={`modal ${panel==='cart'?'cart-drawer':''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e=>e.stopPropagation()}><button className="close-button" onClick={()=>setPanel(null)} aria-label="Close dialog"><X size={21}/></button>
      {panel==='cart' && <><div className="modal-kicker">YOUR NEXT GOOD MEAL</div><h2 id="modal-title">Your bag <span className="muted">({count})</span></h2>{count?<><div className="cart-list">{cartItems.map(m=><div className="cart-item" key={m.id}><img src={`https://images.unsplash.com/${m.image}?auto=format&fit=crop&w=160&q=75`} alt={m.name}/><div><h3>{m.name}</h3><span>{money(m.price)}</span><div className="quantity-control"><button onClick={()=>updateCart(m.id,-1)} aria-label={`Remove one ${m.name}`}><Minus size={13}/></button><span>{m.quantity}</span><button onClick={()=>updateCart(m.id,1)} aria-label={`Add one ${m.name}`}><Plus size={13}/></button></div></div><strong>{money(m.price*m.quantity)}</strong></div>)}</div><div className="delivery-picker"><h3>Pick your delivery</h3><button className={delivery==='drone'?'delivery-choice selected':'delivery-choice'} onClick={()=>setDelivery('drone')} aria-pressed={delivery==='drone'}><span className="choice-icon"><Drone/></span><span><strong>Express drone <span className="mini-badge">FASTEST</span></strong><small>10–20 min · {money(3.99)}</small></span><span className="radio-indicator">{delivery==='drone'&&<Check size={12}/>}</span></button><button className={delivery==='standard'?'delivery-choice selected':'delivery-choice'} onClick={()=>setDelivery('standard')} aria-pressed={delivery==='standard'}><span className="choice-icon"><Bike size={27}/></span><span><strong>Standard delivery</strong><small>30–45 min · {money(1.99)}</small></span><span className="radio-indicator">{delivery==='standard'&&<Check size={12}/>}</span></button></div><div className="checkout-address"><MapPin size={17}/><span>Delivering to <strong>{address}</strong></span></div><div className="order-totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span>{money(deliveryFee)}</span></div><div className="total-row"><strong>Total</strong><strong>{money(subtotal+deliveryFee)}</strong></div></div><button className="primary-button checkout-button" onClick={placeOrder}>Place demo order <ArrowRight size={18}/></button><p className="demo-note">A little hackathon magic. No payment or real delivery.</p></>:<div className="empty-cart"><ShoppingBag size={42}/><h3>Your bag is waiting for a good bite.</h3><p>Find something delicious and we’ll take it from there.</p><button className="primary-button" onClick={()=>{setPanel(null);showMenu();}}>Explore the menu <ArrowRight size={16}/></button></div>}</>}
      {panel==='address' && <><div className="modal-icon"><MapPin size={28}/></div><h2 id="modal-title">Where’s your next bite going?</h2><p className="modal-description">Choose a delivery address for this demo.</p><form onSubmit={e=>{e.preventDefault();if(addressDraft.trim()){setAddress(addressDraft.trim());setPanel(null);setToast('Delivery address updated');}}}><label className="form-label" htmlFor="address">Delivery address</label><input id="address" className="address-input" value={addressDraft} onChange={e=>setAddressDraft(e.target.value)} required maxLength={100} placeholder="Street address"/><p className="address-hint"><Check size={14}/> Drone delivery is available in our demo area.</p><button className="primary-button full-width" type="submit">Save address <ArrowRight size={17}/></button></form></>}
      {panel==='how' && <><div className="modal-icon"><Drone/></div><div className="modal-kicker">A LITTLE LIFT FOR YOUR LUNCH</div><h2 id="modal-title">Good food, on the fly.</h2><p className="modal-description">From your favorite kitchen to your doorstep. Simple as one, two, three.</p><div className="how-steps">{[{icon:<ShoppingBag/>,title:'Find your favorite',text:'Browse local meals and add a little deliciousness to your bag.'},{icon:<Zap/>,title:'Choose your speed',text:'Take the express lane with a drone, or opt for standard delivery.'},{icon:<Drone/>,title:'Sit back. Take a bite.',text:'Follow your demo order from the kitchen all the way to your door.'}].map((s,i)=><div key={s.title}><span className="step-icon">{s.icon}</span><div><h3><small>0{i+1}</small> {s.title}</h3><p>{s.text}</p></div></div>)}</div><button className="primary-button full-width" onClick={()=>{setPanel(null);showMenu();}}>Let’s find something delicious <ArrowRight size={17}/></button></>}
      {panel==='order' && <>{order?<><div className="modal-icon">{orderStep===3?<Check size={30}/>:order.delivery==='drone'?<Drone/>:<Bike size={30}/>}</div><div className="modal-kicker">{order.number} · DEMO ORDER</div><h2 id="modal-title">{['A good bite is on its way.','Fresh from the kitchen.','Your food is on the move.','A delicious landing.'][orderStep]}</h2><p className="modal-description">{orderStep===3?`Your simulated order has arrived at ${order.address}. Enjoy!`:`${order.delivery==='drone'?'Express drone':'Standard'} delivery to ${order.address}`}</p>{orderStep===3 && <img className="delivery-complete-image" src={droneDeliveryGif} alt="A drone delivering a food order to a customer at their doorstep"/>}<div className="tracking-steps">{['Order confirmed','Preparing your meal',order.delivery==='drone'?'Drone in flight':'Courier on the way','Delivered'].map((step,i)=><div className={i<=orderStep?'complete':''} key={step}><span>{i<orderStep?<Check size={14}/>:i+1}</span><strong>{step}</strong>{i===orderStep&&i<3&&<span className="tracking-current">NOW</span>}</div>)}</div><div className="order-receipt">{order.items.map(m=><div key={m.id}><span>{m.quantity} × {m.name}</span><strong>{money(m.price*m.quantity)}</strong></div>)}<div className="receipt-total"><span>Total, including delivery</span><strong>{money(order.total)}</strong></div></div><p className="demo-note">Simulated tracking advances every 8 seconds. No real order was placed.</p><button className="primary-button full-width" onClick={()=>{setPanel(null);showMenu();}}>Back to the menu <ArrowRight size={17}/></button></>:<><div className="modal-icon"><ShoppingBag size={28}/></div><h2 id="modal-title">Your next story starts with a bite.</h2><p className="modal-description">You haven’t placed an order yet. Pick a favorite and give drone delivery a try.</p><button className="primary-button full-width" onClick={()=>{setPanel(null);showMenu();}}>Explore the menu <ArrowRight size={17}/></button></>}</>}
    </section></div>}
  </>;
}

