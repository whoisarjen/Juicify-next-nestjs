import logger from '../../utils/logger'
import { Request, Response } from "express"
import { CreateDailyMeasurementInput } from "../schema/dailyMeasurement.schema"
import { changeDailyMeasurement, createDailyMeasurement, getDailyMeasurement, getDryDailyMeasurement } from "../service/dailyMeasurement.service"
import { socketHandleUserSynchronization } from '../../utils/socket'
import { connectTwoDailyMeasurements } from '../../utils/dailyMeasurement.utils'

export const createDailyMeasurementController = async (req: Request<{}, {}, CreateDailyMeasurementInput['body']>, res: Response) => {
    try {
        const responseArray = []
        for (let i = 0; i < req.body.array.length; i++) {
            try {
                const response = await getDryDailyMeasurement({
                    whenAdded: req.body.array[i].whenAdded,
                    user_ID: req.body.array[i].user_ID
                })
                
                if (response && response._id) {
                    responseArray.push(
                        (
                            await changeDailyMeasurement(
                                [
                                    await connectTwoDailyMeasurements(response, req.body.array[i])
                                ]
                            )
                        )[0]
                    )
                } else {
                    responseArray.push(
                        (
                            await createDailyMeasurement(
                                [
                                    req.body.array[i]
                                ]
                            )
                        )[0]
                    )
                }
            } catch (error: any) {
                logger.error(error)
                return res.status(409).send(error.message)
            }
        }
        await socketHandleUserSynchronization({ req, res, data: responseArray, whatToDo: 'change', where: 'daily_measurement' })
        return res.send(responseArray);
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send(error.message)
    }
}

export const changeDailyMeasurementController = async (req: Request<{}, {}, CreateDailyMeasurementInput['body']>, res: Response) => {
    try {
        const DailyMeasurements = await changeDailyMeasurement(req.body.array)
        await socketHandleUserSynchronization({ req, res, data: DailyMeasurements, whatToDo: 'change', where: 'daily_measurement' })
        return res.send(DailyMeasurements);
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send(error.message)
    }
}

export const getGuestDailyMeasurementController = async (req: Request, res: Response) => {
    try {
        if ((new Date(req.body.find).toString() === 'Invalid Date')) {
            logger.error(`getDailyMeasurementController blocked ${req.body.find}. Invalid Date`)
            return res.status(401).send(process.env.DATE_IS_REQUIRED)
        }
        const dailyMeasurement = await getDailyMeasurement({
            user_ID: res.locals.user._id,
            whenAdded: req.body.find
        })
        return res.send({ data: dailyMeasurement, user: res.locals.user });
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send(error.message)
    }
}