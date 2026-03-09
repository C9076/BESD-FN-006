const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect

const url = 'http://localhost:3000'

chai.use(chaiHttp)



describe('Integration Test Users', () => {


// IT-1
it('GET users', async () => {

    const res = await chai.request(url).get('/users')

    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')

})


// IT-2
it('POST create user', async () => {

    const res = await chai.request(url)
        .post('/users')
        .send({
            userEmail: 'newuser@gmail.com',
            userPassword: '123456'
        })

    expect(res).to.have.status(201)
})


// IT-3
it('POST duplicate email', async () => {

    const res = await chai.request(url)
        .post('/users')
        .send({
            userEmail: 'daranporn@gmail.com',
            userPassword: '123456'
        })

    expect(res).to.have.status(409)

})


// IT-4
it('POST missing password', async () => {

    const res = await chai.request(url)
        .post('/users')
        .send({
            userEmail: 'test@gmail.com'
        })

    expect(res).to.have.status(400)

})

})