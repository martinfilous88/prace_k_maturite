from graphviz import Digraph

# Create a new directed graph
dot = Digraph(comment='PIIS UML Diagram', format='png')
dot.attr(rankdir='TB', size='8,5')

# Define node styles
dot.attr('node', shape='record', style='filled', fillcolor='lightblue')

# Add classes
dot.node('Uzivatel', '{Uživatel|+ id: int\l+ jméno: string\l+ email: string\l|+ přihlásit()\l+ odhlásit()\l}')
dot.node('System', '{Systém|+ konfigurace: dict\l|+ inicializovat()\l+ spustit()\l+ zastavit()\l}')
dot.node('Zaznam', '{Záznam|+ id: int\l+ datum: datetime\l+ popis: string\l|+ vytvořit()\l+ aktualizovat()\l+ smazat()\l}')
dot.node('Opravneni', '{Oprávnění|+ úroveň: int\l|+ ověřit()\l+ nastavit()\l}')

# Add relationships
dot.edge('Uzivatel', 'Zaznam', label='vytváří')
dot.edge('Uzivatel', 'Opravneni', label='má')
dot.edge('System', 'Zaznam', label='spravuje')
dot.edge('System', 'Uzivatel', label='řídí')

# Render the diagram
dot.render('c:/Users/Martin/Desktop/project/uml_diagram', cleanup=True)
print("UML diagram generated successfully!")
