"""
Desenha o icone de coracao luxuoso de alta definicao (1024x1024)
com detalhes em dourado e aneis de alianca entrelacados para o executavel do Windows.
"""
from PIL import Image, ImageDraw, ImageFilter
import math

def draw_luxury_heart_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Criar fundo circular escuro com cantos suaves
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    pad = int(size * 0.04)
    bg_draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=int(size * 0.24),
        fill=(11, 15, 25, 255),
        outline=(229, 182, 35, 200),
        width=int(size * 0.02)
    )
    
    # Brilho de fundo
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    center = size // 2
    glow_radius = int(size * 0.38)
    glow_draw.ellipse(
        [center - glow_radius, center - glow_radius, center + glow_radius, center + glow_radius],
        fill=(244, 63, 94, 60)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(int(size * 0.08)))
    
    img = Image.alpha_composite(img, bg)
    img = Image.alpha_composite(img, glow)
    
    # Desenhar o coracao
    heart_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    heart_draw = ImageDraw.Draw(heart_layer)
    
    # Poligono de coracao suave baseado na equacao parametrica
    points = []
    scale = size * 0.022
    for t in range(0, 360, 1):
        rad = math.radians(t)
        # Equacao do coracao
        x = 16 * (math.sin(rad) ** 3)
        y = -(13 * math.cos(rad) - 5 * math.cos(2*rad) - 2 * math.cos(3*rad) - math.cos(4*rad))
        px = center + int(x * scale)
        py = center - int(size * 0.04) + int(y * scale)
        points.append((px, py))
    
    heart_draw.polygon(points, fill=(244, 63, 94, 255), outline=(229, 182, 35, 255))
    
    # Desenhar contorno dourado interno no coracao
    points_inner = []
    scale_inner = size * 0.019
    for t in range(0, 360, 1):
        rad = math.radians(t)
        x = 16 * (math.sin(rad) ** 3)
        y = -(13 * math.cos(rad) - 5 * math.cos(2*rad) - 2 * math.cos(3*rad) - math.cos(4*rad))
        px = center + int(x * scale_inner)
        py = center - int(size * 0.04) + int(y * scale_inner)
        points_inner.append((px, py))
    heart_draw.polygon(points_inner, outline=(252, 211, 77, 230), width=int(size * 0.012))

    # Aneis dourados de alianca cruzados no centro inferior do coracao
    ring_r = int(size * 0.11)
    ring_w = int(size * 0.022)
    offset = int(size * 0.055)
    ring_y = center + int(size * 0.08)
    
    # Anel esquerdo
    heart_draw.ellipse(
        [center - offset - ring_r, ring_y - ring_r, center - offset + ring_r, ring_y + ring_r],
        outline=(229, 182, 35, 255),
        width=ring_w
    )
    # Anel direito
    heart_draw.ellipse(
        [center + offset - ring_r, ring_y - ring_r, center + offset + ring_r, ring_y + ring_r],
        outline=(252, 211, 77, 255),
        width=ring_w
    )
    
    img = Image.alpha_composite(img, heart_layer)
    return img

if __name__ == "__main__":
    heart_icon = draw_luxury_heart_icon(1024)
    heart_icon.save("app-icon.png", "PNG")
    heart_icon.save("public/icon-512.png", "PNG")
    print("Icone do coracao gerado em app-icon.png com sucesso!")
