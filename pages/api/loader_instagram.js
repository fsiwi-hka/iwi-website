//TODO

//This script loads the latest X Instagram Postings from the Fachschaft account (using credentials from .env) to then be displayed in the frontend

import { instagram_token } from "dotenv/config";

// 1. long lived Token erzeugen (60 Tage gültig) und im Backend speichern (.env)
// 2. regelmäßig das Token erneuern
// 3. mit dem Token folgende URL fetchen:
let sfetch = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,timestamp&access_token=${instagram_token}`;

//so ähnlich müsste es aus der API ankommen (JSON Objekt)
const postings_temp = [
  { media_url: "/images/instagram/post_1.jpg" },
  { media_url: "/images/instagram/post_2.jpg" },
  { media_url: "/images/instagram/post_3.jpg" },
  { media_url: "/images/instagram/post_4.jpg" },
];

const postings_insta = []; //umwandeln in Array
postings_temp.forEach((element) => {
  postings_insta.push(element.media_url);
});

export default function handler(req, res) {
  try {
    let result = postings_insta;

    if (req.query.count) {
      const count = parseInt(req.query.count);
      result = postings_insta.slice(0, count);
    }

    res.status(200).json({
      postings: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Error", details: error.message });
  }
}
