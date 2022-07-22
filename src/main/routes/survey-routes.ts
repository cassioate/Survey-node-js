import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadListSurveyController } from '../factories/controllers/survey/load-list-survey/load-list-survey-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/api/survey/add', auth('admin'), adaptRoute(makeAddSurveyController()))
  router.get('/api/survey/list', auth('user'), adaptRoute(makeLoadListSurveyController()))
}
