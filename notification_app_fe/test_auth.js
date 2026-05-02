import axios from 'axios';

const api = axios.create({
  baseURL: 'http://20.207.122.201/evaluation-service',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function test() {
  try {
    const authRes = await api.post('/auth', {
      email: "rk.6353@srmist.edu.in",
      name: "r.vishva kanna",
      rollNo: "ra2311026050193 ",
      accessCode: "QkbpxH",
      clientID: "8a5cc09f-5856-45fb-ad6e-ce6a9c01bc81",
      clientSecret: "egzCgCxkQdNQYaVP"
    });
    console.log("SUCCESS:", authRes.data);
  } catch (error) {
    console.error("ERROR:", error.message);
    if (error.response) console.error("DATA:", error.response.data);
  }
}
test();
