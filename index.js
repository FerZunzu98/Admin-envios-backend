/* eslint-disable semi */
const express = require('express')
const cors = require('cors')
const app = express();
const logger = require('./loggerMiddleware')

app.use(cors())

// Esta linea configura en tu app el módulo de express json-parser que permite
// parsear el body de las peticiones Post.
// El .use significa que se ejecute con cualquier petición que llegue.
app.use(express.json())

app.use(logger)

// Esta sería una función midelware que se ejecuta con todas las peticiones
// la función next se usa para decirle que continue.
app.use((request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log('-----')
  next()
})

let envios = [
  {
    fecha: '2023-10-08',
    caja_ticket: '12-6554',
    direccion: 'Castreslos 45, 5ºB',
    cliente: 'Paco mermela',
    telefono: 685234551,
    notaManual: 652354,
    comentarios: 'Este es mi primer envio'
  }, {
    fecha: '2023-10-06',
    caja_ticket: '12-4323',
    direccion: 'Bouzas',
    cliente: 'macias pajas',
    telefono: 685232151,
    notaManual: '',
    comentarios: 'Este es mi primer envio'
  }, {
    fecha: '2023-10-04',
    caja_ticket: '12-3456',
    direccion: 'fragoso 45, 5ºB',
    cliente: 'Pablo',
    telefono: 685854551,
    notaManual: '',
    comentarios: 'Este es mi servidor'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/envios', (request, response) => {
  response.json(envios)
})

app.get('/api/envios/:id', (request, response) => {
  const id = request.params.id
  const envio = envios.find(envio => envio.fecha + envio.caja_ticket == id)

  if (envio) {
    response.send(envio)
  } else {
    response.status(404).json({
      error: 'Not found'
    })
  }
})

app.delete('/api/envios/:id', (request, response) => {
  const id = request.params.id
  envios = envios.filter(envio => envio.fecha + envio.caja_ticket != id)

  response.status(204).end()
})

app.post('/api/envios', (request, response) => {
  const envio = request.body
  console.log('Peticion post')
  console.log(envio)

  if (!envio || !envio.fecha) {
    return response.status(400).json({ error: 'note.content is missing' })
  }

  envios.push(envio);

  response.status(201).json(envios)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })
