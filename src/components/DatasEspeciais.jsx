import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Sparkles, Gift, Clock, AlertCircle, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSacredDatesOverview, getAlertAdvice } from '../services/datesCalculator';

export default function DatasEspeciais({ settings, onOpenSettings }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Atualizar a cada minuto
    return () => clearInterval(timer);
  }, []);

  const overview = getSacredDatesOverview(settings, now);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e5b623', '#fcd34d', '#f43f5e', '#38bdf8']
      });
    } catch (e) {
      console.warn('Erro ao disparar confete:', e);
    }
  };

  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return '';
    return dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="bento-card" style={{ padding: '28px', gridColumn: 'span 12' }}>
      
      {/* Cabecalho da Secao */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(229, 182, 35, 0.15)',
            border: '1px solid rgba(229, 182, 35, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} color="var(--gold-primary)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="font-serif gradient-gold-text" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                Radar de Datas Sagradas
              </h2>
              <span className="badge badge-gold">
                Alianca & Celebracao
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Dia das Maes, Dia das Mulheres e Data de Casamento com regua de avisos previos.
            </p>
          </div>
        </div>

        <button
          onClick={triggerConfetti}
          className="btn-gold"
          style={{ fontSize: '0.85rem', padding: '10px 18px' }}
        >
          <Sparkles size={16} />
          <span>Celebrar Nosso Amor</span>
        </button>
      </div>

      {/* Grid Bento das 3 Datas Principais + Aniversario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* 1. Dia das Maes */}
        {(() => {
          const item = overview.mothersDay;
          const advice = getAlertAdvice(item.remaining.days, item.remaining.isToday);
          return (
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(229, 182, 35, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={20} color="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.title}
                    </h3>
                  </div>
                  <span className={`badge ${advice.badgeColor}`}>
                    {advice.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  {item.subtitle}
                </p>
                <div style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatDateDisplay(item.targetDate)}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Contagem Regressiva:
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {item.remaining.isToday ? 'E HOJE!' : `${item.remaining.days} dias e ${item.remaining.hours}h`}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  {advice.advice}
                </p>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Dica: Flores, cafe na cama e um cartao escrito a mao com palavras autenticas.
              </div>
            </div>
          );
        })()}

        {/* 2. Dia Internacional da Mulher */}
        {(() => {
          const item = overview.womensDay;
          const advice = getAlertAdvice(item.remaining.days, item.remaining.isToday);
          return (
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(229, 182, 35, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="var(--gold-primary)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.title}
                    </h3>
                  </div>
                  <span className={`badge ${advice.badgeColor}`}>
                    {advice.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  {item.subtitle}
                </p>
                <div style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {formatDateDisplay(item.targetDate)}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Contagem Regressiva:
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                  {item.remaining.isToday ? 'E HOJE!' : `${item.remaining.days} dias e ${item.remaining.hours}h`}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  {advice.advice}
                </p>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Dica: Reconhecimento publico no Instagram, arranjo nobre e momento especial a dois.
              </div>
            </div>
          );
        })()}

        {/* 3. Data de Casamento & Uniao (04 de Abril) */}
        {(() => {
          const wedding = overview.wedding;
          const advice = getAlertAdvice(wedding.remaining.days, wedding.remaining.isToday);
          return (
            <div style={{
              background: 'linear-gradient(135deg, rgba(229, 182, 35, 0.16) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(229, 182, 35, 0.45)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              boxShadow: '0 0 25px rgba(229, 182, 35, 0.18)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="var(--gold-primary)" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                        Dia da Nossa Uniao
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                        {wedding.hasOriginYear
                          ? `${wedding.bodasName} (${wedding.yearsCompleted} Anos)`
                          : '04 de Abril (Data Sagrada)'}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${advice.badgeColor}`}>
                    {advice.label}
                  </span>
                </div>
                <div style={{ fontSize: '1.05rem', color: 'var(--gold-light)', fontWeight: 700, marginTop: '6px', fontVariantNumeric: 'tabular-nums' }}>
                  04 de Abril ({formatDateDisplay(wedding.targetDate)})
                </div>
                {!wedding.hasOriginYear && (
                  <button
                    onClick={onOpenSettings}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold-dark)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: '4px 0',
                      textDecoration: 'underline'
                    }}
                  >
                    Definir o ano de inicio nas configuracoes para calcular as bodas
                  </button>
                )}
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(229, 182, 35, 0.2)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Contagem Regressiva Sagrada:
                </span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)', marginTop: '2px' }}>
                  {wedding.remaining.isToday ? 'HOJE E O NOSSO DIA!' : `${wedding.remaining.days} dias e ${wedding.remaining.hours}h`}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  {advice.advice}
                </p>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Dica: Viagem ou jantar exclusivo a dois, joia comemorativa e renovacao de votos.
              </div>
            </div>
          );
        })()}

      </div>

      {/* Regua Sagrada de Avisos Previos */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '18px 22px'
      }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
          Regua de Planejamento Antecipado (Para Voce NUNCA Falhar):
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ borderLeft: '2px solid #38bdf8', paddingLeft: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>30 DIAS ANTES</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Sondar desejos, destinos de viagem ou surpresas especiais que exigem planejamento.
            </p>
          </div>

          <div style={{ borderLeft: '2px solid #e5b623', paddingLeft: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#e5b623', fontWeight: 700 }}>15 DIAS ANTES</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Fazer reservas de restaurantes renomados e comprar presentes com entrega.
            </p>
          </div>

          <div style={{ borderLeft: '2px solid #f59e0b', paddingLeft: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>7 DIAS ANTES</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Encomendar flores preferidas, doces nobres e revisar todos os detalhes.
            </p>
          </div>

          <div style={{ borderLeft: '2px solid #f43f5e', paddingLeft: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700 }}>1 DIA ANTES</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Vespera sagrada: deixar tudo pronto para acordar e comemorar logo cedo.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
