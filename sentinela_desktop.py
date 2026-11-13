"""
Sentinela Desktop Windows: Guardiao Noturno das 22:30 para Victor Bianchini.
Funciona acionado pelo Agendador de Tarefas do Windows (Task Scheduler) ou em segundo plano.
Consumo em repouso: ZERO MB de RAM (acorda pontualmente as 22:15 e 22:30 e finaliza).

Avisos:
1. Toca alarme sonoro na maquina.
2. Abre pop-up na frente da tela.
3. Envia alerta no WhatsApp PESSOAL do Victor (para que ele fale com a Isa).
4. Envia alerta no Telegram pessoal do Victor via Alfred Bot.
"""

import os
import sys
import time
import json
import urllib.parse
import webbrowser
import requests
from datetime import datetime

CONFIG_FILE = os.path.join(os.path.dirname(__file__), "sentinela_config.json")
ALFRED_ENV_FILE = "E:/REPOSITORIOS/ALFRED/.env"

DEFAULT_CONFIG = {
    "isa_phone": "5562999999999",
    "victor_phone": "5562999999999",
    "callmebot_apikey": "", # Se preenchido, manda WhatsApp pessoal direto
    "telegram_enabled": True,
    "sound_enabled": True,
    "night_limit_hour": 22,
    "night_limit_minute": 30,
    "pre_alert_minute": 15
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return {**DEFAULT_CONFIG, **json.load(f)}
        except Exception:
            pass
    return DEFAULT_CONFIG

def get_alfred_telegram_credentials():
    """Recupera credenciais do bot do Telegram ja existentes no ALFRED."""
    token = ""
    chat_id = ""
    if os.path.exists(ALFRED_ENV_FILE):
        try:
            with open(ALFRED_ENV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("TELEGRAM_BOT_TOKEN="):
                        token = line.split("=", 1)[1].strip().strip('"').strip("'")
                    elif line.startswith("TELEGRAM_CHAT_ID="):
                        chat_id = line.split("=", 1)[1].strip().strip('"').strip("'")
        except Exception:
            pass
    return token, chat_id

def send_alert_to_victor_phone(message, config):
    """Envia alerta no WhatsApp pessoal do Victor (via CallMeBot ou Evolution)."""
    phone = config.get("victor_phone", "").replace("+", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
    apikey = config.get("callmebot_apikey", "").strip()

    if phone and apikey:
        try:
            encoded_msg = urllib.parse.quote(message)
            url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={encoded_msg}&apikey={apikey}"
            requests.get(url, timeout=6)
            print("[OK] Alerta enviado para o WhatsApp pessoal do Victor via CallMeBot.")
        except Exception as e:
            print(f"Erro ao enviar WhatsApp pessoal: {e}")

def send_alert_to_victor_telegram(message):
    """Envia notificacao no Telegram do Victor usando o bot do Alfred."""
    token, chat_id = get_alfred_telegram_credentials()
    if token and chat_id:
        try:
            url = f"https://api.telegram.org/bot{token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "HTML"
            }
            requests.post(url, json=payload, timeout=6)
            print("[OK] Alerta enviado para o Telegram pessoal do Victor.")
        except Exception as e:
            print(f"Erro ao enviar Telegram: {e}")

def play_sound(sound_type="critical"):
    try:
        import winsound
        if sound_type == "critical":
            for _ in range(3):
                winsound.Beep(880, 220)
                time.sleep(0.08)
                winsound.Beep(1174, 300)
                time.sleep(0.12)
        else:
            winsound.Beep(659, 250)
            time.sleep(0.1)
            winsound.Beep(784, 350)
    except Exception:
        pass

def show_windows_popup(title, message, is_critical=False, phone=""):
    try:
        import ctypes
        MB_YESNO = 0x00000004
        MB_ICONEXCLAMATION = 0x00000030
        MB_TOPMOST = 0x00040000
        IDYES = 6

        full_message = f"{message}\n\nDeseja abrir o WhatsApp agora para enviar a mensagem de aviso para a Isa?"
        result = ctypes.windll.user32.MessageBoxW(
            0,
            full_message,
            f"Sentinela Isa Bianchini: {title}",
            MB_YESNO | MB_ICONEXCLAMATION | MB_TOPMOST
        )

        if result == IDYES:
            texto = "Oi meu amor! So passando para te avisar com carinho que vou precisar estender um pouco mais aqui no computador. Te amo muito, logo ja vou descansar contigo!"
            encoded = urllib.parse.quote(texto)
            clean_phone = phone.replace("+", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
            url = f"https://wa.me/{clean_phone}?text={encoded}" if clean_phone else f"https://wa.me/?text={encoded}"
            webbrowser.open(url)
    except Exception as e:
        print(f"Erro ao exibir popup: {e}")

def trigger_pre_alert(config):
    msg = (
        "⚠️ <b>SENTINELA 22:15</b>\n\n"
        "Mestre Victor, faltam 15 minutos para as 22:30.\n"
        "Se for estender o horario no computador hoje, avise a Isa com antecedencia!"
    )
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Disparando aviso previo das 22:15...")

    # 1. Enviar no Telegram do Victor
    send_alert_to_victor_telegram(msg)

    # 2. Enviar no WhatsApp pessoal do Victor se configurado
    send_alert_to_victor_phone("Aviso Sentinela: Faltam 15 minutos para as 22:30. Lembre-se de avisar a Isa se for estender no computador!", config)

    # 3. Tocar som no PC
    if config.get("sound_enabled", True):
        play_sound("pre_alert")

    # 4. Pop-up no PC
    show_windows_popup(
        "Aviso Previo das 22:15",
        "Victor, faltam 15 minutos para as 22:30. Se for estender no computador hoje, organize-se para avisar a Isa!",
        is_critical=False,
        phone=config.get("isa_phone", "")
    )

def trigger_critical_alert(config):
    msg = (
        "🚨 <b>ALERTA CRITICO 22:30 - SENTINELA</b>\n\n"
        "Mestre Victor, SAO 22:30!\n"
        "Nao passe deste horario no computador sem avisar a Isa!\n"
        "Abra o WhatsApp dela agora e informe a previsao de horario."
    )
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Disparando ALERTA CRITICO das 22:30!")

    # 1. Enviar no Telegram do Victor
    send_alert_to_victor_telegram(msg)

    # 2. Enviar no WhatsApp pessoal do Victor se configurado
    send_alert_to_victor_phone("ALERTA CRITICO 22:30: Victor, sao 22:30! Avise a Isa AGORA que voce vai estender o horario no computador!", config)

    # 3. Tocar som de alarme no PC
    if config.get("sound_enabled", True):
        play_sound("critical")

    # 4. Pop-up na frente da tela no PC
    show_windows_popup(
        "REGRA DAS 22:30 ATINGIDA!",
        "Victor, sao 22:30! Voce combinou de nunca passar deste horario no computador sem avisar a Isa que vai estender.",
        is_critical=True,
        phone=config.get("isa_phone", "")
    )

def main():
    config = load_config()

    # Se for disparado pelo Task Scheduler
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if "--trigger" in arg or "trigger" in arg:
            action = sys.argv[2].lower() if len(sys.argv) > 2 else "critical"
            if "pre" in action:
                trigger_pre_alert(config)
            else:
                trigger_critical_alert(config)
            return

    # Modo Daemon Continuo (caso queira rodar em loop)
    print("Sentinela Noturno 22:30 ativo.")
    last_pre_date = ""
    last_crit_date = ""

    while True:
        now = datetime.now()
        today = now.strftime("%Y-%m-%d")
        h = now.hour
        m = now.minute

        if h == config["night_limit_hour"] and m == config["pre_alert_minute"]:
            if last_pre_date != today:
                last_pre_date = today
                trigger_pre_alert(config)

        if h == config["night_limit_hour"] and m >= config["night_limit_minute"]:
            if last_crit_date != today:
                last_crit_date = today
                trigger_critical_alert(config)

        time.sleep(15)

if __name__ == "__main__":
    main()
