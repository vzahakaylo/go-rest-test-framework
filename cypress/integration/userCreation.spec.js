const request = require('supertest')
const { randomString } = require('../../../corgi-greeninstaller-tests/cypress/helpers/random')

describe('User creation:', () => {
  const emailValue = randomString(7).concat('@test.com')
  const nameValue = randomString(7).concat(' Bond')
  const genderValue = 'male'
  const statusValue = 'active'

  it('Create user', () => {
    return request(Cypress.config().baseUrl)
      .post('')
      .send({ name: nameValue, gender: genderValue, email: emailValue, status: statusValue })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${Cypress.env('authyToken')}`)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body.data.name).equal(nameValue)
        expect(response.body.data.email).equal(emailValue)
        expect(response.body.data.gender).equal(genderValue)
        expect(response.body.data.status).equal(statusValue)

        const userId = response.body.data.id
        cy.task('pushValue', { name: 'userId', value: userId })
      })
  })

  it('Get user details', () => {
    cy.task('getValue', 'userId').then((userId) => {
      return request(Cypress.config().baseUrl)
        .get(`/${userId}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${Cypress.env('authyToken')}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.data.name).equal(nameValue)
          expect(response.body.data.email).equal(emailValue)
          expect(response.body.data.gender).equal(genderValue)
          expect(response.body.data.status).equal(statusValue)
        })
    })
  })
})
