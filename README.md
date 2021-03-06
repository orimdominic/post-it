[![codecov](https://codecov.io/gh/sudo-kaizen/post-it/branch/main/graph/badge.svg?token=Q5ms72phQz)](https://codecov.io/gh/sudo-kaizen/post-it)

# post-it

A mini blogging app

## Prerequisites

- Yarn >= 1.x.x

- Node.js >= 14.x.x
- A Gmail account with the less secure apps option enabled for sending mails. Also make sure that unlock captcha has been disabled for the mail. [See here](https://accounts.google.com/b/0/DisplayUnlockCaptcha)

- A [Cloudinary](https://cloudinary.com/) account for accepting and storing images

- MongoDB server for storing posts. To setup MongoDB for your computer, see [Install MongoDB](https://docs.mongodb.com/guides/server/install/)

## Setup

1. Clone the repository and `cd` into the repository's folder

2. Run `yarn install` in the terminal of the repository's folder to install dependencies

3. Create a `.local.env` file to hold secret keys that will be used by the app

4. Copy the content of `.sample.env` to `.local.env` and fill the required data

5. Run `yarn create:jwtkeys` to generate JWT `.public.pem` and `.private.pem` files for JWT auth

6. Run `yarn start:dev` to start the application

7. The URL of the application's API will be displayed on your terminal.

## Documentation

The API for **Post It** was documented with Postman. [View the Post It API documentation](https://documenter.getpostman.com/view/16008266/TzXzDcNR)

## Tests

- Run unit tests with `yarn test:unit`

- Run integration tests with `yarn test:integration`
