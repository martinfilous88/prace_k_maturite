import os
import re
from graphviz import Digraph

def analyze_typescript_file(file_path):
    """Analyzuje TypeScript soubor a extrahuje třídy, rozhraní a jejich vztahy."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrakce tříd
    classes = re.findall(r'(export\s+)?(class|interface)\s+(\w+)(\s+extends\s+(\w+))?', content)
    
    # Extrakce importů
    imports = re.findall(r'import\s+{?(\w+)}?\s+from\s+[\'"]([^\'"\n]+)[\'"]', content)
    
    return {
        'classes': [c[2] for c in classes],
        'imports': imports
    }

def generate_comprehensive_uml(root_dir):
    """Generuje komplexní UML diagram pro celý projekt."""
    dot = Digraph(comment='Komplexní UML Diagram', format='png')
    dot.attr(rankdir='TB', size='12,12')
    
    # Slovník pro sledování vztahů
    project_structure = {}
    
    # Procházení všech souborů
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')) and not file.startswith('.'):
                full_path = os.path.join(root, file)
                relative_path = os.path.relpath(full_path, root_dir)
                
                # Analýza souboru
                file_info = analyze_typescript_file(full_path)
                
                # Přidání uzlů a hran do grafu
                for cls in file_info['classes']:
                    dot.node(cls, f"{cls}\\n{relative_path}", shape='box')
                
                # Sledování importů a vztahů
                project_structure[relative_path] = file_info
    
    # Přidání hran mezi třídami
    for path, info in project_structure.items():
        for imp_cls, imp_path in info['imports']:
            dot.edge(imp_cls, imp_path, style='dashed')
    
    # Uložení diagramu
    dot.render('c:/Users/Martin/Desktop/project/comprehensive_project_uml', cleanup=True)
    print("UML diagram byl úspěšně vygenerován!")

# Spuštění analýzy
generate_comprehensive_uml('c:/Users/Martin/Desktop/project/src')
