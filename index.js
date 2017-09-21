// Init config from .env
require('dotenv/config')

const express = require('express')
const app = express()

const server = require('./server')
server.start()
