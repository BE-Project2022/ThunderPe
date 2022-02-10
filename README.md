<p align="center"><img src='./client/assets/images/Logo_Yel.png'  /></p>

# ThunderPe

ThunderPe is a peer to peer decentralized transaction platform.

## Steps to Run

This project requires [NodeJS](https://nodejs.org/en/) to run.

Clone the repository with the following command:
`sh git clone https://github.com/BE-Project2022/ThunderPe.git cd ThunderPe `

- Client

  1. Navigate into the folder and install the necessary dependencies :
     ```sh
     cd client
     npm install
     ```
  2. Starting the development server :
     ```sh
     npm start
     ```

- Server:

  1. Navigate into the folder and install the necessary dependencies :
     ```sh
     cd server
     npm i
     ```
  2. Create a `.env` file in the root directory and add the following properties :
     ```env
     MONGO_URI= <-- Your MongoDB URI -->
     GOOGLE_REFRESH_TOKEN= <-- Your GOOGLE OAUTH Refresh token-->
     GOOGLE_CLIENT_ID=<-- Your GOOGLE OAUTH Client ID-->
     GOOGLE_CLIENT_SECRET=<-- Your GOOGLE OAUTH Client Secret-->
     GOOGLE_EMAIL=<-- Your GOOGLE account email-->
     REDIRECT_URI=https://developers.google.com/oauthplayground
     JWT_SECRET=<-- Your JWT secret-->
     ```
  3. Start the server :
     ```sh
     npm run dev
     ```
  4. The server should be running on port 5000. URL : [localhost:5000](http://localhost:5000)
  5. Push the server to heroku using the following command
     ```sh
     git subtree push --prefix server heroku master
     ```

---
