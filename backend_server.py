"""
Backend FastAPI para o Sentinela Isa Bianchini & Integracao com Instagram.
Funcionalidades:
1. Raspagem de Story/Reel/Post via yt-dlp ou instaloader.
2. Gerador de homenagens personalizadas marcando o Instagram da Isa.
3. Integracao com a API oficial do Instagram Graph API da Meta (credenciais do ALFRED).
4. Disparo de notificacoes e avisos sonoros do Sentinela Noturno 22:30.
"""

import os
import sys
import json
import time
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import dotenv_values
import yt_dlp

# Carregar configuracoes do ALFRED
ALFRED_ENV_PATH = "E:/REPOSITORIOS/ALFRED/.env"
alfred_env = {}
if os.path.exists(ALFRED_ENV_PATH):
    try:
        alfred_env = dotenv_values(ALFRED_ENV_PATH, encoding="utf-8-sig")
    except Exception as e:
        print(f"Erro ao ler .env do ALFRED: {e}")

META_ACCESS_TOKEN = alfred_env.get("META_ACCESS_TOKEN", "")
META_IG_USER_ID = alfred_env.get("META_IG_USER_ID", "28747576051551708")

app = FastAPI(title="Isa Bianchini Sentinela API", version="1.0.0")

# Habilitar CORS para o frontend Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCRAPED_DIR = os.path.join(os.path.dirname(__file__), "public", "scraped")
os.makedirs(SCRAPED_DIR, exist_ok=True)

class ScrapeRequest(BaseModel):
    url: str
    isa_instagram: Optional[str] = "@isabianchini"
    category: Optional[str] = "romantico"

class HomenagemRequest(BaseModel):
    isa_instagram: str
    theme: Optional[str] = "parceria"
    custom_notes: Optional[str] = ""

class PostStoryRequest(BaseModel):
    media_url: str
    caption: str
    media_type: Optional[str] = "STORIES"

class AlertTestRequest(BaseModel):
    type: str  # 'pre_alert_2215' ou 'critical_2230'
    message: Optional[str] = ""

@app.get("/api/status")
def get_status():
    """Retorna o status da integracao e dados do sistema."""
    has_meta_token = bool(META_ACCESS_TOKEN)
    ig_username = "desconhecido"
    
    if has_meta_token:
        try:
            r = requests.get(
                f"https://graph.instagram.com/me?fields=id,username&access_token={META_ACCESS_TOKEN}",
                timeout=5
            )
            if r.status_code == 200:
                ig_username = r.json().get("username", "conectado")
        except Exception:
            pass

    return {
        "status": "online",
        "alfred_connected": True,
        "instagram_api": {
            "configured": has_meta_token,
            "username": ig_username,
            "account_id": META_IG_USER_ID
        },
        "server_time": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.post("/api/scrape-story")
def scrape_instagram_media(req: ScrapeRequest):
    """
    Raspa video ou foto de um Story, Reel ou Post do Instagram ou TikTok
    usando yt-dlp e salva na pasta public/scraped/
    """
    url = req.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL nao fornecida")

    timestamp = int(time.time())
    out_template = os.path.join(SCRAPED_DIR, f"media_{timestamp}.%(ext)s")

    ydl_opts = {
        "outtmpl": out_template,
        "format": "best[ext=mp4]/best",
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "extract_flat": False
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            base_name = os.path.basename(filename)

            # Gerar sugestao de homenagem vinculando o Instagram da Isa
            isa_handle = req.isa_instagram if req.isa_instagram.startswith("@") else f"@{req.isa_instagram}"
            suggested_caption = (
                f"Para a mulher que torna a minha vida muito mais leve e inspiradora: {isa_handle}. "
                f"Obrigado por ser essa fortaleza e o meu maior motivo de sorrir todos os dias. Te amo muito!"
            )

            return {
                "success": True,
                "title": info.get("title", "Midia raspada com sucesso"),
                "duration": info.get("duration", 0),
                "media_url": f"/scraped/{base_name}",
                "local_path": filename,
                "file_type": "video" if filename.endswith((".mp4", ".mov", ".webm")) else "image",
                "suggested_caption": suggested_caption,
                "isa_handle": isa_handle
            }
    except Exception as e:
        error_msg = str(e)
        # Se for restrito ou necessitar de cookies, retornar explicacao clara
        raise HTTPException(status_code=500, detail=f"Erro na raspagem: {error_msg}")

@app.post("/api/generate-homenagem")
def generate_homenagem(req: HomenagemRequest):
    """Gera variacoes de textos e legendas para homenagear a Isa no Instagram."""
    handle = req.isa_instagram if req.isa_instagram.startswith("@") else f"@{req.isa_instagram}"
    
    templates = [
        {
            "category": "Parceria & Vida",
            "title": "O porto seguro dos bastidores",
            "caption": (
                f"Quem ve as vitorias de fora nem imagina onde tudo comeca: no nosso lar e na forca dessa mulher incrivel. "
                f"{handle}, voce e o meu porto seguro, quem equilibra os meus dias e torna qualquer desafio pequeno. "
                f"Obrigado por ser essa parceira leal, inteligente e maravilhosa em cada detalhe. Te amo profundamente!"
            ),
            "suggested_action": "Subir nos Stories com uma musica instrumental suave e marcar o perfil dela."
        },
        {
            "category": "Admiracao Publica",
            "title": "A mulher que ilumina tudo",
            "caption": (
                f"Olho para essa mulher e sinto um orgulho que nao cabe no peito. "
                f"{handle}, sua forca, sua elegancia e seu coracao puro sao a minha maior inspiracao diária. "
                f"Ter voce ao meu lado e o maior privilegio da minha vida. Te amo demais!"
            ),
            "suggested_action": "Subir no Feed ou Stories com foto dela sorrindo."
        },
        {
            "category": "Gratidao & Cumplicidade",
            "title": "Gratidao pela nossa alianca",
            "caption": (
                f"Passando aqui em publico para declarar o meu amor pela dona do meu coracao: {handle}. "
                f"Nao existe conquista minha que nao tenha a sua presenca, o seu apoio e a sua sabedoria. "
                f"Minha eterna parceira de vida e de sonhos!"
            ),
            "suggested_action": "Publicar nos Stories com figurinha de coracao ou foto espontanea."
        }
    ]

    return {
        "success": True,
        "isa_handle": handle,
        "options": templates
    }

@app.post("/api/post-story")
def post_story_to_instagram(req: PostStoryRequest):
    """
    Publica um Story no Instagram oficial atraves da Meta Graph API
    ou prepara o pacote para postagem imediata.
    """
    if not META_ACCESS_TOKEN:
        raise HTTPException(
            status_code=400,
            detail="Token META_ACCESS_TOKEN nao encontrado no .env do ALFRED"
        )

    # Nota: A API oficial do Instagram exige que media_url seja uma URL publica na internet.
    # Se for uma URL local (/scraped/...), retornamos instrucao para uso com Cloudinary ou upload direto.
    is_public_url = req.media_url.startswith("http://") or req.media_url.startswith("https://")

    if not is_public_url:
        return {
            "success": False,
            "mode": "manual_or_tunnel_needed",
            "message": "A API oficial do Instagram Graph API requer uma URL publica HTTP/HTTPS acessivel pelos servidores da Meta. Recomendamos usar o botao de Baixar Midia e Copiar Mensagem para postar direto no Instagram em 1 toque, ou configurar tunelamento Cloudflare/Ngrok.",
            "caption": req.caption,
            "media_url": req.media_url
        }

    try:
        # 1. Criar container de media para Story
        create_url = f"https://graph.instagram.com/v21.0/{META_IG_USER_ID}/media"
        payload = {
            "image_url": req.media_url,
            "media_type": "STORIES",
            "access_token": META_ACCESS_TOKEN
        }
        res = requests.post(create_url, data=payload, timeout=15)
        res_json = res.json()

        if "id" not in res_json:
            return {
                "success": False,
                "error": res_json.get("error", {}).get("message", "Erro desconhecido na Meta API"),
                "details": res_json
            }

        creation_id = res_json["id"]

        # 2. Publicar o container criado
        publish_url = f"https://graph.instagram.com/v21.0/{META_IG_USER_ID}/media_publish"
        pub_res = requests.post(publish_url, data={
            "creation_id": creation_id,
            "access_token": META_ACCESS_TOKEN
        }, timeout=15)

        pub_json = pub_res.json()
        return {
            "success": True,
            "story_id": pub_json.get("id"),
            "message": "Story publicado com sucesso no Instagram oficial!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trigger-windows-alert")
def trigger_windows_alert(req: AlertTestRequest, background_tasks: BackgroundTasks):
    """Dispara alerta nativo do Windows e som no desktop."""
    def run_alert():
        try:
            import winsound
            if req.type == "critical_2230":
                # Tocar sequencia de beeps de atencao
                for _ in range(3):
                    winsound.Beep(880, 200)
                    time.sleep(0.1)
                    winsound.Beep(1174, 300)
                    time.sleep(0.15)
            else:
                # Som suave de aviso previo
                winsound.Beep(659, 250)
                time.sleep(0.1)
                winsound.Beep(784, 350)
        except Exception:
            pass

    background_tasks.add_task(run_alert)
    return {"success": True, "message": "Alerta sonoro executado no Windows!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8088)
