from PIL import Image, ImageDraw, ImageFont

# Create a new image with a white background
width, height = 800, 600
image = Image.new('RGB', (width, height), color='white')
draw = ImageDraw.Draw(image)

# Load a font
try:
    font_title = ImageFont.truetype("arial.ttf", 20)
    font_text = ImageFont.truetype("arial.ttf", 16)
except IOError:
    font_title = ImageFont.load_default()
    font_text = ImageFont.load_default()

# Draw title
draw.text((width//2 - 100, 20), "PIIS - Informační a Řídicí Systém", fill='black', font=font_title)

# Define class boxes
classes = [
    {"name": "Uživatel", "attributes": ["id: int", "jméno: string", "email: string"], "methods": ["přihlásit()", "odhlásit()"]},
    {"name": "Systém", "attributes": ["konfigurace: dict"], "methods": ["inicializovat()", "spustit()", "zastavit()"]},
    {"name": "Záznam", "attributes": ["id: int", "datum: datetime", "popis: string"], "methods": ["vytvořit()", "aktualizovat()", "smazat()"]},
    {"name": "Oprávnění", "attributes": ["úroveň: int"], "methods": ["ověřit()", "nastavit()"]}
]

colors = ['lightblue', 'lightgreen', 'lightyellow', 'lightpink']

# Draw class boxes
for i, cls in enumerate(classes):
    x = 50 + (i % 2) * 350
    y = 100 + (i // 2) * 250
    
    # Draw box
    draw.rectangle([x, y, x+250, y+200], outline='black', fill=colors[i])
    
    # Draw class name
    draw.text((x+10, y+10), cls['name'], fill='black', font=font_title)
    
    # Draw attributes
    for j, attr in enumerate(cls['attributes']):
        draw.text((x+10, y+50+j*25), f"- {attr}", fill='black', font=font_text)
    
    # Draw methods
    for j, method in enumerate(cls['methods']):
        draw.text((x+10, y+150+j*25), f"+ {method}", fill='black', font=font_text)

# Draw relationships
draw.line((200, 200, 350, 300), fill='black', width=2)
draw.line((550, 200, 400, 300), fill='black', width=2)

# Save the image
image.save('c:/Users/Martin/Desktop/project/uml_diagram.png')
print("UML diagram image generated successfully!")
