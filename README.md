# Spotify Music Finder!

## Project Overview

~~This application will take songs that you know, and find songs with the same energy in a different genre!~~

Due to the new restrictions on what is available, the scope of this project has to be reoriented. More information coming soon!

## Prerequisites

To load this application on your machine, you need to have the following technologies installed locally:

- NodeJS
- npm
- MongoDB
- Spotify account

## Getting Started

In order to get started, we need to set up a `.env` file. There will be more information about this file below. In order to do this, create that file name in your root directory, then ensure it is also added to your `.gitignore` file as well. Add your MongoURI to the `.env` file, as well as your `PORT` that you desire this application to run on.

Now, you need to run `npm install` in your terminal to get all the packages required to run this application. In order to run this app, run the command `npm start`, and go to `localhost:3000/api/spotify_app` to see a welcome message. Keep an eye on your terminal for database information as well!

Here's what you're going to need in your `.env` file:

```env
PORT=3000
MONGO_URI="mongodb://127.0.0.1:27017/spotify_app"
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/callback"
JWT_SECRET="your_jwt_secret_key"
```

### Links

- `localhost:3000/api/spotify_app` This is a healthy endpoint for sanity checks!
- `localhost:3000/login` for logging into Spotify and getting a temporary access token
- `localhost:3000/callback` This will upsert the user into MongoDB and return a signed JWT!
