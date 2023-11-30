import request from 'superagent'
import { Base, Glaze, SavedDonut, DonutDetails } from '../../models/donuts'
const rootUrl = '/api/v1/donuts'

// GET /api/v1/donuts/flavors
export async function fetchGlazes(): Promise<Glaze[]> {
  const dbFlavors = await request.get(`${rootUrl}/glazes`)

  return dbFlavors.body
}

// GET /api/v1/donuts/bases
export async function fetchBases(): Promise<Base[]> {
  const dbBases = await request.get(`${rootUrl}/bases`)

  return dbBases.body
}

export async function fetchBase(id: number): Promise<Base> {
  const dbBases = await request.get(`${rootUrl}/bases/${id}`)

  return dbBases.body
}

export async function fetchGlaze(id: number): Promise<Glaze> {
  const dbBases = await request.get(`${rootUrl}/glazes/${id}`)

  return dbBases.body
}
// token: string, donut: SavedDonut
export async function saveDonut(donutData: SavedDonut) {
  const savedDonut = await request
    .post(rootUrl)
    .set('Authorization', `Bearer ${donutData.token}`)
    .send({
      base: donutData.base,
      glaze: donutData.glaze,
      gold: donutData.gold,
    })
  return savedDonut.body
}

export async function fetchDonuts({
  token,
}: {
  token: string
}): Promise<DonutDetails[]> {
  const dbDonuts = await request
    .get(`${rootUrl}/me`)
    .set('Authorization', `Bearer ${token}`)

  return dbDonuts.body
}

export async function delDonut(id: number, token: string) {
  console.log(token)
  await request
    .delete(`${rootUrl}/${id}`)
    .set('Authorization', `Bearer ${token}`)
}
