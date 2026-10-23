import React, { useState } from 'react';
import { X, Save, Phone, Calendar, Clock, Volume2, Download, Upload, Check } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { exportAllData, importAllData } from '../services/storage';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...settings });
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); // Criacao temporaria de link para download
    link.href = url;
    link.download = `backup_isa_victor_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importAllData(content);
        if (ok) {
          setImportStatus('Backup restaurado com sucesso! Atualizando pagina...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('Arquivo de backup invalido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        
        {/* Cabecalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 className="font-serif gradient-gold-text" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Configuracoes do Sentinela
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
              Ajuste as datas sagradas, contatos da Isa e horarios de alerta
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Grupo 1: Contatos da Isa */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(229, 182, 35, 0.15)' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} />
              <span>Contatos & Redes da Isa</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  WhatsApp da Isa (com DDI e DDD):
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: 5562999999999"
                  value={formData.isaPhone || ''}
                  onChange={(e) => handleChange('isaPhone', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Instagram da Isa (para marcar nos Stories):
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: @isabianchini"
                  value={formData.isaInstagram || ''}
                  onChange={(e) => handleChange('isaInstagram', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grupo 2: Datas Sagradas */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(229, 182, 35, 0.15)' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              <span>Datas de Alianca & Aniversarios</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Data de Casamento (Pegar com a Isa):
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.weddingDate || ''}
                  onChange={(e) => handleChange('weddingDate', e.target.value)}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-dark)', marginTop: '2px', display: 'block' }}>
                  Calcula automaticamente os anos e o nome das bodas.
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Aniversario da Isa:
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.isaBirthday || ''}
                  onChange={(e) => handleChange('isaBirthday', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Grupo 3: Sentinela Noturno 22:30 */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(229, 182, 35, 0.15)' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} />
              <span>Sentinela Noturno do Computador</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Horario Limite (Hora):
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  className="input-field"
                  value={formData.nightLimitHour ?? 22}
                  onChange={(e) => handleChange('nightLimitHour', parseInt(e.target.value, 10))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Horario Limite (Minuto):
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="input-field"
                  value={formData.nightLimitMinute ?? 30}
                  onChange={(e) => handleChange('nightLimitMinute', parseInt(e.target.value, 10))}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Aviso Previo (Minutos antes):
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  className="input-field"
                  value={formData.preAlertMinutes ?? 15}
                  onChange={(e) => handleChange('preAlertMinutes', parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>

          {/* Grupo 4: Frequencia de Homenagens & Sons */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(229, 182, 35, 0.15)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Intervalo Maximo de Homenagens (Dias):
                </label>
                <input
                  type="number"
                  min="3"
                  max="30"
                  className="input-field"
                  value={formData.homenagemIntervalDays ?? 10}
                  onChange={(e) => handleChange('homenagemIntervalDays', parseInt(e.target.value, 10))}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', display: 'block' }}>
                  Avisa quando passar deste periodo sem homenagea-la publicamente.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <input
                  type="checkbox"
                  id="soundCheck"
                  checked={formData.soundEnabled ?? true}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                />
                <label htmlFor="soundCheck" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Ativar sons de alerta do Sentinela
                </label>
              </div>
            </div>
          </div>

          {/* Backup e Restauracao */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleExport}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '8px 12px' }}
              >
                <Download size={14} />
                <span>{copiedStatus ? 'Backup Baixado!' : 'Exportar Backup'}</span>
              </button>

              <label className="btn-secondary" style={{ fontSize: '0.78rem', padding: '8px 12px', cursor: 'pointer' }}>
                <Upload size={14} />
                <span>Restaurar Backup</span>
                <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-gold"
              >
                <Save size={16} />
                <span>Salvar Configuracoes</span>
              </button>
            </div>
          </div>

          {importStatus && (
            <p style={{ color: 'var(--gold-light)', fontSize: '0.82rem', textAlign: 'center' }}>
              {importStatus}
            </p>
          )}

        </form>

      </div>
    </div>
  );
}
