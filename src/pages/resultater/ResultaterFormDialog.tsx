import React from "react";
import { ResultatEnum } from "../../interfaces/resultatEnum";
import Deltager from "../../interfaces/deltager";
import Disciplin from "../../interfaces/disciplin";
import "../../styling/resultaterliste.css";

interface ResultaterFormDialogProps {
  deltagere: Deltager[];
  discipliner: Disciplin[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ResultaterFormDialog({
  deltagere,
  discipliner,
  handleChange,
  handleSelectChange,
  handleSubmit,
  onClose,
}: ResultaterFormDialogProps) {

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <form onSubmit={handleSubmit} className="resultater-form">
          <div>
            <label>Deltager</label>
            <select required name="deltagerId" onChange={handleSelectChange}>
              <option value="">Select a Deltager</option>
              {deltagere.map((deltager) => (
                <option key={deltager.id} value={JSON.stringify(deltager)}>
                  {deltager.navn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Disciplin</label>
            <select required name="disciplinId" onChange={handleSelectChange}>
              <option value="">Select a Disciplin</option>
              {discipliner.map((disciplin) => (
                <option key={disciplin.id} value={JSON.stringify(disciplin)}>
                  {disciplin.disciplinNavn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Resultat Enum</label>
            <select required name="resultatEnum" onChange={handleChange}>
              {Object.keys(ResultatEnum).map((key) => (
                <option key={key} value={ResultatEnum[key as keyof typeof ResultatEnum]}>
                  {ResultatEnum[key as keyof typeof ResultatEnum]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Dato</label>
            <input required type="date" name="dato" onChange={handleChange} />
          </div>
          <div>
            <label>Distance</label>
            <input type="number" name="distance" onChange={handleChange} />
          </div>
          <div>
            <label>Tid i Sekunder</label>
            <input type="number" name="tidSekunder" onChange={handleChange} />
          </div>
          <div>
            <label>Højde</label>
            <input type="number" name="højde" onChange={handleChange} />
          </div>
          <div>
            <label>Point</label>
            <input type="number" name="point" onChange={handleChange} />
          </div>
          <button type="submit">Create Resultat</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

