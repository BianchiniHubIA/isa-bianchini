// Calculadora perpetua de datas sagradas para o casal Isa e Victor

export const BODAS_MAP = {
  1: 'Bodas de Papel',
  2: 'Bodas de Algodao',
  3: 'Bodas de Trigo',
  4: 'Bodas de Flores e Frutas',
  5: 'Bodas de Madeira',
  6: 'Bodas de Acucar ou Perfume',
  7: 'Bodas de Latao ou La',
  8: 'Bodas de Barro ou Papoula',
  9: 'Bodas de Ceramica',
  10: 'Bodas de Estanho',
  11: 'Bodas de Aco',
  12: 'Bodas de Seda',
  13: 'Bodas de Linho',
  14: 'Bodas de Marfim',
  15: 'Bodas de Cristal',
  20: 'Bodas de Porcelana',
  25: 'Bodas de Prata',
  30: 'Bodas de Perola',
  35: 'Bodas de Coral',
  40: 'Bodas de Esmeralda',
  50: 'Bodas de Ouro'
};

export function getBodasName(years) {
  if (BODAS_MAP[years]) {
    return BODAS_MAP[years];
  }
  return `Bodas de ${years} Anos de Uniao`;
}

// Calcula o segundo domingo de maio para qualquer ano
export function getMothersDay(year) {
  const firstDay = new Date(year, 4, 1); // 1 de Maio
  const dayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  
  let firstSundayDate = 1;
  if (dayOfWeek !== 0) {
    firstSundayDate = 1 + (7 - dayOfWeek);
  }
  
  const secondSundayDate = firstSundayDate + 7;
  return new Date(year, 4, secondSundayDate, 0, 0, 0, 0);
}

// Proxima data anual (se a data deste ano ja passou, calcula para o proximo ano)
export function getNextAnnualDate(monthIndex, dayNumber, now = new Date()) {
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, monthIndex, dayNumber, 0, 0, 0, 0);
  
  // Se ja passou hoje (considerando virada do dia)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (target < todayStart) {
    target = new Date(currentYear + 1, monthIndex, dayNumber, 0, 0, 0, 0);
  }
  return target;
}

// Informacoes detalhadas de contagem regressiva
export function calculateDaysRemaining(targetDate, now = new Date()) {
  const targetTime = targetDate.getTime();
  const nowTime = now.getTime();
  const diffMs = targetTime - nowTime;
  
  if (diffMs <= 0) {
    // Verificar se e hoje
    const isToday = targetDate.getFullYear() === now.getFullYear() &&
                    targetDate.getMonth() === now.getMonth() &&
                    targetDate.getDate() === now.getDate();
    if (isToday) {
      return { days: 0, hours: 0, minutes: 0, isToday: true, isPast: false };
    }
    return { days: 0, hours: 0, minutes: 0, isToday: false, isPast: true };
  }
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  return { days, hours, minutes, isToday: false, isPast: false };
}

// Informacoes completas de todas as datas sagradas
export function getSacredDatesOverview(settings, now = new Date()) {
  const currentYear = now.getFullYear();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 1. Dia das Maes (dinamico: 2o domingo de maio)
  let mothersDayTarget = getMothersDay(currentYear);
  if (mothersDayTarget < todayStart) {
    mothersDayTarget = getMothersDay(currentYear + 1);
  }
  const mothersDayRemaining = calculateDaysRemaining(mothersDayTarget, now);
  
  // 2. Dia Internacional da Mulher (08 de Marco)
  const womensDayTarget = getNextAnnualDate(2, 8, now); // Marco e indice 2
  const womensDayRemaining = calculateDaysRemaining(womensDayTarget, now);
  
  // 3. Data de Casamento & Uniao (04 de Abril)
  let weddingInfo = null;
  const weddingRaw = settings.weddingDate || '04-04'; // Padrao definido pelo Victor: 04 de Abril
  
  let origYear = null;
  let origMonth = 3; // Abril e mes de indice 3 (0-indexed)
  let origDay = 4;   // 04 de Abril

  if (weddingRaw.includes('-')) {
    const parts = weddingRaw.split('-');
    if (parts.length === 3) {
      origYear = parseInt(parts[0], 10);
      origMonth = parseInt(parts[1], 10) - 1;
      origDay = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
      origMonth = parseInt(parts[0], 10) - 1;
      origDay = parseInt(parts[1], 10);
    }
  }

  let nextAnniversary = new Date(currentYear, origMonth, origDay, 0, 0, 0, 0);
  let yearsCompleted = origYear ? currentYear - origYear : null;

  if (nextAnniversary < todayStart) {
    nextAnniversary = new Date(currentYear + 1, origMonth, origDay, 0, 0, 0, 0);
    if (origYear) {
      yearsCompleted = currentYear + 1 - origYear;
    }
  }

  const remaining = calculateDaysRemaining(nextAnniversary, now);
  const bodas = yearsCompleted ? getBodasName(yearsCompleted) : 'Aniversario de Uniao';

  weddingInfo = {
    configured: true,
    dayFormatted: '04 de Abril',
    originalDate: settings.weddingDate || `${currentYear}-04-04`,
    hasOriginYear: Boolean(origYear),
    originYear: origYear,
    targetDate: nextAnniversary,
    remaining,
    yearsCompleted,
    bodasName: bodas
  };
  
  // 4. Aniversario da Isa
  let birthdayInfo = null;
  if (settings.isaBirthday) {
    const parts = settings.isaBirthday.split('-');
    if (parts.length === 3) {
      const origYear = parseInt(parts[0], 10);
      const origMonth = parseInt(parts[1], 10) - 1;
      const origDay = parseInt(parts[2], 10);
      
      let nextBday = new Date(currentYear, origMonth, origDay, 0, 0, 0, 0);
      let age = currentYear - origYear;
      if (nextBday < todayStart) {
        nextBday = new Date(currentYear + 1, origMonth, origDay, 0, 0, 0, 0);
        age = currentYear + 1 - origYear;
      }
      
      birthdayInfo = {
        configured: true,
        originalDate: settings.isaBirthday,
        targetDate: nextBday,
        remaining: calculateDaysRemaining(nextBday, now),
        turningAge: age
      };
    }
  }
  
  return {
    mothersDay: {
      title: 'Dia das Maes',
      subtitle: 'Segundo domingo de maio (calculo perpetuo)',
      targetDate: mothersDayTarget,
      remaining: mothersDayRemaining,
      icon: 'HeartHandshake'
    },
    womensDay: {
      title: 'Dia Internacional da Mulher',
      subtitle: '08 de Marco (homenagem especial e flores)',
      targetDate: womensDayTarget,
      remaining: womensDayRemaining,
      icon: 'Sparkles'
    },
    wedding: weddingInfo,
    birthday: birthdayInfo
  };
}

// Mensagem de alerta e recomendacao conforme proximidade de dias
export function getAlertAdvice(daysRemaining, isToday) {
  if (isToday) {
    return {
      status: 'hoje',
      label: 'E HOJE!',
      badgeColor: 'bg-rose-500 text-white',
      advice: 'Dia de celebrar com presenca, flores, abraco apertado e palavras do coracao!'
    };
  }
  if (daysRemaining <= 1) {
    return {
      status: 'urgente',
      label: 'Amanha!',
      badgeColor: 'bg-rose-500 text-white',
      advice: 'Vespera sagrada. Confira se as surpresas e cartoes estao prontos para amanha cedo.'
    };
  }
  if (daysRemaining <= 3) {
    return {
      status: 'urgente',
      label: `Faltam ${daysRemaining} dias`,
      badgeColor: 'bg-amber-500 text-black',
      advice: 'Fase final. Garanta as flores, encomende os doces prediletos e organize a agenda.'
    };
  }
  if (daysRemaining <= 7) {
    return {
      status: 'atencao',
      label: `Faltam ${daysRemaining} dias`,
      badgeColor: 'bg-amber-500/20 text-amber-300',
      advice: 'Uma semana antes. Reserve o restaurante favorito e alinhe os detalhes do presente.'
    };
  }
  if (daysRemaining <= 15) {
    return {
      status: 'planejamento',
      label: `Faltam ${daysRemaining} dias`,
      badgeColor: 'bg-blue-500/20 text-blue-300',
      advice: '15 dias de antecedencia. Hora ideal para comprar presentes que exigem entrega ou confeccao.'
    };
  }
  return {
    status: 'tranquilo',
    label: `Faltam ${daysRemaining} dias`,
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
    advice: 'No radar. Tempo seguro para planejar com calma e carinho.'
  };
}
