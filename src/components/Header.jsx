import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Sparkles, Settings, Volume2, Bell, Heart } from 'lucide-react';
import { playPreAlertSound, playCriticalNightSound } from '../services/sound';

export default function Header({ settings, onOpenSettings }) {
  const [time, setTime] = useState(new Date());
  const [notificationStatus, setNotificationStatus] = useState('default');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        new Notification('Sentinela Isa & Victor', {
          body: 'Notificacoes ativadas com sucesso para alertas e datas especiais!',
          icon: '/icon-192.png'
        });
      }
    }
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const currentTotalMin = hours * 60 + minutes;
  const limitTotalMin = (settings.nightLimitHour ?? 22) * 60 + (settings.nightLimitMinute ?? 30);
  const preAlertTotalMin = limitTotalMin - (settings.preAlertMinutes ?? 15);

  let nightStatus = 'safe';
  let statusText = 'Horario Seguro';
  let badgeClass = 'badge-emerald';

  if (currentTotalMin >= limitTotalMin) {
    nightStatus = 'critical';
    statusText = 'Limite 22:30 Atingido!';
    badgeClass = 'badge-rose';
  } else if (currentTotalMin >= preAlertTotalMin) {
    nightStatus = 'warning';
    statusText = 'Aviso Previo Noturno';
    badgeClass = 'badge-amber';
  }

  const handleTestAudio = () => {
    if (nightStatus === 'critical') {
      playCriticalNightSound();
    } else {
      playPreAlertSound();
    }
  };

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="bento-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Identidade e Titulo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(229, 182, 35, 0.25) 0%, rgba(244, 63, 94, 0.2) 100%)',
            border: '1px solid rgba(229, 182, 35, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(229, 182, 35, 0.25)'
          }}>
            <Heart size={28} color="#e5b623" fill="#e5b623" fillOpacity={0.6} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="font-serif gradient-gold-text" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                Isa & Victor
              </h1>
              <span className={`badge ${badgeClass}`}>
                {statusText}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Sentinela de Alianca, Homenagens Publicas e Aviso Noturno
            </p>
          </div>
        </div>

        {/* Relogio ao Vivo e Controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)', fontWeight: 700, fontSize: '1.15rem', fontVariantNumeric: 'tabular-nums' }}>
              <Clock size={16} />
              <span>{formattedTime}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
              {formattedDate}
            </span>
          </div>

          {/* Botao de Testar Som */}
          <button
            onClick={handleTestAudio}
            className="btn-secondary"
            title="Testar alarme sonoro do Sentinela"
            style={{ padding: '10px 14px', fontSize: '0.85rem' }}
          >
            <Volume2 size={16} color="var(--gold-primary)" />
            <span className="hide-on-mobile">Som</span>
          </button>

          {/* Permissao de Notificacoes */}
          {notificationStatus !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="btn-secondary"
              title="Ativar notificacoes na tela"
              style={{ padding: '10px 14px', fontSize: '0.85rem', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <Bell size={16} color="#f59e0b" />
              <span className="hide-on-mobile">Ativar Avisos</span>
            </button>
          )}

          {/* Botao Configuracoes */}
          <button
            onClick={onOpenSettings}
            className="btn-secondary"
            title="Configurar datas, limites e contatos"
            style={{ padding: '10px 14px' }}
          >
            <Settings size={18} />
          </button>
        </div>

      </div>
    </header>
  );
}
