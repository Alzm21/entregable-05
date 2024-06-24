const request = require("supertest");
const app = require('../app')

let actorId
const actor = {
    firstName: 'Jhonny',
    lastName: 'Depp',
    nationality: 'American',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Johnny_Depp_2020.jpg/220px-Johnny_Depp_2020.jpg',
    birthday: '1963-06-09'
}

const BASE_URL = ('/api/v1/actors')

test("POST -> 'BASE_URL', should return status code 201, res.body.firstName === actor.firstName", async () => {
    const res = await request(app)
    .post(BASE_URL)
    .send(actor)

    actorId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(actor.firstName)
})

test("GET -> 'BASE_URL', should return status code 200, res.body[0].firstName === actor.firstName and res.body.length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].firstName).toBe(actor.firstName)
    
})

test("PUT -> 'BASE_URL/:id', should return status code 200, res.body.firstName === actorUpdate.firstName", async () => {
    const actorUpdate = {
        firstName: 'Johnny'
    }
    
    const res = await request(app)
        .put(`${BASE_URL}/${actorId}`)
        .send(actorUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(actorUpdate.firstName)
})

test("DELETE -> 'BASE_URL/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${actorId}`)

    expect(res.statusCode).toBe(204)
})