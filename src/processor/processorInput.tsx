import jsonData from '../../data.json'
import { TemporalData } from './types'

export const processInput = (): TemporalData => {
  return jsonData as unknown as TemporalData
}