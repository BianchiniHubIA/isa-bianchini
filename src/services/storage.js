// Camada de persistencia em localStorage para o ecossistema Isa Bianchini

const SETTINGS_KEY = 'isa_victor_settings_v1';
const HOMENAGENS_KEY = 'isa_victor_homenagens_v1';
const NIGHT_LOGS_KEY = 'isa_victor_night_logs_v1';

export const DEFAULT_SETTINGS = {
  isaPhone: '5562999999999', // Configuravel pelo Victor
  isaInstagram: '@isabianchini',
  weddingDate: '04-04', // 04 de Abril (Confirmado pelo Victor)
  isaBirthday: '',
  homenagemIntervalDays: 10,
  nightLimitHour: 22,
  nightLimitMinute: 30,
  preAlertMinutes: 15, // Alerta previo as 22:15
  soundEnabled: true,
  desktopNotification: true,
  autoOpenWhatsApp: false
};

// Exemplos iniciais para demonstrar a linha do tempo de homenagens
export const SEED_HOMENAGENS = [
  {
    id: 'hom-1',
    date: '2026-10-15',
    category: 'Parceria & Vida',
    title: 'Homenagem aos Bastidores & Fortaleza',
    text: 'A pessoa que segura a minha mao todos os dias e faz tudo valer a pena. Gratidao eterna pela nossa caminhada.',
    instagramLink: 'https://instagram.com',
    notes: 'Post no feed'
  }
];

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Erro ao ler settings:', e);
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(newSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  } catch (e) {
    console.error('Erro ao salvar settings:', e);
  }
}

export function getHomenagens() {
  try {
    const raw = localStorage.getItem(HOMENAGENS_KEY);
    if (!raw) {
      localStorage.setItem(HOMENAGENS_KEY, JSON.stringify(SEED_HOMENAGENS));
      return [...SEED_HOMENAGENS];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao carregar homenagens:', e);
    return [];
  }
}

export function saveHomenagens(list) {
  try {
    localStorage.setItem(HOMENAGENS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Erro ao salvar homenagens:', e);
  }
}

export function addHomenagem(item) {
  const current = getHomenagens();
  const newItem = {
    id: `hom-${Date.now()}`,
    date: item.date || new Date().toISOString().split('T')[0],
    category: item.category || 'Declaracao de Amor',
    title: item.title || 'Homenagem Publica',
    text: item.text || '',
    instagramLink: item.instagramLink || '',
    notes: item.notes || ''
  };
  const updated = [newItem, ...current];
  saveHomenagens(updated);
  return updated;
}

export function deleteHomenagem(id) {
  const current = getHomenagens();
  const updated = current.filter((h) => h.id !== id);
  saveHomenagens(updated);
  return updated;
}

// Obter a data da ultima homenagem feita
export function getLastHomenagemInfo(homenagensList) {
  if (!homenagensList || homenagensList.length === 0) {
    return { lastDate: null, daysAgo: 999, status: 'urgente' };
  }
  
  // Ordenar por data decrescente
  const sorted = [...homenagensList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sorted[0];
  const latestDate = new Date(latest.date + 'T12:00:00');
  const now = new Date();
  const diffMs = now.getTime() - latestDate.getTime();
  const daysAgo = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  return {
    latest,
    daysAgo,
    dateFormatted: latest.date
  };
}

// Registros do Sentinela Noturno 22:30
export function getNightLogs() {
  try {
    const raw = localStorage.getItem(NIGHT_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler night logs:', e);
    return [];
  }
}

export function logNightAlertSent(details) {
  try {
    const logs = getNightLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog = {
      id: `night-${Date.now()}`,
      date: todayStr,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      extendedUntil: details.extendedUntil || '23:30',
      messageType: details.messageType || 'Padrao Carinhosa',
      messageText: details.messageText || '',
      timestamp: Date.now()
    };
    const updated = [newLog, ...logs.filter((l) => l.date !== todayStr)];
    localStorage.setItem(NIGHT_LOGS_KEY, JSON.stringify(updated.slice(0, 30)));
    return newLog;
  } catch (e) {
    console.error('Erro ao salvar night log:', e);
    return null;
  }
}

export function hasSentAlertToday() {
  const logs = getNightLogs();
  const todayStr = new Date().toISOString().split('T')[0];
  return logs.some((l) => l.date === todayStr);
}

// Exportar e importar backup
export function exportAllData() {
  return JSON.stringify({
    settings: getSettings(),
    homenagens: getHomenagens(),
    nightLogs: getNightLogs(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

export function importAllData(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    if (data.homenagens) localStorage.setItem(HOMENAGENS_KEY, JSON.stringify(data.homenagens));
    if (data.nightLogs) localStorage.setItem(NIGHT_LOGS_KEY, JSON.stringify(data.nightLogs));
    return true;
  } catch (e) {
    console.error('Erro ao importar dados:', e);
    return false;
  }
}
