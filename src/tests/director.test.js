const request = require("supertest");
const app = require('../app')

const director = {
    firstName: 'Michael',
    lastName: 'Bay',
    nationality: 'American',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Michael.bay.png/220px-Michael.bay.png',
    birthday: '1965-02-17'
}

let directorId
const BASE_URL = ('/api/v1/directors')

test("POST -> 'BASE_URL', should return status code 201, res.body.firstName === director.firstName", async () => {
    const res = await request(app)
        .post(BASE_URL)
        .send(director)

    directorId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(director.firstName)
})

test("GET -> 'BASE_URL', should return status code 200, res.body[0].firstName === director.firstname and res.body.length === 1", async () => {
    const res = await request(app)    
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].firstName).toBe(director.firstName)

})

test("PUT -> 'BASE_URL/:id', should return status code 200. res.body.firstName === directorUpdate.firstName", async () => {
    const directorUpdate = {
        firstName: 'Zack'
    }

    const res = await request(app)
        .put(`${BASE_URL}/${directorId}`)
        .send(directorUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(directorUpdate.firstName)
})

test("DELETE -> 'BASE_URL/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${directorId}`)

    expect(res.statusCode).toBe(204)
})