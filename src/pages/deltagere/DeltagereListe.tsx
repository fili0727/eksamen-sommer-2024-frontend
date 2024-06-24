import { hentDeltagere, redigerDeltager, sletDeltager, hentDiscipliner, opretDeltager} from "../../services/apiFacade";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import Deltager from "../../interfaces/deltager";
import Disciplin from "../../interfaces/disciplin";
// import { Køn } from "../../interfaces/køn";
// import { Klub } from "../../interfaces/klub";
import "../../styling/deltagerliste.css";
import { ResultatEnum } from "../../interfaces/resultatEnum";
import { Køn } from "../../interfaces/køn";
import { Klub } from "../../interfaces/klub";


export default function DeltagereListe() {
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentDeltager, setCurrentDeltager] = useState<Deltager | null>(null);
  const [availableDisciplines, setAvailableDisciplines] = useState<Disciplin[]>([]);
  const [genderFilter, setGenderFilter] = useState<Køn | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage] = useState(8);

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
      const wasDeleted = await sletDeltager(id);
      if (wasDeleted) {
        setDeltagere(deltagere.filter(deltager => deltager.id !== id));
      } else {
        setError("Kunne ikke slette deltager: Deltageren har et resultat");
      }
    } catch (error) {
      setError("Kunne ikke slette deltager: Deltageren har et resultat");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
//CHAT GPT START
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
  // CHAT GPT SLUT
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentDeltager) {
      try {
        if (isEditing) {
          const opdateretDeltager = await redigerDeltager(currentDeltager);
          setDeltagere([...deltagere, opdateretDeltager])
        } else {
          const oprettetDeltager = await opretDeltager(currentDeltager);
           setDeltagere([...deltagere, oprettetDeltager])
        }
        setIsEditing(false);
        setCurrentDeltager(null);
      } catch (error) {
        setError(isEditing ? "Kunne ikke opdatere deltager" : "Kunne ikke oprette deltager");
      }
    }
  };

  const handleCreateNew = () => {
    setCurrentDeltager({
      id: undefined,
      navn: '',
      køn: Køn.MAND,
      alder: 0,
      klub: Klub.DEN,
      discipliner: []
    });
    setIsEditing(false);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

 const handleGenderFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Køn | '';
    setGenderFilter(value);
  };

  const handleSortOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  const filteredParticipants = deltagere
    .filter(deltager => 
      deltager.navn.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genderFilter ? deltager.køn === genderFilter : true) 
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.navn.localeCompare(b.navn);
      } else {
        return b.navn.localeCompare(a.navn);
      }
    });

  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const nuværendeDeltagere = filteredParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);

  if (loading) return <p>Loading participants...</p>;
  console.log(error)

  return (
 <div className="participants-container">
  <h2 className="participants-heading">Deltagere</h2>
  <input
    type="text"
    className="search-input"
    placeholder="Søg efter navn..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <select
    className="gender-filter"
    value={genderFilter}
    onChange={handleGenderFilterChange}
  >
    <option value="">Alle køn</option>
    <option value="MAND">MAND</option>
    <option value="KVINDE">KVINDE</option>
    <option value="ANDEN">ANDEN</option>
  </select>
  <select
    className="sort-order"
    value={sortOrder}
    onChange={handleSortOrderChange}
  >
    <option value="asc">Navn A-Z</option>
    <option value="desc">Navn Z-A</option>
  </select>
  <button className="create-button" onClick={handleCreateNew}>
    Create New Participant
  </button>
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
      {nuværendeDeltagere.map((deltager) => (
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
  <div className="pagination-buttons">
    {currentPage > 1 && (
      <button className="previous-button" onClick={handlePreviousPage}>Previous</button>
    )}
    {indexOfLastParticipant < filteredParticipants.length && (
      <button className="next-button" onClick={handleNextPage}>Next</button>
    )}
  </div>
  {(isEditing || currentDeltager) && (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? "Rediger Deltager" : "Opret Deltager"}</h3>
      <label>
        Navn:
        <input
          type="text"
          name="navn"
          value={currentDeltager?.navn || ''}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>
      <label>
        Køn:
        <select
          name="køn"
          value={currentDeltager?.køn || Køn.MAND}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value={Køn.MAND}>MAND</option>
          <option value={Køn.KVINDE}>KVINDE</option>
          <option value={Køn.ANDEN}>ANDEN</option>
        </select>
      </label>
      <label>
        Alder:
        <input
          type="number"
          name="alder"
          value={currentDeltager?.alder || 0}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>
      <label>
        Klub:
        <select
          name="klub"
          value={currentDeltager?.klub || Klub.DEN}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value={Klub.DEN}>DEN</option>
          <option value={Klub.SWE}>SWE</option>
        </select>
      </label>
      <label>
        Discipliner:
        <select
          name="discipliner"
          value={currentDeltager?.discipliner.map(d => d.disciplinNavn) || []}
          onChange={handleChange}
          multiple
          required
          className="form-select"
        >
          {availableDisciplines.map(disciplin => (
            <option key={disciplin.disciplinNavn} value={disciplin.disciplinNavn}>
              {disciplin.disciplinNavn}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="submit-button">{isEditing ? "Opdater" : "Opret"}</button>
      <button type="button" className="cancel-button" onClick={() => setCurrentDeltager(null)}>Annuller</button>
    </form>
  )}
</div>

  );
}
