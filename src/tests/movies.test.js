require('../models')
const request = require("supertest");
const app = require('../app');

const Director = require('../models/Director');
const Genre = require('../models/Genre');
const Actor = require('../models/Actor');

let movie
let actor
let director
let genre
let movieId

beforeAll(async () => {
    movie = {
        name: 'Interstellar',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Interstellar-logo.jpg/220px-Interstellar-logo.jpg',
        synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        releaseYear: '2013'
    }
    actor =  await Actor.create({
        firstName: 'Henry',
        lastName: 'Cavill',
        nationality: 'British',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Henry_Cavill_%2848417913146%29_%28cropped%29.jpg/220px-Henry_Cavill_%2848417913146%29_%28cropped%29.jpg',
        birthday: '05-May'
    })
    director = await Director.create({
        firstName: 'Michael',
        lastName: 'Bay',
        nationality: 'American',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Michael.bay.png/220px-Michael.bay.png',
        birthday: '1965-02-17'
    })
    genre = await Genre.create({
        name: 'Action'
    })
})

afterAll(async () => {
    await actor.destroy()
    await director.destroy()
    await genre.destroy()
})


const BASE_URL = ('/api/v1/movies')

test("POST -> 'BASE_URL', should return status code 201, res.body.name === movie.name", async () => {
    const res = await request(app)
        .post(BASE_URL)
        .send(movie)

    movieId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)

})

test("GET -> 'BASE_URL', should return status code 200, res.body.length === 1 and res.body[0].name === movie.name and res.body[0].length === 0", async () => {
    const res = await request(app)
        .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe(movie.name)

/*     console.log(res.body) */

    expect(res.body[0].actors).toBeDefined()
    expect(res.body[0].actors).toHaveLength(0)

    expect(res.body[0].directors).toBeDefined()
    expect(res.body[0].directors).toHaveLength(0)

    expect(res.body[0].genres).toBeDefined()
    expect(res.body[0].genres).toHaveLength(0)
})

test("PUT -> 'BASE_URL/:id', should return status code 200. res.body.name === movieUpdate.name", async () => {
    const movieUpdate = {
        name: 'Pacific Rim'
    }

    const res = await request(app)
        .put(`${BASE_URL}/${movieId}`)
        .send(movieUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movieUpdate.name)
})

test("POST -> 'BASE_URL:/id/actors', should return status code 200, res.body.length = 1, res.body[0].moviesActors.actorId === actor.id", async () => {
    const res = await request(app)
        .post(`${BASE_URL}/${movieId}/actors`)
        .send([actor.id])

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
      
    expect(res.body[0].moviesActors.actorId).toBeDefined()
    expect(res.body[0].moviesActors.actorId).toBe(actor.id)
      
    expect(res.body[0].moviesActors.movieId).toBeDefined()
    expect(res.body[0].moviesActors.movieId).toBe(movieId)
})

test("POST -> 'BASE_URL:/id/directors', should return status code 200, res.body.length = 1, res.body[0].moviesDirectors.directorId === director.id", async () => {
    const res = await request(app)
        .post(`${BASE_URL}/${movieId}/directors`)
        .send([director.id])

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toBeDefined()

    expect(res.body[0].moviesDirectors.directorId).toBeDefined()
    expect(res.body[0].moviesDirectors.directorId).toBe(director.id)
      
    expect(res.body[0].moviesDirectors.movieId).toBeDefined()
    expect(res.body[0].moviesDirectors.movieId).toBe(movieId)
})

test("POST -> 'BASE_URL:/id/genres', should return status code 200, res.body.length = 1, res.body[0].moviesGenres.genreId === genre.id", async () => {
    const res = await request(app)
        .post(`${BASE_URL}/${movieId}/genres`)
        .send([genre.id])

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toBeDefined()

    expect(res.body[0].moviesGenres.genreId).toBeDefined()
    expect(res.body[0].moviesGenres.genreId).toBe(genre.id)
      
    expect(res.body[0].moviesGenres.movieId).toBeDefined()
    expect(res.body[0].moviesGenres.movieId).toBe(movieId)
})

test("DELETE -> 'BASE_URL/:id', should return status code 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${movieId}`)

    expect(res.statusCode).toBe(204)
})

