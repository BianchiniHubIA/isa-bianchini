import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Send, CheckCircle2, Moon, Clock, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { playCriticalNightSound, playPreAlertSound, playSuccessChime } from '../services/sound';
import { logNightAlertSent, hasSentAlertToday, getNightLogs } from '../services/storage';

export default function Sentinela2230({ settings }) {
  const [now, setNow] = useState(new Date());
  const [selectedExtension, setSelectedExtension] = useState('23:30');
  const [selectedTone, setSelectedTone] = useState('carinhoso');
  const [alertSentToday, setAlertSentToday] = useState(hasSentAlertToday());
  const [nightLogs, setNightLogs] = useState(getNightLogs());
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const prevStatusRef = useRef('safe');

  // Atualizar a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentSec = now.getSeconds();
  const currentTotalMin = currentHour * 60 + currentMin;

  const limitHour = settings.nightLimitHour ?? 22;
  const limitMin = settings.nightLimitMinute ?? 30;
  const limitTotalMin = limitHour * 60 + limitMin;
  const preAlertMin = limitTotalMin - (settings.preAlertMinutes ?? 15); // 22:15

  // Definir status atual
  let status = 'safe'; // 'safe', 'warning', 'critical'
  if (currentTotalMin >= limitTotalMin) {
    status = 'critical';
  } else if (currentTotalMin >= preAlertMin) {
    status = 'warning';
  }

  // Tocar som de transição quando entrar no horário crítico ou warning (se habilitado)
  useEffect(() => {
    if (!settings.soundEnabled || alertSentToday) return;

    if (status === 'critical' && prevStatusRef.current !== 'critical') {
      playCriticalNightSound();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ATENCAO: Limite das 22:30 Atingido!', {
          body: 'Victor, nao passe das 22:30 sem avisar a Isa que vai estender no computador. Mande uma mensagem agora!',
          icon: '/icon-192.png'
        });
      }
    } else if (status === 'warning' && prevStatusRef.current === 'safe') {
      playPreAlertSound();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Aviso Previo: 22:15', {
          body: 'Faltam 15 minutos para as 22:30. Se for estender no computador, lembre-se de avisar a Isa com antecedencia.',
          icon: '/icon-192.png'
        });
      }
    }
    prevStatusRef.current = status;
  }, [status, settings.soundEnabled, alertSentToday]);

  // Calculo do tempo restante ate as 22:30 (ou tempo decorrido alem das 22:30)
  const diffMinutes = limitTotalMin - currentTotalMin;
  const isPastLimit = diffMinutes <= 0;
  const absDiffMin = Math.abs(diffMinutes);
  const remainingSec = 59 - currentSec;

  // Gerador do texto da mensagem conforme tom e horario
  const generateMessageText = () => {
    if (selectedTone === 'direto') {
      return `Amor, vou estender aqui no computador ate por volta das ${selectedExtension} finalizando umas coisas. Qualquer coisa me chama, te amo!`;
    }
    if (selectedTone === 'focado') {
      return `Vida, estou no foco finalizando uma etapa aqui na maquina e vou ate umas ${selectedExtension}. Assim que terminar ja vou descansar contigo. Beijo carinhoso, te amo!`;
    }
    // Padrao: carinhoso
    return `Oi meu amor! So passando para te avisar com todo carinho que vou precisar estender um pouco mais aqui no computador ate por volta das ${selectedExtension}. Te amo muito e logo ja vou deitar contigo!`;
  };

  const currentMessageText = generateMessageText();

  // Acao de abrir WhatsApp e registrar log
  const handleSendWhatsApp = () => {
    const phone = settings.isaPhone ? settings.isaPhone.replace(/\D/g, '') : '';
    const encoded = encodeURIComponent(currentMessageText);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');

    // Registrar cumprimento no storage
    logNightAlertSent({
      extendedUntil: selectedExtension,
      messageType: selectedTone,
      messageText: currentMessageText
    });
    setAlertSentToday(true);
    setNightLogs(getNightLogs());
    playSuccessChime();
  };

  const handleMarkAsNotified = () => {
    logNightAlertSent({
      extendedUntil: selectedExtension,
      messageType: 'Notificado Pessoalmente',
      messageText: 'Aviso verbal direto a Isa'
    });
    setAlertSentToday(true);
    setNightLogs(getNightLogs());
    playSuccessChime();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  return (
    <section className={`bento-card ${status === 'critical' && !alertSentToday ? 'bento-card-alert' : status === 'warning' && !alertSentToday ? 'bento-card-warning' : ''}`} style={{ padding: '28px', gridColumn: 'span 12' }}>
      
      {/* Cabecalho da Secao */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: status === 'critical' && !alertSentToday ? 'rgba(244, 63, 94, 0.2)' : 'rgba(229, 182, 35, 0.15)',
            border: `1px solid ${status === 'critical' && !alertSentToday ? 'rgba(244, 63, 94, 0.4)' : 'rgba(229, 182, 35, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {status === 'critical' && !alertSentToday ? (
              <ShieldAlert size={26} color="#f43f5e" />
            ) : status === 'warning' && !alertSentToday ? (
              <AlertTriangle size={24} color="#f59e0b" />
            ) : (
              <Moon size={24} color="var(--gold-primary)" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="font-serif gradient-gold-text" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                Regra de Ouro das 22:30
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                Compromisso Vital
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nunca passar de 22:30 no computador sem avisar a Isa que vai estender o horario.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {alertSentToday ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#34d399', fontWeight: 600, fontSize: '0.88rem' }}>
            <CheckCircle2 size={18} />
            <span>Isa avisada com sucesso hoje!</span>
          </div>
        ) : isPastLimit ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid rgba(244, 63, 94, 0.5)', borderRadius: '12px', color: '#fda4af', fontWeight: 700, fontSize: '0.9rem' }}>
            <ShieldAlert size={18} />
            <span>Passou das 22:30! Avise a Isa agora!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            <Clock size={16} />
            <span>Faltam {diffMinutes} min para o limite de 22:30</span>
          </div>
        )}
      </div>

      {/* Caixa de Destaque da Contagem e Alerta */}
      <div style={{
        background: status === 'critical' && !alertSentToday
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : status === 'warning' && !alertSentToday
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${status === 'critical' && !alertSentToday ? 'rgba(244, 63, 94, 0.4)' : 'rgba(229, 182, 35, 0.18)'}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
          
          {/* Coluna do Cronometro */}
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: status === 'critical' ? '#fda4af' : 'var(--gold-light)', fontWeight: 700 }}>
              {isPastLimit ? 'Tempo decorrido apos o limite das 22:30:' : 'Tempo restante ate as 22:30:'}
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: isPastLimit && !alertSentToday ? '#f43f5e' : 'var(--text-main)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {isPastLimit ? `+${absDiffMin}m ${remainingSec}s` : `${diffMinutes}m ${remainingSec}s`}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isPastLimit
                ? 'Nao quebre o combinado. Se ainda esta no PC, envie a mensagem imediatamente.'
                : 'Se planeja continuar trabalhando depois das 22:30, avise antes para que ela fique tranquila.'}
            </p>
          </div>

          {/* Coluna de Acao Rapida */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 600 }}>
              Vou estender o horario ate:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['23:00', '23:30', '00:00', '00:30'].map((timeOption) => (
                <button
                  key={timeOption}
                  onClick={() => setSelectedExtension(timeOption)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedExtension === timeOption ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedExtension === timeOption ? '#0b0f19' : 'var(--text-main)',
                    border: selectedExtension === timeOption ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {timeOption}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Tom:</span>
              {[
                { id: 'carinhoso', label: 'Carinhoso' },
                { id: 'direto', label: 'Direto' },
                { id: 'focado', label: 'Em Foco / Render' }
              ].map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    background: selectedTone === tone.id ? 'rgba(229, 182, 35, 0.2)' : 'transparent',
                    color: selectedTone === tone.id ? 'var(--gold-light)' : 'var(--text-muted)',
                    border: selectedTone === tone.id ? '1px solid rgba(229, 182, 35, 0.4)' : '1px solid transparent'
                  }}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Pre-visualizacao da Mensagem Pronta & Botoes de Acao */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600 }}>
            <MessageSquare size={16} />
            <span>Mensagem pre-formatada para a Isa:</span>
          </div>
          <button
            onClick={handleCopyMessage}
            style={{
              background: 'transparent',
              border: 'none',
              color: copiedFeedback ? '#34d399' : 'var(--text-dim)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {copiedFeedback ? 'Copiado para a area de transferencia!' : 'Copiar texto'}
          </button>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderLeft: '3px solid var(--gold-primary)',
          borderRadius: '4px 8px 8px 4px',
          padding: '12px 16px',
          fontStyle: 'italic',
          color: '#e2e8f0',
          fontSize: '0.92rem',
          lineHeight: 1.5
        }}>
          "{currentMessageText}"
        </div>

        {/* Botoes de Acao */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'flex-start' }}>
          <button
            onClick={handleSendWhatsApp}
            className={status === 'critical' && !alertSentToday ? 'btn-danger' : 'btn-gold'}
            style={{ fontSize: '0.95rem', padding: '12px 24px' }}
          >
            <Send size={18} />
            <span>Abrir WhatsApp e Avisar a Isa</span>
          </button>

          <button
            onClick={handleMarkAsNotified}
            className="btn-secondary"
            style={{ fontSize: '0.88rem' }}
          >
            <CheckCircle2 size={16} color="#34d399" />
            <span>Ja avisei pessoalmente</span>
          </button>
        </div>
      </div>

      {/* Ultimos Registros */}
      {nightLogs.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Historico recente de avisos:
          </span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            {nightLogs.slice(0, 4).map((log) => (
              <div key={log.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>{log.date}</span> as {log.time} (estendeu ate {log.extendedUntil})
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
