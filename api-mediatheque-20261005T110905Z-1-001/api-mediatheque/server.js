const express = require("express");
const app = express();
app.use(express.json());

// Données en mémoire : elles sont perdues à chaque redémarrage du serveur.
const auteurs = [
  { id: 1, nom: "Antoine de Saint-Exupéry", nationalite: "française" },
  { id: 2, nom: "Victor Hugo", nationalite: "française" },
  { id: 3, nom: "Agatha Christie", nationalite: "britannique" },
  { id: 4, nom: "Haruki Murakami", nationalite: "japonaise" },
];

let livres = [
  { id: 1, titre: "Le Petit Prince", genre: "conte", annee: 1943, disponible: true, auteurId: 1 },
  { id: 2, titre: "Vol de nuit", genre: "roman", annee: 1931, disponible: false, auteurId: 1 },
  { id: 3, titre: "Les Misérables", genre: "roman", annee: 1862, disponible: true, auteurId: 2 },
  { id: 4, titre: "Notre-Dame de Paris", genre: "roman", annee: 1831, disponible: false, auteurId: 2 },
  { id: 5, titre: "Les Contemplations", genre: "poésie", annee: 1856, disponible: true, auteurId: 2 },
  { id: 6, titre: "Le Crime de l'Orient-Express", genre: "policier", annee: 1934, disponible: true, auteurId: 3 },
  { id: 7, titre: "Ils étaient dix", genre: "policier", annee: 1939, disponible: true, auteurId: 3 },
  { id: 8, titre: "Mort sur le Nil", genre: "policier", annee: 1937, disponible: false, auteurId: 3 },
];

// Route d'exemple : la liste de tous les livres
app.get("/livres/:id", (req, res) => {
  const id = Number(req.params.id);                // ":id" arrive en texte -> on convertit
  const livre = livres.find((l) => l.id === id);   // undefined si aucun livre n'a cet id

  if (!livre) {
    return res.status(404).json({ erreur: "Livre introuvable" });
  }

  res.json(livre);
});

app.post("/livres", (req, res) => {
  // 1. Les champs obligatoires : on vérifie chacun, un par un.
  //    On teste "=== undefined" et pas "!req.body.annee" : la valeur 0 serait refusée à tort.
  if (req.body.titre === undefined || req.body.titre === "") {
    return res.status(400).json({ erreur: "Le titre est obligatoire" });
  }
  if (req.body.genre === undefined || req.body.genre === "") {
    return res.status(400).json({ erreur: "Le genre est obligatoire" });
  }
  if (req.body.annee === undefined || req.body.annee === "") {
    return res.status(400).json({ erreur: "L'année est obligatoire" });
  }
  if (req.body.auteurId === undefined || req.body.auteurId === "") {
    return res.status(400).json({ erreur: "L'auteurId est obligatoire" });
  }

  // 2. L'auteur doit exister : on le cherche dans le tableau auteurs.
  const auteurId = Number(req.body.auteurId);
  const auteur = auteurs.find((a) => a.id === auteurId);
  if (!auteur) {
    return res.status(400).json({ erreur: "Cet auteur n'existe pas" });
  }

  // 3. Le nouvel id = le plus grand id existant + 1.
  //    livres.map((l) => l.id) donne la liste des id : [1, 2, 3, ..., 8]
  //    Math.max(...) prend le plus grand de cette liste : 8
  //    (On n'utilise pas livres.length + 1 : après une suppression, on aurait deux fois le même id.)
  const nouvelId = Math.max(...livres.map((l) => l.id)) + 1;

  // 4. On construit le nouveau livre champ par champ.
  const nouveauLivre = {
    id: nouvelId,
    titre: req.body.titre,
    genre: req.body.genre,
    annee: req.body.annee,
    disponible: true,          // un nouveau livre est toujours disponible
    auteurId: auteurId,
  };

  livres.push(nouveauLivre);                  // on l'ajoute au tableau
  res.status(201).json(nouveauLivre);         // 201 = créé
});

app.delete("/livres/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = livres.findIndex((l) => l.id === id);   // la POSITION du livre, -1 si absent

  if (index === -1) {
    return res.status(404).json({ erreur: "Livre introuvable" });
  }

  const livreSupprime = livres[index];   // on le garde de côté pour le renvoyer
  livres.splice(index, 1);               // on retire 1 élément à cette position
  res.json(livreSupprime);
});

// À toi de jouer : les routes à coder sont décrites dans l'énoncé

app.listen(3000, () => {
  console.log("API de la médiathèque démarrée sur http://localhost:3000");
});