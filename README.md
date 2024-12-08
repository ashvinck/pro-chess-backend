# Pro Chess Backend

This is the backend repository for the Pro Chess application. The backend is responsible for handling game logic, user authentication, and interaction with the MongoDB database. It provides the necessary APIs for the frontend to communicate with and manage chess games.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To set up and run the Pro Chess backend, follow these steps:

1. Clone this repository:

   ```shell
   git clone https://github.com/ashvinck/pro-chess-backend.git
   cd pro-chess-backend
   ```

2. Install Dependencies

   ```shell
   npm install
   ```

3. Configure the environment variables

   - Create a .env file in the root directory and specify the following variables:
   - MONGO_URI: MongoDB connection string
   - PORT: Port for the server to listen on

4. Start the server

   ```shell
   npm run dev
   ```

## API Endpoints

The backend provides the following endpoints:

- `/play/computer/save` : for single-player game management.

## Dependencies

The Pro Chess backend uses the following main dependencies:

- **Express.js**: Web application framework for Node.js.
- **Socket.io**: To facilitate easier communication between various clients and server.
- **Mongoose**: MongoDB object modeling tool.
- **CORS**: Middleware for handling cross-origin requests.
- **Http-Errors**: For better error handling throughout appliation.

## Contributing

I welcome contributions to the Pro Chess backend! If you have ideas for improvements, bug fixes, or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Front end Repo

The link to the [frontend repo](https://github.com/ashvinck/pro-chess) can be found here.

### New Features coming soon

- End to End encryption support and video call support for chat feature in the app.
