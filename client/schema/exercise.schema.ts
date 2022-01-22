import { object, string, TypeOf } from 'zod'
import errorBook from '../../server/utils/errorBook'

export const createExerciseSchema = object({
    name: string({
        required_error: errorBook['NAME IS REQUIRED']['VALUE']
    }).min(3)
})

export type CreateExerciseInput = TypeOf<typeof createExerciseSchema>