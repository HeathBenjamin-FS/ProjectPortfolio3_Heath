# Spotify Tier List!

## Project Overview

This application will allow you to make tier lists for artists, albums, and tracks!

## Prerequisites

To load this application on your machine, you need to have the following technologies installed locally:

- NodeJS
- npm
- MongoDB
- Spotify account
- (optional) Postman or cURL for API testing
- (optional) Mongo Compass

## Getting Started

1. **Clone the repo and install the dependencies**
   - `cd ProjectPortfolio3_Heath`
   - `npm install`

2. We need to set up a `.env` file. There will be more information about this file below. In order to do this, create that file name in your root directory, then ensure it is also added to your `.gitignore` file as well. Add your MongoURI to the `.env` file, as well as your `PORT` that you desire this application to run on.

Here's what you're going to need in your `.env` file:

```env
PORT=3000
MONGO_URI="mongodb://127.0.0.1:27017/spotify_app"
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
SPOTIFY_REDIRECT_URI="http://127.0.0.1:3000/callback"
JWT_SECRET="your_jwt_secret_key"
```

## Important information

Your token will automatically be refreshed within 60 seconds of its expiration. Middleware has been written to check for this upon each request.

### Links

- `http://127.0.0.1:3000/login` for logging into Spotify and getting a temporary access token. You will automatically be redirected to `/callback` with your JWT, which is what you will use for your Bearer Token in Postman.
- `http://127.0.0.1:3000/callback` This will upsert the user into MongoDB and return a signed JWT! **IMPORTANT NOTE** Make sure that this link is the EXACT same one you set in your Spotify application upon creation. If it isn't you can change it to this if you would like to.
- `http://127.0.0.1:3000/auth/status` This endpoint will tell you if you are authenticated or not.
  - You will have either a true/false json response:

  Headers: Authorization: Bearer (insert your JWT here!)

  ```json
  {
    "authenticated": true
  }
  ```

- `http://127.0.0.1:3000/spotify/tracks` This endpoint will return data that you send to it using your JWT and a query! Here is an example line for you: - `http://127.0.0.1:3000/spotify/tracks?q=metalcore` - Run this line as a GET request in a software like Postman, and you should see something like this returned to you:

  Headers: Authorization: Bearer (insert your JWT here!)

  ```json
  {
    "success": true,
    "query": "metalcore",
    "total": 10,
    "tracks": [
      {
        "id": "3FI0iAAAjmR31xpZEwbdys",
        "name": "Circle With Me",
        "artist": "Spiritbox",
        "album": "Eternal Blue",
        "image": "https://i.scdn.co/image",
        "previewUrl": null,
        "spotifyUrl": "https://open.spotify.com/track/3FI0iAAAjmR31xpZEwbdys"
      }
    ]
  }
  ```

- The result can change based off of what you pass in the `?q=`. This endpoint utlizes Spotify's `/search` endpoint, so search anything you want!
