import Deltager from '../interfaces/deltager'
import Disciplin from '../interfaces/disciplin'
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

export async function sletDeltager(id:number):Promise<void> {
  const options = makeOptions('DELETE', null, undefined)
  return fetch(`${API_URL}/deltagere/${id}`, options).then(handleHttpErrors)
}

export async function hentDiscipliner():Promise<Disciplin[]> {
  const options = makeOptions('GET', null, undefined)
  return fetch(`${API_URL}/discipliner`, options).then(handleHttpErrors)
  
}