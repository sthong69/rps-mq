# CALC : Final project (RPS-MQ) - Thong Sylvain

This repository contains the frontend and backend part of a Rock Paper Scissors game which uses RabbitMQ in order to create, join, update games.

## Installation (to be simplified)

Beforehand, it is mandatory to have RabbitMQ running. As instance, you could run it in a docker container on the standard port with its web GUI :

```bash
sudo docker run --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

NB: If you choose to run it on a different port number, you will need to make sure that both the frontend and backend are able to reach it (Making the port number editable with a .env file is a TODO).

Afterwards, clone the repository:

```bash
git clone https://github.com/sthong69/rps-mq
cd rps-mq
```

Then, install the dependencies for both the frontend and the backend. Now is also a good time to start the server handling the state.

```bash
cd client
npm install
```

```bash
cd server
npm install
npm run server
```

Finally, you can run the frontend in dev mod from the client directory:

```bash
cd client
npm run dev
```

The frontend should be live on `http://localhost:3000/`.

## Dependencies

The list of dependencies/packages is described in the `package.json` files. The major packages used in the project are:

- `react`, `react-dom` and `nextjs` for the front-end (dev mode, build, routing/API...)
- `tailwindcss` for the CSS
- `amqplib` for communicating with RabbitMQ
- `shadcn` as a base to build the component library
- `eslint` and `prettier` for the code quality

## To-do list

- **Simplifying the installation/running process**
- **Implements unit tests** for all the public methods.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

MIT License

Copyright (c) [2024] [CALC : Final project (RPS-MQ) - Thong Sylvain]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
