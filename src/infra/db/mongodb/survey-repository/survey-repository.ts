import { ObjectId } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/db-survey/add-survey-repository'
import { LoadListSurveyRepository } from '../../../../data/protocols/db/db-survey/load-survey-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { LoadSurveyById } from '../../../../domain/usecases/survey/load-survey-by-id'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadListSurveyRepository, LoadSurveyById {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadListSurvey (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const listSurvey = await surveyCollection.find({}).toArray()
    return listSurvey && MongoHelper.mapList(listSurvey)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
