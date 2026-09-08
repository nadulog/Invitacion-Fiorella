"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const EVENT_DATE = new Date("2026-11-07T21:00:00-03:00");
const SPOTIFY_PLAYLIST = "https://open.spotify.com/playlist/32EI0CECqq7pEZieSNSJrm?si=FApVZlLWSyCF-uptBp-vDw&utm_source=whatsapp&pt=12ab44d6e8841a78a9b71b33684abce7&pi=Jh1rAJv5Rw6vJ";
const RSVP_URL = "https://bloomdate-rsvp.netlify.app/r/cumple-xv-fiorella";
const MAP_URL = "https://maps.app.goo.gl/rHNCNMBexeXw2WCT6";

const BIRD_ROUTES = [
  ["-14%","18%","40%","10%","108%","28%","10deg","4deg","8deg"],
  ["108%","34%","58%","25%","-14%","14%","-6deg","4deg","-2deg"],
  ["12%","104%","34%","62%","74%","-12%","-56deg","-62deg","-58deg"],
  ["86%","102%","66%","58%","24%","-12%","-12deg","-4deg","-8deg"],
  ["-12%","72%","36%","52%","108%","78%","18deg","8deg","14deg"],
  ["108%","68%","64%","46%","-14%","82%","8deg","-3deg","5deg"],
  ["4%","40%","48%","32%","96%","8%","-8deg","-16deg","-10deg"],
  ["96%","12%","52%","38%","2%","56%","-8deg","5deg","-4deg"],
  ["28%","108%","44%","70%","18%","-12%","-68deg","-80deg","-72deg"],
  ["72%","-12%","58%","36%","82%","108%","72deg","82deg","76deg"],
];
const BIRD_DIRECTIONS = [1, -1, 1, -1, 1, -1, 1, -1, -1, 1];

const INTRO_BIRD_ROUTES = [
  ["-18%","82%","44%","56%","116%","22%","62deg","70deg","66deg"],
  ["116%","72%","58%","48%","-18%","14%","-62deg","-70deg","-66deg"],
  ["8%","112%","38%","58%","72%","-20%","18deg","24deg","20deg"],
  ["88%","112%","62%","55%","28%","-20%","-18deg","-24deg","-20deg"],
  ["-18%","30%","46%","20%","116%","62%","98deg","82deg","108deg"],
  ["116%","24%","56%","34%","-18%","70%","-98deg","-82deg","-108deg"],
  ["22%","-22%","45%","40%","78%","112%","162deg","154deg","160deg"],
  ["78%","-22%","58%","42%","20%","112%","-162deg","-154deg","-160deg"],
  ["-18%","94%","42%","68%","112%","84%","82deg","96deg","86deg"],
  ["112%","88%","64%","63%","-16%","38%","-76deg","-88deg","-80deg"],
  ["-14%","58%","48%","44%","108%","8%","44deg","34deg","40deg"],
  ["108%","46%","52%","30%","-14%","4%","-42deg","-34deg","-40deg"],
];

const GALLERY_PHOTOS = Array.from({ length: 6 }, (_, index) => ({
  src: `/fiorella-gallery-0${index + 1}.jpeg`,
  alt: `Fiorella, foto ${index + 1}`,
}));

function useCountdown() {
  const [time, setTime] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const updateTime = () => {
      const distance = Math.max(0, EVENT_DATE.getTime() - Date.now());
      setTime([
        Math.floor(distance / 86400000),
        Math.floor((distance / 3600000) % 24),
        Math.floor((distance / 60000) % 60),
        Math.floor((distance / 1000) % 60),
      ]);
    };
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}

const sections = [
  { image: "/01-portada.png?v=20260906-nueva-portada", label: "Portada: Fiorella, mis quince" },
  { image: "/02-contador-clean.png", label: "Cuenta regresiva" },
  { image: "/03-fecha.png", label: "Fecha y hora" },
  { image: "/04-ubicacion.png", label: "Cómo llegar" },
  { image: "/05-dresscode.png?v=20260906-nuevo-dress-code", label: "Dress code elegante" },
  { image: "/06-regalos.png?v=20260906-nuevos-regalos", label: "Regalos" },
  { image: "/07-musica.png", label: "Música" },
  { image: "/08-rsvp.png?v=20260906-nuevo-cierre", label: "Confirmación de asistencia" },
];

export default function Home() {
  const time = useCountdown();
  const [giftOpen, setGiftOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [introOpen, setIntroOpen] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      setMusicOn(false);
    }
  };

  const enterInvitation = async (withMusic: boolean) => {
    if (introLeaving) return;
    if (withMusic) {
      try {
        await audioRef.current?.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    } else {
      audioRef.current?.pause();
      setMusicOn(false);
    }
    setIntroLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setIntroOpen(false);
      window.scrollTo(0, 0);
    }, reduced ? 280 : 5200);
  };

  const copyAlias = async () => {
    await navigator.clipboard.writeText("fio.galiatti");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main>
      <audio ref={audioRef} src="/fiorella-music.mp3" preload="metadata" loop onPlay={() => setMusicOn(true)} onPause={() => setMusicOn(false)} />

      {introOpen && (
        <section className={`invitation-intro ${introLeaving ? "is-leaving" : ""}`} aria-label="Bienvenida a los XV de Fiorella">
          <img className="invitation-intro-image" src="/fiorella-intro.png?v=20260908" alt="Fiorella, mis XV" />
          <button className="intro-choice intro-choice-music" onClick={() => enterInvitation(true)} disabled={introLeaving} aria-label="Entrar con música" />
          <button className="intro-choice intro-choice-silent" onClick={() => enterInvitation(false)} disabled={introLeaving} aria-label="Entrar sin música" />
          <div className="intro-bird-flock" aria-hidden="true">
            {INTRO_BIRD_ROUTES.map((route, index) => (
              <span key={index} style={{
                "--start-x": route[0], "--start-y": route[1], "--middle-x": route[2], "--middle-y": route[3],
                "--end-x": route[4], "--end-y": route[5], "--start-rotation": route[6],
                "--middle-rotation": route[7], "--end-rotation": route[8],
                "--size": `${66 + (index * 11) % 38}px`, "--scale": 0.88 + (index % 4) * 0.08,
                "--flip": index % 2 === 0 ? 1 : -1, "--duration": `${4400 + (index * 137) % 900}ms`,
                "--delay": `${(index % 6) * 105 + Math.floor(index / 6) * 70}ms`,
                "--flap-duration": `${680 + (index % 5) * 80}ms`,
              } as CSSProperties}>
                <span className="bird-sprite">
                  <img className="bird-body" src="/bird-pink-white.png?v=20260905-dusty-pink" alt="" />
                  <img className="bird-wing" src="/bird-pink-white.png?v=20260905-dusty-pink" alt="" />
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      {sections.map((section, index) => (
        <Fragment key={section.image}>
        <section className={`invitation-card card-${index + 1}`} aria-label={section.label}>
          <img src={section.image} alt="" />

          {index === 1 && (
            <>
              <div className="bird-flock" aria-hidden="true">
                {BIRD_ROUTES.map((route, i) => (
                  <span key={i} style={{
                    "--start-x": route[0], "--start-y": route[1], "--middle-x": route[2], "--middle-y": route[3],
                    "--end-x": route[4], "--end-y": route[5], "--start-rotation": route[6],
                    "--middle-rotation": route[7], "--end-rotation": route[8],
                    "--size": `${46 + (i % 4) * 10}px`, "--scale": 0.78 + (i % 3) * 0.1,
                    "--flip": BIRD_DIRECTIONS[i],
                    "--duration": `${9.5 + (i % 5) * 1.15}s`, "--delay": `${-i * 1.37}s`,
                    "--flap-duration": `${560 + (i % 4) * 90}ms`,
                  } as CSSProperties}>
                    <span className="bird-sprite">
                      <img className="bird-body" src="/bird-pink-white.png?v=20260905-dusty-pink" alt="" />
                      <img className="bird-wing" src="/bird-pink-white.png?v=20260905-dusty-pink" alt="" />
                    </span>
                  </span>
                ))}
              </div>
              <div className="live-countdown" aria-label="Cuenta regresiva en vivo">
                {time.map((value, i) => (
                  <div key={i}><strong>{String(value).padStart(2, "0")}</strong><span>{["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][i]}</span></div>
                ))}
              </div>
            </>
          )}
          {index === 2 && <a className="hotspot date-button" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mis+15+Fiorella&dates=20261108T000000Z/20261108T060000Z&details=Fiesta+de+15+de+Fiorella&location=Salon+Los+Morrillos,+San+Juan+965+Norte,+Santa+Lucia" target="_blank" rel="noreferrer" aria-label="Agregar al calendario" />}
          {index === 3 && <button className="hotspot map-button" onClick={() => setMapOpen(true)} aria-label="Ver cómo llegar" />}
          {index === 5 && <button className="hotspot gift-button" onClick={() => setGiftOpen(true)} aria-label="Ver datos para regalo" />}
          {index === 6 && <a className="hotspot playlist-button" href={SPOTIFY_PLAYLIST} target="_blank" rel="noreferrer" aria-label="Abrir playlist de Fiorella en Spotify" />}
          {index === 7 && <a className="hotspot rsvp-button" href={RSVP_URL} target="_blank" rel="noreferrer" aria-label="Confirmar asistencia" />}
        </section>
        {index === 5 && (
          <section className="paper-gallery" aria-label="Galería de fotos de Fiorella">
            {GALLERY_PHOTOS.map((photo, photoIndex) => (
              <button
                className={`torn-photo torn-photo-${photoIndex + 1}`}
                key={photo.src}
                onClick={() => setSelectedPhoto(photoIndex)}
                aria-label={`Ver completa la foto ${photoIndex + 1}`}
              >
                <span className="torn-photo-paper">
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </span>
              </button>
            ))}
          </section>
        )}
        </Fragment>
      ))}

      <footer className="bloomdate-footer" aria-label="Redes sociales de BloomDate">
        <img src="/bloomdate-footer.png" alt="Hecho con amor por BloomDate" loading="lazy" />
        <a className="footer-social footer-whatsapp" href="https://wa.me/541140436324" target="_blank" rel="noreferrer" aria-label="Contactar a BloomDate por WhatsApp" title="WhatsApp: +54 11 4043-6324" />
        <a className="footer-social footer-instagram" href="https://www.instagram.com/bloomdate.invitaciones/" target="_blank" rel="noreferrer" aria-label="Ver BloomDate en Instagram" title="Instagram: @bloomdate.invitaciones" />
        <a className="footer-social footer-web" href="https://bloomdate-site.netlify.app/" target="_blank" rel="noreferrer" aria-label="Visitar la web de BloomDate" title="Web de BloomDate" />
      </footer>

      <button className={`music-control ${musicOn ? "playing" : ""}`} onClick={toggleMusic} aria-label={musicOn ? "Pausar música" : "Reproducir música"}>
        {musicOn ? "Ⅱ" : "♪"}
      </button>

      {giftOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setGiftOpen(false)}>
          <div className="gift-modal" role="dialog" aria-modal="true" aria-labelledby="gift-title" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setGiftOpen(false)} aria-label="Cerrar">×</button>
            <span>REGALOS</span>
            <h2 id="gift-title">Gracias por acompañarme</h2>
            <p>Si querés hacerme un regalo, podés usar estos datos:</p>
            <dl className="gift-details">
              <div><dt>ALIAS</dt><dd>fio.galiatti</dd></div>
              <div><dt>TITULAR</dt><dd>Fiorella Galiatti Micheltorena</dd></div>
              <div><dt>ENTIDAD</dt><dd>Banco Credicoop</dd></div>
            </dl>
            <button className="copy" onClick={copyAlias}>{copied ? "¡ALIAS COPIADO!" : "COPIAR ALIAS"}</button>
          </div>
        </div>
      )}

      {mapOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setMapOpen(false)}>
          <div className="gift-modal map-modal" role="dialog" aria-modal="true" aria-labelledby="map-title" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setMapOpen(false)} aria-label="Cerrar">×</button>
            <span>CÓMO LLEGAR</span>
            <h2 id="map-title">Salón Los Morrillos</h2>
            <p className="map-address">San Juan 965 Norte<br />Santa Lucía</p>
            <a className="modal-map-link" href={MAP_URL} target="_blank" rel="noreferrer">ABRIR EN GOOGLE MAPS</a>
          </div>
        </div>
      )}

      {selectedPhoto !== null && (
        <div className="gallery-lightbox" role="presentation" onClick={() => setSelectedPhoto(null)}>
          <div className="gallery-lightbox-inner" role="dialog" aria-modal="true" aria-label={`Foto ${selectedPhoto + 1} de Fiorella`} onClick={(event) => event.stopPropagation()}>
            <button className="gallery-lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="Cerrar foto">×</button>
            <img src={GALLERY_PHOTOS[selectedPhoto].src} alt={GALLERY_PHOTOS[selectedPhoto].alt} />
            <button className="gallery-lightbox-nav gallery-lightbox-prev" onClick={() => setSelectedPhoto((selectedPhoto + GALLERY_PHOTOS.length - 1) % GALLERY_PHOTOS.length)} aria-label="Foto anterior">‹</button>
            <button className="gallery-lightbox-nav gallery-lightbox-next" onClick={() => setSelectedPhoto((selectedPhoto + 1) % GALLERY_PHOTOS.length)} aria-label="Foto siguiente">›</button>
          </div>
        </div>
      )}

    </main>
  );
}
