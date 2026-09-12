import { useEffect, useRef, useState } from 'react';
import { assetURL, OriginalPlayer, Reader, type Activity } from './players';
import { themes, normalize } from './themes';

const ui = (name: string) => assetURL('interface/' + name);
const icon = (id: string) => ui(id + '.gsm.png');
const routeNow = () => {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return '';
  }
};
type Bookmark = { id: string; title: string };
function readBookmarks(): Bookmark[] {
  try {
    return JSON.parse(localStorage.getItem('encarta-favorites') || '[]');
  } catch {
    return [];
  }
}

export default function Home() {
  const [catalog, setCatalog] = useState<Activity[]>([]),
    [files, setFiles] = useState<string[]>([]),
    [error, setError] = useState('');
  const [route, setRoute] = useState(routeNow),
    [query, setQuery] = useState(''),
    [mode, setMode] = useState('original');
  const [menu, setMenu] = useState(''),
    [about, setAbout] = useState(false),
    [sound, setSound] = useState(true);
  const [bookmarks, setBookmarks] = useState(readBookmarks),
    [scale, setScale] = useState(1),
    [historyIndex, setHistoryIndex] = useState(0);
  const stage = useRef<HTMLDivElement>(null),
    search = useRef<HTMLInputElement>(null),
    voice = useRef<HTMLAudioElement | null>(null);
  const navigation = useRef({
    items: routeNow() ? ['', routeNow()] : [''],
    index: routeNow() ? 1 : 0,
  });
  useEffect(() => {
    const request = new AbortController();
    Promise.all(
      ['catalog.json', 'files.json'].map(async (path) => {
        const r = await fetch(assetURL(path), { signal: request.signal });
        if (!r.ok) throw new Error('No se encontró el contenido importado.');
        return r.json();
      }),
    )
      .then(([items, paths]) => {
        if (request.signal.aborted) return;
        setCatalog(items);
        setFiles(paths);
      })
      .catch((e) => { if (!request.signal.aborted) setError(e.message); });
    const change = () => {
      const value = routeNow();
      const nav = navigation.current;
      if (nav.items[nav.index - 1] === value) nav.index--;
      else if (nav.items[nav.index + 1] === value) nav.index++;
      else if (nav.items[nav.index] !== value) {
        nav.items = nav.items.slice(0, nav.index + 1);
        nav.items.push(value);
        nav.index++;
      }
      setHistoryIndex(nav.index);
      setRoute(value);
      setMode('original');
      setMenu('');
    };
    const resize = () =>
      setScale(Math.min(window.innerWidth / 1024, window.innerHeight / 690));
    resize();
    setHistoryIndex(navigation.current.index);
    window.addEventListener('hashchange', change);
    window.addEventListener('resize', resize);
    return () => {
      request.abort();
      window.removeEventListener('hashchange', change);
      window.removeEventListener('resize', resize);
      voice.current?.pause();
    };
  }, []);
  const parts = route.split('/');
  const themeIndex = parts[0] === 'theme' ? Number(parts[1]) : -1;
  const theme = themes[themeIndex];
  const topicIndex = parts[2] === undefined ? -1 : Number(parts[2]);
  const topic = theme?.topics[topicIndex];
  const activity = catalog.find((a) => a.id === route);
  const home = !activity && (!route || (theme && !topic));
  const isSearch = parts[0] === 'search';
  const isFavorites = route === 'favorites';
  const title =
    activity?.title ||
    topic?.title ||
    (isSearch
      ? 'Resultados de la búsqueda'
      : isFavorites
        ? 'Favoritos'
        : route === 'all'
          ? 'Actividades'
          : theme?.title || 'Mi primera Encarta');
  const searchTerm = isSearch ? parts.slice(1).join('/') : '';
  const matches = catalog.filter((a) => {
    const text = normalize(a.title + ' ' + a.originalName);
    if (topic)
      return (
        (!topic.games || a.kind === 'Juegos') &&
        new RegExp(topic.terms).test(text)
      );
    if (isSearch) return text.includes(normalize(searchTerm));
    if (isFavorites) return bookmarks.some((b) => b.id === a.id);
    return true;
  });
  function play(id: number) {
    if (!sound) return;
    voice.current?.pause();
    voice.current = new Audio(ui(`sound-${id}.wav`));
    void voice.current.play().catch(() => {});
  }
  function back() {
    const n = navigation.current;
    if (n.index > 0) location.hash = n.items[n.index - 1];
  }
  function forward() {
    const n = navigation.current;
    if (n.index < n.items.length - 1) location.hash = n.items[n.index + 1];
  }
  function favorite() {
    if (!activity) return;
    const next = bookmarks.some((b) => b.id === activity.id)
      ? bookmarks.filter((b) => b.id !== activity.id)
      : [...bookmarks, { id: activity.id, title: activity.title }];
    setBookmarks(next);
    try {
      localStorage.setItem('encarta-favorites', JSON.stringify(next));
    } catch {}
    setMenu('');
  }
  function fullscreen() {
    void document.documentElement.requestFullscreen?.().catch(() => {});
    setMenu('');
  }
  function copyTitle() {
    void navigator.clipboard?.writeText(title).catch(() => {});
    setMenu('');
  }
  const sprite = (
    name: string,
    id: number,
    width: number,
    height: number,
    action: () => void,
    disabled = false,
  ) => (
    <button
      className="sprite"
      title={name}
      aria-label={name}
      style={
        {
          width,
          height,
          backgroundImage: `url(${ui(`toolbar-${id}.png`)})`,
          '--frame-width': `${width}px`,
        } as React.CSSProperties
      }
      onClick={action}
      disabled={disabled}
    />
  );
  return (
    <div className="classic-viewport">
      <div
        className="classic-size"
        style={{ width: 1024 * scale, height: 690 * scale }}
      >
        <div
          className="classic-app"
          ref={stage}
          style={{ transform: `scale(${scale})` }}
        >
          <header className="original-toolbar">
            <div className="toolbar-main">
              {sprite('Página principal', 15051, 66, 71, () => {
                location.hash = '';
                play(31973);
              })}
              {sprite('Atrás', 15052, 66, 71, back, historyIndex === 0)}
              {sprite(
                'Adelante',
                15053,
                36,
                71,
                forward,
                historyIndex === navigation.current.items.length - 1,
              )}
              <div className="toolbar-small">
                {sprite('Copiar título', 15055, 46, 50, copyTitle)}
                {sprite('Imprimir', 15056, 46, 50, () => window.print())}
              </div>
            </div>
            <nav className="classic-menubar" aria-label="Menú de Encarta">
              {[
                'Archivo',
                'Edición',
                'Ver',
                'Favoritos',
                'Herramientas',
                '?',
              ].map((label) => (
                <div className="menu-holder" key={label}>
                  <button
                    aria-expanded={menu === label}
                    onClick={() => setMenu(menu === label ? '' : label)}
                  >
                    {label}
                  </button>
                  {menu === label && (
                    <div className="dropdown">
                      {label === 'Archivo' && (
                        <>
                          <a href="#">Página principal</a>
                          <button onClick={() => window.print()}>
                            Imprimir…
                          </button>
                        </>
                      )}
                      {label === 'Edición' && (
                        <>
                          <button onClick={copyTitle}>Copiar título</button>
                          <button
                            onClick={() => {
                              search.current?.focus();
                              setMenu('');
                            }}
                          >
                            Buscar
                          </button>
                        </>
                      )}
                      {label === 'Ver' && (
                        <>
                          <button onClick={fullscreen}>
                            Pantalla completa
                          </button>
                          <a href="#all">Todas las actividades</a>
                        </>
                      )}
                      {label === 'Favoritos' && (
                        <>
                          <button disabled={!activity} onClick={favorite}>
                            {bookmarks.some((b) => b.id === activity?.id)
                              ? 'Quitar de Favoritos'
                              : 'Agregar a Favoritos'}
                          </button>
                          <a href="#favorites">Ver Favoritos</a>
                        </>
                      )}
                      {label === 'Herramientas' && (
                        <button
                          onClick={() => {
                            setSound(!sound);
                            voice.current?.pause();
                            setMenu('');
                          }}
                        >
                          {sound ? '✓ ' : ''}Sonidos de navegación
                        </button>
                      )}
                      {label === '?' && (
                        <button
                          onClick={() => {
                            setAbout(true);
                            setMenu('');
                          }}
                        >
                          Acerca de esta adaptación…
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <form
              className="original-search"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim())
                  location.hash = 'search/' + encodeURIComponent(query.trim());
                setMenu('');
              }}
            >
              <label
                htmlFor="encarta-search"
                className="search-label"
                style={{ backgroundImage: `url(${ui('toolbar-15057.png')})` }}
              >
                <span className="sr-only">Buscar</span>
              </label>
              <div className="search-field">
                <input
                  ref={search}
                  id="encarta-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="search-submit"
                title="Buscar"
                aria-label="Buscar"
                style={{ backgroundImage: `url(${ui('toolbar-15058.png')})` }}
              />
            </form>
            <a
              href="#"
              className="toolbar-logo"
              aria-label="Mi primera Encarta"
            >
              <img src={ui('toolbar-15059.png')} alt="" />
            </a>
          </header>
          <main
            className={
              'classic-content ' +
              (home
                ? 'home-content'
                : activity
                  ? 'activity-content'
                  : 'topics-content')
            }
            onClick={() => menu && setMenu('')}
          >
            {home ? (
              <div
                className="original-home"
                style={{
                  backgroundImage: `url(${assetURL('baggage/' + (theme?.background || '0015aed2') + '.jpg')})`,
                }}
              >
                <nav aria-label="Temas de Mi primera Encarta">
                  {themes.map((item, i) => (
                    <a
                      href={'#theme/' + i}
                      key={item.button}
                      aria-label={item.title}
                      aria-current={themeIndex === i ? 'page' : undefined}
                      className={
                        'home-category ' + (themeIndex === i ? 'current' : '')
                      }
                      style={{ left: i < 5 ? 0 : 576, top: 9 + (i % 5) * 90 }}
                      onClick={() => play(31973)}
                      onMouseEnter={() => play(31979 + i)}
                    >
                      <img
                        className="category-rest"
                        src={icon(item.button)}
                        alt={item.title}
                      />
                      <img
                        className="category-over"
                        src={ui(item.button + '.gmo.png')}
                        alt=""
                      />
                    </a>
                  ))}
                </nav>
                {theme && (
                  <nav className="original-subtopics" aria-label={theme.title}>
                    {theme.topics.map((item, i) => (
                      <a
                        key={item.title}
                        href={`#theme/${themeIndex}/${i}`}
                        onClick={() => play(31973)}
                      >
                        <img src={icon(item.icon)} alt="" />
                        <span>{item.title}</span>
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            ) : activity ? (
              <div className="original-activity">
                <div className="activity-caption">
                  <h1>{title}</h1>
                  <div className="activity-options">
                    <button
                      className={mode === 'original' ? 'on' : ''}
                      onClick={() => setMode('original')}
                    >
                      Actividad
                    </button>
                    {activity.slides.some((s) => s.text || s.labels.length) && (
                      <button
                        className={mode === 'reader' ? 'on' : ''}
                        onClick={() => setMode('reader')}
                      >
                        Leer
                      </button>
                    )}
                    <button onClick={favorite} title="Guardar en Favoritos">
                      {bookmarks.some((b) => b.id === activity.id) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
                <div className="activity-scroll">
                  {mode === 'original' ? (
                    <OriginalPlayer
                      key={activity.id}
                      activity={activity}
                      files={files}
                    />
                  ) : (
                    <Reader key={activity.id} activity={activity} />
                  )}
                </div>
              </div>
            ) : (
              <div className="original-topics">
                <h1>{theme?.title || title}</h1>
                <div className="topics-layout">
                  <nav className="topics-sidebar" aria-label="Secciones">
                    {theme ? (
                      theme.topics.map((item, i) => (
                        <a
                          key={item.title}
                          className={i === topicIndex ? 'selected' : ''}
                          href={`#theme/${themeIndex}/${i}`}
                        >
                          <img src={icon(item.icon)} alt="" />
                          {item.title}
                        </a>
                      ))
                    ) : (
                      <>
                        <a href="#all">Todas las actividades</a>
                        <a href="#theme/9">Juega y aprende</a>
                        <a href="#favorites">Favoritos</a>
                        <a href="#">Página principal</a>
                      </>
                    )}
                  </nav>
                  <section className="original-results" aria-label={title}>
                    {isSearch && (
                      <p className="search-summary">
                        {matches.length}{' '}
                        {matches.length === 1 ? 'resultado' : 'resultados'} de «
                        {searchTerm}»
                      </p>
                    )}
                    {error ? (
                      <p role="alert">{error}</p>
                    ) : catalog.length === 0 ? (
                      <p role="status">Cargando…</p>
                    ) : matches.length === 0 ? (
                      <p className="not-imported">
                        {isSearch
                          ? 'No se encontraron actividades con esa palabra.'
                          : isFavorites
                            ? 'Todavía no has guardado actividades en Favoritos.'
                            : 'El contenido de esta sección todavía no está disponible en la adaptación.'}
                      </p>
                    ) : (
                      <div className="original-grid">
                        {matches.map((a) => (
                          <a
                            href={'#' + a.id}
                            key={a.id}
                            onClick={() => play(31973)}
                          >
                            {a.preview ? (
                              <img
                                src={assetURL(a.preview)}
                                alt=""
                                loading="lazy"
                              />
                            ) : (
                              <img
                                className="fallback-icon"
                                src={icon(
                                  a.kind === 'Juegos'
                                    ? '0015a8e2'
                                    : topic?.icon || '00127047',
                                )}
                                alt=""
                              />
                            )}
                            <span>{a.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}
          </main>
          <footer className="original-status">
            <span>{home ? theme?.title || 'Mi primera Encarta' : title}</span>
            <button onClick={() => setAbout(true)}>Adaptación web</button>
          </footer>
          {about && (
            <div className="dialog-shade">
              <section
                className="classic-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-title"
              >
                <header>
                  <strong id="about-title">Mi primera Encarta 2009</strong>
                  <button onClick={() => setAbout(false)} aria-label="Cerrar">
                    ×
                  </button>
                </header>
                <div>
                  <p>
                    Interfaz reconstruida con los fondos, botones y sonidos de
                    tu edición original.
                  </p>
                  <p>
                    Incluye {catalog.length} actividades recuperadas. Los
                    artículos completos y las asociaciones originales de temas
                    siguen pendientes. La compatibilidad de las actividades
                    continúa en revisión.
                  </p>
                  <p>
                    Recursos originales de Microsoft. Adaptación no oficial.
                  </p>
                  <button autoFocus onClick={() => setAbout(false)}>
                    Aceptar
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
