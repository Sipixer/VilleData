import React, { useEffect, useState } from "react";
import "./App.css";
type Ville = {
  code: string;
  nom: string;
  population: number;
  surface: number;
  _score: 1;
  departement: { code: string; nom: string };
  region: { code: string; nom: string };
};

function App() {
  const [response, setResponse] = useState<any>([]);
  const [search, setSearch] = useState("");
  const onChangeSearchInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.currentTarget.value);
  };
  useEffect(() => {
    newResponse();
  }, [search]);
  const newResponse = async () => {
    setResponse(await getData(search));
  };

  return (
    <div className="App">
      <div className="search">
        <h1>Recherche les informations d'une ville par nom</h1>
        <input type="text" placeholder="Nom" onChange={onChangeSearchInput} />
      </div>
      <div className="villes">
        {response.map((ville: Ville) => (
          <VilleCard key={ville.code} ville={ville} />
        ))}
      </div>
      <div className="sources">
        <p>
          Source: API Découpage administratif {">"} Communes:
          <a
            href="https://geo.api.gouv.fr/decoupage-administratif/communes"
            target={"_blank"}
          >
            {" "}
            API
          </a>
        </p>
      </div>
    </div>
  );
}

const VilleCard = ({ ville }: { ville: Ville }) => {
  return (
    <div className="ville">
      <h3>{ville.nom}</h3>
      <p className="subinfo">
        {ville.departement.nom} ({ville.departement.code}) - {ville.region.nom}
      </p>
      <ul>
        <li>Population: {numberWithSpaces(ville.population)} hab.</li>
        <li>Superficie: {(ville.surface / 100).toFixed(2)} km²</li>
      </ul>
    </div>
  );
};

export default App;

const getData = async (search: string) => {
  const response = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${search}&fields=code,nom,population,surface,departement,region&boost=population&limit=6`
  );
  const json = await response.json();
  return json;
};
const numberWithSpaces = (x: number) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};
