import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sentinela2230 from './components/Sentinela2230';
import HomenagensRadar from './components/HomenagensRadar';
import DatasEspeciais from './components/DatasEspeciais';
import SettingsModal from './components/SettingsModal';
import { getSettings, saveSettings, getHomenagens } from './services/storage';
import { Moon, Calendar, LayoutDashboard, Heart, Send } from 'lucide-react';
import InstagramIcon from './components/InstagramIcon';

export default function App() {
  const [settings, setSettings] = useState(getSettings());
  const [homenagens, setHomenagens] = useState(getHomenagens());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'sentinela', 'homenagens', 'datas'

  const handleSaveSettings = (newSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Completo', icon: LayoutDashboard },
    { id: 'sentinela', label: 'Sentinela 22:30', icon: Moon },
    { id: 'homenagens', label: 'Homenagens & Stories', icon: InstagramIcon },
    { id: 'datas', label: 'Datas Sagradas', icon: Calendar }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px 80px 20px' }}>
      
      {/* Header com Relogio ao Vivo e Status */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Barra de Navegacao por Abas */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(229, 182, 35, 0.25) 0%, rgba(244, 63, 94, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isActive
                  ? '1px solid var(--gold-primary)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? 'var(--gold-light)' : 'var(--text-muted)'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--gold-primary)' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Conteudo Principal */}
      <main className="grid-bento">
        
        {/* Aba Dashboard: Exibe todos os 3 pilares de forma harmoniosa */}
        {activeTab === 'dashboard' && (
          <>
            <Sentinela2230
              settings={settings}
            />

            <HomenagensRadar
              homenagens={homenagens}
              onUpdateHomenagens={setHomenagens}
              settings={settings}
            />

            <DatasEspeciais
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </>
        )}

        {/* Aba Sentinela 22:30 Focada */}
        {activeTab === 'sentinela' && (
          <Sentinela2230
            settings={settings}
          />
        )}

        {/* Aba Homenagens & Stories Focada */}
        {activeTab === 'homenagens' && (
          <HomenagensRadar
            homenagens={homenagens}
            onUpdateHomenagens={setHomenagens}
            settings={settings}
          />
        )}

        {/* Aba Datas Sagradas Focada */}
        {activeTab === 'datas' && (
          <DatasEspeciais
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

      </main>

      {/* Modal de Configuracoes */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Rodapé Elegante com Assinatura */}
      <footer style={{
        marginTop: '40px',
        textAlign: 'center',
        padding: '20px',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Heart size={14} color="#f43f5e" fill="#f43f5e" />
          <span>Feito exclusivamente para Victor cuidar, honrar e celebrar a Isa todos os dias.</span>
        </div>
      </footer>

    </div>
  );
}
