import { hentDeltagere, redigerDeltager, sletDeltager, hentDiscipliner } from "../../services/apiFacade";
import { useEffect, useState } from "react";
import Deltager from "../../interfaces/deltager";
import { Køn } from "../../interfaces/køn";
import { Klub } from "../../interfaces/klub";
import "../../styling/deltagerliste.css";
import Disciplin from "../../interfaces/disciplin";

export default function DeltagereListe() {
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingDeltager, setEditingDeltager] = useState<Deltager | null>(null);
  const [nyDeltager, setNyDeltager] = useState<Deltager | null>(null);
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);

  useEffect(() => {
    loadDeltagere();
    loadDiscipliner();
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

  const loadDiscipliner = async () => {
    try {
      const fetchedDiscipliner = await hentDiscipliner();
      setDiscipliner(fetchedDiscipliner);
    } catch (error) {
      setError("Der skete en fejl ved indlæsning af discipliner");
    }
  };

  const handleEdit = (deltager: Deltager) => {
    setEditingDeltager(deltager);
    setNyDeltager({ ...deltager });
  };

  const handleSave = async () => {
    if (nyDeltager && nyDeltager.id) {
      try {
        const updatedDeltager = await redigerDeltager(nyDeltager);
        setDeltagere(deltagere.map(d => d.id === updatedDeltager.id ? updatedDeltager : d));
        setEditingDeltager(null);
        setNyDeltager(null);
      } catch (error) {
        setError("Der skete en fejl ved redigering");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await sletDeltager(id);
      setDeltagere(deltagere.filter(d => d.id !== id));
    } catch (error) {
      setError("Der skete en fejl ved sletning");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (nyDeltager) {
      setNyDeltager({
        ...nyDeltager,
        [name]: value
      });
    }
  };

  const handleDisciplinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (nyDeltager) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      const selectedDiscipliner = discipliner.filter(d => selectedOptions.includes(d.disciplinNavn));
      setNyDeltager({
        ...nyDeltager,
        discipliner: selectedDiscipliner
      });
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
                <button className="delete-button" onClick={() => handleDelete(deltager.id!)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingDeltager && nyDeltager && (
        <div className="edit-form">
          <h3>Edit Deltager</h3>
          <label>
            Navn:
            <input type="text" name="navn" value={nyDeltager.navn} onChange={handleInputChange} />
          </label>
          <label>
            Køn:
            <select name="køn" value={nyDeltager.køn} onChange={handleInputChange}>
              {Object.values(Køn).map((kønValue) => (
                <option key={kønValue} value={kønValue}>{kønValue}</option>
              ))}
            </select>
          </label>
          <label>
            Alder:
            <input type="number" name="alder" value={nyDeltager.alder} onChange={handleInputChange} />
          </label>
          <label>
            Klub:
            <select name="klub" value={nyDeltager.klub} onChange={handleInputChange}>
              {Object.values(Klub).map((klubValue) => (
                <option key={klubValue} value={klubValue}>{klubValue}</option>
              ))}
            </select>
          </label>
          <label>
            Discipliner:
            <select multiple name="discipliner" value={nyDeltager.discipliner.map(d => d.disciplinNavn)} onChange={handleDisciplinesChange}>
              {discipliner.map(disciplin => (
                <option key={disciplin.id} value={disciplin.disciplinNavn}>{disciplin.disciplinNavn}</option>
              ))}
            </select>
          </label>
          <button className="save-button" onClick={handleSave}>Save</button>
          <button className="cancel-button" onClick={() => setEditingDeltager(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}