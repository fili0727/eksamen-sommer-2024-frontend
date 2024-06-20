import { hentDeltagere, redigerDeltager, sletDeltager, hentDiscipliner} from "../../services/apiFacade";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Deltager from "../../interfaces/deltager";
import Disciplin from "../../interfaces/disciplin";
// import { Køn } from "../../interfaces/køn";
// import { Klub } from "../../interfaces/klub";
import "../../styling/deltagerliste.css";
import { ResultatEnum } from "../../interfaces/resultatEnum";


export default function DeltagereListe() {
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentDeltager, setCurrentDeltager] = useState<Deltager | null>(null);
  const [availableDisciplines, setAvailableDisciplines] = useState<Disciplin[]>([]);

  useEffect(() => {
    loadDeltagere();
    loadDisciplines();
  }, []);

  const loadDeltagere = async () => {
    try {
      const fetchedDeltagere = await hentDeltagere();
      setDeltagere(fetchedDeltagere);
      setLoading(false);
    } catch (error) {
      setError("Der skete en fejl");
      setLoading(false);
    }
  };

  const loadDisciplines = async () => {
    try {
      const fetchedDisciplines = await hentDiscipliner();
      setAvailableDisciplines(fetchedDisciplines);
    } catch (error) {
      setError("Kunne ikke hente discipliner");
    }
  };

  const handleEdit = (deltager: Deltager) => {
    setCurrentDeltager(deltager);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await sletDeltager(id);
      setDeltagere(deltagere.filter(deltager => deltager.id !== id));
    } catch (error) {
      setError("Kunne ikke slette deltager");
    }
  };

 const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (currentDeltager) {
      if (name === "discipliner") {
        const options = (e.target as HTMLSelectElement).options;
        const selectedOptions = Array.from(options)
          .filter((option: HTMLOptionElement) => option.selected)
          .map((option: HTMLOptionElement) => option.value);

        const selectedDisciplines = selectedOptions.map(option => {
          const foundDisciplin = availableDisciplines.find(d => d.disciplinNavn === option);
          return foundDisciplin || { disciplinNavn: option, ResultatEnum: ResultatEnum.TID }; // Default to a valid ResultatEnum value
        }) as Disciplin[]; // Ensure it is typed as Disciplin[]
        setCurrentDeltager({ ...currentDeltager, discipliner: selectedDisciplines });
      } else {
        setCurrentDeltager({ ...currentDeltager, [name]: value });
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentDeltager) {
      try {
        await redigerDeltager(currentDeltager);
        setDeltagere(deltagere.map(deltager => (deltager.id === currentDeltager.id ? currentDeltager : deltager)));
        setIsEditing(false);
        setCurrentDeltager(null);
      } catch (error) {
        setError("Kunne ikke opdatere deltager");
      }
    }
  };

  if (loading) return <p>Loading participants...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="participants-container">
      <h2 className="participants-heading">Deltagere</h2>
      <table className="participants-table">
        <thead className="participants-thead">
          <tr className="participants-tr">
            <th className="participants-th">Navn</th>
            <th className="participants-th">Køn</th>
            <th className="participants-th">Alder</th>
            <th className="participants-th">Klub</th>
            <th className="participants-th">Discipliner</th>
            <th className="participants-th">Actions</th>
          </tr>
        </thead>
        <tbody className="participants-tbody">
          {deltagere.map((deltager) => (
            <tr key={deltager.id} className="participants-tr">
              <td className="participants-td">{deltager.navn}</td>
              <td className="participants-td">{deltager.køn}</td>
              <td className="participants-td">{deltager.alder}</td>
              <td className="participants-td">{deltager.klub}</td>
              <td className="participants-td">
                {deltager.discipliner.map((disciplin) => disciplin.disciplinNavn).join(", ")}
              </td>
              <td className="participants-td">
                <button className="edit-button" onClick={() => handleEdit(deltager)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(deltager.id || 0)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && currentDeltager && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h3>Rediger Deltager</h3>
          <label>
            Navn:
            <input
              type="text"
              name="navn"
              value={currentDeltager.navn}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Køn:
            <select
              name="køn"
              value={currentDeltager.køn}
              onChange={handleChange}
              required
            >
              <option value="MAND">MAND</option>
              <option value="KVINDE">KVINDE</option>
              <option value="ANDEN">ANDEN</option>
            </select>
          </label>
          <label>
            Alder:
            <input
              type="number"
              name="alder"
              value={currentDeltager.alder}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Klub:
            <select
              name="klub"
              value={currentDeltager.klub}
              onChange={handleChange}
              required
            >
              <option value="DEN">DEN</option>
              <option value="SWE">SWE</option>
            </select>
          </label>
          <label>
            Discipliner:
            <select
              name="discipliner"
              value={currentDeltager.discipliner.map(d => d.disciplinNavn)}
              onChange={handleChange}
              multiple
              required
            >
              {availableDisciplines.map(disciplin => (
                <option key={disciplin.disciplinNavn} value={disciplin.disciplinNavn}>
                  {disciplin.disciplinNavn}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Opdater</button>
          <button type="button" onClick={() => setIsEditing(false)}>Annuller</button>
        </form>
      )}
    </div>
  );
}
