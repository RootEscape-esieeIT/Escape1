import os
import urllib.request
import hashlib
import base64

def generate_svg_password():
    print("=============================================")
    print("      DÉCODEUR CRYPTOGRAPHIQUE SVG")
    print("=============================================\n")
    
    # Demande l'entrée à l'utilisateur
    source = input("Entrez le lien (URL) ou le chemin local vers le fichier (.svg) : ").strip()

    # 1. Vérification stricte de l'extension
    # On gère le cas où l'URL aurait des paramètres à la fin (ex: image.svg?v=1)
    url_without_params = source.lower().split('?')[0]
    if not url_without_params.endswith('.svg'):
        print("\n[ERREUR] Accès refusé. Le fichier ou le lien doit se terminer par '.svg'.")
        return

    print("\nExtraction des données en cours...")

    # 2. Récupération du contenu (Local ou Web)
    try:
        if source.startswith(('http://', 'https://')):
            # Ajout d'un User-Agent car les serveurs (comme Wikimédia) bloquent les requêtes de bots anonymes
            req = urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req) as response:
                content = response.read().decode('utf-8')
        else:
            if not os.path.exists(source):
                print("\n[ERREUR] Le fichier local spécifié est introuvable.")
                return
            with open(source, 'r', encoding='utf-8') as f:
                content = f.read()
    except Exception as e:
        print(f"\n[ERREUR] Impossible de lire le fichier : {e}")
        return

    # 3. Normalisation (La clé de la stabilité)
    # On retire tous les espaces et retours à la ligne. 
    # Ainsi, minifié ou non, Mac ou PC, le code brut reste identique.
    normalized_content = "".join(content.split())

    # 4. Cryptage (Hachage SHA-256)
    hash_obj = hashlib.sha256(normalized_content.encode('utf-8'))

    # 5. Formatage en mot de passe de 30 caractères
    # On encode le hash en Base64 pour avoir un mot de passe complexe (Majuscules, minuscules, chiffres)
    b64_hash = base64.b64encode(hash_obj.digest()).decode('utf-8')

    # On remplace les caractères spéciaux de Base64 (+ et /) par des lettres 
    # pour éviter les bugs si le joueur doit entrer ce mot de passe dans une URL
    clean_hash = b64_hash.replace('+', 'X').replace('/', 'Y')

    # On extrait exactement les 30 premiers caractères
    final_password = clean_hash[:30]

    print("[SUCCÈS] Empreinte validée.")
    print("---------------------------------------------")
    print(f"MOT DE PASSE GÉNÉRÉ : {final_password}")
    print("---------------------------------------------")

if __name__ == "__main__":
    generate_svg_password()