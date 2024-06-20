import Deltager from '../interfaces/deltager'
import Disciplin from '../interfaces/disciplin'
import { Resultat } from '../interfaces/resultat'
import { API_URL } from '../settings'
import { makeOptions, handleHttpErrors } from './fetchUtilities'

export async function hentDeltagere():Promise<Deltager[]> {
  const options = makeOptions('GET', null, undefined)
  return fetch(`${API_URL}/deltagere`, options).then(handleHttpErrors)
  
}

export async function opretDeltager(nyDeltager:Deltager):Promise<Deltager> {
  const options = makeOptions('POST', nyDeltager, undefined)
  return fetch(`${API_URL}/deltagere`, options).then(handleHttpErrors)
}

export async function redigerDeltager(redigeretDeltager:Deltager):Promise<Deltager> {
  if (!redigeretDeltager.id) {
    throw new Error('Deltageren skal have en id')
  }
  const options = makeOptions('PUT', redigeretDeltager, undefined)
  return fetch(`${API_URL}/deltagere/${redigeretDeltager.id}`, options).then(handleHttpErrors)
}

export async function sletDeltager(id: number): Promise<boolean> {
  const options = makeOptions('DELETE', null, undefined);
  const response = await fetch(`${API_URL}/deltagere/${id}`, options);

  if (response.ok) {
    console.log("Deltager slettet.");
    return true;
  } else {
    alert("Kan ikke slette deltager med dette id: " + id + "da de har et resultat.");
    return false;
  }
}

export async function hentDiscipliner():Promise<Disciplin[]> {
  const options = makeOptions('GET', null, undefined)
  return fetch(`${API_URL}/discipliner`, options).then(handleHttpErrors)
  
}

export async function hentResultater():Promise<Resultat[]> {
  const options = makeOptions('GET', null, undefined)
  return fetch(`${API_URL}/resultater`, options).then(handleHttpErrors)
  
}