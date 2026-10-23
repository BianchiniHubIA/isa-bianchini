"""
Gerador de icones para o PWA Sentinela Isa Bianchini.
Design escuro de luxo com aneis de alianca entrelacados e coracao dourado.
"""
from PIL import Image, ImageDraw

def create_pwa_icon(size):
    # Fundo escuro luxuoso com gradiente sutil
    img = Image.new("RGBA", (size, size), (11, 15, 25, 255))
    draw = ImageDraw.Draw(img)
    
    # Borda externa com cantos arredondados ou circulo dourado sutil
    pad = int(size * 0.06)
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=int(size * 0.22),
        fill=(17, 24, 39, 255),
        outline=(229, 182, 35, 180),
        width=int(size * 0.02)
    )
    
    # Brilho dourado interno
    center_x = size // 2
    center_y = size // 2
    
    # Desenhar anel esquerdo (simbolizando Victor)
    ring_radius = int(size * 0.19)
    ring_width = int(size * 0.038)
    gold_color = (229, 182, 35, 255)
    gold_light = (252, 211, 77, 255)
    
    offset_x = int(size * 0.08)
    
    # Anel esquerdo
    bbox_left = [
        center_x - offset_x - ring_radius,
        center_y - ring_radius,
        center_x - offset_x + ring_radius,
        center_y + ring_radius
    ]
    draw.ellipse(bbox_left, outline=gold_color, width=ring_width)
    
    # Anel direito (simbolizando Isa)
    bbox_right = [
        center_x + offset_x - ring_radius,
        center_y - ring_radius,
        center_x + offset_x + ring_radius,
        center_y + ring_radius
    ]
    draw.ellipse(bbox_right, outline=gold_light, width=ring_width)
    
    # Ponto de luz ou coracao no topo
    heart_y = center_y - int(size * 0.16)
    draw.ellipse(
        [center_x - int(size * 0.04), heart_y - int(size * 0.04), center_x + int(size * 0.04), heart_y + int(size * 0.04)],
        fill=(244, 63, 94, 255)
    )
    
    return img

if __name__ == "__main__":
    icon_192 = create_pwa_icon(192)
    icon_192.save("public/icon-192.png", "PNG")
    
    icon_512 = create_pwa_icon(512)
    icon_512.save("public/icon-512.png", "PNG")
    
    apple_icon = create_pwa_icon(180)
    apple_icon.save("public/apple-touch-icon.png", "PNG")
    
    favicon_png = create_pwa_icon(64)
    favicon_png.save("public/favicon-64.png", "PNG")
    
    print("Icones PWA gerados com sucesso!")
