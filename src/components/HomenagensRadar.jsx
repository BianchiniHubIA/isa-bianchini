import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, RefreshCw, Send, Heart, Link, Calendar, Plus, Trash2, Film, Image as ImageIcon } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { HOMENAGEM_TEMPLATES, getRandomHomenagemIdea } from '../services/homenagensIdeas';
import { getLastHomenagemInfo, addHomenagem, deleteHomenagem } from '../services/storage';

export default function HomenagensRadar({ homenagens, onUpdateHomenagens, settings }) {
  const [currentIdea, setCurrentIdea] = useState(getRandomHomenagemIdea());
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados da raspagem de Story
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);
  const [scrapeError, setScrapeError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  // Formulario manual
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('Feed Instagram');
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formLink, setFormLink] = useState('');

  const lastInfo = getLastHomenagemInfo(homenagens);
  const maxDays = settings.homenagemIntervalDays ?? 10;
  const daysAgo = lastInfo.daysAgo;

  let statusBadge = 'badge-emerald';
  let statusText = `Em dia (ha ${daysAgo} dias)`;
  if (daysAgo > maxDays) {
    statusBadge = 'badge-rose';
    statusText = `Urgente: Faz ${daysAgo} dias sem postar!`;
  } else if (daysAgo >= maxDays - 3) {
    statusBadge = 'badge-amber';
    statusText = `Planejar: Faz ${daysAgo} dias da ultima`;
  }

  const handleNextIdea = () => {
    setCurrentIdea(getRandomHomenagemIdea());
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const updated = addHomenagem({
      date: formDate,
      category: formCategory,
      title: formTitle || 'Homenagem Publica no Instagram',
      text: formText,
      instagramLink: formLink,
      notes: 'Registrado pelo Victor'
    });
    onUpdateHomenagens(updated);
    setShowAddModal(false);
    setFormTitle('');
    setFormText('');
    setFormLink('');
  };

  const handleDelete = (id) => {
    const updated = deleteHomenagem(id);
    onUpdateHomenagens(updated);
  };

  // Funcao de Raspagem via Backend Local (FastAPI na porta 8088)
  const handleScrapeStory = async () => {
    if (!scrapeUrl.trim()) return;
    setIsScraping(true);
    setScrapeError('');
    setScrapeResult(null);
    setPublishMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8088/api/scrape-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: scrapeUrl.trim(),
          isa_instagram: settings.isaInstagram || '@isabianchini'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Falha ao raspar a midia do link fornecido.');
      }

      const data = await response.json();
      setScrapeResult(data);
    } catch (err) {
      setScrapeError(
        'Backend local nao conectado ou link requer login. Voce pode iniciar o backend com "python backend_server.py" ou usar os modelos de homenagem prontos abaixo.'
      );
    } finally {
      setIsScraping(false);
    }
  };

  const handlePostStoryApi = async () => {
    if (!scrapeResult) return;
    setIsPublishing(true);
    setPublishMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8088/api/post-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_url: scrapeResult.media_url,
          caption: scrapeResult.suggested_caption
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setPublishMessage('Story publicado com sucesso no Instagram oficial!');
      } else {
        setPublishMessage(resData.message || 'Midia pronta para postagem manual.');
      }
    } catch (e) {
      setPublishMessage('Erro ao comunicar com a API do Instagram.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="bento-card" style={{ padding: '28px', gridColumn: 'span 12' }}>
      
      {/* Cabecalho do Radar de Homenagens */}
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
            <InstagramIcon size={24} color="var(--gold-primary)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="font-serif gradient-gold-text" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                Homenagens Publicas & Stories
              </h2>
              <span className={`badge ${statusBadge}`}>
                {statusText}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Homenagear a Isa em publico periodicamente, reconhecendo o valor e a forca dela.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>Registrar Post Realizado</span>
        </button>
      </div>

      {/* Caixa de Raspagem de Stories e Reels */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.5) 100%)',
        border: '1px solid rgba(229, 182, 35, 0.22)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Film size={18} color="var(--gold-light)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)' }}>
            Raspar Conteudo de Alguem para Subir Story em Homenagem a Isa
          </h3>
        </div>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Cole o link de um Story, Reel, Post ou TikTok inspirador. O sistema raspa o video/foto e gera a mensagem marcando o Instagram dela ({settings.isaInstagram || '@isabianchini'}).
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Cole o link do Instagram Story, Reel ou TikTok aqui..."
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            style={{ flex: 1, minWidth: '260px' }}
          />
          <button
            onClick={handleScrapeStory}
            disabled={isScraping || !scrapeUrl.trim()}
            className="btn-gold"
            style={{ opacity: isScraping ? 0.7 : 1 }}
          >
            {isScraping ? <RefreshCw size={16} className="spin" /> : <Sparkles size={16} />}
            <span>{isScraping ? 'Raspando...' : 'Raspar Midia'}</span>
          </button>
        </div>

        {scrapeError && (
          <p style={{ color: '#fda4af', fontSize: '0.82rem', marginTop: '10px' }}>
            {scrapeError}
          </p>
        )}

        {/* Resultado da Raspagem */}
        {scrapeResult && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(229, 182, 35, 0.3)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                width: '110px',
                height: '140px',
                background: '#0b0f19',
                borderRadius: '10px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {scrapeResult.file_type === 'video' ? (
                  <video src={scrapeResult.media_url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={scrapeResult.media_url} alt="Midia raspada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: '240px' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  Midia pronta para os Stories!
                </span>
                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600, margin: '6px 0' }}>
                  Mensagem gerada com mencao a Isa:
                </p>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontStyle: 'italic',
                  fontSize: '0.86rem',
                  color: 'var(--gold-light)',
                  borderLeft: '3px solid var(--gold-primary)'
                }}>
                  "{scrapeResult.suggested_caption}"
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <button
                    onClick={handlePostStoryApi}
                    disabled={isPublishing}
                    className="btn-gold"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    <Send size={15} />
                    <span>{isPublishing ? 'Publicando...' : 'Publicar via API do Instagram'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyText(scrapeResult.suggested_caption, 'scraped-caption')}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    {copiedId === 'scraped-caption' ? <Check size={15} color="#34d399" /> : <Copy size={15} />}
                    <span>{copiedId === 'scraped-caption' ? 'Texto Copiado!' : 'Copiar Legenda'}</span>
                  </button>

                  <a
                    href={scrapeResult.media_url}
                    download
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '8px 14px', textDecoration: 'none' }}
                  >
                    <Download size={15} />
                    <span>Baixar Arquivo</span>
                  </a>
                </div>

                {publishMessage && (
                  <p style={{ color: 'var(--gold-light)', fontSize: '0.8rem', marginTop: '8px' }}>
                    {publishMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gerador de Ideias e Roteiros de Homenagem (Feed/Stories) */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.7)',
        border: '1px solid rgba(229, 182, 35, 0.15)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold-primary)', fontWeight: 700 }}>
              Ideia Inspiradora de Homenagem Publica:
            </span>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700, marginTop: '2px' }}>
              {currentIdea.title}
            </h3>
          </div>

          <button
            onClick={handleNextIdea}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <RefreshCw size={14} />
            <span>Gerar Outra Ideia</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Formato Recomendado:</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginTop: '2px' }}>{currentIdea.format}</p>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Sugestao de Foto / Momento:</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{currentIdea.photoTip}</p>
          </div>
        </div>

        {/* Legenda Pronta */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderLeft: '3px solid var(--gold-primary)',
          borderRadius: '4px 10px 10px 4px',
          padding: '16px',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          color: '#f1f5f9',
          fontStyle: 'italic',
          marginBottom: '14px'
        }}>
          "{currentIdea.caption}"
          <div style={{ marginTop: '8px', color: 'var(--gold-dark)', fontSize: '0.8rem', fontStyle: 'normal' }}>
            {currentIdea.tags}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleCopyText(`${currentIdea.caption}\n\n${currentIdea.tags}`, 'idea-copy')}
            className="btn-gold"
            style={{ fontSize: '0.88rem', padding: '10px 18px' }}
          >
            {copiedId === 'idea-copy' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedId === 'idea-copy' ? 'Legenda Copiada!' : 'Copiar Legenda Completa'}</span>
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.88rem', textDecoration: 'none' }}
          >
            <InstagramIcon size={16} />
            <span>Abrir Instagram</span>
          </a>
        </div>
      </div>

      {/* Linha do Tempo de Homenagens Ja Feitas */}
      <div>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '12px' }}>
          Historico de Homenagens Postadas:
        </h4>

        {homenagens.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Nenhuma homenagem registrada ainda. Use o botao "Registrar Post Realizado" para adicionar a primeira!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {homenagens.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Postado em {item.date}
                    </span>
                  </div>
                  <h5 style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600 }}>
                    {item.title}
                  </h5>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                    "{item.text}"
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                  title="Excluir do historico"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Registro Manual de Post */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="font-serif gradient-gold-text" style={{ fontSize: '1.25rem', marginBottom: '14px' }}>
              Registrar Homenagem Publica Realizada
            </h3>
            <form onSubmit={handleSaveManual} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Data da Postagem:
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Formato / Onde Postou:
                </label>
                <select
                  className="input-field"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  <option value="Feed Instagram">Feed Instagram</option>
                  <option value="Stories Instagram">Stories Instagram</option>
                  <option value="Reels">Reels</option>
                  <option value="Carrossel">Carrossel de Fotos</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Titulo / Assunto:
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Foto do almoco juntos, foto dela sorrindo..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Legenda / Mensagem Utilizada:
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Texto ou palavras que voce dedicou a ela..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-gold">
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
