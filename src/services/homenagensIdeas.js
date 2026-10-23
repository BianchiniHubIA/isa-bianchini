// Banco refinado de ideias e roteiros para homenagens publicas no Instagram

export const HOMENAGEM_TEMPLATES = [
  {
    id: 'idea-1',
    category: 'Parceria & Bastidores',
    title: 'O porto seguro dos bastidores',
    format: 'Feed (Foto espontanea do casal ou carrossel)',
    photoTip: 'Uma foto espontanea de voces dois trabalhando ou conversando em um momento simples do dia a dia.',
    musicTip: 'Musica acustica suave ou a cancao favorita do casal',
    caption: `Quem ve as conquistas de fora nem imagina onde tudo realmente comeca: no nosso lar e na forca dessa mulher incrivel. Isa, voce e o meu porto seguro, a pessoa que equilibra os meus dias e torna qualquer desafio pequeno. Obrigado por ser essa parceira leal, inteligente e maravilhosa em cada detalhe da nossa caminhada. Te amo profundamente!`,
    tags: '#AmorDaMinhaVida #Parceria #EueEla #MinhaMulher'
  },
  {
    id: 'idea-2',
    category: 'Beleza & Admiracao',
    title: 'O brilho que ilumina qualquer lugar',
    format: 'Feed ou Stories em destaque',
    photoTip: 'Uma foto dela arrumada para sair ou sorrindo em um dia especial.',
    musicTip: 'Uma cancao romantica contemporanea com piano ou voz',
    caption: `Olho para essa mulher e so sinto orgulho e admiracao. Isa, a sua forca, a sua elegancia e o seu coracao puro sao a minha maior inspiracao diária. Ter voce ao meu lado e o maior privilegio da minha vida. Voce e linda em todos os sentidos possiveis!`,
    tags: '#MinhaEsposa #AmorReal #Gratidao'
  },
  {
    id: 'idea-3',
    category: 'Alianca & Eternidade',
    title: 'A nossa escolha diaria',
    format: 'Feed com foto da alianca ou abraço',
    photoTip: 'Close das maos dadas ou um abraco sincero olhando nos olhos.',
    musicTip: 'Trilha instrumental emocionante ou indie acustico',
    caption: `O amor nao e sorte, e uma construcao consciente e cheia de carinho todos os dias. Estar contigo, Isa, e ter a certeza de que fiz a melhor escolha da minha vida. Obrigado por cuidar de nos, pelo seu sorriso que desliga qualquer cansaco e por ser a minha companheira de destino.`,
    tags: '#Alianca #Familia #Cumplicidade #TeAmo'
  },
  {
    id: 'idea-4',
    category: 'Espontanea & Leve',
    title: 'A alegria dos momentos simples',
    format: 'Stories ou Carrossel de 2 fotos',
    photoTip: 'Um momento engracado ou descontraido de voces em um cafe, almoco ou passeio.',
    musicTip: 'Batida leve e ensolarada',
    caption: `Passando pelo feed de voces so para lembrar o quanto essa mulher e especial para mim. Os melhores momentos da minha semana sao os mais simples, quando estou ao seu lado dando risada de bobeiras. Minha parceira de risadas e de vida.`,
    tags: '#MomentosNossos #VidaReal #Cumplicidade'
  },
  {
    id: 'idea-5',
    category: 'Reconhecimento Publico',
    title: 'Declaracao publica de orgulho',
    format: 'Feed com texto emotivo',
    photoTip: 'Uma foto marcante dela em um evento, viagem ou momento vitorioso.',
    musicTip: 'Sinfonica leve ou cancao classica de amor',
    caption: `Eu faco questao de dizer publicamente: tenho a mulher mais incrivel deste mundo ao meu lado. Isa, sua dedicacao, sua inteligencia e seu afeto transformam tudo ao redor. Nao existe vitoria minha que nao tenha a sua presenca e a sua forca. Minha eterna admiracao e o meu amor incondicional sao seus.`,
    tags: '#Orgulho #MinhaMulher #AmorMaior'
  },
  {
    id: 'idea-6',
    category: 'Maternidade & Cuidado',
    title: 'A luz do nosso lar',
    format: 'Feed ou Reels com colagem carinhosa',
    photoTip: 'Foto dela cuidando dos detalhes da casa ou com a familia.',
    musicTip: 'Cancao suave sobre acolhimento e lar',
    caption: `A alma da nossa casa tem nome: Isa. A forma como voce cuida, protege e preenche os nossos espacos com carinho e algo raro e divino. Obrigado por fazer da nossa uniao o lugar mais seguro do mundo. Te amo demais!`,
    tags: '#NossoLar #AmorVerdadeiro #VidaCompartilhada'
  }
];

export function getRandomHomenagemIdea() {
  const index = Math.floor(Math.random() * HOMENAGEM_TEMPLATES.length);
  return HOMENAGEM_TEMPLATES[index];
}
