## Problèmes

Au démarrage de l'application, toutes les données de la base sont chargées :

1. toutes les pages de mèmes
2. tous leurs auteurs
3. tous leurs commentaires

## Optimisations

Il faut charger uniquement ce dont on a besoin à un instant T :

1. la page 1 des mèmes au démarrage
2. les auteurs de ces mèmes
   - charger par lot
   - ne jamais charger un auteur déjà chargé
3. les autres pages doivent être chargées lorsque nécessaire (scroll infini)
4. les commentaires d'un mème doivent être chargés à la demande de l'utilisateur

### Au démarrage

Seule la page 1 est chargée. On récupère les auteurs des mèmes de cette page. Pour éviter de faire des calculs inutiles, on utilise les mécanismes de React (useMemo)

## Ce qui n'a pas été fait

- Gestion d'erreurs
