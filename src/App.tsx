import { useEffect, useState } from 'react'
import { presetFutureMap, type AtlasItem, type FutureMap } from './lib/futureMap'
import { requestFutureMap } from './lib/atlasClient'
import { getJudgeAccessStatus, unlockJudgeAccess } from './lib/judgeAccessClient'
import { buildLandscapeLandmarks, itemForOption } from './lib/briefing'
import { demoScenarios, mappingMoments, type DemoScenario } from './lib/demoScenarios'

type Priority = 'Creative depth' | 'Belonging' | 'Financial runway'
const priorities: Priority[] = ['Creative depth', 'Belonging', 'Financial runway']
const tones: Record<Priority, string> = {
  'Creative depth': 'copper',
  Belonging: 'moss',
  'Financial runway': 'blue',
}


function Icon({ name }: { name: 'arrow' | 'plus' | 'compass' | 'spark' }) {
  const paths = {
    arrow: <path d="M3 12h17M14 5l7 7-7 7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    compass: <><circle cx="12" cy="12" r="8" /><path d="m14.8 9.2-1.9 4.1-4.1 1.9 1.9-4.1 4.1-1.9Z" /></>,
    spark: <path d="M12 3l1.9 7.1L21 12l-7.1 1.9L12 21l-1.9-7.1L3 12l7.1-1.9L12 3Z" />,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{paths[name]}</svg>
}

function EvidenceMark({ type }: { type: 'known' | 'assumption' | 'unknown' }) {
  return <span className={`evidence ${type}`} aria-hidden="true"><i /></span>
}

function Landmark({ item, slot, side, highlighted, onFocus }: {
  item: AtlasItem; slot: string; side: 'a' | 'b' | 'shared'; highlighted: boolean; onFocus: () => void
}) {
  return <button className={`landmark ${slot} ${item.status} ${side} ${highlighted ? 'is-highlighted' : ''}`} onFocus={onFocus} onMouseEnter={onFocus}>
    <EvidenceMark type={item.status} />
    <span><b>{item.label}</b><small>{item.detail}</small></span>
  </button>
}

function Landscape({ map, activePriorities, focus, setFocus, optionA, optionB, horizon }: {
  map: FutureMap; activePriorities: Priority[]; focus: string; setFocus: (id: string) => void; optionA: string; optionB: string; horizon: string
}) {
  const activeClasses = activePriorities.map((priority) => `priority-${tones[priority]}`).join(' ')
  const isFocus = (id: string) => focus === id
  const landmarks = buildLandscapeLandmarks(map)
  return <section className={`landscape ${activeClasses}`} aria-label="Explorable uncertainty map">
    <div className="map-key" aria-label="Map legend">
      <span><EvidenceMark type="known" />Known</span><span><EvidenceMark type="assumption" />Assumption</span><span><EvidenceMark type="unknown" />Unknown</span>
    </div>
    <div className="priority-lens" aria-label={`Local emphasis: ${activePriorities.length ? activePriorities.join(', ') : 'none selected'}`}>
      <span>Emphasis</span>
      {activePriorities.length ? activePriorities.map((priority) => <i key={priority} className={tones[priority]}>{priority}</i>) : <i className="none">Choose a priority</i>}
    </div>
    <div className="route-label route-a"><span>Route A</span>{optionA}</div>
    <div className="route-label route-b"><span>Route B</span>{optionB}</div>
    <svg className="atlas-svg" viewBox="0 0 1200 650" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="blur"><feGaussianBlur stdDeviation="18" /></filter>
        <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0ece2" stopOpacity=".9"/><stop offset="1" stopColor="#d8e1d9" stopOpacity=".48"/></linearGradient>
        <radialGradient id="fog"><stop stopColor="#e9e7df" stopOpacity=".9"/><stop offset="1" stopColor="#e9e7df" stopOpacity="0"/></radialGradient>
      </defs>
      <path className="ink-wash" d="M-60 120 C100 20 210 90 300 210 S420 390 520 405 C685 430 700 190 900 170 S1120 280 1270 110 V700 H-20Z" fill="url(#wash)"/>
      <g className="contours">
        <path d="M-20 235C100 140 195 155 250 264c46 91 174 99 242 20 64-75 121-73 177-22 69 64 161 46 219-19 67-75 164-69 332 21"/>
        <path d="M-20 276c118-92 199-77 245 17 49 100 193 116 268 28 66-78 132-74 193-16 70 67 184 48 247-21 72-78 160-61 287 34"/>
        <path d="M-20 317c113-86 208-75 254 27 50 110 209 121 284 32 65-78 140-78 206-15 71 67 193 45 253-28 67-80 151-57 263 33"/>
        <path d="M-20 361c122-86 215-67 266 37 53 110 216 119 296 27 66-76 145-64 210-7 75 67 199 51 267-28 65-74 154-53 241 25"/>
        <path d="M-20 408c128-80 229-62 283 36 57 104 222 105 298 16 71-81 151-62 220 0 73 66 194 48 261-20 62-64 140-43 195 9"/>
      </g>
      <path className="ridge" d="M-10 325 C119 217 212 253 283 357 S450 453 538 352 C628 249 720 263 798 353 S971 435 1045 330 C1098 254 1158 276 1220 328"/>
      <path className="route-line route-left" d="M176 605 C250 531 290 490 350 450 C417 405 464 399 516 349"/>
      <path className="route-line route-right" d="M1015 605 C960 538 922 489 852 446 C775 397 702 397 655 349"/>
      <circle className="crossroads" cx="586" cy="339" r="13"/>
      <circle className="crossroads-ring" cx="586" cy="339" r="26"/>
      <ellipse className="fog-bank" cx="820" cy="260" rx="170" ry="115" fill="url(#fog)" filter="url(#blur)"/>
      <ellipse className="fog-bank two" cx="360" cy="270" rx="150" ry="100" fill="url(#fog)" filter="url(#blur)"/>
    </svg>
    <div className="map-node start"><span>Here</span><b>current conditions</b></div>
    {landmarks.map((landmark) => <Landmark key={`${landmark.slot}-${landmark.item.id}`} item={landmark.item} slot={landmark.slot} side={landmark.side} highlighted={isFocus(landmark.item.id)} onFocus={() => setFocus(landmark.item.id)} />)}
    <div className="compass-rose" aria-hidden="true"><Icon name="compass" /><span>uncertainty<br/>cartography</span></div>
    <div className="map-caption"><span>{horizon}</span><b>Two routes. One changing field.</b></div>
  </section>
}

type BriefStage = 'ground' | 'tension' | 'fieldwork' | 'landscape'

const briefStages: Array<{ id: BriefStage; number: string; label: string; cue: string }> = [
  { id: 'ground', number: '01', label: 'Ground', cue: 'what is already here' },
  { id: 'tension', number: '02', label: 'Tension', cue: 'what pulls in two directions' },
  { id: 'fieldwork', number: '03', label: 'Fieldwork', cue: 'what could change the map' },
  { id: 'landscape', number: '04', label: 'Landscape', cue: 'explore the whole field' },
]

function DecisionWeather({ tension, knownA, knownB, unresolved, activePriorities }: { tension?: AtlasItem; knownA?: AtlasItem; knownB?: AtlasItem; unresolved?: AtlasItem; activePriorities: Priority[] }) {
  const emphasis = activePriorities.map((priority) => `priority-${tones[priority]}`).join(' ')
  return <figure className={`decision-weather ${emphasis}`} aria-label={`Visual first reading: ${tension?.label ?? 'two routes in tension'}`}>
    <svg viewBox="0 0 1000 470" role="img" aria-hidden="true">
      <defs>
        <filter id="weatherBlur"><feGaussianBlur stdDeviation="22" /></filter>
        <radialGradient id="weatherGlow"><stop stopColor="#f8f4e8" stopOpacity=".95" /><stop offset="1" stopColor="#f8f4e8" stopOpacity="0" /></radialGradient>
        <linearGradient id="weatherWash" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dce4d8" /><stop offset="1" stopColor="#ece3d9" /></linearGradient>
      </defs>
      <rect width="1000" height="470" fill="url(#weatherWash)" />
      <g className="weather-contours"><path d="M-40 110C90 27 198 48 286 151c87 102 183 88 260 7 75-80 177-93 276-16 73 57 140 48 220-10" /><path d="M-40 149c136-78 226-43 304 55 79 99 190 74 267-7 83-88 190-88 285-7 76 65 149 50 227-9" /><path d="M-40 194c139-73 248-39 325 61 75 98 193 75 272-11 77-85 189-86 283-6 79 67 144 49 202-8" /></g>
      <path className="weather-route weather-route-a" d="M92 416C164 337 214 303 314 270c90-30 128-72 181-140" />
      <path className="weather-route weather-route-b" d="M908 416c-75-80-127-113-224-147-88-31-124-70-179-139" />
      <path className="weather-ridge" d="M-10 275c136-98 247-65 339 14 84 72 183 63 259-17 79-83 187-74 271-11 62 47 105 39 151 9" />
      <ellipse className="weather-fog weather-fog-a" cx="300" cy="144" rx="148" ry="85" fill="url(#weatherGlow)" filter="url(#weatherBlur)" />
      <ellipse className="weather-fog weather-fog-b" cx="727" cy="155" rx="164" ry="91" fill="url(#weatherGlow)" filter="url(#weatherBlur)" />
      <circle className="weather-core" cx="500" cy="218" r="30" />
      <circle className="weather-core-ring" cx="500" cy="218" r="49" />
      <circle className="weather-star weather-star-a" cx="245" cy="307" r="9" />
      <circle className="weather-star weather-star-b" cx="757" cy="306" r="9" />
    </svg>
    <div className="weather-core-label"><span>the pull</span><b>{tension?.label ?? 'Two live routes'}</b></div>
    <div className="weather-marker weather-marker-a"><span>Route A / known</span><b>{knownA?.label ?? 'Conditions to confirm'}</b></div>
    <div className="weather-marker weather-marker-b"><span>Route B / known</span><b>{knownB?.label ?? 'Conditions to confirm'}</b></div>
    <figcaption><EvidenceMark type="unknown" /><span>Leave open</span><b>{unresolved?.label ?? 'The lived experience of each route'}</b></figcaption>
  </figure>
}

function MappingProgress({ moment }: { moment: number }) {
  const [title, detail] = mappingMoments[moment % mappingMoments.length]
  return <div className="mapping-progress" role="status" aria-live="polite" aria-busy="true">
    <div className="mapping-orbit" aria-hidden="true"><i /><i /><i /></div>
    <div><p>GPT-5.6 is drawing the field</p><h3>{title}</h3><span>{detail}</span></div>
    <small>Live structured map · can take a moment</small>
  </div>
}

function DecisionBriefing({ map, mapSource, activePriorities, focus, setFocus, optionA, optionB, horizon }: {
  map: FutureMap; mapSource: 'preset' | 'live'; activePriorities: Priority[]; focus: string; setFocus: (id: string) => void; optionA: string; optionB: string; horizon: string
}) {
  const [stage, setStage] = useState<BriefStage>('ground')
  const [tradeoffIndex, setTradeoffIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const knownA = itemForOption(map.knowns, 'a')
  const knownB = itemForOption(map.knowns, 'b')
  const unresolved = map.unknowns[0]
  const tradeoff = map.tradeoffs[tradeoffIndex % Math.max(map.tradeoffs.length, 1)]
  const question = map.questionsToInvestigate[questionIndex % Math.max(map.questionsToInvestigate.length, 1)]
  const selectedStage = briefStages.find((item) => item.id === stage) ?? briefStages[0]
  const focused = [...map.knowns, ...map.assumptions, ...map.unknowns].find((item) => item.id === focus)
  const headlineTension = map.tradeoffs[0]

  useEffect(() => {
    setStage('ground')
    setTradeoffIndex(0)
    setQuestionIndex(0)
  }, [map])

  function cycleTradeoff(direction: -1 | 1) {
    setTradeoffIndex((current) => (current + direction + map.tradeoffs.length) % map.tradeoffs.length)
  }

  function cycleQuestion(direction: -1 | 1) {
    setQuestionIndex((current) => (current + direction + map.questionsToInvestigate.length) % map.questionsToInvestigate.length)
  }

  return <section className="decision-briefing" id="atlas" aria-labelledby="briefing-title">
    <header className="briefing-header">
      <div><p className="eyebrow">02 / Your decision briefing</p><h2 id="briefing-title">Start with what matters.<br/><em>Then widen the view.</em></h2></div>
      <div className="briefing-intent"><span className={`map-source ${mapSource}`}>{mapSource === 'live' ? 'Live GPT-5.6 map' : 'Illustrative preset'}</span><p>This is a guide to possibilities and concerns—not a prediction or a verdict.</p>{headlineTension && <div className="brief-keyline"><span>First read</span><b>{headlineTension.label}</b></div>}</div>
    </header>
    <div className="brief-progress" role="tablist" aria-label="Decision briefing stages">
      {briefStages.map((item) => <button key={item.id} id={`brief-tab-${item.id}`} role="tab" aria-selected={stage === item.id} aria-controls={`brief-panel-${item.id}`} onClick={() => setStage(item.id)}><span>{item.number}</span><b>{item.label}</b><small>{item.cue}</small></button>)}
    </div>
    <div key={stage} id={`brief-panel-${stage}`} className={`brief-stage brief-${stage}`} role="tabpanel" aria-labelledby={`brief-tab-${stage}`}>
      {stage === 'ground' && <>
        <div className="brief-lead brief-ground-lead"><p className="stage-kicker">{selectedStage.number} / first reading</p><h3>{headlineTension?.label ?? map.framing}</h3><p>Not a verdict—just the strongest pull now visible in the field.</p></div>
        <DecisionWeather tension={headlineTension} knownA={knownA} knownB={knownB} unresolved={unresolved} activePriorities={activePriorities} />
      </>}
      {stage === 'tension' && <>
        <div className="brief-lead"><p className="stage-kicker">{selectedStage.number} / {selectedStage.cue}</p><h3>A trade-off is a real cost in two directions—not a failure to decide.</h3></div>
        {tradeoff && <article className="spotlight-tension"><span>↔</span><div><p>One tension to examine</p><h3>{tradeoff.label}</h3><p>{tradeoff.detail}</p></div></article>}
        {map.tradeoffs.length > 1 && <div className="brief-pager"><button onClick={() => cycleTradeoff(-1)} aria-label="Previous trade-off">←</button><span>{String(tradeoffIndex + 1).padStart(2, '0')} / {String(map.tradeoffs.length).padStart(2, '0')}</span><button onClick={() => cycleTradeoff(1)} aria-label="Next trade-off">→</button></div>}
      </>}
      {stage === 'fieldwork' && <>
        <div className="brief-lead"><p className="stage-kicker">{selectedStage.number} / {selectedStage.cue}</p><h3>The next useful move is often a question—not a conclusion.</h3></div>
        {question && <article className="spotlight-question"><span>{String(questionIndex + 1).padStart(2, '0')}</span><div><p>Question that could change the map</p><h3>{question.label}</h3><p>{question.detail}</p></div></article>}
        <div className="fieldwork-footer"><div><p className="stage-kicker">The third route</p><h3>Not yet.</h3><p>{map.notYet.detail}</p></div><button onClick={() => setStage('landscape')}>Open the full field <Icon name="arrow" /></button></div>
        {map.questionsToInvestigate.length > 1 && <div className="brief-pager"><button onClick={() => cycleQuestion(-1)} aria-label="Previous question">←</button><span>{String(questionIndex + 1).padStart(2, '0')} / {String(map.questionsToInvestigate.length).padStart(2, '0')}</span><button onClick={() => cycleQuestion(1)} aria-label="Next question">→</button></div>}
      </>}
      {stage === 'landscape' && <>
        <div className="brief-lead landscape-lead"><p className="stage-kicker">{selectedStage.number} / {selectedStage.cue}</p><h3>Now explore the whole field at your own pace.</h3><p>Hover or focus a signal to read its evidence note. Your selected priorities alter emphasis locally.</p></div>
        <Landscape map={map} activePriorities={activePriorities} focus={focus} setFocus={setFocus} optionA={optionA} optionB={optionB} horizon={horizon} />
        <aside className="reading-panel briefing-reading" aria-live="polite"><div className="panel-top"><span className="panel-number">{focused ? 'Signal' : 'How to read it'}</span>{focused && <EvidenceMark type={focused.status} />}</div>{focused ? <><h3>{focused.label}</h3><p>{focused.detail}</p><button onClick={() => setFocus('')}>Return to field</button></> : <><h3>Solid, porous, or fogged.</h3><p><b>Known</b> signals are grounded in what was supplied. <b>Assumptions</b> need checking. <b>Unknowns</b> are not gaps to fill with confidence.</p></>}</aside>
      </>}
    </div>
  </section>
}

export default function App() {
  const [optionA, setOptionA] = useState(presetFutureMap.input.options[0])
  const [optionB, setOptionB] = useState(presetFutureMap.input.options[1])
  const [selected, setSelected] = useState<Priority[]>(presetFutureMap.input.priorities as Priority[])
  const [horizon, setHorizon] = useState(presetFutureMap.input.horizon)
  const [focus, setFocus] = useState('')
  const [futureMap, setFutureMap] = useState<FutureMap>(presetFutureMap)
  const [mapSource, setMapSource] = useState<'preset' | 'live'>('preset')
  const [isMapping, setIsMapping] = useState(false)
  const [notice, setNotice] = useState('Static preset map refreshed for your inputs.')
  const [judgeCode, setJudgeCode] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [judgeAuthorized, setJudgeAuthorized] = useState(false)
  const [judgeNotice, setJudgeNotice] = useState('Live mapping is locked for judge access.')
  const [activeScenario, setActiveScenario] = useState(demoScenarios[0].id)
  const [mappingMoment, setMappingMoment] = useState(0)

  useEffect(() => {
    getJudgeAccessStatus().then((authorized) => {
      setJudgeAuthorized(authorized)
      if (authorized) setJudgeNotice('Live mapping is unlocked in this browser.')
    })
  }, [])

  useEffect(() => {
    if (!isMapping) return
    const timer = window.setInterval(() => setMappingMoment((current) => (current + 1) % mappingMoments.length), 2800)
    return () => window.clearInterval(timer)
  }, [isMapping])

  function togglePriority(priority: Priority) {
    setSelected((current) => {
      if (current.includes(priority)) return current.filter((x) => x !== priority)
      return current.length === 3 ? current : [...current, priority]
    })
  }
  function chooseScenario(scenario: DemoScenario) {
    setActiveScenario(scenario.id)
    setOptionA(scenario.options[0])
    setOptionB(scenario.options[1])
    setSelected(scenario.priorities as Priority[])
    setHorizon(scenario.horizon)
    setNotice(`“${scenario.title}” is set. Map it live, or make the fork your own.`)
  }
  async function mapInputs() {
    if (!optionA.trim() || !optionB.trim()) { setNotice('Enter both routes before mapping the terrain.'); return }
    if (!judgeAuthorized) {
      setFutureMap(presetFutureMap)
      setMapSource('preset')
      setFocus('')
      setNotice(`Illustrative preset refreshed · horizon: ${horizon}. Enter the judge access code for a live map.`)
      return
    }
    setIsMapping(true)
    setMappingMoment(0)
    setNotice('Mapping the uncertainty with GPT-5.6…')
    setFocus('')
    try {
      const map = await requestFutureMap({ options: [optionA.trim(), optionB.trim()], priorities: selected, horizon })
      setFutureMap(map)
      setMapSource('live')
      setNotice(`Live uncertainty map ready · horizon: ${horizon}.`)
    } catch {
      setFutureMap(presetFutureMap)
      setMapSource('preset')
      setNotice(`Live mapping is unavailable. Showing the illustrative preset · horizon: ${horizon}.`)
    } finally {
      setIsMapping(false)
    }
  }

  async function unlockLiveMapping() {
    if (isUnlocking) return
    if (!judgeCode.trim()) { setJudgeNotice('Enter the judge access code to unlock live mapping.'); return }
    setIsUnlocking(true)
    try {
      await unlockJudgeAccess(judgeCode)
      setJudgeCode('')
      setJudgeAuthorized(true)
      setJudgeNotice('Live mapping is unlocked in this browser.')
    } catch {
      setJudgeNotice('That code could not unlock live mapping. Check with the demo host.')
    } finally {
      setIsUnlocking(false)
    }
  }

  return <main>
    <a className="skip-link" href="#atlas">Skip to atlas</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Choice Atlas home"><span>Choice</span>Atlas<i /></a>
      <p>For decisions too human to optimize.</p>
      <button className="about" onClick={() => document.getElementById('limits')?.scrollIntoView({ behavior: 'smooth' })}>How it works <Icon name="arrow" /></button>
    </header>
    <section className="intro" id="top">
      <p className="eyebrow"><Icon name="compass" /> A field guide for uncertainty</p>
      <h1>Don’t force a verdict.<br/><em>Learn the shape</em> of the choice.</h1>
      <p className="lede">Choice Atlas separates what is solid from what is assumed, unknown, and still worth investigating. It does not tell you where to go.</p>
    </section>
    <section className="intake" aria-labelledby="intake-title">
      <div className="intake-title"><p className="eyebrow">01 / Set the field</p><h2 id="intake-title">Name two possible routes.</h2><small>Choose a demo fork, or make it yours. The map needs exactly two routes.</small></div>
      <div className="scenario-picker" role="group" aria-label="Quick-start dilemma topics"><span>Quick starts</span><div>{demoScenarios.map((scenario) => <button key={scenario.id} type="button" className={activeScenario === scenario.id ? 'selected' : ''} onClick={() => chooseScenario(scenario)}><b>{scenario.title}</b><small>{scenario.cue}</small></button>)}</div></div>
      <div className="routes-inputs">
        <label><span>Route A</span><input value={optionA} onChange={e => { setOptionA(e.target.value); setActiveScenario('') }} maxLength={62} aria-label="First option" /></label>
        <div className="or">or</div>
        <label><span>Route B</span><input value={optionB} onChange={e => { setOptionB(e.target.value); setActiveScenario('') }} maxLength={62} aria-label="Second option" /></label>
      </div>
      <fieldset className="priority-field"><legend>What matters in this terrain? <small>Choose up to three</small></legend><div className="priority-pills">
        {priorities.map(p => <button key={p} className={`priority ${tones[p]} ${selected.includes(p) ? 'selected' : ''}`} onClick={() => togglePriority(p)} aria-pressed={selected.includes(p)}><Icon name="plus" />{p}</button>)}
      </div></fieldset>
      <fieldset className="horizon-field"><legend>Time horizon</legend><div>{(['3 months', '1 year', '3 years'] as const).map(h => <label key={h}><input type="radio" checked={horizon === h} onChange={() => setHorizon(h)} name="horizon"/><span>{h}</span></label>)}</div></fieldset>
      <div className={`judge-access ${judgeAuthorized ? 'unlocked' : ''}`}>
        <div><span className="judge-kicker">Live demo access</span><p>{judgeAuthorized ? 'GPT-5.6 mapping unlocked' : 'Judge access code required for live GPT mapping'}</p></div>
        {judgeAuthorized ? <span className="judge-state">Unlocked</span> : <div className="judge-entry"><label><span className="sr-only">Judge access code</span><input type="password" value={judgeCode} onChange={e => setJudgeCode(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') unlockLiveMapping() }} autoComplete="off" placeholder="Enter access code" aria-describedby="judge-notice" disabled={isUnlocking} /></label><button type="button" onClick={unlockLiveMapping} disabled={isUnlocking}>{isUnlocking ? 'Checking…' : 'Unlock'}</button></div>}
        <p id="judge-notice" className="judge-notice" role="status">{judgeNotice}</p>
      </div>
      <button className="map-button" onClick={mapInputs} disabled={isMapping}>{isMapping ? 'Mapping terrain…' : 'Map the uncertainty'} <Icon name="arrow" /></button>
      {isMapping ? <MappingProgress moment={mappingMoment} /> : <p className="form-notice" role="status">{notice}</p>}
    </section>
    <DecisionBriefing map={futureMap} mapSource={mapSource} activePriorities={selected} focus={focus} setFocus={setFocus} optionA={optionA || 'Route A'} optionB={optionB || 'Route B'} horizon={horizon} />
    <footer id="limits"><div><a className="wordmark" href="#top"><span>Choice</span>Atlas<i /></a><p>Built for a live Build Week demo with a preset fallback.</p></div><p><b>Important limitation:</b> {futureMap.limitations}</p><p className="future">FutureMap v1.0 · GPT route ready</p></footer>
  </main>
}
