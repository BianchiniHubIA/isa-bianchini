"""
Sentinela Desktop Windows: Guardiao Noturno das 22:30 para Victor Bianchini.
Monitora o relogio em segundo plano.
As 22:15: Alerta sonoro suave e notificacao de aproximacao.
As 22:30: Alerta critico com pop-up e atalho direto para avisar a Isa no WhatsApp.
"""

import os
import sys
import time
import json
import urllib.parse
import webbrowser
from datetime import datetime

# Configuracao padrao
CONFIG_FILE = os.path.join(os.path.dirname(__file__), "sentinela_config.json")

DEFAULT_CONFIG = {
    "isa_phone": "5562999999999",
    "isa_instagram": "@isabianchini",
    "night_limit_hour": 22,
    "night_limit_minute": 30,
    "pre_alert_minute": 15,
    "sound_enabled": True
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return {**DEFAULT_CONFIG, **json.load(f)}
        except Exception:
            pass
    return DEFAULT_CONFIG

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
        MB_ICONWARNING = 0x00000030
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
            texto = "Oi meu amor! So passando para te avisar com carinho que vou precisar estender um pouco mais aqui no computador. Te amo muito, logo ja vou deitar contigo!"
            encoded = urllib.parse.quote(texto)
            clean_phone = phone.replace("+", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")
            url = f"https://wa.me/{clean_phone}?text={encoded}" if clean_phone else f"https://wa.me/?text={encoded}"
            webbrowser.open(url)
    except Exception as e:
        print(f"Erro ao exibir popup: {e}")

def main():
    print("Sentinela Noturno 22:30 iniciado com sucesso no Windows.")
    config = load_config()

    last_pre_alert_date = ""
    last_critical_alert_date = ""

    while True:
        now = datetime.now()
        today_str = now.strftime("%Y-%m-%d")
        current_hour = now.hour
        current_min = now.minute

        # 1. Alerta Previo (22:15)
        if current_hour == config["night_limit_hour"] and current_min == config["pre_alert_minute"]:
            if last_pre_alert_date != today_str:
                last_pre_alert_date = today_str
                print(f"[{now.strftime('%H:%M:%S')}] Aviso Previo 22:15 disparado.")
                if config["sound_enabled"]:
                    play_sound("pre_alert")

        # 2. Alerta Critico (22:30)
        if current_hour == config["night_limit_hour"] and current_min >= config["night_limit_minute"]:
            if last_critical_alert_date != today_str:
                last_critical_alert_date = today_str
                print(f"[{now.strftime('%H:%M:%S')}] ALERTA CRITICO 22:30 disparado!")
                if config["sound_enabled"]:
                    play_sound("critical")
                show_windows_popup(
                    "REGRA DAS 22:30 ATINGIDA!",
                    "Victor, sao 22:30! Voce combinou de nunca passar deste horario no computador sem avisar a Isa que vai estender.",
                    is_critical=True,
                    phone=config.get("isa_phone", "")
                )

        # Checar a cada 15 segundos
        time.sleep(15)

if __name__ == "__main__":
    main()
