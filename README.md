# Sentinela do Amor: Isa & Victor

Sistema integrado de protecao, carinho e compromisso para Victor nunca falhar nos 3 pilares vitais com a Isa:

1. **Homenagens Publicas & Stories no Instagram**:
   - Cadencia periodica para nunca passar muito tempo sem fazer uma declaracao publica para ela (o que ela gosta e valoriza).
   - Raspador de Stories/Reels (via yt-dlp): permite colar qualquer link do Instagram ou TikTok, baixar o conteudo, gerar texto de homenagem com o @ dela e publicar ou baixar com 1 clique.
   - Banco refinado de ideias e roteiros categorizados com legendas completas e hashtags elegantes.

2. **Regra de Ouro das 22:30 (Sentinela Noturno do Computador)**:
   - Monitoramento em tempo real no PC e no PWA.
   - As 22:15: Alerta sonoro suave e aviso previo ("Faltam 15 minutos").
   - As 22:30: Alerta sonoro critico e pop-up no Windows ("Nao passe das 22:30 sem avisar a Isa!").
   - Botao de 1 toque para enviar WhatsApp pronto para ela com o horario previsto de extensao (23:00, 23:30, 00:00).
   - Registro historico diario do cumprimento do compromisso.

3. **Radar de Datas Sagradas**:
   - **Dia da Nossa Uniao**: 04 de Abril (calculo de bodas e contagem regressiva precisa em dias, horas e minutos).
   - **Dia das Maes**: Calculo perpetuo automatico para o 2o domingo de maio de qualquer ano.
   - **Dia Internacional da Mulher**: 08 de Marco.
   - **Aniversario da Isa**: Configuravel com idade e contagem regressiva.
   - Regua de planejamento antecipado: 30 dias, 15 dias, 7 dias e 1 dia antes.

---

## Como Iniciar o Sistema

### No Computador (Windows):
Basta dar um duplo-clique no arquivo:
`iniciar_sentinela.bat`

Ele inicializara:
- O Backend FastAPI na porta 8088
- O Frontend PWA na porta 5173
- O Sentinela Desktop Windows em segundo plano
- Abrira o painel no navegador automaticamente

### No Celular (PWA Instalavel):
1. No celular conectado na mesma rede Wi-Fi, abra o endereco IP do computador (ex: `http://192.168.x.x:5173/`).
2. No navegador (Safari no iPhone ou Chrome no Android), toque em **Compartilhar** ou no menu de 3 pontinhos.
3. Selecione **Adicionar a Tela de Inicio**.
4. O Sentinela ficara como um aplicativo nativo no celular, com icone dourado de aliancas e funcionamento offline.

---

## Integracao de API do Instagram (Conta @victorbianchini.ia)
- O backend conecta-se a API oficial do Instagram da Meta usando o token `META_ACCESS_TOKEN` configurado no ecossistema ALFRED.
- Permite raspar videos ou fotos de posts/stories publicos e compor homenagens com mencao direta ao perfil da Isa.

---

*Configurado e integrado com a memoria de longo prazo do Alfred em alfred_brain.db.*
