import { useEffect, useRef, useState } from 'react';
import { contentRewriteRules } from './content-paths';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Maximize,
  Volume2,
  Info,
} from 'lucide-react';
type Slide = {
  title: string;
  text: string;
  image: string;
  labels: { title: string; text: string }[];
};
export type Activity = {
  id: string;
  title: string;
  originalName: string;
  type: string;
  width: number;
  height: number;
  definition: string;
  preview: string;
  slides: Slide[];
  kind: string;
};
type Player = HTMLElement & {
  ruffle: () => { load: (options: Record<string, unknown>) => Promise<void> };
};
declare global {
  interface Window {
    RufflePlayer?: { newest: () => { createPlayer: () => Player } };
  }
}
const contentURL = new URL('./content/', document.baseURI).href;
export const assetURL = (path: string) => new URL(path, contentURL).href;
let ruffleReady: Promise<void> | undefined;
function getRuffle() {
  if (!ruffleReady)
    ruffleReady = new Promise<void>((resolve, reject) => {
      if (window.RufflePlayer?.newest) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = new URL('./ruffle/ruffle.js', document.baseURI).href;
      script.onload = () => resolve();
      script.onerror = () => {
        ruffleReady = undefined;
        script.remove();
        reject(
          new Error(
            'No se pudo cargar Ruffle. Comprueba que la carpeta ruffle forma parte de la publicación.',
          ),
        );
      };
      document.head.append(script);
    });
  return ruffleReady;
}
export function OriginalPlayer({
  activity,
  files,
}: {
  activity: Activity;
  files: string[];
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(''),
    [started, setStarted] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!started) return;
    let disposed = false;
    let player: Player | undefined;
    let observer: ResizeObserver | undefined;
    setError('');
    async function start() {
      try {
        await getRuffle();
        if (disposed) return;
        player = window.RufflePlayer!.newest().createPlayer();
        player.style.width = activity.width + 'px';
        player.style.height = activity.height + 'px';
        player.style.transformOrigin = 'top left';
        const resize = () => {
          if (player && host.current)
            player.style.transform =
              'scale(' + host.current.clientWidth / activity.width + ')';
        };
        observer = new ResizeObserver(resize);
        observer.observe(host.current!);
        resize();
        host.current!.replaceChildren(player);
        const rules = contentRewriteRules(files, activity.id, contentURL);
        const filePath = assetURL(activity.definition)
          .replaceAll('/', '@')
          .replaceAll(':', '~');
        await player.ruffle().load({
          url: assetURL('dswmedia/shared/players/iafplayer/base.swf'),
          parameters: { filePath, isActive: 'true', id: 'FL' + activity.id },
          autoplay: 'on',
          backgroundColor: '#ffffff',
          allowScriptAccess: false,
          openUrlMode: 'deny',
          scale: 'noScale',
          forceScale: true,
          letterbox: 'on',
          urlRewriteRules: rules,
        });
      } catch (err) {
        if (!disposed)
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo abrir la actividad.',
          );
      }
    }
    start();
    return () => {
      disposed = true;
      observer?.disconnect();
      player?.remove();
    };
  }, [activity, files, started, revision]);
  return (
    <>
      <div
        className="player-frame"
        style={{ aspectRatio: `${activity.width}/${activity.height}`, maxWidth: Math.min(760, 450 * activity.width / activity.height) }}
      >
        <div className="player-host" ref={host} />
        {!started && (
          <div className="play-cover">
            <Gamepad2 size={48} />
            <h2>{activity.title}</h2>
            <p>Abre la actividad original con sus sonidos y controles.</p>
            <button className="primary" onClick={() => setStarted(true)}>
              <Play size={20} /> Abrir actividad
            </button>
          </div>
        )}
        {error && (
          <div className="play-cover" role="alert">
            <Info size={32} />
            <p>{error}</p>
            <button onClick={() => setRevision((x) => x + 1)}>
              Reintentar
            </button>
          </div>
        )}
      </div>
      <div className="player-tools">
        <span>
          <Volume2 size={16} /> El sonido se activa al abrir
        </span>
        <button disabled={!started} onClick={() => setRevision((x) => x + 1)}>
          <RotateCcw size={16} /> Reiniciar
        </button>
        <button
          onClick={() =>
            host.current?.parentElement
              ?.requestFullscreen?.()
              .catch(() =>
                setError('Tu navegador no permite ampliar esta vista.'),
              )
          }
        >
          <Maximize size={16} /> Ampliar
        </button>
      </div>
    </>
  );
}
export function Reader({ activity }: { activity: Activity }) {
  const [index, setIndex] = useState(0);
  const slide = activity.slides[index];
  if (!slide) return <p>No hay fichas de lectura para esta actividad.</p>;
  return (
    <div className="reader">
      <nav aria-label="Fichas de la actividad">
        {activity.slides.map((s, i) => (
          <button
            key={i}
            aria-current={i === index ? 'step' : undefined}
            onClick={() => setIndex(i)}
          >
            {i + 1}. {s.title || 'Ficha ' + (i + 1)}
          </button>
        ))}
      </nav>
      <article>
        <span className="eyebrow">
          FICHA {index + 1} DE {activity.slides.length}
        </span>
        <h2>{slide.title || activity.title}</h2>
        {/\.(jpg|png|gif)$/i.test(slide.image) && (
          <img
            className="reader-image"
            src={assetURL(slide.image)}
            alt={slide.title || activity.title}
          />
        )}
        {slide.text && <p>{slide.text}</p>}
        {slide.labels.map((label, i) => (
          <details key={i}>
            <summary>{label.title || 'Descubrir más'}</summary>
            <p>{label.text}</p>
          </details>
        ))}
        {slide.image.endsWith('.swf') && (
          <p className="muted">
            La ilustración animada se encuentra en la vista «Actividad
            original».
          </p>
        )}
      </article>
    </div>
  );
}
